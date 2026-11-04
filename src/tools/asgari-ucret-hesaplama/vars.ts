import { calculateAsgariUcret } from '../../calculators/asgariUcret.ts';
import { asgariIstisna } from '../../calculators/bordro.ts';
import { asgariUcret, DATA_YEAR } from '../../config/parameters-2026.ts';
import { exampleVars, pct, tl } from '../../content/vars.ts';

/** content.md: parametre yılının Ocak ayı (yıl içinde değişmeyen asgari ücret) üzerinden döküm. */
export default function vars() {
  const y = DATA_YEAR;
  const t = `${y}-01-15`;
  const yok = calculateAsgariUcret({ tarih: t, tesvik: 'yok' });
  const genel = calculateAsgariUcret({ tarih: t, tesvik: 'genel' });
  const imalat = calculateAsgariUcret({ tarih: t, tesvik: 'imalat' });
  const sorted = [...asgariUcret].sort((a, b) => a.from.localeCompare(b.from));
  const onceki = sorted.filter((p) => p.from < `${y}-01-01`).at(-1);
  const out: Record<string, string> = {
    ...exampleVars('au', yok.bordro),
    ...exampleVars('au.genel', genel.bordro),
    ...exampleVars('au.imalat', imalat.bordro),
    'au.netGunluk': tl(yok.netGunluk),
    'au.brutSaatlik': tl(yok.brutSaatlik),
    'au.netSaatlik': tl(yok.netSaatlik),
    'au.yillikBrut': tl(yok.yillikBrut),
    'au.yillikNet': tl(yok.yillikNet),
    'au.yillikMaliyet': tl(yok.yillikMaliyet),
    'au.destekliMaliyet': tl(yok.destekliMaliyet),
    'au.istisnaOcak': tl(asgariIstisna(y, 1).gv),
    'au.istisnaAralik': tl(asgariIstisna(y, 12).gv),
    'au.dvIstisna': tl(asgariIstisna(y, 1).dv),
  };
  if (onceki) {
    const o = calculateAsgariUcret({ tarih: onceki.from, tesvik: 'yok' });
    out['au.onceki.yil'] = onceki.from.slice(0, 4);
    out['au.onceki.brut'] = tl(o.bordro.brut);
    out['au.onceki.net'] = tl(o.bordro.net);
    out['au.artis'] = pct(yok.bordro.brut / o.bordro.brut - 1);
  }
  return out;
}
