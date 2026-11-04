import { CalculatorLayout } from '@/components/calc/CalculatorLayout';
import { NumberField, SwitchField } from '@/components/calc/fields';
import type { ResultView } from '@/components/calc/ResultCard';
import { bagkurSchema, calculateBagkur, type BagkurInput } from '@/calculators/bagkur';
import { sgkTabanTavan } from '@/config/parameters-2026';
import { todayISO, valueAt } from '@/config/period';
import { pct, tl } from '@/lib/format';
import content from './content.md';

const pek = valueAt(sgkTabanTavan, todayISO());
const defaults: Partial<BagkurInput> = { kazanc: pek.taban, indirim: true };
const example: BagkurInput = { kazanc: 50000, indirim: true };

function present(v: Parameters<typeof calculateBagkur>[0]): ResultView {
  const r = calculateBagkur(v);
  return {
    main: {
      label: `Aylık Bağkur primi (${v.indirim ? 'indirimli' : 'indirimsiz'})`,
      value: tl(r.aylik),
      caption: `Yıllık: ${tl(r.yillik)} · Prim oranı ${pct(v.indirim ? r.indirimliOran : r.oran)}`,
    },
    status: v.indirim
      ? { tone: 'ok', text: `Prim borcunuz olmadığı için 5 puanlık indirimle her ay ${tl(r.aylikFark)} daha az ödersiniz.` }
      : {
          tone: 'warn',
          text: `Vadesi geçmiş prim borcu varken indirim uygulanmaz. Borç kapatılırsa aylık ${tl(r.aylikFark)} tasarruf edilir.`,
        },
    rows: [
      { label: 'Prime esas kazanç', value: tl(r.kazanc) },
      { label: 'Asgari – azami kazanç', value: `${tl(r.taban)} – ${tl(r.tavan)}`, tone: 'muted' },
      { label: `Aylık prim (indirimsiz, ${pct(r.oran)})`, value: tl(r.aylikIndirimsiz) },
      { label: `Aylık prim (indirimli, ${pct(r.indirimliOran)})`, value: tl(r.aylikIndirimli) },
      { label: 'Aylık indirim tutarı', value: tl(r.aylikFark), tone: 'plus' },
      { label: 'Yıllık prim (indirimsiz)', value: tl(r.yillikIndirimsiz) },
      { label: 'Yıllık prim (indirimli)', value: tl(r.yillikIndirimli), tone: 'total' },
    ],
    table: {
      caption: 'İndirimli ve indirimsiz prim karşılaştırması',
      columns: ['Dönem', `İndirimsiz (${pct(r.oran)})`, `İndirimli (${pct(r.indirimliOran)})`, 'Fark'],
      rows: [
        ['Aylık', tl(r.aylikIndirimsiz), tl(r.aylikIndirimli), tl(r.aylikFark)],
        ['Yıllık (12 ay)', tl(r.yillikIndirimsiz), tl(r.yillikIndirimli), tl(r.yillikFark)],
      ],
    },
    notes: [
      'Yıllık tutar, yıl boyunca aynı kazancın beyan edildiği varsayımıyla hesaplanır. Asgari ve azami kazanç her yıl başında güncellenir.',
    ],
  };
}

export default function BagkurPrimPage() {
  return (
    <CalculatorLayout
      slug="bagkur-prim-hesaplama"
      schema={bagkurSchema}
      defaults={defaults}
      example={example}
      compute={present}
      content={content}
      emptyHint="Prime esas kazancınızı girdiğiniz anda aylık ve yıllık Bağkur priminiz hesaplanır."
    >
      <NumberField<BagkurInput>
        name="kazanc"
        label="Prime esas aylık kazanç"
        unit="₺"
        placeholder={`Örn. ${pek.taban.toLocaleString('tr-TR')}`}
        help="Prime esas kazanç, primin üzerinden hesaplandığı ve SGK’ya beyan ettiğiniz aylık kazançtır. Asgari ile azami sınır arasında serbestçe seçilir; yüksek beyan emekli aylığını artırır."
        hint={`Asgari ${tl(pek.taban)} – azami ${tl(pek.tavan)}`}
        className="sm:col-span-2"
      />
      <SwitchField<BagkurInput>
        name="indirim"
        label="Vadesi geçmiş prim borcum yok"
        help="Prim borcu bulunmayan 4/b sigortalılarının primindeki 5 puanı Hazine karşılar. Borç varsa indirim uygulanmaz."
        hint="5 puanlık Hazine indirimi"
        className="sm:col-span-2"
      />
    </CalculatorLayout>
  );
}
