import { calculateIsverenMaliyeti } from '../../calculators/isverenMaliyeti.ts';
import { DATA_YEAR } from '../../config/parameters-2026.ts';
import { exampleVars, pct, tl } from '../../content/vars.ts';

/** content.md örnekleri: parametre yılının prim oranlarıyla. */
export default function vars() {
  const y = DATA_YEAR;
  const m = (brut: number, tesvik: 'yok' | 'genel' | 'imalat') => calculateIsverenMaliyeti({ brut, tesvik, yil: y });
  const o1 = m(50000, 'yok');
  const o2 = m(50000, 'genel');
  const o3 = m(50000, 'imalat');
  const o4 = m(400000, 'yok');
  return {
    ...exampleVars('im.ornek1', o1.ay),
    'im.ornek1.yillik': tl(o1.toplam.maliyet),
    'im.ornek1.yillikNet': tl(o1.toplam.net),
    'im.ornek1.ekOran': pct(o1.ay.maliyet / o1.ay.brut - 1),
    'im.ornek1.netOran': pct(o1.ay.net / o1.ay.maliyet),
    ...exampleVars('im.ornek2', o2.ay),
    'im.ornek2.yillik': tl(o2.toplam.maliyet),
    'im.ornek2.tasarruf': tl(o1.toplam.maliyet - o2.toplam.maliyet),
    ...exampleVars('im.ornek3', o3.ay),
    'im.ornek3.yillik': tl(o3.toplam.maliyet),
    ...exampleVars('im.ornek4', o4.ay),
  };
}
