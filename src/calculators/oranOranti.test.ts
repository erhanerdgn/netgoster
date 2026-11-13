import { describe, expect, it } from 'vitest';
import { calculateOranOranti, ebob, oranOrantiSchema, type OranOrantiInput, type SadeSonucu } from './oranOranti.ts';

const h = (v: OranOrantiInput) => calculateOranOranti(oranOrantiSchema.parse(v));

describe('oran orantı', () => {
  it('doğru orantı: 3 kg 150 TL ise 5 kg kaç TL?', () => {
    // x = 150 × 5 ÷ 3 = 250; birim fiyat k = 150 ÷ 3 = 50
    expect(h({ mod: 'dogru', a: 3, b: 150, c: 5 })).toEqual({ mod: 'dogru', x: 250, k: 50 });
  });

  it('doğru orantı ondalıklı: 4 kişilik tarifte 250 g un, 6 kişi', () => {
    // x = 250 × 6 ÷ 4 = 375
    expect(h({ mod: 'dogru', a: 4, b: 250, c: 6 })).toMatchObject({ x: 375, k: 62.5 });
    // 0,1 × 3 ÷ 1 kayan noktada 0,30000000000000004 olur → 0,3
    expect(h({ mod: 'dogru', a: 1, b: 0.1, c: 3 })).toMatchObject({ x: 0.3 });
  });

  it('ters orantı: 6 işçi 10 günde, 4 işçi kaç günde?', () => {
    // 6 × 10 = 60 işçi-gün; x = 60 ÷ 4 = 15
    expect(h({ mod: 'ters', a: 6, b: 10, c: 4 })).toEqual({ mod: 'ters', x: 15, k: 60 });
  });

  it('ters orantı: 90 km/sa 4 saat, 120 km/sa kaç saat?', () => {
    // 90 × 4 = 360 km; 360 ÷ 120 = 3
    expect(h({ mod: 'ters', a: 90, b: 4, c: 120 })).toMatchObject({ x: 3 });
  });

  it('sadeleştirme: 24 : 36 → 2 : 3 (EBOB 12)', () => {
    const r = h({ mod: 'sadelestir', a: 24, b: 36 }) as SadeSonucu;
    expect(r).toMatchObject({ p: 2, q: 3, ebob: 12, carpan: 1 });
    expect(r.ondalik).toBeCloseTo(0.666666666667, 10);
    expect(r.payA).toBeCloseTo(0.4, 10); // 24 ÷ 60
  });

  it('sadeleştirme ondalıklı: 1,5 : 2,25 → ×100 → 150 : 225 → 2 : 3 (EBOB 75)', () => {
    expect(h({ mod: 'sadelestir', a: 1.5, b: 2.25 })).toMatchObject({ p: 2, q: 3, ebob: 75, carpan: 100 });
  });

  it('aralarında asal sayılar sadeleşmez: 7 : 9', () => {
    expect(h({ mod: 'sadelestir', a: 7, b: 9 })).toMatchObject({ p: 7, q: 9, ebob: 1 });
  });

  it('EBOB', () => {
    expect(ebob(48n, 18n)).toBe(6n);
    expect(ebob(17n, 5n)).toBe(1n);
  });

  it('sıfır payda hata verir', () => {
    expect(oranOrantiSchema.safeParse({ mod: 'dogru', a: 0, b: 5, c: 2 }).success).toBe(false);
    expect(oranOrantiSchema.safeParse({ mod: 'ters', a: 3, b: 5, c: 0 }).success).toBe(false);
    expect(oranOrantiSchema.safeParse({ mod: 'sadelestir', a: 0, b: 5 }).success).toBe(false);
    // doğru orantıda b = 0 geçerli: x = 0
    expect(h({ mod: 'dogru', a: 2, b: 0, c: 5 })).toMatchObject({ x: 0 });
  });
});
