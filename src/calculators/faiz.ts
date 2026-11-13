import { z } from 'zod';
import { round2, zMoney, zNumber } from './common.ts';

export type FaizDonem = 'yillik' | 'aylik' | 'gunluk';
/** Bileşik dönem sayısı (yılda); TL hesaplarında yıl 365 gün */
export const DONEM_SAYISI: Record<FaizDonem, number> = { yillik: 1, aylik: 12, gunluk: 365 };
const YIL_KARSILIGI = { gun: 365, ay: 12, yil: 1 } as const;
const SURE_SINIRI = { gun: 36500, ay: 1200, yil: 100 } as const;

export const faizSchema = z
  .object({
    /** faiz: vade sonu tutarı; sure: hedefe ulaşma süresi; oran: hedef için gereken yıllık oran */
    mod: z.enum(['faiz', 'sure', 'oran']),
    tur: z.enum(['basit', 'bilesik']),
    donem: z.enum(['yillik', 'aylik', 'gunluk']),
    anapara: zMoney('Anapara', { min: 1 }),
    /** Yıllık nominal faiz oranı, yüzde */
    oran: zNumber('Yıllık faiz oranı', { max: 500 }).optional(),
    sure: zNumber('Süre', { max: 36500 }).optional(),
    sureBirim: z.enum(['gun', 'ay', 'yil']),
    hedef: zMoney('Hedef tutar').optional(),
  })
  .refine((v) => v.mod === 'oran' || v.oran !== undefined, { path: ['oran'], message: 'Yıllık faiz oranı girin' })
  .refine((v) => v.mod !== 'sure' || (v.oran ?? 0) > 0, {
    path: ['oran'],
    message: 'Süre hesabı için faiz oranı sıfırdan büyük olmalı',
  })
  .refine((v) => v.mod === 'sure' || (v.sure ?? 0) > 0, { path: ['sure'], message: 'Süre girin' })
  .refine((v) => v.mod === 'sure' || (v.sure ?? 0) <= SURE_SINIRI[v.sureBirim], {
    path: ['sure'],
    message: 'Süre en fazla 100 yıl olabilir',
  })
  .refine((v) => v.mod === 'faiz' || (v.hedef ?? 0) > v.anapara, {
    path: ['hedef'],
    message: 'Hedef tutar anaparadan büyük olmalı',
  });

export type FaizInput = z.input<typeof faizSchema>;
export type FaizValues = z.output<typeof faizSchema>;

export interface FaizResult {
  /** Yıllık nominal oran, yüzde (oran modunda bulunan oran) */
  oran: number;
  /** Süre, yıl (süre modunda bulunan süre) */
  yil: number;
  vadeSonu: number;
  faiz: number;
  /** Efektif yıllık faiz: (vade sonu / anapara)^(1 / yıl) − 1 — ondalık */
  efektif: number;
  /** Paranın ikiye katlanma süresi, yıl (oran 0 ise undefined) */
  ikiKat?: number;
  /** 72 kuralıyla yaklaşık ikiye katlanma süresi = 72 / yıllık oran (yıl) */
  kural72?: number;
}

/** Büyüme çarpanı: basit 1 + r·t; bileşik (1 + r/m)^(m·t) (kesirli dönemde üs kesirli) */
export function carpan(tur: 'basit' | 'bilesik', r: number, t: number, m: number): number {
  return tur === 'basit' ? 1 + r * t : (1 + r / m) ** (m * t);
}

export function calculateFaiz(v: FaizValues): FaizResult {
  const m = DONEM_SAYISI[v.donem];
  let r = (v.oran ?? 0) / 100;
  let t = (v.sure ?? 0) / YIL_KARSILIGI[v.sureBirim];
  if (v.mod !== 'faiz') {
    const k = v.hedef! / v.anapara;
    if (v.mod === 'sure') t = v.tur === 'basit' ? (k - 1) / r : Math.log(k) / (m * Math.log(1 + r / m));
    else r = v.tur === 'basit' ? (k - 1) / t : m * (k ** (1 / (m * t)) - 1);
  }
  const g = carpan(v.tur, r, t, m);
  const vadeSonu = v.mod === 'faiz' ? round2(v.anapara * g) : v.hedef!;
  // Basit faizde kazanç doğrusal: 1 / r yılda anapara kadar faiz birikir
  const ikiKat = r > 0 ? (v.tur === 'basit' ? 1 / r : Math.log(2) / (m * Math.log(1 + r / m))) : undefined;
  return {
    oran: r * 100,
    yil: t,
    vadeSonu,
    faiz: round2(vadeSonu - v.anapara),
    efektif: g ** (1 / t) - 1,
    ikiKat,
    kural72: r > 0 ? 72 / (r * 100) : undefined,
  };
}
