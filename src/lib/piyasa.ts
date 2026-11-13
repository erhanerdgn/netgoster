/*
 * Canlı piyasa verisi — Binance genel piyasa API'si (anahtarsız, belgelenmiş, ücretsiz).
 *
 * Neden Binance: Türkiye'de canlı döviz/altın yayınlayan resmî kurum yok — TCMB günde bir kez
 * gösterge kur ilan eder (bkz. /api/kurlar). Canlı kur gösteren siteler bankaların ya da
 * Kapalıçarşı firmalarının kotasyonunu satın alır. Binance'te gördüğümüz rakam ise kotasyon
 * değil GERÇEKLEŞMİŞ işlem fiyatıdır ve emir defteri herkese açıktır; ücretsiz kaynaklar
 * içinde doğrulanabilirliği en yüksek olanı budur.
 *
 * Akış: önce tek REST isteğiyle ilk değerler (sayfa açılır açılmaz dolu gelsin), ardından
 * websocket devralır. Bağlantı koparsa artan gecikmeyle yeniden bağlanır.
 *
 * SSG notu: burada `window`/`WebSocket` yok — modül prerender sırasında da import edilebilir;
 * ağa yalnız `piyasayaBaglan()` çağrılınca çıkılır (bileşen useEffect içinde çağırır).
 */

const REST = 'https://api.binance.com/api/v3';
const WS = 'wss://stream.binance.com:9443/stream';

/** Bir ons kaç gram (troy ons) — gram altın PAXG fiyatından bununla bulunur. */
export const ONS_GRAM = 31.1034768;

export interface Gosterge {
  /** Kart/bar etiketi */
  ad: string;
  /** Binance sembolü */
  sembol: string;
  /** Gösterilecek ondalık basamak */
  basamak: number;
  /** Değerin para birimi — hepsi TRY paritesinden ya da TRY'ye çevrilerek geliyor */
  birim: string;
  /** Sembolün ham fiyatını gösterilecek değere çevirir (çapraz kur, ons→gram vb.) */
  cevir?: (ham: number, fiyatlar: Record<string, Fiyat>) => number;
  /**
   * Çapraz kurlu göstergede geçmiş serinin çarpanı (Euro için USDTRY).
   * GEÇMİŞ GRAFİK İÇİN ŞART: her noktayı o günün dolar kuruyla çarpmak gerekir.
   * Bugünün kuruyla çarpmak 1 yıllık grafiği yanlış gösterir — liranın değer kaybı
   * silinir, grafik düz çıkar.
   */
  carpanSembol?: string;
  /** Göstergenin kendi serisini ekrandaki değere çeviren sabit katsayı (ons→gram gibi). */
  katsayi?: number;
}

export interface Fiyat {
  /** Son işlem fiyatı */
  son: number;
  /** 24 saatlik yüzde değişim */
  degisim: number;
}

/**
 * Bardaki göstergeler. Hepsinin paritesi Binance'te likit:
 * USDTTRY ve BTCTRY günlük milyarlarca TL hacim görür, EURUSDT 25 binin üzerinde işlem.
 * EURTRY paritesi Binance'te YOKTUR; Euro çapraz kurdan (EUR/USD × USD/TRY) bulunur.
 * GBPUSDT paritesi ölü olduğu için (24 saatte tek hane işlem) sterlin buraya alınmadı;
 * sterlin ve diğer kurlar TCMB bülteninden geliyor.
 */
export const GOSTERGELER: Gosterge[] = [
  { ad: 'Dolar', sembol: 'USDTTRY', basamak: 4, birim: '₺' },
  {
    ad: 'Euro',
    sembol: 'EURUSDT',
    basamak: 4,
    birim: '₺',
    cevir: (ham, f) => ham * (f.USDTTRY?.son ?? 0),
    carpanSembol: 'USDTTRY',
  },
  { ad: 'Bitcoin', sembol: 'BTCTRY', basamak: 0, birim: '₺' },
  { ad: 'Ethereum', sembol: 'ETHTRY', basamak: 0, birim: '₺' },
  {
    ad: 'Gram Altın',
    sembol: 'PAXGTRY',
    basamak: 2,
    birim: '₺',
    cevir: (ham) => ham / ONS_GRAM,
    katsayi: 1 / ONS_GRAM,
  },
];

const SEMBOLLER = GOSTERGELER.map((g) => g.sembol);

/** Göstergenin ekranda görünecek değeri; kaynak fiyat yoksa undefined. */
export function degerBul(g: Gosterge, fiyatlar: Record<string, Fiyat>): number | undefined {
  const f = fiyatlar[g.sembol];
  if (!f) return undefined;
  const v = g.cevir ? g.cevir(f.son, fiyatlar) : f.son;
  return Number.isFinite(v) && v > 0 ? v : undefined;
}

type Dinleyici = (fiyatlar: Record<string, Fiyat>) => void;

/**
 * İlk değerleri REST'ten alır, sonra websocket'e geçer. Dönen fonksiyon bağlantıyı kapatır.
 * Ağ hatalarında sessiz kalır — bar veri gelmezse kendini gizler, sayfa etkilenmez.
 */
