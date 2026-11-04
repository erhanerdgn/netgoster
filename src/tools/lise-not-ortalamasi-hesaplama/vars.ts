import { calculateLise, liseSchema, gecmeKurali } from '../../calculators/liseOrtalama.ts';
import { lise } from '../../config/sinavlar.ts';

const f = (n: number, d = 4) => new Intl.NumberFormat('tr-TR', { maximumFractionDigits: d }).format(n);

export default function vars(): Record<string, string> {
  const run = (rows: [number, number][]) =>
    calculateLise(liseSchema.parse({ dersler: rows.map(([puan, saat]) => ({ puan, saat })), davranis100: true }));
  // Örnek 1: TDE 78,5×5, Mat 72×6, Fizik 81×2, Kimya 65×2, Biyoloji 88×2, Tarih 90×2, Coğrafya 84×2, Din 95×2, Dil 76×4, BE 100×2
  const o1 = run([
    [78.5, 5],
    [72, 6],
    [81, 2],
    [65, 2],
    [88, 2],
    [90, 2],
    [84, 2],
    [95, 2],
    [76, 4],
    [100, 2],
  ]);
  // Örnek 2: takdir — 92×5, 88×6, 85×4, 80×3
  const o2Rows: [number, number][] = [
    [92, 5],
    [88, 6],
    [85, 4],
    [80, 3],
  ];
  const o2 = run(o2Rows);
  // Örnek 3: iki zayıf — 45×6, 48×2, 70×5, 75×4, 80×3
  const o3 = run([
    [45, 6],
    [48, 2],
    [70, 5],
    [75, 4],
    [80, 3],
  ]);
  return {
    'lise.gecme': String(lise.passMark),
    'lise.ikinciDonem': String(lise.secondTermPass),
    'lise.tesekkur': f(lise.tesekkur, 2),
    'lise.takdir': f(lise.takdir, 2),
    'lise.takdirAlt': f(lise.takdir - 0.01, 2),
    'lise.dogrudanMax': String(gecmeKurali.dogrudanMaxBasarisiz),
    'lise.sorumluMax': String(gecmeKurali.sorumluMaxBasarisiz),
    'lise.toplamMax': String(gecmeKurali.toplamMaxSorumlu),
    'lise.olcek': [
      '| Puan | Derece |',
      '| --- | --- |',
      ...lise.scale.map((s, i) => `| ${s.min} – ${i === 0 ? 100 : f(lise.scale[i - 1].min - 0.01, 2)} | ${s.label} |`),
    ].join('\n'),
    'lise.kaynak': lise.source,
    'lise.o1.toplam': f(o1.agirlikliToplam, 2),
    'lise.o1.saat': String(o1.toplamSaat),
    'lise.o1.ort': f(o1.ortalama),
    'lise.o2.toplam': f(o2.agirlikliToplam, 2),
    'lise.o2.saat': String(o2.toplamSaat),
    'lise.o2.ort': f(o2.ortalama),
    'lise.o2.basit': f(o2Rows.reduce((t, [p]) => t + p, 0) / o2Rows.length, 2),
    'lise.o3.toplam': f(o3.agirlikliToplam, 2),
    'lise.o3.saat': String(o3.toplamSaat),
    'lise.o3.ort': f(o3.ortalama),
  };
}
