import { describe, expect, it } from 'vitest';
import { calculateLgs, lgsSchema, lgsTaban } from './lgs.ts';

const run = (v: object) => calculateLgs(lgsSchema.parse(v));

describe('LGS puan', () => {
  it('taban = 500 − (60 × 4,35 + 30 × 1,67) = 500 − 311,1 = 188,9', () => {
    expect(lgsTaban).toBeCloseTo(188.9, 5);
    expect(run({ dy: {} }).puan).toBeCloseTo(188.9, 5);
  });

  it('örnek: 438,22', () => {
    // Tr 18D2Y=17,333 · Mat 15D3Y=14 · Fen 17D3Y=16 → 47,333 × 4,35 = 205,9
    // İnk 9D1Y=8,667 · Din 10 · Dil 8D2Y=7,333 → 26 × 1,67 = 43,42 → 188,9 + 205,9 + 43,42 = 438,22
    const r = run({
      dy: {
        turkce: { d: 18, y: 2 },
        mat: { d: 15, y: 3 },
        fen: { d: 17, y: 3 },
        inkilap: { d: 9, y: 1 },
        din: { d: 10, y: 0 },
        dil: { d: 8, y: 2 },
      },
    });
    expect(r.toplamNet).toBeCloseTo(73.33333, 4);
    expect(r.puan).toBeCloseTo(438.22, 5);
  });

  it('tam net 500', () => {
    const full = { d: 20, y: 0 };
    const ten = { d: 10, y: 0 };
    const r = run({ dy: { turkce: full, mat: full, fen: full, inkilap: ten, din: ten, dil: ten } });
    expect(r.puan).toBeCloseTo(500, 5);
    expect(r.agirlikliNet).toBe(270);
  });

  it('yalnız Türkçe 20 doğru: 188,9 + 20 × 4,35 = 275,9', () => {
    expect(run({ dy: { turkce: { d: 20, y: 0 } } }).puan).toBeCloseTo(275.9, 5);
  });

  it('hepsi yanlış → 188,9 − 87 − 16,7 = 85,2 → 100’e kırpılır', () => {
    const r = run({
      dy: {
        turkce: { d: 0, y: 20 },
        mat: { d: 0, y: 20 },
        fen: { d: 0, y: 20 },
        inkilap: { d: 0, y: 10 },
        din: { d: 0, y: 10 },
        dil: { d: 0, y: 10 },
      },
    });
    expect(r.puan).toBe(100);
  });

  it('doğrulama: 10 soruluk testte D + Y > 10 hata', () => {
    expect(lgsSchema.safeParse({ dy: { din: { d: 8, y: 3 } } }).success).toBe(false);
    expect(lgsSchema.safeParse({ dy: { din: { d: 2.5, y: 0 } } }).success).toBe(false);
  });
});
