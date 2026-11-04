import { describe, expect, it } from 'vitest';
import { calculateIssizlik, issizlikSchema } from './issizlik.ts';

const run = (v: object) => calculateIssizlik(issizlikSchema.parse(v));
const T = '2026-11-04';

describe('işsizlik maaşı', () => {
  it('ortalama 50.000, 900 gün: 20.000 brüt, DV 151,80, net 19.848,20 × 8 ay', () => {
    const r = run({ tarih: T, yontem: 'ortalama', ortalama: 50000, primGun: 900 });
    expect(r.brut).toBe(20000);
    expect(r.tavanUygulandi).toBe(false);
    expect(r.damga).toBe(151.8);
    expect(r.net).toBe(19848.2);
    expect(r.gun).toBe(240);
    expect(r.toplamNet).toBe(158785.6);
  });

  it('yüksek kazanç tavana takılır: 33.030 × %80 = 26.424; DV 200,56; 1080 gün → 10 ay', () => {
    const r = run({ tarih: T, k1: 80000, k2: 90000, k3: 100000, k4: 110000, primGun: 1080 });
    expect(r.ortalama).toBe(95000);
    expect(r.hesaplanan).toBe(38000);
    expect(r.tavanUygulandi).toBe(true);
    expect(r.brut).toBe(26424);
    expect(r.damga).toBe(200.56);
    expect(r.net).toBe(26223.44);
    expect(r.gun).toBe(300);
    expect(r.toplamNet).toBe(262234.4);
  });

  it('asgari ücretli, 600 gün: 13.212 brüt, DV 100,28 → 13.111,72 × 6', () => {
    const r = run({ tarih: T, k1: 33030, k2: 33030, k3: 33030, k4: 33030, primGun: 600 });
    expect(r.brut).toBe(13212);
    expect(r.net).toBe(13111.72);
    expect(r.gun).toBe(180);
    expect(r.toplamNet).toBe(78670.32);
  });

  it('599 gün veya son 120 gün şartı yoksa hak yok', () => {
    expect(run({ tarih: T, yontem: 'ortalama', ortalama: 40000, primGun: 599 }).hakVar).toBe(false);
    const r = run({ tarih: T, yontem: 'ortalama', ortalama: 40000, primGun: 1000, son120: false });
    expect(r.hakVar).toBe(false);
    expect(r.primYeterli).toBe(true);
    expect(r.toplamNet).toBe(0);
  });

  it('2025 tavanı: 26.005,50 × %80 = 20.804,40', () => {
    expect(run({ tarih: '2025-09-01', yontem: 'ortalama', ortalama: 90000, primGun: 700 }).brut).toBe(20804.4);
  });

  it('aylık yöntemde eksik ay hata verir', () => {
    expect(issizlikSchema.safeParse({ tarih: T, k1: 1000, k2: 1000, k3: 1000, primGun: 700 }).success).toBe(false);
  });
});
