import { z } from 'zod';
import { isKanunu } from '../config/parameters-2026.ts';
import { zNumber } from './common.ts';

/** İş Kanunu md. 41/63: haftalık 45 saati aşan çalışma fazla çalışmadır (dakika) */
export const HAFTALIK_SINIR_DK = isKanunu.haftalikAzami * 60;

export const zSaat = (label: string) =>
  z
    .string({ error: `${label} girin` })
    .regex(/^([01]?\d|2[0-3]):[0-5]\d$/, `${label} için SS:DD biçiminde geçerli bir saat girin (ör. 08:30)`);

/** "22:30" → 1350 (gece yarısından itibaren dakika) */
export const saatToDk = (s: string) => {
  const [h, m] = s.split(':').map(Number);
  return h * 60 + m;
};

/** Gün içi saat: 1545 → "01:45" (24 saate göre sarar) */
export const dkToSaat = (dk: number) => {
  const d = ((Math.round(dk) % 1440) + 1440) % 1440;
  return `${String(Math.floor(d / 60)).padStart(2, '0')}:${String(d % 60).padStart(2, '0')}`;
};

/** Süre: 465 → "7 saat 45 dakika", 1440 → "24 saat" */
export function sureMetin(dk: number): string {
  const t = Math.round(Math.abs(dk));
  const h = Math.floor(t / 60);
  const m = t % 60;
  const p = [h && `${h.toLocaleString('tr-TR')} saat`, m && `${m} dakika`].filter(Boolean);
  return p.length ? p.join(' ') : '0 dakika';
}

/** Süre SS:DD (24'ü aşabilir): 3000 → "50:00" */
export const sureSSDD = (dk: number) => {
  const t = Math.round(dk);
  return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;
};

export function gunMetni(gunFarki: number): string {
  if (gunFarki === 0) return 'aynı gün';
  if (gunFarki === 1) return 'ertesi gün';
  if (gunFarki === -1) return 'önceki gün';
  return gunFarki > 0 ? `${gunFarki} gün sonra` : `${-gunFarki} gün önce`;
}

/** Başlangıç ve bitiş arası brüt süre; bitiş daha erkense gece yarısı geçilmiştir, eşitse 24 saat kabul edilir. */
const araSure = (bas: string, bit: string) => (saatToDk(bit) - saatToDk(bas) + 1440) % 1440 || 1440;

const araSchema = z
  .object({
    mod: z.literal('ara'),
    baslangic: zSaat('Başlangıç saati'),
    bitis: zSaat('Bitiş saati'),
    mola: zNumber('Mola', { max: 1440, int: true }).default(0),
  })
  .refine((v) => v.mola < araSure(v.baslangic, v.bitis), {
    path: ['mola'],
    message: 'Mola süresi iki saat arasındaki süreden kısa olmalı',
  });

const ekleSchema = z.object({
  mod: z.literal('ekle'),
  saat: zSaat('Saat'),
  islem: z.enum(['ekle', 'cikar']),
  sureSaat: zNumber('Saat', { max: 100000, int: true }).default(0),
  sureDakika: zNumber('Dakika', { max: 100000, int: true }).default(0),
});

const satir = z.object({
  saat: zNumber('Saat', { max: 1000 }).optional(),
  dakika: zNumber('Dakika', { max: 100000, int: true }).optional(),
});

const toplaSchema = z.object({
  mod: z.literal('topla'),
  sureler: z
    .array(satir)
    .max(50, 'En fazla 50 satır girilebilir')
    .refine((a) => a.some((s) => s.saat !== undefined || s.dakika !== undefined), 'En az bir süre girin'),
});

/** Formun tüm alanları (üç mod birlikte); şema yalnız seçili modun alanlarını doğrular. */
export type SaatInput = Omit<z.input<typeof araSchema>, 'mod'> &
  Omit<z.input<typeof ekleSchema>, 'mod'> &
  Omit<z.input<typeof toplaSchema>, 'mod'> & { mod: 'ara' | 'ekle' | 'topla' };
const union = z.discriminatedUnion('mod', [araSchema, ekleSchema, toplaSchema]);
export type SaatValues = z.output<typeof union>;
export const saatSchema = union as unknown as z.ZodType<SaatValues, SaatInput>;

export interface AraResult {
  mod: 'ara';
  brut: number;
  mola: number;
  /** Mola düşülmüş süre, dakika */
  net: number;
  geceYarisi: boolean;
  /** Bitiş = başlangıç: 24 saat kabul edildi */
  tamGun: boolean;
}

export interface EkleResult {
  mod: 'ekle';
  sonuc: string;
  gunFarki: number;
  /** Eklenen/çıkarılan süre, dakika */
  sure: number;
}

export interface ToplaResult {
  mod: 'topla';
  toplam: number;
  satir: number;
  /** Haftalık 45 saati aşan kısım, dakika */
  fazla: number;
}

export type SaatResult = AraResult | EkleResult | ToplaResult;

export function calculateSaat(v: SaatValues): SaatResult {
  if (v.mod === 'ara') {
    const brut = araSure(v.baslangic, v.bitis);
    return {
      mod: 'ara',
      brut,
      mola: v.mola,
      net: brut - v.mola,
      geceYarisi: saatToDk(v.bitis) < saatToDk(v.baslangic),
      tamGun: saatToDk(v.bitis) === saatToDk(v.baslangic),
    };
  }
  if (v.mod === 'ekle') {
    const sure = v.sureSaat * 60 + v.sureDakika;
    const t = saatToDk(v.saat) + (v.islem === 'ekle' ? sure : -sure);
    return { mod: 'ekle', sonuc: dkToSaat(t), gunFarki: Math.floor(t / 1440), sure };
  }
  const dolu = v.sureler.filter((s) => s.saat !== undefined || s.dakika !== undefined);
  const toplam = Math.round(dolu.reduce((t, s) => t + (s.saat ?? 0) * 60 + (s.dakika ?? 0), 0));
  return { mod: 'topla', toplam, satir: dolu.length, fazla: Math.max(0, toplam - HAFTALIK_SINIR_DK) };
}
