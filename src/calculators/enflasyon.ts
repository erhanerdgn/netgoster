import { z } from 'zod';
import { endeksAt, ILK_AY, SON_AY } from '../config/tufeEndeks.ts';
import { round2, zMoney } from './common.ts';

const AYLAR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
/** "2026-10" → "Ekim 2026" */
export const ayAdi = (ym: string) => `${AYLAR[Number(ym.slice(5)) - 1]} ${ym.slice(0, 4)}`;

const zAy = (label: string) => z.string({ error: `${label} seçin` }).regex(/^(1[0-2]|[1-9])$/, `${label} seçin`);
const zYil = (label: string) => z.string({ error: `${label} seçin` }).regex(/^\d{4}$/, `${label} seçin`);
const ym = (yil: string, ay: string) => `${yil}-${ay.padStart(2, '0')}`;
const veriVar = (a: string) => a >= ILK_AY && a <= SON_AY;
const veriMesaji = `TÜFE verisi ${ayAdi(ILK_AY)} – ${ayAdi(SON_AY)} arası için var`;

export const enflasyonSchema = z
  .object({
    tutar: zMoney('Tutar', { min: 0.01 }),
    /** Paranın ait olduğu ay ("1"–"12") ve yıl — seçim kutusu değeri olduğu için metin */
    basAy: zAy('Ay'),
    basYil: zYil('Yıl'),
    /** Karşılığı istenen ay ve yıl; başlangıçtan önce de olabilir (ters yön) */
    sonAy: zAy('Ay'),
    sonYil: zYil('Yıl'),
  })
  .refine((v) => veriVar(ym(v.basYil, v.basAy)), { path: ['basYil'], message: veriMesaji })
  .refine((v) => veriVar(ym(v.sonYil, v.sonAy)), { path: ['sonYil'], message: veriMesaji })
  .refine((v) => ym(v.basYil, v.basAy) !== ym(v.sonYil, v.sonAy), {
    path: ['sonYil'],
    message: 'Karşılaştırma için farklı bir ay seçin',
  });

export type EnflasyonInput = z.input<typeof enflasyonSchema>;
export type EnflasyonValues = z.output<typeof enflasyonSchema>;

export interface EnflasyonResult {
  /** Paranın ait olduğu ay (YYYY-MM) */
  bas: string;
  /** Karşılığı istenen ay (YYYY-MM) */
  son: string;
  endeksBas: number;
  endeksSon: number;
  /** Tutarın hedef aydaki karşılığı (kuruş) */
  karsilik: number;
  /** endeksSon / endeksBas */
  carpan: number;
  /** Hedef ay başlangıçtan önceyse true (geçmişe çevirme) */
  geriye: boolean;
  /** İki ay arasındaki ay sayısı (pozitif) */
  aySayisi: number;
  /** Eski aydan yeni aya kümülatif TÜFE değişimi — ondalık */
  donemEnflasyonu: number;
  /** Yıllık ortalama (bileşik) enflasyon — ondalık */
  yillikOrtalama: number;
  /** Eski aydaki paranın yeni aydaki satın alma gücü kaybı — ondalık */
  alimGucuKaybi: number;
}

/**
 * Karşılık = Tutar × Endeks(hedef ay) / Endeks(paranın ayı).
 * Dönem enflasyonu = Endeks(yeni) / Endeks(eski) − 1; yıllık ortalama = (1 + dönem)^(12 / ay sayısı) − 1;
 * satın alma gücü kaybı = 1 − Endeks(eski) / Endeks(yeni).
 */
export function calculateEnflasyon(v: EnflasyonValues): EnflasyonResult {
  const bas = ym(v.basYil, v.basAy);
  const son = ym(v.sonYil, v.sonAy);
  const endeksBas = endeksAt(bas)!;
  const endeksSon = endeksAt(son)!;
  const geriye = son < bas;
  const [eski, yeni] = geriye ? [endeksSon, endeksBas] : [endeksBas, endeksSon];
  const [eAy, yAy] = geriye ? [son, bas] : [bas, son];
  const aySayisi = (Number(yAy.slice(0, 4)) - Number(eAy.slice(0, 4))) * 12 + Number(yAy.slice(5)) - Number(eAy.slice(5));
  const donemEnflasyonu = yeni / eski - 1;
  return {
    bas,
    son,
    endeksBas,
    endeksSon,
    karsilik: round2((v.tutar * endeksSon) / endeksBas),
    carpan: endeksSon / endeksBas,
    geriye,
    aySayisi,
    donemEnflasyonu,
    yillikOrtalama: (1 + donemEnflasyonu) ** (12 / aySayisi) - 1,
    alimGucuKaybi: 1 - eski / yeni,
  };
}
