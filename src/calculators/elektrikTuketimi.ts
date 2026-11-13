import { z } from 'zod';
import { elektrikMesken, elektrikVergi, skttMeskenLimit, type ElektrikTarife } from '../config/enerji.ts';
import { periodAt, valueAt } from '../config/period.ts';
import { round2, zDate, zNumber } from './common.ts';

export interface Cihaz {
  label: string;
  /** Ortalama çekilen elektrik gücü, W */
  watt: number;
  /** Tipik günlük kullanım, saat */
  saat: number;
}

/**
 * Hazır cihaz değerleri — tipik/temsilî değerlerdir, resmi veri değildir; kullanıcı düzeltebilir.
 * Klima: soğutma kapasitesi (BTU/h × 0,293 W) / enerji verimlilik oranı ≈ 3,2 → çekilen elektrik gücü.
 * Buzdolabı: kompresör aç-kapa çalıştığı için 24 saatlik ortalama güç (≈ 300 kWh/yıl).
 */
export const CIHAZLAR = {
  klima9: { label: 'Klima 9.000 BTU', watt: 820, saat: 8 },
  klima12: { label: 'Klima 12.000 BTU', watt: 1100, saat: 8 },
  klima18: { label: 'Klima 18.000 BTU', watt: 1650, saat: 8 },
  klima24: { label: 'Klima 24.000 BTU', watt: 2200, saat: 8 },
  buzdolabi: { label: 'Buzdolabı (24 saat ortalaması)', watt: 35, saat: 24 },
  camasir: { label: 'Çamaşır makinesi (40 °C yıkama)', watt: 500, saat: 2 },
  bulasik: { label: 'Bulaşık makinesi (eko program)', watt: 450, saat: 2 },
  firin: { label: 'Elektrikli fırın', watt: 2000, saat: 1 },
  isitici: { label: 'Elektrikli ısıtıcı / radyatör', watt: 2000, saat: 5 },
  kettle: { label: 'Su ısıtıcı (kettle)', watt: 2000, saat: 0.25 },
  utu: { label: 'Ütü', watt: 2200, saat: 0.5 },
  sacKurutma: { label: 'Saç kurutma makinesi', watt: 2000, saat: 0.25 },
  tv: { label: 'Televizyon (LED, 55 inç)', watt: 100, saat: 5 },
  bilgisayar: { label: 'Masaüstü bilgisayar', watt: 200, saat: 6 },
  dizustu: { label: 'Dizüstü bilgisayar', watt: 60, saat: 6 },
  arac: { label: 'Elektrikli araç şarjı (7,4 kW ev şarjı)', watt: 7400, saat: 2 },
} as const satisfies Record<string, Cihaz>;
export type CihazKodu = keyof typeof CIHAZLAR;

/** Klimanın çekeceği yaklaşık elektrik gücü (W): BTU/h × 0,29307 / EER */
export const klimaWatt = (btu: number, eer = 3.2) => (btu * 0.29307) / eer;

export const elektrikTuketimiSchema = z
  .object({
    mod: z.enum(['cihaz', 'fatura']),
    /** Seçilen hazır cihaz (yalnız arayüz; değerleri güç ve süre alanlarına doldurur) */
    cihaz: z.string().optional(),
    guc: zNumber('Cihaz gücü', { min: 1, max: 50000 }).optional(),
    saat: zNumber('Günlük kullanım süresi', { max: 24 }).optional(),
    /** Cihazda kullanım günü; faturada fatura dönemi gün sayısı */
    gun: zNumber('Gün sayısı', { min: 1, max: 366, int: true }),
    /** Cihaz modunda 1 kWh'nin vergiler dahil fiyatı, TL */
    birimFiyat: zNumber('Birim fiyat', { min: 0.01, max: 1000 }).optional(),
    tarife: z.enum(['tek', 'uc']),
    /** Fatura modunda tarifenin seçileceği tarih (son okuma tarihi) */
    tarih: zDate('Fatura tarihi'),
    kwh: zNumber('Tüketim', { max: 100000 }).optional(),
    gunduz: zNumber('Gündüz tüketimi', { max: 100000 }).optional(),
    puant: zNumber('Puant tüketimi', { max: 100000 }).optional(),
    gece: zNumber('Gece tüketimi', { max: 100000 }).optional(),
  })
  .refine((v) => v.mod !== 'cihaz' || v.guc !== undefined, { message: 'Cihaz gücünü girin', path: ['guc'] })
  .refine((v) => v.mod !== 'cihaz' || v.saat !== undefined, { message: 'Günlük kullanım süresini girin', path: ['saat'] })
  .refine((v) => v.mod !== 'cihaz' || v.birimFiyat !== undefined, { message: 'Birim fiyatı girin', path: ['birimFiyat'] })
  .refine((v) => v.mod !== 'fatura' || v.tarife !== 'tek' || v.kwh !== undefined, {
    message: 'Aylık tüketimi girin',
    path: ['kwh'],
  })
  .refine((v) => v.mod !== 'fatura' || v.tarife !== 'uc' || v.gunduz !== undefined, {
    message: 'Gündüz tüketimini girin',
    path: ['gunduz'],
  })
  .refine((v) => v.mod !== 'fatura' || v.tarife !== 'uc' || v.puant !== undefined, {
    message: 'Puant tüketimini girin',
    path: ['puant'],
  })
  .refine((v) => v.mod !== 'fatura' || v.tarife !== 'uc' || v.gece !== undefined, {
    message: 'Gece tüketimini girin',
    path: ['gece'],
  });

