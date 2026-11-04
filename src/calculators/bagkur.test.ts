import { describe, expect, it } from 'vitest';
import { bagkurSchema, calculateBagkur } from './bagkur.ts';

const T = '2026-06-15';
const run = (v: object) => calculateBagkur(bagkurSchema.parse(v), T);

describe('Bağkur prim (2026: PEK 33.030 – 297.270, %35,75 / %30,75)', () => {
  it('alt sınır: 33.030 × %35,75 = 11.808,225 → 11.808,23; × %30,75 = 10.156,725 → 10.156,73', () => {
    const r = run({ kazanc: 33030 });
    expect(r.aylikIndirimsiz).toBe(11808.23);
    expect(r.aylikIndirimli).toBe(10156.73);
    expect(r.aylik).toBe(10156.73); // indirim varsayılan açık
  });

  it('üst sınır: 297.270 × %35,75 = 106.274,03; × %30,75 = 91.410,53', () => {
    const r = run({ kazanc: 297270, indirim: false });
    expect(r.aylikIndirimsiz).toBe(106274.03);
    expect(r.aylikIndirimli).toBe(91410.53);
    expect(r.aylik).toBe(106274.03);
    expect(r.yillik).toBe(1275288.36); // 106.274,03 × 12
  });

  it('50.000 ₺: aylık 17.875 / 15.375, yıllık 214.500 / 184.500, fark 2.500 / 30.000', () => {
    const r = run({ kazanc: 50000 });
    expect(r.aylikIndirimsiz).toBe(17875);
    expect(r.aylikIndirimli).toBe(15375);
    expect(r.yillikIndirimsiz).toBe(214500);
    expect(r.yillikIndirimli).toBe(184500);
    expect(r.aylikFark).toBe(2500);
    expect(r.yillikFark).toBe(30000);
  });

  it('5 puan farkı alt sınırda 33.030 × %5 = 1.651,50', () => {
    const r = run({ kazanc: 33030 });
    expect(r.aylikFark).toBe(1651.5);
    expect(r.yillikIndirimli).toBe(121880.76); // 10.156,73 × 12
  });

  it('alt sınırın altı ve üst sınırın üstü reddedilir', () => {
    expect(bagkurSchema.safeParse({ kazanc: 33029.99 }).success).toBe(false);
    expect(bagkurSchema.safeParse({ kazanc: 297270.01 }).success).toBe(false);
    expect(bagkurSchema.safeParse({ kazanc: 33030 }).success).toBe(true);
  });
});
