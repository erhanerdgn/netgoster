import { z } from 'zod';
import { universite } from '../config/sinavlar.ts';
import { round2, zNumber } from './common.ts';

export const harfler = universite.letters.map((l) => l.letter) as [string, ...string[]];
const puanOf = new Map(universite.letters.map((l) => [l.letter, l.point]));

const ders = z.object({
  ad: z.string().max(60, 'Ders adı en fazla 60 karakter olabilir').optional(),
  /** Seçilmeyen satır hesaba katılmaz */
  harf: z.enum(harfler, { error: 'Harf notu seçin' }).optional(),
  kredi: zNumber('AKTS/kredi', { max: 30 }),
});

export const universiteSchema = z
  .object({
    dersler: z
      .array(ders)
      .max(40, 'En fazla 40 ders eklenebilir')
      .refine((l) => l.some((d) => d.harf !== undefined && d.kredi > 0), 'En az bir ders için harf notu ve kredi girin'),
    oncekiGano: zNumber('Önceki GANO', { max: 4 }).optional(),
    oncekiKredi: zNumber('Önceki toplam kredi', { max: 1000 }).optional(),
  })
  .refine((v) => (v.oncekiGano === undefined) === (v.oncekiKredi === undefined), {
    path: ['oncekiKredi'],
    message: 'Önceki GANO ile birlikte toplam krediyi de girin (ya da ikisini de boş bırakın)',
  });
export type UniversiteInput = z.input<typeof universiteSchema>;

export interface UniversiteResult {
  dersSayisi: number;
  donemKredi: number;
  /** Σ not katsayısı × kredi */
  donemAgirlikli: number;
  /** Dönem ortalaması (iki ondalık, yuvarlanır) */
  donemOrt: number;
  /** Önceki GANO verildiyse yeni GANO */
  gano: number | null;
  toplamKredi: number;
  /** 100'lük karşılığı alınan ortalama (GANO varsa o, yoksa dönem ortalaması) */
  esas: number;
  /** YÖK dönüşümü; 1,00 altında tabloda karşılığı yok → null */
  yuzluk: number | null;
}

/**
 * YÖK 4'lük → 100'lük dönüşüm tablosu: (70/3) × GNO + 20/3, iki ondalığa KESİLİR; yalnız 1,00–4,00.
 * Tamsayı aritmetiği: 100 × sonuç = ⌊(70 × c + 2000) / 3⌋, c = GNO × 100.
 */
export function yokDonusum(gno: number): number | null {
  const c = Math.round(gno * 100);
  if (c < 100 || c > 400) return null;
  return Math.floor((70 * c + 2000) / 3) / 100;
}

/** Ağırlıklı ortalama = Σ (harf katsayısı × AKTS/kredi) / Σ AKTS/kredi; GANO önceki toplamla birleştirilir. */
export function calculateUniversite(input: z.output<typeof universiteSchema>): UniversiteResult {
  const list = input.dersler.filter((d) => d.harf !== undefined && d.kredi > 0);
  const donemKredi = list.reduce((s, d) => s + d.kredi, 0);
  const donemAgirlikli = list.reduce((s, d) => s + puanOf.get(d.harf!)! * d.kredi, 0);
  const donemOrt = round2(donemAgirlikli / donemKredi);
  const prev = input.oncekiGano !== undefined && input.oncekiKredi !== undefined && input.oncekiKredi > 0;
  const toplamKredi = donemKredi + (prev ? input.oncekiKredi! : 0);
  const gano = prev ? round2((input.oncekiGano! * input.oncekiKredi! + donemAgirlikli) / toplamKredi) : null;
  const esas = gano ?? donemOrt;
  return {
    dersSayisi: list.length,
    donemKredi,
    donemAgirlikli: round2(donemAgirlikli),
    donemOrt,
    gano,
    toplamKredi,
    esas,
    yuzluk: yokDonusum(esas),
  };
}
