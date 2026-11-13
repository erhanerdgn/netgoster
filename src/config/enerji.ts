/**
 * Konut elektrik ve doğal gaz tarifeleri (tarihli seriler; hesaplamalar işlem tarihine göre dönemi seçer).
 *
 * ELEKTRİK — EPDK "Elektrik Faturalarına Esas Tarife Tabloları", alçak gerilim (AG) tek terimli mesken, vergiler hariç, kr/kWh.
 *   Tablolar: https://www.epdk.gov.tr/Detay/Icerik/3-1327/elektrik-tarifeleri (her dönemin Excel tablosu ve kurul kararı).
 *   Tek zamanlı tarifede faturaya esas günlük ortalama 8 kWh'ye kadar düşük, aşan kısmına yüksek kademe enerji bedeli uygulanır
 *   (tablo dipnotu). Çok zamanlı tarifede kademe yoktur. Dağıtım bedeli tüm kWh'ye aynıdır.
 *   Vergiler: elektrik ve havagazı tüketim vergisi (belediye, 2464 s. K. md. 34-35) mesken %5 — yalnız ENERJİ bedeli üzerinden;
 *   KDV mesken %10 (CK 5249, RG 01.03.2022 ile %8; CK 7346, RG 07.07.2023 ile 10.07.2023'ten itibaren %10) — enerji + dağıtım +
 *   tüketim vergisi toplamı üzerinden. TRT payı (%2) ve enerji fonu, 7346 s. Kanun (RG 25.12.2021/31700) ile kaldırıldı.
 *   Sağlama: EPDK'nın 04.04.2026 duyurusundaki "100 kWh tüketen mesken abonesi 323,8 TL öder" rakamı bu formülle birebir çıkar:
 *   (49,4065 + 242,49 + 49,4065 × %5) × 1,10 = 323,80 TL.
 *
 * DOĞAL GAZ — İstanbul (İGDAŞ) konut, TL/Sm³, KDV hariç bileşenler: BOTAŞ toptan satış fiyatı + ÖTV + İGDAŞ sistem kullanım
 *   bedeli (SKB, aylık güncellenir). KDV %20 (genel oran; İzgaz tarife sayfasında KDV dahil/hariç fiyat oranı 1,20).
 *   Değerler İGDAŞ "Perakende Satış Fiyatları" sayfasının veri servisinden (https://www.igdas.istanbul/musteri-hizmetleri/
 *   fiyat-tarifeleri/perakende-satis-fiyatlari) ay ay alındı; BOTAŞ fiyatı BOTAŞ tarifesiyle karşılaştırıldı. Diğer illerde
 *   SKB (ve dolayısıyla son fiyat) biraz farklıdır.
 *   Faturalar kWh ile kesilir: Sm³ = sayaç m³ × hacim düzeltme katsayısı (k); kWh = Sm³ × üst ısıl değer (ÜID, aylık).
 *   TL/kWh fiyatı = TL/Sm³ fiyatı / 10,64 (BOTAŞ tarifesindeki TL/Sm³ – TL/kWh karşılığı).
 */
import type { Series } from './period.ts';

const EPDK_TARIFE = 'https://www.epdk.gov.tr/Detay/Icerik/3-1327/elektrik-tarifeleri';

/** AG tek terimli mesken, vergiler hariç, kr/kWh */
export interface ElektrikTarife {
  /** Tek zamanlı enerji bedeli — günlük ortalama `kademeGunluk` kWh'ye kadar */
  tekDusuk: number;
  /** Tek zamanlı enerji bedeli — limiti aşan kısım */
  tekYuksek: number;
  /** Üç zamanlı enerji bedelleri (gündüz 06-17, puant 17-22, gece 22-06) */
  gunduz: number;
  puant: number;
  gece: number;
  /** Dağıtım bedeli (her kWh) */
  dagitim: number;
  /** Düşük kademe sınırı, kWh/gün */
  kademeGunluk: number;
}

