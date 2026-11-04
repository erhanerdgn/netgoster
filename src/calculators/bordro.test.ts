import { describe, expect, it } from 'vitest';
import { asgariIstisna, ayBordrosu, gelirVergisiFarki, vergiTarife, yillikBordro } from './bordro.ts';

describe('bordro motoru', () => {
  it('2026 asgari ücret GV istisnası: kümülatif matrah 28.075,50 × ay tarifeye uygulanır', () => {
    // Oca–Haz: 28.075,50 × %15 = 4.211,33 (kümülatif 168.453 < 190.000)
    for (let ay = 1; ay <= 6; ay++) expect(asgariIstisna(2026, ay).gv).toBe(4211.33);
    // Tem: kümülatif 196.528,50 → 28.500 + 6.528,50 × %20 = 29.805,70; önceki 25.267,95 → 4.537,75
    expect(asgariIstisna(2026, 7).gv).toBe(4537.75);
    // Ağu–Ara: tamamı %20 diliminde (kümülatif 336.906 < 400.000) → 28.075,50 × %20 = 5.615,10
    for (let ay = 8; ay <= 12; ay++) expect(asgariIstisna(2026, ay).gv).toBe(5615.1);
    // DV istisnası: 33.030 × binde 7,59 = 250,70
    expect(asgariIstisna(2026, 3).dv).toBe(250.7);
  });

  it('tarife: 500.000 matrah → 28.500 + 42.000 + 100.000 × %27 = 97.500', () => {
    const t = [
      { upTo: 190000, rate: 0.15 },
      { upTo: 400000, rate: 0.2 },
      { upTo: 1500000, rate: 0.27 },
      { upTo: Infinity, rate: 0.35 },
    ];
    expect(vergiTarife(500000, t)).toBeCloseTo(97500, 6);
    // dilim geçişi: 180.000 → 200.000: 10.000 × %15 + 10.000 × %20 = 3.500
    expect(gelirVergisiFarki(180000, 20000, '2026-05-01')).toBe(3500);
  });

  it('Ocak 2026, brüt 50.000: net 40.207,53', () => {
    // SGK 7.000, işsizlik 500, matrah 42.500, GV 6.375 − 4.211,33 = 2.163,67, DV 379,50 − 250,70 = 128,80
    const b = ayBordrosu({ yil: 2026, ay: 1, brut: 50000 });
    expect(b.sgkIsci).toBe(7000);
    expect(b.issizlikIsci).toBe(500);
    expect(b.gvMatrah).toBe(42500);
    expect(b.gv).toBe(2163.67);
    expect(b.dv).toBe(128.8);
    expect(b.net).toBe(40207.53);
    // işveren: 50.000 × %21,75 = 10.875 + %2 = 1.000 → 61.875
    expect(b.maliyet).toBe(61875);
    expect(ayBordrosu({ yil: 2026, ay: 1, brut: 50000, tesvik: 'genel' }).maliyet).toBe(60875); // −%2
    expect(ayBordrosu({ yil: 2026, ay: 1, brut: 50000, tesvik: 'imalat' }).maliyet).toBe(59375); // −%5
  });

  it('asgari ücret: net 28.075,50, GV ve DV sıfır', () => {
    const b = ayBordrosu({ yil: 2026, ay: 9, brut: 33030, kumOnceki: 8 * 28075.5 });
    expect(b.gv).toBe(0);
    expect(b.dv).toBe(0);
    expect(b.net).toBe(28075.5);
    // işveren: 33.030 × %23,75 = 7.844,63 (7.184,03 + 660,60)
    expect(b.sgkIsveren).toBe(7184.03); // 7.184,025 yukarı
    expect(b.maliyet).toBe(40874.63);
  });

  it('yarı zamanlı 20.000 brüt: istisna hesaplanan vergiyle sınırlı → net 17.000', () => {
    const b = ayBordrosu({ yil: 2026, ay: 1, brut: 20000 });
    expect(b.gvHesaplanan).toBe(2550);
    expect(b.gvIstisna).toBe(2550);
    expect(b.dvIstisna).toBe(151.8);
    expect(b.net).toBe(17000);
  });

  it('PEK tavanı: brüt 400.000 → SGK 297.270 üzerinden, net 295.253,63', () => {
    // SGK 41.617,80, işsizlik 2.972,70, matrah 355.409,50 → GV 28.500 + 165.409,50×%20 = 61.581,90 − 4.211,33
    const b = ayBordrosu({ yil: 2026, ay: 1, brut: 400000 });
    expect(b.sgkMatrah).toBe(297270);
    expect(b.gv).toBe(57370.57);
    expect(b.dv).toBe(2785.3);
    expect(b.net).toBe(295253.63);
  });

  it('12 ay 50.000: dilim geçişleri (Mayıs %20, Ekim %27)', () => {
    const { aylar, toplam } = yillikBordro(2026, 50000);
    expect(aylar[3].gv).toBe(2163.67); // Nisan hâlâ %15
    expect(aylar[4].gv).toBe(3288.67); // Mayıs: 170.000→212.500: 3.000 + 4.500 = 7.500 − 4.211,33
    expect(aylar[5].gv).toBe(4288.67); // Haziran: 8.500 − 4.211,33
    expect(aylar[6].gv).toBe(3962.25); // Temmuz: 8.500 − 4.537,75
    expect(aylar[7].gv).toBe(2884.9); // Ağustos: 8.500 − 5.615,10
    expect(aylar[9].gv).toBe(4634.9); // Ekim: 17.500×%20 + 25.000×%27 = 10.250 − 5.615,10
    expect(aylar[10].gv).toBe(5859.9); // Kasım: 42.500 × %27 = 11.475 − 5.615,10
    expect(aylar[11].kumMatrah).toBe(510000);
    expect(toplam.brut).toBe(600000);
  });
});
