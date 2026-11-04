import { describe, expect, it } from 'vitest';
import { addMonths, calculateMevduat, mevduatSchema, stopajDilimi } from './mevduat.ts';

const run = (v: object) => calculateMevduat(mevduatSchema.parse(v));

describe('mevduat faizi', () => {
  it('100.000 TL, %40, 32 gün (04.11.2026): stopaj %17,5', () => {
    // brüt = 100000 × 0,40 × 32 / 365 = 3.506,85; stopaj = 3.506,85 × 0,175 = 613,70; net = 2.893,15
    const r = run({ anapara: 100000, oran: 40, gun: 32, acilis: '2026-11-04' });
    expect(r.vadeSonu).toBe('2026-12-06');
    expect(r.dilim).toBe('alti6');
    expect(r.brutFaiz).toBe(3506.85);
    expect(r.stopaj).toBe(613.7);
    expect(r.netFaiz).toBe(2893.15);
    expect(r.vadeSonuTutar).toBe(102893.15);
    // net yıllık ≈ %40 × (1 − 0,175) = %33
    expect(r.netYillik).toBeCloseTo(0.33, 5);
  });

  it('6 ay sınırı takvim ayıyla: 04.11.2026 + 181 gün = 04.05.2027 (6 ay dahil), 182 gün → 1 yıla kadar', () => {
    expect(run({ anapara: 1000, oran: 40, gun: 181, acilis: '2026-11-04' }).stopajOran).toBe(0.175);
    expect(run({ anapara: 1000, oran: 40, gun: 182, acilis: '2026-11-04' }).stopajOran).toBe(0.15);
    // 31 Ağustos + 6 ay = 28 Şubat; 181 gün sonra tam 28.02.2027
    expect(addMonths('2026-08-31', 6)).toBe('2027-02-28');
    expect(stopajDilimi('2026-08-31', '2027-02-28')).toBe('alti6');
    expect(stopajDilimi('2026-08-31', '2027-03-01')).toBe('yil1');
  });

  it('365 gün (tam 1 yıl) → %15; 366 gün → 1 yıldan uzun %10', () => {
    // brüt = 100000 × 0,40 × 365/365 = 40.000; stopaj 6.000; net 34.000
    const r = run({ anapara: 100000, oran: 40, gun: 365, acilis: '2026-11-04' });
    expect(r.dilim).toBe('yil1');
    expect(r.netFaiz).toBe(34000);
    expect(run({ anapara: 100000, oran: 40, gun: 366, acilis: '2026-11-04' }).stopajOran).toBe(0.1);
  });

  it('geçmiş açılış tarihleri o dönemin oranıyla: 01.03.2025 → %15, 01.12.2024 → %10', () => {
    // brüt = 250000 × 0,45 × 92/365 = 28.356,16; stopaj %15 = 4.253,42; net 24.102,74
    const r = run({ anapara: 250000, oran: 45, gun: 92, acilis: '2025-03-01' });
    expect(r.stopajOran).toBe(0.15);
    expect(r.netFaiz).toBe(24102.74);
    expect(run({ anapara: 250000, oran: 45, gun: 92, acilis: '2024-12-01' }).stopajOran).toBe(0.1);
  });

  it('vade sonunda yenileme: 4 × 92 gün bileşik', () => {
    // 1. dönem net 8.317,81 → 108.317,81; 2. dönem brüt 108.317,81 × 0,4 × 92/365 = 10.920,81 …
    const r = run({ anapara: 100000, oran: 40, gun: 92, acilis: '2026-01-01', yenile: true, donem: 4 });
    expect(r.donemler).toHaveLength(4);
    expect(r.donemler![0].bakiye).toBe(108317.81);
    expect(r.donemler![1].brutFaiz).toBe(10920.81);
    expect(r.donemler![1].acilis).toBe('2026-04-03');
    expect(r.sonBakiye).toBe(137657.37);
    expect(r.toplamNetFaiz).toBe(37657.37);
    expect(r.efektifYillik).toBeCloseTo(0.37299, 4);
  });

  it('faiz 0 ise getiri 0', () => {
    const r = run({ anapara: 5000, oran: 0, gun: 32, acilis: '2026-11-04' });
    expect(r.netFaiz).toBe(0);
    expect(r.vadeSonuTutar).toBe(5000);
  });
});
