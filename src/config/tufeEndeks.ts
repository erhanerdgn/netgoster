/**
 * TÜİK Tüketici Fiyat Endeksi (TÜFE) — aylık GENEL endeks, Ocak 2003'ten son yayımlanan aya kadar tek zincir.
 *
 * Baz değişikliği ve zincirleme yöntemi:
 * - 2003–2025: TÜİK'in 2003=100 bazlı resmi endeksi (2 ondalık, TÜİK tablosundaki gibi).
 * - Ocak 2026'dan itibaren TÜİK yalnız 2025=100 bazlı endeksi yayımlar. TÜİK'e göre yeni endeks eski serinin
 *   2025 yılı ortalamasına normalize edilmiştir; aylık/yıllık değişim oranları değişmez. Bu nedenle 2026+ ayları
 *   resmi 2025=100 değerleriyle saklanır ve 2003=100 ölçeğine BAGLAMA = (2025'in 12 aylık 2003=100 ortalaması) / 100
 *   ile taşınır. (TÜİK'in geriye dönük 2025=100 serisi ile 2003=100 serisinin oranı tüm aylarda 31,8314–31,8335;
 *   fark yalnız 2 ondalığa yuvarlamadan.)
 *
 * Doğrulama (src/calculators/enflasyon.test.ts):
 * - 2024-01 … son ay: zincirden çıkan aylık ve yıllık % değişim, src/config/tufe.ts'deki açıklanan oranlarla ±0,05 puan.
 * - 2003-02 … 2025-04: aylık ve yıllık % değişimler, OECD/FRED serisiyle (TURCPIALLMINMEI, 2015=100, TÜİK kaynaklı)
 *   0,0001 puandan yakın eşleşti (bir kerelik karşılaştırma, test dışı).
 * - Ocak–Ekim 2026: aylık, yıllık ve "Aralık 2025'e göre" (Ekim 2026: %27,52) oranları TÜİK bülteniyle tutarlı.
 * - DİKKAT: 2003 ve 2004 yıllarında TÜİK'in o dönemde açıkladığı oranlar 1994=100 serisinden hesaplanmıştı; 2003=100
 *   serisinden çıkan oran küçük farklar gösterebilir (ör. Aralık 2004 yıllık: açıklanan %9,32, bu seri %9,35).
 *
 * HER AY (TÜİK bülteni, ayın 3'ü civarı) ENDEKS_2025 son satırına yeni ayın 2025=100 değerini ekleyin
 * (yeni yılda yeni satır açın) ve src/config/tufe.ts'yi de güncelleyin.
 */

export const tufeEndeksKaynak = {
  source:
    'TÜİK Tüketici Fiyat Endeksi (2003=100 ve 2025=100) — https://veriportali.tuik.gov.tr ; aktarım: https://www.hakedis.org/endeksler/tuketici-fiyat-genel-endeksi-ve-degisim-oranlari-2003 ve …-2025 ; çapraz kontrol: https://fred.stlouisfed.org/series/TURCPIALLMINMEI',
  verified: true,
};

