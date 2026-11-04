import { describe, expect, it } from 'vitest';
import { calculateKredi, krediSchema } from './kredi.ts';

const run = (v: object) => calculateKredi(krediSchema.parse(v), '2026-11-04');

describe('kredi hesaplama', () => {
  it('100.000 TL, aylık %3, 12 ay ihtiyaç: brüt oran %3,9 → taksit 10.593,48', () => {
    // r = 0,03 × 1,30 = 0,039; (1,039)^12 = 1,582656; taksit = 100000 × 0,039 × 1,582656 / 0,582656 = 10.593,48
    const r = run({ tur: 'ihtiyac', tutar: 100000, faiz: 3, vade: 12 });
    expect(r.brutOran).toBeCloseTo(0.039, 12);
    expect(r.taksit).toBe(10593.48);
    // 1. ay: faiz 3.000, KKDF 450, BSMV 450, anapara 10.593,48 − 3.900 = 6.693,48, kalan 93.306,52
    expect(r.plan[0]).toEqual({ ay: 1, taksit: 10593.48, faiz: 3000, kkdf: 450, bsmv: 450, anapara: 6693.48, kalan: 93306.52 });
    // Son taksit kuruş artığıyla 10.593,52; kalan 0
    expect(r.plan[11].kalan).toBe(0);
    expect(r.sonTaksit).toBe(10593.52);
    // toplam = 11 × 10.593,48 + 10.593,52 = 127.121,80; maliyet = 27.121,80 = faiz + KKDF + BSMV
    expect(r.toplamOdeme).toBe(127121.8);
    expect(r.toplamMaliyet).toBe(27121.8);
    expect(r.toplamFaiz).toBe(20862.94);
    expect(r.toplamKkdf).toBe(3129.43);
    expect(r.toplamBsmv).toBe(3129.43);
    // efektif yıllık = 1,039^12 − 1 = %58,27
    expect(r.efektifYillik).toBeCloseTo(0.582656, 6);
  });

  it('konut kredisi vergisizdir: 2.000.000 TL, %2,79, 120 ay', () => {
    // r = 0,0279 (KKDF/BSMV yok); 1. ay faiz = 2.000.000 × 0,0279 = 55.800; taksit 57.932,14
    const r = run({ tur: 'konut', tutar: 2000000, faiz: 2.79, vade: 120 });
    expect(r.kkdfOran).toBe(0);
    expect(r.bsmvOran).toBe(0);
    expect(r.taksit).toBe(57932.14);
    expect(r.plan[0].faiz).toBe(55800);
    expect(r.plan[0].anapara).toBe(2132.14);
    expect(r.toplamKkdf + r.toplamBsmv).toBe(0);
    expect(r.plan.at(-1)!.kalan).toBe(0);
    // anaparaların toplamı krediye eşit
    expect(r.plan.reduce((s, t) => s + t.anapara, 0)).toBeCloseTo(2000000, 6);
  });

  it('taşıt kredisi KKDF+BSMV %30: 500.000 TL, %3,49, 36 ay', () => {
    // r = 0,0349 × 1,3 = 0,04537; 1. ay faiz 17.450, KKDF 2.617,50, BSMV 2.617,50
    const r = run({ tur: 'tasit', tutar: 500000, faiz: 3.49, vade: 36, masraf: 2500 });
    expect(r.taksit).toBe(28442.71);
    expect(r.plan[0]).toMatchObject({ faiz: 17450, kkdf: 2617.5, bsmv: 2617.5, anapara: 5757.71 });
    expect(r.toplamOdeme).toBe(1023937.69);
    expect(r.toplamMasrafDahil).toBe(1026437.69);
  });

  it('faiz oranı 0 ise taksit = tutar / vade', () => {
    const r = run({ tur: 'ihtiyac', tutar: 60000, faiz: 0, vade: 12 });
    expect(r.taksit).toBe(5000);
    expect(r.toplamOdeme).toBe(60000);
    expect(r.toplamMaliyet).toBe(0);
  });

  it('tek taksit: 10.000 TL, %2 → 10.000 + 200 faiz + 30 KKDF + 30 BSMV = 10.260', () => {
    const r = run({ tur: 'ihtiyac', tutar: 10000, faiz: 2, vade: 1 });
    expect(r.taksit).toBe(10260);
    expect(r.plan).toHaveLength(1);
    expect(r.plan[0].kalan).toBe(0);
  });

  it('geçersiz vade şemada reddedilir', () => {
    expect(krediSchema.safeParse({ tur: 'ihtiyac', tutar: 1000, faiz: 3, vade: 0 }).success).toBe(false);
    expect(krediSchema.safeParse({ tur: 'ihtiyac', tutar: 1000, faiz: 3, vade: 12.5 }).success).toBe(false);
  });
});
