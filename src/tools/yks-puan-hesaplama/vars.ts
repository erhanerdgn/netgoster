import { calculateYks, yksSchema } from '../../calculators/yks.ts';
import { yks } from '../../config/sinavlar.ts';

const f = (n: number, d = 3) => new Intl.NumberFormat('tr-TR', { maximumFractionDigits: d }).format(n);

// Örnek 2–3: eşit ağırlık adayı — TYT 33/15/20/5 net, AYT Edebiyat 17, Tarih-1 6,5, Coğrafya-1 5, Mat 14
const eaDy = {
  tytTurkce: { d: 34, y: 4 },
  tytSosyal: { d: 16, y: 4 },
  tytMat: { d: 22, y: 8 },
  tytFen: { d: 6, y: 4 },
  aytEdebiyat: { d: 18, y: 4 },
  aytTarih1: { d: 7, y: 2 },
  aytCografya1: { d: 5, y: 0 },
  aytMat: { d: 16, y: 8 },
};

/** content.md: katsayılar sinavlar.ts'ten, örnekler hesaplayıcıdan */
export default function vars(): Record<string, string> {
  const run = (v: object) => calculateYks(yksSchema.parse(v));
  const out: Record<string, string> = {
    'yks.yil': String(yks.year),
    'yks.kYil': String(yks.year - 1),
    'yks.obp': f(yks.obpFactor, 2),
    'yks.obpYerlesen': f(yks.obpFactorPlaced, 2),
    'yks.obpMax': f(100 * 5 * yks.obpFactor, 2),
    'yks.obpMaxYerlesen': f(100 * 5 * yks.obpFactorPlaced, 2),
    'yks.base': f(yks.base),
    'yks.kaynak': yks.source,
  };
  // Katsayı tablosu: test → her puan türündeki net başına puan
  const label = new Map([...yks.tyt, ...yks.ayt, yks.ydt].map((t) => [t.key, `${t.label} (${t.questions})`]));
  const cols = ['TYT', 'SAY', 'EA', 'SÖZ', 'DİL'];
  const row = (k: string, isTyt: boolean) =>
    `| ${label.get(k)} | ${cols
      .map((c) => {
        const v = c === 'TYT' ? yks.coef.TYT[k] : isTyt ? yks.coef.tytPart[k] : yks.coef[c][k];
        return v === undefined ? '–' : f(v);
      })
      .join(' | ')} |`;
  out['yks.katsayiTablosu'] = [
    `| Test (soru) | ${cols.join(' | ')} |`,
    `| --- | ${cols.map(() => '---:').join(' | ')} |`,
    ...yks.tyt.map((t) => row(t.key, true)),
    ...[...yks.ayt, yks.ydt].map((t) => row(t.key, false)),
  ].join('\n');

  const pt = (r: ReturnType<typeof run>, tur: string) => r.puanlar.find((p) => p.tur === tur)!;
  // Örnek 1: sayısalcı (bkz. yks.test.ts)
  const o1 = run({
    dy: {
      tytTurkce: { d: 30, y: 8 },
      tytSosyal: { d: 15, y: 4 },
      tytMat: { d: 25, y: 8 },
      tytFen: { d: 10, y: 4 },
      aytMat: { d: 20, y: 8 },
      aytFizik: { d: 8, y: 4 },
      aytKimya: { d: 7, y: 4 },
      aytBiyoloji: { d: 9, y: 4 },
    },
    diploma: 85,
  });
  Object.assign(out, {
    'yks.o1.tytHam': f(pt(o1, 'TYT').ham),
    'yks.o1.tytYer': f(pt(o1, 'TYT').yerlestirme!),
    'yks.o1.sayHam': f(pt(o1, 'SAY').ham),
    'yks.o1.sayYer': f(pt(o1, 'SAY').yerlestirme!),
    'yks.o1.obpKatki': f(o1.obpKatkisi!),
  });
  // Örnek 2: eşit ağırlık, diploma 78
  const o2 = run({ dy: eaDy, diploma: 78 });
  Object.assign(out, {
    'yks.o2.tytHam': f(pt(o2, 'TYT').ham),
    'yks.o2.eaHam': f(pt(o2, 'EA').ham),
    'yks.o2.eaYer': f(pt(o2, 'EA').yerlestirme!),
    'yks.o2.obpKatki': f(o2.obpKatkisi!),
  });
  // Örnek 3: aynı netlerle önceki yıl yerleşmiş aday (OBP yarım)
  const o3 = run({ dy: eaDy, diploma: 78, yerlesti: true });
  Object.assign(out, {
    'yks.o3.eaYer': f(pt(o3, 'EA').yerlestirme!),
    'yks.o3.obpKatki': f(o3.obpKatkisi!),
  });
  return out;
}
