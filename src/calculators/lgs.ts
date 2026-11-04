import { z } from 'zod';
import { lgs } from '../config/sinavlar.ts';
import { dySchema, netOf, round5 } from './yks.ts';

export const lgsSchema = z.object({ dy: dySchema(lgs.tests) });
export type LgsInput = z.input<typeof lgsSchema>;

export interface LgsResult {
  netler: Record<string, number>;
  toplamNet: number;
  /** Σ net × ağırlık katsayısı (Türkçe/Mat/Fen 4, diğerleri 1) */
  agirlikliNet: number;
  taban: number;
  puan: number;
}

/** Tam netle 500 çıkacak şekilde türetilen taban: 500 − Σ soru × net başına puan (≈188,9) */
export const lgsTaban = round5(lgs.max - lgs.tests.reduce((s, t) => s + t.questions * lgs.perNet[t.weight], 0));

/**
 * LGS tahmini puan (MEB standart puan kullanır; bu yaklaşık hesaptır):
 * net = D − Y/3, puan ≈ taban + Σ net × perNet[ağırlık], 100–500 aralığına kırpılır.
 */
export function calculateLgs(input: z.output<typeof lgsSchema>): LgsResult {
  const netler: Record<string, number> = {};
  let toplamNet = 0;
  let agirlikliNet = 0;
  let ham = lgsTaban;
  for (const t of lgs.tests) {
    const n = netOf(input.dy[t.key], lgs.wrongPenalty);
    netler[t.key] = n;
    toplamNet += n;
    agirlikliNet += n * t.weight;
    ham += n * lgs.perNet[t.weight];
  }
  return {
    netler,
    toplamNet: round5(toplamNet),
    agirlikliNet: round5(agirlikliNet),
    taban: lgsTaban,
    puan: round5(Math.min(lgs.max, Math.max(lgs.min, ham))),
  };
}
