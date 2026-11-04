import { calculateKiraArtis, kiraArtisSchema } from '../../calculators/kiraArtis.ts';
import { tufe } from '../../config/tufe.ts';
import { exampleVars } from '../../content/vars.ts';

const AY = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

/** content.md örnekleri: en son açıklanan TÜFE ayının ertesi ayında yapılan yenileme. */
export default function vars() {
  const son = tufe[tufe.length - 1].ay;
  const y = Number(son.slice(0, 4));
  const m = Number(son.slice(5));
  const yen = m === 12 ? { ay: '1', yil: String(y + 1) } : { ay: String(m + 1), yil: String(y) };
  const k = (v: object) => calculateKiraArtis(kiraArtisSchema.parse(v));
  const o3 = k({ tur: 'konut', kira: 15000, ay: '3', yil: '2024' });
  return {
    'kira.yenilemeAy': `${AY[Number(yen.ay) - 1]} ${yen.yil}`,
    ...exampleVars('kira.o1', k({ tur: 'konut', kira: 20000, ...yen })),
    ...exampleVars('kira.o2', k({ tur: 'isyeri', kira: 45000, ...yen })),
    ...exampleVars('kira.o3', o3),
    'kira.o3.tufe': '%' + new Intl.NumberFormat('tr-TR').format(o3.tufeOrani),
  };
}
