import { describe, expect, it } from 'vitest';
import { calculateYuzde, yuzdeSchema } from './yuzde.ts';

const run = (v: object) => calculateYuzde(yuzdeSchema.parse({ yon: 'artir', ...v }));

describe('yüzde hesaplama', () => {
  it("X'in %Y'si: 250 × 18 / 100 = 45; ondalık taşması temizlenir (19,99 × 7 / 100 = 1,3993)", () => {
    expect(run({ mod: 'yuzdesi', x: 250, y: 18 }).sonuc).toBe(45);
    expect(run({ mod: 'yuzdesi', x: 19.99, y: 7 }).sonuc).toBe(1.3993);
  });

  it('yüzde değişim: 80 → 100 = +%25, 100 → 80 = −%20 (simetrik değil)', () => {
    expect(run({ mod: 'degisim', x: 80, y: 100 })).toMatchObject({ sonuc: 25, fark: 20 });
    expect(run({ mod: 'degisim', x: 100, y: 80 })).toMatchObject({ sonuc: -20, fark: -20 });
  });

  it('negatif başlangıç: −50 → −25 = (−25 + 50) / |−50| = +%50', () => {
    expect(run({ mod: 'degisim', x: -50, y: -25 }).sonuc).toBe(50);
  });

  it('X, Y’nin yüzde kaçı: 45 / 180 × 100 = %25; 300 / 120 = %250', () => {
    expect(run({ mod: 'kac', x: 45, y: 180 }).sonuc).toBe(25);
    expect(run({ mod: 'kac', x: 300, y: 120 }).sonuc).toBe(250);
  });

  it('artır/azalt: 200 +%20 = 240 (geri dönüş −%16,67); 200 −%25 = 150 (geri dönüş +%33,33)', () => {
    const a = run({ mod: 'artir', x: 200, y: 20, yon: 'artir' });
    expect(a).toMatchObject({ sonuc: 240, fark: 40 });
    expect(a.tersYuzde).toBeCloseTo(-16.6667, 4);
    const b = run({ mod: 'artir', x: 200, y: 25, yon: 'azalt' });
    expect(b).toMatchObject({ sonuc: 150, fark: -50 });
    expect(b.tersYuzde).toBeCloseTo(33.3333, 4);
    expect(run({ mod: 'artir', x: 200, y: 100, yon: 'azalt' })).toMatchObject({ sonuc: 0, tersYuzde: undefined });
  });

  it('sıfıra bölme anlaşılır hatayla reddedilir', () => {
    const d = yuzdeSchema.safeParse({ mod: 'degisim', x: 0, y: 10, yon: 'artir' });
    expect(d.success).toBe(false);
    expect(d.error?.issues[0].message).toContain('0 olamaz');
    expect(yuzdeSchema.safeParse({ mod: 'kac', x: 5, y: 0, yon: 'artir' }).success).toBe(false);
  });

  it('başka moda ait alan doğrulanmaz (kac modunda gizli yon yok sayılır)', () => {
    expect(yuzdeSchema.safeParse({ mod: 'kac', x: 1, y: 4 }).success).toBe(true);
  });
});
