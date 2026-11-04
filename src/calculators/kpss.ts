import { z } from 'zod';
import { kpss, type Test } from '../config/sinavlar.ts';
import { dySchema, netOf, round5 } from './yks.ts';

export const kpssTests: Test[] = [
  { key: 'gy', label: 'Genel Yetenek', questions: kpss.gy },
  { key: 'gk', label: 'Genel Kültür', questions: kpss.gk },
];
export type KpssTur = keyof typeof kpss.types;

export const kpssSchema = z.object({
  tur: z.enum(['P3', 'P93', 'P94'], { error: 'KPSS türünü seçin' }),
  dy: dySchema(kpssTests),
});
export type KpssInput = z.input<typeof kpssSchema>;

export interface KpssResult {
  gyNet: number;
  gkNet: number;
  toplamNet: number;
  /** Her iki testte de en az 1 net varsa true */
  hesaplandi: boolean;
  puan: number | null;
}

/** KPSS tahmini puan: ≈ sabit + katsayı × (GY net + GK net), 100'e kırpılır. Net = D − Y/4. */
export function calculateKpss(input: z.output<typeof kpssSchema>): KpssResult {
  const gyNet = netOf(input.dy.gy, kpss.wrongPenalty);
  const gkNet = netOf(input.dy.gk, kpss.wrongPenalty);
  const toplamNet = gyNet + gkNet;
  // TODO: DOĞRULA — "en az 1 net" şartı (ÖSYM kılavuzundaki puan hesaplanma koşulu)
  const hesaplandi = gyNet >= 1 && gkNet >= 1;
  const t = kpss.types[input.tur];
  return {
    gyNet,
    gkNet,
    toplamNet,
    hesaplandi,
    puan: hesaplandi ? round5(Math.min(100, t.base + t.perNet * toplamNet)) : null,
  };
}
