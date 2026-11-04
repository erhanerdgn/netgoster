import { describe, expect, it } from 'vitest';
import { calculateEmlakVergisi, emlakVergisiSchema } from './emlakVergisi.ts';

const run = (v: object, today = '2026-11-04') => calculateEmlakVergisi(emlakVergisiSchema.parse(v), today);

describe('emlak vergisi', () => {
  it('büyükşehirde konut binde 2: 1.500.000 × 0,002 = 3.000; taksitler 1.500', () => {
    const r = run({ tur: 'konut', deger: 1500000, buyuksehir: true });
    expect(r.oran).toBe(0.002);
    expect(r.yillik).toBe(3000);
    expect(r.taksit1).toBe(1500);
    expect(r.taksit2).toBe(1500);
  });

  it('büyükşehir dışı işyeri binde 2, %50 hisse: 2.000.000 × 0,5 × 0,002 = 2.000', () => {
    const r = run({ tur: 'isyeri', deger: 2000000, buyuksehir: false, hisse: 50 });
    expect(r.hisseMatrah).toBe(1000000);
    expect(r.yillik).toBe(2000);
  });

  it('arsa büyükşehir binde 6, tek kuruş farkı ikinci taksitte: 333.333 × 0,006 = 1.999,998 → 2.000', () => {
    const r = run({ tur: 'arsa', deger: 333333, buyuksehir: true });
    expect(r.yillik).toBe(2000);
    const t = run({ tur: 'arazi', deger: 123457, buyuksehir: false }); // × 0,001 = 123,46
    expect(t.taksit1).toBe(61.73);
    expect(t.taksit2).toBe(61.73);
    const u = run({ tur: 'arazi', deger: 123467, buyuksehir: false }); // 123,47 → 61,74 + 61,73
    expect(u.taksit1 + u.taksit2).toBeCloseTo(123.47, 10);
  });

  it('2026 artış sınırı: 2025 değeri 400.000 → 2026 matrahı en fazla 1.200.000', () => {
    // 1.200.000 × 0,002 = 2.400
    const r = run({ tur: 'konut', deger: 2000000, buyuksehir: true, oncekiDeger: 400000 });
    expect(r.sinirUygulandi).toBe(true);
    expect(r.matrah).toBe(1200000);
    expect(r.yillik).toBe(2400);
    // sınır yalnız 2026 için: 2027'de girilse bile uygulanmaz
    expect(run({ tur: 'konut', deger: 2000000, oncekiDeger: 400000 }, '2027-03-01').sinirUygulandi).toBe(false);
  });

  it('emekli tek konut sıfır oran; konut dışı türde muafiyet uygulanmaz', () => {
    expect(run({ tur: 'konut', deger: 1500000, muaf: true }).yillik).toBe(0);
    const isyeri = run({ tur: 'isyeri', deger: 1000000, buyuksehir: true, muaf: true });
    expect(isyeri.muafiyet).toBe(false);
    expect(isyeri.yillik).toBe(4000);
  });
});
