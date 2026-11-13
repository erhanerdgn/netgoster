import { describe, expect, it } from 'vitest';
import { agirlikliOrtalama, listeIstatistik, ortalamaSchema, sayilariOku, type OrtalamaValues } from './ortalama.ts';

const liste = (veriler: string) => {
  const v = ortalamaSchema.parse({ mod: 'liste', veriler }) as Extract<OrtalamaValues, { mod: 'liste' }>;
  return listeIstatistik(v.veriler);
};

describe('sayı listesi okuma', () => {
  it('boşluk, alt satır, noktalı virgül, "virgül + boşluk" ayraçları; Türkçe ondalık', () => {
    expect(sayilariOku('3,5 4\n5;6, 7,25\t8').sayilar).toEqual([3.5, 4, 5, 6, 7.25, 8]);
  });
  it('noktalı ondalık, binlik ayraç ve boşluksuz virgüllü liste', () => {
    expect(sayilariOku('2.5 1.250 -3').sayilar).toEqual([2.5, 1250, -3]);
    expect(sayilariOku('10,20,30').sayilar).toEqual([10, 20, 30]);
  });
  it('okunamayan değerler raporlanır', () => {
    expect(sayilariOku('5 abc 7 1.2.3').hatali).toEqual(['abc', '1.2.3']);
    expect(ortalamaSchema.safeParse({ mod: 'liste', veriler: '5 x' }).success).toBe(false);
    expect(ortalamaSchema.safeParse({ mod: 'liste', veriler: '  ;  ' }).success).toBe(false);
  });
});

describe('liste istatistikleri', () => {
  it('2 4 4 4 5 5 7 9 (klasik örnek)', () => {
    // toplam 40, n 8 → ort 5; medyan (4+5)/2 = 4,5; mod 4 (3 kez); aralık 9−2 = 7
    // sapma kareleri: 9+1+1+1+0+0+4+16 = 32 → pop. varyans 4, σ = 2; örneklem 32/7 = 4,571…, s = 2,13809…
    const r = liste('2 4 4 4 5 5 7 9');
    expect(r).toMatchObject({ n: 8, toplam: 40, aritmetik: 5, medyan: 4.5, modlar: [4], modFrekans: 3, aralik: 7 });
    expect(r.ssPopulasyon).toBe(2);
    expect(r.varyansOrneklem).toBeCloseTo(32 / 7, 10);
    expect(r.ssOrneklem).toBeCloseTo(2.138089935, 8);
  });

  it('geometrik ve harmonik ortalama', () => {
    // 2 ve 8: geometrik √16 = 4; harmonik 2 ÷ (1/2 + 1/8) = 2 ÷ 0,625 = 3,2
    const r = liste('2 8');
    expect(r.geometrik).toBe(4);
    expect(r.harmonik).toBe(3.2);
    // 60 ve 40 km/sa aynı yol: ortalama hız harmonik = 48
    expect(liste('60 40').harmonik).toBe(48);
  });

  it('sıfır veya negatif değer varsa geometrik/harmonik tanımsız', () => {
    const r = liste('-2 0 2');
    expect(r.geometrik).toBeUndefined();
    expect(r.harmonik).toBeUndefined();
    expect(r.aritmetik).toBe(0);
  });

  it('tek değer: örneklem sapması yok, mod yok', () => {
    const r = liste('7,5');
    expect(r).toMatchObject({ n: 1, aritmetik: 7.5, medyan: 7.5, modlar: [], aralik: 0, ssPopulasyon: 0 });
    expect(r.ssOrneklem).toBeUndefined();
  });

  it('çok modlu dağılım ve tek sayıda değerin medyanı', () => {
    // 1 1 2 3 3 → modlar 1 ve 3; medyan 2
    const r = liste('3 1 2 3 1');
    expect(r.modlar).toEqual([1, 3]);
    expect(r.medyan).toBe(2);
  });

  it('kayan nokta gürültüsü temizlenir: 0,1 + 0,2', () => {
    expect(liste('0,1 0,2').toplam).toBe(0.3);
    expect(liste('0,1 0,2').aritmetik).toBe(0.15);
  });
});

describe('ağırlıklı ortalama', () => {
  it('vize %40 = 55, final %60 = 80 → 70', () => {
    // 55×40 + 80×60 = 2200 + 4800 = 7000; ÷ 100 = 70; basit ort. 67,5
    const r = agirlikliOrtalama([
      { deger: 55, agirlik: 40 },
      { deger: 80, agirlik: 60 },
    ]);
    expect(r).toMatchObject({ ortalama: 70, agirlikToplam: 100, carpimToplam: 7000, basit: 67.5 });
    expect(r.satirlar[0].pay).toBeCloseTo(0.4, 10);
  });

  it('boş/eksik satırlar atlanır; ağırlık toplamı sıfır olamaz', () => {
    const v = ortalamaSchema.parse({
      mod: 'agirlikli',
      satirlar: [{ deger: 90, agirlik: 2 }, { deger: 70 }, {}, { deger: 60, agirlik: 1 }],
    }) as Extract<OrtalamaValues, { mod: 'agirlikli' }>;
    // (90×2 + 60×1) ÷ 3 = 240 ÷ 3 = 80
    expect(agirlikliOrtalama(v.satirlar).ortalama).toBe(80);
    expect(ortalamaSchema.safeParse({ mod: 'agirlikli', satirlar: [{ deger: 5, agirlik: 0 }] }).success).toBe(false);
    expect(ortalamaSchema.safeParse({ mod: 'agirlikli', satirlar: [{}] }).success).toBe(false);
    expect(ortalamaSchema.safeParse({ mod: 'agirlikli', satirlar: [{ deger: 5, agirlik: -1 }] }).success).toBe(false);
  });
});
