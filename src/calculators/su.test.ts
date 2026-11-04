import { describe, expect, it } from 'vitest';
import { calculateSu, suSchema } from './su.ts';

const run = (v: object) => calculateSu(suSchema.parse(v));

describe('su ihtiyacı', () => {
  it('kadın 70 kg: 70 × 32,5 = 2275 ml (aralık 2100–2450); 2275/200 = 11,4 → 11 bardak; EFSA 2,0 L', () => {
    const r = run({ kilo: 70, cinsiyet: 'kadin' });
    expect([r.aralikMin, r.aralikMax, r.temel, r.toplam]).toEqual([2100, 2450, 2275, 2275]);
    expect(r.bardak).toBe(11);
    expect(r.efsa).toBe(2000);
  });

  it('erkek 80 kg 60 dk egzersiz: 2600 + 2 × 350 = 3300 ml; 16,5 → 17 bardak; EFSA 2,5 L', () => {
    const r = run({ kilo: 80, cinsiyet: 'erkek', egzersiz: 60 });
    expect(r.egzersizEk).toBe(700);
    expect(r.toplam).toBe(3300);
    expect(r.bardak).toBe(17);
    expect(r.efsa).toBe(2500);
  });

  it('hamile 60 kg, 30 dk, sıcak: 1950 + 350 + 500 + 300 = 3100 ml; EFSA 2000 + 300 = 2300', () => {
    const r = run({ kilo: 60, cinsiyet: 'kadin', egzersiz: 30, sicak: true, durum: 'hamile' });
    expect(r.toplam).toBe(3100);
    expect(r.bardak).toBe(16); // 15,5 → 16
    expect(r.efsa).toBe(2300);
  });

  it('emziren 55 kg: 1787,5 → 1788 + 700 = 2488 ml; 12,4 → 12 bardak; EFSA 2700', () => {
    const r = run({ kilo: 55, cinsiyet: 'kadin', durum: 'emziriyor' });
    expect(r.toplam).toBe(2488);
    expect(r.bardak).toBe(12);
    expect(r.efsa).toBe(2700);
  });

  it('45 dk egzersiz: 45/30 × 350 = 525 ml', () => {
    expect(run({ kilo: 70, cinsiyet: 'erkek', egzersiz: 45 }).egzersizEk).toBe(525);
  });

  it('şema: erkek + hamile ve aralık dışı kilo reddedilir', () => {
    expect(suSchema.safeParse({ kilo: 70, cinsiyet: 'erkek', durum: 'hamile' }).success).toBe(false);
    expect(suSchema.safeParse({ kilo: 10, cinsiyet: 'kadin' }).success).toBe(false);
  });
});
