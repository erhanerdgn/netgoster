import { contentVars, pct } from '@/content/vars';
import { fonStopaj } from '@/config/parameters-2026';
import { todayISO, valueAt } from '@/config/period';

export interface ToolKpi {
  value: string;
  caption: string;
}

/** "33.030,00 TL" → "33.030 ₺", "73.729,87 TL" → "73.729,87 ₺" (kart başlığında kısa görünüm) */
const kisa = (s: string) => s.replace(/,00 TL$/, ' TL').replace(/ TL$/, ' ₺');

/**
 * Araç kartlarında büyük gösterilen güncel kilit rakam. Değerler içerik sayfalarıyla aynı kaynaktan
 * (contentVars → parametre serileri) gelir; parametre güncellenince kart da güncellenir.
 * Eşleşmesi olmayan araç kartında açıklama gösterilir.
 */
export function toolKpis(today = todayISO()): Record<string, ToolKpi> {
  const v = contentVars(today);
  const yil = v.yil;
  return {
    'kidem-tazminati-hesaplama': { value: kisa(v['kidem.tavan']), caption: 'Güncel kıdem tazminatı tavanı' },
    'ihbar-tazminati-hesaplama': { value: '2–8 hafta', caption: 'Kıdeme göre ihbar süresi (İş K. md. 17)' },
    'brutten-nete-maas-hesaplama': { value: kisa(v['asgari.brut']), caption: `${yil} brüt asgari ücret` },
    'netten-brute-maas-hesaplama': { value: kisa(v['asgari.net']), caption: `${yil} net asgari ücret` },
    'asgari-ucret-hesaplama': { value: kisa(v['asgari.net']), caption: `${yil} net asgari ücret` },
    'isveren-maliyeti-hesaplama': { value: v['sgk.isverenToplam'], caption: 'SGK + işsizlik işveren payı' },
    'issizlik-maasi-hesaplama': { value: kisa(v['issizlik.tavan']), caption: 'Aylık brüt ödenek üst sınırı' },
    'bagkur-prim-hesaplama': { value: v['bagkur.oran'], caption: 'Bağkur prim oranı' },
    'kredi-hesaplama': { value: v['kredi.vergiToplam'], caption: 'İhtiyaç kredisinde KKDF + BSMV' },
    'fon-getirisi-hesaplama': {
      value: pct(valueAt(fonStopaj, today).indirimli),
      caption: 'Bugün alınan fon payında stopaj',
    },
    'mevduat-faizi-hesaplama': { value: v['stopaj.alti6'], caption: '6 aya kadar vadede stopaj' },
    'kira-artis-hesaplama': { value: v['tufe.ortalama12'], caption: `${v['tufe.sonAy']} kira artış üst sınırı` },
    'tapu-harci-hesaplama': { value: v['tapu.toplamOran'], caption: 'Alıcı + satıcı tapu harcı' },
    'emlak-vergisi-hesaplama': { value: v['emlak.konut'], caption: 'Konutta emlak vergisi (büyükşehir dışı)' },
  };
}

let cache: Record<string, ToolKpi> | undefined;
/** Sayfa başına bir kez hesaplanır (tüm kartlar aynı değerleri paylaşır). */
export const kpiFor = (slug: string): ToolKpi | undefined => (cache ??= toolKpis())[slug];
