import { describe, expect, it } from 'vitest';
import { calculateFazlaMesai, fazlaMesaiSchema } from './fazlaMesai.ts';

const run = (v: object) => calculateFazlaMesai(fazlaMesaiSchema.parse(v));

describe('fazla mesai', () => {
  it('45.000 brüt, 10 saat Ocak: saatlik 200, mesai 3.000, net ek 2.144,73', () => {
    // 3.000 × %85 = 2.550; GV %15 = 382,50; DV 22,77 → 2.144,73
    const r = run({ brut: 45000, fmSaat: 10, ay: '1', yil: 2026 });
    expect(r.saatlik).toBe(200);
    expect(r.fm).toBe(3000);
    expect(r.sgk).toBe(450);
    expect(r.gv).toBe(382.5);
    expect(r.dv).toBe(22.77);
    expect(r.netEk).toBe(2144.73);
  });

  it('asgari ücretli 2 bayram günü (Haziran): 2.202 brüt → net 1.574,24', () => {
    // 2.202 × %85 = 1.871,70; GV 4.492,08 − 4.211,33 = 280,75; DV 267,41 − 250,70 = 16,71
    const r = run({ brut: 33030, bayramGun: 2, ay: '6', yil: 2026 });
    expect(r.bayram).toBe(2202);
    expect(r.gv).toBe(280.75);
    expect(r.dv).toBe(16.71);
    expect(r.netEk).toBe(1574.24);
  });

  it('fazla süreli %25 ve hafta tatili %50: 200 × 1,25 × 10 = 2.500; 1.500 × 1,5 = 2.250', () => {
    const r = run({ brut: 45000, fsSaat: 10, haftaTatiliGun: 1, ay: '1', yil: 2026 });
    expect(r.fs).toBe(2500);
    expect(r.haftaTatili).toBe(2250);
    expect(r.ek).toBe(4750);
  });

  it('Mayıs, 50.000 brüt, 20 saat: 6.666,67; %20 dilimde net ek 4.482,74', () => {
    // 6.666,67 × %85 ≈ 5.666,67; GV %20 = 1.133,33; DV 50,60
    const r = run({ brut: 50000, fmSaat: 20, ay: '5', yil: 2026 });
    expect(r.fm).toBe(6666.67);
    expect(r.netEk).toBe(4482.74);
    expect(r.maasNet).toBe(39082.53);
  });

  it('ek çalışma yoksa ek ve net fark 0; 23 saat/ay yıllık 270 sınırını aşar', () => {
    const r = run({ brut: 45000, ay: '3', yil: 2026 });
    expect(r.ek).toBe(0);
    expect(r.netEk).toBe(0);
    expect(run({ brut: 45000, fmSaat: 23, ay: '3', yil: 2026 }).yillikSinirAsimi).toBe(true);
  });
});
