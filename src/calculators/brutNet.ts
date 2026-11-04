import { z } from 'zod';
import { DATA_YEAR } from '../config/parameters-2026.ts';
import { kurus, yillikBordro } from './bordro.ts';
import { zMoney, zNumber } from './common.ts';

export const brutNetSchema = z.object({
  brut: zMoney('Brüt maaş', { min: 1 }),
  yil: zNumber('Yıl', { min: 2025, max: 2100, int: true }).default(DATA_YEAR),
});

export type BrutNetInput = z.input<typeof brutNetSchema>;

/** Her ay aynı brüt için 12 aylık bordro (kümülatif GV matrahı, asgari ücret istisnası dahil). */
export function calculateBrutNet(input: z.output<typeof brutNetSchema>) {
  const { aylar, toplam } = yillikBordro(input.yil, input.brut);
  return { aylar, toplam, ortalamaNet: kurus(toplam.net / 12) };
}
