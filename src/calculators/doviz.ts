import { z } from 'zod';
import { round2, zMoney, zNumber } from './common.ts';

/** TCMB günlük kur kaydı (src/worker/rates.ts → Rate ile aynı biçim) */
export interface KurKaydi {
  code: string;
  name?: string;
  /** TCMB birimi: JPY için 100 (kur 100 yen içindir), diğerleri 1 */
  unit: number;
  forexBuying: number | null;
  forexSelling: number | null;
  banknoteBuying: number | null;
  banknoteSelling: number | null;
}

/** TCMB today.xml'deki para birimleri + TRY */
export const paraBirimleri = [
  { code: 'TRY', name: 'Türk lirası' },
  { code: 'USD', name: 'ABD doları' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'İngiliz sterlini' },
  { code: 'CHF', name: 'İsviçre frangı' },
  { code: 'JPY', name: 'Japon yeni' },
  { code: 'SAR', name: 'Suudi Arabistan riyali' },
  { code: 'AED', name: 'BAE dirhemi' },
  { code: 'QAR', name: 'Katar riyali' },
  { code: 'KWD', name: 'Kuveyt dinarı' },
  { code: 'AUD', name: 'Avustralya doları' },
  { code: 'CAD', name: 'Kanada doları' },
  { code: 'DKK', name: 'Danimarka kronu' },
  { code: 'SEK', name: 'İsveç kronu' },
  { code: 'NOK', name: 'Norveç kronu' },
  { code: 'RUB', name: 'Rus rublesi' },
  { code: 'CNY', name: 'Çin yuanı' },
  { code: 'AZN', name: 'Azerbaycan manatı' },
  { code: 'KZT', name: 'Kazakistan tengesi' },
  { code: 'KRW', name: 'Güney Kore wonu' },
  { code: 'PKR', name: 'Pakistan rupisi' },
  { code: 'RON', name: 'Rumen leyi' },
  { code: 'XDR', name: 'Özel Çekme Hakkı (SDR)' },
] as const;

export type KurTuru = 'forexBuying' | 'forexSelling' | 'banknoteBuying' | 'banknoteSelling';

export const kurTurleri: { value: KurTuru; label: string }[] = [
  { value: 'forexBuying', label: 'Döviz alış' },
  { value: 'forexSelling', label: 'Döviz satış' },
  { value: 'banknoteBuying', label: 'Efektif alış' },
  { value: 'banknoteSelling', label: 'Efektif satış' },
];

const zKod = z.string().regex(/^[A-Z]{3}$/, 'Para birimi seçin');

export const dovizSchema = z
  .object({
    tutar: zMoney('Tutar', { min: 0.01 }),
    kaynak: zKod,
    hedef: zKod,
    kurTuru: z.enum(['forexBuying', 'forexSelling', 'banknoteBuying', 'banknoteSelling']),
    /** Canlı kur alınamadığında: 1 kaynak birim = ? hedef birim */
    elleKur: zNumber('Kur', { min: 0.000001, max: 1e9 }).optional(),
  })
  .refine((v) => v.kaynak !== v.hedef, { path: ['hedef'], message: 'Farklı bir para birimi seçin' });

export type DovizInput = z.input<typeof dovizSchema>;

export interface DovizResult {
  sonuc: number;
  /** 1 kaynak = kur hedef */
  kur: number;
  /** 1 hedef = tersKur kaynak */
  tersKur: number;
  kaynakTl: number | null;
  hedefTl: number | null;
  /** Efektif kur yayımlanmadığı için döviz kuruna düşülen para birimleri */
  dovizeDusulen: string[];
  elle: boolean;
}

export class KurYokHatasi extends Error {}

/** Seçilen kur türünde 1 birimin TL karşılığı. Efektif yoksa aynı yönün döviz kuruna düşer. */
export function birimTl(rates: KurKaydi[], code: string, tur: KurTuru): { tl: number; dustu: boolean } {
  if (code === 'TRY') return { tl: 1, dustu: false };
  const r = rates.find((x) => x.code === code);
  if (!r) throw new KurYokHatasi(`${code} için TCMB kuru bulunamadı`);
  let v = r[tur];
  let dustu = false;
  if (v == null && tur.startsWith('banknote')) {
    v = tur === 'banknoteBuying' ? r.forexBuying : r.forexSelling;
    dustu = v != null;
  }
  if (v == null || !(v > 0)) {
    const ad = kurTurleri.find((k) => k.value === tur)!.label.toLocaleLowerCase('tr-TR');
    throw new KurYokHatasi(`TCMB ${code} için ${ad} kuru yayımlamıyor; başka bir kur türü seçin`);
  }
  return { tl: v / (r.unit || 1), dustu };
}

/**
 * Döviz çevirisi (saf): kur listesi parametre olarak alınır.
 * - Birim kuru = TCMB kuru / Unit (JPY: 100 yen).
 * - Çapraz kur TRY üzerinden: sonuç = tutar × birimTl(kaynak) / birimTl(hedef); her iki tarafta aynı kur türü.
 * - `rates` yoksa (veri alınamadı) `elleKur` kullanılır.
 */
export function calculateDoviz(input: z.output<typeof dovizSchema>, rates: KurKaydi[] | null): DovizResult {
  if (!rates) {
    if (input.elleKur === undefined) throw new KurYokHatasi('Kur bilgisi yok; kuru elle girin');
    return {
      sonuc: round2(input.tutar * input.elleKur),
      kur: input.elleKur,
      tersKur: 1 / input.elleKur,
      kaynakTl: null,
      hedefTl: null,
      dovizeDusulen: [],
      elle: true,
    };
  }
  const a = birimTl(rates, input.kaynak, input.kurTuru);
  const b = birimTl(rates, input.hedef, input.kurTuru);
  const kur = a.tl / b.tl;
  return {
    sonuc: round2((input.tutar * a.tl) / b.tl),
    kur,
    tersKur: b.tl / a.tl,
    kaynakTl: input.kaynak === 'TRY' ? null : a.tl,
    hedefTl: input.hedef === 'TRY' ? null : b.tl,
    dovizeDusulen: [a.dustu && input.kaynak, b.dustu && input.hedef].filter((x): x is string => !!x),
    elle: false,
  };
}

/** /api/kurlar yanıtı (src/worker/rates.ts → RatesPayload) */
export interface TcmbKurlari {
  source: 'TCMB';
  /** TCMB bülten tarihi (YYYY-MM-DD) */
  date: string;
  bulletin: string;
  fetchedAt: string;
  stale: boolean;
  rates: KurKaydi[];
}
