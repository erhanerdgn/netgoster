import { describe, expect, it } from 'vitest';
import { ayBordrosu } from './bordro.ts';
import { brutBul, calculateNetBrut, netBrutSchema } from './netBrut.ts';

const run = (v: object) => calculateNetBrut(netBrutSchema.parse(v));

describe('netten brüte maaş', () => {
  it('asgari net 28.075,50 → her ay brüt 33.030 (33.029,99 neti 28.075,49)', () => {
    const r = run({ net: 28075.5, yil: 2026 });
    expect(r.aylar.every((a) => a.brut === 33030)).toBe(true);
    expect(ayBordrosu({ yil: 2026, ay: 1, brut: 33029.99 }).net).toBe(28075.49);
  });

  it('Ocak net 40.207,53 → brüt 50.000 (brütten nete ile tutarlı)', () => {
    expect(brutBul(2026, 1, 40207.53, 0).brut).toBe(50000);
  });

  it('net 40.000 Ocak: 0,71491 × B + 4.462,03 = 40.000 → B ≈ 49.709,69', () => {
    // net = B − %15 B − (0,85B × %15 − 4.211,33) − (binde 7,59 B − 250,70)
    const b = brutBul(2026, 1, 40000, 0);
    expect(b.brut).toBeCloseTo(49709.69, 1);
    expect(b.net).toBeGreaterThanOrEqual(40000);
    expect(ayBordrosu({ yil: 2026, ay: 1, brut: b.brut - 0.01 }).net).toBeLessThan(40000);
  });

  it('12 ay sabit net 40.000: dilim yükseldikçe brüt artar, her ay net ≥ hedef', () => {
    const r = run({ net: 40000, yil: 2026 });
    expect(r.aylar.every((a) => a.net >= 40000 && a.net < 40000.02)).toBe(true);
    expect(r.aylar[11].brut).toBeGreaterThan(r.aylar[0].brut);
    // Aralık tamamen %27 dilimde: net = 0,85B − (0,85B×%27 − 5.615,10) − (binde 7,59 B − 250,70)
    // = 0,61291 B + 5.865,80 = 40.000 → B ≈ 55.692,03
    expect(r.aylar[11].brut).toBeCloseTo(55692.03, 1);
  });

  it('PEK tavanı üstü: net 300.000 → 0,79241 B − 21.710,37 = 300.000 → B ≈ 405.989,79', () => {
    // SGK sabit 44.590,50; matrah < 400.000 → GV = 0,2 × matrah − 13.711,33
    const b = brutBul(2026, 1, 300000, 0);
    expect(b.sgkMatrah).toBe(297270);
    expect(b.brut).toBeCloseTo(405989.79, 1);
  });
});
