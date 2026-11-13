import { z } from 'zod';
import { zNumber } from './common.ts';

/**
 * Ortak birim çevirme motoru: her boyutta birimler SI temel birimine (m, m², kg, K, bayt) göre tanımlıdır.
 * temel = (değer + ofset) × çarpan  ⇄  değer = temel ÷ çarpan − ofset
 * Ofset yalnız sıcaklıkta kullanılır (°C: +273,15; °F: +459,67 ve × 5/9 — NIST SP 811 B.8, BIPM SI Broşürü).
 */
export interface Birim {
  ad: string;
  sembol: string;
  carpan: number;
  ofset?: number;
  /** Bu birimden en çok aranan karşılık (ana sonuç) */
  hedef: string;
  /** Veri birimleri: SI (1000) veya IEC (1024) ön eki; yoksa her iki sistemde gösterilir */
  grup?: 'si' | 'iec';
}

export type Boyut = 'uzunluk' | 'alan' | 'agirlik' | 'sicaklik' | 'veri';

const KI = 1024;

export const BIRIMLER: Record<Boyut, Record<string, Birim>> = {
  // 1959 uluslararası yarda ve libre anlaşması: 1 yd = 0,9144 m, 1 lb = 0,45359237 kg (tam)
  uzunluk: {
    mm: { ad: 'Milimetre', sembol: 'mm', carpan: 0.001, hedef: 'cm' },
    cm: { ad: 'Santimetre', sembol: 'cm', carpan: 0.01, hedef: 'inc' },
    m: { ad: 'Metre', sembol: 'm', carpan: 1, hedef: 'cm' },
    km: { ad: 'Kilometre', sembol: 'km', carpan: 1000, hedef: 'mil' },
    inc: { ad: 'İnç', sembol: 'inç', carpan: 0.0254, hedef: 'cm' },
    ft: { ad: 'Ayak (feet)', sembol: 'ft', carpan: 0.3048, hedef: 'cm' },
    yd: { ad: 'Yarda', sembol: 'yd', carpan: 0.9144, hedef: 'm' },
    mil: { ad: 'Mil', sembol: 'mil', carpan: 1609.344, hedef: 'km' },
    dmil: { ad: 'Deniz mili', sembol: 'deniz mili', carpan: 1852, hedef: 'km' },
  },
  alan: {
    mm2: { ad: 'Milimetrekare', sembol: 'mm²', carpan: 1e-6, hedef: 'cm2' },
    cm2: { ad: 'Santimetrekare', sembol: 'cm²', carpan: 1e-4, hedef: 'm2' },
    m2: { ad: 'Metrekare', sembol: 'm²', carpan: 1, hedef: 'donum' },
    ar: { ad: 'Ar', sembol: 'ar', carpan: 100, hedef: 'm2' },
    dekar: { ad: 'Dekar', sembol: 'dekar', carpan: 1000, hedef: 'm2' },
    // 4753 sayılı Kanun (1945) md. 5: 1 dönüm = 1000 m²
    donum: { ad: 'Dönüm', sembol: 'dönüm', carpan: 1000, hedef: 'm2' },
    ha: { ad: 'Hektar', sembol: 'ha', carpan: 1e4, hedef: 'donum' },
    km2: { ad: 'Kilometrekare', sembol: 'km²', carpan: 1e6, hedef: 'ha' },
    ft2: { ad: 'Fit kare', sembol: 'ft²', carpan: 0.09290304, hedef: 'm2' },
    // Uluslararası akre = 43.560 ft² = 4046,8564224 m²
    acre: { ad: 'Akre (acre)', sembol: 'acre', carpan: 4046.8564224, hedef: 'donum' },
  },
  agirlik: {
    mg: { ad: 'Miligram', sembol: 'mg', carpan: 1e-6, hedef: 'g' },
    g: { ad: 'Gram', sembol: 'g', carpan: 0.001, hedef: 'ons' },
    kg: { ad: 'Kilogram', sembol: 'kg', carpan: 1, hedef: 'lb' },
    ton: { ad: 'Ton', sembol: 't', carpan: 1000, hedef: 'kg' },
    // ons (avoirdupois) = lb ÷ 16; stone = 14 lb
    ons: { ad: 'Ons (avoirdupois)', sembol: 'oz', carpan: 0.028349523125, hedef: 'g' },
    lb: { ad: 'Libre (pound)', sembol: 'lb', carpan: 0.45359237, hedef: 'kg' },
    st: { ad: 'Stone', sembol: 'st', carpan: 6.35029318, hedef: 'kg' },
    // troy ons = 480 grain × 0,06479891 g
    ozt: { ad: 'Troy ons (altın)', sembol: 'ozt', carpan: 0.0311034768, hedef: 'g' },
    ct: { ad: 'Karat (değerli taş)', sembol: 'ct', carpan: 0.0002, hedef: 'g' },
  },
  sicaklik: {
    C: { ad: 'Celsius', sembol: '°C', carpan: 1, ofset: 273.15, hedef: 'F' },
    F: { ad: 'Fahrenheit', sembol: '°F', carpan: 5 / 9, ofset: 459.67, hedef: 'C' },
    K: { ad: 'Kelvin', sembol: 'K', carpan: 1, hedef: 'C' },
    R: { ad: 'Rankine', sembol: '°R', carpan: 5 / 9, hedef: 'F' },
  },
  // Temel birim bayt. SI: 1 kB = 1000 B (BIPM); IEC 60027-2: 1 KiB = 1024 B
  veri: {
    bit: { ad: 'Bit', sembol: 'bit', carpan: 0.125, hedef: 'B' },
    B: { ad: 'Bayt', sembol: 'B', carpan: 1, hedef: 'bit' },
    kB: { ad: 'Kilobayt', sembol: 'kB', carpan: 1e3, hedef: 'B', grup: 'si' },
    MB: { ad: 'Megabayt', sembol: 'MB', carpan: 1e6, hedef: 'kB', grup: 'si' },
    GB: { ad: 'Gigabayt', sembol: 'GB', carpan: 1e9, hedef: 'MB', grup: 'si' },
    TB: { ad: 'Terabayt', sembol: 'TB', carpan: 1e12, hedef: 'GB', grup: 'si' },
    PB: { ad: 'Petabayt', sembol: 'PB', carpan: 1e15, hedef: 'TB', grup: 'si' },
    KiB: { ad: 'Kibibayt', sembol: 'KiB', carpan: KI, hedef: 'B', grup: 'iec' },
    MiB: { ad: 'Mebibayt', sembol: 'MiB', carpan: KI ** 2, hedef: 'KiB', grup: 'iec' },
    GiB: { ad: 'Gibibayt', sembol: 'GiB', carpan: KI ** 3, hedef: 'MiB', grup: 'iec' },
    TiB: { ad: 'Tebibayt', sembol: 'TiB', carpan: KI ** 4, hedef: 'GiB', grup: 'iec' },
    PiB: { ad: 'Pebibayt', sembol: 'PiB', carpan: KI ** 5, hedef: 'TiB', grup: 'iec' },
  },
};

