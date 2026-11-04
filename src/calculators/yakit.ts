import { z } from 'zod';
import { round2, zMoney, zNumber } from './common.ts';

export const yakitSchema = z.object({
  mesafe: zNumber('Mesafe', { min: 0.1, max: 100000 }),
  tuketim: zNumber('100 km’deki tüketim', { min: 0.1, max: 100 }),
  fiyat: zMoney('Yakıt fiyatı', { min: 0.01, max: 100000 }),
  gidisDonus: z.boolean().default(false),
  kisi: zNumber('Kişi sayısı', { min: 1, max: 100, int: true }).default(1),
});

export type YakitInput = z.input<typeof yakitSchema>;

export interface YakitResult {
  toplamKm: number;
  litre: number;
  tutar: number;
  kmBasi: number;
  kisiBasi: number;
}

/**
 * Yakıt maliyeti: toplam km = mesafe × (gidiş-dönüş ? 2 : 1); litre = km × tüketim / 100; tutar = litre × fiyat.
 * Tutar yuvarlanmamış litreden hesaplanır (ara yuvarlama hatası olmasın).
 */
export function calculateYakit(input: z.output<typeof yakitSchema>): YakitResult {
  const toplamKm = input.mesafe * (input.gidisDonus ? 2 : 1);
  const litre = (toplamKm * input.tuketim) / 100;
  const tutar = round2(litre * input.fiyat);
  return {
    toplamKm: round2(toplamKm),
    litre: round2(litre),
    tutar,
    kmBasi: round2(tutar / toplamKm),
    kisiBasi: round2(tutar / input.kisi),
  };
}
