import { describe, expect, it } from 'vitest';
import { calculateLise, liseSchema } from './liseOrtalama.ts';

const run = (dersler: [number | undefined, number][], davranis100 = true) =>
  calculateLise(liseSchema.parse({ dersler: dersler.map(([puan, saat]) => ({ puan, saat })), davranis100 }));

describe('lise not ortalaması', () => {
  it('(80×5 + 90×4 + 70×2) / 11 = 900/11 = 81,8181… → 81,8181 (4 basamak kesilir), teşekkür', () => {
    const r = run([
      [80, 5],
      [90, 4],
      [70, 2],
    ]);
    expect(r.ortalama).toBe(81.8181);
    expect(r.derece).toBe('İyi');
    expect(r.gecme).toBe('dogrudan');
    expect(r.belge).toBe('tesekkur');
  });

  it('(90×5 + 85×3) / 8 = 88,125 → takdir; davranış 100 değilse belge yok', () => {
    expect(
      run([
        [90, 5],
        [85, 3],
      ]).belge,
    ).toBe('takdir');
    const r = run(
      [
        [90, 5],
        [85, 3],
      ],
      false,
    );
    expect(r.belge).toBeNull();
    expect(r.belgeEngeli).toMatch(/Davranış/);
  });

  it('sınır: (85 + 84×2) / 3 = 84,3333 → teşekkür (takdir değil)', () => {
    const r = run([
      [85, 1],
      [84, 2],
    ]);
    expect(r.ortalama).toBe(84.3333);
    expect(r.belge).toBe('tesekkur');
  });

  it('1 başarısız ders, YBP (40×2 + 80×6)/8 = 70 → doğrudan geçer (YBP ile), belge yok', () => {
    const r = run([
      [40, 2],
      [80, 6],
    ]);
    expect(r.ortalama).toBe(70);
    expect(r.basarisiz).toBe(1);
    expect(r.gecme).toBe('ybp');
    expect(r.belge).toBeNull();
  });

  it('3 başarısız, YBP (3×45×2 + 90×10)/16 = 73,125 → sorumlu geçer', () => {
    const r = run([
      [45, 2],
      [45, 2],
      [45, 2],
      [90, 10],
    ]);
    expect(r.ortalama).toBe(73.125);
    expect(r.gecme).toBe('sorumlu');
  });

  it('4 başarısız → sınıf tekrarı; 2 başarısız ama YBP (150+60+120)/9 = 36,6666 < 50 → tekrar', () => {
    expect(
      run([
        [40, 2],
        [40, 2],
        [40, 2],
        [40, 2],
        [90, 10],
      ]).gecme,
    ).toBe('tekrar');
    const r = run([
      [30, 5],
      [60, 1],
      [40, 3],
    ]);
    expect(r.ortalama).toBe(36.6666);
    expect(r.gecme).toBe('tekrar');
  });

  it('boş puanlı satırlar atlanır; hepsi boşsa veya saat 13 ise şema hatası', () => {
    expect(
      run([
        [undefined, 5],
        [60, 2],
      ]).ortalama,
    ).toBe(60);
    expect(liseSchema.safeParse({ dersler: [{ saat: 4 }] }).success).toBe(false);
    expect(liseSchema.safeParse({ dersler: [{ puan: 70, saat: 13 }] }).success).toBe(false);
  });
});
