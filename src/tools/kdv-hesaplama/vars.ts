import { calculateKdv, kdvSchema } from '../../calculators/kdv.ts';
import { exampleVars, pct, tl } from '../../content/vars.ts';
import { kdvOranlari } from '../../config/kdv.ts';
import { periodAt } from '../../config/period.ts';

export default function vars(today: string) {
  const p = periodAt(kdvOranlari, today);
  const k = (v: object) => calculateKdv(kdvSchema.parse(v), today);
  const [o1, o2, genel] = p.value;
  return {
    'kdv.oran1': pct(o1 / 100),
    'kdv.oran2': pct(o2 / 100),
    'kdv.genel': pct(genel / 100),
    'kdv.carpan.genel': String(1 + genel / 100).replace('.', ','),
    'kdv.carpan.oran2': String(1 + o2 / 100).replace('.', ','),
    'kdv.yururluk': p.from.split('-').reverse().join('.'),
    ...exampleVars('kdv.ornek1', k({ yon: 'haricten', tutar: 15000, oran: '2' })),
    ...exampleVars('kdv.ornek2', k({ yon: 'dahilden', tutar: 2499.9, oran: '2' })),
    ...exampleVars('kdv.ornek3', k({ yon: 'dahilden', tutar: 850, oran: '1' })),
    'kdv.hata.kdv': tl(850 * (o2 / 100)),
    'kdv.hata.haric': tl(850 - 850 * (o2 / 100)),
  };
}
