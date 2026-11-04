import { z } from 'zod';
import { zNumber } from './common.ts';

export const vkiSchema = z.object({
  boy: zNumber('Boy', { min: 50, max: 250 }),
  kilo: zNumber('Kilo', { min: 10, max: 400 }),
  /** 18 yaş altı: yetişkin sınıflaması geçerli değil, uyarı gösterilir */
  cocuk: z.boolean().default(false),
});

export type VkiInput = z.input<typeof vkiSchema>;

/** DSÖ yetişkin VKİ sınıfları (kg/m²). `max` dahil değildir; sınıflama 1 ondalığa yuvarlanmış VKİ ile yapılır. */
export const VKI_SINIFLARI = [
  { id: 'zayif', ad: 'Zayıf', min: 0, max: 18.5 },
  { id: 'normal', ad: 'Normal', min: 18.5, max: 25 },
  { id: 'fazla', ad: 'Fazla kilolu', min: 25, max: 30 },
  { id: 'obez1', ad: 'Obez (1. derece)', min: 30, max: 35 },
  { id: 'obez2', ad: 'Obez (2. derece)', min: 35, max: 40 },
  { id: 'obez3', ad: 'Obez (3. derece)', min: 40, max: Infinity },
] as const;

export type VkiSinif = (typeof VKI_SINIFLARI)[number];

const r1 = (n: number) => Math.round((n + Number.EPSILON) * 10) / 10;

export interface VkiResult {
  vki: number;
  sinif: VkiSinif;
  /** Boya göre sağlıklı (normal) kilo aralığı: VKİ 18,5 – 24,9 */
  saglikliMin: number;
  saglikliMax: number;
  /** Aralığa ulaşmak için: + almalı, − vermeli, 0 aralıkta */
  fark: number;
}

/** VKİ = kilo (kg) / boy (m)². */
export function calculateVki(input: z.output<typeof vkiSchema>): VkiResult {
  const m2 = (input.boy / 100) ** 2;
  const vki = r1(input.kilo / m2);
  const sinif = VKI_SINIFLARI.find((s) => vki < s.max)!;
  const saglikliMin = r1(18.5 * m2);
  const saglikliMax = r1(24.9 * m2);
  const fark =
    input.kilo < saglikliMin ? r1(saglikliMin - input.kilo) : input.kilo > saglikliMax ? r1(saglikliMax - input.kilo) : 0;
  return { vki, sinif, saglikliMin, saglikliMax, fark };
}
