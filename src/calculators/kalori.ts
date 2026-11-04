import { z } from 'zod';
import { zNumber } from './common.ts';

/** Yaygın kullanılan fiziksel aktivite katsayıları (BMR çarpanı) */
export const AKTIVITE = {
  sedanter: { k: 1.2, ad: 'Hareketsiz', aciklama: 'Masa başı iş, egzersiz yok' },
  hafif: { k: 1.375, ad: 'Hafif aktif', aciklama: 'Haftada 1–3 gün hafif egzersiz' },
  orta: { k: 1.55, ad: 'Orta aktif', aciklama: 'Haftada 3–5 gün orta egzersiz' },
  yuksek: { k: 1.725, ad: 'Çok aktif', aciklama: 'Haftada 6–7 gün yoğun egzersiz' },
  cokYuksek: { k: 1.9, ad: 'Aşırı aktif', aciklama: 'Ağır bedensel iş veya günde iki antrenman' },
} as const;

export type Aktivite = keyof typeof AKTIVITE;

/** Hedef farkı (kcal/gün): ≈ 500 kcal × 7 gün ≈ 3.500 kcal ≈ 0,45–0,5 kg/hafta (basit kural) */
export const HEDEF = { koru: 0, ver: -500, al: 500 } as const;

/** Makro dağılımı önerisi: IOM kabul edilebilir aralıklarının (AMDR) içinden orta değerler */
export const MAKRO = { protein: 0.2, yag: 0.3, karbonhidrat: 0.5 } as const;

export const kaloriSchema = z.object({
  cinsiyet: z.enum(['kadin', 'erkek'], { error: 'Cinsiyet seçin' }),
  yas: zNumber('Yaş', { min: 18, max: 100, int: true }),
  boy: zNumber('Boy', { min: 120, max: 230 }),
  kilo: zNumber('Kilo', { min: 30, max: 300 }),
  aktivite: z.enum(Object.keys(AKTIVITE) as [Aktivite, ...Aktivite[]], { error: 'Aktivite düzeyini seçin' }),
  hedef: z.enum(['koru', 'ver', 'al']).default('koru'),
});

export type KaloriInput = z.input<typeof kaloriSchema>;

export interface KaloriResult {
  bmr: number;
  tdee: number;
  hedefKcal: number;
  /** Hedef kalori bazal metabolizmanın altında mı (uzman gözetimi önerilir) */
  bmrAlti: boolean;
  makro: { protein: number; yag: number; karbonhidrat: number };
  /** Tüm aktivite düzeyleri için koruma kalorisi */
  seviyeler: { id: Aktivite; tdee: number }[];
}

/**
 * Mifflin-St Jeor (1990): BMR = 10×kg + 6,25×cm − 5×yaş + 5 (erkek) / − 161 (kadın).
 * TDEE = BMR × aktivite katsayısı. kcal tam sayıya yuvarlanır; makro gramları 4/9/4 kcal/g.
 */
export function calculateKalori(input: z.output<typeof kaloriSchema>): KaloriResult {
  const bmrRaw = 10 * input.kilo + 6.25 * input.boy - 5 * input.yas + (input.cinsiyet === 'erkek' ? 5 : -161);
  const tdeeRaw = bmrRaw * AKTIVITE[input.aktivite].k;
  const hedefKcal = Math.round(tdeeRaw + HEDEF[input.hedef]);
  return {
    bmr: Math.round(bmrRaw),
    tdee: Math.round(tdeeRaw),
    hedefKcal,
    bmrAlti: hedefKcal < bmrRaw,
    makro: {
      protein: Math.round((hedefKcal * MAKRO.protein) / 4),
      yag: Math.round((hedefKcal * MAKRO.yag) / 9),
      karbonhidrat: Math.round((hedefKcal * MAKRO.karbonhidrat) / 4),
    },
    seviyeler: (Object.keys(AKTIVITE) as Aktivite[]).map((id) => ({ id, tdee: Math.round(bmrRaw * AKTIVITE[id].k) })),
  };
}
