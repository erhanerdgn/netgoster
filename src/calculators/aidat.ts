import { z } from 'zod';
import { zMoney, zNumber } from './common.ts';

const zKalem = z.object({
  ad: z.string().max(60).default(''),
  tutar: zMoney('Kalem tutarı').optional(),
});

const zDaire = z.object({
  ad: z.string().max(40).default(''),
  arsaPayi: zNumber('Arsa payı', { min: 0, max: 1e9 }).optional(),
  m2: zNumber('Alan', { min: 0, max: 1e6 }).optional(),
});

export const aidatSchema = z
  .object({
    giderModu: z.enum(['toplam', 'kalem']),
    toplamGider: zMoney('Toplam aylık gider', { min: 0.01 }).optional(),
    kalemler: z.array(zKalem).max(50).default([]),
    yontem: z.enum(['esit', 'arsa', 'm2']),
    daireler: z.array(zDaire).min(1, 'En az bir daire ekleyin').max(500),
  })
  .superRefine((v, ctx) => {
    if (v.giderModu === 'toplam' && v.toplamGider === undefined)
      ctx.addIssue({ code: 'custom', path: ['toplamGider'], message: 'Toplam aylık gideri girin' });
    if (v.giderModu === 'kalem' && !(v.kalemler.reduce((s, k) => s + (k.tutar ?? 0), 0) > 0))
      ctx.addIssue({ code: 'custom', path: ['kalemler'], message: 'En az bir gider kalemi tutarı girin' });
    if (v.yontem === 'esit') return;
    const key = v.yontem === 'arsa' ? 'arsaPayi' : 'm2';
    const label = v.yontem === 'arsa' ? 'Arsa payını' : 'Alanı (m²)';
    v.daireler.forEach((d, i) => {
      if (!d[key]) ctx.addIssue({ code: 'custom', path: ['daireler', i, key], message: `${label} girin` });
    });
  });

export type AidatInput = z.input<typeof aidatSchema>;

export interface AidatSatir {
  ad: string;
  /** Paylaştırma oranı (0–1) */
  oran: number;
  aylik: number;
  yillik: number;
  /** Yuvarlama artığı bu daireye eklendiyse kuruş cinsinden fark (+/−) */
  artikKurus: number;
}

export interface AidatResult {
  toplamAylik: number;
  toplamYillik: number;
  satirlar: AidatSatir[];
  /** Yuvarlama artığının eklendiği dairenin sırası (yoksa -1) */
  artikDaire: number;
}

/**
 * Aidat paylaştırma (634 s. KMK md. 20: aksi kararlaştırılmadıkça genel giderler arsa payı oranında,
 * kapıcı/kaloriferci/bahçıvan/bekçi giderleri eşit).
 * Kuruş tutarlılığı: her pay kuruşa yuvarlanır; toplamla aradaki fark (yuvarlama artığı) en büyük paya,
 * eşitlikte listedeki SON daireye eklenir. Böylece daire aidatlarının toplamı gidere birebir eşittir.
 */
export function calculateAidat(input: z.output<typeof aidatSchema>): AidatResult {
  const kurusOf = (n = 0) => Math.round(n * 100);
  const toplamKurus =
    input.giderModu === 'toplam' ? kurusOf(input.toplamGider) : input.kalemler.reduce((s, k) => s + kurusOf(k.tutar), 0);
  const w = input.daireler.map((d) => (input.yontem === 'esit' ? 1 : ((input.yontem === 'arsa' ? d.arsaPayi : d.m2) ?? 0)));
  const W = w.reduce((s, x) => s + x, 0);
  if (!(W > 0)) throw new Error('Paylaştırma ağırlıkları toplamı sıfır');
  const kurus = w.map((x) => Math.round((toplamKurus * x) / W));
  const fark = toplamKurus - kurus.reduce((s, x) => s + x, 0);
  let artikDaire = -1;
  if (fark !== 0) {
    artikDaire = 0;
    w.forEach((x, i) => {
      if (x >= w[artikDaire]) artikDaire = i;
    });
    kurus[artikDaire] += fark;
  }
  return {
    toplamAylik: toplamKurus / 100,
    toplamYillik: (toplamKurus * 12) / 100,
    artikDaire,
    satirlar: input.daireler.map((d, i) => ({
      ad: d.ad.trim() || `Daire ${i + 1}`,
      oran: w[i] / W,
      aylik: kurus[i] / 100,
      yillik: (kurus[i] * 12) / 100,
      artikKurus: i === artikDaire ? fark : 0,
    })),
  };
}
