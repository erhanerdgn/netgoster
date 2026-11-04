import { z } from 'zod';
import { mtvElektrik, mtvMotosiklet, mtvOtomobil, mtvOtomobilEski, mtvTarifeII } from '../config/parameters-2026.ts';
import { todayISO, valueAt } from '../config/period.ts';
import { round2, zMoney, zNumber } from './common.ts';

export const MTV_TIPLERI = ['oto', 'otoEski', 'elektrik', 'motosiklet', 'tarifeII'] as const;
export type MtvTipi = (typeof MTV_TIPLERI)[number];

const optNum = (s: z.ZodNumber) => s.optional();

export const mtvSchema = z
  .object({
    tip: z.enum(MTV_TIPLERI, { error: 'Araç tipini seçin' }),
    cc: optNum(zNumber('Motor silindir hacmi', { min: 1, max: 20000, int: true })),
    kw: optNum(zNumber('Motor gücü', { min: 1, max: 2000 })),
    deger: optNum(zMoney('Taşıt değeri', { min: 1 })),
    /** Taşıt değeri dilimi: değere göre otomatik (bu yıl tescil) veya ilk tescil yılındaki dilim elle */
    dilim: z.enum(['auto', '1', '2', '3']).default('auto'),
    modelYili: zNumber('Model yılı', { min: 1950, max: 2100, int: true }),
    sinif: z.string().optional(),
  })
  .superRefine((v, ctx) => {
    const need = (path: 'cc' | 'kw' | 'deger' | 'sinif', message: string) => {
      if (v[path] === undefined || v[path] === '') ctx.addIssue({ code: 'custom', path: [path], message });
    };
    if (v.tip === 'oto' || v.tip === 'otoEski' || v.tip === 'motosiklet') need('cc', 'Motor silindir hacmini girin');
    if (v.tip === 'elektrik') need('kw', 'Motor gücünü (kW) girin');
    if ((v.tip === 'oto' || v.tip === 'elektrik') && v.dilim === 'auto') need('deger', 'Taşıt değerini girin');
    if (v.tip === 'tarifeII') need('sinif', 'Araç sınıfını seçin');
  });

export type MtvInput = z.input<typeof mtvSchema>;
export type MtvValues = z.output<typeof mtvSchema>;

export interface MtvTablo {
  yasKolonlari: string[];
  satirlar: { etiket: string; tutar: number[] }[];
  secili: number;
}

export interface MtvResult {
  yil: number;
  yas: number;
  /** Yaş grubu sütunu (0 tabanlı) */
  yasGrubu: number;
  muaf: boolean;
  /** Elektrikli: kW'ın eşdeğer silindir hacmi üst sınırı */
  esdegerCc?: number;
  /** Seçilen satırın tarife tutarı (elektrikte %25 uygulanmadan önce) */
  tarifeTutari: number;
  yillik: number;
  taksit1: number;
  taksit2: number;
  tablo: MtvTablo;
}

const YAS5 = ['1–3 yaş', '4–6 yaş', '7–11 yaş', '12–15 yaş', '16 ve üzeri'];
const YAS3 = ['1–6 yaş', '7–15 yaş', '16 ve üzeri'];
const n0 = (n: number) => new Intl.NumberFormat('tr-TR').format(n);

/** Satır etiketi için aralık: önceki üst sınır + 1 – üst sınır */
function aralik(alt: number, ust: number, birim: string) {
  if (!Number.isFinite(ust)) return `${n0(alt)} ${birim} üzeri`;
  return alt <= 1 ? `${n0(ust)} ${birim} ve altı` : `${n0(alt)}–${n0(ust)} ${birim}`;
}

/**
 * Motorlu taşıtlar vergisi (197 s. K.), yıllık tutar ve Ocak/Temmuz eşit taksitleri.
 * - Yaş: içinde bulunulan takvim yılı − model yılı + 1 (model yılında 1 yaş; md. 11/son, tanımlar).
 * - (I) tarife (01.01.2018 ve sonrası tescilli otomobil): silindir hacmi + taşıt değeri dilimi + yaş. Dilim ilk
 *   kayıt-tescil tarihindeki taşıt değerine (KDV matrahı: ÖTV dahil, KDV hariç) ve o yılın sınırlarına göre
 *   belirlenir; sonraki yıllarda aynı sıradaki güncel tutar uygulanır.
 * - Elektrikli otomobil: motor gücü (kW) eşdeğer silindir satırına çevrilir, tutarın %25'i (md. 5).
 * - Motosiklet 100 cm³ altı vergi dışı; (II) tarife yaş grupları 1–6, 7–15, 16+.
 */
