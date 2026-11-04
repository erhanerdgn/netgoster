import { describe, expect, it } from 'vitest';
import { calculateIsverenMaliyeti, isverenMaliyetiSchema } from './isverenMaliyeti.ts';

const run = (v: object) => calculateIsverenMaliyeti(isverenMaliyetiSchema.parse(v));

describe('işveren maliyeti', () => {
  it('50.000 brüt, teşviksiz: 50.000 + 10.875 + 1.000 = 61.875; yıllık 742.500', () => {
    const r = run({ brut: 50000, yil: 2026 });
    expect(r.ay.sgkIsveren).toBe(10875);
    expect(r.ay.issizlikIsveren).toBe(1000);
    expect(r.ay.maliyet).toBe(61875);
    expect(r.toplam.maliyet).toBe(742500);
  });

  it('2 puan indirim: 61.875 − 1.000 = 60.875', () => {
    const r = run({ brut: 50000, tesvik: 'genel', yil: 2026 });
    expect(r.ay.hazineIndirimi).toBe(1000);
    expect(r.ay.maliyet).toBe(60875);
  });

  it('5 puan (imalat): 61.875 − 2.500 = 59.375', () => {
    expect(run({ brut: 50000, tesvik: 'imalat', yil: 2026 }).ay.maliyet).toBe(59375);
  });

  it('çalışanın neti: Ocak 40.207,53, yıllık 466.135,63', () => {
    const r = run({ brut: 50000, yil: 2026 });
    expect(r.ay.net).toBe(40207.53);
    expect(r.toplam.net).toBe(466135.63);
  });

  it('PEK tavanı: 400.000 brüt → işveren primleri 297.270 üzerinden', () => {
    // 297.270 × %21,75 = 64.656,225 → 64.656,23; × %2 = 5.945,40 → 470.601,63
    const r = run({ brut: 400000, yil: 2026 });
    expect(r.ay.sgkIsveren).toBe(64656.23);
    expect(r.ay.issizlikIsveren).toBe(5945.4);
    expect(r.ay.maliyet).toBe(470601.63);
  });
});
