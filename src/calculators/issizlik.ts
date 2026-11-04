import { z } from 'zod';
import { asgariUcret, damgaVergisiUcret, issizlikOdenegi } from '../config/parameters-2026.ts';
import { valueAt } from '../config/period.ts';
import { kurus } from './bordro.ts';
import { zDate, zMoney, zNumber } from './common.ts';

const kazanc = (ay: number) => zMoney(`${ay}. ay brüt kazanç`).optional();

export const issizlikSchema = z
  .object({
    tarih: zDate('İşten ayrılış tarihi'),
    yontem: z.enum(['aylik', 'ortalama']).default('aylik'),
    k1: kazanc(1),
    k2: kazanc(2),
    k3: kazanc(3),
    k4: kazanc(4),
    ortalama: zMoney('Ortalama brüt kazanç').optional(),
    primGun: zNumber('Prim günü', { min: 0, max: 1095, int: true }),
    son120: z.boolean().default(true),
  })
  .superRefine((v, ctx) => {
    const eksik = (path: string, message: string) => ctx.addIssue({ code: 'custom', path: [path], message });
    if (v.yontem === 'ortalama') {
      if (!v.ortalama) eksik('ortalama', 'Ortalama brüt kazancı girin');
    } else {
      for (const k of ['k1', 'k2', 'k3', 'k4'] as const) if (v[k] === undefined) eksik(k, 'Bu ayın brüt kazancını girin');
    }
  });

export type IssizlikInput = z.input<typeof issizlikSchema>;

/**
 * İşsizlik ödeneği (4447 md. 50–51): son 3 yılda ≥600 gün prim + son 120 gün kesintisiz prim şartı.
 * Aylık brüt ödenek = son 4 ay brüt kazanç ortalamasının %40'ı, üst sınır brüt asgari ücretin %80'i.
 * Süre 600/900/1080 gün → 180/240/300 gün. Ödenekten yalnız damga vergisi kesilir.
 */
export function calculateIssizlik(input: z.output<typeof issizlikSchema>) {
  const p = valueAt(issizlikOdenegi, input.tarih);
  const au = valueAt(asgariUcret, input.tarih).brutAylik;
  const ortalama =
    input.yontem === 'ortalama'
      ? (input.ortalama ?? 0)
      : kurus(((input.k1 ?? 0) + (input.k2 ?? 0) + (input.k3 ?? 0) + (input.k4 ?? 0)) / 4);
  const tavan = kurus(au * p.tavanOrani);
  const hesaplanan = kurus(ortalama * p.oran);
  const tavanUygulandi = hesaplanan > tavan;
  const brut = Math.min(hesaplanan, tavan);
  const damga = kurus(brut * valueAt(damgaVergisiUcret, input.tarih));
  const net = kurus(brut - damga);
  const sure = [...p.sureler].reverse().find(([min]) => input.primGun >= min);
  const primYeterli = sure !== undefined;
  const hakVar = primYeterli && input.son120;
  const gun = hakVar ? sure[1] : 0;
  return {
    oran: p.oran,
    tavanOrani: p.tavanOrani,
    ortalama,
    hesaplanan,
    tavan,
    tavanUygulandi,
    brut,
    damga,
    net,
    hakVar,
    primYeterli,
    minPrim: p.sureler[0][0],
    sonGunSarti: p.sonGunSarti,
    gun,
    ay: gun / 30,
    toplamNet: hakVar ? kurus((net * gun) / 30) : 0,
  };
}
