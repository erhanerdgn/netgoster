/**
 * KDV oranları (yüzde). Kaynak: 3065 sayılı KDV Kanunu md. 28 — Cumhurbaşkanına verilen yetkiyle belirlenir.
 * Sıra: [indirimli (I) sayılı liste, indirimli (II) sayılı liste, genel oran].
 * Yeni bir oran kararı yayımlanırsa diziye yeni dönem eklenir; hesaplama işlem tarihine göre seçer.
 */
import type { Series } from './period.ts';

export const kdvOranlari: Series<number[]> = [
  {
    from: '2023-07-10',
    value: [1, 10, 20],
    source:
      '7346 sayılı Cumhurbaşkanı Kararı, RG 07.07.2023/32241 (yürürlük 10.07.2023) — https://www.resmigazete.gov.tr/eskiler/2023/07/20230707-11.pdf ; işlenmiş metin: https://www.alomaliye.com/2023/07/07/katma-deger-vergisi-oranlari-karar-sayisi-7346/ (Kasım 2026 itibarıyla oranları değiştiren yeni karar yok)',
  },
];
