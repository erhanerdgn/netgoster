import { z } from 'zod';

const BIRLER = ['', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz'];
const ONLAR = ['', 'on', 'yirmi', 'otuz', 'kırk', 'elli', 'altmış', 'yetmiş', 'seksen', 'doksan'];
/** Üçlü basamak grupları (TDK): 10^3 … 10^21. Seksilyon yalnız kuruş yuvarlamasının taşması için. */
export const OLCEKLER = ['', 'bin', 'milyon', 'milyar', 'trilyon', 'katrilyon', 'kentilyon', 'seksilyon'];
/** Kabul edilen en uzun tam kısım: 21 basamak (999 kentilyon …) */
export const MAX_BASAMAK = 21;
export const MAX_ONDALIK = 9;

export const BIRIMLER = {
  TL: { ad: ['Türk', 'lirası'], alt: 'kuruş', kisa: 'TL', altKisa: 'Kr.' },
  USD: { ad: ['dolar'], alt: 'sent', kisa: 'USD', altKisa: 'sent' },
  EUR: { ad: ['avro'], alt: 'sent', kisa: 'EUR', altKisa: 'sent' },
} as const;
export type ParaBirimi = keyof typeof BIRIMLER;

export interface SayiParca {
  negatif: boolean;
  /** Tam kısmın rakamları, baştaki sıfırlar atılmış ('0' olabilir) */
  tam: string;
  /** Ondalık kısmın rakamları, yazıldığı gibi */
  kesir: string;
}

/**
 * Serbest metni sayıya ayrıştırır (kayan noktaya çevirmeden; 21 basamağa kadar kesin).
 * - Türkçe biçim: 1.234.567,89 · İngilizce biçim: 1,234,567.89 · düz: 1234567.89 / 1234567,89
 * - Hem nokta hem virgül varsa sonda olan ondalık ayraçtır.
 * - Tek virgül ondalıktır; birden çok virgül binlik ayraçtır.
 * - Tek nokta: arkasında tam üç rakam varsa (1.500) binlik, yoksa (12.5) ondalık ayraçtır; "0.125" ondalıktır.
 * - Boşluklar, ₺/TL/$/€ işaretleri yok sayılır; başta "-" eksi işaretidir.
 */
export function sayiCoz(metin: string): SayiParca | { hata: string } {
  let t = metin.replace(/\s/g, '').replace(/₺|TL|TRY|USD|EUR|\$|€/gi, '');
  let negatif = false;
  if (/^[-−]/.test(t)) {
    negatif = true;
    t = t.slice(1);
  } else if (t.startsWith('+')) t = t.slice(1);
  if (!/\d/.test(t) || !/^[\d.,]+$/.test(t)) return { hata: 'Yalnız rakam, nokta ve virgül kullanın (ör. 12.450,50)' };

  const nokta = t.split('.').length - 1;
  const virgul = t.split(',').length - 1;
  let ondalik: '.' | ',' | null = null;
  if (nokta && virgul) ondalik = t.lastIndexOf('.') > t.lastIndexOf(',') ? '.' : ',';
  else if (virgul) ondalik = virgul === 1 ? ',' : null;
  else if (nokta) ondalik = nokta === 1 && !/^[1-9]\d{0,2}\.\d{3}$/.test(t) ? '.' : null;

  const i = ondalik ? t.lastIndexOf(ondalik) : t.length;
  const tamMetin = t.slice(0, i);
  const kesir = t.slice(i + 1);
  if (/[.,]/.test(kesir)) return { hata: 'Ondalık ayraçtan sonra yalnız rakam yazın' };
  const binlik = ondalik === ',' ? '.' : ondalik === '.' ? ',' : nokta ? '.' : ',';
  if (ondalik && tamMetin.includes(ondalik)) return { hata: 'Ondalık ayraç bir kez kullanılabilir' };
  if (tamMetin.includes(binlik)) {
    const g = tamMetin.split(binlik);
    if (!/^\d{1,3}$/.test(g[0]) || g.slice(1).some((x) => !/^\d{3}$/.test(x)))
      return { hata: 'Binlik ayraçları üçerli gruplar halinde yazın (ör. 1.250.000)' };
  }
  const tam = tamMetin.split(binlik).join('').replace(/^0+/, '') || '0';
  if (tam.length > MAX_BASAMAK) return { hata: `En fazla ${MAX_BASAMAK} basamaklı sayılar (999 kentilyona kadar) yazılabilir` };
  if (kesir.length > MAX_ONDALIK) return { hata: `En fazla ${MAX_ONDALIK} ondalık basamak yazılabilir` };
  return { negatif, tam, kesir };
}

/** Metni sayıya çevirir (ortalama gibi araçlar için); çözülemezse undefined */
export function sayiyaCevir(metin: string): number | undefined {
  const r = sayiCoz(metin);
  if ('hata' in r) return undefined;
  return Number(`${r.negatif ? '-' : ''}${r.tam}.${r.kesir || '0'}`);
}

/** 0–999 → kelimeler; "yüz" başına "bir" gelmez (yüz, yüz bir) */
function ucluk(n: number): string[] {
  const w: string[] = [];
  const yuz = Math.floor(n / 100);
  if (yuz) w.push(...(yuz > 1 ? [BIRLER[yuz]] : []), 'yüz');
  if (ONLAR[Math.floor(n / 10) % 10]) w.push(ONLAR[Math.floor(n / 10) % 10]);
  if (BIRLER[n % 10]) w.push(BIRLER[n % 10]);
  return w;
}

/** Negatif olmayan tam sayı → kelimeler. "bin" önüne "bir" gelmez (bin, bin bir), "bir milyon" gelir. */
export function tamSayiKelimeleri(n: bigint): string[] {
  if (n === 0n) return ['sıfır'];
  const gruplar: number[] = [];
  for (let k = n; k > 0n; k /= 1000n) gruplar.push(Number(k % 1000n));
  if (gruplar.length > OLCEKLER.length) throw new RangeError('Sayı çok büyük');
  const w: string[] = [];
  for (let i = gruplar.length - 1; i >= 0; i--) {
    const g = gruplar[i];
    if (!g) continue;
    if (!(i === 1 && g === 1)) w.push(...ucluk(g));
    if (i) w.push(OLCEKLER[i]);
  }
  return w;
}

/** "05" → sıfır beş; "50" → elli (ondalık kısım yazıldığı gibi okunur) */
function kesirKelimeleri(kesir: string): string[] {
  const sifir = /^0*/.exec(kesir)![0].length;
  const kalan = kesir.slice(sifir);
  return [...Array<string>(sifir).fill('sıfır'), ...(kalan ? tamSayiKelimeleri(BigInt(kalan)) : [])];
}

export type Harf = 'cumle' | 'kucuk' | 'buyuk' | 'kelime';
const ilkBuyuk = (s: string) => s.charAt(0).toLocaleUpperCase('tr') + s.slice(1);

/** Kelime grupları: grup içi bitişik ya da ayrı, gruplar arası her zaman boşluk */
function bicimle(gruplar: string[][], harf: Harf, bitisik: boolean): string {
  const s = gruplar
    .filter((g) => g.length)
    .map((g) => g.map((w) => (harf === 'kelime' ? ilkBuyuk(w) : w)).join(bitisik ? '' : ' '))
    .join(' ');
  if (harf === 'buyuk') return s.toLocaleUpperCase('tr');
  return harf === 'cumle' ? ilkBuyuk(s) : s;
}

const grupla = (rakamlar: string) => rakamlar.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

export const rakamYaziSchema = z.object({
  sayi: z
    .string({ error: 'Sayı girin' })
    .trim()
    .min(1, 'Sayı girin')
    .superRefine((s, ctx) => {
      const r = sayiCoz(s);
      if ('hata' in r) ctx.addIssue({ code: 'custom', message: r.hata });
    }),
  /** ayri: TDK (on iki bin) · cek: çek/senet için bitişik, "Yalnız … TL … Kr." */
  yazim: z.enum(['ayri', 'cek']),
  birim: z.enum(['TL', 'sayi', 'USD', 'EUR']),
  harf: z.enum(['cumle', 'kucuk', 'buyuk', 'kelime']),
});
export type RakamYaziInput = z.input<typeof rakamYaziSchema>;
export type RakamYaziValues = z.output<typeof rakamYaziSchema>;

export interface RakamYaziResult {
  /** Seçilen yazım biçimindeki sonuç */
  metin: string;
  /** TDK ayrı yazım */
  ayri: string;
  /** Çek/senet bitişik yazım */
  cek: string;
  /** Rakamla, binlik ayraçlı: "12.450,50 TL" */
  rakam: string;
  /** Para biriminde: tam birim ve alt birim (kuruş/sent, 0–99) */
  tam: bigint;
  alt?: number;
  /** Para biriminde 2 haneden uzun ondalık yuvarlandı mı */
  yuvarlandi: boolean;
  negatif: boolean;
}

/**
 * Sayıyı Türkçe yazıya çevirir. Para birimlerinde ondalık kısım kuruşa (sente) yuvarlanır:
 * üçüncü ondalık 5 ve üzeriyse yukarı (0,995 → 1,00). Sadece sayı modunda ondalık "virgül" ile yazıldığı gibi okunur.
 */
export function calculateRakamYazi(v: RakamYaziValues): RakamYaziResult {
  const p = sayiCoz(v.sayi) as SayiParca;
  const h = v.harf;
  if (v.birim === 'sayi') {
    const kesir = /^0*$/.test(p.kesir) ? '' : p.kesir;
    const negatif = p.negatif && (p.tam !== '0' || kesir !== '');
    const tam = BigInt(p.tam);
    const eksi = negatif ? ['eksi'] : [];
    const kesirG = kesir ? [['virgül'], kesirKelimeleri(kesir)] : [];
    const ayri = bicimle(
      [[...eksi, ...tamSayiKelimeleri(tam), ...(kesir ? ['virgül', ...kesirKelimeleri(kesir)] : [])]],
      h,
      false,
    );
    const cek = bicimle([['Yalnız'], eksi, tamSayiKelimeleri(tam), ...kesirG], h, true);
    return {
      metin: v.yazim === 'ayri' ? ayri : cek,
      ayri,
      cek,
      rakam: `${negatif ? '−' : ''}${grupla(p.tam)}${kesir ? ',' + kesir : ''}`,
      tam,
      yuvarlandi: false,
      negatif,
    };
  }

  const b = BIRIMLER[v.birim];
  // Kuruşa yuvarlama BigInt ile: kayan nokta hatası (1,005 → 1,00) olmaz
  let kurus = BigInt(p.tam) * 100n + BigInt((p.kesir + '00').slice(0, 2));
  if ((p.kesir[2] ?? '0') >= '5') kurus += 1n;
  const tam = kurus / 100n;
  const alt = Number(kurus % 100n);
  const negatif = p.negatif && kurus > 0n;
  const eksi = negatif ? ['eksi'] : [];
  const liraVar = tam > 0n || alt === 0;
  const liraW = liraVar ? tamSayiKelimeleri(tam) : [];
  const altW = alt ? tamSayiKelimeleri(BigInt(alt)) : [];

  const ayri = bicimle([[...eksi, ...liraW, ...(liraVar ? b.ad : []), ...(alt ? [...altW, b.alt] : [])]], h, false);
  const cek = bicimle([['Yalnız'], eksi, liraW, liraVar ? [b.kisa] : [], altW, alt ? [b.altKisa] : []], h, true);
  return {
    metin: v.yazim === 'ayri' ? ayri : cek,
    ayri,
    cek,
    rakam: `${negatif ? '−' : ''}${grupla(tam.toString())},${String(alt).padStart(2, '0')} ${b.kisa}`,
    tam,
    alt,
    yuvarlandi: p.kesir.length > 2 && /[1-9]/.test(p.kesir.slice(2)),
    negatif,
  };
}
