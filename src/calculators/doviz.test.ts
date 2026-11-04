import { describe, expect, it } from 'vitest';
import { calculateDoviz, dovizSchema, type KurKaydi } from './doviz.ts';

/** Örnek TCMB listesi (gerçek bülten biçiminde, değerler test için) */
const rates: KurKaydi[] = [
  { code: 'USD', unit: 1, forexBuying: 41.8, forexSelling: 41.9, banknoteBuying: 41.77, banknoteSelling: 41.96 },
  { code: 'EUR', unit: 1, forexBuying: 48.2, forexSelling: 48.3, banknoteBuying: 48.17, banknoteSelling: 48.37 },
  { code: 'JPY', unit: 100, forexBuying: 27.5, forexSelling: 27.7, banknoteBuying: 27.4, banknoteSelling: 27.8 },
  { code: 'CNY', unit: 1, forexBuying: 5.8, forexSelling: 5.85, banknoteBuying: null, banknoteSelling: null },
  { code: 'XDR', unit: 1, forexBuying: 57.1, forexSelling: null, banknoteBuying: null, banknoteSelling: null },
];

const run = (v: object, r: KurKaydi[] | null = rates) => calculateDoviz(dovizSchema.parse(v), r);

describe('döviz çevirici', () => {
  it('USD → TRY döviz satış: 1.000 × 41,90 = 41.900 ₺', () => {
    const r = run({ tutar: 1000, kaynak: 'USD', hedef: 'TRY', kurTuru: 'forexSelling' });
    expect(r.sonuc).toBe(41900);
    expect(r.kur).toBe(41.9);
  });

  it('TRY → EUR döviz alış: 10.000 / 48,20 = 207,468… → 207,47 €', () => {
    expect(run({ tutar: 10000, kaynak: 'TRY', hedef: 'EUR', kurTuru: 'forexBuying' }).sonuc).toBe(207.47);
  });

  it('JPY Unit=100: 10.000 ¥ → TRY döviz alış = 10.000 × 27,5 / 100 = 2.750 ₺', () => {
    const r = run({ tutar: 10000, kaynak: 'JPY', hedef: 'TRY', kurTuru: 'forexBuying' });
    expect(r.sonuc).toBe(2750);
    expect(r.kaynakTl).toBeCloseTo(0.275, 12);
  });

  it('çapraz kur EUR → USD efektif satış: 500 × 48,37 / 41,96 = 576,3822… → 576,38 $', () => {
    const r = run({ tutar: 500, kaynak: 'EUR', hedef: 'USD', kurTuru: 'banknoteSelling' });
    expect(r.sonuc).toBe(576.38);
    expect(r.kur).toBeCloseTo(48.37 / 41.96, 12);
  });

  it('efektif kuru olmayan CNY döviz kuruna düşer: 100 CNY efektif alış → 100 × 5,80 = 580 ₺', () => {
    const r = run({ tutar: 100, kaynak: 'CNY', hedef: 'TRY', kurTuru: 'banknoteBuying' });
    expect(r.sonuc).toBe(580);
    expect(r.dovizeDusulen).toEqual(['CNY']);
  });

  it('XDR döviz satış yayımlanmıyorsa açık hata verir', () => {
    expect(() => run({ tutar: 1, kaynak: 'XDR', hedef: 'TRY', kurTuru: 'forexSelling' })).toThrow(/yayımlamıyor/);
  });

  it('veri yokken elle kur: 250 USD × 41,5 = 10.375 ₺', () => {
    const r = run({ tutar: 250, kaynak: 'USD', hedef: 'TRY', kurTuru: 'forexSelling', elleKur: 41.5 }, null);
    expect(r.sonuc).toBe(10375);
    expect(r.elle).toBe(true);
  });

  it('veri yok ve elle kur yoksa hata; aynı para birimi şema hatası', () => {
    expect(() => run({ tutar: 1, kaynak: 'USD', hedef: 'TRY', kurTuru: 'forexSelling' }, null)).toThrow();
    expect(dovizSchema.safeParse({ tutar: 1, kaynak: 'USD', hedef: 'USD', kurTuru: 'forexSelling' }).success).toBe(false);
  });
});
