import { aidatSchema, calculateAidat } from '../../calculators/aidat.ts';
import { tl } from '../../content/vars.ts';

export default function vars() {
  const a = (v: object) => calculateAidat(aidatSchema.parse(v));
  const pay = [80, 80, 100, 100, 100, 100, 120, 120];
  const o2 = a({
    giderModu: 'toplam',
    toplamGider: 24000,
    yontem: 'arsa',
    daireler: pay.map((arsaPayi) => ({ arsaPayi })),
  });
  const o3 = a({ giderModu: 'toplam', toplamGider: 10000, yontem: 'esit', daireler: [{}, {}, {}] });
  const o1 = a({ giderModu: 'toplam', toplamGider: 15000, yontem: 'esit', daireler: Array(6).fill({}) });
  return {
    'aidat.ornek1.aylik': tl(o1.satirlar[0].aylik),
    'aidat.ornek1.yillik': tl(o1.satirlar[0].yillik),
    'aidat.ornek2.payToplam': String(pay.reduce((s, x) => s + x, 0)),
    'aidat.ornek2.d80': tl(o2.satirlar[0].aylik),
    'aidat.ornek2.d100': tl(o2.satirlar[2].aylik),
    'aidat.ornek2.d120': tl(o2.satirlar[6].aylik),
    'aidat.ornek2.d120yillik': tl(o2.satirlar[6].yillik),
    'aidat.ornek3.ilk': tl(o3.satirlar[0].aylik),
    'aidat.ornek3.son': tl(o3.satirlar[2].aylik),
  };
}
