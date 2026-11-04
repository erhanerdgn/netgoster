import { z } from 'zod';
import { tapu } from '../config/parameters-2026.ts';
import { todayISO, valueAt } from '../config/period.ts';
import { round2, zMoney, zNumber } from './common.ts';

export const tapuHarciSchema = z.object({
  bedel: zMoney('Satış bedeli', { min: 1 }),
  /** Emlak vergisi (rayiç) değeri — boş/0 ise yalnız beyan esas alınır */
  emlakDegeri: zMoney('Emlak vergisi değeri').default(0),
  odeme: z.enum(['ayri', 'alici']).default('ayri'),
  katsayi: zNumber('Yöresel katsayı', { min: 0.1, max: 5 }).default(1),
  adet: zNumber('Taşınmaz sayısı', { min: 1, max: 500, int: true }).default(1),
  /** Kat mülkiyeti / kat irtifaklı bağımsız bölüm (daire, dükkân) mü? */
  bagimsizBolum: z.boolean().default(true),
});

export type TapuHarciInput = z.input<typeof tapuHarciSchema>;
export type TapuHarciValues = z.output<typeof tapuHarciSchema>;

export interface TapuHarciResult {
  /** Harca esas değer = max(beyan, emlak vergisi değeri) */
  matrah: number;
  matrahEmlakDegeri: boolean;
  /** 10 TL'ye kadar kesirler atılmış matrah */
  harcMatrahi: number;
  aliciOran: number;
  saticiOran: number;
  aliciHarc: number;
  saticiHarc: number;
  toplamHarc: number;
  donerIlk: number;
  donerIlave: number;
  doner: number;
  /** Ödeme yöntemine göre alıcının ve satıcının toplam ödemesi (döner sermaye alıcıda) */
  aliciToplam: number;
  saticiToplam: number;
  genelToplam: number;
}

/**
 * Tapu harcı (492 s. K. md. 63 ve (4) s. tarife I/20-a): alıcı ve satıcı ayrı ayrı binde 20.
 * Matrah, beyan edilen bedeldir; emlak vergisi değerinden az olamaz (md. 63/2). 10 TL'ye kadar kesirler alınmaz.
 * Döner sermaye (TKGM tarifesi, KDV dahil): gösterge × yöresel katsayı. Kat mülkiyetli/irtifaklı her bağımsız
 * bölüm için tam ücret; diğer taşınmazlarda ilk taşınmaz tam, ilave her taşınmaz için ilave gösterge × katsayı.
 */
export function calculateTapuHarci(input: TapuHarciValues, today: string = todayISO()): TapuHarciResult {
  const t = valueAt(tapu, today);
  const emlak = input.emlakDegeri ?? 0;
  const matrah = Math.max(input.bedel, emlak);
  const harcMatrahi = Math.floor(matrah / 10) * 10;
  const aliciHarc = round2(harcMatrahi * t.aliciOran);
  const saticiHarc = round2(harcMatrahi * t.saticiOran);
  const tam = round2(t.donerGosterge * input.katsayi);
  const ilave = round2(t.donerIlave * input.katsayi);
  const donerIlave = input.bagimsizBolum ? 0 : ilave;
  const doner = input.bagimsizBolum ? round2(tam * input.adet) : round2(tam + ilave * (input.adet - 1));
  const toplamHarc = round2(aliciHarc + saticiHarc);
  const aliciToplam = round2((input.odeme === 'alici' ? toplamHarc : aliciHarc) + doner);
  const saticiToplam = input.odeme === 'alici' ? 0 : saticiHarc;
  return {
    matrah,
    matrahEmlakDegeri: emlak > input.bedel,
    harcMatrahi,
    aliciOran: t.aliciOran,
    saticiOran: t.saticiOran,
    aliciHarc,
    saticiHarc,
    toplamHarc,
    donerIlk: tam,
    donerIlave,
    doner,
    aliciToplam,
    saticiToplam,
    genelToplam: round2(aliciToplam + saticiToplam),
  };
}
