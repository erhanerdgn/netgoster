import { describe, expect, it } from 'vitest';
import { calculateKdv, kdvSchema, yasalKdvOranlari } from './kdv.ts';

const run = (v: object) => calculateKdv(kdvSchema.parse(v), '2026-11-04');

describe('KDV', () => {
  it('yasal oranlar %1 / %10 / %20', () => {
    expect(yasalKdvOranlari('2026-11-04')).toEqual([1, 10, 20]);
  });

  it('hariçten dahile %20: 1.000 → KDV 200, dahil 1.200', () => {
    expect(run({ yon: 'haricten', tutar: 1000, oran: '2' })).toEqual({ oran: 20, haric: 1000, kdv: 200, dahil: 1200 });
  });

  it('dahilden hariçe %20: 1.200 / 1,2 = 1.000, KDV 200', () => {
    expect(run({ yon: 'dahilden', tutar: 1200, oran: '2' })).toEqual({ oran: 20, haric: 1000, kdv: 200, dahil: 1200 });
  });

  it('dahilden hariçe %10 küsuratlı: 99,99 / 1,1 = 90,9000 → 90,90; KDV 9,09', () => {
    const r = run({ yon: 'dahilden', tutar: 99.99, oran: '1' });
    expect(r.haric).toBe(90.9);
    expect(r.kdv).toBe(9.09);
    expect(r.haric + r.kdv).toBeCloseTo(99.99, 10);
  });

  it('dahilden hariçe %20 yuvarlamalı: 100 / 1,2 = 83,333… → 83,33; KDV 16,67 (toplam 100)', () => {
    const r = run({ yon: 'dahilden', tutar: 100, oran: '2' });
    expect(r.haric).toBe(83.33);
    expect(r.kdv).toBe(16.67);
  });

  it('hariçten dahile %1: 1.234,56 × 0,01 = 12,3456 → 12,35; dahil 1.246,91', () => {
    expect(run({ yon: 'haricten', tutar: 1234.56, oran: '0' })).toMatchObject({ kdv: 12.35, dahil: 1246.91 });
  });

  it('hariçten dahile %10: 45,45 × 0,1 = 4,545 → 4,55 (yarım kuruş yukarı)', () => {
    expect(run({ yon: 'haricten', tutar: 45.45, oran: '1' })).toMatchObject({ kdv: 4.55, dahil: 50 });
  });

  it('diğer oran %18: dahil 118 → hariç 100, KDV 18', () => {
    expect(run({ yon: 'dahilden', tutar: 118, oran: 'diger', digerOran: 18 })).toMatchObject({ haric: 100, kdv: 18 });
  });

  it('diğer oran seçilip oran girilmezse şema hata verir', () => {
    expect(kdvSchema.safeParse({ yon: 'haricten', tutar: 100, oran: 'diger' }).success).toBe(false);
  });
});
