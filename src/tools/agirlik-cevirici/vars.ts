import { cevir, mdTablo, sayiTR } from '../../calculators/birim.ts';

const w = (x: number, k: string, h: string, a = 7) => sayiTR(cevir('agirlik', x, k, h), a);
/** Sabit en fazla `d` ondalık (tablolar için) */
const f = (x: number, k: string, h: string, d: number) =>
  new Intl.NumberFormat('tr-TR', { maximumFractionDigits: d }).format(cevir('agirlik', x, k, h));

export default function vars() {
  return {
    'ag.lbKg': w(1, 'lb', 'kg', 12),
    'ag.kgLb': w(1, 'kg', 'lb', 6),
    'ag.onsG': w(1, 'ons', 'g', 12),
    'ag.oztG': w(1, 'ozt', 'g', 12),
    'ag.ctG': w(1, 'ct', 'g'),
    'ag.stKg': w(1, 'st', 'kg', 12),
    'ag.kgOzt': w(1, 'kg', 'ozt', 6),
    'ag.oztOns': w(1, 'ozt', 'ons', 5),
    'ag.oztFark': sayiTR((cevir('agirlik', 1, 'ozt', 'ons') - 1) * 100, 3),
    'ag.100lb': w(100, 'lb', 'kg', 12),
    // Örnekler
    'ag.o1': f(150, 'lb', 'kg', 2),
    'ag.o2': f(8, 'ons', 'g', 2),
    'ag.o3': f(100, 'g', 'ozt', 3),
    'ag.o4': w(1.5, 'ct', 'mg'),
    'ag.o5': f(11, 'st', 'kg', 2),
    'ag.tablo.lb': mdTablo(
      ['Pound (lb)', 'Kilogram', 'Gram'],
      [1, 2, 5, 10, 20, 50, 100, 150, 200].map((x) => [sayiTR(x), f(x, 'lb', 'kg', 4), f(x, 'lb', 'g', 2)]),
    ),
    'ag.tablo.kg': mdTablo(
      ['Kilogram', 'Pound (lb)'],
      [1, 5, 10, 50, 70, 80, 100].map((x) => [sayiTR(x), f(x, 'kg', 'lb', 3)]),
    ),
    'ag.tablo.ons': mdTablo(
      ['Değer', 'Gram'],
      [
        ['1 ons (oz)', w(1, 'ons', 'g', 12)],
        ['4 ons', f(4, 'ons', 'g', 2)],
        ['8 ons', f(8, 'ons', 'g', 2)],
        ['16 ons (= 1 lb)', f(16, 'ons', 'g', 2)],
        ['1 troy ons (ozt)', w(1, 'ozt', 'g', 12)],
        ['10 troy ons', f(10, 'ozt', 'g', 2)],
        ['1 karat (ct)', w(1, 'ct', 'g')],
        ['1 stone (st)', `${w(1, 'st', 'kg', 12)} kg`],
      ].map(([a, b]) => [a, b.endsWith('kg') ? b : `${b} g`]),
    ),
  };
}
