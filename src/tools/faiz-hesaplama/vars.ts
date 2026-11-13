import { calculateFaiz, faizSchema } from '../../calculators/faiz.ts';
import { pct, tl } from '../../content/vars.ts';

/** content.md örnekleri ve popüler değer tabloları hesaplayıcıdan üretilir (tarihten bağımsız). */
export default function vars() {
  const f = (v: object) =>
    calculateFaiz(faizSchema.parse({ mod: 'faiz', tur: 'basit', donem: 'yillik', anapara: 100000, sureBirim: 'yil', ...v }));
  const num = (n: number, d = 2) => new Intl.NumberFormat('tr-TR', { maximumFractionDigits: d }).format(n);

  const o1b = f({ oran: 40, sure: 1 });
  const o1a = f({ tur: 'bilesik', donem: 'aylik', oran: 40, sure: 12, sureBirim: 'ay' });
  const o2 = f({ mod: 'sure', tur: 'bilesik', donem: 'aylik', oran: 45, hedef: 250000 });
  const o3 = f({ mod: 'oran', tur: 'bilesik', sure: 3, hedef: 300000 });
  const g = f({ tur: 'bilesik', donem: 'gunluk', oran: 40, sure: 1 });

  const tablo = [30, 40, 50]
    .flatMap((oran) =>
      [1, 3, 5].map((sure) => {
        const b = f({ oran, sure });
        const y = f({ tur: 'bilesik', oran, sure });
        const a = f({ tur: 'bilesik', donem: 'aylik', oran, sure });
        return `| %${oran} | ${sure} yıl | ${tl(b.vadeSonu)} | ${tl(y.vadeSonu)} | ${tl(a.vadeSonu)} |`;
      }),
    )
    .join('\n');

  const kural72 = [10, 20, 30, 40, 50, 72]
    .map((oran) => {
      const r = f({ tur: 'bilesik', oran, sure: 1 });
      return `| %${oran} | ${num(r.kural72!)} yıl | ${num(r.ikiKat!)} yıl |`;
    })
    .join('\n');

  return {
    'faiz.o1.basit': tl(o1b.vadeSonu),
    'faiz.o1.basitFaiz': tl(o1b.faiz),
    'faiz.o1.aylik': tl(o1a.vadeSonu),
    'faiz.o1.aylikFaiz': tl(o1a.faiz),
    'faiz.o1.efektif': pct(o1a.efektif),
    'faiz.o1.fark': tl(o1a.vadeSonu - o1b.vadeSonu),
    'faiz.gunluk.efektif': pct(g.efektif),
    'faiz.o2.yil': num(o2.yil),
    'faiz.o2.ay': num(o2.yil * 12, 1),
    'faiz.o3.oran': '%' + num(o3.oran),
    'faiz.tablo': tablo,
    'faiz.kural72': kural72,
  };
}
