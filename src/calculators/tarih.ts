import { z } from 'zod';
import { TATIL_YILLARI, tatilAt, type Tatil } from '../config/tatiller.ts';
import { addDays, dayNumber, fromDayNumber, zDate, zNumber } from './common.ts';

export const GUNLER = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

/** 0 = Pazar … 6 = Cumartesi (1970-01-01 Perşembe) */
export const weekday = (iso: string) => (((dayNumber(iso) + 4) % 7) + 7) % 7;
export const gunAdi = (iso: string) => GUNLER[weekday(iso)];

const daysInMonth = (y: number, m: number) => new Date(Date.UTC(y, m, 0)).getUTCDate();

/**
 * `from` tarihinden `months` ay sonraki yıl dönümü. Hedef ayda o gün yoksa (31'i, 29 Şubat) bir sonraki ayın 1'i alınır
 * (29 Şubat doğumlular artık olmayan yılda yaşını 1 Mart'ta doldurur).
 */
export function anniversary(from: string, months: number): string {
  const [y, m, d] = from.split('-').map(Number);
  const total = y * 12 + (m - 1) + months;
  const ty = Math.floor(total / 12);
  const tm = (total % 12) + 1;
  if (d > daysInMonth(ty, tm)) return tm === 12 ? `${ty + 1}-01-01` : `${ty}-${String(tm + 1).padStart(2, '0')}-01`;
  return `${ty}-${String(tm).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

/**
 * İki tarih arası tam yıl / ay / gün (from ≤ to). Ay sonu güvenli: common.ts'teki ymdDiff 31 Ocak → 1 Mart gibi
 * durumlarda negatif gün verebildiği için burada yıl dönümü yöntemi kullanılır.
 */
export function ymd(from: string, to: string): { years: number; months: number; days: number; totalMonths: number } {
  const [y1, m1] = from.split('-').map(Number);
  const [y2, m2] = to.split('-').map(Number);
  let total = (y2 - y1) * 12 + (m2 - m1);
  if (anniversary(from, total) > to) total -= 1;
  const days = dayNumber(to) - dayNumber(anniversary(from, total));
  return { years: Math.floor(total / 12), months: total % 12, days, totalMonths: total };
}

const isWeekend = (iso: string) => {
  const w = weekday(iso);
  return w === 0 || w === 6;
};

/** İş günü: hafta sonu ve tam gün resmi tatil değil. Arifeler (yarım gün) iş günüdür. */
export const isIsGunu = (iso: string) => !isWeekend(iso) && !(tatilAt(iso) && !tatilAt(iso)!.half);

const yearsOf = (a: string, b: string) => {
  const out: number[] = [];
  for (let y = Number(a.slice(0, 4)); y <= Number(b.slice(0, 4)); y++) out.push(y);
  return out;
};
const eksikYillar = (a: string, b: string) => yearsOf(a, b).filter((y) => !TATIL_YILLARI.includes(y));

const araSchema = z
  .object({
    mod: z.literal('ara'),
    baslangic: zDate('Başlangıç tarihi'),
    bitis: zDate('Bitiş tarihi'),
    bitisDahil: z.boolean().default(false),
  })
  .refine((v) => v.bitis >= v.baslangic, { path: ['bitis'], message: 'Bitiş tarihi başlangıç tarihinden önce olamaz' })
  .refine((v) => dayNumber(v.bitis) - dayNumber(v.baslangic) <= 365 * 200, {
    path: ['bitis'],
    message: 'Aralık en fazla 200 yıl olabilir',
  });

const ekleSchema = z.object({
  mod: z.literal('ekle'),
  tarih: zDate('Tarih'),
  islem: z.enum(['ekle', 'cikar']),
  gun: zNumber('Gün sayısı', { max: 36500, int: true }),
  birim: z.enum(['takvim', 'is']),
});

/** Formun tüm alanları (iki mod birlikte); şema yalnız seçili modun alanlarını doğrular, diğerlerini atar. */
export type TarihInput = Omit<z.input<typeof araSchema>, 'mod'> &
  Omit<z.input<typeof ekleSchema>, 'mod'> & { mod: 'ara' | 'ekle' };
const union = z.discriminatedUnion('mod', [araSchema, ekleSchema]);
export type TarihValues = z.output<typeof union>;
export const tarihSchema = union as unknown as z.ZodType<TarihValues, TarihInput>;

export interface AraResult {
  mod: 'ara';
  gun: number;
  hafta: { weeks: number; days: number };
  ay: { months: number; days: number };
  ymd: { years: number; months: number; days: number };
  isGunu: number;
  haftaSonu: number;
  tatilGunu: number;
  /** Aralıktaki yarım gün tatiller (iş gününe dahil) */
  yarimGunler: Tatil[];
  /** Aralığa denk gelen tam gün tatiller (hafta sonuna denk gelenler dahil) */
  tatiller: Tatil[];
  /** Hesaba katılan son gün */
  sonGun: string;
  eksikYillar: number[];
}

export interface EkleResult {
  mod: 'ekle';
  sonuc: string;
  gunAdi: string;
  takvimGunu: number;
  sonucTatil?: Tatil;
  sonucHaftaSonu: boolean;
  atlananTatiller: Tatil[];
  eksikYillar: number[];
}

export function calculateAra(v: Extract<TarihValues, { mod: 'ara' }>): AraResult {
  const gun = dayNumber(v.bitis) - dayNumber(v.baslangic) + (v.bitisDahil ? 1 : 0);
  const sonGun = addDays(v.baslangic, gun - 1);
  const d = ymd(v.baslangic, addDays(v.baslangic, gun));
  let isGunu = 0;
  let haftaSonu = 0;
  let tatilGunu = 0;
  const yarimGunler: Tatil[] = [];
  const tatiller: Tatil[] = [];
  const start = dayNumber(v.baslangic);
  for (let n = start; n < start + gun; n++) {
    const iso = fromDayNumber(n);
    const t = tatilAt(iso);
    if (t && !t.half) tatiller.push(t);
    if (isWeekend(iso)) haftaSonu++;
    else if (t && !t.half) tatilGunu++;
    else {
      isGunu++;
      if (t) yarimGunler.push(t);
    }
  }
  return {
    mod: 'ara',
    gun,
    hafta: { weeks: Math.floor(gun / 7), days: gun % 7 },
    ay: { months: d.totalMonths, days: d.days },
    ymd: { years: d.years, months: d.months, days: d.days },
    isGunu,
    haftaSonu,
    tatilGunu,
    yarimGunler,
    tatiller,
    sonGun,
    eksikYillar: gun > 0 ? eksikYillar(v.baslangic, sonGun) : [],
  };
}

export function calculateEkle(v: Extract<TarihValues, { mod: 'ekle' }>): EkleResult {
  const step = v.islem === 'ekle' ? 1 : -1;
  let sonuc = v.tarih;
  const atlananTatiller: Tatil[] = [];
  if (v.birim === 'takvim') sonuc = addDays(v.tarih, step * v.gun);
  else {
    for (let left = v.gun; left > 0;) {
      sonuc = addDays(sonuc, step);
      if (isIsGunu(sonuc)) left--;
      else if (tatilAt(sonuc) && !isWeekend(sonuc)) atlananTatiller.push(tatilAt(sonuc)!);
    }
  }
  const [a, b] = sonuc < v.tarih ? [sonuc, v.tarih] : [v.tarih, sonuc];
  return {
    mod: 'ekle',
    sonuc,
    gunAdi: gunAdi(sonuc),
    takvimGunu: Math.abs(dayNumber(sonuc) - dayNumber(v.tarih)),
    sonucTatil: tatilAt(sonuc),
    sonucHaftaSonu: isWeekend(sonuc),
    atlananTatiller,
    eksikYillar: v.birim === 'is' ? eksikYillar(a, b) : [],
  };
}

export function calculateTarih(v: TarihValues): AraResult | EkleResult {
  return v.mod === 'ara' ? calculateAra(v) : calculateEkle(v);
}
