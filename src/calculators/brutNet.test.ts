import { describe, expect, it } from 'vitest';
import { brutNetSchema, calculateBrutNet } from './brutNet.ts';

const run = (v: object) => calculateBrutNet(brutNetSchema.parse(v));

describe('brütten nete maaş', () => {
  it('50.000 brüt, 12 ay: yıllık net 466.135,63', () => {
    // GV: 4×2.163,67 + 3.288,67 + 4.288,67 + 3.962,25 + 2×2.884,90 + 4.634,90 + 2×5.859,90 = 42.318,77
    // DV: 12 × 128,80 = 1.545,60 → 600.000 − 90.000 − 42.318,77 − 1.545,60
    const r = run({ brut: 50000, yil: 2026 });
    expect(r.aylar[0].net).toBe(40207.53);
    expect(r.aylar[11].net).toBe(36511.3); // 50.000 − 7.500 − 5.859,90 − 128,80
    expect(r.toplam.gv).toBe(42318.77);
    expect(r.toplam.net).toBe(466135.63);
    expect(r.ortalamaNet).toBe(38844.64); // 466.135,63 / 12
  });

  it('asgari ücret: her ay 28.075,50 net, yıllık 336.906', () => {
    const r = run({ brut: 33030, yil: 2026 });
    expect(r.aylar.every((a) => a.net === 28075.5 && a.gv === 0 && a.dv === 0)).toBe(true);
    expect(r.toplam.net).toBe(336906);
  });

  it('100.000 brüt Ocak: GV 12.750 − 4.211,33; DV 759 − 250,70 → net 75.953,03', () => {
    const r = run({ brut: 100000, yil: 2026 });
    expect(r.aylar[0].gv).toBe(8538.67);
    expect(r.aylar[0].dv).toBe(508.3);
    expect(r.aylar[0].net).toBe(75953.03);
  });

  it('PEK tavanını aşan 400.000: SGK tavandan, Ocak neti 295.253,63', () => {
    const r = run({ brut: 400000, yil: 2026 });
    expect(r.aylar[0].sgkIsci).toBe(41617.8);
    expect(r.aylar[0].net).toBe(295253.63);
    // Şubat: kümülatif 355.409,50 → 710.819: 44.590,50×%20 + 310.819×%27 = 8.918,10 + 83.921,13 = 92.839,23 − 4.211,33
    expect(r.aylar[1].gv).toBe(88627.9);
  });

  it('2025 asgari ücreti 26.005,50: net 22.104,67 (2025 tarifesi ve oranları)', () => {
    // SGK 3.640,77, işsizlik 260,06 (260,055 yukarı)
    const r = run({ brut: 26005.5, yil: 2025 });
    expect(r.aylar[6].net).toBe(22104.67);
    expect(r.aylar[6].gv).toBe(0);
  });

  it('yıl verilmezse güncel parametre yılı kullanılır', () => {
    expect(brutNetSchema.parse({ brut: 1000 }).yil).toBeGreaterThanOrEqual(2026);
  });
});
