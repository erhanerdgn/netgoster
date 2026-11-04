import { describe, expect, it } from 'vitest';
import { calculateKalori, kaloriSchema } from './kalori.ts';

const run = (v: object) => calculateKalori(kaloriSchema.parse(v));

describe('kalori ihtiyacı (Mifflin-St Jeor)', () => {
  it('erkek 30 y 180 cm 80 kg: 800 + 1125 − 150 + 5 = 1780; ×1,2 = 2136; −500 → 1636', () => {
    const r = run({ cinsiyet: 'erkek', yas: 30, boy: 180, kilo: 80, aktivite: 'sedanter', hedef: 'ver' });
    expect(r.bmr).toBe(1780);
    expect(r.tdee).toBe(2136);
    expect(r.hedefKcal).toBe(1636);
    expect(r.bmrAlti).toBe(true); // 1636 < 1780
  });

  it('kadın 25 y 165 cm 60 kg: 600 + 1031,25 − 125 − 161 = 1345,25; ×1,55 = 2085,14; +500 → 2585', () => {
    const r = run({ cinsiyet: 'kadin', yas: 25, boy: 165, kilo: 60, aktivite: 'orta', hedef: 'al' });
    expect(r.bmr).toBe(1345);
    expect(r.tdee).toBe(2085);
    expect(r.hedefKcal).toBe(2585);
    expect(r.bmrAlti).toBe(false);
  });

  it('kadın 50 y 160 cm 70 kg hafif aktif: 1289 × 1,375 = 1772,4 → 1772; koruma', () => {
    const r = run({ cinsiyet: 'kadin', yas: 50, boy: 160, kilo: 70, aktivite: 'hafif' });
    expect(r.bmr).toBe(1289);
    expect(r.hedefKcal).toBe(1772);
  });

  it('erkek 40 y 175 cm 90 kg aşırı aktif: 1798,75 × 1,9 = 3417,6 → 3418', () => {
    const r = run({ cinsiyet: 'erkek', yas: 40, boy: 175, kilo: 90, aktivite: 'cokYuksek', hedef: 'koru' });
    expect(r.bmr).toBe(1799);
    expect(r.tdee).toBe(3418);
    expect(r.seviyeler.map((s) => s.tdee)).toEqual([2159, 2473, 2788, 3103, 3418]); // 1798,75 × 1,2/1,375/1,55/1,725/1,9
  });

  it('makro (1636 kcal): protein 1636×0,2/4 = 81,8 → 82 g; yağ 1636×0,3/9 = 54,5 → 55 g; KH 1636×0,5/4 = 204,5 → 205 g', () => {
    const r = run({ cinsiyet: 'erkek', yas: 30, boy: 180, kilo: 80, aktivite: 'sedanter', hedef: 'ver' });
    expect(r.makro).toEqual({ protein: 82, yag: 55, karbonhidrat: 205 });
  });

  it('şema: 18 yaş altı ve eksik aktivite reddedilir', () => {
    expect(kaloriSchema.safeParse({ cinsiyet: 'erkek', yas: 15, boy: 170, kilo: 60, aktivite: 'orta' }).success).toBe(false);
    expect(kaloriSchema.safeParse({ cinsiyet: 'erkek', yas: 30, boy: 170, kilo: 60 }).success).toBe(false);
  });
});
