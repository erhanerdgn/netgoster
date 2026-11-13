import { describe, expect, it } from 'vitest';
import { calculateFaiz, faizSchema, type FaizInput } from './faiz.ts';

const base: FaizInput = { mod: 'faiz', tur: 'basit', donem: 'yillik', anapara: 100000, oran: 40, sure: 1, sureBirim: 'yil' };
const hesapla = (v: Partial<FaizInput>) => calculateFaiz(faizSchema.parse({ ...base, ...v }));

describe('faiz hesaplama', () => {
  it('basit faiz: 100.000 TL, %40, 1 yıl', () => {
    // 100.000 × (1 + 0,40 × 1) = 140.000; efektif = %40; 72 kuralı 72/40 = 1,8 yıl; basitte ikiye katlanma 1/0,4 = 2,5 yıl
    const r = hesapla({});
    expect(r.vadeSonu).toBe(140000);
    expect(r.faiz).toBe(40000);
    expect(r.efektif).toBeCloseTo(0.4, 12);
    expect(r.kural72).toBeCloseTo(1.8, 12);
    expect(r.ikiKat).toBeCloseTo(2.5, 12);
  });

  it('basit faiz gün olarak: 90 gün, %45', () => {
    // 100.000 × (1 + 0,45 × 90/365) = 111.095,89; efektif = 1,1109589^(365/90) − 1 = %53,23
    const r = hesapla({ oran: 45, sure: 90, sureBirim: 'gun' });
    expect(r.vadeSonu).toBe(111095.89);
    expect(r.efektif).toBeCloseTo(0.532254, 5);
  });

  it('aylık bileşik: %40, 12 ay', () => {
    // 100.000 × (1 + 0,40/12)^12 = 148.212,65; efektif = %48,2126; ikiye katlanma ln2 / (12 ln(1,03333)) = 1,7616 yıl
    const r = hesapla({ tur: 'bilesik', donem: 'aylik', sure: 12, sureBirim: 'ay' });
    expect(r.vadeSonu).toBe(148212.65);
    expect(r.efektif).toBeCloseTo(0.482126, 6);
    expect(r.ikiKat).toBeCloseTo(1.761591, 5);
  });

  it('yıllık bileşik: %50, 3 yıl ve günlük bileşik: %45, 90 gün', () => {
    // 100.000 × 1,5³ = 337.500
    expect(hesapla({ tur: 'bilesik', oran: 50, sure: 3 }).vadeSonu).toBe(337500);
    // 100.000 × (1 + 0,45/365)^90 = 111.727,26
    expect(hesapla({ tur: 'bilesik', donem: 'gunluk', oran: 45, sure: 90, sureBirim: 'gun' }).vadeSonu).toBe(111727.26);
  });

  it('tersine: 200.000 TL hedefe ulaşma süresi', () => {
    // basit: (2 − 1) / 0,40 = 2,5 yıl; yıllık bileşik: ln 2 / ln 1,4 = 2,0600 yıl
    const s = { mod: 'sure', hedef: 200000, sure: undefined } as const;
    expect(hesapla(s).yil).toBeCloseTo(2.5, 12);
    const b = hesapla({ ...s, tur: 'bilesik' });
    expect(b.yil).toBeCloseTo(2.060043, 5);
    expect(b.vadeSonu).toBe(200000);
    expect(b.faiz).toBe(100000);
  });

  it('tersine: 2 yılda 200.000 TL için gereken oran', () => {
    // basit: (2 − 1) / 2 = %50; yıllık bileşik: √2 − 1 = %41,42
    const s = { mod: 'oran', hedef: 200000, oran: undefined, sure: 2 } as const;
    expect(hesapla(s).oran).toBeCloseTo(50, 10);
    expect(hesapla({ ...s, tur: 'bilesik' }).oran).toBeCloseTo((Math.SQRT2 - 1) * 100, 10);
  });

  it('%0 faiz: tutar değişmez, ikiye katlanma yok', () => {
    const r = hesapla({ tur: 'bilesik', oran: 0, sure: 5 });
    expect(r.vadeSonu).toBe(100000);
    expect(r.efektif).toBe(0);
    expect(r.ikiKat).toBeUndefined();
    expect(r.kural72).toBeUndefined();
  });

  it('geçersiz girişler', () => {
    const ok = (v: Partial<FaizInput>) => faizSchema.safeParse({ ...base, ...v }).success;
    expect(ok({ sure: 0 })).toBe(false);
    expect(ok({ sure: 101 })).toBe(false); // 100 yıl sınırı
    expect(ok({ oran: undefined })).toBe(false);
    expect(ok({ mod: 'sure', hedef: 90000 })).toBe(false); // hedef anaparadan küçük
    expect(ok({ mod: 'sure', hedef: 200000, oran: 0 })).toBe(false);
    expect(ok({ mod: 'oran', hedef: 200000, oran: undefined })).toBe(true);
  });
});
