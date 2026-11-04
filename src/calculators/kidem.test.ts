import { describe, expect, it } from 'vitest';
import { calculateKidem, kidemSchema } from './kidem.ts';

const run = (v: object) => calculateKidem(kidemSchema.parse(v));

describe('kıdem tazminatı', () => {
  it('tam 5 yıl, tavan altı: 40.000 × 5 = 200.000, damga 1.518', () => {
    const r = run({ giris: '2021-03-01', cikis: '2026-02-28', brut: 40000 });
    expect(r.sure).toEqual({ years: 5, months: 0, days: 0 });
    expect(r.brut).toBe(200000);
    expect(r.damga).toBe(1518);
    expect(r.net).toBe(198482);
  });

  it('Ocak–Haziran 2026 tavanı (64.948,77) uygulanır', () => {
    const r = run({ giris: '2016-07-01', cikis: '2026-06-30', brut: 100000 });
    expect(r.tavanUygulandi).toBe(true);
    expect(r.esasUcret).toBe(64948.77);
    expect(r.brut).toBe(649487.7);
    expect(r.damga).toBe(4929.61);
    expect(r.net).toBe(644558.09);
  });

  it('Temmuz 2026 tavanı (73.729,87) ve yan haklar', () => {
    const r = run({ giris: '2023-07-16', cikis: '2026-07-15', brut: 80000, yanHaklar: 5000 });
    expect(r.giydirilmis).toBe(85000);
    expect(r.tavan).toBe(73729.87);
    expect(r.brut).toBe(221189.61);
    expect(r.damga).toBe(1678.83);
    expect(r.net).toBe(219510.78);
  });

  it('kesirli süre: 2 yıl 4 ay 15 gün', () => {
    const r = run({ giris: '2024-01-10', cikis: '2026-05-24', brut: 30000, yanHaklar: 3000 });
    expect(r.sure).toEqual({ years: 2, months: 4, days: 15 });
    expect(r.brut).toBe(78356.16);
    expect(r.damga).toBe(594.72);
    expect(r.net).toBe(77761.44);
  });

  it('1 yıldan az çalışmada hak yok', () => {
    const r = run({ giris: '2026-01-01', cikis: '2026-10-31', brut: 50000 });
    expect(r.hakVar).toBe(false);
    expect(r.net).toBe(0);
  });

  it('çıkış girişten önceyse şema hata verir', () => {
    expect(kidemSchema.safeParse({ giris: '2026-05-01', cikis: '2026-01-01', brut: 30000 }).success).toBe(false);
  });
});
