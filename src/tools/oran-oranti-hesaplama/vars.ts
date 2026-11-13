import { calculateOranOranti, oranOrantiSchema, type OranOrantiInput, type SadeSonucu } from '../../calculators/oranOranti.ts';

const n = (v: number) => new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 4 }).format(v);
const x = (v: OranOrantiInput) => (calculateOranOranti(oranOrantiSchema.parse(v)) as { x: number }).x;
const sade = (a: number, b: number) => calculateOranOranti(oranOrantiSchema.parse({ mod: 'sadelestir', a, b })) as SadeSonucu;

const SADE: [number, number, string][] = [
  [1920, 1080, 'Full HD ekran çözünürlüğü'],
  [2560, 1440, 'QHD ekran çözünürlüğü'],
  [3840, 2160, '4K UHD ekran çözünürlüğü'],
  [1024, 768, 'Eski monitör / tablet'],
  [6000, 4000, 'Fotoğraf makinesi (24 MP)'],
  [24, 36, 'Sınıfta kız : erkek'],
  [45, 60, 'Dakika : saat'],
  [250, 1000, 'Gram : kilogram'],
  [1.5, 2.25, 'Ondalıklı oran'],
];

export default function vars() {
  const tablo = SADE.map(([a, b, aciklama]) => {
    const s = sade(a, b);
    return `| ${n(a)} : ${n(b)} | ${aciklama} | ${n(s.ebob)} | **${n(s.p)} : ${n(s.q)}** |`;
  }).join('\n');
  const s1 = sade(1.5, 2.25);
  return {
    'oo.o1': n(x({ mod: 'dogru', a: 3, b: 150, c: 5 })),
    'oo.o1k': n(150 / 3),
    'oo.tarif': n(x({ mod: 'dogru', a: 4, b: 250, c: 6 })),
    'oo.tarifSut': n(x({ mod: 'dogru', a: 4, b: 200, c: 6 })),
    'oo.isci': n(x({ mod: 'ters', a: 6, b: 10, c: 4 })),
    'oo.hiz': n(x({ mod: 'ters', a: 90, b: 4, c: 120 })),
    'oo.haritaCm': n(x({ mod: 'dogru', a: 1, b: 25000, c: 8 })),
    'oo.tersHata': new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 1 }).format(x({ mod: 'dogru', a: 6, b: 10, c: 4 })),
    'oo.isciGun': n(6 * 10),
    'oo.yol': n(90 * 4),
    'oo.harita': n(x({ mod: 'dogru', a: 1, b: 25000, c: 8 }) / 100000),
    'oo.yakit': n(x({ mod: 'dogru', a: 100, b: 6.5, c: 420 })),
    'oo.musluk': n(x({ mod: 'ters', a: 3, b: 8, c: 2 })),
    'oo.s1.ebob': n(s1.ebob),
    'oo.s1.p': n(s1.p),
    'oo.s1.q': n(s1.q),
    'oo.sadeTablo': tablo,
  };
}
