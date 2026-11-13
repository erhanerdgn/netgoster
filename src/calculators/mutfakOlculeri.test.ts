import { describe, expect, it } from 'vitest';
import { bilesikOlcu, calculateMutfakOlculeri, mutfakOlculeriSchema } from './mutfakOlculeri.ts';

const hesap = (v: object) => calculateMutfakOlculeri(mutfakOlculeriSchema.parse(v));

describe('mutfak ölçüleri', () => {
  it('1 su bardağı un (kaşıkla) = 200 ml × 0,53 = 106 g', () => {
    const r = hesap({ miktar: 1, birim: 'suBardagi', malzeme: 'un' });
    expect(r.ml).toBe(200);
    expect(r.gram).toBeCloseTo(106, 6);
    expect(r.agirlik).toBe(false);
  });

  it('1 yemek kaşığı tuz = 15 ml × 1,22 = 18,3 g', () => {
    expect(hesap({ miktar: 1, birim: 'yemekKasigi', malzeme: 'tuz' }).gram).toBeCloseTo(18.3, 6);
  });

  it('100 g un = 188,68 ml → yarım su bardağı + 6 yemek kaşığı', () => {
    // 100 / 0,53 = 188,68 ml: 1 yarım (100) + 5 yk (75) + 13,68 ml → 3 çk → 6. yk = 190 ml
    const r = hesap({ miktar: 100, birim: 'g', malzeme: 'un' });
    expect(r.ml).toBeCloseTo(188.679, 3);
    expect(r.bilesik).toBe('yarım su bardağı + 6 yemek kaşığı');
    expect(r.karsiliklar.find((k) => k.kod === 'suBardagi')!.miktar).toBeCloseTo(0.9434, 4);
  });

  it('250 g toz şeker = 294,12 ml → 1 su bardağı + 6 yemek kaşığı + 1 çay kaşığı', () => {
    // 250 / 0,85 = 294,12: 2 yarım (200) + 6 yk (90) + 4,12 ml → 1 çk
    expect(hesap({ miktar: 250, birim: 'g', malzeme: 'tozSeker' }).bilesik).toBe('1 su bardağı + 6 yemek kaşığı + 1 çay kaşığı');
  });

  it('1 kg un = 1886,79 ml → 9 su bardağı + 5 yemek kaşığı + 2 çay kaşığı', () => {
    // 1000 / 0,53 = 1886,79: 18 yarım (1800) + 5 yk (75) + 11,79 ml → 2 çk
    const r = hesap({ miktar: 1, birim: 'kg', malzeme: 'un' });
    expect(r.gram).toBe(1000);
    expect(r.bilesik).toBe('9 su bardağı + 5 yemek kaşığı + 2 çay kaşığı');
  });

  it('1 cup (ABD) su = 236,59 g ve 1,18 su bardağı', () => {
    const r = hesap({ miktar: 1, birim: 'usCup', malzeme: 'su' });
    expect(r.gram).toBeCloseTo(236.588, 3);
    expect(r.karsiliklar.find((k) => k.kod === 'suBardagi')!.miktar).toBeCloseTo(1.18294, 5);
    expect(r.karsiliklar.find((k) => k.kod === 'usTbsp')!.miktar).toBeCloseTo(16, 9);
  });

  it('1 su bardağı ölçüsünün gram ağırlığı her satırda: kakao 200 × 0,36 = 72 g', () => {
    const r = hesap({ miktar: 3, birim: 'g', malzeme: 'kakao' });
    expect(r.karsiliklar.find((k) => k.kod === 'suBardagi')!.birGram).toBeCloseTo(72, 9);
    expect(r.karsiliklar.find((k) => k.kod === 'cayKasigi')!.birGram).toBeCloseTo(1.8, 9);
  });

  it('bileşik gösterim sınırları', () => {
    expect(bilesikOlcu(300)).toBe('1,5 su bardağı');
    expect(bilesikOlcu(45)).toBe('3 yemek kaşığı');
    // 98 ml: 6 yk + 8 ml → 2 çk = 100 ml → yarım su bardağına toplanır
    expect(bilesikOlcu(98)).toBe('yarım su bardağı');
    // 97 ml: 6 yk + 7 ml → 1 çk = 95 ml
    expect(bilesikOlcu(97)).toBe('6 yemek kaşığı + 1 çay kaşığı');
    // 2 g tuz = 1,64 ml → yarım çay kaşığı; 0,1 g = 0,08 ml
    expect(hesap({ miktar: 2, birim: 'g', malzeme: 'tuz' }).bilesik).toBe('yarım çay kaşığı');
    expect(hesap({ miktar: 0.1, birim: 'g', malzeme: 'tuz' }).bilesik).toBe('yarım çay kaşığından az');
  });

  it('sıfır ve geçersiz girdiyi reddeder', () => {
    expect(mutfakOlculeriSchema.safeParse({ miktar: 0, birim: 'g', malzeme: 'un' }).success).toBe(false);
    expect(mutfakOlculeriSchema.safeParse({ miktar: 1, birim: 'fincan', malzeme: 'un' }).success).toBe(false);
  });
});
