import { z } from 'zod';
import { emlakArtisSiniri, emlakVergisi } from '../config/parameters-2026.ts';
import { periodAt, todayISO, valueAt } from '../config/period.ts';
import { round2, zMoney, zNumber } from './common.ts';

export const TASINMAZ_TURLERI = ['konut', 'isyeri', 'arsa', 'arazi'] as const;
export type TasinmazTuru = (typeof TASINMAZ_TURLERI)[number];

export const emlakVergisiSchema = z.object({
  tur: z.enum(TASINMAZ_TURLERI, { error: 'Taşınmaz türünü seçin' }),
  deger: zMoney('Vergi değeri', { min: 1 }),
  buyuksehir: z.boolean().default(true),
  hisse: zNumber('Hisse oranı', { min: 0.01, max: 100 }).default(100),
  /** Emekli/engelli/gazi/şehit yakını tek konut sıfır oranı (yalnız konut) */
  muaf: z.boolean().default(false),
  /** Önceki yılın (2025) vergi değeri — artış sınırı için, 0 = kullanma */
  oncekiDeger: zMoney('Önceki yıl vergi değeri').default(0),
});

export type EmlakVergisiInput = z.input<typeof emlakVergisiSchema>;
export type EmlakVergisiValues = z.output<typeof emlakVergisiSchema>;

export interface EmlakVergisiResult {
  oran: number;
  /** Artış sınırı uygulanmış vergi değeri (tam mülk) */
  matrah: number;
  sinirUygulandi: boolean;
  /** Artış sınırının geçerli olduğu yıl (dönemde yoksa undefined) */
  sinirYili?: number;
  sinirKatsayi?: number;
  muafiyet: boolean;
  hisseMatrah: number;
  yillik: number;
  taksit1: number;
  taksit2: number;
}

/**
 * Emlak vergisi (1319 s. K. md. 8 bina, md. 18 arazi; büyükşehir/mücavir alanda oranlar %100 artırımlı):
 * vergi = vergi değeri × oran × hisse. İki eşit taksit: Mayıs ve Kasım sonu (md. 30).
 * 2026'ya özgü artış sınırı (geçici md. 23, Tebliğ 89): 2026 vergi değeri önceki yıl değerinin en fazla 3 katı.
 * md. 8/2 ve 2006/11450 BKK: şartları taşıyan emekli, geliri olmayan, engelli, gazi, şehit dul ve yetimlerinin
 * brüt 200 m²'yi geçmeyen tek konutu için oran sıfırdır.
 */
export function calculateEmlakVergisi(input: EmlakVergisiValues, today: string = todayISO()): EmlakVergisiResult {
  const o = valueAt(emlakVergisi, today)[input.tur];
  const oran = input.buyuksehir ? o.buyuksehir : o.normal;
  const sinirP = periodAt(emlakArtisSiniri, today);
  const sinirGecerli = today >= sinirP.from && (!sinirP.to || today <= sinirP.to);
  const onceki = input.oncekiDeger ?? 0;
  const tavan = sinirGecerli && onceki > 0 ? round2(onceki * sinirP.value.katsayi) : Infinity;
  const matrah = Math.min(input.deger, tavan);
  const muafiyet = input.muaf && input.tur === 'konut';
  const hisseMatrah = round2((matrah * input.hisse) / 100);
  const yillik = muafiyet ? 0 : round2(hisseMatrah * oran);
  const taksit1 = round2(yillik / 2);
  return {
    oran,
    matrah,
    sinirUygulandi: matrah < input.deger,
    sinirYili: sinirGecerli ? Number(sinirP.from.slice(0, 4)) : undefined,
    sinirKatsayi: sinirGecerli ? sinirP.value.katsayi : undefined,
    muafiyet,
    hisseMatrah,
    yillik,
    taksit1,
    taksit2: round2(yillik - taksit1),
  };
}
