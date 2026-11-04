import { calculateMtv, mtvSchema } from '../../calculators/mtv.ts';
import { mtvElektrik } from '../../config/parameters-2026.ts';
import { exampleVars, pct } from '../../content/vars.ts';

/** content.md örnekleri: model yılları derleme yılına göre kayar, tutarlar güncel tarifeden. */
export default function vars(today: string) {
  const y = Number(today.slice(0, 4));
  const m = (v: object) => calculateMtv(mtvSchema.parse(v), today);
  const o1 = m({ tip: 'oto', cc: 1598, dilim: '2', modelYili: y - 4 });
  const o2 = m({ tip: 'elektrik', kw: 160, deger: 2000000, modelYili: y });
  const o3 = m({ tip: 'otoEski', cc: 1461, modelYili: y - 13 });
  return {
    'mtv.elektrikOran': pct(mtvElektrik.oran),
    'mtv.o1.model': String(y - 4),
    ...exampleVars('mtv.o1', o1),
    'mtv.o1.yasN': String(o1.yas),
    'mtv.o2.model': String(y),
    ...exampleVars('mtv.o2', o2),
    'mtv.o3.model': String(y - 13),
    ...exampleVars('mtv.o3', o3),
    'mtv.o3.yasN': String(o3.yas),
  };
}
