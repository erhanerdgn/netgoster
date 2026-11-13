import { z } from 'zod';
import { BOTAS_KWH_SM3, botasKonut, dogalgazKdv, dogalgazOtv, igdasSkb, istanbulKademeLimit } from '../config/enerji.ts';
import { valueAt } from '../config/period.ts';
import { round2, zMoney, zNumber } from './common.ts';

export const dogalgazTuketimiSchema = z
  .object({
    mod: z.enum(['m3', 'tl', 'kombi']),
    m3: zNumber('Tüketim', { max: 100000 }).optional(),
    butce: zMoney('Bütçe', { min: 1, max: 1e8 }).optional(),
    /** Kombi ısıl gücü, kW */
    guc: zNumber('Kombi gücü', { min: 1, max: 200 }).optional(),
    /** Günde tam güçte çalışma süresi, saat */
    saat: zNumber('Günlük çalışma süresi', { max: 24 }).optional(),
    /** Kombi verimi, % (üst ısıl değere göre) */
    verim: zNumber('Kombi verimi', { min: 50, max: 100 }),
    /** 1 m³ gazın kWh karşılığı (faturadaki k × üst ısıl değer) */
    faktor: zNumber('Dönüşüm katsayısı', { min: 8, max: 13 }),
    /** Kademe-1 birim fiyatı, KDV dahil TL/Sm³ */
    fiyat: zNumber('Birim fiyat', { min: 0.01, max: 1000 }),
    /** Kademe-2 birim fiyatı, KDV dahil TL/Sm³ */
    fiyat2: zNumber('Kademe-2 birim fiyatı', { min: 0.01, max: 1000 }),
    /** Aylık kademe limiti, Sm³ (boşsa kademe uygulanmaz) */
    limit: zNumber('Aylık kademe limiti', { max: 100000 }).optional(),
  })
  .refine((v) => v.mod !== 'm3' || v.m3 !== undefined, { message: 'Tüketimi girin', path: ['m3'] })
  .refine((v) => v.mod !== 'tl' || v.butce !== undefined, { message: 'Bütçeyi girin', path: ['butce'] })
  .refine((v) => v.mod !== 'kombi' || v.guc !== undefined, { message: 'Kombi gücünü girin', path: ['guc'] })
  .refine((v) => v.mod !== 'kombi' || v.saat !== undefined, { message: 'Günlük çalışma süresini girin', path: ['saat'] })
  .refine((v) => v.fiyat2 >= v.fiyat, { message: 'Kademe-2 fiyatı Kademe-1 fiyatından düşük olamaz', path: ['fiyat2'] });

export type DogalgazTuketimiInput = z.input<typeof dogalgazTuketimiSchema>;
export type DogalgazTuketimiValues = z.output<typeof dogalgazTuketimiSchema>;

export interface DogalgazFiyat {
  botas1: number;
  botas2: number;
  otv: number;
  skb: number;
  kdv: number;
  /** KDV dahil TL/Sm³ */
  k1: number;
  k2: number;
  /** İstanbul aylık kademe limiti, Sm³; kademe yoksa null */
  limit: number | null;
}

const r6 = (n: number) => Math.round(n * 1e6) / 1e6;

/** İstanbul (İGDAŞ) konut birim fiyatı: (BOTAŞ + ÖTV + sistem kullanım bedeli) × (1 + KDV) */
export function dogalgazFiyat(tarih: string): DogalgazFiyat {
  const b = valueAt(botasKonut, tarih);
  const otv = valueAt(dogalgazOtv, tarih);
  const skb = valueAt(igdasSkb, tarih);
  const kdv = valueAt(dogalgazKdv, tarih);
  return {
    botas1: b.k1,
    botas2: b.k2,
    otv,
    skb,
    kdv,
    k1: r6((b.k1 + otv + skb) * (1 + kdv)),
    k2: r6((b.k2 + otv + skb) * (1 + kdv)),
    limit: valueAt(istanbulKademeLimit, tarih),
  };
}

export interface DogalgazSonuc {
  /** Aylık (kombide 30 günlük) tüketim, m³ */
  m3: number;
  kwh: number;
  tl: number;
  kademe: 1 | 2;
  /** Uygulanan KDV dahil birim fiyat, TL/Sm³ ve TL/kWh */
  birimFiyat: number;
  tlKwh: number;
  kdvHaric: number;
  kdv: number;
  /** Bütçe modunda limit nedeniyle harcanamayan tutar */
  artan?: number;
  /** Kombi: günlük ısı ihtiyacı (kWh), günlük gaz (m³) ve günlük maliyet */
  isiGun?: number;
  m3Gun?: number;
  tlGun?: number;
}

/**
 * Fatura mantığı: kWh = m³ × katsayı; TL = kWh × (TL/Sm³ fiyatı / 10,64). Katsayı 10,64 iken TL = m³ × fiyat.
 * Kademe (BOTAŞ KFU Esasları md. 9.4): aylık tüketim limiti aşarsa o ayın TÜMÜ Kademe-2 fiyatından.
 * Kombi: günlük ısı = kW × saat; gaz enerjisi = ısı / verim; aylık = 30 gün.
 */
export function calculateDogalgaz(v: DogalgazTuketimiValues, kdvOran = valueAt(dogalgazKdv)): DogalgazSonuc {
  const m3Basi = (fiyat: number) => (v.faktor * fiyat) / BOTAS_KWH_SM3; // 1 m³'ün TL maliyeti
  const asar = (m3: number) => v.limit !== undefined && m3 > v.limit;
  let m3: number;
  let artan: number | undefined;
  let isiGun: number | undefined;
  let m3Gun: number | undefined;
  if (v.mod === 'tl') {
    const m1 = v.butce! / m3Basi(v.fiyat);
    if (!asar(m1)) m3 = m1;
    else {
      const m2 = v.butce! / m3Basi(v.fiyat2);
      if (asar(m2)) m3 = m2;
      else {
        // Bütçe limiti aşmaya yetmiyor ama Kademe-1'de limitten fazlasına da yetiyor: en fazla limit kadar kullanılabilir
        m3 = v.limit!;
        artan = round2(v.butce! - m3 * m3Basi(v.fiyat));
      }
    }
  } else if (v.mod === 'kombi') {
    isiGun = v.guc! * v.saat!;
    m3Gun = isiGun / (v.verim / 100) / v.faktor;
    m3 = m3Gun * 30;
  } else m3 = v.m3!;

  const kademe = asar(m3) ? 2 : 1;
  const birimFiyat = kademe === 2 ? v.fiyat2 : v.fiyat;
  const tl = v.mod === 'tl' && artan === undefined ? v.butce! : round2(m3 * m3Basi(birimFiyat));
  const kdvHaric = round2(tl / (1 + kdvOran));
  const res: DogalgazSonuc = {
    m3,
    kwh: m3 * v.faktor,
    tl,
    kademe,
    birimFiyat,
    tlKwh: birimFiyat / BOTAS_KWH_SM3,
    kdvHaric,
    kdv: round2(tl - kdvHaric),
  };
  if (artan !== undefined) res.artan = artan;
  if (m3Gun !== undefined) {
    res.isiGun = isiGun;
    res.m3Gun = m3Gun;
    res.tlGun = round2(m3Gun * m3Basi(birimFiyat));
  }
  return res;
}
