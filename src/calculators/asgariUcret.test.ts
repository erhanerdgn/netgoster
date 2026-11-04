import { describe, expect, it } from 'vitest';
import { asgariUcretSchema, calculateAsgariUcret } from './asgariUcret.ts';

const run = (v: object) => calculateAsgariUcret(asgariUcretSchema.parse(v));

describe('asgari ücret', () => {
  it('Kasım 2026: brüt 33.030, net 28.075,50, vergi yok', () => {
    const r = run({ tarih: '2026-11-04' });
    expect(r.bordro.brut).toBe(33030);
    expect(r.bordro.sgkIsci).toBe(4624.2); // %14
    expect(r.bordro.issizlikIsci).toBe(330.3); // %1
    expect(r.bordro.gvHesaplanan).toBe(5615.1); // = istisna
    expect(r.bordro.gv).toBe(0);
    expect(r.bordro.dv).toBe(0);
    expect(r.bordro.net).toBe(28075.5);
  });

  it('işveren maliyeti: 33.030 + 7.184,03 + 660,60 = 40.874,63; destek 1.270 → 39.604,63', () => {
    const r = run({ tarih: '2026-03-10' });
    expect(r.bordro.maliyet).toBe(40874.63);
    expect(r.destek).toBe(1270);
    expect(r.destekliMaliyet).toBe(39604.63);
  });

  it('hazine indirimi: %2 → 660,60; imalat %5 → 1.651,50', () => {
    expect(run({ tarih: '2026-03-10', tesvik: 'genel' }).bordro.maliyet).toBe(40214.03);
    expect(run({ tarih: '2026-03-10', tesvik: 'imalat' }).bordro.maliyet).toBe(39223.13);
  });

  it('günlük / saatlik / yıllık: 1.101 brüt gün, 146,80 brüt saat, 935,85 net gün, 124,78 net saat', () => {
    const r = run({ tarih: '2026-07-01' });
    expect(r.brutGunluk).toBe(1101);
    expect(r.netGunluk).toBe(935.85); // 28.075,50 / 30
    expect(r.brutSaatlik).toBe(146.8); // 33.030 / 225
    expect(r.netSaatlik).toBe(124.78); // 28.075,50 / 225
    expect(r.yillikBrut).toBe(396360);
    expect(r.yillikNet).toBe(336906);
    expect(r.yillikMaliyet).toBe(490495.56); // 12 × 40.874,63
  });

  it('2025: brüt 26.005,50, net 22.104,67; parametrede 2025 desteği yok → 0', () => {
    const r = run({ tarih: '2025-06-15' });
    expect(r.bordro.net).toBe(22104.67);
    expect(r.destek).toBe(0);
  });
});
