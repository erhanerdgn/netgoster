import { z } from 'zod';
import { DATA_YEAR } from '../config/parameters-2026.ts';
import { kurus, yillikBordro, type Tesvik } from './bordro.ts';
import { zMoney, zNumber } from './common.ts';

export const isverenMaliyetiSchema = z.object({
  brut: zMoney('Brüt maaş', { min: 1 }),
  tesvik: z.enum(['yok', 'genel', 'imalat']).default('yok'),
  yil: zNumber('Yıl', { min: 2025, max: 2100, int: true }).default(DATA_YEAR),
});

export type IsverenMaliyetiInput = z.input<typeof isverenMaliyetiSchema>;

/** Aylık maliyet kümülatif matrahtan bağımsızdır; çalışanın neti ay ay değişir (12 aylık tablo). */
export function calculateIsverenMaliyeti(input: z.output<typeof isverenMaliyetiSchema>) {
  const { aylar, toplam } = yillikBordro(input.yil, input.brut, input.tesvik as Tesvik);
  return { ay: aylar[0], aylar, toplam, ortalamaNet: kurus(toplam.net / 12) };
}
