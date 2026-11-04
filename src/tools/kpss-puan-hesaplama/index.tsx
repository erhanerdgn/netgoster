import { CalculatorLayout } from '@/components/calc/CalculatorLayout';
import { ChoiceField } from '@/components/calc/fields';
import type { ResultView } from '@/components/calc/ResultCard';
import { calculateKpss, kpssSchema, kpssTests, type KpssInput } from '@/calculators/kpss';
import { kpss } from '@/config/sinavlar';
import { num } from '@/lib/format';
import { DYTable, hasAnswer } from '../yks-puan-hesaplama/DYTable';
import content from './content.md';

const schema = kpssSchema.refine((v) => hasAnswer(v.dy), { path: ['dy'], message: 'GY ve GK doğru/yanlış sayılarını girin' });

const defaults: Partial<KpssInput> = { tur: 'P3', dy: {} };
const example: KpssInput = { tur: 'P3', dy: { gy: { d: 45, y: 12 }, gk: { d: 40, y: 16 } } };

function present(v: Parameters<typeof calculateKpss>[0]): ResultView {
  const r = calculateKpss(v);
  const t = kpss.types[v.tur];
  const rows = [
    { label: 'Genel Yetenek neti', value: num(r.gyNet, 2), hint: `${v.dy.gy.d} D, ${v.dy.gy.y} Y` },
    { label: 'Genel Kültür neti', value: num(r.gkNet, 2), hint: `${v.dy.gk.d} D, ${v.dy.gk.y} Y` },
    { label: 'Toplam net', value: num(r.toplamNet, 2), tone: 'total' as const },
  ];
  const notes = [
    `Tahmini: ${t.label} için puan ≈ ${num(t.base, 2)} + ${num(t.perNet, 2)} × toplam net (${kpss.year - 2} KPSS dağılımına kalibre). GY ve GK puana eşit (%50) etki eder.`,
    '4 yanlış 1 doğruyu götürür. Sıralama tahmini yapılmaz.',
  ];
  if (r.puan === null) {
    return {
      main: { label: `Tahmini KPSS ${v.tur} puanı`, value: 'Hesaplanmadı', caption: t.label },
      status: {
        tone: 'warn',
        text: 'Puanın hesaplanması için Genel Yetenek ve Genel Kültür testlerinin her birinde en az 1 net gerekir.',
      },
      rows,
      notes,
    };
  }
  return {
    main: {
      label: `Tahmini KPSS ${v.tur} puanı`,
      value: num(r.puan, 3, 3),
      caption: `Tahmini · ${kpss.year - 2} sonuçlarına dayalı yaklaşım · ${t.label}`,
    },
    status: { tone: 'info', text: 'ÖSYM standart puan kullanır; gerçek puanınız ±3 puan farklı olabilir.' },
    rows,
    notes,
  };
}

export default function KpssPuanPage() {
  return (
    <CalculatorLayout
      slug="kpss-puan-hesaplama"
      schema={schema}
      defaults={defaults}
      example={example}
      compute={present}
      content={content}
      emptyHint="KPSS türünü seçip GY ve GK doğru-yanlış sayılarınızı girdiğinizde tahmini puanınız hesaplanır."
    >
      <ChoiceField<KpssInput>
        name="tur"
        label="KPSS türü"
        className="sm:col-span-2"
        help="P3: lisans mezunları, P93: önlisans mezunları, P94: ortaöğretim (lise) mezunları için puan türüdür. Her biri ayrı oturumda yapılan farklı sınavlardır."
        options={(Object.keys(kpss.types) as (keyof typeof kpss.types)[]).map((k) => ({ value: k, label: kpss.types[k].label }))}
      />
      <DYTable tests={kpssTests} penalty={kpss.wrongPenalty} caption="Genel Yetenek ve Genel Kültür" />
    </CalculatorLayout>
  );
}
