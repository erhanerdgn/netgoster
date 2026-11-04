import { z } from 'zod';
import { eytBagkurMemur, eytSsk, gecis1999, yeniSistem } from '../config/emeklilik.ts';
import { todayISO } from '../config/period.ts';
import { addDays, dayNumber, fromDayNumber, ymdDiff, zDate, zNumber } from './common.ts';

export const EYT_SINIR = '1999-09-08'; // bu tarihten ÖNCE giriş: EYT (7438 s. K.)
export const YENI_SISTEM = '2008-05-01'; // bu tarih ve sonrası giriş: 5510 md. 28

export const emeklilikSchema = z
  .object({
    tur: z.enum(['4a', '4b', '4c'], { error: 'Sigorta türünü seçin' }),
    cinsiyet: z.enum(['kadin', 'erkek'], { error: 'Cinsiyet seçin' }),
    dogum: zDate('Doğum tarihi'),
    giris: zDate('İlk sigorta giriş tarihi'),
    primGun: zNumber('Prim günü', { max: 20000, int: true }),
    yillikGun: zNumber('Yıllık prim günü', { max: 360, int: true }).default(360),
  })
  .superRefine((v, ctx) => {
    const today = todayISO();
    if (v.dogum >= today) ctx.addIssue({ code: 'custom', path: ['dogum'], message: 'Doğum tarihi bugünden önce olmalı' });
    if (v.giris <= v.dogum)
      ctx.addIssue({ code: 'custom', path: ['giris'], message: 'Sigorta giriş tarihi doğum tarihinden sonra olmalı' });
    else if (v.giris > today) ctx.addIssue({ code: 'custom', path: ['giris'], message: 'Sigorta giriş tarihi gelecekte olamaz' });
    else if (v.primGun > dayNumber(today) - dayNumber(v.giris) + 1)
      ctx.addIssue({
        code: 'custom',
        path: ['primGun'],
        message: 'Prim günü, giriş tarihinden bugüne geçen gün sayısını aşamaz',
      });
  });

export type EmeklilikInput = z.input<typeof emeklilikSchema>;

export interface Sart {
  tip: 'yas' | 'gun' | 'sure';
  gerekli: number;
  mevcut: number;
  saglandi: boolean;
  /** Şartın sağlandığı / sağlanacağı tarih. null: tahmin edilemez (yıllık prim günü 0) */
  tarih: string | null;
}

export interface Yol {
  ad: string;
  sartlar: Sart[];
  /** Tüm şartların sağlandığı tarih (en geç olanı). null: tahmin edilemez */
  tarih: string | null;
}

export type Donem = 'eyt' | 'gecis' | 'yeni';

export interface EmeklilikResult {
  donem: Donem;
  eyt: boolean;
  mevzuat: string;
  yollar: Yol[];
  secilen: Yol;
  emeklilikTarihi: string | null;
  emekliOlabilir: boolean;
  eksikGun: number;
  /** Yaş şartı varsa bugünden yaşın dolacağı güne kalan süre; yoksa/sağlandıysa null */
  eksikYas: { years: number; months: number; days: number } | null;
  /** Emeklilik tarihindeki yaş (tam yıl) */
  emeklilikYasi: number | null;
  mevcutYas: number;
  sigortalilikYil: number;
  /** Yeni sistemde gün şartının tamamlanacağı tahmini yıl (yaş tablosu satırı) */
  tamamlanmaYili: number | null;
}

/** ISO tarihe n yıl ekler (29 Şubat → 1 Mart) */
export function addYears(iso: string, n: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  return fromDayNumber(Math.floor(Date.UTC(y + n, m - 1, d) / 86400000));
}

/** 506 geçici 81/B kademeli prim günü (08.09.1999 öncesi 4/a) */
export function eytSskGun(cinsiyet: 'kadin' | 'erkek', giris: string): number {
  const t = eytSsk[cinsiyet];
  if (giris <= t.eskiSinir) return t.kademeler[0].gun;
  return (t.kademeler.find((k) => giris <= k.until) ?? t.kademeler[t.kademeler.length - 1]).gun;
}

/** md. 28 yaş tablosu: gün şartının tamamlandığı yıla göre yaş */
export function yeniSistemYas(cinsiyet: 'kadin' | 'erkek', yil: number): number {
  const row = yeniSistem.yasTablosu.find(([ub]) => yil <= ub)!;
  return cinsiyet === 'kadin' ? row[1] : row[2];
}

const maxDate = (a: string | null, b: string | null) => (a === null || b === null ? null : a > b ? a : b);