/**
 * Osmanlı (şer'î) dönümü: 1600 mimar arşını kare ≈ 919,3 m² (TDV İslâm Ansiklopedisi, "Dönüm"; kaynaklarda 916,8–919,302).
 * Yalnız eski tapu kayıtlarını yorumlamak için yaklaşık karşılık; çevirici 1945 tarihli 4753 s. Kanun'daki 1000 m²'yi kullanır.
 */
export const ESKI_DONUM_M2 = 919.302;

/**
 * Kayan nokta gürültüsünü (0,30000000000000004) 14 anlamlı haneye yuvarlayarak temizler.
 * 14 hane: 2⁴⁰ = 1.099.511.627.776 gibi 13 haneli tam sayılar bozulmaz.
 */
export const temizle = (n: number) => (n === 0 ? 0 : Number(n.toPrecision(14)));

const temele = (b: Birim, x: number) => (x + (b.ofset ?? 0)) * b.carpan;
const temelden = (b: Birim, t: number) => t / b.carpan - (b.ofset ?? 0);

export function cevir(boyut: Boyut, deger: number, kaynak: string, hedef: string): number {
  const t = BIRIMLER[boyut];
  return temizle(temelden(t[hedef], temele(t[kaynak], deger)));
}

export interface Karsilik extends Birim {
  id: string;
  deger: number;
}

