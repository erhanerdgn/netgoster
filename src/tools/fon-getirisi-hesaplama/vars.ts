import { calculateFonGetirisi, fonGetirisiSchema } from '../../calculators/fonGetirisi.ts';
import { addDays } from '../../calculators/common.ts';
import { fonStopaj } from '../../config/parameters-2026.ts';
import { valueAt } from '../../config/period.ts';
import { date, exampleVars, pct } from '../../content/vars.ts';

/** content.md: güncel oranlar ve oran geçmişi tablosu fonStopaj serisinden; örneklerde alış = derleme gününden 1 yıl önce. */
export default function vars(today: string) {
  const g = valueAt(fonStopaj, today);
  const alis = addDays(today, -365);
  const f = (v: object) => calculateFonGetirisi(fonGetirisiSchema.parse({ yontem: 'fiyat', alis, satis: today, ...v }));
  const o1 = f({ tur: 'indirimli', tutar: 100000, alisFiyat: 1.25, satisFiyat: 1.6 });
  const o2 = f({ tur: 'hisse', tutar: 100000, alisFiyat: 1.25, satisFiyat: 1.6 });
  const o3 = calculateFonGetirisi(
    fonGetirisiSchema.parse({ tur: 'diger', yontem: 'oran', oran: 35, tutar: 250000, alis: today, satis: addDays(today, 182) }),
  );

  const tablo = fonStopaj
    .filter((p) => p.from >= '2020-12-23')
    .map(
      (p) =>
        `| ${date(p.from)} – ${p.to ? date(p.to) : 'bugün'} | ${pct(p.value.indirimli)} | ${pct(p.value.diger)} | ${pct(p.value.hisse)} |`,
    )
    .join('\n');

  return {
    'fon.oran.indirimli': pct(g.indirimli),
    'fon.oran.diger': pct(g.diger),
    'fon.oran.hisse': pct(g.hisse),
    'fon.oran.gsyf': pct(g.gsyfGyf),
    'fon.tablo': tablo,
    ...exampleVars('fon.o1', o1),
    'fon.o1.stopajOran': pct(o1.stopajOran),
    'fon.o1.netDonemsel': pct(o1.netDonemsel),
    ...exampleVars('fon.o2', o2),
    ...exampleVars('fon.o3', o3),
    'fon.o3.stopajOran': pct(o3.stopajOran),
    'fon.o3.netYillik': pct(o3.netYillik),
  };
}
