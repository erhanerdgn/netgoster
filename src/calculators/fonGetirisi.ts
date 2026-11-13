import { z } from 'zod';
import { fonStopaj, type FonTuru } from '../config/parameters-2026.ts';
import { periodAt } from '../config/period.ts';
import { tufe } from '../config/tufe.ts';
import { addMonths, dayNumber, round2, zDate, zMoney, zNumber } from './common.ts';

export type { FonTuru };

export const FON_TURLERI = ['hisse', 'indirimli', 'diger', 'gsyfGyf'] as const satisfies readonly FonTuru[];

export const fonGetirisiSchema = z
  .object({
    /** TEFAS fon kodu (isteğe bağlı): seçilirse grup ve fiyatlar TEFAS'tan doldurulur */
    fon: z.string().max(5).optional(),
    tur: z.enum(FON_TURLERI),
    yontem: z.enum(['fiyat', 'oran']),
    tutar: zMoney('Yatırım tutarı', { min: 1 }),
    alisFiyat: zNumber('Alış fiyatı', { max: 1e7 }).optional(),
    satisFiyat: zNumber('Satış fiyatı', { max: 1e7 }).optional(),
    /** Yıllık getiri, yüzde (bileşik); "oran" yönteminde */
    oran: zNumber('Yıllık getiri', { min: -99, max: 1000 }).optional(),
    alis: zDate('Alış tarihi'),
    satis: zDate('Satış tarihi'),
  })
  .refine((v) => v.satis > v.alis, { message: 'Satış tarihi alış tarihinden sonra olmalı', path: ['satis'] })
  .refine((v) => v.yontem !== 'fiyat' || (v.alisFiyat ?? 0) > 0, { message: 'Alış fiyatı girin', path: ['alisFiyat'] })
  .refine((v) => v.yontem !== 'fiyat' || (v.satisFiyat ?? 0) > 0, { message: 'Satış fiyatı girin', path: ['satisFiyat'] })
  .refine((v) => v.yontem !== 'oran' || v.oran !== undefined, { message: 'Yıllık getiri girin', path: ['oran'] });

export type FonGetirisiInput = z.input<typeof fonGetirisiSchema>;
export type FonGetirisiValues = z.output<typeof fonGetirisiSchema>;

export interface FonGetirisiResult {
  gun: number;
  /** Fiyat yönteminde alınan pay adedi (kesirli) */
  adet?: number;
  satisTutari: number;
  brutKazanc: number;
  stopajOran: number;
  stopaj: number;
  netKazanc: number;
  netTutar: number;
  /** Dönemlik net getiri — ondalık */
  netDonemsel: number;
  /** Net getirinin yıllık bileşik karşılığı — ondalık */
  netYillik: number;
  /** Stopajı belirleyen kararın kaynağı */
  kaynak: string;
  /** Satış ayına kadar TÜFE verisi varsa dönem enflasyonu ve reel getiri */
  enflasyon?: number;
  reel?: number;
  enflasyonAylar?: [string, string];
}

/**
 * Stopaj oranı: fon payının ALIŞ tarihinde geçerli karar ve fon grubu. GSYF/GYF payları 2 yıldan fazla
 * elde tutulursa stopaj uygulanmaz (4454 s. CK, RG 04.09.2021).
 */
export function fonStopajOrani(tur: FonTuru, alis: string, satis: string): { oran: number; kaynak: string } {
  const p = periodAt(fonStopaj, alis);
  // "2 yıldan fazla": takvimle (artık yıl dahil) alıştan 24 ay sonrasından daha geç satış
  if (tur === 'gsyfGyf' && satis > addMonths(alis, 24))
    return { oran: 0, kaynak: '4454 s. CK (RG 04.09.2021/31588): 2 yıldan fazla elde tutulan GSYF/GYF payı' };
  return { oran: p.value[tur], kaynak: p.source };
}

const ayFarki = (a: string, b: string) => {
  const [ay, am] = a.split('-').map(Number);
  const [by, bm] = b.split('-').map(Number);
  return (by - ay) * 12 + (bm - am);
};

/**
 * Alış ayından sonraki aydan satış ayına kadar (dahil) aylık TÜFE değişimlerinin bileşimi.
 * Satış ayının verisi henüz yayımlanmadıysa son yayımlanan aya kadar hesaplanır (`aylar[1]` bunu gösterir).
 * Alıştan sonra hiç veri yoksa ya da serinin başında boşluk varsa undefined.
 */
