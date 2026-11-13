import { describe, expect, it } from 'vitest';
import { calculateZamanCevirici, sayi, zamanCeviriciSchema } from './zamanCevirici.ts';

const z = (v: object) => calculateZamanCevirici(zamanCeviriciSchema.parse(v));

describe('zaman çevirici', () => {
  it('249 gün = 8 ay 6 gün = 35 hafta 4 gün', () => {
    const r = z({ deger: 249, birim: 'gun' });
    // 249 / 30,436875 = 8,1809 ay; 249 − 8 × 30,436875 = 5,505 → 6 gün
    expect(r.ayGun).toBe('8 ay 6 gün');
    expect(r.karsilik.ay).toBeCloseTo(8.1809, 4);
    // 35 × 7 = 245, kalan 4
    expect(r.haftaGun).toBe('35 hafta 4 gün');
    expect(r.ay30).toBeCloseTo(8.3, 10); // 249 / 30
  });

  it('1000 gün = 2 yıl 8 ay 26 gün', () => {
    const r = z({ deger: 1000, birim: 'gun' });
    // 1000 − 2 × 365,2425 = 269,515; − 8 × 30,436875 (243,495) = 26,02 → 26
    expect(r.yilAyGun).toBe('2 yıl 8 ay 26 gün');
    expect(r.haftaGun).toBe('142 hafta 6 gün'); // 142 × 7 = 994
    expect(r.karsilik.yil).toBeCloseTo(2.7379, 4);
  });

  it('100 saat = 4 gün 4 saat; 90 saniye = 1 dakika 30 saniye', () => {
    const r = z({ deger: 100, birim: 'saat' });
    expect(r.gunSaat).toBe('4 gün 4 saat');
    expect(r.karsilik.gun).toBeCloseTo(4.1667, 4);
    expect(r.karsilik.dakika).toBe(6000);
    expect(z({ deger: 90, birim: 'saniye' }).gunSaat).toBe('1 dakika 30 saniye');
  });

  it('12 ay tam 1 ortalama yıl; 30 günlük ay geleneğiyle 360 gün', () => {
    const r = z({ deger: 12, birim: 'ay' });
    expect(r.karsilik.yil).toBeCloseTo(1, 12);
    expect(r.yilAyGun).toBe('1 yıl');
    expect(r.gun).toBeCloseTo(365.2425, 10);
    expect(r.gunGelenek).toBe(360);
    expect(z({ deger: 1, birim: 'yil' }).gunGelenek).toBe(365);
  });

  it('yuvarlanan kalan üst birime aktarılır: 60 gün = 2 ay, 365 gün = 1 yıl, 29 gün kalır', () => {
    // 60 − 30,436875 = 29,56 → 30 gün = tam ay sınırı → 2 ay
    expect(z({ deger: 60, birim: 'gun' }).ayGun).toBe('2 ay');
    // 365 gün: 11 ay + 30,19 → 30 gün → 12 ay → 1 yıl
    expect(z({ deger: 365, birim: 'gun' }).yilAyGun).toBe('1 yıl');
    expect(z({ deger: 29, birim: 'gun' }).ayGun).toBe('29 gün');
    // 90 − 2 × 30,436875 = 29,13 → 29
    expect(z({ deger: 90, birim: 'gun' }).ayGun).toBe('2 ay 29 gün');
  });

  it('kesirli giriş: 1,5 hafta = 1 hafta 3,5 gün = 10 gün 12 saat', () => {
    const r = z({ deger: 1.5, birim: 'hafta' });
    expect(r.haftaGun).toBe('1 hafta 3,5 gün');
    expect(r.gunSaat).toBe('10 gün 12 saat');
  });

  it('takvim: 01.01.2026 + 249 gün = 07.09.2026 (8 ay 6 gün); 01.03.2026 başlangıçla 8 ay 4 gün', () => {
    // 1 Ocak + 8 ay = 1 Eylül (243 gün), + 6 gün = 7 Eylül
    const a = z({ deger: 249, birim: 'gun', baslangic: '2026-01-01' }).takvim!;
    expect(a.bitis).toBe('2026-09-07');
    expect(a.metin).toBe('8 ay 6 gün');
    // 1 Mart + 8 ay = 1 Kasım (31+30+31+30+31+31+30+31 = 245 gün), + 4 gün = 5 Kasım
    const b = z({ deger: 249, birim: 'gun', baslangic: '2026-03-01' }).takvim!;
    expect(b.bitis).toBe('2026-11-05');
    expect(b.metin).toBe('8 ay 4 gün');
  });

  it('takvim: 01.01.2026 + 6 ay = 01.07.2026 = 181 gün (ortalamadan 1,62 gün kısa)', () => {
    const t = z({ deger: 6, birim: 'ay', baslangic: '2026-01-01' }).takvim!;
    expect(t.bitis).toBe('2026-07-01');
    expect(t.gun).toBe(181); // 31+28+31+30+31+30
    expect(t.fark).toBeCloseTo(181 - 182.62125, 10);
    // 31 Ocak + 1 ay: Şubat'ta 31 yok → 1 Mart (addMonths kuralı)
    expect(z({ deger: 1, birim: 'ay', baslangic: '2026-01-31' }).takvim!.bitis).toBe('2026-03-01');
  });

  it('şema: boş başlangıç kabul, hatalı tarih ve negatif değer red', () => {
    expect(zamanCeviriciSchema.safeParse({ deger: 5, birim: 'gun', baslangic: '' }).success).toBe(true);
    expect(z({ deger: 5, birim: 'gun', baslangic: '' }).takvim).toBeUndefined();
    expect(zamanCeviriciSchema.safeParse({ deger: 5, birim: 'gun', baslangic: 'invalid:12.1' }).success).toBe(false);
    expect(zamanCeviriciSchema.safeParse({ deger: -1, birim: 'gun' }).success).toBe(false);
  });

  it('sayı biçimi: küçük değerler anlamlı basamakla', () => {
    expect(sayi(1 / 1440)).toBe('0,000694'); // 1 dakika kaç gün: 0,00069444…
    expect(sayi(1 / 31556952)).toBe('0,0000000317'); // 1 saniye kaç yıl: 3,17 × 10⁻⁸
    expect(sayi(21513600)).toBe('21.513.600');
    expect(sayi(8.18093)).toBe('8,18');
  });
});
