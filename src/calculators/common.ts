import { z } from 'zod';

// Özel mesaj verilmemiş tüm doğrulama hataları Türkçe olsun
z.config(z.locales.tr());

/** Ortak zod yardımcıları — form doğrulaması ile hesaplama fonksiyonu aynı şemayı paylaşır. */
export const zMoney = (label: string, { min = 0, max = 1e12 }: { min?: number; max?: number } = {}) =>
  z
    .number({ error: `${label} girin` })
    .min(min, `${label} en az ${min.toLocaleString('tr-TR')} olmalı`)
    .max(max, `${label} çok yüksek`);

export const zNumber = (
  label: string,
  { min = 0, max = 1e9, int = false }: { min?: number; max?: number; int?: boolean } = {},
) => {
  let s = z
    .number({ error: `${label} girin` })
    .min(min, `${label} en az ${min.toLocaleString('tr-TR')} olmalı`)
    .max(max, `${label} en fazla ${max.toLocaleString('tr-TR')} olabilir`);
  if (int) s = s.int(`${label} tam sayı olmalı`);
  return s;
};

export const zDate = (label: string) =>
  z.string({ error: `${label} girin` }).regex(/^\d{4}-\d{2}-\d{2}$/, `${label} için geçerli bir tarih girin (gg.aa.yyyy)`);

/** ISO tarih → UTC gün sayısı (saat dilimi kaymasından bağımsız gün farkı için) */
export function dayNumber(iso: string): number {
  const [y, m, d] = iso.split('-').map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / 86400000);
}

export function fromDayNumber(n: number): string {
  return new Date(n * 86400000).toISOString().slice(0, 10);
}

export function addDays(iso: string, days: number): string {
  return fromDayNumber(dayNumber(iso) + days);
}

/**
 * Tarihe `months` ay ekler (yıl dönümü yöntemi). Hedef ayda o gün yoksa (31 Ocak + 1 ay) sonraki ayın 1'ine geçer —
 * 29 Şubat doğumlular ve ay sonu girişleri için tarih-hesaplama/yas-hesaplama ile aynı kural.
 */
export function addMonths(iso: string, months: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  const total = y * 12 + (m - 1) + months;
  const ty = Math.floor(total / 12);
  const tm = (total % 12) + 1;
  const dim = new Date(Date.UTC(ty, tm, 0)).getUTCDate();
  if (d > dim) return tm === 12 ? `${ty + 1}-01-01` : `${ty}-${String(tm + 1).padStart(2, '0')}-01`;
  return `${ty}-${String(tm).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

/**
 * İki tarih arası tam yıl / ay / gün farkı (yıl dönümü yöntemi; from > to ise sıfır).
 * Önce tam ay sayısı bulunur, kalan gün son yıl dönümünden sayılır: 31 Ocak + 1 ay = 1 Mart olduğundan
 * 31 Ocak → 1 Mart = 1 ay 0 gün; 30 Ocak → 28 Şubat = 29 gün (negatif gün oluşmaz).
 */
export function ymdDiff(fromISO: string, toISO: string): { years: number; months: number; days: number } {
  if (fromISO >= toISO) return { years: 0, months: 0, days: 0 };
  const [y1, m1] = fromISO.split('-').map(Number);
  const [y2, m2] = toISO.split('-').map(Number);
  let total = (y2 - y1) * 12 + (m2 - m1);
  if (addMonths(fromISO, total) > toISO) total -= 1;
  const days = dayNumber(toISO) - dayNumber(addMonths(fromISO, total));
  return { years: Math.floor(total / 12), months: total % 12, days };
}

/** Kuruşa yuvarlama (yarım kuruş yukarı). Kayan nokta gürültüsünü (4211.324999…) önce 6 haneye sabitler. */
export const round2 = (n: number) => Math.round(Number((n * 100).toFixed(6))) / 100;
