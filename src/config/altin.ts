/**
 * Altın türleri: brüt ağırlık (gram) ve milyem (saflık, 1 = has/saf altın).
 * - Ağırlıklar: Darphane ve Damga Matbaası Genel Müdürlüğü, "Sorularla Cumhuriyet Altını" (30.07.2026) —
 *   https://ms.hmb.gov.tr/uploads/sites/7/2026/08/Sorularla_Cumhuriyet_Altini-c412193a82fc0317.pdf
 *   Ziynet (kuyumcudaki çeyrek/yarım/tam): 1,754 / 3,508 / 7,016 g; sikke birlik (Ata lira / Cumhuriyet): 7,216 g.
 *   Tüm Cumhuriyet altınları 22 ayardır.
 * - Milyemler: Hazine Müsteşarlığı tebliği, RG 20.06.2007/26558 md. 12 — 22 ayar 0,916; 18 ayar 0,750; 14 ayar 0,583
 *   (piyasadaki "585" damgası yerine resmi 0,583 kullanılır). 24 ayar gram/külçe altın: 0,995 (Darphane 995/1000).
 * Canlı veri (/api/altin → gram24) HAS (1000/1000) gram değeridir; her tür bu değerle çarpılır.
 */
import type { Series } from './period.ts';

export type AltinTuru = 'gram24' | 'ayar22' | 'ayar18' | 'ayar14' | 'ceyrek' | 'yarim' | 'tam' | 'cumhuriyet';

export interface AltinTanim {
  label: string;
  /** Adet başına brüt gram; gram ile ölçülen türlerde 1 */
  gram: number;
  milyem: number;
  /** true: miktar adet; false: miktar gram */
  adet: boolean;
}

export const altinTurleri: Series<Record<AltinTuru, AltinTanim>> = [
  {
    from: '2007-06-20',
    value: {
      gram24: { label: 'Gram altın (24 ayar, 995)', gram: 1, milyem: 0.995, adet: false },
      ayar22: { label: '22 ayar altın (gram)', gram: 1, milyem: 0.916, adet: false },
      ayar18: { label: '18 ayar altın (gram)', gram: 1, milyem: 0.75, adet: false },
      ayar14: { label: '14 ayar altın (gram)', gram: 1, milyem: 0.583, adet: false },
      ceyrek: { label: 'Çeyrek altın (ziynet)', gram: 1.754, milyem: 0.916, adet: true },
      yarim: { label: 'Yarım altın (ziynet)', gram: 3.508, milyem: 0.916, adet: true },
      tam: { label: 'Tam altın (ziynet)', gram: 7.016, milyem: 0.916, adet: true },
      cumhuriyet: { label: 'Cumhuriyet / Ata lira (7,216 g)', gram: 7.216, milyem: 0.916, adet: true },
    },
    source:
      'Darphane "Sorularla Cumhuriyet Altını" (30.07.2026) https://ms.hmb.gov.tr/uploads/sites/7/2026/08/Sorularla_Cumhuriyet_Altini-c412193a82fc0317.pdf ; milyemler: RG 20.06.2007/26558 md. 12',
  },
];
