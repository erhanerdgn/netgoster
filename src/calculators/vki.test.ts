import { describe, expect, it } from 'vitest';
import { calculateVki, vkiSchema } from './vki.ts';

const run = (v: object) => calculateVki(vkiSchema.parse(v));

describe('vücut kitle indeksi', () => {
  it('170 cm 65 kg: 65 / 1,7² = 22,49 → 22,5 normal; aralık 18,5×2,89=53,5 – 24,9×2,89=72,0', () => {
    const r = run({ boy: 170, kilo: 65 });
    expect(r.vki).toBe(22.5);
    expect(r.sinif.id).toBe('normal');
    expect(r.saglikliMin).toBe(53.5);
    expect(r.saglikliMax).toBe(72);
    expect(r.fark).toBe(0);
  });

  it('180 cm 100 kg: 100 / 3,24 = 30,86 → 30,9 obez I; 24,9×3,24 = 80,7 → 19,3 kg vermeli', () => {
    const r = run({ boy: 180, kilo: 100 });
    expect(r.vki).toBe(30.9);
    expect(r.sinif.id).toBe('obez1');
    expect(r.fark).toBe(-19.3);
  });

  it('160 cm 45 kg: 45 / 2,56 = 17,58 → 17,6 zayıf; 18,5×2,56 = 47,4 → 2,4 kg almalı', () => {
    const r = run({ boy: 160, kilo: 45 });
    expect(r.vki).toBe(17.6);
    expect(r.sinif.id).toBe('zayif');
    expect(r.fark).toBe(2.4);
  });

  it('sınırlar: 200 cm 74 kg = 18,5 normal; 100 kg = 25,0 fazla kilolu', () => {
    expect(run({ boy: 200, kilo: 74 }).sinif.id).toBe('normal');
    expect(run({ boy: 200, kilo: 100 }).sinif.id).toBe('fazla');
  });

  it('150 cm: 78,75 kg = 35,0 obez II; 90 kg = 40,0 obez III', () => {
    expect(run({ boy: 150, kilo: 78.75 }).sinif.id).toBe('obez2');
    expect(run({ boy: 150, kilo: 90 }).sinif.id).toBe('obez3');
  });

  it('şema: geçersiz boy/kilo reddedilir', () => {
    expect(vkiSchema.safeParse({ boy: 30, kilo: 60 }).success).toBe(false);
    expect(vkiSchema.safeParse({ boy: 170, kilo: 5 }).success).toBe(false);
  });
});
