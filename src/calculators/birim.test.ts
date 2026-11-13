import { describe, expect, it } from 'vitest';
import {
  alanSchema,
  ayakInc,
  cevir,
  cevirTumu,
  ekranBoyutu,
  indirmeSuresi,
  sayiTR,
  sicaklikSchema,
  sureTR,
  temizle,
  veriHedef,
  veriSchema,
} from './birim.ts';

const deger = (r: { id: string; deger: number }[], id: string) => r.find((k) => k.id === id)!.deger;

describe('sayiTR / temizle', () => {
  it('kayan nokta gürültüsü: 0,1 + 0,2 = 0,3; 7 anlamlı hane, binlik ayraç', () => {
    expect(temizle(0.1 + 0.2)).toBe(0.3);
    expect(sayiTR(0.1 + 0.2)).toBe('0,3');
    expect(sayiTR(1234567.891)).toBe('1.234.568'); // tam kısım yuvarlanmaz, ondalık atılır
    expect(sayiTR(100 / 2.54)).toBe('39,37008'); // 39,370078… → 7 anlamlı hane
    expect(sayiTR(0.0254)).toBe('0,0254');
  });

  it('çok küçük/büyük sayılar bilimsel gösterimle', () => {
    expect(sayiTR(1.234e-7)).toBe('1,234 × 10⁻⁷');
    expect(sayiTR(1e18)).toBe('1 × 10¹⁸');
    expect(sayiTR(0)).toBe('0');
  });
});

describe('uzunluk', () => {
  it('1 inç = 2,54 cm; 1 ft = 30,48 cm; 1 yd = 91,44 cm (1959 anlaşması, tam)', () => {
    expect(cevir('uzunluk', 1, 'inc', 'cm')).toBe(2.54);
    expect(cevir('uzunluk', 1, 'ft', 'cm')).toBe(30.48);
    expect(cevir('uzunluk', 1, 'yd', 'cm')).toBe(91.44);
  });

  it('1 mil = 1,609344 km; 1 deniz mili = 1,852 km; 1 km = 1 ÷ 1,609344 = 0,621371192 mil', () => {
    expect(cevir('uzunluk', 1, 'mil', 'km')).toBe(1.609344);
    expect(cevir('uzunluk', 1, 'dmil', 'km')).toBe(1.852);
    expect(cevir('uzunluk', 1, 'km', 'mil')).toBeCloseTo(0.621371192, 9);
  });

  it('5 feet = 5 × 30,48 = 152,4 cm; 100 cm = 100 ÷ 2,54 = 39,3700787 inç', () => {
    expect(cevir('uzunluk', 5, 'ft', 'cm')).toBe(152.4);
    expect(cevir('uzunluk', 100, 'cm', 'inc')).toBeCloseTo(39.3700787, 7);
  });

  it('boy: 1,75 m = 68,9 inç = 5′ 8,9″; 1,83 m = 72,05 → 72,0 inç = 6′ 0″ (12″ ayağa aktarılır)', () => {
    expect(ayakInc(1.75)).toEqual({ ayak: 5, inc: 8.9 });
    expect(ayakInc(1.83)).toEqual({ ayak: 6, inc: 0 });
  });

  it('55 inç 16:9 TV: köşegen 139,7 cm; genişlik 139,7 × 16 ÷ √337 = 121,76, yükseklik 68,49 cm', () => {
    const e = ekranBoyutu(55);
    expect(e.kosegen).toBe(139.7);
    expect(e.genislik).toBeCloseTo(121.759, 3);
    expect(e.yukseklik).toBeCloseTo(68.4895, 4);
  });

  it('tüm birimler döner; 0,3 m = 30 cm = 300 mm tam', () => {
    const r = cevirTumu('uzunluk', 0.1 + 0.2, 'm');
    expect(r).toHaveLength(9);
    expect(deger(r, 'cm')).toBe(30);
    expect(deger(r, 'mm')).toBe(300);
  });
});

