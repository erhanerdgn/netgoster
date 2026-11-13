import { z } from 'zod';
import { zNumber } from './common.ts';

/** Her basamak için standart yazımlar: [binler, yüzler, onlar, birler][rakam] */
const BASAMAK: [string[], number][] = [
  [['', 'M', 'MM', 'MMM'], 1000],
  [['', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM'], 100],
  [['', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC'], 10],
  [['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'], 1],
];

const DEGER: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
export const MAX = 3999;

export interface Parca {
  roma: string;
  deger: number;
}

/** 1987 → [M 1000, CM 900, LXXX 80, VII 7] (sıfır basamaklar atlanır) */
export function adimlar(n: number): Parca[] {
  return BASAMAK.flatMap(([yazim, b]) => {
    const r = Math.floor(n / b) % 10;
    return r ? [{ roma: yazim[r], deger: r * b }] : [];
  });
}

/** Sayı → standart Roma rakamı (1–3999) */
export const toRoma = (n: number) =>
  adimlar(n)
    .map((p) => p.roma)
    .join('');

/** Kullanıcı girişini sadeleştirir: boşluklar atılır, büyük harfe çevrilir (Türkçe ı/i/İ → I) */
export const normalize = (s: string) => s.replace(/\s+/g, '').replace(/[ıİi]/g, 'I').toUpperCase();

/** Kurala bakmadan okuma: küçük harf büyükten önceyse çıkarılır (IIII → 4, IC → 99, VX → 5) */
function serbestOku(s: string): number {
  let t = 0;
  for (let i = 0; i < s.length; i++) {
    const v = DEGER[s[i]];
    t += i + 1 < s.length && v < DEGER[s[i + 1]] ? -v : v;
  }
  return t;
}

const CIFTLER = ['IV', 'IX', 'XL', 'XC', 'CD', 'CM'];

/** Standart dışı yazımın nedeni (ilk bulunan kural) */
function neden(s: string): string {
  const tekrar = s.match(/([IXCM])\1{3}/);
  if (tekrar) return `aynı harf (${tekrar[1]}) en fazla 3 kez art arda yazılır`;
  const vld = ['V', 'L', 'D'].find((c) => s.split(c).length > 2);
  if (vld) return `${vld} harfi bir sayıda yalnız bir kez kullanılır`;
  for (let i = 0; i + 1 < s.length; i++) {
    const cift = s[i] + s[i + 1];
    if (DEGER[s[i]] < DEGER[s[i + 1]] && !CIFTLER.includes(cift))
      return `"${cift}" geçerli bir çıkarma çifti değil; yalnız IV, IX, XL, XC, CD ve CM kullanılır`;
  }
  return 'harfler büyükten küçüğe sıralanmalı ve her basamak standart biçimde yazılmalı';
}

export type RomaOkuma = { deger: number; roma: string } | { hata: string };

/** Roma rakamını katı kurallarla okur; standart dışıysa nedenini ve muhtemel doğru yazımı söyler. */
export function romaOku(girdi: string): RomaOkuma {
  const s = normalize(girdi);
  if (!s) return { hata: 'Roma rakamı girin' };
  const yabanci = [...new Set(s.replace(/[IVXLCDM]/g, ''))];
  if (yabanci.length)
    return {
      hata: `Geçersiz karakter: ${yabanci.join(', ')}. Roma rakamları yalnız I, V, X, L, C, D ve M harfleriyle yazılır.`,
    };
  const serbest = serbestOku(s);
  if (serbest >= 1 && serbest <= MAX && toRoma(serbest) === s) return { deger: serbest, roma: s };
  if (serbest > MAX) return { hata: `${s} standart Roma rakamlarıyla yazılamaz: en büyük sayı ${MAX} (MMMCMXCIX).` };
  const oneri = serbest >= 1 ? ` Muhtemelen ${toRoma(serbest)} (${serbest}) demek istediniz.` : '';
  return { hata: `${s} standart bir Roma rakamı değil: ${neden(s)}.${oneri}` };
}

export const romaRakamiSchema = z
  .object({
    yon: z.enum(['sayi', 'roma']),
    sayi: zNumber('Sayı', { min: 1, max: MAX, int: true }).optional(),
    roma: z.string().max(30, 'En fazla 30 karakter girin').optional(),
  })
  .superRefine((v, ctx) => {
    if (v.yon === 'sayi' && v.sayi === undefined) ctx.addIssue({ code: 'custom', path: ['sayi'], message: 'Sayı girin' });
    if (v.yon === 'roma') {
      const r = romaOku(v.roma ?? '');
      if ('hata' in r) ctx.addIssue({ code: 'custom', path: ['roma'], message: r.hata });
    }
  });

export type RomaRakamiInput = z.input<typeof romaRakamiSchema>;
export type RomaRakamiValues = z.output<typeof romaRakamiSchema>;

export interface RomaRakamiResult {
  sayi: number;
  roma: string;
  adimlar: Parca[];
}

export function calculateRomaRakami(v: RomaRakamiValues): RomaRakamiResult {
  let sayi: number;
  if (v.yon === 'sayi') sayi = v.sayi!;
  else {
    const r = romaOku(v.roma ?? '');
    if ('hata' in r) throw new Error(r.hata);
    sayi = r.deger;
  }
  return { sayi, roma: toRoma(sayi), adimlar: adimlar(sayi) };
}
