import { site } from '@/config/site';
import { readJSON, writeJSON } from './storage';

/**
 * Çerez onayı + Google Consent Mode v2.
 * - AdSense ve GA kimliği boşsa hiçbir şey yüklenmez, banner da gösterilmez.
 * - GA4 onaydan bağımsız yüklenir (ilk etkileşimde ya da 8 sn sonra; Lighthouse ölçümünü etkilemez); onay yoksa
 *   Consent Mode gereği çerez yazmaz, yalnız çerezsiz anonim sayım gönderir. SPA sayfa geçişlerini GA4'ün
 *   geliştirilmiş ölçümü (tarayıcı geçmişi olayları) kendisi sayar.
 * - Kullanıcı seçim yapana kadar reklam betiği YÜKLENMEZ.
 * - "Kabul" → kişiselleştirilmiş reklam; "Reddet" → consent mode 'denied' ile çerezsiz/sınırlı reklam.
 * - AB/EEA/UK trafiği için AdSense > Gizlilik ve mesajlaşma'dan Google sertifikalı CMP (GDPR mesajı)
 *   açılmalıdır; o mesaj bu betikle birlikte otomatik gelir (README > AdSense).
 */
export type Consent = 'granted' | 'denied';
const KEY = 'ng-consent';
const listeners = new Set<(c: Consent) => void>();

export const adsEnabled = site.adsenseClient.length > 0;
export const gaEnabled = site.gaId.length > 0;
/** Çerez bandı ve Consent Mode varsayılanı gerekiyor mu */
export const consentNeeded = adsEnabled || gaEnabled;

export function getConsent(): Consent | null {
  return readJSON<Consent | null>(KEY, null);
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    adsbygoogle?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

// gtag.js yalnız `arguments` nesnesini komut olarak işler; dizi push'u (rest parametresi) sessizce yok sayılır.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function gtag(..._args: unknown[]) {
  window.dataLayer = window.dataLayer || [];
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
}

let scriptLoaded = false;
function loadAdsense() {
  if (!adsEnabled || scriptLoaded) return;
  scriptLoaded = true;
  const s = document.createElement('script');
  s.async = true;
  s.crossOrigin = 'anonymous';
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${site.adsenseClient}`;
  document.head.appendChild(s);
}

let gaLoaded = false;
function loadAnalytics() {
  if (!gaEnabled || gaLoaded) return;
  gaLoaded = true;
  gtag('js', new Date());
  gtag('config', site.gaId, { anonymize_ip: true });
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(site.gaId)}`;
  document.head.appendChild(s);
}

/** GA'yı kritik yoldan çıkar: ilk kullanıcı etkileşiminde ya da 8 sn sonra yükle. */
function scheduleAnalytics() {
  if (!gaEnabled) return;
  const events = ['pointerdown', 'keydown', 'touchstart', 'scroll'] as const;
  const go = () => {
    events.forEach((e) => window.removeEventListener(e, go));
    loadAnalytics();
  };
  events.forEach((e) => window.addEventListener(e, go, { once: true, passive: true }));
  window.setTimeout(go, 8000);
}

export function setConsent(c: Consent) {
  writeJSON(KEY, c);
  const v = c === 'granted' ? 'granted' : 'denied';
  gtag('consent', 'update', { ad_storage: v, ad_user_data: v, ad_personalization: v, analytics_storage: v });
  loadAdsense();
  listeners.forEach((l) => l(c));
}

/** Sayfa açılışında: daha önce seçim yapıldıysa betiği yükle. */
export function initConsent() {
  if (!consentNeeded) return;
  scheduleAnalytics();
  const c = getConsent();
  if (c) {
    const v = c === 'granted' ? 'granted' : 'denied';
    gtag('consent', 'update', { ad_storage: v, ad_user_data: v, ad_personalization: v, analytics_storage: v });
    loadAdsense();
  }
}

export function onConsent(cb: (c: Consent) => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** <head> içine (reklam ya da analitik açıksa) gömülen varsayılan: her şey reddedilmiş. */
export const consentDefaultScript = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});`;
