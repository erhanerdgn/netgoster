import { describe, expect, it } from 'vitest';
import {
  calculateSaat,
  gunMetni,
  saatSchema,
  sureMetin,
  sureSSDD,
  type AraResult,
  type EkleResult,
  type ToplaResult,
} from './saatHesaplama.ts';

const ara = (v: object) => calculateSaat(saatSchema.parse({ mod: 'ara', ...v })) as AraResult;
const ekle = (v: object) => calculateSaat(saatSchema.parse({ mod: 'ekle', ...v })) as EkleResult;
const topla = (sureler: object[]) => calculateSaat(saatSchema.parse({ mod: 'topla', sureler })) as ToplaResult;

describe('iki saat arası', () => {
  it('gece vardiyası 22:30 → 06:15 = 7 saat 45 dakika; 30 dk mola ile 7,25 saat', () => {
    // (06:15 = 375) − (22:30 = 1350) + 1440 = 465 dk
    const r = ara({ baslangic: '22:30', bitis: '06:15' });
    expect(r.brut).toBe(465);
    expect(r.geceYarisi).toBe(true);
    expect(sureMetin(r.net)).toBe('7 saat 45 dakika');
    const m = ara({ baslangic: '22:30', bitis: '06:15', mola: 30 });
    expect(m.net).toBe(435);
    expect(m.net / 60).toBe(7.25);
  });

  it('gündüz 08:00 → 17:30, 60 dk mola = 8,5 saat', () => {
    const r = ara({ baslangic: '08:00', bitis: '17:30', mola: 60 });
    expect(r.brut).toBe(570); // 1050 − 480
    expect(r.net).toBe(510);
    expect(r.geceYarisi).toBe(false);
  });

  it('aynı saat 24 saat kabul edilir; 7:05 biçimi de geçerli', () => {
    const r = ara({ baslangic: '09:00', bitis: '9:00' });
    expect(r.brut).toBe(1440);
    expect(r.tamGun).toBe(true);
    expect(sureMetin(r.brut)).toBe('24 saat');
    expect(ara({ baslangic: '7:05', bitis: '07:50' }).net).toBe(45);
  });

  it('doğrulama: 24:00, 7:5, boş saat ve süreyi aşan mola reddedilir', () => {
    const bad = (v: object) => saatSchema.safeParse({ mod: 'ara', baslangic: '08:00', bitis: '09:00', ...v }).success;
    expect(bad({ baslangic: '24:00' })).toBe(false);
    expect(bad({ bitis: '7:5' })).toBe(false);
    expect(bad({ bitis: '' })).toBe(false);
    expect(bad({ mola: 60 })).toBe(false); // mola = süre
    expect(bad({ mola: 59 })).toBe(true);
  });
});

describe('saate süre ekle / çıkar', () => {
  it('23:30 + 2 sa 15 dk = 01:45 ertesi gün', () => {
    const r = ekle({ saat: '23:30', islem: 'ekle', sureSaat: 2, sureDakika: 15 });
    expect(r.sonuc).toBe('01:45'); // 1410 + 135 = 1545 → 1545 − 1440 = 105
    expect(gunMetni(r.gunFarki)).toBe('ertesi gün');
  });

  it('01:00 − 3 saat = 22:00 önceki gün; 10:00 + 50 saat = 12:00, 2 gün sonra', () => {
    const a = ekle({ saat: '01:00', islem: 'cikar', sureSaat: 3 });
    expect(a.sonuc).toBe('22:00'); // 60 − 180 = −120 → 1320
    expect(gunMetni(a.gunFarki)).toBe('önceki gün');
    const b = ekle({ saat: '10:00', islem: 'ekle', sureSaat: 50, sureDakika: 0 });
    expect(b.sonuc).toBe('12:00'); // 600 + 3000 = 3600 = 2 × 1440 + 720
    expect(gunMetni(b.gunFarki)).toBe('2 gün sonra');
  });
});

describe('süre toplama', () => {
  it('haftalık 50 saat → 5 saat fazla çalışma', () => {
    // 510 + 555 + 540 + 585 + 480 + 330 = 3000 dk = 50 saat
    const r = topla([
      { saat: 8, dakika: 30 },
      { saat: 9, dakika: 15 },
      { saat: 9 },
      { saat: 9, dakika: 45 },
      { saat: 8 },
      { saat: 5, dakika: 30 },
      {},
    ]);
    expect(r.toplam).toBe(3000);
    expect(r.satir).toBe(6);
    expect(r.fazla).toBe(300);
    expect(sureSSDD(r.toplam)).toBe('50:00');
  });

  it('ondalık saat ve taşan dakika: 7,5 sa + 90 dk = 9 saat; 45 saatte fazla mesai yok', () => {
    expect(topla([{ saat: 7.5 }, { dakika: 90 }]).toplam).toBe(540);
    expect(topla([{ saat: 45 }]).fazla).toBe(0);
  });

  it('boş liste reddedilir', () => {
    expect(saatSchema.safeParse({ mod: 'topla', sureler: [{}, {}] }).success).toBe(false);
  });
});
