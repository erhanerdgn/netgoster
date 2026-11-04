import { describe, expect, it } from 'vitest';
import { alesSchema, calculateAles } from './ales.ts';

const run = (v: object) => calculateAles(alesSchema.parse(v));

describe('ALES puan', () => {
  it('Sayısal 35D 8Y = 33, Sözel 40D 8Y = 38 → SAY 83,68 · SÖZ 84,29 · EA 84,48', () => {
    // Ölçekli katsayılar (alesFit): SAY k = 52,567/55 → 0,740717 / 0,310623
    // SAY: 47,433 + 0,740717×33 + 0,310623×38 = 83,68034
    // SÖZ: 40,91 + 0,305345×33 + 0,876455×38 = 84,29167
    // EA : 45,408 + 0,483396×33 + 0,608444×38 = 84,48094
    const r = run({ dy: { say: { d: 35, y: 8 }, soz: { d: 40, y: 8 } } });
    expect(r.sayNet).toBe(33);
    expect(r.sozNet).toBe(38);
    expect(r.puanlar.SAY).toBeCloseTo(83.68034, 4);
    expect(r.puanlar.SÖZ).toBeCloseTo(84.29167, 4);
    expect(r.puanlar.EA).toBeCloseTo(84.48094, 4);
  });

  it('boş form: sabitler (47,433 / 40,91 / 45,408)', () => {
    const r = run({ dy: {} });
    expect(r.puanlar).toEqual({ SAY: 47.433, SÖZ: 40.91, EA: 45.408 });
  });

  it('tam net her puan türünde 100', () => {
    const r = run({ dy: { say: { d: 50, y: 0 }, soz: { d: 50, y: 0 } } });
    expect(r.puanlar).toEqual({ SAY: 100, SÖZ: 100, EA: 100 });
  });

  it('negatif net: Sayısal 0D 50Y = −12,5 → SAY 47,433 − 0,740717×12,5 = 38,174', () => {
    const r = run({ dy: { say: { d: 0, y: 50 } } });
    expect(r.puanlar.SAY).toBeCloseTo(38.17404, 4);
  });

  it('yalnız sözel 30D 0Y: SÖZ 40,91 + 0,876455×30 = 67,204', () => {
    expect(run({ dy: { soz: { d: 30, y: 0 } } }).puanlar.SÖZ).toBeCloseTo(67.20364, 4);
  });

  it('doğrulama: D + Y ≤ 50', () => {
    expect(alesSchema.safeParse({ dy: { say: { d: 40, y: 11 } } }).success).toBe(false);
  });
});
