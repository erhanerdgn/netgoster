import { z } from 'zod';
import { krediTahsisAzami, krediVergileri } from '../config/parameters-2026.ts';
import { todayISO, valueAt } from '../config/period.ts';
import { round2, zMoney, zNumber } from './common.ts';

export const KREDI_TURLERI = ['ihtiyac', 'tasit', 'konut'] as const;
export type KrediTuru = (typeof KREDI_TURLERI)[number];

/** Kredi tahsis ücreti üst sınırı (oran) — parametre serisinden, bugünün tarihine göre */
export const TAHSIS_UCRETI_AZAMI = valueAt(krediTahsisAzami, todayISO());

export const krediSchema = z.object({
  tur: z.enum(KREDI_TURLERI, { error: 'Kredi türünü seçin' }),
  tutar: zMoney('Kredi tutarı', { min: 1 }),
  /** Aylık akdi (sözleşme) faiz oranı, yüzde */
  faiz: zNumber('Aylık faiz oranı', { max: 20 }),
  vade: zNumber('Vade', { min: 1, max: 360, int: true }),
  /** Tahsis ücreti, ekspertiz, sigorta gibi peşin masraflar (kullanıcı girer) */
  masraf: zMoney('Masraflar').default(0),
});

export type KrediInput = z.input<typeof krediSchema>;
export type KrediValues = z.output<typeof krediSchema>;

export interface KrediTaksit {
  ay: number;
  taksit: number;
  faiz: number;
  kkdf: number;
  bsmv: number;
  anapara: number;
  kalan: number;
}

export interface KrediResult {
  kkdfOran: number;
  bsmvOran: number;
  /** Vergili (brüt) aylık oran — ondalık */
  brutOran: number;
  taksit: number;
  /** Son taksit kuruş farkıyla ilk taksitten ayrılabilir */
  sonTaksit: number;
  toplamOdeme: number;
  toplamFaiz: number;
  toplamKkdf: number;
  toplamBsmv: number;
  /** Faiz + KKDF + BSMV */
  toplamMaliyet: number;
  masraf: number;
  /** Toplam geri ödeme + masraflar */
  toplamMasrafDahil: number;
  /** Vergili aylık oranın yıllık bileşik karşılığı — ondalık */
  efektifYillik: number;
  /** Akdi aylık oran × 12 — ondalık */
  nominalYillik: number;
  plan: KrediTaksit[];
}

/**
 * Eşit taksitli (annüite) tüketici kredisi — Türkiye bankacılık uygulaması:
 * - Vergiler faiz tutarı üzerinden: KKDF ve BSMV (konut kredisinde ikisi de 0).
 * - Taksit, vergili aylık oranla hesaplanır: r = i × (1 + KKDF + BSMV); taksit = P·r(1+r)^n / ((1+r)^n − 1).
 * - Her ay: faiz = kalan × i, KKDF = faiz × kkdf, BSMV = faiz × bsmv, anapara = taksit − faiz − vergiler.
 *   Kuruş yuvarlama artığı son taksitte düzeltilir (kalan = 0).
 */
export function calculateKredi(input: KrediValues, today: string = todayISO()): KrediResult {
  const v = valueAt(krediVergileri, today)[input.tur];
  const i = input.faiz / 100;
  const r = i * (1 + v.kkdf + v.bsmv);
  const n = input.vade;
  const P = input.tutar;
  const taksit = round2(r === 0 ? P / n : (P * r * (1 + r) ** n) / ((1 + r) ** n - 1));

  const plan: KrediTaksit[] = [];
  let kalan = P;
  for (let ay = 1; ay <= n; ay++) {
    const faiz = round2(kalan * i);
    const kkdf = round2(faiz * v.kkdf);
    const bsmv = round2(faiz * v.bsmv);
    const son = ay === n;
    const anapara = son ? round2(kalan) : round2(taksit - faiz - kkdf - bsmv);
    kalan = son ? 0 : round2(kalan - anapara);
    plan.push({ ay, taksit: son ? round2(anapara + faiz + kkdf + bsmv) : taksit, faiz, kkdf, bsmv, anapara, kalan });
  }

  const sum = (k: keyof KrediTaksit) => round2(plan.reduce((s, t) => s + t[k], 0));
  const toplamOdeme = sum('taksit');
  const toplamFaiz = sum('faiz');
  const toplamKkdf = sum('kkdf');
  const toplamBsmv = sum('bsmv');
  const masraf = input.masraf ?? 0;
  return {
    kkdfOran: v.kkdf,
    bsmvOran: v.bsmv,
    brutOran: r,
    taksit,
    sonTaksit: plan[n - 1].taksit,
    toplamOdeme,
    toplamFaiz,
    toplamKkdf,
    toplamBsmv,
    toplamMaliyet: round2(toplamFaiz + toplamKkdf + toplamBsmv),
    masraf,
    toplamMasrafDahil: round2(toplamOdeme + masraf),
    efektifYillik: (1 + r) ** 12 - 1,
    nominalYillik: i * 12,
    plan,
  };
}
