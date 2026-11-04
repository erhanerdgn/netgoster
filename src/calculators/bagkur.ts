import { z } from 'zod';
import { bagkur, sgkTabanTavan } from '../config/parameters-2026.ts';
import { periodAt, todayISO, valueAt } from '../config/period.ts';
import { round2, zMoney } from './common.ts';

const fmt = (n: number) => n.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ₺';

export const bagkurSchema = z
  .object({
    kazanc: zMoney('Prime esas kazanç', { min: 1 }),
    /** Prim borcu yoksa Hazine 5 puanlık indirimi karşılar */
    indirim: z.boolean().default(true),
  })
  .superRefine((v, ctx) => {
    const { taban, tavan } = valueAt(sgkTabanTavan, todayISO());
    if (v.kazanc < taban || v.kazanc > tavan)
      ctx.addIssue({
        code: 'custom',
        path: ['kazanc'],
        message: `Prime esas kazanç asgari (${fmt(taban)}) ile azami (${fmt(tavan)}) arasında olmalı`,
      });
  });

export type BagkurInput = z.input<typeof bagkurSchema>;

export interface BagkurResult {
  kazanc: number;
  taban: number;
  tavan: number;
  oran: number;
  indirimliOran: number;
  aylikIndirimsiz: number;
  aylikIndirimli: number;
  yillikIndirimsiz: number;
  yillikIndirimli: number;
  aylikFark: number;
  yillikFark: number;
  /** Seçilen duruma (indirimli/indirimsiz) göre */
  aylik: number;
  yillik: number;
  donem: { from: string; to?: string };
}

/**
 * 4/b (Bağkur) prim: prime esas kazanç (PEK, sgkTabanTavan alt–üst sınırı içinde) × prim oranı.
 * Borcu olmayan sigortalıya 5 puan Hazine indirimi (5510 md. 81/i) → indirimli oran.
 * Yıllık = aylık × 12 (yıl boyunca aynı PEK varsayımı).
 */
export function calculateBagkur(input: z.output<typeof bagkurSchema>, tarih = todayISO()): BagkurResult {
  const p = periodAt(sgkTabanTavan, tarih);
  const { oran, indirimliOran } = valueAt(bagkur, tarih);
  const aylikIndirimsiz = round2(input.kazanc * oran);
  const aylikIndirimli = round2(input.kazanc * indirimliOran);
  const yillikIndirimsiz = round2(aylikIndirimsiz * 12);
  const yillikIndirimli = round2(aylikIndirimli * 12);
  const aylik = input.indirim ? aylikIndirimli : aylikIndirimsiz;
  return {
    kazanc: input.kazanc,
    taban: p.value.taban,
    tavan: p.value.tavan,
    oran,
    indirimliOran,
    aylikIndirimsiz,
    aylikIndirimli,
    yillikIndirimsiz,
    yillikIndirimli,
    aylikFark: round2(aylikIndirimsiz - aylikIndirimli),
    yillikFark: round2(yillikIndirimsiz - yillikIndirimli),
    aylik,
    yillik: round2(aylik * 12),
    donem: { from: p.from, to: p.to },
  };
}
