import { useFormContext, useWatch } from 'react-hook-form';
import { CalculatorLayout } from '@/components/calc/CalculatorLayout';
import { ChoiceField, DateField, NumberField, SwitchField } from '@/components/calc/fields';
import type { ResultView } from '@/components/calc/ResultCard';
import { calculateIssizlik, issizlikSchema, type IssizlikInput } from '@/calculators/issizlik';
import { issizlikOdenegi } from '@/config/parameters-2026';
import { todayISO } from '@/config/period';
import { num, pct, tl } from '@/lib/format';
import content from './content.md';

const defaults: Partial<IssizlikInput> = { tarih: todayISO(), yontem: 'aylik', son120: true };
const example: IssizlikInput = {
  tarih: todayISO(),
  yontem: 'aylik',
  k1: 42000,
  k2: 42000,
  k3: 45000,
  k4: 45000,
  primGun: 950,
  son120: true,
};

function present(v: Parameters<typeof calculateIssizlik>[0]): ResultView {
  const r = calculateIssizlik(v);
  const rows = [
    { label: 'Son 4 ay brüt kazanç ortalaması', value: tl(r.ortalama) },
    { label: `Hesaplanan ödenek (${pct(r.oran)})`, value: tl(r.hesaplanan), tone: 'muted' as const },
    { label: `Üst sınır (brüt asgari ücretin ${pct(r.tavanOrani)}’i)`, value: tl(r.tavan), tone: 'muted' as const },
    { label: 'Aylık brüt ödenek', value: tl(r.brut), tone: 'total' as const },
    { label: 'Damga vergisi', value: tl(r.damga), tone: 'minus' as const },
    { label: 'Aylık net ödenek', value: tl(r.net), tone: 'total' as const },
  ];
  if (!r.hakVar) {
    return {
      main: { label: 'Aylık net işsizlik maaşı', value: tl(0), caption: 'Şartlar sağlanmıyor' },
      status: {
        tone: 'warn',
        text: !r.primYeterli
          ? `Son 3 yılda en az ${num(r.minPrim)} gün işsizlik sigortası primi gerekir; sizde ${num(v.primGun)} gün var.`
          : `İşten ayrılmadan önceki son ${r.sonGunSarti} gün kesintisiz prim ödenmiş olmalı.`,
      },
      rows,
      notes: ['Şartlar sağlansaydı ödenecek aylık tutar yukarıda gösterilmiştir.'],
    };
  }
  return {
    main: { label: 'Aylık net işsizlik maaşı', value: tl(r.net), caption: `${r.ay} ay (${r.gun} gün) boyunca` },
    status: r.tavanUygulandi
      ? { tone: 'info', text: `Hesaplanan tutar üst sınırı aştığı için ödenek ${tl(r.tavan)} brüt ile sınırlandı.` }
      : { tone: 'ok', text: `${num(v.primGun)} prim gününüzle ${r.gun} gün işsizlik ödeneği alabilirsiniz.` },
    rows: [
      ...rows,
      { label: 'Ödeme süresi', value: `${r.gun} gün (${r.ay} ay)` },
      { label: 'Toplam net ödeme', value: tl(r.toplamNet), tone: 'total' },
    ],
    notes: [
      'İşsizlik ödeneği yalnız kendi istek ve kusuru dışında işini kaybedenlere ödenir; istifa ve md. 25/II ile çıkarılmada ödenmez. Başvuru ayrılıştan sonra 30 gün içinde İŞKUR’a yapılmalıdır.',
    ],
  };
}

function KazancFields() {
  const { control } = useFormContext<IssizlikInput>();
  const yontem = useWatch({ control, name: 'yontem' });
  if (yontem === 'ortalama') {
    return (
      <NumberField<IssizlikInput>
        name="ortalama"
        label="Son 4 ay ortalama brüt kazanç"
        unit="₺"
        placeholder="Örn. 45.000"
        className="sm:col-span-2"
        help="İşten ayrılmadan önceki son 4 ayın prime esas brüt kazançlarının ortalaması. SGK hizmet dökümünüzde ay ay yazar."
      />
    );
  }
  return (
    <>
      {([1, 2, 3, 4] as const).map((i) => (
        <NumberField<IssizlikInput>
          key={i}
          name={`k${i}`}
          label={`${i}. ay brüt kazanç`}
          unit="₺"
          placeholder="Örn. 45.000"
          help="Ayrılıştan önceki son 4 aydan birinin prime esas brüt kazancı (SGK hizmet dökümünde “kazanç”)."
          hint={i === 1 ? 'Ayrılıştan önceki son ay' : undefined}
        />
      ))}
    </>
  );
}

export default function IssizlikMaasiPage() {
  return (
    <CalculatorLayout
      slug="issizlik-maasi-hesaplama"
      schema={issizlikSchema}
      defaults={defaults}
      example={example}
      compute={present}
      content={content}
      emptyHint="Son 4 aylık brüt kazancınızı ve prim gün sayınızı girdiğiniz anda işsizlik maaşınız hesaplanır."
    >
      <DateField<IssizlikInput>
        name="tarih"
        label="İşten ayrılış tarihi"
        help="Sözleşmenin sona erdiği tarih. Üst sınır bu tarihteki brüt asgari ücrete göre belirlenir."
      />
      <NumberField<IssizlikInput>
        name="primGun"
        label="Son 3 yılda prim günü"
        unit="gün"
        decimals={0}
        placeholder="Örn. 900"
        help="İşten ayrılmadan önceki son 3 yılda işsizlik sigortası primi ödenen gün sayısı. e-Devlet’te SGK hizmet dökümünden bakabilirsiniz."
        hint={`${issizlikOdenegi[0].value.sureler.map(([g]) => g).join(', ')} gün sınırları süreyi belirler.`}
      />
      <ChoiceField<IssizlikInput>
        name="yontem"
        label="Kazanç girişi"
        className="sm:col-span-2"
        options={[
          { value: 'aylik', label: '4 ayı ayrı gir' },
          { value: 'ortalama', label: 'Ortalamayı gir' },
        ]}
        help="Son 4 ayın brüt kazançlarını tek tek girebilir ya da ortalamasını biliyorsanız doğrudan yazabilirsiniz."
      />
      <KazancFields />
      <SwitchField<IssizlikInput>
        name="son120"
        label="Son 120 gün kesintisiz prim ödendi"
        className="sm:col-span-2"
        help="İşten ayrılmadan önceki son 120 günün tamamında aynı ya da farklı işverenlerde sigortalı çalışmış olmanız gerekir."
      />
    </CalculatorLayout>
  );
}
