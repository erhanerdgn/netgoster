/**
 * Site geneli ayarlar — ad, alan adı, reklam ve doğrulama kimlikleri TEK yerden yönetilir.
 * Reklam ve doğrulama kimlikleri `.env` dosyasından (VITE_*) DERLEME anında okunur; şablon: `.env.example`.
 * Worker ve Vite config da bu dosyayı içe aktarır; orada import.meta.env yoktur → boş değer kullanılır.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const env: Record<string, string | undefined> = (import.meta as any).env ?? {};
const e = (key: string) => (env[key] ?? '').trim();

export const site = {
  name: 'NetGöster',
  domain: 'netgoster.com',
  url: 'https://netgoster.com',
  tagline: 'Hızlı, doğru ve güncel hesaplama araçları',
  description:
    'Maaş, tazminat, kredi, vergi, sınav puanı ve sağlık hesaplamaları: güncel 2026 parametreleriyle hızlı, ücretsiz ve mobil uyumlu hesaplama araçları.',
  email: 'iletisim@netgoster.com',
  locale: 'tr-TR',
  themeColor: '#1663a3',
  /** Google AdSense yayıncı kimliği (ca-pub-XXXXXXXXXXXXXXXX). Boşsa HİÇBİR reklam kodu yüklenmez. */
  adsenseClient: e('VITE_ADSENSE_CLIENT'),
  /**
   * Reklam birimi (slot) kimlikleri — AdSense > Reklamlar > Reklam birimine göre > Görüntülü (duyarlı).
   * Boş bırakılan birim çizilmez. Yerleşim (araç sayfası): sonucun altı → içerik arası (1–2) → masaüstü kenar
   * çubuğu (yapışkan) → sayfa sonu. Ana sayfa/kategori: bölümler arası. Form ile sonuç arasında ASLA reklam yok.
   */
  adSlots: {
    /** Sonuç kartının / ödeme tablosunun hemen altı (en yüksek görünürlük) */
    result: e('VITE_AD_SLOT_RESULT'),
    /** İçerik ortası (makale içi) */
    content: e('VITE_AD_SLOT_CONTENT'),
    /** Uzun içerikte ikinci içerik arası */
    content2: e('VITE_AD_SLOT_CONTENT2'),
    /** Masaüstü sağ kenar çubuğu, içindekilerin altında yapışkan 300×600 */
    sidebar: e('VITE_AD_SLOT_SIDEBAR'),
    /** Sayfa sonu (ilgili hesaplamalardan önce) */
    footer: e('VITE_AD_SLOT_FOOTER'),
    /** Ana sayfa ve kategori sayfaları bölüm arası */
    list: e('VITE_AD_SLOT_LIST'),
  },
  /** Google Search Console HTML etiketi doğrulama kodu (content="..." değeri). */
  searchConsoleVerification: e('VITE_GSC_VERIFICATION'),
  /** Bing Webmaster doğrulama kodu (isteğe bağlı). */
  bingVerification: e('VITE_BING_VERIFICATION'),
} as const;

export type SiteConfig = typeof site;
