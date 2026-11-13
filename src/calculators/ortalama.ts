import { z } from 'zod';
import { sayiyaCevir } from './rakamYazi.ts';

export const MAX_DEGER = 10000;

/**
 * Serbest metindeki sayıları okur. Ayraçlar: boşluk, alt satır, sekme, noktalı virgül ve "virgül + boşluk".
 * Virgül ondalık ayraçtır (3,5). Noktalı ondalık (3.5) ve binlik ayraç (1.250) da kabul edilir.
 * Boşluksuz "10,20,30" gibi birden çok virgüllü (noktasız) parça, virgülle ayrılmış liste sayılır.
 */
export function sayilariOku(metin: string): { sayilar: number[]; hatali: string[] } {
  const sayilar: number[] = [];
  const hatali: string[] = [];
  for (const parca of metin.split(/[\s;]+/)) {
    const p = parca.replace(/^,+|,+$/g, '');
    if (!p) continue;
    const ogeler = (p.match(/,/g)?.length ?? 0) > 1 && !p.includes('.') ? p.split(',') : [p];
    for (const o of ogeler) {
      const n = o === '' ? undefined : sayiyaCevir(o);
      if (n === undefined) hatali.push(o || parca);
      else sayilar.push(n);
    }
  }
  return { sayilar, hatali };
}

export const ANA_OLCULER = [
  'aritmetik',
  'medyan',
  'mod',
  'geometrik',
  'harmonik',
  'ssOrneklem',
  'ssPopulasyon',
  'aralik',
] as const;
export type AnaOlcu = (typeof ANA_OLCULER)[number];

const listeSchema = z.object({
  mod: z.literal('liste'),
  /** Büyük gösterilecek ölçü (yalnız gösterim) */
  ana: z.enum(ANA_OLCULER).default('aritmetik'),
  veriler: z.string({ error: 'Sayıları girin' }).transform((s, ctx) => {
    const { sayilar, hatali } = sayilariOku(s);
    if (hatali.length) {
      const ilk = hatali.slice(0, 3).map((h) => `“${h}”`);
      ctx.addIssue({
        code: 'custom',
        message: `Sayı olarak okunamadı: ${ilk.join(', ')}${hatali.length > 3 ? ` ve ${hatali.length - 3} değer daha` : ''}`,
      });
    } else if (!sayilar.length) ctx.addIssue({ code: 'custom', message: 'En az bir sayı girin' });
    else if (sayilar.length > MAX_DEGER) ctx.addIssue({ code: 'custom', message: `En fazla ${MAX_DEGER} değer girilebilir` });
    return sayilar;
  }),
});

const satir = z.object({ deger: z.number().optional(), agirlik: z.number().optional() });
const agirlikliSchema = z.object({
  mod: z.literal('agirlikli'),
  satirlar: z
    .array(satir)
    .transform((rows) =>
      rows.filter((r): r is { deger: number; agirlik: number } => r.deger !== undefined && r.agirlik !== undefined),
    )
    .refine((rows) => rows.length > 0, 'En az bir satıra değer ve ağırlık girin')
    .refine((rows) => rows.every((r) => r.agirlik >= 0), 'Ağırlıklar negatif olamaz')
    .refine((rows) => rows.reduce((t, r) => t + r.agirlik, 0) > 0, 'Ağırlıkların toplamı sıfırdan büyük olmalı'),
});

const union = z.discriminatedUnion('mod', [listeSchema, agirlikliSchema]);
export type OrtalamaValues = z.output<typeof union>;
/** Formun tüm alanları; şema yalnız seçili modun alanlarını doğrular. */
export interface OrtalamaInput {
  mod: OrtalamaValues['mod'];
  veriler?: string;
  satirlar?: { deger?: number; agirlik?: number }[];
  /** Liste modunda büyük gösterilecek ölçü (yalnız gösterim) */
  ana?: AnaOlcu;
}
export const ortalamaSchema = union as unknown as z.ZodType<OrtalamaValues, OrtalamaInput>;

