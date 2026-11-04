import { z } from 'zod';
import { DATA_YEAR } from '../config/parameters-2026.ts';
import { ayBordrosu, kurus, toplamBordro, type AyBordro } from './bordro.ts';
import { zMoney, zNumber } from './common.ts';

export const netBrutSchema = z.object({
  net: zMoney('Net maaş', { min: 1 }),
  yil: zNumber('Yıl', { min: 2025, max: 2100, int: true }).default(DATA_YEAR),
});

export type NetBrutInput = z.input<typeof netBrutSchema>;

/** Net'i en az `hedefNet` olan en küçük brüt (kuruş hassasiyetinde ikili arama). Net, brütle monoton artar. */
export function brutBul(yil: number, ay: number, hedefNet: number, kumOnceki: number): AyBordro {
  const net = (k: number) => ayBordrosu({ yil, ay, brut: k / 100, kumOnceki }).net;
  // en yüksek kesinti oranı ≈ %15 + %40 + binde 7,59 < %56 → brüt < net × 3
  let lo = 0;
  let hi = Math.ceil(hedefNet * 300);
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (net(mid) >= hedefNet) hi = mid;
    else lo = mid + 1;
  }
  return ayBordrosu({ yil, ay, brut: lo / 100, kumOnceki });
}

/** Her ay aynı neti sağlayan brütler; kümülatif matrah bulunan brütlerle ilerler. */
export function calculateNetBrut(input: z.output<typeof netBrutSchema>) {
  const aylar: AyBordro[] = [];
  let kum = 0;
  for (let ay = 1; ay <= 12; ay++) {
    const b = brutBul(input.yil, ay, input.net, kum);
    kum = b.kumMatrah;
    aylar.push(b);
  }
  const toplam = toplamBordro(aylar);
  return { aylar, toplam, ortalamaBrut: kurus(toplam.brut / 12) };
}
