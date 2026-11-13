import { CalculatorLayout, type Source } from '@/components/calc/CalculatorLayout';
import { NumberField, SelectField } from '@/components/calc/fields';
import type { ResultView } from '@/components/calc/ResultCard';
import {
  MALZEME_KODLARI,
  OLCU_KODLARI,
  calculateMutfakOlculeri,
  mutfakOlculeriSchema,
  type MutfakOlculeriInput,
  type MutfakOlculeriValues,
} from '@/calculators/mutfakOlculeri';
import { MALZEMELER, OLCULER } from '@/config/mutfak';
import { num, pct } from '@/lib/format';
import content from './content.md';

const defaults: Partial<MutfakOlculeriInput> = { miktar: 1, birim: 'suBardagi', malzeme: 'un' };
const example: MutfakOlculeriInput = { miktar: 250, birim: 'g', malzeme: 'tozSeker' };

const sources: Source[] = [
  { label: 'USDA FoodData Central (ölçü başına gram ağırlıkları)', url: 'https://fdc.nal.usda.gov/' },
  {
    label: 'King Arthur Baking — malzeme ağırlık çizelgesi',
    url: 'https://www.kingarthurbaking.com/learn/ingredient-weight-chart',
  },
  { label: 'yemek.com — bardak ölçüleri', url: 'https://yemek.com/bardak-olculeri/' },
];

/** Gram: 100 g ve üstü tam sayı, altı 1 ondalık */
const g = (v: number) => `${num(v, v >= 100 ? 0 : 1)} g`;
const kucuk = (s: string) => s.charAt(0).toLocaleLowerCase('tr') + s.slice(1);

const birimSecenekleri = [
  ...OLCU_KODLARI.map((k) => ({
    value: k,
    label: k === 'ml' || k === 'l' || k === 'olcuBardagi' ? OLCULER[k].ad : `${OLCULER[k].ad} (${num(OLCULER[k].ml, 2)} ml)`,
  })),
  { value: 'g', label: 'Gram (g)' },
  { value: 'kg', label: 'Kilogram (kg)' },
];
const malzemeSecenekleri = MALZEME_KODLARI.map((k) => ({ value: k, label: MALZEMELER[k].ad }));

function present(v: MutfakOlculeriValues): ResultView {
  const r = calculateMutfakOlculeri(v);
  const m = r.malzeme;
  const ad = kucuk(m.ad);
  const bardak = r.karsiliklar.find((k) => k.kod === 'suBardagi')!;
  const birGram = (kod: string) => r.karsiliklar.find((k) => k.kod === kod)!.birGram;
  const yaklasik = `yaklaşık; ölçüş biçimine göre ±${pct(m.tolerans, 0)}`;
  const main = r.agirlik
    ? {
        label: `${g(r.gram)} ${ad}`,
        value: r.bilesik,
        caption: `≈ ${num(bardak.miktar, 2)} su bardağı (${num(r.ml, 0)} ml) · ${yaklasik}`,
      }
    : {
        label: `${num(v.miktar, 2)} ${kucuk(OLCULER[v.birim as keyof typeof OLCULER].ad)} ${ad}`,
        value: g(r.gram),
        caption: `${num(r.ml, 1)} ml · ${yaklasik}`,
      };
  return {
    main,
    rows: [
      { label: 'Ağırlık', value: g(r.gram), tone: 'total' },
      { label: 'Hacim', value: `${num(r.ml, 1)} ml` },
      ...(r.agirlik ? [] : [{ label: 'Mutfak ölçüsüyle', value: r.bilesik }]),
      { label: 'Yoğunluk', value: `${num(m.gml, 2)} g/ml`, tone: 'muted' as const, hint: 'gram = ml × yoğunluk' },
      { label: `1 su bardağı ${ad}`, value: g(birGram('suBardagi')) },
      { label: `1 yemek kaşığı ${ad}`, value: g(birGram('yemekKasigi')) },
      { label: `1 çay kaşığı ${ad}`, value: g(birGram('cayKasigi')) },
    ],
    table: {
      caption: `${g(r.gram)} ${ad} — tüm ölçülerde karşılığı`,
      columns: ['Ölçü', 'Karşılığı', '1 ölçü kaç gram'],
      rows: r.karsiliklar.map((k) => [k.ad, num(k.miktar, k.miktar >= 100 ? 0 : 2), g(k.birGram)]),
    },
    notes: [
      'Su bardağı 200 ml, çay bardağı 100 ml, kahve fincanı 70 ml, yemek kaşığı 15 ml, tatlı kaşığı 10 ml, çay kaşığı 5 ml (silme) kabul edilir. Yabancı tariflerdeki “cup” 236,59 ml’dir.',
      ...(m.not ? [m.not] : []),
      ...(m.verified ? [] : ['Bu malzemenin yoğunluğu tek kaynağa ya da tahmine dayanır; sonucu yaklaşık kabul edin.']),
    ],
  };
}

export default function MutfakOlculeriCeviriciPage() {
  return (
    <CalculatorLayout
      slug="mutfak-olculeri-cevirici"
      schema={mutfakOlculeriSchema}
      defaults={defaults}
      example={example}
      compute={present}
      content={content}
      sources={sources}
      emptyHint="Miktarı, ölçüyü ve malzemeyi seçtiğiniz anda gram ve tüm bardak/kaşık karşılıkları görünür."
    >
      <NumberField<MutfakOlculeriInput>
        name="miktar"
        label="Miktar"
        placeholder="Örn. 1"
        help="Çevirmek istediğiniz miktar. Yarım bardak için 0,5; 250 gram için 250 yazıp ölçü olarak gram seçin."
      />
      <SelectField<MutfakOlculeriInput>
        name="birim"
        label="Ölçü"
        options={birimSecenekleri}
        help="Bardak, fincan ya da kaşık seçerseniz grama; gram ya da kilogram seçerseniz kaç su bardağı ve kaşık ettiğine çevrilir."
      />
      <SelectField<MutfakOlculeriInput>
        name="malzeme"
        label="Malzeme"
        className="sm:col-span-2"
        options={malzemeSecenekleri}
        help={`Aynı bardak her malzemede farklı ağırlıktadır: 1 su bardağı su ${g(200 * MALZEMELER.su.gml)} iken un yaklaşık ${g(200 * MALZEMELER.un.gml)}, toz şeker ${g(200 * MALZEMELER.tozSeker.gml)} gelir.`}
        hint="Un için ölçüş biçimini seçin: kaşıkla doldurma, bardağı una daldırma ya da elenmiş."
      />
    </CalculatorLayout>
  );
}