describe('alan', () => {
  it('1 dönüm = 1000 m² = 1 dekar = 10 ar = 0,1 hektar', () => {
    const r = cevirTumu('alan', 1, 'donum');
    expect(deger(r, 'm2')).toBe(1000);
    expect(deger(r, 'dekar')).toBe(1);
    expect(deger(r, 'ar')).toBe(10);
    expect(deger(r, 'ha')).toBe(0.1);
  });

  it('1 hektar = 10 dönüm; 1 km² = 100 ha = 1000 dönüm', () => {
    expect(cevir('alan', 1, 'ha', 'donum')).toBe(10);
    expect(cevir('alan', 1, 'km2', 'ha')).toBe(100);
    expect(cevir('alan', 1, 'km2', 'donum')).toBe(1000);
  });

  it('2500 m² = 2,5 dönüm; 500 m² = 0,5 dönüm', () => {
    expect(cevir('alan', 2500, 'm2', 'donum')).toBe(2.5);
    expect(cevir('alan', 500, 'm2', 'donum')).toBe(0.5);
  });

  it('1 acre = 43.560 ft² = 4046,8564224 m² ≈ 4,047 dönüm', () => {
    expect(cevir('alan', 1, 'acre', 'm2')).toBe(4046.8564224);
    expect(cevir('alan', 1, 'acre', 'ft2')).toBe(43560);
    expect(cevir('alan', 1, 'acre', 'donum')).toBe(4.0468564224);
  });

  it('1 m² = 1 ÷ 0,09290304 = 10,7639104 ft²; 1 ft² = 929,0304 cm²', () => {
    expect(cevir('alan', 1, 'm2', 'ft2')).toBeCloseTo(10.7639104, 7);
    expect(cevir('alan', 1, 'ft2', 'cm2')).toBe(929.0304);
  });

  it('1 cm² = 100 mm²; negatif alan reddedilir', () => {
    expect(cevir('alan', 1, 'cm2', 'mm2')).toBe(100);
    expect(alanSchema.safeParse({ deger: -1, birim: 'm2' }).success).toBe(false);
    expect(alanSchema.safeParse({ deger: 1, birim: 'yok' }).success).toBe(false);
  });
});

describe('ağırlık', () => {
  it('1 lb = 0,45359237 kg (tam); 100 lb = 45,359237 kg', () => {
    expect(cevir('agirlik', 1, 'lb', 'kg')).toBe(0.45359237);
    expect(cevir('agirlik', 100, 'lb', 'kg')).toBe(45.359237);
  });

  it('1 kg = 1 ÷ 0,45359237 = 2,20462262 lb', () => {
    expect(cevir('agirlik', 1, 'kg', 'lb')).toBeCloseTo(2.20462262, 8);
  });

  it('1 oz = 28,349523125 g; 16 oz = 1 lb', () => {
    expect(cevir('agirlik', 1, 'ons', 'g')).toBe(28.349523125);
    expect(cevir('agirlik', 16, 'ons', 'lb')).toBe(1);
  });

  it('1 troy ons = 31,1034768 g; 1 kg = 1000 ÷ 31,1034768 = 32,1507466 ozt', () => {
    expect(cevir('agirlik', 1, 'ozt', 'g')).toBe(31.1034768);
    expect(cevir('agirlik', 1, 'kg', 'ozt')).toBeCloseTo(32.1507466, 7);
  });

  it('1 karat = 0,2 g = 200 mg; 5 ct = 1 g', () => {
    expect(cevir('agirlik', 1, 'ct', 'mg')).toBe(200);
    expect(cevir('agirlik', 5, 'ct', 'g')).toBe(1);
  });

  it('1 stone = 14 lb = 6,35029318 kg; 1 ton = 1000 kg', () => {
    expect(cevir('agirlik', 1, 'st', 'lb')).toBe(14);
    expect(cevir('agirlik', 1, 'st', 'kg')).toBe(6.35029318);
    expect(cevir('agirlik', 1, 'ton', 'kg')).toBe(1000);
  });
});

