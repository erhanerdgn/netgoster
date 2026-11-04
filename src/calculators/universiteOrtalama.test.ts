import { describe, expect, it } from 'vitest';
import { calculateUniversite, universiteSchema, yokDonusum } from './universiteOrtalama.ts';

const run = (v: object) => calculateUniversite(universiteSchema.parse(v));
const d = (harf: string | undefined, kredi: number) => ({ harf, kredi });

describe('üniversite not ortalaması', () => {
  it('AA×5 + BB×5 + CC×4 = 43 / 14 = 3,0714 → 3,07; 100’lük ⌊(70×307 + 2000)/3⌋/100 = 78,30', () => {
    const r = run({ dersler: [d('AA', 5), d('BB', 5), d('CC', 4)] });
    expect(r.donemOrt).toBe(3.07);
    expect(r.gano).toBeNull();
    expect(r.yuzluk).toBe(78.3);
  });

  it('önceki GANO 2,50 / 60 kredi + BA×6 + CB×6 (36/12 = 3,00) → (150 + 36)/72 = 2,5833 → 2,58 → 66,86', () => {
    const r = run({ dersler: [d('BA', 6), d('CB', 6)], oncekiGano: 2.5, oncekiKredi: 60 });
    expect(r.donemOrt).toBe(3);
    expect(r.gano).toBe(2.58);
    expect(r.toplamKredi).toBe(72);
    // (70×258 + 2000)/3 = 20060/3 = 6686,67 → 66,86
    expect(r.yuzluk).toBe(66.86);
  });

  it('YÖK tablosu: 4,00→100 · 3,00→76,66 · 3,33→84,36 · 1,00→30 · 0,99→tabloda yok', () => {
    expect(yokDonusum(4)).toBe(100);
    expect(yokDonusum(3)).toBe(76.66);
    expect(yokDonusum(3.33)).toBe(84.36);
    expect(yokDonusum(1)).toBe(30);
    expect(yokDonusum(0.99)).toBeNull();
  });

  it('FD×4 + DD×4 = 6/8 = 0,75 → 100’lük karşılığı yok', () => {
    const r = run({ dersler: [d('FD', 4), d('DD', 4)] });
    expect(r.donemOrt).toBe(0.75);
    expect(r.yuzluk).toBeNull();
  });

  it('harfsiz ve 0 kredili satırlar atlanır', () => {
    const r = run({ dersler: [d('AA', 3), d(undefined, 5), d('FF', 0)] });
    expect(r.dersSayisi).toBe(1);
    expect(r.donemOrt).toBe(4);
  });

  it('doğrulama: GANO varsa kredi de gerekir; hiç ders yoksa hata', () => {
    expect(universiteSchema.safeParse({ dersler: [d('AA', 5)], oncekiGano: 3 }).success).toBe(false);
    expect(universiteSchema.safeParse({ dersler: [d(undefined, 5)] }).success).toBe(false);
    expect(universiteSchema.safeParse({ dersler: [d('AB', 5)] }).success).toBe(false);
  });
});
