import { describe, expect, it } from 'vitest';
import { calculateIhbar, ihbarSchema } from './ihbar.ts';

const run = (v: object) => calculateIhbar(ihbarSchema.parse(v));

describe('ihbar tazminatı', () => {
  it('5 ay kıdem → 2 hafta: 30.000 / 30 × 14 = 14.000; GV %15 = 2.100; DV 106,26', () => {
    const r = run({ giris: '2026-01-01', cikis: '2026-05-31', brut: 30000 });
    expect(r.hafta).toBe(2);
    expect(r.brut).toBe(14000);
    expect(r.gv).toBe(2100);
    expect(r.damga).toBe(106.26);
    expect(r.net).toBe(11793.74);
  });

  it('5 ay 30 gün hâlâ 2 hafta, tam 6 ay 4 hafta', () => {
    expect(run({ giris: '2025-12-02', cikis: '2026-05-31', brut: 30000 }).hafta).toBe(2);
    expect(run({ giris: '2025-12-01', cikis: '2026-05-31', brut: 30000 }).hafta).toBe(4);
  });

  it('1 yıl, yan haklar: 48.000 / 30 × 28 = 44.800; GV 6.720; DV 340,03 → net 37.739,97', () => {
    const r = run({ giris: '2025-06-01', cikis: '2026-05-31', brut: 45000, yanHaklar: 3000 });
    expect(r.hafta).toBe(4);
    expect(r.gunluk).toBe(1600);
    expect(r.brut).toBe(44800);
    expect(r.gv).toBe(6720);
    expect(r.damga).toBe(340.03);
    expect(r.net).toBe(37739.97);
  });

  it('tam 18 ay → 6 hafta (1,5 yıl sınırı üst dilime geçer)', () => {
    const r = run({ giris: '2024-11-01', cikis: '2026-04-30', brut: 30000 });
    expect(r.kidemAy).toBe(18);
    expect(r.hafta).toBe(6);
    expect(r.brut).toBe(42000); // 1.000 × 42
  });

  it('3+ yıl, kümülatif 150.000: 112.000 → 40.000×%15 + 72.000×%20 = 20.400', () => {
    const r = run({ giris: '2020-01-01', cikis: '2026-10-31', brut: 60000, kumMatrah: 150000 });
    expect(r.hafta).toBe(8);
    expect(r.brut).toBe(112000);
    expect(r.gv).toBe(20400);
    expect(r.damga).toBe(850.08);
    expect(r.net).toBe(90749.92);
  });

  it('yüksek ücret, kümülatif 1.400.000: %27 → %35 geçişi', () => {
    // 186.666,67: 100.000 × %27 = 27.000 + 86.666,67 × %35 = 30.333,33 → 57.333,33
    const r = run({ giris: '2015-03-01', cikis: '2026-11-04', brut: 100000, kumMatrah: 1400000 });
    expect(r.brut).toBe(186666.67);
    expect(r.gv).toBe(57333.33);
    expect(r.damga).toBe(1416.8);
    expect(r.net).toBe(127916.54);
  });

  it('ay sonu girişi: 31.01 → 30.07 tam 6 ay (4 hafta), 29.07 ise 5 ay 29 gün (2 hafta)', () => {
    const a = run({ giris: '2026-01-31', cikis: '2026-07-30', brut: 30000 });
    expect(a.sure).toEqual({ years: 0, months: 6, days: 0 });
    expect(a.hafta).toBe(4);
    const b = run({ giris: '2026-01-31', cikis: '2026-07-29', brut: 30000 });
    expect(b.sure).toEqual({ years: 0, months: 5, days: 29 });
    expect(b.hafta).toBe(2);
  });
});
