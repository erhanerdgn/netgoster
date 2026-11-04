import { useWatch } from 'react-hook-form';
import { CalculatorLayout } from '@/components/calc/CalculatorLayout';
import { ChoiceField, NumberField } from '@/components/calc/fields';
import type { ResultView } from '@/components/calc/ResultCard';
import { calculateKredi, krediSchema, TAHSIS_UCRETI_AZAMI, type KrediInput, type KrediValues } from '@/calculators/kredi';
import { num, pct, tl } from '@/lib/format';
import content from './content.md';

const defaults: Partial<KrediInput> = { tur: 'ihtiyac', vade: 12, masraf: 0 };
const example: KrediInput = { tur: 'ihtiyac', tutar: 100000, faiz: 3, vade: 12, masraf: 0 };

const TUR_AD = { ihtiyac: 'İhtiyaç kredisi', tasit: 'Taşıt kredisi', konut: 'Konut kredisi' } as const;

function present(v: KrediValues): ResultView {
  const r = calculateKredi(v);
  const vergili = r.kkdfOran + r.bsmvOran > 0;
  const sonFarkli = r.sonTaksit !== r.taksit;
  return {
    main: {
      label: 'Aylık taksit',
      value: tl(r.taksit),
      caption: `${TUR_AD[v.tur]} · ${v.vade} ay · aylık %${num(v.faiz, 4)}`,
    },
    chart: {
      title: 'Toplam maliyetin dağılımı',
      items: [
        { label: 'Anapara', value: v.tutar, formatted: tl(v.tutar) },
        { label: 'Faiz', value: r.toplamFaiz, formatted: tl(r.toplamFaiz) },
        {
          label: 'Vergiler ve masraflar',
          value: r.toplamKkdf + r.toplamBsmv + r.masraf,
          formatted: tl(r.toplamKkdf + r.toplamBsmv + r.masraf),
        },
      ],
    },
    status: vergili
      ? {
          tone: 'info',
          text: `Faize ${pct(r.kkdfOran)} KKDF ve ${pct(r.bsmvOran)} BSMV eklendi; taksit vergili aylık %${num(r.brutOran * 100, 4)} oranla hesaplandı.`,
        }
      : { tone: 'ok', text: 'Konut kredisi KKDF ve BSMV’den muaftır; taksit yalnız akdi faizle hesaplandı.' },
    rows: [
      { label: 'Kredi tutarı', value: tl(v.tutar) },
      { label: 'Toplam faiz', value: tl(r.toplamFaiz), tone: 'plus' },
      ...(vergili
        ? [
            { label: 'Toplam KKDF', value: tl(r.toplamKkdf), tone: 'plus' as const },
            { label: 'Toplam BSMV', value: tl(r.toplamBsmv), tone: 'plus' as const },
          ]
        : []),
      { label: 'Toplam geri ödeme', value: tl(r.toplamOdeme), tone: 'total' },
      ...(r.masraf > 0
        ? [
            { label: 'Masraflar (peşin)', value: tl(r.masraf), tone: 'plus' as const },
            { label: 'Masraflar dahil toplam maliyet', value: tl(r.toplamMasrafDahil), tone: 'total' as const },
          ]
        : []),
      {
        label: 'Faiz + vergi yükü',
        value: tl(r.toplamMaliyet),
        tone: 'muted',
        hint: `Kredi tutarına oranı: ${pct(r.toplamMaliyet / v.tutar)}`,
      },
      {
        label: 'Yıllık efektif maliyet (vergili)',
        value: pct(r.efektifYillik),
        tone: 'muted',
        hint: `Nominal yıllık akdi faiz: ${pct(r.nominalYillik)}`,
      },
    ],
    notes: [
      ...(sonFarkli ? [`Son taksit, kuruş yuvarlaması nedeniyle ${tl(r.sonTaksit)} olarak düzeltildi.`] : []),
      'Bankanın uyguladığı tahsis ücreti, sigorta ve ekspertiz gibi masraflar yıllık maliyet oranını yükseltir; kesin oran için kredi sözleşme öncesi bilgi formuna bakın.',
    ],
    table: {
      caption: 'Ödeme planı',
      columns: vergili
        ? ['Ay', 'Taksit', 'Faiz', 'KKDF', 'BSMV', 'Anapara', 'Kalan anapara']
        : ['Ay', 'Taksit', 'Faiz', 'Anapara', 'Kalan anapara'],
      rows: r.plan.map((t) =>
        vergili
          ? [String(t.ay), tl(t.taksit), tl(t.faiz), tl(t.kkdf), tl(t.bsmv), tl(t.anapara), tl(t.kalan)]
          : [String(t.ay), tl(t.taksit), tl(t.faiz), tl(t.anapara), tl(t.kalan)],
      ),
      footer: vergili
        ? ['Toplam', tl(r.toplamOdeme), tl(r.toplamFaiz), tl(r.toplamKkdf), tl(r.toplamBsmv), tl(v.tutar), '']
        : ['Toplam', tl(r.toplamOdeme), tl(r.toplamFaiz), tl(v.tutar), ''],
    },
  };
}

function Fields() {
  const tutar = useWatch<KrediInput, 'tutar'>({ name: 'tutar' });
  return (
    <>
      <ChoiceField<KrediInput>
        name="tur"
        label="Kredi türü"
        className="sm:col-span-2"
        options={[
          { value: 'ihtiyac', label: 'İhtiyaç' },
          { value: 'tasit', label: 'Taşıt' },
          { value: 'konut', label: 'Konut' },
        ]}
        help="İhtiyaç ve taşıt kredilerinde faize KKDF ve BSMV eklenir; konut kredisi bu vergilerden muaftır."
      />
      <NumberField<KrediInput>
        name="tutar"
        label="Kredi tutarı"
        unit="₺"
        placeholder="Örn. 100.000"
        help="Bankadan çekeceğiniz anapara tutarı (masraflar hariç)."
      />
      <NumberField<KrediInput>
        name="faiz"
        label="Aylık faiz oranı"
        unit="%"
        decimals={4}
        placeholder="Örn. 3,09"
        help="Bankanın ilan ettiği aylık akdi (sözleşme) faiz oranı. KKDF ve BSMV hariç orandır; vergiler otomatik eklenir."
      />
      <NumberField<KrediInput>
        name="vade"
        label="Vade"
        unit="ay"
        decimals={0}
        placeholder="Örn. 12"
        help="Kaç ay boyunca taksit ödeyeceğiniz. Bankacılık düzenlemeleri kredi türüne ve tutara göre azami vade sınırı uygular."
      />
      <NumberField<KrediInput>
        name="masraf"
        label="Masraflar (isteğe bağlı)"
        unit="₺"
        placeholder="Örn. 500"
        help="Kredi tahsis ücreti, ekspertiz, ipotek ve sigorta gibi peşin ödenen masraflar. Tahsis ücreti yasal olarak kredi tutarının binde 5’ini geçemez."
        hint={tutar ? `Bu kredi için azami tahsis ücreti: ${tl(tutar * TAHSIS_UCRETI_AZAMI)} (+ BSMV)` : 'Yoksa 0 bırakın.'}
      />
    </>
  );
}

export default function KrediHesaplamaPage() {
  return (
    <CalculatorLayout
      slug="kredi-hesaplama"
      schema={krediSchema}
      defaults={defaults}
      example={example}
      compute={present}
      content={content}
      emptyHint="Kredi tutarını, aylık faiz oranını ve vadeyi girdiğiniz anda taksit ve ödeme planı oluşur."
    >
      <Fields />
    </CalculatorLayout>
  );
}
