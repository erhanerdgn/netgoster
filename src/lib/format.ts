/** tr-TR biçimlendirme yardımcıları — tüm araçlar bunları kullanır. */
const nf = (min: number, max: number) =>
  new Intl.NumberFormat('tr-TR', { minimumFractionDigits: min, maximumFractionDigits: max });

const money2 = nf(2, 2);

/** 1234567.891 → "1.234.567,89 ₺" */
export function tl(n: number): string {
  return `${money2.format(round2(n))} ₺`;
}

/** Kuruşsuz: 1234567.8 → "1.234.568 ₺" */
export function tl0(n: number): string {
  return `${nf(0, 0).format(n)} ₺`;
}

/** Para birimi kodlu biçim, simge sonda: (1234.5, 'USD') → "1.234,50 $"; TRY → "1.234,50 ₺" */
export function currency(n: number, code: string, digits = 2): string {
  const parts = new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: code,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).formatToParts(n);
  const symbol = parts.find((p) => p.type === 'currency')?.value ?? code;
  const number = parts
    .filter((p) => p.type !== 'currency')
    .map((p) => p.value)
    .join('')
    .trim();
  return `${number} ${symbol}`;
}

/** Sayı (ondalık en fazla `max`) → "1.234,5" */
export function num(n: number, max = 2, min = 0): string {
  return nf(min, max).format(n);
}

/** Yüzde: 0.2 → "%20" (oran) */
export function pct(ratio: number, max = 2): string {
  return '%' + nf(0, max).format(ratio * 100);
}

/** Yüzde (zaten yüzde birimindeyse): 20 → "%20" */
export function pctValue(value: number, max = 2): string {
  return '%' + nf(0, max).format(value);
}

/** Kuruşa yuvarlama (yarım kuruş yukarı). Kayan nokta gürültüsünü (4211.324999…) önce 6 haneye sabitler. */
export const round2 = (n: number) => Math.round(Number((n * 100).toFixed(6))) / 100;

const MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
export const monthNames = MONTHS;

/** "2026-11-04" → "04.11.2026" */
export function dateTR(iso: string): string {
  const [y, m, d] = iso.slice(0, 10).split('-');
  return `${d}.${m}.${y}`;
}

/** "2026-11-04" → "4 Kasım 2026" */
export function dateLong(iso: string): string {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

/** Kullanıcının yazdığı tr-TR sayısını çözümler: "1.234,5" → 1234.5. Boşsa undefined. */
export function parseTR(text: string): number | undefined {
  const clean = text
    .replace(/\s|₺|%/g, '')
    .replace(/\./g, '')
    .replace(',', '.');
  if (clean === '' || clean === '-' || clean === '.') return undefined;
  const n = Number(clean);
  return Number.isFinite(n) ? n : undefined;
}

/**
 * Yazarken binlik ayraç ekler, ondalık kısmı korur: "1234567,8" → "1.234.567,8".
 * Kullanıcı virgülü henüz yazdıysa ("12,") olduğu gibi bırakır.
 */
export function formatTyping(text: string, decimals: number, allowNegative = false): string {
  const neg = allowNegative && text.trim().startsWith('-') ? '-' : '';
  let t = text.replace(/[^\d,]/g, '');
  const firstComma = t.indexOf(',');
  if (firstComma !== -1) t = t.slice(0, firstComma + 1) + t.slice(firstComma + 1).replace(/,/g, '');
  const [rawInt, dec] = t.split(',');
  const int = rawInt.replace(/^0+(?=\d)/, '');
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  if (decimals === 0) return neg + grouped;
  return neg + (dec !== undefined ? `${grouped},${dec.slice(0, decimals)}` : grouped);
}

/** Sayıyı giriş alanında gösterilecek biçime çevirir: 1234.5 → "1.234,5" */
export function formatInput(n: number | undefined, decimals: number): string {
  if (n === undefined || n === null || Number.isNaN(n)) return '';
  return new Intl.NumberFormat('tr-TR', { maximumFractionDigits: decimals, useGrouping: true }).format(n);
}