export function donemEnflasyonu(alis: string, satis: string): { oran: number; aylar: [string, string] } | undefined {
  const bas = alis.slice(0, 7);
  const aylar = tufe.filter((t) => t.ay > bas && t.ay <= satis.slice(0, 7));
  if (!aylar.length) return undefined;
  const son = aylar[aylar.length - 1].ay;
  // Aradaki aylardan biri eksikse (veri boşluğu ya da seri başlangıcından önceki alış) hesaplama yapılmaz
  if (aylar.length !== ayFarki(bas, son)) return undefined;
  const oran = aylar.reduce((c, t) => c * (1 + t.aylik / 100), 1) - 1;
  return { oran, aylar: [aylar[0].ay, son] };
}

/**
 * Fiyat yöntemi: adet = tutar / alış fiyatı, satış tutarı = adet × satış fiyatı.
 * Oran yöntemi: satış tutarı = tutar × (1 + yıllık getiri)^(gün / 365) (fon fiyatı günlük bileşik büyür).
 * Stopaj yalnız pozitif kazanç üzerinden kesilir; zarar halinde stopaj yoktur.
 */
export function calculateFonGetirisi(v: FonGetirisiValues): FonGetirisiResult {
  const gun = dayNumber(v.satis) - dayNumber(v.alis);
  let adet: number | undefined;
  let satisTutari: number;
  if (v.yontem === 'fiyat') {
    adet = v.tutar / v.alisFiyat!;
    satisTutari = round2(adet * v.satisFiyat!);
  } else {
    satisTutari = round2(v.tutar * (1 + v.oran! / 100) ** (gun / 365));
  }
  const brutKazanc = round2(satisTutari - v.tutar);
  const { oran: stopajOran, kaynak } = fonStopajOrani(v.tur, v.alis, v.satis);
  const stopaj = brutKazanc > 0 ? round2(brutKazanc * stopajOran) : 0;
  const netKazanc = round2(brutKazanc - stopaj);
  const netTutar = round2(v.tutar + netKazanc);
  const netDonemsel = netKazanc / v.tutar;
  const result: FonGetirisiResult = {
    gun,
    adet,
    satisTutari,
    brutKazanc,
    stopajOran,
    stopaj,
    netKazanc,
    netTutar,
    netDonemsel,
    netYillik: (1 + netDonemsel) ** (365 / gun) - 1,
    kaynak,
  };
  const enf = donemEnflasyonu(v.alis, v.satis);
  if (enf) {
    result.enflasyon = enf.oran;
    result.reel = (1 + netDonemsel) / (1 + enf.oran) - 1;
    result.enflasyonAylar = enf.aylar;
  }
  return result;
}

/**
 * TEFAS unvanından stopaj grubu (GİB rehberi §20: gruplar unvana göre ayrılır).
 * Sıra önemli: hisse senedi yoğun ifadesi her şeyden önce gelir.
 */
export function fonGrubu(unvan: string): FonTuru {
  const u = unvan.toLocaleUpperCase('tr');
  if (u.includes('HİSSE SENEDİ YOĞUN')) return 'hisse';
  if (u.includes('GİRİŞİM SERMAYESİ') || u.includes('GAYRİMENKUL YATIRIM FONU')) return 'gsyfGyf';
  if (/DEĞİŞKEN|KARMA|EUROBOND|DIŞ BORÇLANMA|YABANCI|SERBEST|DÖVİZ/.test(u)) return 'diger';
  return 'indirimli';
}

/** Verilen tarihteki (yoksa önceki son iş günündeki, sıfır olmayan) birim pay fiyatı; seri tarihe göre artan sıralı olmalı. */
export function fiyatBul(fiyatlar: [string, number][], tarih: string): { tarih: string; fiyat: number } | undefined {
  let hit: [string, number] | undefined;
  for (const f of fiyatlar) {
    if (f[0] > tarih) break;
    if (f[1] > 0) hit = f; // TEFAS açıklanmamış günün fiyatını 0 yazar
  }
  return hit && { tarih: hit[0], fiyat: hit[1] };
}

/** Seçilen fon için stopaj grubunun kesin olmadığı durumların uyarısı */
export function fonUyarisi(unvan: string): string | undefined {
  const u = unvan.toLocaleUpperCase('tr');
  if (u.includes('HİSSE SENEDİ YOĞUN') && /SERBEST|ÖZEL FON/.test(u))
    return 'Hisse yoğun serbest/özel fon: TEFAS dışında işlem görüyorsa 27.03.2026 sonrası alışlarda %0 yerine %17,5 stopaj uygulanır (11107 s. CK).';
  return undefined;
}
