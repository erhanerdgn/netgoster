import { describe, expect, it } from 'vitest';
import { addMonths, round2, ymdDiff } from './common.ts';

describe('ymdDiff / addMonths (ay sonu güvenli)', () => {
  it('ay sonu başlangıç negatif gün üretmez', () => {
    // 31.01 + 1 ay = 01.03 (Şubat'ta 31 yok) → 1 ay 0 gün
    expect(ymdDiff('2026-01-31', '2026-03-01')).toEqual({ years: 0, months: 1, days: 0 });
    // 30.01 + 1 ay = 01.03 (Şubat'ta 30 yok) > 28.02 → 0 ay; 30.01 → 28.02 = 29 gün
    expect(ymdDiff('2026-01-30', '2026-02-28')).toEqual({ years: 0, months: 0, days: 29 });
  });
  it('tam yıllar ve küsurat', () => {
    expect(ymdDiff('2021-03-01', '2026-03-01')).toEqual({ years: 5, months: 0, days: 0 });
    expect(ymdDiff('2024-01-10', '2026-05-25')).toEqual({ years: 2, months: 4, days: 15 });
  });
  it('29 Şubat yıl dönümü artık olmayan yılda 1 Mart', () => {
    expect(addMonths('2024-02-29', 12)).toBe('2025-03-01');
    expect(ymdDiff('2024-02-29', '2025-02-28')).toEqual({ years: 0, months: 11, days: 30 });
  });
  it('ters sıra sıfır döner', () => {
    expect(ymdDiff('2026-05-01', '2026-01-01')).toEqual({ years: 0, months: 0, days: 0 });
  });
  it('ay sonu → ay sonu', () => {
    expect(ymdDiff('2025-12-31', '2026-12-31')).toEqual({ years: 1, months: 0, days: 0 });
  });
});

describe('round2', () => {
  it('kayan nokta gürültüsünde yarım kuruşu yukarı yuvarlar', () => {
    expect(round2(16845.3 - 12633.975)).toBe(4211.33); // 4211.325
    expect(round2(1.005)).toBe(1.01);
    expect(round2(200.558)).toBe(200.56);
  });
});
