import { CalculatorLayout, type Source } from '@/components/calc/CalculatorLayout';
import { NumberField, SelectField } from '@/components/calc/fields';
import type { ResultRow, ResultView } from '@/components/calc/ResultCard';
import {
  ayakInc,
  birimSecenekleri,
  cevirTumu,
  degerTR,
  ekranBoyutu,
  sayiTR,
  uzunlukSchema,
  type BirimInput,
  type BirimValues,
} from '@/calculators/birim';
import { num } from '@/lib/format';
import content from './content.md';

const defaults: Partial<BirimInput> = { deger: 1, birim: 'inc' };
const example: BirimInput = { deger: 55, birim: 'inc' };

const sources: Source[] = [
  { label: 'BIPM — SI Broşürü (metrenin tanımı)', url: 'https://www.bipm.org/en/publications/si-brochure' },
  {
    label: 'NIST SP 811, Ek B.8 — Dönüşüm katsayıları (inç, ayak, mil, deniz mili)',
    url: 'https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b8',
  },
  {
    label: 'Federal Register (1959) — Refinement of Values for the Yard and the Pound',
    url: 'https://www.ngs.noaa.gov/PUBS_LIB/FedRegister/FRdoc59-5442.pdf',
  },
];

function present(v: BirimValues): ResultView {
  const r = cevirTumu('uzunluk', v.deger, v.birim);
  const kaynak = r.find((k) => k.id === v.birim)!;
  const ana = r.find((k) => k.id === kaynak.hedef)!;
  const metre = r.find((k) => k.id === 'm')!.deger;
  const rows: ResultRow[] = r
    .filter((k) => k.id !== v.birim)
    .map((k) => ({ label: k.ad, value: degerTR(k), tone: k.id === ana.id ? 'total' : undefined }));
  // İnsan boyu aralığında ayak + inç bileşik gösterimi (5′ 8,9″)
  if (metre >= 0.3 && metre <= 3) {
    const { ayak, inc } = ayakInc(metre);
    rows.push({ label: 'Ayak + inç (boy gösterimi)', value: `${ayak}′ ${num(inc, 1)}″`, tone: 'muted' });
  }
  if (v.birim === 'inc' && v.deger >= 10 && v.deger <= 150) {
    const e = ekranBoyutu(v.deger);
    rows.push(
      { label: 'Ekran köşegeni', value: `${sayiTR(e.kosegen)} cm`, tone: 'muted' },
      {
        label: '16:9 ekran genişlik × yükseklik',
        value: `${num(e.genislik, 1)} × ${num(e.yukseklik, 1)} cm`,
        tone: 'muted',
        hint: 'Yalnız panel (görüntü alanı); çerçeve ve ayak dahil değildir.',
      },
    );
  }
  return {
    main: { label: `${degerTR(kaynak)} kaç ${ana.sembol}?`, value: degerTR(ana) },
    rows,
    notes: ['İnç, ayak, yarda ve mil 1959 uluslararası anlaşmasıyla metreye tam olarak bağlıdır (1 inç = 2,54 cm).'],
  };
}

export default function UzunlukCeviriciPage() {
  return (
    <CalculatorLayout
      slug="uzunluk-cevirici"
      schema={uzunlukSchema}
      defaults={defaults}
      example={example}
      compute={present}
      content={content}
      sources={sources}
      emptyHint="Değeri ve birimini girdiğiniz anda cm, m, inç, feet, mil ve diğer tüm karşılıklar görünür."
    >
      <NumberField<BirimInput>
        name="deger"
        label="Değer"
        decimals={6}
        placeholder="Örn. 175"
        help="Çevirmek istediğiniz uzunluk. Ondalık için virgül kullanın: 1,75."
      />
      <SelectField<BirimInput>
        name="birim"
        label="Birim"
        options={birimSecenekleri('uzunluk')}
        help="Girdiğiniz değerin birimi. Sonuçta diğer tüm birimlerdeki karşılığı listelenir."
        hint="TV ekranı için İnç seçin."
      />
    </CalculatorLayout>
  );
}
