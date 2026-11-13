import { cevir, mdTablo } from '../../calculators/birim.ts';

/** En fazla 2 ondalık, eksi işareti tipografik (−) */
const d = (x: number, h = 2) => new Intl.NumberFormat('tr-TR', { maximumFractionDigits: h }).format(x).replace('-', '−');
const s = (x: number, k: string, h: string, hane = 2) => d(cevir('sicaklik', x, k, h), hane);

export default function vars() {
  return {
    'sic.o1': s(25, 'C', 'F'),
    'sic.o2': s(350, 'F', 'C'),
    'sic.o2yuv': s(350, 'F', 'C', 0),
    'sic.o3': s(-18, 'C', 'F'),
    'sic.o3k': s(-18, 'C', 'K'),
    'sic.100F': s(100, 'C', 'F'),
    'sic.37F': s(37, 'C', 'F'),
    'sic.38F': s(38, 'C', 'F'),
    'sic.180F': s(180, 'C', 'F'),
    'sic.0K': s(0, 'C', 'K'),
    'sic.0R': s(0, 'C', 'R'),
    'sic.100K': s(100, 'C', 'K'),
    'sic.100R': s(100, 'C', 'R'),
    'sic.mutlakF': s(0, 'K', 'F'),
    'sic.100Fc': s(100, 'F', 'C'),
    'sic.tablo.populer': mdTablo(
      ['°C', '°F', 'K'],
      [-40, -18, 0, 20, 25, 30, 36.6, 37, 38, 39, 40, 100, 180, 200].map((c) => [d(c), `**${s(c, 'C', 'F')}**`, s(c, 'C', 'K')]),
    ),
    'sic.tablo.vucut': mdTablo(
      ['°C', '°F'],
      [35.5, 36, 36.5, 37, 37.5, 38, 38.5, 39, 39.5, 40, 41].map((c) => [d(c), s(c, 'C', 'F')]),
    ),
    'sic.tablo.firin': mdTablo(
      ['°C', '°F', 'Kullanım'],
      (
        [
          [140, 'Kurutma, beze'],
          [160, 'Kek, yavaş pişirme'],
          [180, 'Kek, kurabiye, çoğu tarif'],
          [200, 'Börek, fırında patates'],
          [220, 'Ekmek, pizza'],
          [250, 'Pizza, ızgara'],
        ] as const
      ).map(([c, not]) => [d(c), s(c, 'C', 'F', 0), not]),
    ),
    'sic.tablo.firinF': mdTablo(
      ['°F (tarifte)', '°C', 'Fırına ayarlayın'],
      [300, 325, 350, 375, 400, 425, 450].map((f) => [
        d(f),
        s(f, 'F', 'C', 1),
        `≈ ${d(Math.round(cevir('sicaklik', f, 'F', 'C') / 5) * 5)} °C`,
      ]),
    ),
  };
}
