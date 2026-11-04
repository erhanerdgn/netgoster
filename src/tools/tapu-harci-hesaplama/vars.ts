import { calculateTapuHarci, tapuHarciSchema } from '../../calculators/tapuHarci.ts';
import { exampleVars } from '../../content/vars.ts';

/** content.md örnekleri: güncel harç oranı ve döner sermaye göstergesiyle. */
export default function vars(today: string) {
  const t = (v: object) => calculateTapuHarci(tapuHarciSchema.parse(v), today);
  return {
    ...exampleVars('tapu.o1', t({ bedel: 3000000, katsayi: 1 })),
    ...exampleVars('tapu.o2', t({ bedel: 2000000, emlakDegeri: 2400000, odeme: 'alici', katsayi: 2.5 })),
    ...exampleVars('tapu.o3', t({ bedel: 1200000, katsayi: 0.5, adet: 3, bagimsizBolum: false })),
  };
}
