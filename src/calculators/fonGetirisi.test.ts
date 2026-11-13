import { describe, expect, it } from 'vitest';
import {
  calculateFonGetirisi,
  donemEnflasyonu,
  fiyatBul,
  fonGrubu,
  fonGetirisiSchema,
  fonStopajOrani,
  type FonGetirisiInput,
} from './fonGetirisi.ts';

const hesapla = (v: Partial<FonGetirisiInput>) =>
  calculateFonGetirisi(
    fonGetirisiSchema.parse({
      tur: 'indirimli',
      yontem: 'fiyat',
      tutar: 100000,
      alisFiyat: 1.25,
      satisFiyat: 1.6,
      alis: '2025-08-01',
      satis: '2026-08-01',
      ...v,
    }),
  );

describe('fon getirisi', () => {
  it('para piyasası, 09.07.2025 sonrası alış: %17,5 stopaj', () => {
    // adet = 100.000 / 1,25 = 80.000; satış = 80.000 × 1,6 = 128.000; brüt = 28.000
    // stopaj = 28.000 × 0,175 = 4.900; net = 23.100; 365 gün → yıllık = dönem = %23,1
    const r = hesapla({});
    expect(r.adet).toBe(80000);
    expect(r.satisTutari).toBe(128000);
    expect(r.brutKazanc).toBe(28000);
    expect(r.stopajOran).toBe(0.175);
    expect(r.stopaj).toBe(4900);
    expect(r.netKazanc).toBe(23100);
    expect(r.netTutar).toBe(123100);
    expect(r.gun).toBe(365);
    expect(r.netYillik).toBeCloseTo(0.231, 10);
  });

  it('hisse senedi yoğun fon: stopaj yok', () => {
    const r = hesapla({ tur: 'hisse' });
    expect(r.stopaj).toBe(0);
    expect(r.netKazanc).toBe(28000);
  });

  it('zararda stopaj kesilmez', () => {
    // 50.000 / 2 = 25.000 pay × 1,8 = 45.000 → −5.000
    const r = hesapla({ tur: 'diger', tutar: 50000, alisFiyat: 2, satisFiyat: 1.8, alis: '2025-10-01', satis: '2026-04-01' });
    expect(r.brutKazanc).toBe(-5000);
    expect(r.stopaj).toBe(0);
    expect(r.netKazanc).toBe(-5000);
    expect(r.netTutar).toBe(45000);
  });

  it('23.12.2020–30.04.2024 alış: indirimli grupta %0, değişken/karma/serbest grubunda %10', () => {
    // 10.000 TL, 1,0 → 1,5: brüt 5.000
    const a = hesapla({ tutar: 10000, alisFiyat: 1, satisFiyat: 1.5, alis: '2023-06-15', satis: '2024-06-15' });
    expect(a.stopaj).toBe(0);
    const b = hesapla({ tur: 'diger', tutar: 10000, alisFiyat: 1, satisFiyat: 1.5, alis: '2023-06-15', satis: '2024-06-15' });
    expect(b.stopaj).toBe(500);
    expect(b.netKazanc).toBe(4500);
  });

  it('oran, alış tarihindeki karara göre: 2024 Mayıs %7,5 · 2024 Kasım %10 · 2025 Şubat %15', () => {
    // 20.000 TL, 2 → 2,5: brüt 5.000
    const v = { tutar: 20000, alisFiyat: 2, satisFiyat: 2.5, satis: '2026-06-01' };
    expect(hesapla({ ...v, alis: '2024-06-10' }).stopaj).toBe(375);
    expect(hesapla({ ...v, alis: '2024-11-01' }).stopaj).toBe(500);
    expect(hesapla({ ...v, alis: '2025-03-01' }).stopaj).toBe(750);
    // sınır günü: 08.07.2025 alış %15, 09.07.2025 alış %17,5
    expect(fonStopajOrani('indirimli', '2025-07-08', '2026-01-01').oran).toBe(0.15);
    expect(fonStopajOrani('indirimli', '2025-07-09', '2026-01-01').oran).toBe(0.175);
  });

  it('yıllık getiri yöntemi: 40.000 TL, %50, 365 gün', () => {
    // 40.000 × 1,5 = 60.000; brüt 20.000; 01.03.2025 alış %15 → stopaj 3.000; net 17.000
    const r = hesapla({ yontem: 'oran', oran: 50, tutar: 40000, alis: '2025-03-01', satis: '2026-03-01' });
    expect(r.adet).toBeUndefined();
    expect(r.satisTutari).toBe(60000);
    expect(r.stopaj).toBe(3000);
    expect(r.netKazanc).toBe(17000);
  });

  it('GSYF/GYF: 2 yıldan fazla elde tutulursa %0, tam 2 yılda stopaj var', () => {
    // 01.06.2024 alış (%7,5 dönemi): 01.06.2026 tam 2 yıl → %7,5; 02.06.2026 → %0
    expect(fonStopajOrani('gsyfGyf', '2024-06-01', '2026-06-01').oran).toBe(0.075);
    expect(fonStopajOrani('gsyfGyf', '2024-06-01', '2026-06-02').oran).toBe(0);
    // 29.02.2028'i içeren tam 2 yıl (731 gün) hâlâ "2 yıldan fazla" değildir → alış tarihindeki %17,5
    expect(fonStopajOrani('gsyfGyf', '2026-03-01', '2028-03-01').oran).toBe(0.175);
    expect(fonStopajOrani('gsyfGyf', '2026-03-01', '2028-03-02').oran).toBe(0);
    expect(fonStopajOrani('gsyfGyf', '2025-08-01', '2027-08-01').oran).toBe(0.175);
  });

  it('reel getiri: Şubat ve Mart 2026 TÜFE ile', () => {
    // enflasyon = 1,0296 × 1,0194 − 1 = 0,04957424
    // 100.000, 1 → 1,1: brüt 10.000, %17,5 → net 8.250 (%8,25); reel = 1,0825 / 1,04957424 − 1 ≈ 0,03137
    const r = hesapla({ alisFiyat: 1, satisFiyat: 1.1, alis: '2026-01-15', satis: '2026-03-10' });
    expect(r.netKazanc).toBe(8250);
    expect(r.enflasyon).toBeCloseTo(0.04957424, 8);
    expect(r.reel).toBeCloseTo(0.03137, 5);
    expect(r.enflasyonAylar).toEqual(['2026-02', '2026-03']);
  });

  it('satış ayı verisi yoksa son yayımlanan aya kadar; aynı ay ya da veri öncesi alışta hesaplanmaz', () => {
    // 2026-09 alış, 2027-02 satış: yalnız Ekim 2026 (%2,58) yayımlanmış
    const e = donemEnflasyonu('2026-09-01', '2027-02-01')!;
    expect(e.oran).toBeCloseTo(0.0258, 10);
    expect(e.aylar).toEqual(['2026-10', '2026-10']);
    expect(donemEnflasyonu('2026-10-05', '2027-02-01')).toBeUndefined();
    expect(donemEnflasyonu('2026-03-01', '2026-03-25')).toBeUndefined();
    expect(donemEnflasyonu('2023-05-01', '2024-06-01')).toBeUndefined();
  });

  it('doğrulama: satış alıştan sonra olmalı, fiyat yönteminde fiyatlar zorunlu', () => {
    const base = { tur: 'indirimli', yontem: 'fiyat', tutar: 1000, alis: '2026-01-01' } as const;
    expect(fonGetirisiSchema.safeParse({ ...base, alisFiyat: 1, satisFiyat: 2, satis: '2026-01-01' }).success).toBe(false);
    expect(fonGetirisiSchema.safeParse({ ...base, satisFiyat: 2, satis: '2026-02-01' }).success).toBe(false);
    expect(fonGetirisiSchema.safeParse({ ...base, yontem: 'oran', satis: '2026-02-01' }).success).toBe(false);
  });

  it('TEFAS unvanından stopaj grubu', () => {
    expect(
      fonGrubu('İŞ PORTFÖY BIST TEKNOLOJİ AĞIRLIK SINIRLAMALI ENDEKSİ HİSSE SENEDİ (TL) FONU (HİSSE SENEDİ YOĞUN FON)'),
    ).toBe('hisse');
    expect(fonGrubu('TERA PORTFÖY PARA PİYASASI (TL) FONU')).toBe('indirimli');
    expect(fonGrubu('AK PORTFÖY ALTIN FONU')).toBe('indirimli');
    expect(fonGrubu('İSTANBUL PORTFÖY BİRİNCİ DEĞİŞKEN FON')).toBe('diger');
    expect(fonGrubu('AK PORTFÖY YENİ TEKNOLOJİLER YABANCI HİSSE SENEDİ FONU')).toBe('diger');
    expect(fonGrubu('X PORTFÖY KISA VADELİ SERBEST (DÖVİZ) FON')).toBe('diger');
    expect(fonGrubu('Y PORTFÖY HİSSE SENEDİ SERBEST FON (HİSSE SENEDİ YOĞUN FON)')).toBe('hisse');
    expect(fonGrubu('Z PORTFÖY GİRİŞİM SERMAYESİ YATIRIM FONU')).toBe('gsyfGyf');
  });

  it('tarihteki fiyat; hafta sonu → önceki iş günü, seri öncesi → yok', () => {
    const f: [string, number][] = [
      ['2026-11-06', 1.1],
      ['2026-11-09', 1.2],
      ['2026-11-10', 1.3],
    ];
    expect(fiyatBul(f, '2026-11-09')).toEqual({ tarih: '2026-11-09', fiyat: 1.2 });
    expect(fiyatBul(f, '2026-11-08')).toEqual({ tarih: '2026-11-06', fiyat: 1.1 });
    expect(fiyatBul(f, '2026-12-01')).toEqual({ tarih: '2026-11-10', fiyat: 1.3 });
    expect(fiyatBul(f, '2026-11-01')).toBeUndefined();
    // açıklanmamış gün 0 gelir → önceki fiyat
    expect(fiyatBul([...f, ['2026-11-11', 0]], '2026-11-11')).toEqual({ tarih: '2026-11-10', fiyat: 1.3 });
  });
});
