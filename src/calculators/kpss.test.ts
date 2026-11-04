import { describe, expect, it } from 'vitest';
import { calculateKpss, kpssSchema } from './kpss.ts';

const run = (v: object) => calculateKpss(kpssSchema.parse(v));
// GY 45D 12Y → 42 net; GK 40D 16Y → 36 net; toplam 78
const dy = { gy: { d: 45, y: 12 }, gk: { d: 40, y: 16 } };

describe('KPSS puan', () => {
  it('P3: 46 + 0,48 × 78 = 83,44', () => {
    const r = run({ tur: 'P3', dy });
    expect(r.gyNet).toBe(42);
    expect(r.gkNet).toBe(36);
    expect(r.puan).toBeCloseTo(83.44, 5);
  });

  it('P93: 50 + 0,46 × 78 = 85,88; P94: 52 + 0,45 × 78 = 87,1', () => {
    expect(run({ tur: 'P93', dy }).puan).toBeCloseTo(85.88, 5);
    expect(run({ tur: 'P94', dy }).puan).toBeCloseTo(87.1, 5);
  });

  it('tam net: 46 + 0,48 × 120 = 103,6 → 100’e kırpılır', () => {
    expect(run({ tur: 'P3', dy: { gy: { d: 60, y: 0 }, gk: { d: 60, y: 0 } } }).puan).toBe(100);
  });

  it('GK 1D 1Y = 0,75 net → puan hesaplanmaz; GK 1D 0Y = 1 net → hesaplanır (46 + 0,48 × 31 = 60,88)', () => {
    const yok = run({ tur: 'P3', dy: { gy: { d: 30, y: 0 }, gk: { d: 1, y: 1 } } });
    expect(yok.hesaplandi).toBe(false);
    expect(yok.puan).toBeNull();
    const var_ = run({ tur: 'P3', dy: { gy: { d: 30, y: 0 }, gk: { d: 1, y: 0 } } });
    expect(var_.puan).toBeCloseTo(60.88, 5);
  });

  it('doğrulama: tür zorunlu, D + Y ≤ 60', () => {
    expect(kpssSchema.safeParse({ dy }).success).toBe(false);
    expect(kpssSchema.safeParse({ tur: 'P3', dy: { gy: { d: 50, y: 11 } } }).success).toBe(false);
  });
});
