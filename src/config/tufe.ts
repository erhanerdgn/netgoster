/**
 * TÜİK Tüketici Fiyat Endeksi — aylık veri. HER AY (TÜİK bülteni, ayın 3'ü civarı) yeni satır ekleyin.
 * Ocak 2026'dan itibaren baz yılı 2025=100. Değerler yüzde.
 * Kira artışında üst sınır: TBK md. 344 — bir önceki kira yılında TÜFE'nin 12 aylık ortalamalara göre değişimi.
 * (Konut kirasındaki %25 sınırı 01.07.2024'te sona erdi.)
 * Kaynak: TÜİK bültenleri (https://veriportali.tuik.gov.tr) — aktarım: alomaliye.com aylık enflasyon sayfaları,
 * iç tutarlılık kontrolü yapıldı. // TODO: DOĞRULA (TÜİK portalından birebir)
 */
export interface TufeAy {
  /** YYYY-MM */
  ay: string;
  aylik: number;
  yillik: number;
  /** 12 aylık ortalamalara göre değişim (kira artış sınırı) */
  ortalama12: number;
}

export const tufe: TufeAy[] = [
  { ay: '2024-01', aylik: 6.7, yillik: 64.86, ortalama12: 54.72 },
  { ay: '2024-02', aylik: 4.53, yillik: 67.07, ortalama12: 55.91 },
  { ay: '2024-03', aylik: 3.16, yillik: 68.5, ortalama12: 57.5 },
  { ay: '2024-04', aylik: 3.18, yillik: 69.8, ortalama12: 59.64 },
  { ay: '2024-05', aylik: 3.37, yillik: 75.45, ortalama12: 62.51 },
  { ay: '2024-06', aylik: 1.64, yillik: 71.6, ortalama12: 65.07 },
  { ay: '2024-07', aylik: 3.23, yillik: 61.78, ortalama12: 65.93 },
  { ay: '2024-08', aylik: 2.47, yillik: 51.97, ortalama12: 64.91 },
  { ay: '2024-09', aylik: 2.97, yillik: 49.38, ortalama12: 63.47 },
  { ay: '2024-10', aylik: 2.88, yillik: 48.58, ortalama12: 62.02 },
  { ay: '2024-11', aylik: 2.24, yillik: 47.09, ortalama12: 60.45 },
  { ay: '2024-12', aylik: 1.03, yillik: 44.38, ortalama12: 58.51 },
  { ay: '2025-01', aylik: 5.03, yillik: 42.12, ortalama12: 56.35 },
  { ay: '2025-02', aylik: 2.27, yillik: 39.05, ortalama12: 53.83 },
  { ay: '2025-03', aylik: 2.46, yillik: 38.1, ortalama12: 51.26 },
  { ay: '2025-04', aylik: 3.0, yillik: 37.86, ortalama12: 48.73 },
  { ay: '2025-05', aylik: 1.53, yillik: 35.41, ortalama12: 45.8 },
  { ay: '2025-06', aylik: 1.37, yillik: 35.05, ortalama12: 43.23 },
  { ay: '2025-07', aylik: 2.06, yillik: 33.52, ortalama12: 41.13 },
  { ay: '2025-08', aylik: 2.04, yillik: 32.95, ortalama12: 39.62 },
  { ay: '2025-09', aylik: 3.23, yillik: 33.29, ortalama12: 38.36 },
  { ay: '2025-10', aylik: 2.55, yillik: 32.87, ortalama12: 37.15 },
  { ay: '2025-11', aylik: 0.87, yillik: 31.07, ortalama12: 35.91 },
  { ay: '2025-12', aylik: 0.89, yillik: 30.89, ortalama12: 34.88 },
  { ay: '2026-01', aylik: 4.84, yillik: 30.65, ortalama12: 33.98 },
  { ay: '2026-02', aylik: 2.96, yillik: 31.53, ortalama12: 33.39 },
  { ay: '2026-03', aylik: 1.94, yillik: 30.87, ortalama12: 32.82 },
  { ay: '2026-04', aylik: 4.18, yillik: 32.37, ortalama12: 32.43 },
  { ay: '2026-05', aylik: 1.71, yillik: 32.61, ortalama12: 32.24 },
  { ay: '2026-06', aylik: 0.99, yillik: 32.11, ortalama12: 32.03 },
  { ay: '2026-07', aylik: 1.78, yillik: 31.75, ortalama12: 31.9 }, // TODO: DOĞRULA (bir haberde 31,28)
  { ay: '2026-08', aylik: 1.84, yillik: 31.51, ortalama12: 31.79 },
  { ay: '2026-09', aylik: 1.84, yillik: 29.73, ortalama12: 31.49 },
  { ay: '2026-10', aylik: 2.58, yillik: 29.77, ortalama12: 31.23 },
];

/** Konut kirasında %25 sınırı (TBK geçici, 7409 ve 7456 s. K.) — bu aralıkta yenilenen sözleşmeler */
export const kira25Siniri = { from: '2022-06-11', to: '2024-07-01', oran: 25 };