export type ElektrikTuketimiInput = z.input<typeof elektrikTuketimiSchema>;
export type ElektrikTuketimiValues = z.output<typeof elektrikTuketimiSchema>;

/** Tek zamanlı mesken, 1 kWh'nin vergiler (tüketim vergisi + KDV) dahil fiyatı, TL — 4 haneye yuvarlı */
export function meskenBirimFiyat(tarih: string, kademe: 'dusuk' | 'yuksek' = 'dusuk'): number {
  const t = valueAt(elektrikMesken, tarih);
  const v = valueAt(elektrikVergi, tarih);
  const enerji = kademe === 'dusuk' ? t.tekDusuk : t.tekYuksek;
  return Math.round((((enerji * (1 + v.tuketimVergisi) + t.dagitim) * (1 + v.kdv)) / 100) * 1e4) / 1e4;
}

export interface CihazSonuc {
  kwhSaat: number;
  tlSaat: number;
  kwhGun: number;
  tlGun: number;
  kwh: number;
  tl: number;
}

/** kWh = W / 1000 × saat × gün; TL = kWh × birim fiyat */
export function cihazTuketimi(guc: number, saat: number, gun: number, birimFiyat: number): CihazSonuc {
  const kwhSaat = guc / 1000;
  const kwhGun = kwhSaat * saat;
  const kwh = kwhGun * gun;
  return {
    kwhSaat,
    tlSaat: round2(kwhSaat * birimFiyat),
    kwhGun,
    tlGun: round2(kwhGun * birimFiyat),
    kwh,
    tl: round2(kwh * birimFiyat),
  };
}

export interface FaturaSonuc {
  kwh: number;
  /** Tek zamanlı: düşük ve yüksek kademeden faturalanan kWh */
  dusukKwh: number;
  yuksekKwh: number;
  kademeLimit: number;
  enerji: number;
  dagitim: number;
  tuketimVergisi: number;
  araToplam: number;
  kdv: number;
  toplam: number;
  /** Vergiler dahil ortalama 1 kWh maliyeti, TL */
  ortalama: number;
  /** Bu tüketimin yıla yayılmış karşılığı, kWh */
  yillikTahmin: number;
  skttLimit: number;
  tarifeKaynak: string;
  tarifeBaslangic: string;
  oranlar: ElektrikTarife & { tuketimVergisi: number; kdv: number };
}

/**
 * Mesken AG fatura tahmini (EPDK tarife tablosu, `tarih`teki dönem):
 * enerji bedeli (tek zamanlıda günlük ort. 8 kWh × gün kadarı düşük, aşanı yüksek kademe; üç zamanlıda saat dilimine göre)
 * + dağıtım bedeli (tüm kWh) + tüketim vergisi (%5 × enerji bedeli) → ara toplam; KDV (%10) ara toplam üzerinden.
 * Her kalem faturadaki gibi kuruşa yuvarlanır.
 */
export function elektrikFaturasi(v: {
  tarife: 'tek' | 'uc';
  tarih: string;
  gun: number;
  kwh?: number;
  gunduz?: number;
  puant?: number;
  gece?: number;
}): FaturaSonuc {
  const p = periodAt(elektrikMesken, v.tarih);
  const t = p.value;
  const vergi = valueAt(elektrikVergi, v.tarih);
  const kademeLimit = t.kademeGunluk * v.gun;
  let kwh: number;
  let dusukKwh = 0;
  let yuksekKwh = 0;
  let enerjiKr: number;
  if (v.tarife === 'tek') {
    kwh = v.kwh!;
    dusukKwh = Math.min(kwh, kademeLimit);
    yuksekKwh = kwh - dusukKwh;
    enerjiKr = dusukKwh * t.tekDusuk + yuksekKwh * t.tekYuksek;
  } else {
    kwh = v.gunduz! + v.puant! + v.gece!;
    enerjiKr = v.gunduz! * t.gunduz + v.puant! * t.puant + v.gece! * t.gece;
  }
  const enerji = round2(enerjiKr / 100);
  const dagitim = round2((kwh * t.dagitim) / 100);
  const tuketimVergisi = round2(enerji * vergi.tuketimVergisi);
  const araToplam = round2(enerji + dagitim + tuketimVergisi);
  const kdv = round2(araToplam * vergi.kdv);
  const toplam = round2(araToplam + kdv);
  return {
    kwh,
    dusukKwh,
    yuksekKwh,
    kademeLimit,
    enerji,
    dagitim,
    tuketimVergisi,
    araToplam,
    kdv,
    toplam,
    ortalama: kwh > 0 ? toplam / kwh : 0,
    yillikTahmin: (kwh * 365) / v.gun,
    skttLimit: valueAt(skttMeskenLimit, v.tarih),
    tarifeKaynak: p.source,
    tarifeBaslangic: p.from,
    oranlar: { ...t, ...vergi },
  };
}
