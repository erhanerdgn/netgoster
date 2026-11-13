import { describe, expect, it } from 'vitest';
import { calculateEnflasyon, enflasyonSchema, type EnflasyonInput } from './enflasyon.ts';
import { BAGLAMA, endeksAt, ILK_AY, SON_AY, tufeEndeks } from '../config/tufeEndeks.ts';
import { tufe } from '../config/tufe.ts';

const hesapla = (v: Partial<EnflasyonInput>) =>
  calculateEnflasyon(enflasyonSchema.parse({ tutar: 1000, basAy: '1', basYil: '2020', sonAy: '10', sonYil: '2026', ...v }));

const onceki = (ay: string, n: number) => {
  const t = Number(ay.slice(0, 4)) * 12 + Number(ay.slice(5)) - 1 - n;
  return `${Math.floor(t / 12)}-${String((t % 12) + 1).padStart(2, '0')}`;
};

describe('enflasyon (paranın değeri)', () => {
  it('Ocak 2020’deki 1.000 TL Ekim 2026’da', () => {
    // BAGLAMA = 2025 ortalaması 3183,2292 / 100 = 31,832292; Ekim 2026 = 140,77 × 31,832292 = 4481,0317
    // 1.000 × 4481,0317 / 446,45 = 10.037,03 TL; 81 ay; yıllık ort. = 10,03703^(12/81) − 1 = %40,73
    const r = hesapla({});
    expect(BAGLAMA).toBeCloseTo(31.832292, 6);
    expect(r.endeksSon).toBeCloseTo(4481.0317, 3);
    expect(r.karsilik).toBe(10037.03);
    expect(r.aySayisi).toBe(81);
    expect(r.geriye).toBe(false);
    expect(r.donemEnflasyonu).toBeCloseTo(9.037029, 5);
    expect(r.yillikOrtalama).toBeCloseTo(0.407298, 5);
  });

  it('ters yön: Ekim 2026’daki 1.000 TL Ocak 2020’de', () => {
    // 1.000 × 446,45 / 4481,0317 = 99,63 TL; dönem enflasyonu yine eski → yeni (%903,70)
    const r = hesapla({ basAy: '10', basYil: '2026', sonAy: '1', sonYil: '2020' });
    expect(r.karsilik).toBe(99.63);
    expect(r.geriye).toBe(true);
    expect(r.aySayisi).toBe(81);
    expect(r.donemEnflasyonu).toBeCloseTo(9.037029, 5);
  });

  it('Ocak → Aralık 2024: 11 aylık enflasyon ve satın alma gücü kaybı', () => {
    // 2684,55 / 1984,02 − 1 = %35,3086; kayıp = 1 − 1984,02 / 2684,55 = %26,0949
    const r = hesapla({ tutar: 50000, basAy: '1', basYil: '2024', sonAy: '12', sonYil: '2024' });
    expect(r.aySayisi).toBe(11);
    expect(r.donemEnflasyonu).toBeCloseTo(0.353086, 6);
    expect(r.alimGucuKaybi).toBeCloseTo(0.260949, 6);
    expect(r.karsilik).toBe(67654.31); // 50.000 × 1,3530862 = 67.654,31
  });

  it('12 aylık dönemde yıllık ortalama = dönem enflasyonu (Aralık 2024 yıllık %44,38)', () => {
    const r = hesapla({ basAy: '12', basYil: '2023', sonAy: '12', sonYil: '2024' });
    expect(r.aySayisi).toBe(12);
    expect(r.donemEnflasyonu * 100).toBeCloseTo(44.38, 1);
    expect(r.yillikOrtalama).toBeCloseTo(r.donemEnflasyonu, 12);
  });

  it('baz değişikliği sınırında: Aralık 2025 → Ocak 2026 aylık %4,84', () => {
    // 115,73 × 31,832292 / 3513,87 − 1 = %4,8403
    const r = hesapla({ basAy: '12', basYil: '2025', sonAy: '1', sonYil: '2026' });
    expect(r.aySayisi).toBe(1);
    expect(r.donemEnflasyonu * 100).toBeCloseTo(4.84, 2);
  });

  it('geçersiz girişler: aynı ay, yayımlanmamış ay, 2003 öncesi', () => {
    const p = (v: Partial<EnflasyonInput>) =>
      enflasyonSchema.safeParse({ tutar: 1000, basAy: '1', basYil: '2020', sonAy: '10', sonYil: '2026', ...v }).success;
    expect(p({ sonAy: '1', sonYil: '2020' })).toBe(false);
    expect(p({ sonAy: '12', sonYil: '2026' })).toBe(false);
    expect(p({ basAy: '12', basYil: '2002' })).toBe(false);
    expect(p({ tutar: 0 })).toBe(false);
    expect(p({})).toBe(true);
  });
});

describe('TÜFE endeks serisi', () => {
  it('Ocak 2003’ten son aya boşluksuz ve artan sırada', () => {
    expect(ILK_AY).toBe('2003-01');
    expect(SON_AY).toBe(tufe[tufe.length - 1].ay);
    tufeEndeks.slice(1).forEach((e, i) => expect(onceki(e.ay, 1)).toBe(tufeEndeks[i].ay));
  });

  it('zincirden çıkan aylık ve yıllık değişim, tufe.ts’deki açıklanan oranlarla ±0,05 puan', () => {
    for (const t of tufe) {
      const e = endeksAt(t.ay)!;
      const aylik = (e / endeksAt(onceki(t.ay, 1))! - 1) * 100;
      const yillik = (e / endeksAt(onceki(t.ay, 12))! - 1) * 100;
      expect(Math.abs(aylik - t.aylik), `${t.ay} aylık`).toBeLessThanOrEqual(0.05);
      expect(Math.abs(yillik - t.yillik), `${t.ay} yıllık`).toBeLessThanOrEqual(0.05);
    }
  });

  it('TÜİK yıl sonu (Aralık) yıllık oranları 2005–2025', () => {
    // TÜİK'in açıkladığı Aralık yıllık TÜFE değişimleri (%)
    const aralik: Record<number, number> = {
      2005: 7.72, 2006: 9.65, 2007: 8.39, 2008: 10.06, 2009: 6.53, 2010: 6.4, 2011: 10.45, 2012: 6.16, 2013: 7.4,
      2014: 8.17, 2015: 8.81, 2016: 8.53, 2017: 11.92, 2018: 20.3, 2019: 11.84, 2020: 14.6, 2021: 36.08, 2022: 64.27,
      2023: 64.77, 2024: 44.38, 2025: 30.89,
    }; // prettier-ignore
    for (const [y, oran] of Object.entries(aralik)) {
      const c = (endeksAt(`${y}-12`)! / endeksAt(`${+y - 1}-12`)! - 1) * 100;
      expect(Math.abs(c - oran), y).toBeLessThanOrEqual(0.05);
    }
  });
});
