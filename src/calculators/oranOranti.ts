import { z } from 'zod';
import { zNumber } from './common.ts';

const sayi = (label: string) => zNumber(label, { max: 1e12 });

const dogruSchema = z
  .object({ mod: z.literal('dogru'), a: sayi('a'), b: sayi('b'), c: sayi('c') })
  .refine((v) => v.a !== 0, { path: ['a'], message: 'a sıfır olamaz: doğru orantıda x = b × c ÷ a' });
const tersSchema = z
  .object({ mod: z.literal('ters'), a: sayi('a'), b: sayi('b'), c: sayi('c') })
  .refine((v) => v.c !== 0, { path: ['c'], message: 'c sıfır olamaz: ters orantıda x = a × b ÷ c' });
const sadeSchema = z
  .object({ mod: z.literal('sadelestir'), a: sayi('a'), b: sayi('b') })
  .refine((v) => v.a > 0, { path: ['a'], message: 'a sıfırdan büyük olmalı' })
  .refine((v) => v.b > 0, { path: ['b'], message: 'b sıfırdan büyük olmalı' });

const union = z.discriminatedUnion('mod', [dogruSchema, tersSchema, sadeSchema]);
export type OranOrantiValues = z.output<typeof union>;
/** Formun tüm alanları; şema yalnız seçili modun alanlarını doğrular. */
export interface OranOrantiInput {
  mod: OranOrantiValues['mod'];
  a?: number;
  b?: number;
  c?: number;
}
export const oranOrantiSchema = union as unknown as z.ZodType<OranOrantiValues, OranOrantiInput>;

/** Kayan nokta taşmasını (0,1 × 3) temizler */
const clean = (n: number) => Number(n.toPrecision(12));

export function ebob(a: bigint, b: bigint): bigint {
  while (b) [a, b] = [b, a % b];
  return a;
}

export interface OrantiSonucu {
  mod: 'dogru' | 'ters';
  x: number;
  /** Doğru: birim oran k = b ÷ a · Ters: sabit çarpım k = a × b */
  k: number;
}

export interface SadeSonucu {
  mod: 'sadelestir';
  /** Sadeleşmiş oran p : q (tam sayılar) */
  p: number;
  q: number;
  /** Ondalıklar tam sayıya çevrilirken kullanılan çarpan (10^n) */
  carpan: number;
  /** Tam sayıya çevrilmiş oranın EBOB'u */
  ebob: number;
  /** a ÷ b */
  ondalik: number;
  /** a'nın toplam (a + b) içindeki payı, oran */
  payA: number;
}

/** Ondalık basamak sayısı (en fazla 6; daha fazlası yuvarlanır) */
const basamak = (n: number) => (String(clean(n)).split('.')[1] ?? '').length;

/**
 * Doğru orantı: a / b = c / x → x = b × c ÷ a (biri artınca diğeri aynı oranda artar).
 * Ters orantı: a × b = c × x → x = a × b ÷ c (biri artınca diğeri aynı oranda azalır).
 * Sadeleştirme: ondalıklar 10^n ile tam sayıya çevrilir, iki sayı EBOB'a bölünür.
 */
export function calculateOranOranti(v: OranOrantiValues): OrantiSonucu | SadeSonucu {
  if (v.mod === 'dogru') return { mod: v.mod, x: clean((v.b * v.c) / v.a), k: clean(v.b / v.a) };
  if (v.mod === 'ters') return { mod: v.mod, x: clean((v.a * v.b) / v.c), k: clean(v.a * v.b) };
  const carpan = 10 ** Math.min(6, Math.max(basamak(v.a), basamak(v.b)));
  const ta = BigInt(Math.round(v.a * carpan));
  const tb = BigInt(Math.round(v.b * carpan));
  const e = ebob(ta, tb);
  return {
    mod: v.mod,
    p: Number(ta / e),
    q: Number(tb / e),
    carpan,
    ebob: Number(e),
    ondalik: clean(v.a / v.b),
    payA: v.a / (v.a + v.b),
  };
}
