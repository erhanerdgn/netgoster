import { z } from 'zod';
import { damgaVergisiUcret, isKanunu } from '../config/parameters-2026.ts';
import { valueAt } from '../config/period.ts';
import { gelirVergisiFarki, kurus } from './bordro.ts';
import { addDays, ymdDiff, zDate, zMoney } from './common.ts';

export const ihbarSchema = z
  .object({
    giris: zDate('İşe giriş tarihi'),
    cikis: zDate('İşten çıkış tarihi'),
    brut: zMoney('Brüt maaş', { min: 1 }),
    yanHaklar: zMoney('Yan haklar').default(0),
    kumMatrah: zMoney('Kümülatif vergi matrahı').default(0),
  })
  .refine((v) => v.cikis > v.giris, { path: ['cikis'], message: 'Çıkış tarihi giriş tarihinden sonra olmalı' });

export type IhbarInput = z.input<typeof ihbarSchema>;

/** Kıdeme (tam ay) göre İK md. 17 ihbar süresi (hafta) */
export function ihbarHaftasi(kidemAy: number): number {
  return isKanunu.ihbarSureleri.find((s) => kidemAy < s.maxAy)!.hafta;
}

/**
 * İhbar tazminatı (4857 md. 17): ihbar süresine ait giydirilmiş ücret.
 * Brüt = giydirilmiş aylık / 30 × hafta × 7. SGK primi kesilmez (5510 md. 80), gelir vergisine tabidir:
 * vergi, yılın kümülatif matrahının üzerine eklenerek bulunur; ayrıca damga vergisi.
 * Asgari ücret istisnası aynı ayın maaşında kullanıldığı varsayılır (ihbara uygulanmaz).
 */
export function calculateIhbar(input: z.output<typeof ihbarSchema>) {
  const sure = ymdDiff(input.giris, addDays(input.cikis, 1));
  const kidemAy = sure.years * 12 + sure.months;
  const hafta = ihbarHaftasi(kidemAy);
  const gun = hafta * 7;
  const giydirilmis = kurus(input.brut + input.yanHaklar);
  const gunluk = kurus(giydirilmis / 30);
  const brut = kurus((giydirilmis * gun) / 30);
  const gv = gelirVergisiFarki(input.kumMatrah, brut, input.cikis);
  const damga = kurus(brut * valueAt(damgaVergisiUcret, input.cikis));
  return { sure, kidemAy, hafta, gun, giydirilmis, gunluk, brut, gv, damga, net: kurus(brut - gv - damga) };
}