export const elektrikMesken: Series<ElektrikTarife> = [
  {
    from: '2024-07-01',
    to: '2025-04-04',
    value: {
      tekDusuk: 49.4065,
      tekYuksek: 139.1181,
      gunduz: 142.6273,
      puant: 270.4077,
      gece: 40.4418,
      dagitim: 136.5179,
      kademeGunluk: 8,
    },
    source: `EPDK 27.06.2024 tarih ve 12719 sayılı Kurul Kararı (RG 29.06.2024/32587) tarife tablosu — ${EPDK_TARIFE}`,
    verified: true,
  },
  {
    from: '2025-04-05',
    to: '2026-04-03',
    value: {
      tekDusuk: 49.4065,
      tekYuksek: 161.546,
      gunduz: 165.9325,
      puant: 325.658,
      gece: 38.2006,
      dagitim: 183.6166,
      kademeGunluk: 8,
    },
    source: `EPDK 27.03.2025 tarih ve 13426 sayılı Kurul Kararı (RG 05.04.2025/32861) tarife tablosu — ${EPDK_TARIFE}`,
    verified: true,
  },
  {
    from: '2026-04-04',
    value: {
      tekDusuk: 49.4065,
      tekYuksek: 189.5808,
      gunduz: 195.064,
      puant: 374.7551,
      gece: 51.3656,
      dagitim: 242.49,
      kademeGunluk: 8,
    },
    source: `EPDK 02.04.2026 tarih ve 14461 sayılı Kurul Kararı (RG 04.04.2026/33214) tarife tablosu — ${EPDK_TARIFE}`,
    verified: true,
  },
];

/** Mesken elektrik faturasındaki vergiler (oran) */
export const elektrikVergi: Series<{ tuketimVergisi: number; kdv: number }> = [
  {
    from: '2023-07-10',
    value: { tuketimVergisi: 0.05, kdv: 0.1 },
    source:
      '2464 s. Belediye Gelirleri Kanunu md. 35 (mesken %5); CK 7346 (RG 07.07.2023) ile (II) sayılı listedeki mesken elektriği KDV %10. EPDK 04.04.2026 duyurusu (100 kWh = 323,8 TL) ile sağlandı.',
    verified: true,
  },
];

/**
 * Son kaynak tedarik (SKTT) yıllık tüketim limiti, mesken, kWh/yıl. Önceki yıl tüketimi bu limiti aşan meskenlere enerji
 * bedeli düzenlenmiş tarifeden değil, piyasa fiyatına dayalı son kaynak tedarik tarifesinden uygulanır (dağıtım bedeli aynı).
 */
export const skttMeskenLimit: Series<number> = [
  {
    from: '2025-01-01',
    value: 5000,
    source:
      'EPDK Son Kaynak Tedarik Tarifesi kararı; haberler (bloomberght.com, 31.10.2025 ve 31.10.2026) 2025 limitini 5.000 kWh olarak aktarıyor',
    verified: false, // TODO: DOĞRULA — resmi karar metni görülmedi, yalnız haber kaynakları
  },
  {
    from: '2026-01-01',
    value: 4000,
    source:
      'EPDK 30.10.2025 Kurul Kararı (RG 31.10.2025) — https://www.ekonomigazetesi.com/ekonomi/son-kaynak-tedarik-tarifesi-limitinde-degisiklik-63383',
    verified: true,
  },
  {
    from: '2027-01-01',
    value: 3000,
    source:
      'EPDK Kurul Kararı (RG 31.10.2026) — https://www.bloomberght.com/epdk-meskenlere-yonelik-elektrik-tuketim-limitinde-degisiklige-gitti-3792986',
    verified: true,
  },
];

// ─── Doğal gaz ───

/** BOTAŞ toptan satış fiyatından TL/kWh karşılığına geçiş: 10,625 TL/Sm³ = 0,99859023 TL/kWh → 10,64 kWh/Sm³ */
export const BOTAS_KWH_SM3 = 10.64;

/**
 * İGDAŞ'ın 2026'da (Ocak–Ekim) yayımladığı aylık üst ısıl değer aralığı, kWh/Sm³ (Avrupa ve Anadolu yakası birlikte).
 * Kaynak: İGDAŞ "Hacim Düzeltme K Sayısı ve Üst Isıl Değer" sayfasının veri servisi.
 */
export const IGDAS_UID_2026 = { min: 10.92, max: 11.08 };

const BOTAS_TARIFE = 'https://www.botas.gov.tr/Sayfa/satis-fiyat-tarifesi/439';
const IGDAS_FIYAT = 'https://www.igdas.istanbul/musteri-hizmetleri/fiyat-tarifeleri/perakende-satis-fiyatlari';

/** BOTAŞ konut toptan satış fiyatı, TL/Sm³ (KDV ve ÖTV hariç). k2: kademe-2 (4 Nisan 2026'dan önce tek fiyat) */
export const botasKonut: Series<{ k1: number; k2: number }> = [
  {
    from: '2025-01-01',
    value: { k1: 5.631275, k2: 5.631275 },
    source: `İGDAŞ perakende satış fiyatları (Ocak–Haziran 2025 alış fiyatı) — ${IGDAS_FIYAT}`,
    verified: true,
  },
  {
    from: '2025-07-02',
    value: { k1: 7.771789, k2: 7.771789 },
    source: `BOTAŞ 2 Temmuz 2025 tarifesi; İGDAŞ perakende satış fiyatları (02.07.2025'ten itibaren) — ${IGDAS_FIYAT}`,
    verified: true,
  },
  {
    from: '2026-04-04',
    value: { k1: 10.625, k2: 18 },
    source: `BOTAŞ 4 Nisan 2026 Doğal Gaz Toptan Satış Fiyat Tarifesi — ${BOTAS_TARIFE}`,
    verified: true,
  },
];

