import { describe, expect, it } from 'vitest';
import { altinSchema, altinTanimlari, calculateAltin } from './altin.ts';

const D = '2026-11-04';
const run = (v: object, has: number | null = 5000) => calculateAltin(altinSchema.parse(v), has, D);

describe('altın hesaplama', () => {
  it('Darphane ağırlıkları ve milyemler', () => {
    const t = altinTanimlari(D);
    expect([t.ceyrek.gram, t.yarim.gram, t.tam.gram, t.cumhuriyet.gram]).toEqual([1.754, 3.508, 7.016, 7.216]);
    expect([t.gram24.milyem, t.ayar22.milyem, t.ayar18.milyem, t.ayar14.milyem]).toEqual([0.995, 0.916, 0.75, 0.583]);
  });

  it('çeyrek (ziynet), has 5.000 ₺/g: 1,754 × 0,916 × 5.000 = 8.033,32 ₺; 3 adet 24.099,96 ₺', () => {
    const r = run({ tur: 'ceyrek', miktar: 3, kaynak: 'canli' });
    expect(r.birimDeger).toBe(8033.32);
    expect(r.toplam).toBe(24099.96);
    expect(r.brutGram).toBe(5.262);
    expect(r.hasGramMiktar).toBe(4.82);
  });

  it('Cumhuriyet / Ata: 7,216 × 0,916 × 5.000 = 33.049,28 ₺', () => {
    expect(run({ tur: 'cumhuriyet', miktar: 1, kaynak: 'canli' }).toplam).toBe(33049.28);
  });

  it('gram altın 24 ayar (995): 10 g × 0,995 × 5.000 = 49.750 ₺', () => {
    expect(run({ tur: 'gram24', miktar: 10, kaynak: 'canli' }).toplam).toBe(49750);
  });

  it('14 ayar 12,5 g: 12,5 × 0,583 × 5.000 = 36.437,50 ₺', () => {
    expect(run({ tur: 'ayar14', miktar: 12.5, kaynak: 'canli' }).toplam).toBe(36437.5);
  });

  it('kendi fiyatım: 24 ayar gram 4.975 ₺ → has 4.975 / 0,995 = 5.000; 22 ayar 20 g = 20 × 0,916 × 5.000 = 91.600 ₺', () => {
    const r = run({ tur: 'ayar22', miktar: 20, kaynak: 'elle', gramFiyat: 4975 }, 9999);
    expect(r.fiyatKaynagi).toBe('elle');
    expect(r.hasGram).toBe(5000);
    expect(r.toplam).toBe(91600);
  });

  it('canlı veri yoksa girilen fiyata düşer; o da yoksa hata', () => {
    const r = run({ tur: 'tam', miktar: 1, kaynak: 'canli', gramFiyat: 4975 }, null);
    // 7,016 × 0,916 × 5.000 = 32.133,28
    expect(r).toMatchObject({ fiyatKaynagi: 'elleYedek', toplam: 32133.28 });
    expect(() => run({ tur: 'tam', miktar: 1, kaynak: 'canli' }, null)).toThrow();
  });

  it('adetli türde kesirli miktar ve elle seçilip fiyat girilmemesi şema hatası', () => {
    expect(altinSchema.safeParse({ tur: 'yarim', miktar: 1.5, kaynak: 'canli' }).success).toBe(false);
    expect(altinSchema.safeParse({ tur: 'ayar18', miktar: 1.5, kaynak: 'elle' }).success).toBe(false);
  });
});