export function calculateMtv(input: MtvValues, today: string = todayISO()): MtvResult {
  const yil = Number(today.slice(0, 4));
  const yas = Math.max(1, yil - input.modelYili + 1);
  const g5 = yas <= 3 ? 0 : yas <= 6 ? 1 : yas <= 11 ? 2 : yas <= 15 ? 3 : 4;
  const g3 = yas <= 6 ? 0 : yas <= 15 ? 1 : 2;

  let tablo: MtvTablo;
  let tarifeTutari: number;
  let carpan = 1;
  let muaf = false;
  let esdegerCc: number | undefined;
  let yasGrubu = g5;

  if (input.tip === 'oto' || input.tip === 'elektrik') {
    const rows = valueAt(mtvOtomobil, today);
    const elektrik = input.tip === 'elektrik';
    if (elektrik) {
      esdegerCc = mtvElektrik.kwEsdeger.find(([kw]) => input.kw! <= kw)![1];
      carpan = mtvElektrik.oran;
    }
    const cc = esdegerCc ?? input.cc!;
    const grupCc = rows.find((r) => cc <= r.maxCc)!.maxCc;
    const grup = rows.map((r, i) => ({ r, i })).filter((x) => x.r.maxCc === grupCc);
    const secim =
      input.dilim === 'auto'
        ? grup.find((x) => input.deger! <= x.r.maxDeger)!
        : grup[Math.min(Number(input.dilim), grup.length) - 1];
    tarifeTutari = secim.r.tutar[g5];
    // Etiketler: elektrikte kW aralığı, diğerlerinde cm³ aralığı + değer dilimi
    const ccListe = [...new Set(rows.map((r) => r.maxCc))];
    const ccEtiket = (maxCc: number) => {
      const k = ccListe.indexOf(maxCc);
      if (elektrik) {
        const kwUst = mtvElektrik.kwEsdeger.find(([, c]) => c === maxCc)![0];
        const kwAlt = k === 0 ? 0 : mtvElektrik.kwEsdeger[k - 1][0] + 1;
        return aralik(kwAlt, kwUst, 'kW');
      }
      return aralik(k === 0 ? 0 : ccListe[k - 1] + 1, maxCc, 'cm³');
    };
    tablo = {
      yasKolonlari: YAS5,
      secili: secim.i,
      satirlar: rows.map((r, i) => {
        const once = i > 0 && rows[i - 1].maxCc === r.maxCc ? rows[i - 1].maxDeger : 0;
        const deger = Number.isFinite(r.maxDeger)
          ? once
            ? `${n0(once)}–${n0(r.maxDeger)} TL`
            : `${n0(r.maxDeger)} TL’ye kadar`
          : once
            ? `${n0(once)} TL üzeri`
            : 'tüm değerler';
        return { etiket: `${ccEtiket(r.maxCc)} · ${deger}`, tutar: r.tutar.map((t) => round2(t * carpan)) };
      }),
    };
  } else if (input.tip === 'otoEski') {
    const rows = valueAt(mtvOtomobilEski, today);
    const secili = rows.findIndex((r) => input.cc! <= r.maxCc);
    tarifeTutari = rows[secili].tutar[g5];
    tablo = {
      yasKolonlari: YAS5,
      secili,
      satirlar: rows.map((r, i) => ({ etiket: aralik(i === 0 ? 0 : rows[i - 1].maxCc + 1, r.maxCc, 'cm³'), tutar: r.tutar })),
    };
  } else if (input.tip === 'motosiklet') {
    const rows = valueAt(mtvMotosiklet, today);
    const secili = rows.findIndex((r) => input.cc! >= r.minCc && input.cc! <= r.maxCc);
    muaf = input.cc! < rows[0].minCc;
    tarifeTutari = muaf ? 0 : rows[secili].tutar[g5];
    tablo = {
      yasKolonlari: YAS5,
      secili,
      satirlar: rows.map((r) => ({ etiket: aralik(r.minCc, r.maxCc, 'cm³'), tutar: r.tutar })),
    };
  } else {
    const rows = valueAt(mtvTarifeII, today);
    const secili = rows.findIndex((r) => r.id === input.sinif);
    if (secili === -1) throw new Error('Bilinmeyen araç sınıfı');
    yasGrubu = g3;
    tarifeTutari = rows[secili].tutar[g3];
    tablo = { yasKolonlari: YAS3, secili, satirlar: rows.map((r) => ({ etiket: r.label, tutar: r.tutar })) };
  }

  const yillik = round2(tarifeTutari * carpan);
  const taksit1 = round2(yillik / 2);
  return {
    yil,
    yas,
    yasGrubu,
    muaf,
    esdegerCc,
    tarifeTutari,
    yillik,
    taksit1,
    taksit2: round2(yillik - taksit1),
    tablo,
  };
}