/** Doğal gaz ÖTV (maktu), TL/Sm³ */
export const dogalgazOtv: Series<number> = [
  { from: '2025-01-01', value: 0.1187, source: IGDAS_FIYAT, verified: true },
  { from: '2025-07-03', value: 0.1373, source: IGDAS_FIYAT, verified: true },
  { from: '2025-12-31', value: 0.1468, source: `${IGDAS_FIYAT} ; İzgaz satış tarifeleri aynı ÖTV'yi gösteriyor`, verified: true },
];

/** İGDAŞ konut sistem kullanım bedeli (yıllık 0–100.000 Sm³ kademesi), TL/Sm³, aylık */
const skb: [string, number][] = [
  ['2025-01', 1.307064],
  ['2025-02', 1.320527],
  ['2025-03', 1.38695],
  ['2025-04', 1.782808],
  ['2025-05', 1.826665],
  ['2025-06', 1.881465],
  ['2025-07', 1.910251],
  ['2025-08', 1.936421],
  ['2025-09', 1.976311],
  ['2025-10', 2.016628],
  ['2025-11', 2.081765],
  ['2025-12', 2.13485],
  ['2026-01', 2.153423],
  ['2026-02', 2.172588],
  ['2026-03', 2.277741],
  ['2026-04', 2.68513],
  ['2026-05', 2.737222],
  ['2026-06', 2.851638],
  ['2026-07', 2.900401],
  ['2026-08', 2.929115],
  ['2026-09', 2.981253],
  ['2026-10', 3.036108],
  ['2026-11', 3.091972],
];
export const igdasSkb: Series<number> = skb.map(([ay, value]) => ({
  from: `${ay}-01`,
  value,
  source: IGDAS_FIYAT,
  verified: true,
}));

/** Doğal gaz KDV oranı (konut) */
export const dogalgazKdv: Series<number> = [
  {
    from: '2023-07-10',
    value: 0.2,
    source:
      'KDV genel oranı %20 (CK 7346, RG 07.07.2023); İzgaz konut satış tarifesinde KDV dahil = KDV hariç × 1,20 — https://online.izgaz.com.tr/evsel/satis-tarifeleri',
    verified: true,
  },
];

/**
 * İstanbul konut kademeli fiyat uygulaması aylık tüketim limiti, Sm³/ay (BOTAŞ, il ve ay bazında; EPDK'nın 5 yıllık ortalama
 * tüketiminin %75 fazlası). Limit aşılırsa o ayın TÜM tüketimi Kademe-2 fiyatından faturalanır. 4 Nisan 2026 öncesi kademe yok.
 */
export const istanbulKademeLimit: Series<number | null> = [
  {
    from: '2025-01-01',
    value: null,
    source: 'Kademeli fiyat uygulaması 4 Nisan 2026 gaz günü başladı (BOTAŞ KFU Esasları md. 1)',
    verified: true,
  },
  ...(
    [
      ['2026-04-04', 192.55],
      ['2026-05-01', 119.96],
      ['2026-06-01', 45.45],
      ['2026-07-01', 31.1],
      ['2026-08-01', 26.72],
      ['2026-09-01', 29.23],
    ] as const
  ).map(([from, value]) => ({
    from,
    value,
    source: 'İkincil kaynak: https://www.nortekenerji.com.tr/blog/istanbul-dogalgaz-kademe-limitleri',
    verified: false, // TODO: DOĞRULA — BOTAŞ'ın o aylara ait limit tablosu artık yayında değil
  })),
  {
    from: '2026-10-01',
    value: 43.73,
    source: 'İGDAŞ Kademeli Tarife sayfası — https://www.igdas.istanbul/musteri-hizmetleri/fiyat-tarifeleri/kademeli-tarife',
    verified: true,
  },
  {
    from: '2026-11-01',
    value: 136.01,
    source:
      'BOTAŞ aylık tüketim limitleri (Kasım–Aralık 2026) — https://www.botas.gov.tr/uploads/dosyaYoneticisi/188939-aylik-tuketim-limitleri1.pdf',
    verified: true,
  },
  {
    from: '2026-12-01',
    value: 259.35,
    source:
      'BOTAŞ aylık tüketim limitleri (Kasım–Aralık 2026) — https://www.botas.gov.tr/uploads/dosyaYoneticisi/188939-aylik-tuketim-limitleri1.pdf',
    verified: true,
  },
];
