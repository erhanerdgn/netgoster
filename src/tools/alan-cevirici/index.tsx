import { CalculatorLayout, type Source } from '@/components/calc/CalculatorLayout';
import { NumberField, SelectField } from '@/components/calc/fields';
import type { ResultRow, ResultView } from '@/components/calc/ResultCard';
import {
  alanSchema,
  birimSecenekleri,
  cevirTumu,
  degerTR,
  ESKI_DONUM_M2,
  sayiTR,
  type BirimInput,
  type BirimValues,
} from '@/calculators/birim';
import content from './content.md';

const defaults: Partial<BirimInput> = { deger: 1, birim: 'donum' };
const example: BirimInput = { deger: 2500, birim: 'm2' };

const sources: Source[] = [
  { label: 'BIPM — SI Broşürü (metre ve türetilmiş birimler)', url: 'https://www.bipm.org/en/publications/si-brochure' },
  {
    label: 'NIST SP 811, Ek B.8 — Dönüşüm katsayıları (fit kare, akre)',
    url: 'https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b8',
  },
  { label: 'TDV İslâm Ansiklopedisi — "Dönüm" maddesi', url: 'https://islamansiklopedisi.org.tr/donum' },
];

function present(v: BirimValues): ResultView {
  const r = cevirTumu('alan', v.deger, v.birim);
  const kaynak = r.find((k) => k.id === v.birim)!;
  const ana = r.find((k) => k.id === kaynak.hedef)!;
  const m2 = r.find((k) => k.id === 'm2')!.deger;
  const rows: ResultRow[] = r
    .filter((k) => k.id !== v.birim)
    .map((k) => ({
      label: k.id === 'donum' ? 'Dönüm (1000 m²)' : k.ad,
      value: degerTR(k),
      tone: k.id === ana.id ? 'total' : undefined,
    }));
  rows.push({
    label: 'Eski (Osmanlı) dönüm, ≈ 919,3 m²',
    value: `≈ ${sayiTR(m2 / ESKI_DONUM_M2, 4)} eski dönüm`,
    tone: 'muted',
    hint: 'Yalnız 1945 öncesi tapu kayıtlarını yorumlamak için yaklaşık değer; bugün resmî dönüm 1000 m²’dir.',
  });
  return {
    main: { label: `${degerTR(kaynak)} kaç ${ana.sembol}?`, value: degerTR(ana) },
    rows,
    notes: ['Dönüm = dekar = 1000 m² (4753 sayılı Kanun, 1945). 1 hektar = 10 dönüm, 1 ar = 100 m².'],
  };
}

export default function AlanCeviriciPage() {
  return (
    <CalculatorLayout
      slug="alan-cevirici"
      schema={alanSchema}
      defaults={defaults}
      example={example}
      compute={present}
      content={content}
      sources={sources}
      emptyHint="Alanı ve birimini girdiğiniz anda m², dönüm, dekar, hektar ve diğer tüm karşılıklar görünür."
    >
      <NumberField<BirimInput>
        name="deger"
        label="Alan"
        decimals={6}
        placeholder="Örn. 2.500"
        help="Çevirmek istediğiniz alan. Tapudaki yüzölçümü genellikle m² cinsindendir."
      />
      <SelectField<BirimInput>
        name="birim"
        label="Birim"
        options={birimSecenekleri('alan')}
        help="Dönüm ve dekar aynı birimdir (1000 m²). Hektar 10.000 m², ar 100 m²’dir."
      />
    </CalculatorLayout>
  );
}
