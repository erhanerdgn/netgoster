import { z } from 'zod';
import { dayNumber, zDate } from './common.ts';
import { anniversary, gunAdi, ymd } from './tarih.ts';

export const yasSchema = z
  .object({
    dogum: zDate('Doğum tarihi'),
    tarih: zDate('Hesap tarihi'),
  })
  .refine((v) => v.tarih >= v.dogum, { path: ['tarih'], message: 'Hesap tarihi doğum tarihinden önce olamaz' });

export type YasInput = z.input<typeof yasSchema>;

export interface YasResult {
  yas: { years: number; months: number; days: number };
  toplamGun: number;
  toplamHafta: { weeks: number; days: number };
  toplamAy: number;
  toplamSaat: number;
  dogumGunu: string;
  bugunDogumGunu: boolean;
  sonrakiDogumGunu: string;
  sonrakiGunAdi: string;
  kalanGun: number;
  sonrakiYas: number;
  /** 29 Şubat doğumlu */
  subat29: boolean;
}

/**
 * Yaş = doğum tarihinden hesap tarihine kadar dolan tam yıl/ay/gün.
 * 29 Şubat doğumlular artık olmayan yıllarda yaşlarını 1 Mart'ta doldurur (bir önceki gün olan 28 Şubat henüz dolmamıştır).
 */
export function calculateYas(v: z.output<typeof yasSchema>): YasResult {
  const d = ymd(v.dogum, v.tarih);
  const toplamGun = dayNumber(v.tarih) - dayNumber(v.dogum);
  const bugunDogumGunu = d.totalMonths % 12 === 0 && d.days === 0 && toplamGun > 0;
  const sonraki = bugunDogumGunu ? v.tarih : anniversary(v.dogum, (d.years + 1) * 12);
  return {
    yas: { years: d.years, months: d.months, days: d.days },
    toplamGun,
    toplamHafta: { weeks: Math.floor(toplamGun / 7), days: toplamGun % 7 },
    toplamAy: d.totalMonths,
    toplamSaat: toplamGun * 24,
    dogumGunu: gunAdi(v.dogum),
    bugunDogumGunu,
    sonrakiDogumGunu: sonraki,
    sonrakiGunAdi: gunAdi(sonraki),
    kalanGun: dayNumber(sonraki) - dayNumber(v.tarih),
    sonrakiYas: bugunDogumGunu ? d.years : d.years + 1,
    subat29: v.dogum.slice(5) === '02-29',
  };
}
