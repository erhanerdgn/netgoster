import { z } from 'zod';
import { ales, type Test } from '../config/sinavlar.ts';
import { dySchema, netOf, round5 } from './yks.ts';

export const alesTests: Test[] = [
  { key: 'say', label: 'Sayısal', questions: ales.sayisal },
  { key: 'soz', label: 'Sözel', questions: ales.sozel },
];
export type AlesTur = keyof typeof ales.types;
export const alesTurleri: AlesTur[] = ['SAY', 'EA', 'SÖZ'];

/** Yaygın asgari ALES puanları: tezli YL / doktora (YL ile) 55, akademik kadro 70, lisansla doktora 80 */
export const alesEsikler = [55, 70, 80] as const;

export const alesSchema = z.object({ dy: dySchema(alesTests) });
export type AlesInput = z.input<typeof alesSchema>;

export interface AlesResult {
  sayNet: number;
  sozNet: number;
  puanlar: Record<AlesTur, number>;
}

/** ALES tahmini puan: ≈ sabit + a × sayısal net + b × sözel net, 0–100 aralığına kırpılır. Net = D − Y/4. */
export function calculateAles(input: z.output<typeof alesSchema>): AlesResult {
  const sayNet = netOf(input.dy.say, ales.wrongPenalty);
  const sozNet = netOf(input.dy.soz, ales.wrongPenalty);
  const puanlar = {} as Record<AlesTur, number>;
  for (const k of alesTurleri) {
    const t = ales.types[k];
    puanlar[k] = round5(Math.min(100, Math.max(0, t.base + t.say * sayNet + t.soz * sozNet)));
  }
  return { sayNet, sozNet, puanlar };
}
