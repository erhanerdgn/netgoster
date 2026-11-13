import {
  calculateSaat,
  gunMetni,
  HAFTALIK_SINIR_DK,
  saatSchema,
  sureMetin,
  sureSSDD,
  type AraResult,
  type EkleResult,
  type ToplaResult,
} from '../../calculators/saatHesaplama.ts';
import { isKanunu } from '../../config/parameters-2026.ts';
import { pct } from '../../content/vars.ts';

const n2 = (v: number) => new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 2 }).format(v);
const ara = (baslangic: string, bitis: string, mola = 0) =>
  calculateSaat(saatSchema.parse({ mod: 'ara', baslangic, bitis, mola })) as AraResult;

const VARDIYALAR: [string, string, number][] = [
  ['08:00', '17:00', 60],
  ['08:30', '18:00', 60],
  ['09:00', '18:00', 60],
  ['08:00', '16:00', 30],
  ['16:00', '00:00', 30],
  ['00:00', '08:00', 30],
  ['22:00', '06:00', 30],
  ['08:00', '20:00', 60],
  ['20:00', '08:00', 60],
];
const DAKIKALAR = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

/** content.md: örnekler ve tablolar hesaplayıcıdan üretilir. */
export default function vars() {
  const gece = ara('22:30', '06:15');
  const geceMola = ara('22:30', '06:15', 30);
  const gunduz = ara('08:30', '17:45', 60);
  const ekle = calculateSaat(
    saatSchema.parse({ mod: 'ekle', saat: '23:30', islem: 'ekle', sureSaat: 2, sureDakika: 15 }),
  ) as EkleResult;
  const hafta = calculateSaat(
    saatSchema.parse({
      mod: 'topla',
      sureler: [
        { saat: 8, dakika: 30 },
        { saat: 9, dakika: 15 },
        { saat: 9 },
        { saat: 9, dakika: 45 },
        { saat: 8 },
        { saat: 5, dakika: 30 },
      ],
    }),
  ) as ToplaResult;

  const vardiya = VARDIYALAR.map(([b, s, m]) => {
    const brut = ara(b, s);
    const net = ara(b, s, m);
    return `| ${b} – ${s} | ${sureMetin(brut.net)} | ${m} dk | ${sureMetin(net.net)} | ${n2(net.net / 60)} |`;
  }).join('\n');
  const dakika = DAKIKALAR.map((d) => `| ${d} dakika | ${n2(d / 60)} saat |`).join('\n');

  return {
    'sh.haftalik': String(HAFTALIK_SINIR_DK / 60),
    'sh.zam': pct(isKanunu.fazlaMesaiZam),
    'sh.zamFs': pct(isKanunu.fazlaSurelerZam),
    'sh.gece': sureMetin(gece.net),
    'sh.gece.dk': String(gece.net),
    'sh.geceMola': sureMetin(geceMola.net),
    'sh.geceMola.ondalik': n2(geceMola.net / 60),
    'sh.gunduz.brut': sureMetin(gunduz.brut),
    'sh.gunduz': sureMetin(gunduz.net),
    'sh.gunduz.ondalik': n2(gunduz.net / 60),
    'sh.ekle.sonuc': ekle.sonuc,
    'sh.ekle.gun': gunMetni(ekle.gunFarki),
    'sh.hafta.toplam': sureMetin(hafta.toplam),
    'sh.hafta.ssdd': sureSSDD(hafta.toplam),
    'sh.hafta.fazla': sureMetin(hafta.fazla),
    'sh.tablo.vardiya': vardiya,
    'sh.tablo.dakika': dakika,
  };
}
