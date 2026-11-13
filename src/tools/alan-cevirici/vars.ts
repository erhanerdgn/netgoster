import { cevir, ESKI_DONUM_M2, mdTablo, sayiTR } from '../../calculators/birim.ts';

const a = (x: number, k: string, h: string) => sayiTR(cevir('alan', x, k, h));
const n = (x: number) => sayiTR(x);

export default function vars() {
  return {
    'alan.donumM2': a(1, 'donum', 'm2'),
    'alan.haDonum': a(1, 'ha', 'donum'),
    'alan.haM2': a(1, 'ha', 'm2'),
    'alan.km2Ha': a(1, 'km2', 'ha'),
    'alan.km2Donum': a(1, 'km2', 'donum'),
    'alan.acreM2': a(1, 'acre', 'm2'),
    'alan.acreDonum': sayiTR(cevir('alan', 1, 'acre', 'donum'), 4),
    'alan.m2Ft2': sayiTR(cevir('alan', 1, 'm2', 'ft2'), 4),
    'alan.eski': n(ESKI_DONUM_M2),
    'alan.eskiEvlek': sayiTR(ESKI_DONUM_M2 / 4, 4),
    'alan.eskiFark': sayiTR(1000 - ESKI_DONUM_M2, 3),
    'alan.eski5': sayiTR((5 * ESKI_DONUM_M2) / 1000, 4),
    // Örnekler
    'alan.o1': a(3750, 'm2', 'donum'),
    'alan.o2': a(2.5, 'ha', 'donum'),
    'alan.o2m2': a(2.5, 'ha', 'm2'),
    'alan.o3': a(120, 'm2', 'ft2'),
    'alan.tablo.donum': mdTablo(
      ['Dönüm', 'm²', 'Hektar', 'Ar'],
      [0.5, 1, 2, 5, 10, 20, 50].map((d) => [n(d), a(d, 'donum', 'm2'), a(d, 'donum', 'ha'), a(d, 'donum', 'ar')]),
    ),
    'alan.tablo.m2': mdTablo(
      ['m²', 'Dönüm (dekar)', 'Hektar'],
      [500, 1000, 2500, 5000, 10000, 25000].map((m) => [n(m), a(m, 'm2', 'donum'), a(m, 'm2', 'ha')]),
    ),
    'alan.tablo.ha': mdTablo(
      ['Hektar', 'Dönüm', 'm²', 'Akre'],
      [1, 2, 5, 10, 100].map((h) => [n(h), a(h, 'ha', 'donum'), a(h, 'ha', 'm2'), sayiTR(cevir('alan', h, 'ha', 'acre'), 4)]),
    ),
  };
}
