import { z } from 'zod';
import { MALZEMELER, OLCULER, type Malzeme, type MalzemeKodu, type OlcuKodu } from '../config/mutfak.ts';
import { zNumber } from './common.ts';

export const OLCU_KODLARI = Object.keys(OLCULER) as OlcuKodu[];
export const MALZEME_KODLARI = Object.keys(MALZEMELER) as MalzemeKodu[];
export type Birim = OlcuKodu | 'g' | 'kg';
const AGIRLIK = { g: 1, kg: 1000 } as const;
const BIRIMLER: Birim[] = [...OLCU_KODLARI, 'g', 'kg'];

export const mutfakOlculeriSchema = z.object({
  miktar: zNumber('Miktar', { min: 0.01, max: 1e6 }),
  birim: z.enum(BIRIMLER),
  malzeme: z.enum(MALZEME_KODLARI),
});

export type MutfakOlculeriInput = z.input<typeof mutfakOlculeriSchema>;
export type MutfakOlculeriValues = z.output<typeof mutfakOlculeriSchema>;

export interface MutfakOlculeriResult {
  gram: number;
  ml: number;
  /** Girdi ağırlık (g/kg) mı? Öyleyse ana sonuç bileşik ölçüdür. */
  agirlik: boolean;
  malzeme: Malzeme;
  /** Her hacim ölçüsünde karşılık ve o ölçünün 1 adedinin gram ağırlığı */
  karsiliklar: { kod: OlcuKodu; ad: string; miktar: number; birGram: number }[];
  bilesik: string;
}

const sayi = (n: number) => new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 1 }).format(n);

/**
 * Hacmi mutfakta okunur bileşik ölçüye çevirir: yarım su bardağı adımları + yemek kaşığı + çay kaşığı.
 * Kalan, en yakın çay kaşığına (5 ml) yuvarlanır; hata en fazla 2,5 ml. 3 çay kaşığı 1 yemek kaşığına,
 * 100 ml'ye ulaşan kaşıklar yarım su bardağına toplanır. Çok küçük miktarlarda yarım çay kaşığı kullanılır.
 */
export function bilesikOlcu(mlGirdi: number): string {
  const ml = Math.round(mlGirdi * 1e6) / 1e6;
  let yarim = Math.floor(ml / 100);
  let kalan = ml - yarim * 100;
  let yk = Math.floor(kalan / 15);
  kalan -= yk * 15;
  let ck = Math.round(kalan / 5);
  if (ck === 3) {
    yk += 1;
    ck = 0;
  }
  if (yk * 15 + ck * 5 >= 100) {
    yarim += 1;
    yk = 0;
    ck = 0;
  }
  const parca: string[] = [];
  if (yarim === 1) parca.push('yarım su bardağı');
  else if (yarim > 1) parca.push(`${sayi(yarim / 2)} su bardağı`);
  if (yk) parca.push(`${yk} yemek kaşığı`);
  if (ck) parca.push(`${ck} çay kaşığı`);
  if (parca.length) return parca.join(' + ');
  // 2,5 ml'nin altı: yarım çay kaşığı adımı
  return Math.round(kalan / 2.5) >= 1 ? 'yarım çay kaşığı' : 'yarım çay kaşığından az';
}

/** gram = hacim (ml) × yoğunluk (g/ml); ağırlık girildiyse hacim = gram ÷ yoğunluk */
export function calculateMutfakOlculeri(v: MutfakOlculeriValues): MutfakOlculeriResult {
  const malzeme: Malzeme = MALZEMELER[v.malzeme];
  const agirlik = v.birim === 'g' || v.birim === 'kg';
  const ml = agirlik ? (v.miktar * AGIRLIK[v.birim as 'g' | 'kg']) / malzeme.gml : v.miktar * OLCULER[v.birim as OlcuKodu].ml;
  const gram = agirlik ? v.miktar * AGIRLIK[v.birim as 'g' | 'kg'] : ml * malzeme.gml;
  return {
    gram,
    ml,
    agirlik,
    malzeme,
    karsiliklar: OLCU_KODLARI.map((kod) => ({
      kod,
      ad: OLCULER[kod].ad,
      miktar: ml / OLCULER[kod].ml,
      birGram: OLCULER[kod].ml * malzeme.gml,
    })),
    bilesik: bilesikOlcu(ml),
  };
}
