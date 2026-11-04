import { z } from 'zod';
import { todayISO } from '../config/period.ts';
import { addDays, dayNumber, zDate, zNumber } from './common.ts';

/** Takip edilen en uzun süre: 42 hafta 0 gün (ACOG: ≥42+0 "postterm") */
export const MAX_GUN = 42 * 7;

/** Gebelik yaşı (gün) = bugün − SAT − (döngü − 28). Naegele düzeltmesi. */
const gebelikGunu = (sat: string, dongu: number, today: string) => dayNumber(today) - dayNumber(sat) - (dongu - 28);

export const gebelikSchema = z
  .object({
    sat: zDate('Son adet tarihi'),
    dongu: zNumber('Döngü süresi', { min: 21, max: 45, int: true }).default(28),
  })
  .superRefine((v, ctx) => {
    const today = todayISO();
    if (v.sat > today) ctx.addIssue({ code: 'custom', path: ['sat'], message: 'Son adet tarihi gelecekte olamaz' });
    else if (gebelikGunu(v.sat, v.dongu ?? 28, today) > MAX_GUN)
      ctx.addIssue({
        code: 'custom',
        path: ['sat'],
        message: 'Bu tarihe göre gebelik 42 haftayı aşıyor; son adet tarihini kontrol edin',
      });
  });

export type GebelikInput = z.input<typeof gebelikSchema>;

/**
 * Önemli tarama/muayene aralıkları (hafta, başlangıç ve bitiş haftası dahil).
 * Kaynak: ACOG CO 700 (tarihlendirme), ACOG PB 190 (GDM 24–28), ACOG CO 797 (GBS 36+0–37+6),
 * ACOG hasta bilgilendirme (NT 11–14, dörtlü test 15–22, anomali USG 18–22), WHO ANC 2016.
 */
export const TARAMALAR: { from: number; to: number; ad: string }[] = [
  { from: 6, to: 10, ad: 'İlk ultrason (gebeliğin doğrulanması, kalp atımı, tarihlendirme)' },
  { from: 11, to: 13, ad: 'İlk trimester taraması (ense kalınlığı + ikili test)' },
  { from: 15, to: 20, ad: 'Üçlü / dörtlü tarama testi' },
  { from: 18, to: 22, ad: 'Ayrıntılı (anomali) ultrasonu' },
  { from: 24, to: 28, ad: 'Gebelik şekeri (OGTT) taraması' },
  { from: 28, to: 28, ad: 'Rh(−) anneler için anti-D uygulaması' },
  { from: 36, to: 37, ad: 'Grup B streptokok (GBS) taraması' },
  { from: 40, to: 40, ad: 'Tahmini doğum haftası' },
  { from: 41, to: 41, ad: 'Miadı geçen gebelik takibi' },
];

export type TaramaDurum = 'gecti' | 'simdi' | 'gelecek';

export interface GebelikResult {
  gun: number;
  hafta: number;
  gunArti: number;
  trimester: 1 | 2 | 3;
  tdt: string;
  kalanGun: number;
  /** Tahmini döllenme (yumurtlama) tarihi ≈ düzeltilmiş SAT + 14 gün */
  dollenme: string;
  /** Hafta hesabının başladığı düzeltilmiş SAT */
  baz: string;
  taramalar: { from: number; to: number; ad: string; baslangic: string; bitis: string; durum: TaramaDurum }[];
}

/**
 * Naegele kuralı (döngü düzeltmeli): TDT = SAT + 280 + (döngü − 28) gün.
 * Trimester (ACOG): 1. ≤13+6, 2. 14+0–27+6, 3. ≥28+0.
 */
export function calculateGebelik(input: z.output<typeof gebelikSchema>, today = todayISO()): GebelikResult {
  const baz = addDays(input.sat, input.dongu - 28);
  const gun = Math.max(0, gebelikGunu(input.sat, input.dongu, today));
  const hafta = Math.floor(gun / 7);
  const tdt = addDays(baz, 280);
  return {
    gun,
    hafta,
    gunArti: gun % 7,
    trimester: hafta < 14 ? 1 : hafta < 28 ? 2 : 3,
    tdt,
    kalanGun: dayNumber(tdt) - dayNumber(today),
    dollenme: addDays(baz, 14),
    baz,
    taramalar: TARAMALAR.map((t) => ({
      ...t,
      baslangic: addDays(baz, t.from * 7),
      bitis: addDays(baz, t.to * 7 + 6),
      durum: hafta > t.to ? 'gecti' : hafta >= t.from ? 'simdi' : 'gelecek',
    })),
  };
}