/**
 * Emeklilik şartları (src/config/emeklilik.ts):
 * - Giriş < 08.09.1999 → EYT: yaş yok. 4/a kademeli gün + kadın 20 / erkek 25 yıl sigortalılık; 4/b-4/c kadın 7200 / erkek 9000 gün.
 * - 08.09.1999 – 30.04.2008 → 5510 geçici 9 (4/a için ayrıca 25 yıl + 4500 gün alternatifi, aynı yaşla).
 * - 01.05.2008 ve sonrası → 5510 md. 28: yaş, gün şartının tamamlandığı yıla göre kademeli.
 * Eksik gün, bugünden itibaren yılda `yillikGun` prim günü (365 takvim gününe yayılmış) ödeneceği varsayımıyla tamamlanır.
 */
export function calculateEmeklilik(input: z.output<typeof emeklilikSchema>, today = todayISO()): EmeklilikResult {
  const { tur, cinsiyet, dogum, giris, primGun, yillikGun } = input;
  const kadin = cinsiyet === 'kadin';
  const sigortalilik = ymdDiff(giris, today);

  const gunSart = (gerekli: number): Sart => {
    const eksik = Math.max(0, gerekli - primGun);
    const tarih = eksik === 0 ? today : yillikGun > 0 ? addDays(today, Math.ceil((eksik / yillikGun) * 365)) : null;
    return { tip: 'gun', gerekli, mevcut: primGun, saglandi: eksik === 0, tarih };
  };
  const yasSart = (yas: number): Sart => {
    const tarih = addYears(dogum, yas);
    return { tip: 'yas', gerekli: yas, mevcut: ymdDiff(dogum, today).years, saglandi: tarih <= today, tarih };
  };
  const sureSart = (yil: number): Sart => {
    const tarih = addYears(giris, yil);
    return { tip: 'sure', gerekli: yil, mevcut: sigortalilik.years, saglandi: tarih <= today, tarih };
  };
  const yol = (ad: string, sartlar: Sart[]): Yol => ({
    ad,
    sartlar,
    tarih: sartlar.reduce<string | null>((acc, s) => maxDate(acc, s.tarih), today),
  });

  let donem: Donem;
  let mevzuat: string;
  let yollar: Yol[];
  let tamamlanmaYili: number | null = null;

  if (giris < EYT_SINIR) {
    donem = 'eyt';
    if (tur === '4a') {
      mevzuat = '506 s. K. geçici 81/B + 7438 s. K. (EYT)';
      yollar = [yol('EYT (yaş şartı yok)', [gunSart(eytSskGun(cinsiyet, giris)), sureSart(eytSsk[cinsiyet].sureYil)])];
    } else {
      mevzuat = tur === '4b' ? '1479 s. K. geçici 10 + 7438 s. K. (EYT)' : '5434 s. K. geçici 205 + 7438 s. K. (EYT)';
      yollar = [yol('EYT (yaş şartı yok)', [gunSart(eytBagkurMemur[cinsiyet].gun)])];
    }
  } else if (giris < YENI_SISTEM) {
    donem = 'gecis';
    mevzuat = '5510 s. K. geçici 9';
    const g = gecis1999[tur];
    const yas = kadin ? g.yasK : g.yasE;
    yollar = [yol('Yaş + prim günü', [yasSart(yas), gunSart(g.gun)])];
    if ('alternatif' in g)
      yollar.push(
        yol(`${g.alternatif.sureYil} yıl sigortalılık + ${g.alternatif.gun.toLocaleString('tr-TR')} gün`, [
          yasSart(yas),
          gunSart(g.alternatif.gun),
          sureSart(g.alternatif.sureYil),
        ]),
      );
  } else {
    donem = 'yeni';
    mevzuat = '5510 s. K. md. 28';
    const gun = gunSart(yeniSistem.gun[tur]);
    tamamlanmaYili = Number((gun.tarih ?? today).slice(0, 4));
    yollar = [yol('Yaş + prim günü', [yasSart(yeniSistemYas(cinsiyet, tamamlanmaYili)), gun])];
  }

  // En erken tarihli yol (null = sonsuz); eşitlikte ilk yol
  const secilen = yollar.reduce((a, b) => (b.tarih !== null && (a.tarih === null || b.tarih < a.tarih) ? b : a));
  const gs = secilen.sartlar.find((s) => s.tip === 'gun')!;
  const ys = secilen.sartlar.find((s) => s.tip === 'yas');
  return {
    donem,
    eyt: donem === 'eyt',
    mevzuat,
    yollar,
    secilen,
    emeklilikTarihi: secilen.tarih,
    emekliOlabilir: secilen.sartlar.every((s) => s.saglandi),
    eksikGun: Math.max(0, gs.gerekli - primGun),
    eksikYas: ys && !ys.saglandi && ys.tarih ? ymdDiff(today, ys.tarih) : null,
    emeklilikYasi: secilen.tarih ? ymdDiff(dogum, secilen.tarih).years : null,
    mevcutYas: ymdDiff(dogum, today).years,
    sigortalilikYil: sigortalilik.years,
    tamamlanmaYili,
  };
}
