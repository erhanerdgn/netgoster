import { z } from 'zod';
import { addDays, addMonths, dayNumber, ymdDiff, zDate, zNumber } from './common.ts';

export const BIRIMLER = ['saniye', 'dakika', 'saat', 'gun', 'hafta', 'ay', 'yil'] as const;
export type Birim = (typeof BIRIMLER)[number];

export const BIRIM_AD: Record<Birim, string> = {
  saniye: 'saniye',
  dakika: 'dakika',
  saat: 'saat',
  gun: 'gün',
  hafta: 'hafta',
  ay: 'ay',
  yil: 'yıl',
};

/** Gregoryen takvimde 400 yılda 97 artık yıl: ortalama yıl 365,2425 gün, ortalama ay bunun 1/12'si (30,436875 gün). */
export const ORT_YIL_GUN = 365.2425;
export const ORT_AY_GUN = ORT_YIL_GUN / 12;

/** Birimlerin saniye karşılığı (hepsi tam sayı: ay = 2.629.746 sn, yıl = 31.556.952 sn) */
export const SANIYE: Record<Birim, number> = {
  saniye: 1,
  dakika: 60,
  saat: 3600,
  gun: 86400,
  hafta: 604800,
  ay: ORT_AY_GUN * 86400,
  yil: ORT_YIL_GUN * 86400,
};

/** Takvim hesabının üst sınırı: 200 yıl */
const TAKVIM_MAX_GUN = 73000;

export const zamanCeviriciSchema = z.object({
  deger: zNumber('Değer', { max: 1e9 }),
  birim: z.enum(BIRIMLER),
  /** İsteğe bağlı: verilirse takvime göre kesin sonuç da hesaplanır */
  baslangic: z.union([zDate('Başlangıç tarihi'), z.literal('')]).optional(),
});

export type ZamanCeviriciInput = z.input<typeof zamanCeviriciSchema>;
export type ZamanCeviriciValues = z.output<typeof zamanCeviriciSchema>;

const nf = (max: number) => new Intl.NumberFormat('tr-TR', { maximumFractionDigits: max });

/** Okunur sayı: 1'den büyükse en fazla 2 ondalık, küçükse 3 anlamlı basamak (0,000317 gibi) */
export function sayi(v: number): string {
  if (v === 0 || Math.abs(v) >= 1) return nf(2).format(v);
  return new Intl.NumberFormat('tr-TR', { maximumSignificantDigits: 3 }).format(v);
}

/**
 * Süreyi verilen birimlere böler: bilesik(249 gün, ['ay','gun'], true) → "8 ay 6 gün".
 * Son birim dışındakiler tam sayıdır; son birim `tamSon` ise tam sayıya, değilse 2 ondalığa yuvarlanır.
 */
export function bilesik(sn: number, birimler: Birim[], tamSon = false): string {
  const n: number[] = [];
  let kalan = sn;
  birimler.forEach((b, i) => {
    const oran = kalan / SANIYE[b];
    if (i < birimler.length - 1) {
      n.push(Math.floor(oran + 1e-9)); // 12 ay = 1 yıl gibi tam bölünmelerde kayan nokta payı
      kalan = Math.max(0, kalan - n[i] * SANIYE[b]);
    } else n.push(tamSon ? Math.round(oran) : Math.round(oran * 100) / 100);
  });
  // Yuvarlanan kalan bir üst birime ulaştıysa aktar: 60 gün "1 ay 30 gün" değil "2 ay", 365 gün "1 yıl"
  for (let i = n.length - 1; i > 0; i--) {
    const sinir = Math.floor(SANIYE[birimler[i - 1]] / SANIYE[birimler[i]] + 1e-9);
    if (n[i] >= sinir) {
      n[i] -= sinir;
      n[i - 1]++;
    }
  }
  const parca = n.flatMap((v, i) => (v ? [`${nf(2).format(v)} ${BIRIM_AD[birimler[i]]}`] : []));
  return parca.length ? parca.join(' ') : `0 ${BIRIM_AD[birimler[birimler.length - 1]]}`;
}

