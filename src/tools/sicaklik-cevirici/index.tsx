import { CalculatorLayout, type Source } from '@/components/calc/CalculatorLayout';
import { NumberField, SelectField } from '@/components/calc/fields';
import type { ResultRow, ResultView } from '@/components/calc/ResultCard';
import { birimSecenekleri, cevirTumu, degerTR, sicaklikSchema, type BirimInput, type BirimValues } from '@/calculators/birim';
import content from './content.md';

const defaults: Partial<BirimInput> = { deger: 37, birim: 'C' };
const example: BirimInput = { deger: 350, birim: 'F' };

const sources: Source[] = [
  { label: 'BIPM — SI Broşürü (kelvin ve Celsius sıcaklığı)', url: 'https://www.bipm.org/en/publications/si-brochure' },
  {
    label: 'NIST SP 811, Ek B.8 — Fahrenheit ve Rankine dönüşümleri',
    url: 'https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b8',
  },
];

const FORMUL: Record<string, string> = {
  C: '°F = °C × 1,8 + 32 · K = °C + 273,15',
  F: '°C = (°F − 32) ÷ 1,8',
  K: '°C = K − 273,15',
  R: '°F = °R − 459,67 · K = °R ÷ 1,8',
};

function present(v: BirimValues): ResultView {
  const r = cevirTumu('sicaklik', v.deger, v.birim);
  const kaynak = r.find((k) => k.id === v.birim)!;
  const ana = r.find((k) => k.id === kaynak.hedef)!;
  const rows: ResultRow[] = [
    { label: 'Formül', value: FORMUL[v.birim], tone: 'muted' },
    ...r
      .filter((k) => k.id !== v.birim)
      .map((k): ResultRow => ({ label: k.ad, value: degerTR(k, 7), tone: k.id === ana.id ? 'total' : undefined })),
  ];
  return {
    main: { label: `${degerTR(kaynak, 7)} kaç ${ana.sembol}?`, value: degerTR(ana, 7) },
    rows,
    notes: ['Sıcaklık farkı çevrilirken +32 eklenmez: 10 °C’lik artış 18 °F’lik artıştır (yalnız × 1,8).'],
  };
}

export default function SicaklikCeviriciPage() {
  return (
    <CalculatorLayout
      slug="sicaklik-cevirici"
      schema={sicaklikSchema}
      defaults={defaults}
      example={example}
      compute={present}
      content={content}
      sources={sources}
      emptyHint="Sıcaklığı ve ölçeğini girdiğiniz anda Celsius, Fahrenheit, Kelvin ve Rankine karşılıkları görünür."
    >
      <NumberField<BirimInput>
        name="deger"
        label="Sıcaklık"
        decimals={4}
        allowNegative
        placeholder="Örn. 180"
        help="Çevirmek istediğiniz sıcaklık. Eksi değer girebilirsiniz (−18 °C dondurucu gibi); mutlak sıfırın altı geçersizdir."
      />
      <SelectField<BirimInput>
        name="birim"
        label="Ölçek"
        options={birimSecenekleri('sicaklik')}
        help="Türkiye’de Celsius (°C), ABD’de Fahrenheit (°F) kullanılır. Kelvin bilimsel, Rankine mühendislik ölçeğidir."
      />
    </CalculatorLayout>
  );
}
