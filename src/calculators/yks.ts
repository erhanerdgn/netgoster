import { z } from 'zod';
import { yks, type Test } from '../config/sinavlar.ts';
import { zNumber } from './common.ts';

export interface DY {
  d: number;
  y: number;
}

/**
 * Doğru/yanlış çiftleri şeması: { [test.key]: { d, y } }. Boş alan 0 sayılır; D + Y soru sayısını aşamaz
 * (böylece net de soru sayısını aşamaz). LGS, KPSS ve ALES hesaplayıcıları da kullanır.
 * ponytail: ortak yardımcı common.ts'e taşınabilir (paylaşılan dosya olduğu için burada).
 */
export function dySchema(tests: readonly Test[]) {
  const one = (t: Test) =>
    z
      .object({
        d: zNumber(`${t.label} doğru`, { max: t.questions, int: true }).default(0),
        y: zNumber(`${t.label} yanlış`, { max: t.questions, int: true }).default(0),
      })
      .refine((v) => v.d + v.y <= t.questions, {
        path: ['y'],
        message: `${t.label}: doğru + yanlış ${t.questions} soruyu aşamaz`,
      })
      .default({ d: 0, y: 0 });
  const shape: Record<string, ReturnType<typeof one>> = {};
  for (const t of tests) shape[t.key] = one(t);
  return z.object(shape);
}

/** Net = D − Y × ceza (YKS/KPSS/ALES 1/4, LGS 1/3) */
export const netOf = ({ d, y }: DY, penalty: number) => d - y * penalty;

/** Kayan nokta gürültüsünü temizler (ÖSYM puanları 5 ondalıkla verir) */
export const round5 = (n: number) => Math.round(n * 1e5) / 1e5;

const tests: Test[] = [...yks.tyt, ...yks.ayt, yks.ydt];

export const yksSchema = z.object({
  dy: dySchema(tests),
  /** Diploma notu (100'lük). Boşsa yalnız ham puanlar hesaplanır. */
  diploma: zNumber('Diploma notu', { min: yks.minDiploma, max: 100 }).optional(),
  /** 2025'te bir programa merkezî yerleştirmeyle yerleşti → OBP katsayısı yarıya iner */
  yerlesti: z.boolean().default(false),
});

export type YksInput = z.input<typeof yksSchema>;
export type PuanTuru = 'TYT' | 'SAY' | 'EA' | 'SÖZ' | 'DİL';
export const puanTurleri: PuanTuru[] = ['TYT', 'SAY', 'EA', 'SÖZ', 'DİL'];

export interface YksPuan {
  tur: PuanTuru;
  /** Puan hesaplanma şartı sağlandı mı */
  hesaplandi: boolean;
  ham: number;
  yerlestirme: number | null;
}

export interface YksResult {
  netler: Record<string, number>;
  tytNet: number;
  aytNet: number;
  obp: number | null;
  obpKatkisi: number | null;
  puanlar: YksPuan[];
}

/**
 * YKS tahmini puan:
 * - Ham puan = 100 + Σ katsayı × net (TYT: yalnız TYT testleri; SAY/EA/SÖZ/DİL: TYT kısmı (%40) + AYT/YDT kısmı).
 * - OBP = diploma × 5; yerleştirme puanı = ham + OBP × 0,12 (2025'te yerleşen 0,06).
 * - Hesaplanma şartı (ÖSYM): TYT için Türkçe veya Temel Matematik'ten en az 0,5 ham puan; SAY için AYT Matematik
 *   veya Fen Bilimleri; EA için TDE-Sosyal-1 veya Matematik; SÖZ için TDE-Sosyal-1 veya Sosyal Bilimler-2;
 *   DİL için YDT'den en az 0,5. AYT/YDT puanları için TYT puanının da hesaplanmış olması gerekir.
 */
export function calculateYks(input: z.output<typeof yksSchema>): YksResult {
  const n: Record<string, number> = {};
  for (const t of tests) n[t.key] = netOf(input.dy[t.key], yks.wrongPenalty);
  const sum = (coef: Record<string, number>) => Object.entries(coef).reduce((s, [k, c]) => s + c * n[k], 0);

  const tytOk = n.tytTurkce >= 0.5 || n.tytMat >= 0.5;
  const fen = n.aytFizik + n.aytKimya + n.aytBiyoloji;
  const tdeSos1 = n.aytEdebiyat + n.aytTarih1 + n.aytCografya1;
  const sos2 = n.aytTarih2 + n.aytCografya2 + n.aytFelsefe + n.aytDin;
  const ok: Record<PuanTuru, boolean> = {
    TYT: tytOk,
    SAY: tytOk && (n.aytMat >= 0.5 || fen >= 0.5),
    EA: tytOk && (tdeSos1 >= 0.5 || n.aytMat >= 0.5),
    SÖZ: tytOk && (tdeSos1 >= 0.5 || sos2 >= 0.5),
    DİL: tytOk && n.ydt >= 0.5,
  };

  const obp = input.diploma === undefined ? null : Math.max(input.diploma, yks.minDiploma) * 5;
  const obpKatkisi = obp === null ? null : round5(obp * (input.yerlesti ? yks.obpFactorPlaced : yks.obpFactor));
  const tytPart = sum(yks.coef.tytPart);

  const puanlar = puanTurleri.map((tur): YksPuan => {
    const ham = round5(yks.base + (tur === 'TYT' ? sum(yks.coef.TYT) : tytPart + sum(yks.coef[tur])));
    return {
      tur,
      hesaplandi: ok[tur],
      ham,
      yerlestirme: ok[tur] && obpKatkisi !== null ? round5(ham + obpKatkisi) : null,
    };
  });

  const total = (list: Test[]) => round5(list.reduce((s, t) => s + n[t.key], 0));
  return { netler: n, tytNet: total(yks.tyt), aytNet: total(yks.ayt), obp, obpKatkisi, puanlar };
}
