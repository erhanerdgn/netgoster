import { z } from 'zod';
import { lise } from '../config/sinavlar.ts';
import { zNumber } from './common.ts';

/**
 * Ortaöğretim Kurumları Yönetmeliği md. 57–58 (RG-8/9/2023 değişikliği; 2023-2024'ten itibaren kademeli,
 * 2026-2027'de tüm sınıflarda): en fazla 1 başarısız ders + YBP ≥ 50 → doğrudan geçer; YBP ≥ 50 ve en fazla
 * 3 başarısız ders → sorumlu geçer; alt sınıflar dahil toplam 6'dan fazla başarısız ders → sınıf tekrarı.
 * Sınırlar src/config/sinavlar.ts → lise.gecme
 */
export const gecmeKurali = lise.gecme;

const ders = z.object({
  ad: z.string().max(60, 'Ders adı en fazla 60 karakter olabilir').optional(),
  /** Boş bırakılan satır hesaba katılmaz */
  puan: zNumber('Yıl sonu puanı', { max: 100 }).optional(),
  saat: zNumber('Haftalık ders saati', { min: 1, max: 12, int: true }),
});

export const liseSchema = z.object({
  dersler: z
    .array(ders)
    .max(30, 'En fazla 30 ders eklenebilir')
    .refine((l) => l.some((d) => d.puan !== undefined), 'En az bir dersin puanını girin'),
  /** Teşekkür/takdir için davranış puanının 100 olması gerekir (md. 160) */
  davranis100: z.boolean().default(true),
});
export type LiseInput = z.input<typeof liseSchema>;

export type GecmeDurumu = 'dogrudan' | 'ybp' | 'sorumlu' | 'tekrar';
export type Belge = 'takdir' | 'tesekkur' | null;

export interface LiseResult {
  dersSayisi: number;
  toplamSaat: number;
  agirlikliToplam: number;
  /** Yıl sonu başarı puanı: virgülden sonra 4 basamak (md. 55 — bölme 4 basamak yürütülür, kesilir) */
  ortalama: number;
  derece: string;
  basarisiz: number;
  gecme: GecmeDurumu;
  belge: Belge;
  /** Belge alınamıyorsa sebep */
  belgeEngeli: string | null;
}

/** x'i virgülden sonra 4 basamakta keser */
const trunc4 = (x: number) => Math.floor(x * 1e4 + 1e-7) / 1e4;

/**
 * Lise yıl sonu başarı puanı (md. 54–55): Σ (yıl sonu puanı × haftalık saat) / Σ haftalık saat.
 * Belge (md. 160): tüm derslerden başarılı, ortalama ≥ 70, davranış puanı 100 → 70–84,99 teşekkür, ≥ 85 takdir.
 */
export function calculateLise(input: z.output<typeof liseSchema>): LiseResult {
  const list = input.dersler.filter((d): d is typeof d & { puan: number } => d.puan !== undefined);
  const toplamSaat = list.reduce((s, d) => s + d.saat, 0);
  const agirlikliToplam = list.reduce((s, d) => s + d.puan * d.saat, 0);
  const ortalama = trunc4(agirlikliToplam / toplamSaat);
  const basarisiz = list.filter((d) => d.puan < lise.passMark).length;

  const k = gecmeKurali;
  const gecme: GecmeDurumu =
    basarisiz === 0
      ? 'dogrudan'
      : ortalama >= lise.passMark && basarisiz <= k.dogrudanMaxBasarisiz
        ? 'ybp'
        : ortalama >= lise.passMark && basarisiz <= k.sorumluMaxBasarisiz
          ? 'sorumlu'
          : 'tekrar';

  let belge: Belge = null;
  let belgeEngeli: string | null = null;
  if (ortalama < lise.tesekkur) belgeEngeli = `Ortalama ${lise.tesekkur}'in altında`;
  else if (basarisiz > 0) belgeEngeli = 'Başarısız dersiniz var (tüm derslerden başarılı olmak gerekir)';
  else if (!input.davranis100) belgeEngeli = 'Davranış puanının 100 olması gerekir';
  else belge = ortalama >= lise.takdir ? 'takdir' : 'tesekkur';

  return {
    dersSayisi: list.length,
    toplamSaat,
    agirlikliToplam,
    ortalama,
    derece: lise.scale.find((s) => ortalama >= s.min)!.label,
    basarisiz,
    gecme,
    belge,
    belgeEngeli,
  };
}
