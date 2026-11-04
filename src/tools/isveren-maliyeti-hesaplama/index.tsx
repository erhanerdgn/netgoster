import { CalculatorLayout } from '@/components/calc/CalculatorLayout';
import { ChoiceField, NumberField } from '@/components/calc/fields';
import type { ResultView } from '@/components/calc/ResultCard';
import { calculateIsverenMaliyeti, isverenMaliyetiSchema, type IsverenMaliyetiInput } from '@/calculators/isverenMaliyeti';
import { todayISO } from '@/config/period';
import { monthNames, pct, tl } from '@/lib/format';
import { tesvikSecenekleri } from '@/calculators/bordro';
import content from './content.md';

const defaults: Partial<IsverenMaliyetiInput> = { tesvik: 'yok' };
const example: IsverenMaliyetiInput = { brut: 50000, tesvik: 'genel' };

const tesvikOptions = tesvikSecenekleri(todayISO());

function present(v: Parameters<typeof calculateIsverenMaliyeti>[0]): ResultView {
  const { ay, aylar, toplam, ortalamaNet } = calculateIsverenMaliyeti(v);
  return {
    main: { label: 'Aylık toplam işveren maliyeti', value: tl(ay.maliyet), caption: `Yıllık: ${tl(toplam.maliyet)}` },
    status: {
      tone: 'info',
      text: `Brüt maaşın üzerine ${pct((ay.maliyet - ay.brut) / ay.brut)} ek maliyet; çalışanın Ocak neti ${tl(ay.net)}.`,
    },
    rows: [
      { label: 'Brüt maaş', value: tl(ay.brut) },
      { label: 'SGK işveren payı', value: tl(ay.sgkIsveren), tone: 'plus' },
      { label: 'İşsizlik sigortası işveren payı', value: tl(ay.issizlikIsveren), tone: 'plus' },
      ...(ay.hazineIndirimi > 0 ? [{ label: 'Hazine indirimi', value: tl(ay.hazineIndirimi), tone: 'minus' as const }] : []),
      { label: 'Aylık işveren maliyeti', value: tl(ay.maliyet), tone: 'total' },
      { label: 'Yıllık işveren maliyeti', value: tl(toplam.maliyet), tone: 'total' },
      { label: 'Çalışanın Ocak net maaşı', value: tl(ay.net), tone: 'muted' },
      { label: 'Çalışanın yıllık ortalama neti', value: tl(ortalamaNet), tone: 'muted' },
      ...(ay.sgkMatrah < ay.brut
        ? [{ label: 'Prime esas kazanç (tavan)', value: tl(ay.sgkMatrah), tone: 'muted' as const }]
        : []),
    ],
    table: {
      caption: `${v.yil} yılı aylık maliyet ve net maaş`,
      columns: ['Ay', 'Brüt', 'İşveren primleri', 'Toplam maliyet', 'Çalışanın neti'],
      rows: aylar.map((a) => [
        monthNames[a.ay - 1],
        tl(a.brut),
        tl(a.sgkIsveren + a.issizlikIsveren - a.hazineIndirimi),
        tl(a.maliyet),
        tl(a.net),
      ]),
      footer: [
        'Toplam',
        tl(toplam.brut),
        tl(toplam.sgkIsveren + toplam.issizlikIsveren - toplam.hazineIndirimi),
        tl(toplam.maliyet),
        tl(toplam.net),
      ],
    },
    notes: ['Asgari ücret desteği, iş sağlığı ve güvenliği, yemek kartı gibi yan maliyetler ve kıdem karşılığı dahil değildir.'],
  };
}

export default function IsverenMaliyetiPage() {
  return (
    <CalculatorLayout
      slug="isveren-maliyeti-hesaplama"
      schema={isverenMaliyetiSchema}
      defaults={defaults}
      example={example}
      compute={present}
      content={content}
      emptyHint="Brüt maaşı girdiğiniz anda çalışanın işverene aylık ve yıllık toplam maliyeti hesaplanır."
    >
      <NumberField<IsverenMaliyetiInput>
        name="brut"
        label="Aylık brüt maaş"
        unit="₺"
        placeholder="Örn. 50.000"
        help="Çalışana ödenen, kesintilerden önceki ücret. Netten başlıyorsanız önce netten brüte hesaplama yapın."
      />
      <ChoiceField<IsverenMaliyetiInput>
        name="tesvik"
        label="SGK teşviki"
        options={tesvikOptions}
        help="Hazine indirimi: prim borcu olmayan özel sektör işverenine SGK işveren payında puan indirimi. İmalat sektöründe (NACE C) indirim daha yüksektir."
      />
    </CalculatorLayout>
  );
}
