import { calculateKpss, kpssSchema } from '../../calculators/kpss.ts';
import { kpss } from '../../config/sinavlar.ts';

const f = (n: number, d = 2) => new Intl.NumberFormat('tr-TR', { maximumFractionDigits: d }).format(n);

export default function vars(): Record<string, string> {
  const run = (tur: string, gy: object, gk: object) => calculateKpss(kpssSchema.parse({ tur, dy: { gy, gk } }));
  const o1 = run('P3', { d: 45, y: 12 }, { d: 40, y: 16 });
  const o2 = run('P94', { d: 38, y: 14 }, { d: 30, y: 18 });
  const o3 = run('P3', { d: 52, y: 6 }, { d: 48, y: 10 });
  const out: Record<string, string> = {
    'kpss.yil': String(kpss.year),
    'kpss.kYil': String(kpss.year - 2),
    'kpss.kaynak': kpss.source,
    'kpss.o1.puan': f(o1.puan!, 3),
    'kpss.o2.net': f(o2.toplamNet),
    'kpss.o2.puan': f(o2.puan!, 3),
    'kpss.o3.net': f(o3.toplamNet),
    'kpss.o3.puan': f(o3.puan!, 3),
    'kpss.p3.tam': f(kpss.types.P3.base + kpss.types.P3.perNet * (kpss.gy + kpss.gk), 1),
  };
  for (const k of Object.keys(kpss.types) as (keyof typeof kpss.types)[]) {
    out[`kpss.${k}.base`] = f(kpss.types[k].base);
    out[`kpss.${k}.per`] = f(kpss.types[k].perNet);
    out[`kpss.${k}.per10`] = f(kpss.types[k].perNet * 10, 1);
  }
  return out;
}
