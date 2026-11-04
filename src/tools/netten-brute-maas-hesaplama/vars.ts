import { asgariUcret, DATA_YEAR } from '../../config/parameters-2026.ts';
import { calculateNetBrut } from '../../calculators/netBrut.ts';
import { ayBordrosu } from '../../calculators/bordro.ts';
import { valueAt } from '../../config/period.ts';
import { exampleVars, tl } from '../../content/vars.ts';

/** content.md örnekleri: parametre yılının tarifesiyle ters hesaplama. */
export default function vars() {
  const y = DATA_YEAR;
  const ornek = (net: number, p: string) => {
    const r = calculateNetBrut({ net, yil: y });
    return {
      ...exampleVars(`${p}.ocak`, r.aylar[0]),
      ...exampleVars(`${p}.aralik`, r.aylar[11]),
      ...exampleVars(`${p}.yillik`, r.toplam),
      [`${p}.ortalamaBrut`]: tl(r.ortalamaBrut),
    };
  };
  const asgariNet = ayBordrosu({ yil: y, ay: 1, brut: valueAt(asgariUcret, `${y}-01-01`).brutAylik }).net;
  return {
    ...ornek(40000, 'nb.ornek1'),
    ...ornek(asgariNet, 'nb.ornek2'),
    ...ornek(100000, 'nb.ornek3'),
  };
}