export function piyasayaBaglan(bildir: Dinleyici): () => void {
  const fiyatlar: Record<string, Fiyat> = {};
  let kapandi = false;
  let ws: WebSocket | undefined;
  let deneme = 0;
  let zamanlayici: ReturnType<typeof setTimeout> | undefined;

  const yaz = (sembol: string, son: number, degisim: number) => {
    if (!Number.isFinite(son) || son <= 0) return;
    fiyatlar[sembol] = { son, degisim };
  };

  // 1) Tek istekle ilk tablo — websocket'in ilk tikini beklemeden rakamlar dolu gelir.
  const sorgu = encodeURIComponent(JSON.stringify(SEMBOLLER));
  fetch(`${REST}/ticker/24hr?symbols=${sorgu}`)
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
    .then((satirlar: { symbol: string; lastPrice: string; priceChangePercent: string }[]) => {
      if (kapandi) return;
      for (const s of satirlar) yaz(s.symbol, Number(s.lastPrice), Number(s.priceChangePercent));
      bildir({ ...fiyatlar });
    })
    .catch(() => undefined);

  // 2) Canlı akış.
  const bagla = () => {
    if (kapandi) return;
    ws = new WebSocket(`${WS}?streams=${SEMBOLLER.map((s) => `${s.toLowerCase()}@ticker`).join('/')}`);

    ws.onopen = () => (deneme = 0);

    ws.onmessage = (e) => {
      try {
        const d = (JSON.parse(e.data as string) as { data?: { s: string; c: string; P: string } }).data;
        if (!d) return;
        yaz(d.s, Number(d.c), Number(d.P));
        bildir({ ...fiyatlar });
      } catch {
        /* bozuk kare — yoksay */
      }
    };

    // Binance 24 saatte bir bağlantıyı kapatır; artan gecikmeyle (en fazla 30 sn) yeniden bağlan.
    ws.onclose = () => {
      if (kapandi) return;
      const gecikme = Math.min(1000 * 2 ** deneme++, 30_000);
      zamanlayici = setTimeout(bagla, gecikme);
    };

    ws.onerror = () => ws?.close();
  };

  bagla();

  return () => {
    kapandi = true;
    if (zamanlayici) clearTimeout(zamanlayici);
    if (ws) {
      ws.onclose = null;
      ws.close();
    }
  };
}

/** Son 24 saatin saatlik kapanışları — bardaki mini grafik için. Hata olursa boş dizi. */
export async function gecmisGetir(sembol: string): Promise<number[]> {
  return (await mumGetir(sembol, '1h', 24)).map((m) => m.kapanis);
}

export interface Mum {
  /** Mumun açılış anı (ms) */
  zaman: number;
  kapanis: number;
}

/** Binance kline → {zaman, kapanis}. Hata olursa boş dizi; çağıran yeri boş grafik çizer. */
async function mumGetir(sembol: string, aralik: string, adet: number): Promise<Mum[]> {
  try {
    const r = await fetch(`${REST}/klines?symbol=${sembol}&interval=${aralik}&limit=${adet}`);
    if (!r.ok) return [];
    return ((await r.json()) as unknown[][])
      .map((m) => ({ zaman: Number(m[0]), kapanis: Number(m[4]) }))
      .filter((m) => Number.isFinite(m.kapanis) && m.kapanis > 0);
  } catch {
    return [];
  }
}

/** Detay penceresindeki zaman aralıkları. */
export const ARALIKLAR = [
  { ad: '1 Gün', mum: '1h', adet: 24 },
  { ad: '1 Hafta', mum: '4h', adet: 42 },
  { ad: '1 Ay', mum: '1d', adet: 30 },
  { ad: '1 Yıl', mum: '1w', adet: 52 },
] as const;

export type Aralik = (typeof ARALIKLAR)[number]['ad'];

/**
 * Göstergenin seçilen aralıktaki serisi — EKRANDAKİ birimde (TL).
 * Çapraz kurluysa (Euro) iki seri aynı zaman damgalarında çarpılır; sabit katsayılıysa
 * (gram altın) katsayıyla ölçeklenir. Böylece grafik, bardaki rakamla aynı birimde olur.
 */
export async function serisiGetir(g: Gosterge, aralik: Aralik): Promise<Mum[]> {
  const a = ARALIKLAR.find((x) => x.ad === aralik) ?? ARALIKLAR[0];
  const kendi = await mumGetir(g.sembol, a.mum, a.adet);

  if (g.katsayi) return kendi.map((m) => ({ ...m, kapanis: m.kapanis * g.katsayi! }));

  if (g.carpanSembol) {
    const carpan = await mumGetir(g.carpanSembol, a.mum, a.adet);
    const tablo = new Map(carpan.map((m) => [m.zaman, m.kapanis]));
    return kendi.map((m) => ({ ...m, kapanis: m.kapanis * (tablo.get(m.zaman) ?? 0) })).filter((m) => m.kapanis > 0);
  }

  return kendi;
}

export interface Detay {
  acilis: number;
  enYuksek: number;
  enDusuk: number;
  alis: number;
  satis: number;
  hacimTl: number;
  islemSayisi: number;
}

/** Gün içi değerler — detay penceresinin üst tablosu. Alınamazsa undefined. */
export async function detayGetir(sembol: string): Promise<Detay | undefined> {
  try {
    const r = await fetch(`${REST}/ticker/24hr?symbol=${sembol}`);
    if (!r.ok) return undefined;
    const d = (await r.json()) as Record<string, string>;
    return {
      acilis: Number(d.openPrice),
      enYuksek: Number(d.highPrice),
      enDusuk: Number(d.lowPrice),
      alis: Number(d.bidPrice),
      satis: Number(d.askPrice),
      hacimTl: Number(d.quoteVolume),
      islemSayisi: Number(d.count),
    };
  } catch {
    return undefined;
  }
}