/** Değerin boyuttaki TÜM birimlerdeki karşılığı (tablo sırasıyla). */
export function cevirTumu(boyut: Boyut, deger: number, kaynak: string): Karsilik[] {
  const t = BIRIMLER[boyut];
  const temel = temele(t[kaynak], deger);
  return Object.entries(t).map(([id, b]) => ({ ...b, id, deger: temizle(temelden(b, temel)) }));
}

/** Seçim kutusu seçenekleri: "Santimetre (cm)" */
export const birimSecenekleri = (boyut: Boyut, filtre?: (b: Birim) => boolean) =>
  Object.entries(BIRIMLER[boyut])
    .filter(([, b]) => !filtre || filtre(b))
    .map(([value, b]) => ({ value, label: b.ad === b.sembol ? b.ad : `${b.ad} (${b.sembol})` }));

const birimAlani = (boyut: Boyut) => z.string().refine((id) => id in BIRIMLER[boyut], { message: 'Geçerli bir birim seçin' });

/** Tek değer + kaynak birim şeması. Sıcaklık dışındaki boyutlarda değer negatif olamaz. */
export function birimSchema(boyut: Boyut) {
  if (boyut !== 'sicaklik') return z.object({ deger: zNumber('Değer', { max: 1e15 }), birim: birimAlani(boyut) });
  return z
    .object({ deger: zNumber('Sıcaklık', { min: -1e6, max: 1e9 }), birim: birimAlani(boyut) })
    .refine((v) => temele(BIRIMLER.sicaklik[v.birim], v.deger) >= -1e-9, {
      path: ['deger'],
      message: 'Sıcaklık mutlak sıfırın (0 K = −273,15 °C = −459,67 °F) altında olamaz',
    });
}

export const uzunlukSchema = birimSchema('uzunluk');
export const alanSchema = birimSchema('alan');
export const agirlikSchema = birimSchema('agirlik');
export const sicaklikSchema = birimSchema('sicaklik');

export type BirimInput = z.input<typeof uzunlukSchema>;
export type BirimValues = z.output<typeof uzunlukSchema>;

export const veriSchema = z
  .object({
    mod: z.enum(['boyut', 'indirme']),
    deger: zNumber('Veri boyutu', { max: 1e15 }),
    birim: birimAlani('veri'),
    sistem: z.enum(['si', 'iec']),
    /** İnternet hızı, Mbps (megabit/saniye) */
    hiz: zNumber('İnternet hızı', { max: 1e6 }).optional(),
  })
  .refine((v) => v.mod !== 'indirme' || (v.hiz ?? 0) > 0, { path: ['hiz'], message: 'İnternet hızını girin (Mbps)' });

export type VeriInput = z.input<typeof veriSchema>;
export type VeriValues = z.output<typeof veriSchema>;

/** Veri boyutunda ana sonuç: seçili sistemde (bayt dahil) değeri ≥ 1 olan en büyük birim, kaynak hariç. */
export function veriHedef(deger: number, kaynak: string, sistem: 'si' | 'iec'): string {
  const aday = cevirTumu('veri', deger, kaynak).filter(
    (k) => k.id !== kaynak && k.id !== 'bit' && (!k.grup || k.grup === sistem),
  );
  return [...aday].reverse().find((k) => k.deger >= 1)?.id ?? 'B';
}

