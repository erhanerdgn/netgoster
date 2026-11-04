import { z } from 'zod';
import { round2, zMoney, zNumber } from './common.ts';

const oran = (label: string) => zNumber(label, { max: 100 });

const fiyatSchema = z.object({
  mod: z.literal('fiyat'),
  fiyat: zMoney('Etiket fiyatı', { min: 0.01 }),
  oran: oran('İndirim oranı'),
});
const oranSchema = z.object({
  mod: z.literal('oran'),
  fiyat: zMoney('Eski fiyat', { min: 0.01 }),
  yeni: zMoney('İndirimli fiyat'),
});
const ardisikSchema = z.object({
  mod: z.literal('ardisik'),
  fiyat: zMoney('Etiket fiyatı', { min: 0.01 }),
  oran: oran('1. indirim'),
  oran2: oran('2. indirim'),
  oran3: oran('3. indirim').default(0),
});

const union = z.discriminatedUnion('mod', [fiyatSchema, oranSchema, ardisikSchema]);
export type IndirimValues = z.output<typeof union>;
/** Formun tüm alanları; şema yalnız seçili modun alanlarını doğrular. */
export interface IndirimInput {
  mod: IndirimValues['mod'];
  fiyat?: number;
  oran?: number;
  oran2?: number;
  oran3?: number;
  yeni?: number;
}
export const indirimSchema = union as unknown as z.ZodType<IndirimValues, IndirimInput>;

export interface IndirimAdim {
  oran: number;
  once: number;
  indirim: number;
  sonra: number;
}

export interface IndirimResult {
  mod: IndirimValues['mod'];
  fiyat: number;
  indirimli: number;
  indirim: number;
  /** Etkin (toplam) indirim oranı, yüzde birimiyle */
  oran: number;
  /** ardisik: oranların basit toplamı (yanlış ama yaygın beklenti) */
  basitToplam?: number;
  adimlar?: IndirimAdim[];
}

/**
 * İndirimli fiyat = fiyat × (1 − r). Ardışık indirimlerde her oran bir önceki indirimli fiyata uygulanır:
 * etkin oran = 1 − Π(1 − rᵢ). Örn. %30 + %20 = 1 − 0,7 × 0,8 = %44 (≠ %50).
 */
export function calculateIndirim(v: IndirimValues): IndirimResult {
  if (v.mod === 'oran') {
    const indirim = round2(v.fiyat - v.yeni);
    return { mod: v.mod, fiyat: v.fiyat, indirimli: v.yeni, indirim, oran: (indirim / v.fiyat) * 100 };
  }
  const oranlar = v.mod === 'fiyat' ? [v.oran] : [v.oran, v.oran2, v.oran3].filter((r) => r > 0);
  const adimlar: IndirimAdim[] = [];
  let once = v.fiyat;
  for (const r of oranlar) {
    const sonra = round2(once * (1 - r / 100));
    adimlar.push({ oran: r, once, indirim: round2(once - sonra), sonra });
    once = sonra;
  }
  const carpan = oranlar.reduce((p, r) => p * (1 - r / 100), 1);
  return {
    mod: v.mod,
    fiyat: v.fiyat,
    indirimli: once,
    indirim: round2(v.fiyat - once),
    oran: Number(((1 - carpan) * 100).toPrecision(12)),
    ...(v.mod === 'ardisik' && { basitToplam: oranlar.reduce((s, r) => s + r, 0), adimlar }),
  };
}
