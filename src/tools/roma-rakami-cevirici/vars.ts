import { adimlar, romaOku, toRoma } from '../../calculators/romaRakami.ts';

const POPULER = [
  ...Array.from({ length: 20 }, (_, i) => i + 1),
  40,
  50,
  90,
  100,
  400,
  500,
  900,
  1000,
  1453,
  1923,
  2000,
  2024,
  2025,
  2026,
];

const hata = (s: string) => {
  const r = romaOku(s);
  return 'hata' in r ? r.hata : '';
};

/** content.md: tablo ve örnek dökümler hesaplayıcıdan üretilir. */
export default function vars() {
  const dokum = (n: number) => {
    const a = adimlar(n);
    return `${n} = ${a.map((p) => p.deger).join(' + ')} = ${a.map((p) => p.roma).join(' + ')} = **${toRoma(n)}**`;
  };
  return {
    'rr.tablo': POPULER.map((n) => `| ${n} | ${toRoma(n)} |`).join('\n'),
    'rr.1987': dokum(1987),
    'rr.1453': dokum(1453),
    'rr.2026': dokum(2026),
    'rr.max': toRoma(3999),
    'rr.tarih': [29, 10, 1923].map(toRoma).join('.'),
    'rr.99': toRoma(99),
    'rr.49': toRoma(49),
    'rr.1999': toRoma(1999),
    'rr.hata.IIII': hata('IIII'),
    'rr.hata.IC': hata('IC'),
  };
}
