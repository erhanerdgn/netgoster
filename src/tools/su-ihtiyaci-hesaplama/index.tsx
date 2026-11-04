import { CalculatorLayout, type Source } from '@/components/calc/CalculatorLayout';
import { ChoiceField, NumberField, SwitchField } from '@/components/calc/fields';
import type { ResultView } from '@/components/calc/ResultCard';
import { calculateSu, SU, suSchema, type SuInput } from '@/calculators/su';
import { num } from '@/lib/format';
import content from './content.md';

const defaults: Partial<SuInput> = { cinsiyet: 'kadin', egzersiz: 0, sicak: false, durum: 'yok' };
const example: SuInput = { kilo: 70, cinsiyet: 'kadin', egzersiz: 30, sicak: false, durum: 'yok' };

const sources: Source[] = [
  {
    label: 'EFSA NDA Panel — Scientific Opinion on Dietary Reference Values for water. EFSA Journal 2010;8(3):1459',
    url: 'https://www.efsa.europa.eu/en/efsajournal/pub/1459',
  },
  {
    label: 'American College of Sports Medicine — Position Stand: Exercise and Fluid Replacement (2007)',
    url: 'https://pubmed.ncbi.nlm.nih.gov/17277604/',
  },
  {
    label: 'T.C. Sağlık Bakanlığı — Türkiye Beslenme Rehberi (TÜBER 2022)',
    url: 'https://hsgm.saglik.gov.tr/media/attachments/2025/05/12/turkiye-beslenme-rehberi-2022.pdf',
  },
];

const litre = (ml: number) => `${num(ml / 1000, 2)} L`;

function present(v: Parameters<typeof calculateSu>[0]): ResultView {
  const r = calculateSu(v);
  return {
    main: {
      label: 'Günlük su ihtiyacınız',
      value: litre(r.toplam),
      caption: `≈ ${r.bardak} bardak (${SU.bardak} ml) · içecek ve yiyeceklerden gelen toplam sıvı`,
    },
    status: {
      tone: 'info',
      text: `EFSA’nın ${v.cinsiyet === 'kadin' ? 'kadınlar' : 'erkekler'} için yeterli alım referansı ${litre(r.efsa)}/gün. Susadığınızda için; idrar renginin açık sarı olması yeterli sıvı aldığınızın iyi bir işaretidir.`,
    },
    rows: [
      {
        label: 'Kiloya göre temel ihtiyaç',
        value: `${num(r.temel, 0)} ml`,
        hint: `${num(v.kilo, 1)} kg × ${SU.mlKgMin}–${SU.mlKgMax} ml = ${litre(r.aralikMin)} – ${litre(r.aralikMax)}`,
      },
      ...(r.egzersizEk
        ? [{ label: `Egzersiz (${v.egzersiz} dk)`, value: `+${num(r.egzersizEk, 0)} ml`, tone: 'plus' as const }]
        : []),
      ...(r.sicakEk ? [{ label: 'Sıcak hava', value: `+${num(r.sicakEk, 0)} ml`, tone: 'plus' as const }] : []),
      ...(r.durumEk
        ? [{ label: v.durum === 'hamile' ? 'Gebelik' : 'Emzirme', value: `+${num(r.durumEk, 0)} ml`, tone: 'plus' as const }]
        : []),
      { label: 'Toplam', value: `${num(r.toplam, 0)} ml`, tone: 'total' },
      { label: 'Bardak sayısı', value: `${r.bardak} bardak`, hint: `${SU.bardak} ml’lik su bardağı` },
      { label: 'EFSA yeterli alım referansı', value: litre(r.efsa), tone: 'muted' },
    ],
    notes: [
      'Toplam sıvının yaklaşık %20–30’u yiyeceklerden (sebze, meyve, çorba) gelir. Kalp, böbrek veya karaciğer hastalığı nedeniyle sıvı kısıtlaması olanlar doktorlarının önerisine uymalıdır.',
    ],
  };
}

export default function SuIhtiyaciPage() {
  return (
    <CalculatorLayout
      slug="su-ihtiyaci-hesaplama"
      schema={suSchema}
      defaults={defaults}
      example={example}
      compute={present}
      content={content}
      sources={sources}
      emptyHint="Kilonuzu girdiğiniz anda günlük su ihtiyacınız litre ve bardak olarak hesaplanır."
    >
      <NumberField<SuInput> name="kilo" label="Kilo" unit="kg" decimals={1} placeholder="Örn. 70" />
      <ChoiceField<SuInput>
        name="cinsiyet"
        label="Cinsiyet"
        help="EFSA referans değeri kadın ve erkek için farklıdır."
        options={[
          { value: 'kadin', label: 'Kadın' },
          { value: 'erkek', label: 'Erkek' },
        ]}
      />
      <NumberField<SuInput>
        name="egzersiz"
        label="Günlük egzersiz süresi"
        unit="dk"
        decimals={0}
        help={`Terlediğiniz fiziksel aktivite süresi. Her 30 dakika için yaklaşık ${SU.egzersiz30dk} ml eklenir.`}
        hint="Egzersiz yapmıyorsanız 0"
      />
      <SwitchField<SuInput>
        name="sicak"
        label="Sıcak havadayım"
        help={`Sıcak ve nemli havada terleme artar; yaklaşık ${SU.sicak} ml eklenir.`}
      />
      <ChoiceField<SuInput>
        name="durum"
        label="Gebelik / emzirme"
        help={`EFSA: gebelikte +${SU.durum.hamile} ml, emzirme döneminde +${SU.durum.emziriyor} ml.`}
        options={[
          { value: 'yok', label: 'Yok' },
          { value: 'hamile', label: 'Hamile' },
          { value: 'emziriyor', label: 'Emziriyor' },
        ]}
        className="sm:col-span-2"
      />
    </CalculatorLayout>
  );
}
