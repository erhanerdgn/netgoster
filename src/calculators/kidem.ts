import { z } from 'zod';
import { kidemTavani, damgaVergisiUcret } from '../config/parameters-2026.ts';
import { periodAt, valueAt } from '../config/period.ts';
import { addDays, dayNumber, round2, ymdDiff, zDate, zMoney } from './common.ts';

export const kidemSchema = z
  .object({
    giris: zDate('İşe giriş tarihi'),
    cikis: zDate('İşten çıkış tarihi'),
    brut: zMoney('Brüt maaş', { min: 1 }),
    yanHaklar: zMoney('Yan haklar').default(0),
  })
  .refine((v) => v.cikis > v.giris, { path: ['cikis'], message: 'Çıkış tarihi giriş tarihinden sonra olmalı' });

export type KidemInput = z.input<typeof kidemSchema>;

export interface KidemResult {
  sure: { years: number; months: number; days: number };
  toplamGun: number;
  hakVar: boolean;
  giydirilmis: number;
  tavan: number;
  tavanDonemi: { from: string; to?: string };
  tavanUygulandi: boolean;
  esasUcret: number;
  brut: number;
  damga: number;
  net: number;
  yillikTutar: number;
}

/**
 * Kıdem tazminatı (1475 s. K. md. 14 — yürürlükteki madde):
 * - En az 1 yıl kıdem şartı. Çıkış tarihi (son çalışılan gün) süreye dahildir.
 * - Esas ücret = giydirilmiş brüt (maaş + düzenli yan haklar), fesih tarihindeki tavanla sınırlı.
 * - Tazminat = esas × (yıl + ay/12 + gün/365). Gelir vergisinden istisna (GVK 25/7), yalnız damga vergisi kesilir.
 */
export function calculateKidem(input: z.output<typeof kidemSchema>): KidemResult {
  const sure = ymdDiff(input.giris, addDays(input.cikis, 1));
  const toplamGun = dayNumber(input.cikis) - dayNumber(input.giris) + 1;
  const giydirilmis = round2(input.brut + (input.yanHaklar ?? 0));
  const tp = periodAt(kidemTavani, input.cikis);
  const tavanUygulandi = giydirilmis > tp.value;
  const esasUcret = Math.min(giydirilmis, tp.value);
  const hakVar = sure.years >= 1;
  const brut = hakVar ? round2(esasUcret * (sure.years + sure.months / 12 + sure.days / 365)) : 0;
  const damga = round2(brut * valueAt(damgaVergisiUcret, input.cikis));
  return {
    sure,
    toplamGun,
    hakVar,
    giydirilmis,
    tavan: tp.value,
    tavanDonemi: { from: tp.from, to: tp.to },
    tavanUygulandi,
    esasUcret,
    brut,
    damga,
    net: round2(brut - damga),
    yillikTutar: esasUcret,
  };
}
