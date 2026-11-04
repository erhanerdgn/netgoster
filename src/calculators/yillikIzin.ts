import { z } from 'zod';
import { isKanunu } from '../config/parameters-2026.ts';
import { dayNumber, fromDayNumber, ymdDiff, zDate } from './common.ts';

export const yillikIzinSchema = z
  .object({
    giris: zDate('İşe giriş tarihi'),
    dogum: zDate('Doğum tarihi'),
    tarih: zDate('Hesap tarihi'),
    yerAlti: z.boolean().default(false),
  })
  .refine((v) => v.tarih >= v.giris, { path: ['tarih'], message: 'Hesap tarihi işe giriş tarihinden önce olamaz' })
  .refine((v) => v.dogum < v.giris, { path: ['dogum'], message: 'Doğum tarihi işe giriş tarihinden önce olmalı' });

export type YillikIzinInput = z.input<typeof yillikIzinSchema>;

/** Girişten n yıl sonraki gün (29 Şubat → artık olmayan yılda 1 Mart) */
export function yilDonumu(giris: string, n: number): string {
  const [y, m, d] = giris.split('-').map(Number);
  return fromDayNumber(Math.floor(Date.UTC(y + n, m - 1, d) / 86400000));
}

/** İK md. 53: kıdem yılına göre gün; 18 yaş ve altı / 50 yaş ve üstüne en az 20; yer altı işlerinde +4. */
export function izinGunu(kidemYil: number, yas: number, yerAlti: boolean): number {
  const k = isKanunu;
  const kademe = [...k.yillikIzin].reverse().find((s) => kidemYil >= s.minYil);
  if (!kademe) return 0;
  let gun = kademe.gun;
  if (yas <= k.izinYasAlt || yas >= k.izinYasUst) gun = Math.max(gun, k.izinYasMinGun);
  return gun + (yerAlti ? k.yerAltiEk : 0);
}

/** İzin hakkı her yıl dönümünde doğar; yaş, hakkın doğduğu gündeki yaştır. */
export function calculateYillikIzin(input: z.output<typeof yillikIzinSchema>) {
  const kidem = ymdDiff(input.giris, input.tarih);
  const yasAt = (t: string) => ymdDiff(input.dogum, t).years;
  const hak = (n: number) => izinGunu(n, yasAt(yilDonumu(input.giris, n)), input.yerAlti);
  const n = kidem.years;
  let toplamHak = 0;
  for (let i = 1; i <= n; i++) toplamHak += hak(i);
  const sonraki = yilDonumu(input.giris, n + 1);
  return {
    kidem,
    kidemYil: n,
    yas: yasAt(input.tarih),
    gun: hak(n),
    sonHakEdis: n >= 1 ? yilDonumu(input.giris, n) : null,
    sonrakiHakEdis: sonraki,
    sonrakiGun: hak(n + 1),
    kalanGun: dayNumber(sonraki) - dayNumber(input.tarih),
    toplamHak,
  };
}
