import { CalculatorLayout } from '@/components/calc/CalculatorLayout';
import { NumberField } from '@/components/calc/fields';
import type { ResultView } from '@/components/calc/ResultCard';
import { brutNetSchema, calculateBrutNet, type BrutNetInput } from '@/calculators/brutNet';
import { monthNames, tl } from '@/lib/format';
import content from './content.md';

const defaults: Partial<BrutNetInput> = {};
const example: BrutNetInput = { brut: 50000 };

function present(v: Parameters<typeof calculateBrutNet>[0]): ResultView {
  const { aylar, toplam, ortalamaNet } = calculateBrutNet(v);
  const ilk = aylar[0];
  const minNet = Math.min(...aylar.map((a) => a.net));
  return {
    main: { label: 'Ocak ayı net maaş', value: tl(ilk.net), caption: `${v.yil} yılı ortalama net: ${tl(ortalamaNet)}` },
    status:
      minNet < ilk.net
        ? { tone: 'info', text: `Kümülatif matrah vergi dilimini aştıkça net maaş düşer; en düşük aylık net ${tl(minNet)}.` }
        : { tone: 'ok', text: 'Yıl boyunca vergi diliminiz değişmiyor; net maaşınız her ay aynı.' },
    rows: [
      { label: 'Brüt maaş', value: tl(ilk.brut) },
      { label: 'SGK işçi payı', value: tl(ilk.sgkIsci), tone: 'minus' },
      { label: 'İşsizlik sigortası işçi payı', value: tl(ilk.issizlikIsci), tone: 'minus' },
      { label: 'Gelir vergisi matrahı', value: tl(ilk.gvMatrah), tone: 'muted' },
      { label: 'Hesaplanan gelir vergisi', value: tl(ilk.gvHesaplanan), tone: 'muted' },
      { label: 'Asgari ücret GV istisnası', value: tl(ilk.gvIstisna), tone: 'muted' },
      { label: 'Gelir vergisi', value: tl(ilk.gv), tone: 'minus' },
      { label: 'Damga vergisi', value: tl(ilk.dv), tone: 'minus', hint: `İstisna sonrası (istisna ${tl(ilk.dvIstisna)})` },
      { label: 'Ocak net maaş', value: tl(ilk.net), tone: 'total' },
      { label: 'Yıllık toplam net', value: tl(toplam.net), tone: 'total' },
    ],
    table: {
      caption: `${v.yil} yılı aylık bordro dökümü`,
      columns: ['Ay', 'Brüt', 'SGK + İşsizlik', 'Kümülatif matrah', 'Gelir vergisi', 'Damga vergisi', 'Net'],
      rows: aylar.map((a) => [
        monthNames[a.ay - 1],
        tl(a.brut),
        tl(a.sgkIsci + a.issizlikIsci),
        tl(a.kumMatrah),
        tl(a.gv),
        tl(a.dv),
        tl(a.net),
      ]),
      footer: [
        'Toplam',
        tl(toplam.brut),
        tl(toplam.sgkIsci + toplam.issizlikIsci),
        '',
        tl(toplam.gv),
        tl(toplam.dv),
        tl(toplam.net),
      ],
    },
    notes: [
      'Her ay aynı brüt ücret aldığınız ve yıla Ocak ayında başladığınız varsayılır. Engellilik indirimi, BES ve özel sigorta kesintileri dahil değildir.',
    ],
  };
}

export default function BruttenNeteMaasPage() {
  return (
    <CalculatorLayout
      slug="brutten-nete-maas-hesaplama"
      schema={brutNetSchema}
      defaults={defaults}
      example={example}
      compute={present}
      content={content}
      emptyHint="Brüt maaşınızı girdiğiniz anda 12 aylık net maaş tablonuz hesaplanır."
    >
      <NumberField<BrutNetInput>
        name="brut"
        label="Aylık brüt maaş"
        unit="₺"
        placeholder="Örn. 50.000"
        className="sm:col-span-2"
        help="Brüt maaş, SGK primi ve vergiler kesilmeden önceki ücrettir; iş sözleşmenizde ve bordronuzda “brüt ücret” olarak yazar."
      />
    </CalculatorLayout>
  );
}
