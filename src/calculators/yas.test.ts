import { describe, expect, it } from 'vitest';
import { calculateYas, yasSchema } from './yas.ts';

const run = (v: object) => calculateYas(yasSchema.parse(v));

describe('yaş hesaplama', () => {
  it('15.05.1990 → 04.11.2026: 36 yıl 5 ay 20 gün', () => {
    const r = run({ dogum: '1990-05-15', tarih: '2026-11-04' });
    expect(r.yas).toEqual({ years: 36, months: 5, days: 20 });
    // 36×365 + 9 artık gün (1992…2024) = 13.149; 15 May → 4 Kas 2026 = 173 → 13.322
    expect(r.toplamGun).toBe(13322);
    expect(r.toplamHafta).toEqual({ weeks: 1903, days: 1 });
    expect(r.toplamAy).toBe(437);
    expect(r.toplamSaat).toBe(13322 * 24);
    expect(r.dogumGunu).toBe('Salı');
    // 4 Kas 2026 → 15 May 2027: 26 + 31 + 31 + 28 + 31 + 30 + 15 = 192
    expect(r.sonrakiDogumGunu).toBe('2027-05-15');
    expect(r.kalanGun).toBe(192);
    expect(r.sonrakiGunAdi).toBe('Cumartesi');
    expect(r.sonrakiYas).toBe(37);
  });

  it('29 Şubat doğumlu, artık olmayan yıl: 28.02.2027’de 26 yıl 11 ay 30 gün, yaş 1 Mart’ta dolar', () => {
    const r = run({ dogum: '2000-02-29', tarih: '2027-02-28' });
    expect(r.subat29).toBe(true);
    expect(r.yas).toEqual({ years: 26, months: 11, days: 30 });
    expect(r.sonrakiDogumGunu).toBe('2027-03-01');
    expect(r.kalanGun).toBe(1);
    expect(r.sonrakiYas).toBe(27);
  });

  it('29 Şubat doğumlu, artık yılda doğum günü: 29.02.2028 → tam 28 yaş', () => {
    const r = run({ dogum: '2000-02-29', tarih: '2028-02-29' });
    expect(r.bugunDogumGunu).toBe(true);
    expect(r.yas).toEqual({ years: 28, months: 0, days: 0 });
    expect(r.kalanGun).toBe(0);
  });

  it('yıl sonu doğumlu: 31.12.2000 → 01.01.2026 = 25 yıl 0 ay 1 gün, doğum gününe 364 gün', () => {
    const r = run({ dogum: '2000-12-31', tarih: '2026-01-01' });
    expect(r.yas).toEqual({ years: 25, months: 0, days: 1 });
    expect(r.kalanGun).toBe(364);
  });

  it('doğduğu gün: yaş 0, ilk doğum gününe 365 gün', () => {
    const r = run({ dogum: '2026-11-04', tarih: '2026-11-04' });
    expect(r.toplamGun).toBe(0);
    expect(r.bugunDogumGunu).toBe(false);
    expect(r.sonrakiDogumGunu).toBe('2027-11-04');
    expect(r.kalanGun).toBe(365);
    expect(r.dogumGunu).toBe('Çarşamba');
  });

  it('31 Ocak doğumlu Şubat sonunda: ay sonu negatif gün vermez', () => {
    const r = run({ dogum: '1995-01-31', tarih: '2026-03-01' });
    expect(r.yas).toEqual({ years: 31, months: 1, days: 0 });
  });

  it('hesap tarihi doğumdan önce olamaz', () => {
    expect(yasSchema.safeParse({ dogum: '2026-01-02', tarih: '2026-01-01' }).success).toBe(false);
  });
});