export interface Takvim {
  baslangic: string;
  bitis: string;
  /** Başlangıçtan bitişe takvim günü */
  gun: number;
  ymd: { years: number; months: number; days: number };
  /** "8 ay 6 gün" / "1 yıl 2 ay 3 gün" */
  metin: string;
  /** Takvim günü − ortalama ayla bulunan gün (ay/yıl girişlerinde anlamlı) */
  fark: number;
}

export interface ZamanCeviriciResult {
  saniye: number;
  /** Girilen sürenin her birimdeki karşılığı (ay ve yıl ortalama uzunlukla) */
  karsilik: Record<Birim, number>;
  gun: number;
  haftaGun: string;
  ayGun: string;
  yilAyGun: string;
  gunSaat: string;
  /** 30 günlük ay / 365 günlük yıl geleneğiyle karşılıklar */
  ay30: number;
  yil365: number;
  /** Ay veya yıl girildiyse 30 / 365 gün geleneğiyle gün sayısı */
  gunGelenek?: number;
  takvim?: Takvim;
  /** Takvim hesabı yapılamadıysa nedeni */
  takvimNot?: string;
}

export function ymdMetin({ years, months, days }: { years: number; months: number; days: number }): string {
  const p = [years && `${nf(0).format(years)} yıl`, months && `${months} ay`, days && `${days} gün`].filter(Boolean);
  return p.length ? p.join(' ') : '0 gün';
}

/**
 * Takvime göre kesin karşılık. Ay/yıl girişlerinde tam aylar yıl dönümü yöntemiyle eklenir (addMonths),
 * küsurat ortalama ay uzunluğuyla güne çevrilir. Diğer birimlerde tam günler eklenir; gün altı kısım atlanır.
 */
function takvimHesapla(v: ZamanCeviriciValues, gun: number): Takvim {
  const bas = v.baslangic!;
  let bitis: string;
  if (v.birim === 'ay' || v.birim === 'yil') {
    const aylar = v.birim === 'yil' ? v.deger * 12 : v.deger;
    const tam = Math.floor(aylar + 1e-9);
    bitis = addDays(addMonths(bas, tam), Math.round((aylar - tam) * ORT_AY_GUN));
  } else {
    bitis = addDays(bas, Math.floor(gun + 1e-9));
  }
  const tGun = dayNumber(bitis) - dayNumber(bas);
  const ymd = ymdDiff(bas, bitis);
  return { baslangic: bas, bitis, gun: tGun, ymd, metin: ymdMetin(ymd), fark: tGun - gun };
}

export function calculateZamanCevirici(v: ZamanCeviriciValues): ZamanCeviriciResult {
  const sn = v.deger * SANIYE[v.birim];
  const karsilik = Object.fromEntries(BIRIMLER.map((b) => [b, sn / SANIYE[b]])) as Record<Birim, number>;
  const gun = karsilik.gun;
  const r: ZamanCeviriciResult = {
    saniye: sn,
    karsilik,
    gun,
    haftaGun: bilesik(sn, ['hafta', 'gun']),
    ayGun: bilesik(sn, ['ay', 'gun'], true),
    yilAyGun: bilesik(sn, ['yil', 'ay', 'gun'], true),
    gunSaat: bilesik(sn, ['gun', 'saat', 'dakika', 'saniye']),
    ay30: gun / 30,
    yil365: gun / 365,
  };
  if (v.birim === 'ay') r.gunGelenek = v.deger * 30;
  if (v.birim === 'yil') r.gunGelenek = v.deger * 365;
  if (v.baslangic) {
    if (gun > TAKVIM_MAX_GUN) r.takvimNot = 'Takvim hesabı en fazla 200 yıllık süreler için yapılır.';
    else r.takvim = takvimHesapla(v, gun);
  }
  return r;
}
