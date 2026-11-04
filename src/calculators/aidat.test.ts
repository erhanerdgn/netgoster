import { describe, expect, it } from 'vitest';
import { aidatSchema, calculateAidat } from './aidat.ts';

const run = (v: object) => calculateAidat(aidatSchema.parse(v));
const daireler = (n: number) => Array.from({ length: n }, (_, i) => ({ ad: `D${i + 1}` }));
const sum = (xs: number[]) => Math.round(xs.reduce((s, x) => s + x * 100, 0)) / 100;

describe('aidat paylaştırma', () => {
  it('eşit, tam bölünen: 12.000 / 6 = 2.000; yıllık 24.000', () => {
    const r = run({ giderModu: 'toplam', toplamGider: 12000, yontem: 'esit', daireler: daireler(6) });
    expect(r.satirlar.map((s) => s.aylik)).toEqual([2000, 2000, 2000, 2000, 2000, 2000]);
    expect(r.satirlar[0].yillik).toBe(24000);
    expect(r.artikDaire).toBe(-1);
  });

  it('eşit, kuruş artığı: 10.000 / 3 = 3.333,33 × 3 = 9.999,99 → +0,01 son daireye (3.333,34)', () => {
    const r = run({ giderModu: 'toplam', toplamGider: 10000, yontem: 'esit', daireler: daireler(3) });
    expect(r.satirlar.map((s) => s.aylik)).toEqual([3333.33, 3333.33, 3333.34]);
    expect(r.artikDaire).toBe(2);
    expect(r.satirlar[2].artikKurus).toBe(1);
    expect(sum(r.satirlar.map((s) => s.aylik))).toBe(10000);
  });

  it('arsa payı: 9.000 ₺, paylar 2/3/4 (toplam 9) → 2.000 / 3.000 / 4.000', () => {
    const r = run({
      giderModu: 'toplam',
      toplamGider: 9000,
      yontem: 'arsa',
      daireler: [{ arsaPayi: 2 }, { arsaPayi: 3 }, { arsaPayi: 4 }],
    });
    expect(r.satirlar.map((s) => s.aylik)).toEqual([2000, 3000, 4000]);
    expect(r.satirlar[2].oran).toBeCloseTo(4 / 9, 12);
  });

  it('m², artık en büyük paya: 1.000 ₺; 70/70/100 m² (240) → 291,666→291,67 ×2 + 416,666→416,67 = 1.000,01 → büyük daireye −0,01 (416,66)', () => {
    const r = run({
      giderModu: 'toplam',
      toplamGider: 1000,
      yontem: 'm2',
      daireler: [{ m2: 70 }, { m2: 70 }, { m2: 100 }],
    });
    expect(r.satirlar.map((s) => s.aylik)).toEqual([291.67, 291.67, 416.66]);
    expect(r.artikDaire).toBe(2);
    expect(r.satirlar[2].artikKurus).toBe(-1);
    expect(sum(r.satirlar.map((s) => s.aylik))).toBe(1000);
  });

  it('kalem listesi: 4.500 + 2.750,50 + 1.250 = 8.500,50; 7 daire eşit → 1.214,36 ×6 = 7.286,16, son daire 1.214,34', () => {
    const r = run({
      giderModu: 'kalem',
      kalemler: [
        { ad: 'Kapıcı', tutar: 4500 },
        { ad: 'Elektrik', tutar: 2750.5 },
        { ad: 'Temizlik', tutar: 1250 },
      ],
      yontem: 'esit',
      daireler: daireler(7),
    });
    // 850050 kuruş / 7 = 121435,71 → 121436; 7 × 121436 = 850052 → fark −2 kuruş son daireye
    expect(r.toplamAylik).toBe(8500.5);
    expect(r.satirlar[0].aylik).toBe(1214.36);
    expect(r.satirlar[6].aylik).toBe(1214.34);
    expect(sum(r.satirlar.map((s) => s.aylik))).toBe(8500.5);
    expect(r.toplamYillik).toBe(102006);
  });

  it('arsa payı seçilip pay girilmezse şema ilgili daire için hata verir', () => {
    const p = aidatSchema.safeParse({
      giderModu: 'toplam',
      toplamGider: 1000,
      yontem: 'arsa',
      daireler: [{ arsaPayi: 5 }, {}],
    });
    expect(p.success).toBe(false);
    expect(p.error?.issues[0].path).toEqual(['daireler', 1, 'arsaPayi']);
  });

  it('isim boşsa "Daire n" adı verilir', () => {
    const r = run({ giderModu: 'toplam', toplamGider: 100, yontem: 'esit', daireler: [{ ad: ' ' }, { ad: 'Zemin' }] });
    expect(r.satirlar.map((s) => s.ad)).toEqual(['Daire 1', 'Zemin']);
  });
});
