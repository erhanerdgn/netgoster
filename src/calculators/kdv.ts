import { z } from 'zod';
import { kdvOranlari } from '../config/kdv.ts';
import { todayISO, valueAt } from '../config/period.ts';
import { round2, zMoney, zNumber } from './common.ts';

export const kdvSchema = z
  .object({
    yon: z.enum(['haricten', 'dahilden']),
    tutar: zMoney('Tutar', { min: 0.01 }),
    /** Yasal oran dizisindeki sıra: 0 = (I) sayılı liste, 1 = (II) sayılı liste, 2 = genel oran */
    oran: z.enum(['0', '1', '2', 'diger']),
    digerOran: zNumber('KDV oranı', { min: 0, max: 100 }).optional(),
  })
  .refine((v) => v.oran !== 'diger' || v.digerOran !== undefined, {
    path: ['digerOran'],
    message: 'KDV oranını girin',
  });

export type KdvInput = z.input<typeof kdvSchema>;

export interface KdvResult {
  /** Uygulanan oran, yüzde (20 = %20) */
  oran: number;
  haric: number;
  kdv: number;
  dahil: number;
}

/** Bugün geçerli yasal oranlar (yüzde): [1, 10, 20] */
export const yasalKdvOranlari = (date = todayISO()) => valueAt(kdvOranlari, date);

/**
 * KDV (3065 s. K. md. 28):
 * - Hariçten dahile: KDV = round2(hariç × oran), dahil = hariç + KDV.
 * - Dahilden hariçe: hariç = round2(dahil × 100 / (100 + oran)), KDV = dahil − hariç (hariç + KDV = dahil, kuruşu kuruşuna).
 */
export function calculateKdv(input: z.output<typeof kdvSchema>, date = todayISO()): KdvResult {
  const oran = input.oran === 'diger' ? (input.digerOran ?? 0) : yasalKdvOranlari(date)[Number(input.oran)];
  const tutar = round2(input.tutar);
  if (input.yon === 'haricten') {
    const kdv = round2((tutar * oran) / 100);
    return { oran, haric: tutar, kdv, dahil: round2(tutar + kdv) };
  }
  const haric = round2((tutar * 100) / (100 + oran));
  return { oran, haric, kdv: round2(tutar - haric), dahil: tutar };
}