/** 2003=100 bazlı resmi endeks, yıl → [Ocak … Aralık] */
const ENDEKS_2003: Record<number, number[]> = {
  2003: [94.77, 96.23, 98.12, 99.09, 100.04, 100.12, 99.93, 100.09, 101.44, 102.38, 103.68, 104.12],
  2004: [104.81, 105.35, 106.36, 106.89, 107.35, 107.21, 107.72, 108.54, 109.57, 112.03, 113.5, 113.86],
  2005: [114.49, 114.51, 114.81, 115.63, 116.69, 116.81, 116.14, 117.13, 118.33, 120.45, 122.14, 122.65],
  2006: [123.57, 123.84, 124.18, 125.84, 128.2, 128.63, 129.72, 129.15, 130.81, 132.47, 134.18, 134.49],
  2007: [135.84, 136.42, 137.67, 139.33, 140.03, 139.69, 138.67, 138.7, 140.13, 142.67, 145.45, 145.77],
  2008: [146.94, 148.84, 150.27, 152.79, 155.07, 154.51, 155.4, 155.02, 155.72, 159.77, 161.1, 160.44],
  2009: [160.9, 160.35, 162.12, 162.15, 163.19, 163.37, 163.78, 163.29, 163.93, 167.88, 170.01, 170.91],
  2010: [174.07, 176.59, 177.62, 178.68, 178.04, 177.04, 176.19, 176.9, 179.07, 182.35, 182.4, 181.85],
  2011: [182.6, 183.93, 184.7, 186.3, 190.81, 188.08, 187.31, 188.67, 190.09, 196.31, 199.7, 200.85],
  2012: [201.98, 203.12, 203.96, 207.05, 206.61, 204.76, 204.29, 205.43, 207.55, 211.62, 212.42, 213.23],
  2013: [216.74, 217.39, 218.83, 219.75, 220.07, 221.75, 222.44, 222.21, 223.91, 227.94, 227.96, 229.01],
  2014: [233.54, 234.54, 237.18, 240.37, 241.32, 242.07, 243.17, 243.4, 243.74, 248.37, 248.82, 247.72],
  2015: [250.45, 252.24, 255.23, 259.39, 260.85, 259.51, 259.74, 260.78, 263.11, 267.2, 268.98, 269.54],
  2016: [274.44, 274.38, 274.27, 276.42, 278.02, 279.33, 282.58, 281.76, 282.27, 286.33, 287.81, 292.54],
  2017: [299.74, 302.17, 305.24, 309.23, 310.61, 309.78, 310.24, 311.85, 313.88, 320.4, 325.18, 327.41],
  2018: [330.75, 333.17, 336.48, 342.78, 348.34, 357.44, 359.41, 367.66, 390.84, 401.27, 395.48, 393.88],
  2019: [398.07, 398.71, 402.81, 409.63, 413.52, 413.63, 419.24, 422.84, 427.04, 435.59, 437.25, 440.5],
  2020: [446.45, 448.02, 450.58, 454.43, 460.62, 465.84, 468.56, 472.61, 477.21, 487.38, 498.58, 504.81],
  2021: [513.3, 517.96, 523.53, 532.32, 537.05, 547.48, 557.36, 563.6, 570.66, 584.32, 604.84, 686.95],
  2022: [763.23, 799.93, 843.64, 904.79, 931.76, 977.9, 1001.03, 1015.65, 1046.89, 1084, 1115.26, 1128.45],
  2023: [1203.48, 1241.33, 1269.75, 1300.04, 1300.6, 1351.59, 1479.84, 1614.31, 1691.04, 1749.11, 1806.5, 1859.38],
  2024: [1984.02, 2073.88, 2139.47, 2207.5, 2281.85, 2319.29, 2394.1, 2453.34, 2526.16, 2598.91, 2657.23, 2684.55],
  2025: [2819.65, 2883.75, 2954.69, 3043.23, 3089.74, 3132.17, 3196.66, 3261.72, 3367.22, 3453.09, 3482.96, 3513.87],
};

/** 2025=100 bazlı resmi endeks (Ocak 2026'dan itibaren), yıl → [Ocak … son yayımlanan ay] */
const ENDEKS_2025: Record<number, number[]> = {
  2026: [115.73, 119.16, 121.47, 126.55, 128.72, 129.99, 132.31, 134.75, 137.23, 140.77],
};

/** 2025=100 → 2003=100 bağlama katsayısı: 2025 yılı 2003=100 endeks ortalaması / 100 */
export const BAGLAMA = ENDEKS_2003[2025].reduce((a, b) => a + b, 0) / 12 / 100;

export interface EndeksAy {
  /** YYYY-MM */
  ay: string;
  /** 2003=100 ölçeğinde zincirlenmiş endeks */
  endeks: number;
}

const ayKodu = (y: number, i: number) => `${y}-${String(i + 1).padStart(2, '0')}`;

/** Ocak 2003'ten son yayımlanan aya kadar, ay sıralı tek seri (2003=100 ölçeği) */
export const tufeEndeks: EndeksAy[] = [
  ...Object.entries(ENDEKS_2003).flatMap(([y, d]) => d.map((endeks, i) => ({ ay: ayKodu(+y, i), endeks }))),
  ...Object.entries(ENDEKS_2025).flatMap(([y, d]) => d.map((e, i) => ({ ay: ayKodu(+y, i), endeks: e * BAGLAMA }))),
];

export const ILK_AY = tufeEndeks[0].ay;
export const SON_AY = tufeEndeks[tufeEndeks.length - 1].ay;

const harita = new Map(tufeEndeks.map((e) => [e.ay, e.endeks]));

/** Ayın (YYYY-MM) zincirlenmiş endeksi; seri dışındaysa undefined */
export const endeksAt = (ay: string): number | undefined => harita.get(ay);
