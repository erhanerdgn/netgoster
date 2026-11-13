import { describe, expect, it } from 'vitest';
import { adimlar, calculateRomaRakami, romaOku, romaRakamiSchema, toRoma } from './romaRakami.ts';

const hata = (s: string) => {
  const r = romaOku(s);
  return 'hata' in r ? r.hata : '';
};

describe('sayı → Roma rakamı', () => {
  it('temel ve çıkarmalı değerler', () => {
    expect(toRoma(4)).toBe('IV');
    expect(toRoma(9)).toBe('IX');
    expect(toRoma(14)).toBe('XIV');
    expect(toRoma(40)).toBe('XL');
    expect(toRoma(90)).toBe('XC');
    expect(toRoma(400)).toBe('CD');
    expect(toRoma(900)).toBe('CM');
  });

  it('1987 = M + CM + LXXX + VII; yıllar', () => {
    expect(adimlar(1987)).toEqual([
      { roma: 'M', deger: 1000 },
      { roma: 'CM', deger: 900 },
      { roma: 'LXXX', deger: 80 },
      { roma: 'VII', deger: 7 },
    ]);
    expect(toRoma(1987)).toBe('MCMLXXXVII');
    expect(toRoma(1453)).toBe('MCDLIII'); // 1000 + 400 + 50 + 3
    expect(toRoma(1923)).toBe('MCMXXIII'); // 1000 + 900 + 20 + 3
    expect(toRoma(2026)).toBe('MMXXVI');
    expect(adimlar(2000)).toEqual([{ roma: 'MM', deger: 2000 }]); // sıfır basamaklar atlanır
  });

  it('sınırlar: 1 = I, 3999 = MMMCMXCIX; 0 ve 4000 reddedilir', () => {
    expect(toRoma(1)).toBe('I');
    expect(toRoma(3999)).toBe('MMMCMXCIX');
    expect(romaRakamiSchema.safeParse({ yon: 'sayi', sayi: 0 }).success).toBe(false);
    expect(romaRakamiSchema.safeParse({ yon: 'sayi', sayi: 4000 }).success).toBe(false);
    expect(romaRakamiSchema.safeParse({ yon: 'sayi', sayi: 12.5 }).success).toBe(false);
  });
});

describe('Roma rakamı → sayı', () => {
  it('standart yazımlar okunur; küçük harf ve boşluk kabul', () => {
    expect(calculateRomaRakami(romaRakamiSchema.parse({ yon: 'roma', roma: 'MCMLXXXVII' })).sayi).toBe(1987);
    expect(romaOku('mmxxvi')).toEqual({ deger: 2026, roma: 'MMXXVI' });
    expect(romaOku(' xıv ')).toEqual({ deger: 14, roma: 'XIV' }); // Türkçe klavyede ı
  });

  it('1–3999 arası her sayı gidiş-dönüş tutarlı', () => {
    for (let n = 1; n <= 3999; n++) expect(romaOku(toRoma(n))).toEqual({ deger: n, roma: toRoma(n) });
  });

  it('standart dışı yazımlar nedeni ve önerisiyle reddedilir', () => {
    expect(hata('IIII')).toContain('en fazla 3 kez');
    expect(hata('IIII')).toContain('IV (4)');
    expect(hata('VX')).toContain('"VX" geçerli bir çıkarma çifti değil');
    expect(hata('VX')).toContain('V (5)');
    expect(hata('IC')).toContain('XCIX (99)'); // −1 + 100
    expect(hata('VV')).toContain('V harfi bir sayıda yalnız bir kez');
    expect(hata('VV')).toContain('X (10)');
    expect(hata('XM')).toContain('CMXC (990)');
  });

  it('geçersiz karakter, boş giriş ve 3999 üstü', () => {
    expect(hata('X2B')).toContain('Geçersiz karakter: 2, B');
    expect(hata('  ')).toBe('Roma rakamı girin');
    expect(hata('MMMM')).toContain('en büyük sayı 3999');
    expect(romaRakamiSchema.safeParse({ yon: 'roma', roma: 'IIII' }).success).toBe(false);
  });
});
