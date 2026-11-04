import { describe, expect, it } from 'vitest';
import { calculateYakit, yakitSchema } from './yakit.ts';

const run = (v: object) => calculateYakit(yakitSchema.parse(v));

describe('yakıt maliyeti', () => {
  it('450 km, 6,5 L/100 km, 50 ₺/L: 29,25 L × 50 = 1.462,50 ₺; km başı 3,25', () => {
    expect(run({ mesafe: 450, tuketim: 6.5, fiyat: 50 })).toEqual({
      toplamKm: 450,
      litre: 29.25,
      tutar: 1462.5,
      kmBasi: 3.25,
      kisiBasi: 1462.5,
    });
  });

  it('gidiş-dönüş iki katı: 2 × 450 = 900 km, 58,5 L, 2.925 ₺; 3 kişi → 975 ₺', () => {
    expect(run({ mesafe: 450, tuketim: 6.5, fiyat: 50, gidisDonus: true, kisi: 3 })).toMatchObject({
      toplamKm: 900,
      litre: 58.5,
      tutar: 2925,
      kisiBasi: 975,
    });
  });

  it('küsuratlı: 123 km × 7,3 / 100 = 8,979 L; × 47,89 = 430,00431 → 430,00 ₺; km başı 3,50 (430/123 = 3,4959)', () => {
    const r = run({ mesafe: 123, tuketim: 7.3, fiyat: 47.89 });
    expect(r.litre).toBe(8.98);
    expect(r.tutar).toBe(430);
    expect(r.kmBasi).toBe(3.5);
  });

  it('kişi başı yuvarlama: 100 ₺ / 3 = 33,33 ₺ (100 km, 4 L/100, 25 ₺/L)', () => {
    expect(run({ mesafe: 100, tuketim: 4, fiyat: 25, kisi: 3 })).toMatchObject({ tutar: 100, kisiBasi: 33.33 });
  });

  it('kısa mesafe: 1 km × 10 L/100 km = 0,1 L × 42,5 = 4,25 ₺', () => {
    expect(run({ mesafe: 1, tuketim: 10, fiyat: 42.5 })).toMatchObject({ litre: 0.1, tutar: 4.25, kmBasi: 4.25 });
  });

  it('kişi sayısı tam sayı olmalı, mesafe 0 olamaz', () => {
    expect(yakitSchema.safeParse({ mesafe: 10, tuketim: 5, fiyat: 40, kisi: 1.5 }).success).toBe(false);
    expect(yakitSchema.safeParse({ mesafe: 0, tuketim: 5, fiyat: 40 }).success).toBe(false);
  });
});
