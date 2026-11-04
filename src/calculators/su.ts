import { z } from 'zod';
import { zNumber } from './common.ts';

/**
 * Su ihtiyacı varsayımları:
 * - Kilo başına 30–35 ml/gün (klinikte yaygın pratik yaklaşım); temel değer aralığın ortası.
 * - Egzersiz: 30 dk başına ≈ 350 ml (≈ 0,7 L/saat). ACSM (2007) ter kaybının kişiye göre 0,5–2 L/saat değiştiğini,
 *   antrenman öncesi-sonrası tartıyla kişisel ihtiyacın belirlenmesini önerir.
 * - Sıcak hava: +500 ml kaba ek (kesin bir resmi değer yok).
 * - EFSA (2010) yeterli alım (içecek + besinlerden gelen toplam su): kadın 2,0 L, erkek 2,5 L; gebelik +300 ml, emzirme +700 ml.
 */
export const SU = {
  mlKgMin: 30,
  mlKgMax: 35,
  egzersiz30dk: 350,
  sicak: 500,
  efsa: { kadin: 2000, erkek: 2500 },
  durum: { yok: 0, hamile: 300, emziriyor: 700 },
  bardak: 200,
} as const;

export const suSchema = z
  .object({
    kilo: zNumber('Kilo', { min: 20, max: 250 }),
    cinsiyet: z.enum(['kadin', 'erkek'], { error: 'Cinsiyet seçin' }),
    egzersiz: zNumber('Egzersiz süresi', { max: 600, int: true }).default(0),
    sicak: z.boolean().default(false),
    durum: z.enum(['yok', 'hamile', 'emziriyor']).default('yok'),
  })
  .refine((v) => v.cinsiyet === 'kadin' || v.durum === 'yok', {
    path: ['durum'],
    message: 'Hamilelik / emzirme seçeneği yalnız kadınlar için',
  });

export type SuInput = z.input<typeof suSchema>;

export interface SuResult {
  aralikMin: number;
  aralikMax: number;
  temel: number;
  egzersizEk: number;
  sicakEk: number;
  durumEk: number;
  /** ml/gün */
  toplam: number;
  bardak: number;
  /** EFSA yeterli alım referansı (gebelik/emzirme eki dahil), ml/gün */
  efsa: number;
}

export function calculateSu(input: z.output<typeof suSchema>): SuResult {
  const temel = Math.round((input.kilo * (SU.mlKgMin + SU.mlKgMax)) / 2);
  const egzersizEk = Math.round((input.egzersiz / 30) * SU.egzersiz30dk);
  const sicakEk = input.sicak ? SU.sicak : 0;
  const durumEk = SU.durum[input.durum];
  const toplam = temel + egzersizEk + sicakEk + durumEk;
  return {
    aralikMin: Math.round(input.kilo * SU.mlKgMin),
    aralikMax: Math.round(input.kilo * SU.mlKgMax),
    temel,
    egzersizEk,
    sicakEk,
    durumEk,
    toplam,
    bardak: Math.round(toplam / SU.bardak),
    efsa: SU.efsa[input.cinsiyet] + durumEk,
  };
}