describe('sıcaklık', () => {
  it('0 °C = 32 °F = 273,15 K = 491,67 °R', () => {
    const r = cevirTumu('sicaklik', 0, 'C');
    expect(deger(r, 'F')).toBe(32);
    expect(deger(r, 'K')).toBe(273.15);
    expect(deger(r, 'R')).toBe(491.67);
  });

  it('100 °C = 100 × 1,8 + 32 = 212 °F; 180 °C = 356 °F', () => {
    expect(cevir('sicaklik', 100, 'C', 'F')).toBe(212);
    expect(cevir('sicaklik', 180, 'C', 'F')).toBe(356);
  });

  it('−40 °C = −40 °F (iki ölçeğin kesiştiği nokta)', () => {
    expect(cevir('sicaklik', -40, 'C', 'F')).toBe(-40);
    expect(cevir('sicaklik', -40, 'F', 'C')).toBe(-40);
  });

  it('vücut: 37 °C = 98,6 °F; 36,6 °C = 97,88 °F', () => {
    expect(cevir('sicaklik', 37, 'C', 'F')).toBe(98.6);
    expect(cevir('sicaklik', 36.6, 'C', 'F')).toBe(97.88);
  });

  it('fırın: 350 °F = (350 − 32) ÷ 1,8 = 176,666667 °C; 300 K = 26,85 °C', () => {
    expect(cevir('sicaklik', 350, 'F', 'C')).toBeCloseTo(176.666667, 6);
    expect(cevir('sicaklik', 300, 'K', 'C')).toBe(26.85);
  });

  it('mutlak sıfır: 0 K = −273,15 °C = −459,67 °F; altı reddedilir', () => {
    expect(cevir('sicaklik', 0, 'K', 'C')).toBe(-273.15);
    expect(cevir('sicaklik', 0, 'K', 'F')).toBe(-459.67);
    expect(sicaklikSchema.safeParse({ deger: -273.15, birim: 'C' }).success).toBe(true);
    expect(sicaklikSchema.safeParse({ deger: -274, birim: 'C' }).success).toBe(false);
    expect(sicaklikSchema.safeParse({ deger: -460, birim: 'F' }).success).toBe(false);
    expect(sicaklikSchema.safeParse({ deger: -1, birim: 'K' }).success).toBe(false);
  });
});

describe('veri boyutu', () => {
  it('1 TB = 10¹² ÷ 2³⁰ = 931,3225746 GiB = 0,9094947 TiB (Windows’ta "931 GB")', () => {
    expect(cevir('veri', 1, 'TB', 'GiB')).toBeCloseTo(931.3225746, 7);
    expect(cevir('veri', 1, 'TB', 'TiB')).toBeCloseTo(0.9094947, 7);
  });

  it('1 GiB = 1,073741824 GB; 1 KiB = 1024 B; 1 B = 8 bit; 500 GB = 465,66 GiB', () => {
    expect(cevir('veri', 1, 'GiB', 'GB')).toBe(1.073741824);
    expect(cevir('veri', 1, 'KiB', 'B')).toBe(1024);
    expect(cevir('veri', 1, 'TiB', 'B')).toBe(1099511627776); // 2⁴⁰ tam kalır (temizle 14 hane)
    expect(cevir('veri', 1, 'B', 'bit')).toBe(8);
    expect(cevir('veri', 500, 'GB', 'GiB')).toBeCloseTo(465.6612873, 7);
  });

  it('indirme: 5 GB, 100 Mbps → 5×10⁹ × 8 ÷ 10⁸ = 400 sn = 6 dakika 40 saniye', () => {
    const s = indirmeSuresi(5e9, 100);
    expect(s).toBe(400);
    expect(sureTR(s)).toBe('6 dakika 40 saniye');
  });

  it('indirme: 1 GB, 8 Mbps = 1000 sn = 16 dakika 40 saniye; 100 Mbps = 12,5 MB/s', () => {
    expect(sureTR(indirmeSuresi(1e9, 8))).toBe('16 dakika 40 saniye');
    expect(cevir('veri', 100e6, 'bit', 'MB')).toBe(12.5);
  });

  it('süre biçimi: en büyük iki birim; 1 saniye altı ondalıklı', () => {
    expect(sureTR(90061)).toBe('1 gün 1 saat');
    expect(sureTR(3600)).toBe('1 saat');
    expect(sureTR(0.5)).toBe('0,5 saniye');
  });

  it('ana sonuç: 1 TB → IEC’de GiB, SI’de GB; 8 bit → 1 B', () => {
    expect(veriHedef(1, 'TB', 'iec')).toBe('GiB');
    expect(veriHedef(1, 'TB', 'si')).toBe('GB');
    expect(veriHedef(8, 'bit', 'si')).toBe('B');
  });

  it('indirme modunda hız zorunlu', () => {
    const base = { deger: 5, birim: 'GB', sistem: 'si' };
    expect(veriSchema.safeParse({ ...base, mod: 'indirme' }).success).toBe(false);
    expect(veriSchema.safeParse({ ...base, mod: 'indirme', hiz: 100 }).success).toBe(true);
    expect(veriSchema.safeParse({ ...base, mod: 'boyut' }).success).toBe(true);
  });
});
