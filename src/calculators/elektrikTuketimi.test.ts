import { describe, expect, it } from 'vitest';
import { cihazTuketimi, elektrikFaturasi, elektrikTuketimiSchema, klimaWatt, meskenBirimFiyat } from './elektrikTuketimi.ts';

const fatura = (kwh: number, tarih = '2026-11-13', gun = 30) => elektrikFaturasi({ tarife: 'tek', tarih, gun, kwh });

describe('elektrik faturası (EPDK 04.04.2026 tarifesi)', () => {
  it('100 kWh: EPDK duyurusundaki 323,8 TL ile tutarlı', () => {
    // enerji 100 × 49,4065 kr = 49,41; dağıtım 100 × 242,49 kr = 242,49; tüketim vergisi 49,41 × %5 = 2,47
    // ara 294,37; KDV %10 = 29,44; toplam 323,81 (kalem yuvarlamasız 323,80)
    const r = fatura(100);
    expect(r.enerji).toBe(49.41);
    expect(r.dagitim).toBe(242.49);
    expect(r.tuketimVergisi).toBe(2.47);
    expect(r.araToplam).toBe(294.37);
    expect(r.kdv).toBe(29.44);
    expect(r.toplam).toBe(323.81);
  });

  it('300 kWh / 30 gün: 240 kWh düşük, 60 kWh yüksek kademe', () => {
    // enerji 240 × 49,4065 + 60 × 189,5808 = 11857,56 + 11374,848 = 23232,408 kr → 232,32
    // dağıtım 300 × 242,49 = 727,47; vergi 11,62; ara 971,41; KDV 97,14; toplam 1068,55
    const r = fatura(300);
    expect(r.kademeLimit).toBe(240);
    expect(r.dusukKwh).toBe(240);
    expect(r.yuksekKwh).toBe(60);
    expect(r.enerji).toBe(232.32);
    expect(r.dagitim).toBe(727.47);
    expect(r.tuketimVergisi).toBe(11.62);
    expect(r.araToplam).toBe(971.41);
    expect(r.kdv).toBe(97.14);
    expect(r.toplam).toBe(1068.55);
  });

  it('sınır: tam 240 kWh tamamı düşük kademe; 31 günlük dönemde sınır 248 kWh', () => {
    // 240 × 49,4065 = 118,58; 240 × 242,49 = 581,98; vergi 5,93; ara 706,49; KDV 70,65 → 777,14
    const r = fatura(240);
    expect(r.yuksekKwh).toBe(0);
    expect(r.toplam).toBe(777.14);
    const r31 = fatura(248, '2026-11-13', 31);
    expect(r31.kademeLimit).toBe(248);
    expect(r31.yuksekKwh).toBe(0);
  });

  it('üç zamanlı: gündüz 100, puant 50, gece 50 kWh', () => {
    // enerji (19506,4 + 18737,755 + 2568,28) kr = 408,12; dağıtım 200 × 242,49 = 484,98; vergi 20,41
    // ara 913,51; KDV 91,35; toplam 1004,86 — kademe yok
    const r = elektrikFaturasi({ tarife: 'uc', tarih: '2026-11-13', gun: 30, gunduz: 100, puant: 50, gece: 50 });
    expect(r.kwh).toBe(200);
    expect(r.yuksekKwh).toBe(0);
    expect(r.enerji).toBe(408.12);
    expect(r.dagitim).toBe(484.98);
    expect(r.tuketimVergisi).toBe(20.41);
    expect(r.toplam).toBe(1004.86);
  });

  it('tarihe göre dönem: 2025-06 (13426 s. karar) ve 2025-03 (12719 s. karar)', () => {
    // 2025-06: 49,41 + 183,62 + 2,47 = 235,50; KDV 23,55 → 259,05
    expect(fatura(100, '2025-06-01').toplam).toBe(259.05);
    // 2025-03: 49,41 + 136,52 + 2,47 = 188,40; KDV 18,84 → 207,24
    expect(fatura(100, '2025-03-01').toplam).toBe(207.24);
  });

  it('son kaynak limiti tarihe göre: 2026 → 4.000, 2027 → 3.000 kWh; yıllık tahmin', () => {
    const r = fatura(400);
    expect(r.skttLimit).toBe(4000);
    expect(r.yillikTahmin).toBeCloseTo((400 * 365) / 30, 10); // 4866,67
    expect(fatura(100, '2027-02-01').skttLimit).toBe(3000);
  });
});

describe('cihaz tüketimi', () => {
  it('12.000 BTU klima, 1100 W × 8 saat × 30 gün, 3,238 TL/kWh', () => {
    // saatlik 1,1 kWh → 3,56 TL; günlük 8,8 kWh → 28,49 TL; aylık 264 kWh → 854,83 TL
    const r = cihazTuketimi(1100, 8, 30, 3.238);
    expect(r.kwhSaat).toBe(1.1);
    expect(r.tlSaat).toBe(3.56);
    expect(r.kwhGun).toBeCloseTo(8.8, 10);
    expect(r.tlGun).toBe(28.49);
    expect(r.kwh).toBeCloseTo(264, 10);
    expect(r.tl).toBe(854.83);
  });

  it('vergiler dahil birim fiyat ve klima gücü', () => {
    // (49,4065 × 1,05 + 242,49) × 1,10 / 100 = 3,238035 → 3,238; yüksek: (189,5808 × 1,05 + 242,49) × 1,1 / 100 = 4,857
    expect(meskenBirimFiyat('2026-11-13')).toBe(3.238);
    expect(meskenBirimFiyat('2026-11-13', 'yuksek')).toBe(4.857);
    // 12.000 × 0,29307 / 3,2 = 1099,01 W
    expect(klimaWatt(12000)).toBeCloseTo(1099.0125, 4);
  });

  it('şema: faturada tüketim, cihazda güç zorunlu', () => {
    const base = { gun: 30, tarife: 'tek', tarih: '2026-11-13', birimFiyat: 3.238 };
    expect(elektrikTuketimiSchema.safeParse({ ...base, mod: 'fatura' }).success).toBe(false);
    expect(elektrikTuketimiSchema.safeParse({ ...base, mod: 'cihaz', saat: 2 }).success).toBe(false);
    expect(elektrikTuketimiSchema.safeParse({ ...base, mod: 'cihaz', guc: 2000, saat: 2 }).success).toBe(true);
    expect(elektrikTuketimiSchema.safeParse({ ...base, mod: 'cihaz', guc: 2000, saat: 25 }).success).toBe(false);
  });
});
