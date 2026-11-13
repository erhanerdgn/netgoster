import { describe, expect, it } from 'vitest';
import { calculateDogalgaz, dogalgazFiyat, dogalgazTuketimiSchema, type DogalgazTuketimiInput } from './dogalgazTuketimi.ts';

// Kasım 2026 İstanbul: K1 = (10,625 + 0,1468 + 3,091972) × 1,2 = 16,636526; K2 = (18 + …) × 1,2 = 25,486526; limit 136,01 Sm³
const hesapla = (v: Partial<DogalgazTuketimiInput>) =>
  calculateDogalgaz(
    dogalgazTuketimiSchema.parse({
      mod: 'm3',
      verim: 90,
      faktor: 10.64,
      fiyat: 16.636526,
      fiyat2: 25.486526,
      limit: 136.01,
      ...v,
    }),
    0.2,
  );

describe('doğal gaz tüketimi', () => {
  it('güncel İstanbul fiyatı ve limiti config’den', () => {
    const f = dogalgazFiyat('2026-11-13');
    expect(f.k1).toBe(16.636526);
    expect(f.k2).toBe(25.486526);
    expect(f.limit).toBe(136.01);
    // Haziran 2025: (5,631275 + 0,1187 + 1,881465) × 1,2 = 9,157728; kademe yok
    const h = dogalgazFiyat('2025-06-15');
    expect(h.k1).toBe(9.157728);
    expect(h.limit).toBeNull();
  });

  it('100 m³ → 1.064 kWh, 1.663,65 TL (Kademe-1), KDV ayrımı', () => {
    // 100 × 16,636526 = 1663,6526 → 1663,65; KDV hariç 1663,65 / 1,2 = 1386,375 → 1386,38; KDV 277,27
    const r = hesapla({ m3: 100 });
    expect(r.kwh).toBeCloseTo(1064, 10);
    expect(r.kademe).toBe(1);
    expect(r.tl).toBe(1663.65);
    expect(r.kdvHaric).toBe(1386.38);
    expect(r.kdv).toBe(277.27);
  });

  it('limit sınırı: tam 136,01 m³ Kademe-1, 150 m³ tamamı Kademe-2', () => {
    // 136,01 × 16,636526 = 2262,7339 → 2262,73; 150 × 25,486526 = 3822,98
    expect(hesapla({ m3: 136.01 }).kademe).toBe(1);
    expect(hesapla({ m3: 136.01 }).tl).toBe(2262.73);
    const r = hesapla({ m3: 150 });
    expect(r.kademe).toBe(2);
    expect(r.tl).toBe(3822.98);
  });

  it('dönüşüm katsayısı 11 kWh/m³: 100 m³ = 1.100 kWh → 1.719,94 TL', () => {
    // 1100 kWh × (16,636526 / 10,64) TL/kWh = 1719,9416
    const r = hesapla({ m3: 100, faktor: 11 });
    expect(r.kwh).toBeCloseTo(1100, 10);
    expect(r.tl).toBe(1719.94);
  });

  it('bütçe → m³: limit altında, limitte kalan ve Kademe-2 durumları', () => {
    // 1000 / 16,636526 = 60,1087 m³
    const a = hesapla({ mod: 'tl', butce: 1000 });
    expect(a.m3).toBeCloseTo(60.1087, 4);
    expect(a.tl).toBe(1000);
    // 3000 TL: K1'de 180,3 m³ (limiti aşar), K2'de 117,7 m³ (limitin altı) → en fazla 136,01 m³; artan 3000 − 2262,7339 = 737,27
    const b = hesapla({ mod: 'tl', butce: 3000 });
    expect(b.m3).toBe(136.01);
    expect(b.kademe).toBe(1);
    expect(b.artan).toBe(737.27);
    expect(b.tl).toBe(2262.73);
    // 5000 TL: K2'de 5000 / 25,486526 = 196,1821 m³ > limit → Kademe-2
    const c = hesapla({ mod: 'tl', butce: 5000 });
    expect(c.kademe).toBe(2);
    expect(c.m3).toBeCloseTo(196.1821, 4);
  });

  it('kombi: 24 kW × 4 saat, %90 verim → günde 10,03 m³, ayda 300,75 m³ (Kademe-2)', () => {
    // ısı 96 kWh; gaz 96 / 0,9 = 106,667 kWh; / 10,64 = 10,02506 m³/gün; × 30 = 300,7519 m³
    // 300,7519 × 25,486526 = 7665,12 TL; günlük 10,02506 × 25,486526 = 255,50 TL
    const r = hesapla({ mod: 'kombi', guc: 24, saat: 4 });
    expect(r.isiGun).toBe(96);
    expect(r.m3Gun).toBeCloseTo(10.02506, 5);
    expect(r.m3).toBeCloseTo(300.7519, 4);
    expect(r.kademe).toBe(2);
    expect(r.tl).toBe(7665.12);
    expect(r.tlGun).toBe(255.5);
  });

  it('limit boşsa kademe uygulanmaz; K2 < K1 reddedilir', () => {
    expect(hesapla({ m3: 500, limit: undefined }).kademe).toBe(1);
    expect(dogalgazTuketimiSchema.safeParse({ mod: 'm3', m3: 10, verim: 90, faktor: 10.64, fiyat: 20, fiyat2: 10 }).success).toBe(
      false,
    );
  });
});
