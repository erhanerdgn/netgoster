import { calculateUniversite, universiteSchema, yokDonusum } from '../../calculators/universiteOrtalama.ts';
import { universite } from '../../config/sinavlar.ts';

const f = (n: number) => new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

export default function vars(): Record<string, string> {
  const run = (v: object) => calculateUniversite(universiteSchema.parse(v));
  const d = (harf: string, kredi: number) => ({ harf, kredi });
  const dersler = [d('BA', 6), d('CB', 6), d('AA', 5), d('BB', 4), d('CC', 3), d('BA', 2)];
  const prev = { oncekiGano: 2.85, oncekiKredi: 90 };
  const o1 = run({ dersler });
  const o2 = run({ dersler, ...prev });
  const o3 = run({ dersler: [d('DD', 6), d('FD', 5), d('FF', 4), d('DC', 5)] });
  const out: Record<string, string> = {
    'uni.kaynak': universite.source,
    'uni.harfTablosu': [
      '| Harf notu | Katsayı | 100’lük karşılığı (YÖK) |',
      '| --- | ---: | ---: |',
      ...universite.letters.map(
        (l) => `| ${l.letter} | ${f(l.point)} | ${yokDonusum(l.point) === null ? 'tabloda yok' : f(yokDonusum(l.point)!)} |`,
      ),
    ].join('\n'),
    'uni.o1.agirlikli': f(o1.donemAgirlikli),
    'uni.o1.kredi': String(o1.donemKredi),
    'uni.o1.ort': f(o1.donemOrt),
    'uni.o1.yuzluk': f(o1.yuzluk!),
    'uni.o2.toplamKredi': String(o2.toplamKredi),
    'uni.o2.gano': f(o2.gano!),
    'uni.o2.yuzluk': f(o2.yuzluk!),
    'uni.o2.oncekiAgirlikli': f(prev.oncekiGano * prev.oncekiKredi),
    'uni.o3.ort': f(o3.donemOrt),
    'uni.o3.yuzluk': o3.yuzluk === null ? 'tabloda yok' : f(o3.yuzluk),
  };
  for (const g of [2, 3, 3.5]) out[`uni.y${g * 100}`] = f(yokDonusum(g)!);
  return out;
}
