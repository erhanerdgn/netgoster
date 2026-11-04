import { calculateLgs, lgsSchema, lgsTaban } from '../../calculators/lgs.ts';
import { lgs } from '../../config/sinavlar.ts';

const f = (n: number, d = 2) => new Intl.NumberFormat('tr-TR', { maximumFractionDigits: d }).format(n);

export default function vars(): Record<string, string> {
  const run = (dy: object) => calculateLgs(lgsSchema.parse({ dy }));
  const o1 = run({
    turkce: { d: 18, y: 2 },
    mat: { d: 15, y: 3 },
    fen: { d: 17, y: 3 },
    inkilap: { d: 9, y: 1 },
    din: { d: 10, y: 0 },
    dil: { d: 8, y: 2 },
  });
  const o2 = run({
    turkce: { d: 14, y: 6 },
    mat: { d: 8, y: 9 },
    fen: { d: 12, y: 6 },
    inkilap: { d: 7, y: 3 },
    din: { d: 8, y: 2 },
    dil: { d: 6, y: 3 },
  });
  const full = { d: 20, y: 0 };
  const o3 = run({
    turkce: full,
    mat: { d: 19, y: 1 },
    fen: full,
    inkilap: { d: 10, y: 0 },
    din: { d: 10, y: 0 },
    dil: { d: 10, y: 0 },
  });
  return {
    'lgs.yil': String(lgs.year),
    'lgs.min': String(lgs.min),
    'lgs.max': String(lgs.max),
    'lgs.per4': f(lgs.perNet[4]),
    'lgs.per1': f(lgs.perNet[1]),
    'lgs.taban': f(lgsTaban),
    'lgs.tamPay': f(lgs.max - lgsTaban),
    'lgs.kaynak': lgs.source,
    'lgs.oran': f(lgs.perNet[4] / lgs.perNet[1], 1),
    'lgs.matKayip': f(3 * lgs.perNet[4], 1),
    'lgs.o1.net': f(o1.toplamNet),
    'lgs.o1.puan': f(o1.puan, 3),
    'lgs.o2.net': f(o2.toplamNet),
    'lgs.o2.puan': f(o2.puan, 3),
    'lgs.o3.puan': f(o3.puan, 3),
    'lgs.o3.kayip': f(lgs.max - o3.puan, 3),
  };
}
