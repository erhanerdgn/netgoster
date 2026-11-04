import { describe, expect, it } from 'vitest';
import { calculateMtv, mtvSchema } from './mtv.ts';

const run = (v: object) => calculateMtv(mtvSchema.parse(v), '2026-11-04');

describe('MTV', () => {
  it('2018+ otomobil 1.598 cm³, 2022 model, değer 450.000 → 2. dilim, 5 yaş (4–6): 8.264', () => {
    // yaş = 2026 − 2022 + 1 = 5; 1301–1600 grubunda 309.100 < 450.000 ≤ 541.500 → [11023, 8264, …]
    const r = run({ tip: 'oto', cc: 1598, deger: 450000, modelYili: 2022 });
    expect(r.yas).toBe(5);
    expect(r.yasGrubu).toBe(1);
    expect(r.yillik).toBe(8264);
    expect(r.taksit1).toBe(4132);
    expect(r.taksit2).toBe(4132);
    expect(r.tablo.secili).toBe(4);
  });

  it('yaş sınırları: 2024 model 3 yaş (1–3), 2023 model 4 yaş (4–6); gelecek model yılı 1 yaş', () => {
    const v = { tip: 'oto', cc: 1300, deger: 300000 };
    expect(run({ ...v, modelYili: 2024 }).yillik).toBe(5750);
    expect(run({ ...v, modelYili: 2023 }).yillik).toBe(4010);
    const y = run({ ...v, modelYili: 2027 });
    expect(y.yas).toBe(1);
    expect(y.yillik).toBe(5750);
  });

  it('elektrikli 160 kW → 3.000 cm³ eşdeğer, değer 2.000.000 (> 1.937.500), 1 yaş: 70.018 × %25 = 17.504,50', () => {
    const r = run({ tip: 'elektrik', kw: 160, deger: 2000000, modelYili: 2026 });
    expect(r.esdegerCc).toBe(3000);
    expect(r.tarifeTutari).toBe(70018);
    expect(r.yillik).toBe(17504.5);
    expect(r.taksit1).toBe(8752.25);
    expect(r.tablo.satirlar[13].tutar[0]).toBe(17504.5);
    expect(r.tablo.satirlar[13].etiket).toBe('151–180 kW · 1.937.500 TL üzeri');
  });

  it('2017 ve öncesi tescilli 1.6, 2010 model (17 yaş → 16+): 1.181', () => {
    const r = run({ tip: 'otoEski', cc: 1600, modelYili: 2010 });
    expect(r.yas).toBe(17);
    expect(r.yillik).toBe(1181);
  });

  it('motosiklet: 90 cm³ muaf; 650 cm³ 2020 model (7 yaş): 1.069', () => {
    const m = run({ tip: 'motosiklet', cc: 90, modelYili: 2025 });
    expect(m.muaf).toBe(true);
    expect(m.yillik).toBe(0);
    expect(run({ tip: 'motosiklet', cc: 650, modelYili: 2020 }).yillik).toBe(1069);
    expect(run({ tip: 'motosiklet', cc: 100, modelYili: 2026 }).yillik).toBe(1069);
  });

  it('(II) tarife minibüs, 2015 model (12 yaş → 7–15): 4.540', () => {
    const r = run({ tip: 'tarifeII', sinif: 'minibus', modelYili: 2015 });
    expect(r.yasGrubu).toBe(1);
    expect(r.yillik).toBe(4540);
  });

  it('elle dilim seçimi: 1.8 grubunda 2 dilim var, "3" son dilime iner → 21.251', () => {
    const r = run({ tip: 'oto', cc: 1800, dilim: '3', modelYili: 2026 });
    expect(r.yillik).toBe(21251);
    expect(run({ tip: 'oto', cc: 1800, dilim: '1', modelYili: 2026 }).yillik).toBe(19472);
  });

  it('eksik alanlar şemada hata verir', () => {
    expect(mtvSchema.safeParse({ tip: 'oto', cc: 1600, modelYili: 2020 }).success).toBe(false);
    expect(mtvSchema.safeParse({ tip: 'elektrik', deger: 1e6, modelYili: 2020 }).success).toBe(false);
    expect(mtvSchema.safeParse({ tip: 'tarifeII', modelYili: 2020 }).success).toBe(false);
  });
});
