import { calculateIndirim, indirimSchema } from '../../calculators/indirim.ts';
import { exampleVars, pct, tl } from '../../content/vars.ts';

export default function vars() {
  const i = (v: object) => calculateIndirim(indirimSchema.parse(v));
  const oran = i({ mod: 'oran', fiyat: 1500, yeni: 1199 });
  const ardisik = i({ mod: 'ardisik', fiyat: 1000, oran: 30, oran2: 20, oran3: 0 });
  const uclu = i({ mod: 'ardisik', fiyat: 2000, oran: 50, oran2: 20, oran3: 10 });
  return {
    ...exampleVars('indirim.o1', i({ mod: 'fiyat', fiyat: 1250, oran: 15 })),
    'indirim.o2.indirim': tl(oran.indirim),
    'indirim.o2.oran': pct(oran.oran / 100),
    'indirim.o3.ara': tl(ardisik.adimlar![0].sonra),
    'indirim.o3.son': tl(ardisik.indirimli),
    'indirim.o3.indirim': tl(ardisik.indirim),
    'indirim.o3.etkin': pct(ardisik.oran / 100),
    'indirim.o4.ara1': tl(uclu.adimlar![0].sonra),
    'indirim.o4.ara2': tl(uclu.adimlar![1].sonra),
    'indirim.o4.son': tl(uclu.indirimli),
    'indirim.o4.etkin': pct(uclu.oran / 100),
  };
}
