/**
 * Türkiye resmi tatilleri — 2429 sayılı Ulusal Bayram ve Genel Tatiller Hakkında Kanun
 * (https://www.mevzuat.gov.tr/mevzuatmetin/1.5.2429.pdf). İdari izin (köprü) kararları resmi tatil değildir; dahil edilmez.
 * - Sabit tarihli tatiller kuraldan üretilir (her yıl aynı gün).
 * - Dini bayramlar (Ramazan 3 gün, Kurban 4 gün; arifeleri yarım gün) hicri takvime bağlı olduğundan liste halindedir.
 *   Yeni yıl eklemek için DINI_BAYRAMLAR'a bir satır eklemek yeterlidir.
 * "Yarım gün" = 13.00'ten sonrası tatil (arifeler ve 28 Ekim).
 * Not: Yalnız göreli `.ts` import — dosya Node ile de yüklenir.
 */
import { addDays } from '../calculators/common.ts';

export interface Tatil {
  date: string;
  name: string;
  /** true: yalnız öğleden sonra tatil (arife / 28 Ekim) */
  half: boolean;
}

/** [AA-GG, ad, yarım gün?, yürürlük yılı] — 1 Mayıs 5892 s. K. (2009), 15 Temmuz 6752 s. K. (2016, ilk 2017) ile eklendi. */
const SABIT: [string, string, boolean, number][] = [
  ['01-01', 'Yılbaşı', false, 0],
  ['04-23', 'Ulusal Egemenlik ve Çocuk Bayramı', false, 0],
  ['05-01', 'Emek ve Dayanışma Günü', false, 2009],
  ['05-19', 'Atatürk’ü Anma, Gençlik ve Spor Bayramı', false, 0],
  ['07-15', 'Demokrasi ve Millî Birlik Günü', false, 2017],
  ['08-30', 'Zafer Bayramı', false, 0],
  ['10-28', 'Cumhuriyet Bayramı arifesi', true, 0],
  ['10-29', 'Cumhuriyet Bayramı', false, 0],
];

/**
 * Bayramların 1. günü. Arife = bir önceki gün (yarım gün).
 * Kaynak: Diyanet İşleri Başkanlığı Dini Günler takvimi (vakithesaplama.diyanet.gov.tr), 04.11.2026'da kontrol edildi.
 */
const DINI_BAYRAMLAR: Record<number, { ramazan: string; kurban: string; source: string }> = {
  // Ramazan: arife 09.04, bayram 10–12.04 · Kurban: arife 15.06, bayram 16–19.06
  2024: { ramazan: '2024-04-10', kurban: '2024-06-16', source: 'https://vakithesaplama.diyanet.gov.tr/dinigunler.php?yil=2024' },
  // Ramazan: arife 29.03, bayram 30.03–01.04 · Kurban: arife 05.06, bayram 06–09.06
  2025: { ramazan: '2025-03-30', kurban: '2025-06-06', source: 'https://vakithesaplama.diyanet.gov.tr/dinigunler.php?yil=2025' },
  // Ramazan: arife 19.03, bayram 20–22.03 · Kurban: arife 26.05, bayram 27–30.05
  2026: { ramazan: '2026-03-20', kurban: '2026-05-27', source: 'https://vakithesaplama.diyanet.gov.tr/dinigunler.php?yil=2026' },
  // Ramazan: arife 08.03, bayram 09–11.03 · Kurban: arife 15.05, bayram 16–19.05
  // Ayrıca Diyanet 2027 resmi tatiller listesi: https://vakithesaplama.diyanet.gov.tr/icerik.php?icerik=159
  2027: { ramazan: '2027-03-09', kurban: '2027-05-16', source: 'https://vakithesaplama.diyanet.gov.tr/icerik.php?icerik=154' },
};

/** Dini bayram verisi bulunan yıllar (bunların dışında yalnız sabit tatiller hesaba katılır) */
export const TATIL_YILLARI = Object.keys(DINI_BAYRAMLAR).map(Number);

export function tatillerYil(year: number): Tatil[] {
  const out: Tatil[] = SABIT.filter(([, , , from]) => year >= from).map(([md, name, half]) => ({
    date: `${year}-${md}`,
    name,
    half,
  }));
  const d = DINI_BAYRAMLAR[year];
  if (d) {
    const bayram = (first: string, name: string, days: number) => {
      out.push({ date: addDays(first, -1), name: `${name} arifesi`, half: true });
      for (let i = 0; i < days; i++) out.push({ date: addDays(first, i), name: `${name} ${i + 1}. gün`, half: false });
    };
    bayram(d.ramazan, 'Ramazan Bayramı', 3);
    bayram(d.kurban, 'Kurban Bayramı', 4);
  }
  return out.sort((a, b) => a.date.localeCompare(b.date));
}

const cache = new Map<number, Map<string, Tatil>>();

/** Verilen gün resmi tatilse kaydı döndürür. Aynı güne iki tatil denk gelirse adlar birleşir; biri tam günse tam gün sayılır. */
export function tatilAt(iso: string): Tatil | undefined {
  const year = Number(iso.slice(0, 4));
  let m = cache.get(year);
  if (!m) {
    m = new Map();
    for (const t of tatillerYil(year)) {
      const prev = m.get(t.date);
      m.set(t.date, prev ? { date: t.date, name: `${prev.name} + ${t.name}`, half: prev.half && t.half } : t);
    }
    cache.set(year, m);
  }
  return m.get(iso);
}
