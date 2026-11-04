import { describe, expect, it } from 'vitest';
import { calculateIndirim, indirimSchema } from './indirim.ts';

const run = (v: object) => calculateIndirim(indirimSchema.parse(v));

describe('indirim hesaplama', () => {
  it('indirimli fiyat: 1.250 × (1 − 0,15) = 1.062,50; indirim 187,50', () => {
    expect(run({ mod: 'fiyat', fiyat: 1250, oran: 15 })).toMatchObject({ indirimli: 1062.5, indirim: 187.5, oran: 15 });
  });

  it('kuruş yuvarlama: 99,99 × 0,67 = 66,9933 → 66,99', () => {
    expect(run({ mod: 'fiyat', fiyat: 99.99, oran: 33 })).toMatchObject({ indirimli: 66.99, indirim: 33 });
  });

  it('indirim oranı: 1.500 → 1.199 = 301 / 1.500 = %20,07', () => {
    const r = run({ mod: 'oran', fiyat: 1500, yeni: 1199 });
    expect(r.indirim).toBe(301);
    expect(r.oran).toBeCloseTo(20.0667, 4);
  });

  it('yeni fiyat yüksekse oran negatif (zam): 100 → 120 = −%20', () => {
    expect(run({ mod: 'oran', fiyat: 100, yeni: 120 }).oran).toBe(-20);
  });

  it('ardışık %30 + %20: 1.000 → 700 → 560, etkin oran %44 (basit toplam %50 değil)', () => {
    const r = run({ mod: 'ardisik', fiyat: 1000, oran: 30, oran2: 20, oran3: 0 });
    expect(r.adimlar?.map((a) => a.sonra)).toEqual([700, 560]);
    expect(r.oran).toBe(44);
    expect(r.basitToplam).toBe(50);
    expect(r.indirim).toBe(440);
  });

  it('üç kademe %50 + %20 + %10: 2.000 → 1.000 → 800 → 720, etkin %64', () => {
    const r = run({ mod: 'ardisik', fiyat: 2000, oran: 50, oran2: 20, oran3: 10 });
    expect(r.indirimli).toBe(720);
    expect(r.oran).toBe(64);
  });

  it('%100 indirim bedava; %100 üstü reddedilir', () => {
    expect(run({ mod: 'fiyat', fiyat: 500, oran: 100 }).indirimli).toBe(0);
    expect(indirimSchema.safeParse({ mod: 'fiyat', fiyat: 500, oran: 120 }).success).toBe(false);
  });
});
