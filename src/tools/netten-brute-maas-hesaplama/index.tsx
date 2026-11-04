import { CalculatorLayout } from '@/components/calc/CalculatorLayout';
import { NumberField } from '@/components/calc/fields';
import type { ResultView } from '@/components/calc/ResultCard';
import { calculateNetBrut, netBrutSchema, type NetBrutInput } from '@/calculators/netBrut';
import { monthNames, tl } from '@/lib/format';
import content from './content.md';

const defaults: Partial<NetBrutInput> = {};
const example: NetBrutInput = { net: 40000 };

function present(v: Parameters<typeof calculateNetBrut>[0]): ResultView {
  const { aylar, toplam, ortalamaBrut } = calculateNetBrut(v);
  const ilk = aylar[0];
  const maxBrut = Math.max(...aylar.map((a) => a.brut));
  return {
    main: {
      label: 'Ocak ayı gereken brüt maaş',
      value: tl(ilk.brut),
      caption: `${v.yil} yılı ortalama brüt: ${tl(ortalamaBrut)}`,
    },
    status:
      maxBrut > ilk.brut
        ? {
            tone: 'info',
            text: `Aynı neti korumak için vergi dilimi yükseldikçe brüt artmalı; yılın en yüksek brütü ${tl(maxBrut)}.`,
          }
        : { tone: 'ok', text: 'Yıl boyunca vergi diliminiz değişmiyor; her ay aynı brüt yeterli.' },
    rows: [
      { label: 'Hedef net maaş', value: tl(v.net) },
      { label: 'SGK işçi payı', value: tl(ilk.sgkIsci), tone: 'minus' },
      { label: 'İşsizlik sigortası işçi payı', value: tl(ilk.issizlikIsci), tone: 'minus' },
      { label: 'Gelir vergisi (istisna sonrası)', value: tl(ilk.gv), tone: 'minus' },
      { label: 'Damga vergisi (istisna sonrası)', value: tl(ilk.dv), tone: 'minus' },
      { label: 'Ocak brüt maaş', value: tl(ilk.brut), tone: 'total' },
      { label: 'Yıllık toplam brüt', value: tl(toplam.brut), tone: 'total' },
      { label: 'Yıllık işveren maliyeti', value: tl(toplam.maliyet), tone: 'muted', hint: 'Teşviksiz' },
    ],
    table: {
      caption: `${v.yil} yılı aylık gereken brüt`,
      columns: ['Ay', 'Net', 'Gereken brüt', 'SGK + İşsizlik', 'Gelir vergisi', 'Damga vergisi'],
      rows: aylar.map((a) => [monthNames[a.ay - 1], tl(a.net), tl(a.brut), tl(a.sgkIsci + a.issizlikIsci), tl(a.gv), tl(a.dv)]),
      footer: ['Toplam', tl(toplam.net), tl(toplam.brut), tl(toplam.sgkIsci + toplam.issizlikIsci), tl(toplam.gv), tl(toplam.dv)],
    },
    notes: [
      'Brüt, kuruş hassasiyetinde ters hesaplanır; yuvarlama nedeniyle net hedeften 1 kuruş fazla çıkabilir. Yıla Ocak ayında başladığınız varsayılır.',
    ],
  };
}

export default function NettenBruteMaasPage() {
  return (
    <CalculatorLayout
      slug="netten-brute-maas-hesaplama"
      schema={netBrutSchema}
      defaults={defaults}
      example={example}
      compute={present}
      content={content}
      emptyHint="Elinize geçmesini istediğiniz net maaşı girdiğiniz anda her ay için gereken brüt ücret hesaplanır."
    >
      <NumberField<NetBrutInput>
        name="net"
        label="Hedef aylık net maaş"
        unit="₺"
        placeholder="Örn. 40.000"
        className="sm:col-span-2"
        help="Tüm kesintilerden sonra her ay hesabınıza yatmasını istediğiniz tutar. İş görüşmesinde konuşulan “net” rakamı buraya yazın."
      />
    </CalculatorLayout>
  );
}
