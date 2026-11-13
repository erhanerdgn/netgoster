import { ayakInc, cevir, ekranBoyutu, mdTablo as tablo, sayiTR } from '../../calculators/birim.ts';

const u = (x: number, a: string, b: string, h = 7) => sayiTR(cevir('uzunluk', x, a, b), h);
const d1 = (n: number, min = 0) =>
  new Intl.NumberFormat('tr-TR', { minimumFractionDigits: min, maximumFractionDigits: Math.max(1, min) }).format(n);

export default function vars() {
  const boy = ayakInc(1.75);
  const populer: [number, string, string, string][] = [
    [1, 'inc', 'cm', '1 inç'],
    [1, 'ft', 'cm', '1 feet (ayak)'],
    [5, 'ft', 'cm', '5 feet'],
    [6, 'ft', 'cm', '6 feet'],
    [1, 'yd', 'm', '1 yarda'],
    [1, 'm', 'ft', '1 metre'],
    [1, 'mil', 'km', '1 mil'],
    [1, 'km', 'mil', '1 km'],
    [10, 'km', 'mil', '10 km'],
    [1, 'dmil', 'km', '1 deniz mili'],
    [1, 'cm', 'inc', '1 cm'],
  ];
  const ad: Record<string, string> = { cm: 'cm', m: 'm', km: 'km', ft: 'feet', mil: 'mil', inc: 'inç' };
  return {
    'uz.inc': u(1, 'inc', 'cm'),
    'uz.ft': u(1, 'ft', 'cm'),
    'uz.5ft': u(5, 'ft', 'cm'),
    'uz.mil': u(1, 'mil', 'km'),
    'uz.kmMil': u(1, 'km', 'mil', 4),
    'uz.10kmMil': u(10, 'km', 'mil', 4),
    'uz.dmil': u(1, 'dmil', 'm'),
    'uz.175inc': u(175, 'cm', 'inc', 4),
    'uz.175ayak': String(boy.ayak),
    'uz.175kalan': d1(boy.inc),
    'uz.55cm': sayiTR(ekranBoyutu(55).kosegen, 4),
    'uz.55en': d1(ekranBoyutu(55).genislik),
    'uz.55boy': d1(ekranBoyutu(55).yukseklik),
    'uz.maraton': d1(cevir('uzunluk', 26.2, 'mil', 'km'), 2),
    'uz.12dmil': u(12, 'dmil', 'm'),
    'uz.12dmilKm': d1(cevir('uzunluk', 12, 'dmil', 'km')),
    'uz.5ft9': u(5 * 12 + 9, 'inc', 'cm'),
    'uz.5ft9ft': u(5 * 12 + 9, 'inc', 'ft'),
    'uz.59ft': d1(cevir('uzunluk', 5.9, 'ft', 'cm')),
    'uz.175ft': d1(cevir('uzunluk', 1.75, 'm', 'ft'), 2),
    'uz.mFt': d1(cevir('uzunluk', 1, 'm', 'ft'), 2),
    'uz.mKalan': d1(ayakInc(1).inc),
    'uz.tablo.populer': tablo(
      ['Değer', 'Karşılığı'],
      populer.map(([x, a, b, etiket]) => [etiket, `**${u(x, a, b)} ${ad[b]}**`]),
    ),
    'uz.tablo.boy': tablo(
      ['Boy (m)', 'cm', 'Ayak + inç', 'Toplam inç'],
      [1.6, 1.65, 1.7, 1.75, 1.8, 1.85, 1.9].map((m) => {
        const b = ayakInc(m);
        return [d1(m, 2), u(m, 'm', 'cm'), `${b.ayak}′ ${d1(b.inc)}″`, d1(cevir('uzunluk', m, 'm', 'inc'))];
      }),
    ),
    'uz.tablo.tv': tablo(
      ['Ekran', 'Köşegen', '16:9 genişlik × yükseklik'],
      [32, 40, 43, 50, 55, 65, 75, 85].map((i) => {
        const e = ekranBoyutu(i);
        return [`${i} inç`, `${sayiTR(e.kosegen)} cm`, `${d1(e.genislik)} × ${d1(e.yukseklik)} cm`];
      }),
    ),
  };
}
