import { calculateKalori, kaloriSchema, MAKRO } from '../../calculators/kalori.ts';
import { exampleVars } from '../../content/vars.ts';

const kcal = (x: number) => new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 }).format(x) + ' kcal';
const g = (x: number) => new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 }).format(x) + ' g';

/** content.md örnekleri (tarihten bağımsız) */
export default function vars() {
  const k = (v: object) => calculateKalori(kaloriSchema.parse(v));
  const a = k({ cinsiyet: 'erkek', yas: 30, boy: 180, kilo: 80, aktivite: 'orta', hedef: 'koru' });
  const b = k({ cinsiyet: 'kadin', yas: 35, boy: 165, kilo: 75, aktivite: 'hafif', hedef: 'ver' });
  const c = k({ cinsiyet: 'kadin', yas: 22, boy: 160, kilo: 48, aktivite: 'orta', hedef: 'al' });
  return {
    'kl.protein': String(MAKRO.protein * 100),
    'kl.yag': String(MAKRO.yag * 100),
    'kl.karbonhidrat': String(MAKRO.karbonhidrat * 100),
    ...exampleVars('kl.a', a, kcal),
    ...exampleVars('kl.b', b, kcal),
    ...exampleVars('kl.c', c, kcal),
    ...exampleVars('kl.b.makro', b.makro, g),
  };
}
