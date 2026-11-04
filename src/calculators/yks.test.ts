import { describe, expect, it } from 'vitest';
import { calculateYks, yksSchema } from './yks.ts';

const run = (v: object) => calculateYks(yksSchema.parse(v));
const p = (r: ReturnType<typeof run>, tur: string) => r.puanlar.find((x) => x.tur === tur)!;

// Ortak örnek: TYT Türkçe 30D 8Y → 28, Sosyal 15D 4Y → 14, Mat 25D 8Y → 23, Fen 10D 4Y → 9
// AYT Mat 20D 8Y → 18, Fizik 8D 4Y → 7, Kimya 7D 4Y → 6, Biyoloji 9D 4Y → 8
const sayisalci = {
  dy: {
    tytTurkce: { d: 30, y: 8 },
    tytSosyal: { d: 15, y: 4 },
    tytMat: { d: 25, y: 8 },
    tytFen: { d: 10, y: 4 },
    aytMat: { d: 20, y: 8 },
    aytFizik: { d: 8, y: 4 },
    aytKimya: { d: 7, y: 4 },
    aytBiyoloji: { d: 9, y: 4 },
  },
  diploma: 85,
};

describe('YKS puan', () => {
  it('TYT ham 346,5; OBP 425 × 0,12 = 51 → 397,5', () => {
    // 100 + 3,3×28 + 3,4×14 + 3,3×23 + 3,4×9 = 100 + 92,4 + 47,6 + 75,9 + 30,6 = 346,5
    const r = run(sayisalci);
    expect(r.tytNet).toBe(74);
    expect(r.obp).toBe(425);
    expect(r.obpKatkisi).toBe(51);
    expect(p(r, 'TYT').ham).toBeCloseTo(346.5, 5);
    expect(p(r, 'TYT').yerlestirme).toBeCloseTo(397.5, 5);
  });

  it('SAY ham 315,53, EA hesaplanır (Mat), SÖZ/DİL hesaplanmaz', () => {
    // TYT kısmı: 1,32×28 + 1,36×14 + 1,32×23 + 1,36×9 = 36,96 + 19,04 + 30,36 + 12,24 = 98,6
    // AYT SAY: 3×18 + 2,85×7 + 3,07×6 + 3,07×8 = 54 + 19,95 + 18,42 + 24,56 = 116,93 → 100 + 98,6 + 116,93
    const r = run(sayisalci);
    expect(p(r, 'SAY').ham).toBeCloseTo(315.53, 5);
    expect(p(r, 'SAY').yerlestirme).toBeCloseTo(366.53, 5);
    // EA: 100 + 98,6 + 3×18 = 252,6
    expect(p(r, 'EA').hesaplandi).toBe(true);
    expect(p(r, 'EA').ham).toBeCloseTo(252.6, 5);
    expect(p(r, 'SÖZ').hesaplandi).toBe(false);
    expect(p(r, 'SÖZ').yerlestirme).toBeNull();
    expect(p(r, 'DİL').hesaplandi).toBe(false);
  });

  it('2025’te yerleşen: OBP katsayısı 0,06 → 425 × 0,06 = 25,5; TYT 372', () => {
    const r = run({ ...sayisalci, yerlesti: true });
    expect(r.obpKatkisi).toBe(25.5);
    expect(p(r, 'TYT').yerlestirme).toBeCloseTo(372, 5);
  });

  it('tam net: TYT 500, SAY 499,72; diploma 100 → +60', () => {
    // SAY: 100 + 160 (TYT kısmı) + 3×40 + 2,85×14 + 3,07×13 × 2 = 100 + 160 + 239,72
    const dy: Record<string, { d: number; y: number }> = {
      tytTurkce: { d: 40, y: 0 },
      tytSosyal: { d: 20, y: 0 },
      tytMat: { d: 40, y: 0 },
      tytFen: { d: 20, y: 0 },
      aytMat: { d: 40, y: 0 },
      aytFizik: { d: 14, y: 0 },
      aytKimya: { d: 13, y: 0 },
      aytBiyoloji: { d: 13, y: 0 },
    };
    const r = run({ dy, diploma: 100 });
    expect(p(r, 'TYT').ham).toBeCloseTo(500, 5);
    expect(p(r, 'TYT').yerlestirme).toBeCloseTo(560, 5);
    expect(p(r, 'SAY').ham).toBeCloseTo(499.72, 5);
  });

  it('puan hesaplanma şartı: Türkçe 0,25 net ve Mat −0,5 net → hiçbir puan yok', () => {
    // Türkçe 1D 3Y = 0,25 < 0,5; Mat 0D 2Y = −0,5; Sosyal 20D tek başına yetmez
    const r = run({ dy: { tytTurkce: { d: 1, y: 3 }, tytMat: { d: 0, y: 2 }, tytSosyal: { d: 20, y: 0 } } });
    expect(r.puanlar.every((x) => !x.hesaplandi)).toBe(true);
  });

  it('sınır: Türkçe 1D 2Y = 0,5 net yeterli; DİL = 100 + 1,32×0,5 + 3×55 = 265,66', () => {
    // YDT 60D 20Y = 55 net
    const r = run({ dy: { tytTurkce: { d: 1, y: 2 }, ydt: { d: 60, y: 20 } } });
    expect(p(r, 'TYT').hesaplandi).toBe(true);
    expect(p(r, 'DİL').hesaplandi).toBe(true);
    expect(p(r, 'DİL').ham).toBeCloseTo(265.66, 5);
    expect(p(r, 'DİL').yerlestirme).toBeNull(); // diploma girilmedi
  });

  it('SÖZ: Sosyal-2 testi yeterli (Tarih-2 6D 4Y = 5 net) → 100 + 1,32×20 + 2,9×5 = 140,9', () => {
    const r = run({ dy: { tytTurkce: { d: 20, y: 0 }, aytTarih2: { d: 6, y: 4 } } });
    expect(p(r, 'SÖZ').hesaplandi).toBe(true);
    expect(p(r, 'SÖZ').ham).toBeCloseTo(140.9, 5);
    expect(p(r, 'EA').hesaplandi).toBe(false);
  });

  it('doğrulama: D + Y soru sayısını aşamaz, diploma 50–100', () => {
    expect(yksSchema.safeParse({ dy: { tytTurkce: { d: 35, y: 6 } } }).success).toBe(false);
    expect(yksSchema.safeParse({ dy: {}, diploma: 45 }).success).toBe(false);
    expect(yksSchema.safeParse({ dy: { aytDin: { d: 6, y: 0 } }, diploma: 50 }).success).toBe(true);
  });
});