/** Kayan nokta taşmasını (0,1 + 0,2) temizler */
const clean = (n: number) => Number(n.toPrecision(12));

export interface ListeSonucu {
  n: number;
  toplam: number;
  aritmetik: number;
  medyan: number;
  /** En sık tekrar eden değer(ler); her değer bir kez geçiyorsa boş */
  modlar: number[];
  modFrekans: number;
  min: number;
  max: number;
  aralik: number;
  /** Yalnız tüm değerler pozitifse tanımlı */
  geometrik?: number;
  harmonik?: number;
  varyansPopulasyon: number;
  ssPopulasyon: number;
  /** n ≥ 2 */
  varyansOrneklem?: number;
  ssOrneklem?: number;
  sirali: number[];
}

export function listeIstatistik(x: number[]): ListeSonucu {
  const n = x.length;
  const sirali = [...x].sort((a, b) => a - b);
  const toplam = x.reduce((t, v) => t + v, 0);
  const ort = toplam / n;
  const orta = Math.floor(n / 2);
  const medyan = n % 2 ? sirali[orta] : (sirali[orta - 1] + sirali[orta]) / 2;

  const frekans = new Map<number, number>();
  for (const v of x) frekans.set(v, (frekans.get(v) ?? 0) + 1);
  const modFrekans = Math.max(...frekans.values());
  const modlar =
    modFrekans > 1
      ? [...frekans]
          .filter(([, f]) => f === modFrekans)
          .map(([v]) => v)
          .sort((a, b) => a - b)
      : [];

  const kareler = x.reduce((t, v) => t + (v - ort) ** 2, 0);
  const pozitif = x.every((v) => v > 0);
  return {
    n,
    toplam: clean(toplam),
    aritmetik: clean(ort),
    medyan: clean(medyan),
    modlar,
    modFrekans,
    min: sirali[0],
    max: sirali[n - 1],
    aralik: clean(sirali[n - 1] - sirali[0]),
    // ln ortalaması: büyük çarpımlarda taşma olmaz
    geometrik: pozitif ? clean(Math.exp(x.reduce((t, v) => t + Math.log(v), 0) / n)) : undefined,
    harmonik: pozitif ? clean(n / x.reduce((t, v) => t + 1 / v, 0)) : undefined,
    varyansPopulasyon: clean(kareler / n),
    ssPopulasyon: clean(Math.sqrt(kareler / n)),
    varyansOrneklem: n > 1 ? clean(kareler / (n - 1)) : undefined,
    ssOrneklem: n > 1 ? clean(Math.sqrt(kareler / (n - 1))) : undefined,
    sirali,
  };
}

export interface AgirlikliSonucu {
  ortalama: number;
  agirlikToplam: number;
  carpimToplam: number;
  /** Ağırlıksız (basit) aritmetik ortalama — karşılaştırma için */
  basit: number;
  satirlar: { deger: number; agirlik: number; carpim: number; pay: number }[];
}

/** Ağırlıklı ortalama = Σ(değer × ağırlık) ÷ Σ ağırlık */
export function agirlikliOrtalama(rows: { deger: number; agirlik: number }[]): AgirlikliSonucu {
  const agirlikToplam = rows.reduce((t, r) => t + r.agirlik, 0);
  const carpimToplam = rows.reduce((t, r) => t + r.deger * r.agirlik, 0);
  return {
    ortalama: clean(carpimToplam / agirlikToplam),
    agirlikToplam: clean(agirlikToplam),
    carpimToplam: clean(carpimToplam),
    basit: clean(rows.reduce((t, r) => t + r.deger, 0) / rows.length),
    satirlar: rows.map((r) => ({ ...r, carpim: clean(r.deger * r.agirlik), pay: r.agirlik / agirlikToplam })),
  };
}
