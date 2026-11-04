import { z } from 'zod';
import { zNumber } from './common.ts';

const sayi = (label: string) => zNumber(label, { min: -1e12, max: 1e12 });

const yuzdesiSchema = z.object({ mod: z.literal('yuzdesi'), x: sayi('Sayı'), y: sayi('Yüzde') });
const degisimSchema = z
  .object({ mod: z.literal('degisim'), x: sayi('Eski değer'), y: sayi('Yeni değer') })
  .refine((v) => v.x !== 0, { path: ['x'], message: 'Eski değer 0 olamaz: sıfırdan değişimin yüzdesi tanımsızdır' });
const kacSchema = z
  .object({ mod: z.literal('kac'), x: sayi('Parça'), y: sayi('Bütün') })
  .refine((v) => v.y !== 0, { path: ['y'], message: 'Bütün 0 olamaz: bir sayı sıfırın yüzdesi olarak ifade edilemez' });
const artirSchema = z.object({
  mod: z.literal('artir'),
  x: sayi('Sayı'),
  y: zNumber('Yüzde', { max: 1e6 }),
  yon: z.enum(['artir', 'azalt']),
});

const union = z.discriminatedUnion('mod', [yuzdesiSchema, degisimSchema, kacSchema, artirSchema]);
export type YuzdeValues = z.output<typeof union>;
/** Formun tüm alanları; şema yalnız seçili modun alanlarını doğrular. */
export interface YuzdeInput {
  mod: YuzdeValues['mod'];
  x?: number;
  y?: number;
  yon: 'artir' | 'azalt';
}
export const yuzdeSchema = union as unknown as z.ZodType<YuzdeValues, YuzdeInput>;

export interface YuzdeResult {
  mod: YuzdeValues['mod'];
  sonuc: number;
  /** degisim: yeni − eski; artir: eklenen/çıkarılan tutar */
  fark?: number;
  /** artir: sonucu başlangıca döndürmek için gereken ters yüzde */
  tersYuzde?: number;
}

/** Ondalık taşmasını (0,1 + 0,2) temizler; 12 anlamlı haneye yuvarlar. */
const clean = (n: number) => Number(n.toPrecision(12));

export function calculateYuzde(v: YuzdeValues): YuzdeResult {
  switch (v.mod) {
    case 'yuzdesi':
      return { mod: v.mod, sonuc: clean((v.x * v.y) / 100) };
    case 'degisim':
      // Negatif başlangıçta yönün doğru çıkması için mutlak değere bölünür
      return { mod: v.mod, sonuc: clean(((v.y - v.x) / Math.abs(v.x)) * 100), fark: clean(v.y - v.x) };
    case 'kac':
      return { mod: v.mod, sonuc: clean((v.x / v.y) * 100) };
    case 'artir': {
      const r = v.yon === 'artir' ? v.y : -v.y;
      const sonuc = clean(v.x * (1 + r / 100));
      // ×(1+r) sonrası geri dönüş: ×1/(1+r) → yüzde = −r/(1+r). %100 azaltmada geri dönüş yok.
      const tersYuzde = r === -100 ? undefined : clean((-r / (100 + r)) * 100);
      return { mod: v.mod, sonuc, fark: clean(sonuc - v.x), tersYuzde };
    }
  }
}
