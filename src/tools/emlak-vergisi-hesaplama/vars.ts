import { calculateEmlakVergisi, emlakVergisiSchema } from '../../calculators/emlakVergisi.ts';
import { emlakArtisSiniri } from '../../config/parameters-2026.ts';
import { periodAt } from '../../config/period.ts';
import { exampleVars } from '../../content/vars.ts';

/** content.md örnekleri: derleme gününün oranlarıyla; sınır örneği (o3) sınırın geçerli olduğu yıla göre. */
export default function vars(today: string) {
  const e = (v: object, d = today) => calculateEmlakVergisi(emlakVergisiSchema.parse(v), d);
  const s = periodAt(emlakArtisSiniri, today);
  return {
    'emlak.sinirYil': s.from.slice(0, 4),
    'emlak.sinirOncekiYil': String(Number(s.from.slice(0, 4)) - 1),
    'emlak.sinirKat': String(s.value.katsayi),
    ...exampleVars('emlak.o1', e({ tur: 'konut', deger: 1500000, buyuksehir: true })),
    ...exampleVars('emlak.o2', e({ tur: 'arsa', deger: 800000, buyuksehir: false, hisse: 50 })),
    ...exampleVars('emlak.o3', e({ tur: 'isyeri', deger: 3000000, buyuksehir: true, oncekiDeger: 700000 }, s.from)),
  };
}
