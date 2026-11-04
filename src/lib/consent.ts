import { site } from '@/config/site';
import { readJSON, writeJSON } from './storage';

/**
 * Çerez onayı + Google Consent Mode v2.
 * - AdSense kimliği boşsa hiçbir şey yüklenmez, banner da gösterilmez.
 * - Kullanıcı seçim yapana kadar reklam betiği YÜKLENMEZ.
 * - "Kabul" → kişiselleştirilmiş reklam; "Reddet" → consent mode 'denied' ile çerezsiz/sınırlı reklam.
 * - AB/EEA/UK trafiği için AdSense > Gizlilik ve mesajlaşma'dan Google sertifikalı CMP (GDPR mesajı)
 *   açılmalıdır; o mesaj bu betikle birlikte otomatik gelir (README > AdSense).
 */
export type Consent = 'granted' | 'denied';
const KEY = 'ng-consent';
const listeners = new Set<(c: Consent) => void>();

export const adsEnabled = site.adsenseClient.length > 0;

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

function gtag(...args: unknown[]) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(args);
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

export function setConsent(c: Consent) {
  writeJSON(KEY, c);
  const v = c === 'granted' ? 'granted' : 'denied';
  gtag('consent', 'update', { ad_storage: v, ad_user_data: v, ad_personalization: v, analytics_storage: v });
  loadAdsense();
  listeners.forEach((l) => l(c));
}

/** Sayfa açılışında: daha önce seçim yapıldıysa betiği yükle. */
export function initConsent() {
  if (!adsEnabled) return;
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

/** <head> içine (yalnız reklam açıksa) gömülen varsayılan: her şey reddedilmiş. */
export const consentDefaultScript = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});`;
