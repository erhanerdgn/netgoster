import { asgariGvMatrahi, asgariIstisna, ayBordrosu } from '../../calculators/bordro.ts';
import { calculateBrutNet } from '../../calculators/brutNet.ts';
import { DATA_YEAR, gelirVergisiUcret } from '../../config/parameters-2026.ts';
import { valueAt } from '../../config/period.ts';
import { exampleVars, tl } from '../../content/vars.ts';

const AYLAR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

/** content.md örnekleri: parametre yılının tarifesi ve asgari ücretiyle hesaplanır. */
export default function vars() {
  const y = DATA_YEAR;
  const dilim1 = valueAt(gelirVergisiUcret, `${y}-01-01`)[0].upTo;
  const yillik = (brut: number, p: string) => {
    const r = calculateBrutNet({ brut, yil: y });
    const gecis = r.aylar.find((a) => a.kumMatrah > dilim1);
    return {
      ...exampleVars(`${p}.ocak`, r.aylar[0]),
      ...exampleVars(`${p}.aralik`, r.aylar[11]),
      ...exampleVars(`${p}.yillik`, r.toplam),
      [`${p}.ortalamaNet`]: tl(r.ortalamaNet),
      [`${p}.gecisAy`]: gecis ? AYLAR[gecis.ay - 1] : '—',
    };
  };
  return {
    'bn.asgariMatrah': tl(asgariGvMatrahi(y, 1)),
    'bn.istisnaOcak': tl(asgariIstisna(y, 1).gv),
    'bn.istisnaTemmuz': tl(asgariIstisna(y, 7).gv),
    'bn.istisnaAralik': tl(asgariIstisna(y, 12).gv),
    'bn.dvIstisna': tl(asgariIstisna(y, 1).dv),
    ...yillik(50000, 'bn.ornek1'),
    ...yillik(100000, 'bn.ornek2'),
    ...exampleVars('bn.ornek3', ayBordrosu({ yil: y, ay: 1, brut: 20000 })),
  };
}