/** İndirme süresi (saniye): bit ÷ (Mbps × 10⁶). Ağ protokol payı dahil değildir (ideal süre). */
export function indirmeSuresi(bayt: number, mbps: number): number {
  return (bayt * 8) / (mbps * 1e6);
}

/** Saniye → "1 saat 6 dakika 40 saniye" (en büyük iki birim; 1 saniyenin altı ondalıklı) */
export function sureTR(sn: number): string {
  if (sn < 1) return `${sayiTR(sn, 3)} saniye`;
  let s = Math.round(sn);
  const parcalar: [number, string][] = [];
  for (const [boy, ad] of [
    [86400, 'gün'],
    [3600, 'saat'],
    [60, 'dakika'],
    [1, 'saniye'],
  ] as const) {
    const k = Math.floor(s / boy);
    s -= k * boy;
    if (k) parcalar.push([k, ad]);
  }
  return parcalar
    .slice(0, 2)
    .map(([k, ad]) => `${k.toLocaleString('tr-TR')} ${ad}`)
    .join(' ');
}

/** TV/monitör: inç köşegen → cm köşegen, en-boy oranına göre genişlik × yükseklik (cm). */
export function ekranBoyutu(inc: number, en = 16, boy = 9) {
  const kosegen = inc * 2.54;
  const k = kosegen / Math.hypot(en, boy);
  return { kosegen: temizle(kosegen), genislik: temizle(k * en), yukseklik: temizle(k * boy) };
}

/** Metre → ayak + inç (boy gösterimi: 1,75 m = 5′ 8,9″). İnç 0,1'e yuvarlanır; 12″ olursa ayağa aktarılır. */
export function ayakInc(metre: number): { ayak: number; inc: number } {
  const topInc = Math.round((metre / 0.0254) * 10) / 10;
  const ayak = Math.floor(topInc / 12 + 1e-9);
  return { ayak, inc: temizle(topInc - ayak * 12) };
}

const UST = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const ust = (e: number) =>
  (e < 0 ? '⁻' : '') +
  String(Math.abs(e))
    .split('')
    .map((d) => UST[Number(d)])
    .join('');

/**
 * tr-TR okunur sayı: `anlamli` anlamlı hane (varsayılan 7), binlik ayraç; 10¹⁵ ve üstü ile 10⁻⁶ altı
 * bilimsel gösterimle ("1,234568 × 10⁻⁷"). Tam sayı kısmı hiçbir zaman yuvarlanmaz.
 */
export function sayiTR(n: number, anlamli = 7): string {
  if (n === 0 || !Number.isFinite(n)) return '0';
  const a = Math.abs(n);
  if (a >= 1e15 || a < 1e-6) {
    const [m, e] = n.toExponential(anlamli - 1).split('e');
    return `${new Intl.NumberFormat('tr-TR', { maximumFractionDigits: anlamli - 1 }).format(Number(m))} × 10${ust(Number(e))}`;
  }
  const hane = Math.max(0, anlamli - 1 - Math.floor(Math.log10(a)));
  return new Intl.NumberFormat('tr-TR', { maximumFractionDigits: Math.min(hane, 20) }).format(n);
}

/** "175 cm" — sayı + sembol; sonuç satırlarında 9 anlamlı hane (1 lb = 0,45359237 kg tam görünsün) */
export const degerTR = (k: { deger: number; sembol: string }, anlamli = 9) => `${sayiTR(k.deger, anlamli)} ${k.sembol}`;

/** content.md için markdown tablo metni (vars.ts dosyaları popüler değer tablolarını bununla üretir) */
export const mdTablo = (basliklar: string[], satirlar: string[][]) =>
  [basliklar, basliklar.map(() => '---'), ...satirlar].map((s) => `| ${s.join(' | ')} |`).join('\n');
