import { alesSchema, alesTurleri, calculateAles } from '../../calculators/ales.ts';
import { ales } from '../../config/sinavlar.ts';

const f = (n: number, d = 3) => new Intl.NumberFormat('tr-TR', { maximumFractionDigits: d }).format(n);

export default function vars(): Record<string, string> {
  const run = (say: object, soz: object) => calculateAles(alesSchema.parse({ dy: { say, soz } }));
  const out: Record<string, string> = {
    'ales.yil': String(ales.year),
    'ales.kaynak': ales.source,
  };
  // Yer tutucu anahtarları ASCII olmalı (\w): SÖZ → SOZ
  const key = (k: string) => k.replace('Ö', 'O');
  for (const k of alesTurleri) {
    const t = ales.types[k];
    out[`ales.${key(k)}.base`] = f(t.base);
    out[`ales.${key(k)}.say`] = f(t.say);
    out[`ales.${key(k)}.soz`] = f(t.soz);
  }
  const ex = {
    o1: run({ d: 35, y: 8 }, { d: 40, y: 8 }),
    o2: run({ d: 20, y: 12 }, { d: 38, y: 6 }),
    o3: run({ d: 42, y: 4 }, { d: 22, y: 12 }),
  };
  for (const [o, r] of Object.entries(ex)) for (const k of alesTurleri) out[`ales.${o}.${key(k)}`] = f(r.puanlar[k]);
  return out;
}
