import { describe, expect, it } from 'vitest';
import { calculateKiraArtis, kiraArtisSchema } from './kiraArtis.ts';

const run = (v: object) => calculateKiraArtis(kiraArtisSchema.parse(v));

describe('kira artış', () => {
  it('Kasım 2026 yenilemesi → Ekim 2026 verisi %31,23: 20.000 × 1,3123 = 26.246', () => {
    const r = run({ tur: 'konut', kira: 20000, ay: '11', yil: '2026' });
    expect(r.gerekenAy).toBe('2026-10');
    expect(r.kullanilanAy).toBe('2026-10');
    expect(r.yayimlanmadi).toBe(false);
    expect(r.oran).toBe(31.23);
    expect(r.artis).toBe(6246);
    expect(r.yeniKira).toBe(26246);
    expect(r.yillikFark).toBe(74952);
    expect(r.son12).toHaveLength(12);
    expect(r.son12[0].ay).toBe('2025-11');
    expect(r.son12[11].ay).toBe('2026-10');
  });

  it('Ocak yenilemesi bir önceki yılın Aralık verisini kullanır (Aralık 2025: %34,88)', () => {
    // 12.345 × 0,3488 = 4.305,94 → 16.650,94
    const r = run({ tur: 'isyeri', kira: 12345, ay: '1', yil: '2026' });
    expect(r.gerekenAy).toBe('2025-12');
    expect(r.artis).toBe(4305.94);
    expect(r.yeniKira).toBe(16650.94);
  });

  it('verisi açıklanmamış ay: Aralık 2026 → Kasım verisi yok, en son açıklanan Ekim kullanılır', () => {
    const r = run({ tur: 'isyeri', kira: 50000, ay: '12', yil: '2026' });
    expect(r.yayimlanmadi).toBe(true);
    expect(r.gerekenAy).toBe('2026-11');
    expect(r.kullanilanAy).toBe('2026-10');
    expect(r.yeniKira).toBe(65615); // 50.000 × 1,3123
  });

  it('Mart 2024 konut: TÜFE %55,91 ama %25 sınırı → 15.000 × 1,25 = 18.750', () => {
    const r = run({ tur: 'konut', kira: 15000, ay: '3', yil: '2024' });
    expect(r.sinir25).toBe(true);
    expect(r.tufeOrani).toBe(55.91);
    expect(r.oran).toBe(25);
    expect(r.yeniKira).toBe(18750);
  });

  it('Mart 2024 işyeri: %25 sınırı yok → 15.000 × 1,5591 = 23.386,50', () => {
    const r = run({ tur: 'isyeri', kira: 15000, ay: '3', yil: '2024' });
    expect(r.sinir25).toBe(false);
    expect(r.yeniKira).toBe(23386.5);
  });

  it('Temmuz 2024 konut: sınır yalnız 01.07.2024 için — TÜFE (%65,07) uygulanır, uyarı bayrağı açık', () => {
    const r = run({ tur: 'konut', kira: 10000, ay: '7', yil: '2024' });
    expect(r.sinir25).toBe(false);
    expect(r.sinir25SonGun).toBe(true);
    expect(r.yeniKira).toBe(16507);
  });

  it('veri başlangıcından önceki yenileme reddedilir', () => {
    expect(kiraArtisSchema.safeParse({ tur: 'konut', kira: 1000, ay: '1', yil: '2024' }).success).toBe(false);
  });
});
