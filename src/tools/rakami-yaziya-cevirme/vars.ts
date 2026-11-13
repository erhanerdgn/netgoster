import { calculateRakamYazi, rakamYaziSchema, type RakamYaziInput } from '../../calculators/rakamYazi.ts';

const yaz = (sayi: string, v: Partial<RakamYaziInput> = {}) =>
  calculateRakamYazi(rakamYaziSchema.parse({ sayi, yazim: 'ayri', birim: 'TL', harf: 'kucuk', ...v }));

const POPULER = [
  '1',
  '10',
  '100',
  '1.000',
  '1.500',
  '2026',
  '5.000',
  '10.000',
  '25.000',
  '100.000',
  '250.000',
  '1.000.000',
  '1.250.000',
  '1.000.000.000',
];

export default function vars() {
  const tablo = POPULER.map((s) => {
    const sayi = yaz(s, { birim: 'sayi' });
    return `| ${s} | ${sayi.ayri} | ${yaz(s).cek} |`;
  }).join('\n');
  const o1 = yaz('12.450,50', { harf: 'cumle' });
  const o2 = yaz('2.750.000,75', { harf: 'cumle' });
  const o3 = yaz('1.249,995', { harf: 'cumle' });
  const o4 = yaz('1.250,40', { birim: 'USD', harf: 'cumle' });
  return {
    'ry.tablo': tablo,
    'ry.o1.ayri': o1.ayri,
    'ry.o1.cek': o1.cek,
    'ry.o1.buyuk': yaz('12.450,50', { harf: 'buyuk', yazim: 'cek' }).cek,
    'ry.o1.kelime': yaz('12.450,50', { harf: 'kelime', yazim: 'cek' }).cek,
    'ry.o2.ayri': o2.ayri,
    'ry.o2.cek': o2.cek,
    'ry.o3.rakam': o3.rakam,
    'ry.o3.ayri': o3.ayri,
    'ry.o4.ayri': o4.ayri,
    'ry.o4.cek': o4.cek,
    'ry.yil': yaz('2026', { birim: 'sayi', harf: 'cumle' }).ayri,
    'ry.ondalik': yaz('3,05', { birim: 'sayi', harf: 'cumle' }).ayri,
    'ry.bin': yaz('1.000', { birim: 'sayi' }).ayri,
    'ry.binbir': yaz('1.001', { birim: 'sayi' }).ayri,
    'ry.milyon': yaz('1.000.000', { birim: 'sayi' }).ayri,
    'ry.milyonbin': yaz('1.001.000', { birim: 'sayi' }).ayri,
    'ry.yuzbir': yaz('101', { birim: 'sayi' }).ayri,
    'ry.katrilyon': yaz('1.000.000.000.000.000', { birim: 'sayi' }).ayri,
    'ry.eksi': yaz('-15', { birim: 'sayi', harf: 'cumle' }).ayri,
  };
}
