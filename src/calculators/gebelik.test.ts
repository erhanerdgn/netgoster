import { describe, expect, it } from 'vitest';
import { todayISO } from '../config/period.ts';
import { addDays } from './common.ts';
import { calculateGebelik, gebelikSchema } from './gebelik.ts';

const T = '2026-11-04';
const run = (v: object, today = T) => calculateGebelik(gebelikSchema.parse(v), today);

describe('gebelik haftası', () => {
  it('SAT 12.08.2026, 28 gün: 19+30+31+4 = 84 gün → 12+0; TDT 19.05.2027 (Naegele +1y −3a +7g); kalan 196', () => {
    const r = run({ sat: '2026-08-12' });
    expect([r.hafta, r.gunArti]).toEqual([12, 0]);
    expect(r.trimester).toBe(1);
    expect(r.tdt).toBe('2027-05-19');
    expect(r.kalanGun).toBe(196);
    expect(r.dollenme).toBe('2026-08-26');
  });

  it('35 günlük döngü: 84 − 7 = 77 gün → 11+0; TDT 7 gün sonra (26.05.2027)', () => {
    const r = run({ sat: '2026-08-12', dongu: 35 });
    expect([r.hafta, r.gunArti]).toEqual([11, 0]);
    expect(r.tdt).toBe('2027-05-26');
    expect(r.kalanGun).toBe(203);
  });

  it('trimester sınırları: 13+6 → 1, 14+0 → 2, 27+6 → 2, 28+0 → 3', () => {
    expect(run({ sat: addDays(T, -97) }).trimester).toBe(1);
    expect(run({ sat: addDays(T, -98) }).trimester).toBe(2);
    expect(run({ sat: addDays(T, -195) }).trimester).toBe(2);
    expect(run({ sat: addDays(T, -196) }).trimester).toBe(3);
  });

  it('tarama durumu 12+0 haftada: ilk USG geçti, NT şimdi, OGTT gelecek; NT tarih aralığı 11+0 – 13+6', () => {
    const r = run({ sat: '2026-08-12' });
    const by = (s: string) => r.taramalar.find((t) => t.ad.startsWith(s))!;
    expect(by('İlk ultrason').durum).toBe('gecti');
    expect(by('İlk trimester').durum).toBe('simdi');
    expect(by('Gebelik şekeri').durum).toBe('gelecek');
    expect(by('İlk trimester').baslangic).toBe('2026-10-28'); // SAT + 77
    expect(by('İlk trimester').bitis).toBe('2026-11-17'); // SAT + 97
  });

  it('40+3 haftada kalan gün negatif (TDT geçti)', () => {
    const r = run({ sat: addDays(T, -283) });
    expect([r.hafta, r.gunArti]).toEqual([40, 3]);
    expect(r.kalanGun).toBe(-3);
  });

  it('şema: gelecekteki SAT ve 42 haftadan eski SAT reddedilir; tam 42+0 kabul', () => {
    const t = todayISO();
    expect(gebelikSchema.safeParse({ sat: addDays(t, 1) }).success).toBe(false);
    expect(gebelikSchema.safeParse({ sat: addDays(t, -295) }).success).toBe(false);
    expect(gebelikSchema.safeParse({ sat: addDays(t, -294) }).success).toBe(true);
    expect(gebelikSchema.safeParse({ sat: addDays(t, -10), dongu: 50 }).success).toBe(false);
  });
});
