import { CalculatorLayout } from '@/components/calc/CalculatorLayout';
import { NumberField } from '@/components/calc/fields';
import type { ResultView } from '@/components/calc/ResultCard';
import { calculateYds, ydsSchema, type YdsInput } from '@/calculators/yds';
import { yds } from '@/config/sinavlar';
import { num } from '@/lib/format';
import content from './content.md';

const defaults: Partial<YdsInput> = {};
const example: YdsInput = { dogru: 64 };

function present(v: Parameters<typeof calculateYds>[0]): ResultView {
  const r = calculateYds(v);
  return {
    main: {
      label: 'YDS puanı',
      value: num(r.puan, 2),
      caption: r.seviye ? `${r.seviye} seviyesi` : 'Seviye yok (50 puanın altı)',
    },
    status: r.seviye
      ? { tone: 'ok', text: `${num(r.puan, 2)} puan ${r.seviye} seviyesine karşılık gelir.` }
      : { tone: 'warn', text: 'YDS’de 50 puanın altına seviye verilmez; çoğu kurum en az 50–60 puan ister.' },
    rows: [
      { label: 'Doğru', value: String(r.dogru) },
      { label: 'Yanlış + boş', value: String(r.yanlisBos), tone: 'muted', hint: 'Yanlışlar doğruyu götürmez' },
      { label: 'Puan', value: `${num(r.dogru, 0)} × ${num(yds.perCorrect, 2)} = ${num(r.puan, 2)}`, tone: 'total' },
      { label: 'Seviye', value: r.seviye ?? '—' },
      ...(r.sonrakiIcin
        ? [{ label: `${r.sonrakiIcin.seviye} seviyesi için`, value: `+${r.sonrakiIcin.dogru} doğru`, tone: 'plus' as const }]
        : []),
    ],
    notes: [
      'Formül ÖSYM kılavuzundandır: 80 soru, her doğru 1,25 puan. İptal edilen soru olursa ÖSYM puanı yeniden belirler; resmi sonuç ÖSYM’nin açıkladığıdır.',
    ],
  };
}

export default function YdsPuanPage() {
  return (
    <CalculatorLayout
      slug="yds-puan-hesaplama"
      schema={ydsSchema}
      defaults={defaults}
      example={example}
      compute={present}
      content={content}
      emptyHint="Doğru cevap sayınızı girdiğiniz anda YDS puanınız ve seviyeniz hesaplanır."
    >
      <NumberField<YdsInput>
        name="dogru"
        label="Doğru cevap sayısı"
        unit="/ 80"
        decimals={0}
        placeholder="Örn. 64"
        help="Cevap anahtarına göre doğru cevapladığınız soru sayısı. YDS’de yanlışlar doğruyu götürmez; boş ve yanlışın puana etkisi yoktur."
      />
    </CalculatorLayout>
  );
}
