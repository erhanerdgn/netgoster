import { CalculatorLayout } from '@/components/calc/CalculatorLayout';
import type { ResultView } from '@/components/calc/ResultCard';
import { alesEsikler, alesSchema, alesTests, alesTurleri, calculateAles, type AlesInput } from '@/calculators/ales';
import { ales } from '@/config/sinavlar';
import { num } from '@/lib/format';
import { DYTable, hasAnswer } from '../yks-puan-hesaplama/DYTable';
import content from './content.md';

const schema = alesSchema.refine((v) => hasAnswer(v.dy), {
  path: ['dy'],
  message: 'Sayısal ve sözel doğru/yanlış sayılarını girin',
});

const defaults: Partial<AlesInput> = { dy: {} };
const example: AlesInput = { dy: { say: { d: 35, y: 8 }, soz: { d: 40, y: 8 } } };

const esikText = (p: number) => {
  const gecen = alesEsikler.filter((e) => p >= e);
  return gecen.length ? `${gecen.join(', ')} eşiğini geçer` : `${alesEsikler[0]} eşiğinin altında`;
};

function present(v: Parameters<typeof calculateAles>[0]): ResultView {
  const r = calculateAles(v);
  const best = [...alesTurleri].sort((a, b) => r.puanlar[b] - r.puanlar[a])[0];
  return {
    main: {
      label: `En yüksek tahmini ALES puanı (${ales.types[best].label})`,
      value: num(r.puanlar[best], 3, 3),
      caption: `Tahmini · ${ales.year - 2}–${ales.year} ALES sonuçlarına dayalı katsayılar`,
    },
    status:
      r.puanlar[best] >= 55
        ? { tone: 'ok', text: `Tahmini puanınız yaygın lisansüstü başvuru eşiği olan 55’in üzerinde.` }
        : { tone: 'warn', text: 'Tahmini puanınız tezli yüksek lisans başvurularında aranan 55’in altında.' },
    rows: [
      ...alesTurleri.map((k) => ({
        label: `${ales.types[k].label} puanı`,
        value: num(r.puanlar[k], 3, 3),
        hint: esikText(r.puanlar[k]),
      })),
      { label: 'Sayısal net', value: num(r.sayNet, 2), tone: 'muted' as const, hint: `${v.dy.say.d} D, ${v.dy.say.y} Y` },
      { label: 'Sözel net', value: num(r.sozNet, 2), tone: 'muted' as const, hint: `${v.dy.soz.d} D, ${v.dy.soz.y} Y` },
    ],
    notes: [
      'Sayısal puanda sayısal test %75, sözel %25; sözel puanda tersi; eşit ağırlıkta %50–%50 etkilidir. 4 yanlış 1 doğruyu götürür.',
      'ÖSYM standart puan kullanır; gerçek puanınız oturumun ortalamasına göre farklı olabilir.',
    ],
  };
}

export default function AlesPuanPage() {
  return (
    <CalculatorLayout
      slug="ales-puan-hesaplama"
      schema={schema}
      defaults={defaults}
      example={example}
      compute={present}
      content={content}
      emptyHint="Sayısal ve sözel doğru-yanlış sayılarınızı girdiğinizde üç ALES puan türü tahmini olarak hesaplanır."
    >
      <DYTable tests={alesTests} penalty={ales.wrongPenalty} caption="Sayısal ve sözel testler" />
    </CalculatorLayout>
  );
}
