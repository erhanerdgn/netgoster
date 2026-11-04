import { describe, expect, it } from 'vitest';
import { calculateEmeklilik, emeklilikSchema, eytSskGun, yeniSistemYas } from './emeklilik.ts';

const T = '2026-11-04';
const run = (v: object) => calculateEmeklilik(emeklilikSchema.parse(v), T);

describe('emeklilik', () => {
  it('EYT 4/a kadın, tüm şartlar tamam: 1995-03-01 giriş → 5750 gün kademesi, 20 yıl 2015-03-01’de doldu', () => {
    const r = run({ tur: '4a', cinsiyet: 'kadin', dogum: '1975-01-01', giris: '1995-03-01', primGun: 6000 });
    expect(r.eyt).toBe(true);
    expect(r.secilen.sartlar.find((s) => s.tip === 'gun')!.gerekli).toBe(5750);
    expect(r.secilen.sartlar.some((s) => s.tip === 'yas')).toBe(false); // EYT: yaş yok
    expect(r.emekliOlabilir).toBe(true);
    expect(r.emeklilikTarihi).toBe(T);
    expect(r.eksikGun).toBe(0);
  });

  it('EYT 4/a erkek: 1998-01-15 giriş → 5900 gün; eksik 900 gün → ceil(900/360×365)=913 gün → 2029-05-05', () => {
    const r = run({ tur: '4a', cinsiyet: 'erkek', dogum: '1979-05-10', giris: '1998-01-15', primGun: 5000 });
    expect(r.eksikGun).toBe(900);
    expect(r.emeklilikTarihi).toBe('2029-05-05'); // 25 yıl 2023-01-15’te zaten doldu
    expect(r.eksikYas).toBeNull();
    expect(r.emeklilikYasi).toBe(49);
  });

  it('EYT 4/b kadın: 7200 gün, eksik 200 → 203 takvim günü → 2027-05-26', () => {
    const r = run({ tur: '4b', cinsiyet: 'kadin', dogum: '1976-02-02', giris: '1997-06-01', primGun: 7000 });
    expect(r.secilen.sartlar).toHaveLength(1);
    expect(r.eksikGun).toBe(200);
    expect(r.emeklilikTarihi).toBe('2027-05-26');
  });

  it('geçiş 4/a erkek: 25 yıl + 4500 gün yolu (60 yaş: 2028-03-20) 7000 gün yolundan (2032-05-24) erken', () => {
    const r = run({ tur: '4a', cinsiyet: 'erkek', dogum: '1968-03-20', giris: '2000-01-10', primGun: 5000 });
    expect(r.donem).toBe('gecis');
    expect(r.yollar).toHaveLength(2);
    expect(r.yollar[0].tarih).toBe('2032-05-24'); // 2000 eksik gün → ceil(2027,78)=2028 gün
    expect(r.emeklilikTarihi).toBe('2028-03-20');
    expect(r.eksikGun).toBe(0); // seçilen yolda 4500 gün tamam
    expect(r.eksikYas).toEqual({ years: 1, months: 4, days: 16 });
  });

  it('ay sonu: bugün 31.01.2026, 60 yaş 01.03.2028 → eksik yaş 2 yıl 1 ay 0 gün (31.01 + 25 ay = 01.03.2028)', () => {
    const v = emeklilikSchema.parse({ tur: '4a', cinsiyet: 'erkek', dogum: '1968-03-01', giris: '2000-01-10', primGun: 5000 });
    const r = calculateEmeklilik(v, '2026-01-31');
    expect(r.emeklilikTarihi).toBe('2028-03-01');
    expect(r.eksikYas).toEqual({ years: 2, months: 1, days: 0 });
    expect(r.mevcutYas).toBe(57);
    expect(r.emeklilikYasi).toBe(60);
  });

  it('yeni sistem 4/a erkek: 2200 eksik gün → 2032’de tamam (≤2035 → 60 yaş) → 2050-04-10', () => {
    const r = run({ tur: '4a', cinsiyet: 'erkek', dogum: '1990-04-10', giris: '2010-06-01', primGun: 5000 });
    expect(r.tamamlanmaYili).toBe(2032);
    expect(r.emeklilikTarihi).toBe('2050-04-10');
    expect(r.emeklilikYasi).toBe(60);
  });

  it('yeni sistem 4/b kadın: kademeli yaş — 360 gün/yıl → 2046 (64 yaş), 300 gün/yıl → 2050 (65 yaş)', () => {
    const base = { tur: '4b', cinsiyet: 'kadin', dogum: '1995-07-07', giris: '2020-01-01', primGun: 1800 };
    const a = run(base); // 7200 eksik → 7300 gün → 2046-10-30
    expect(a.secilen.sartlar.find((s) => s.tip === 'gun')!.tarih).toBe('2046-10-30');
    expect(a.emeklilikTarihi).toBe('2059-07-07');
    const b = run({ ...base, yillikGun: 300 }); // 7200/300×365 = 8760 gün → 2050-10-29
    expect(b.tamamlanmaYili).toBe(2050);
    expect(b.emeklilikTarihi).toBe('2060-07-07');
  });

  it('dönem sınırları: 07.09.1999 EYT, 08.09.1999 geçiş, 30.04.2008 geçiş, 01.05.2008 yeni', () => {
    const v = { tur: '4a', cinsiyet: 'kadin', dogum: '1980-01-01', primGun: 3000 };
    expect(run({ ...v, giris: '1999-09-07' }).donem).toBe('eyt');
    expect(run({ ...v, giris: '1999-09-08' }).donem).toBe('gecis');
    expect(run({ ...v, giris: '2008-04-30' }).donem).toBe('gecis');
    expect(run({ ...v, giris: '2008-05-01' }).donem).toBe('yeni');
  });

  it('yardımcılar: kademe ve yaş tablosu', () => {
    expect(eytSskGun('kadin', '1980-01-01')).toBe(5000);
    expect(eytSskGun('erkek', '1999-09-07')).toBe(5975);
    expect(yeniSistemYas('erkek', 2036)).toBe(61);
    expect(yeniSistemYas('kadin', 2048)).toBe(65);
  });

  it('yıllık prim günü 0 ve eksik gün varsa tarih tahmin edilemez', () => {
    const r = run({ tur: '4c', cinsiyet: 'erkek', dogum: '1985-01-01', giris: '2009-01-01', primGun: 4000, yillikGun: 0 });
    expect(r.emeklilikTarihi).toBeNull();
    expect(r.eksikGun).toBe(5000);
  });

  it('şema: giriş doğumdan önce veya prim günü geçen süreden fazlaysa hata', () => {
    const base = { tur: '4a', cinsiyet: 'kadin', dogum: '1990-01-01', giris: '2015-01-01', primGun: 100 };
    expect(emeklilikSchema.safeParse(base).success).toBe(true);
    expect(emeklilikSchema.safeParse({ ...base, giris: '1989-01-01' }).success).toBe(false);
    expect(emeklilikSchema.safeParse({ ...base, giris: '2025-01-01', primGun: 9000 }).success).toBe(false);
  });
});
