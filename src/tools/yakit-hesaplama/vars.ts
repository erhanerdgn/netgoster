import { calculateYakit, yakitSchema } from '../../calculators/yakit.ts';
import { exampleVars } from '../../content/vars.ts';

const n = (x: number) => new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 2 }).format(x);

export default function vars() {
  const y = (v: object) => calculateYakit(yakitSchema.parse(v));
  const o1 = y({ mesafe: 450, tuketim: 6.5, fiyat: 50, gidisDonus: true, kisi: 3 });
  const o2 = y({ mesafe: 1000, tuketim: 5, fiyat: 52 });
  const o3 = y({ mesafe: 1000, tuketim: 9, fiyat: 27 });
  return {
    ...exampleVars('yakit.ornek1', o1),
    'yakit.ornek1.km': n(o1.toplamKm),
    'yakit.ornek1.l': n(o1.litre),
    ...exampleVars('yakit.ornek2', o2),
    'yakit.ornek2.l': n(o2.litre),
    ...exampleVars('yakit.ornek3', o3),
    'yakit.ornek3.l': n(o3.litre),
  };
}
