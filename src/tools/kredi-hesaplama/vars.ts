import { calculateKredi, krediSchema } from '../../calculators/kredi.ts';
import { exampleVars, pct, tl } from '../../content/vars.ts';

/** content.md örnekleri: güncel KKDF/BSMV oranlarıyla derleme anında hesaplanır. */
export default function vars(today: string) {
  const k = (v: object) => calculateKredi(krediSchema.parse(v), today);
  const o1 = k({ tur: 'ihtiyac', tutar: 100000, faiz: 3, vade: 12 });
  const o2 = k({ tur: 'konut', tutar: 2000000, faiz: 2.79, vade: 120 });
  const o3 = k({ tur: 'tasit', tutar: 500000, faiz: 3.49, vade: 36 });
  return {
    ...exampleVars('kredi.o1', o1),
    'kredi.o1.brutOran': pct(o1.brutOran),
    'kredi.o1.efektif': pct(o1.efektifYillik),
    'kredi.o1.faiz1': tl(o1.plan[0].faiz),
    'kredi.o1.kkdf1': tl(o1.plan[0].kkdf),
    'kredi.o1.anapara1': tl(o1.plan[0].anapara),
    'kredi.o1.kalan1': tl(o1.plan[0].kalan),
    ...exampleVars('kredi.o2', o2),
    'kredi.o2.efektif': pct(o2.efektifYillik),
    ...exampleVars('kredi.o3', o3),
    'kredi.o3.brutOran': pct(o3.brutOran),
  };
}
