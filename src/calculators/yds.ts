import { z } from 'zod';
import { yds } from '../config/sinavlar.ts';
import { round2, zNumber } from './common.ts';

export const ydsSchema = z.object({
  dogru: zNumber('Doğru sayısı', { max: yds.questions, int: true }),
});
export type YdsInput = z.input<typeof ydsSchema>;

export interface YdsResult {
  dogru: number;
  yanlisBos: number;
  puan: number;
  /** A–E; 50 altında seviye yok (null) */
  seviye: string | null;
  /** Bir üst seviye için gereken ek doğru sayısı (A'da null) */
  sonrakiIcin: { seviye: string; dogru: number } | null;
}

/** YDS: 80 soru, yanlış doğruyu götürmez, puan = doğru × 1,25 (100 üzerinden) */
export function calculateYds({ dogru }: z.output<typeof ydsSchema>): YdsResult {
  const puan = round2(dogru * yds.perCorrect);
  const idx = yds.levels.findIndex((l) => puan >= l.min);
  const next = idx === -1 ? yds.levels.at(-1)! : idx > 0 ? yds.levels[idx - 1] : null;
  return {
    dogru,
    yanlisBos: yds.questions - dogru,
    puan,
    seviye: idx === -1 ? null : yds.levels[idx].level,
    sonrakiIcin: next ? { seviye: next.level, dogru: Math.ceil(next.min / yds.perCorrect - 1e-9) - dogru } : null,
  };
}
