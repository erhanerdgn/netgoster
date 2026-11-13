import { CalculatorLayout, type Source } from '@/components/calc/CalculatorLayout';
import { NumberField, SelectField } from '@/components/calc/fields';
import type { ResultRow, ResultView } from '@/components/calc/ResultCard';
import { agirlikSchema, birimSecenekleri, cevirTumu, degerTR, type BirimInput, type BirimValues } from '@/calculators/birim';
import content from './content.md';

const defaults: Partial<BirimInput> = { deger: 1, birim: 'lb' };
const example: BirimInput = { deger: 1, birim: 'ozt' };

const sources: Source[] = [
  { label: 'BIPM — SI Broşürü (kilogramın tanımı)', url: 'https://www.bipm.org/en/publications/si-brochure' },
  {
    label: 'NIST SP 811, Ek B.8 — Dönüşüm katsayıları (ons, troy ons, karat)',
    url: 'https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b8',
  },
  {
    label: 'Federal Register (1959) — Refinement of Values for the Yard and the Pound',
    url: 'https://www.ngs.noaa.gov/PUBS_LIB/FedRegister/FRdoc59-5442.pdf',
  },
];

function present(v: BirimValues): ResultView {
  const r = cevirTumu('agirlik', v.deger, v.birim);
  const kaynak = r.find((k) => k.id === v.birim)!;
  const ana = r.find((k) => k.id === kaynak.hedef)!;
  const rows: ResultRow[] = r
    .filter((k) => k.id !== v.birim)
    .map((k) => ({ label: k.ad, value: degerTR(k), tone: k.id === ana.id ? 'total' : undefined }));
  const notes =
    v.birim === 'ons' || v.birim === 'ozt'
      ? ['Altın ve gümüş fiyatlarındaki "ons" troy onstur (31,10 g); mutfak ve posta tartısındaki ons ise 28,35 g’dır.']
      : ['Libre (pound) 1959 uluslararası anlaşmasıyla tam olarak 0,45359237 kg’dır.'];
  return {
    main: { label: `${degerTR(kaynak)} kaç ${ana.sembol}?`, value: degerTR(ana) },
    rows,
    notes,
  };
}

export default function AgirlikCeviriciPage() {
  return (
    <CalculatorLayout
      slug="agirlik-cevirici"
      schema={agirlikSchema}
      defaults={defaults}
      example={example}
      compute={present}
      content={content}
      sources={sources}
      emptyHint="Değeri ve birimini girdiğiniz anda kg, g, pound, ons, troy ons ve karat karşılıkları görünür."
    >
      <NumberField<BirimInput>
        name="deger"
        label="Ağırlık"
        decimals={6}
        placeholder="Örn. 150"
        help="Çevirmek istediğiniz ağırlık (kütle). Ondalık için virgül kullanın: 2,5."
      />
      <SelectField<BirimInput>
        name="birim"
        label="Birim"
        options={birimSecenekleri('agirlik')}
        help="Ons (oz) mutfak/posta onsudur. Altın ve gümüş için troy ons, pırlanta ve değerli taş için karat seçin."
      />
    </CalculatorLayout>
  );
}
