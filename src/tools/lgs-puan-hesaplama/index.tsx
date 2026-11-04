import { CalculatorLayout } from '@/components/calc/CalculatorLayout';
import type { ResultView } from '@/components/calc/ResultCard';
import { calculateLgs, lgsSchema, type LgsInput } from '@/calculators/lgs';
import { lgs } from '@/config/sinavlar';
import { num } from '@/lib/format';
import { DYTable, hasAnswer } from '../yks-puan-hesaplama/DYTable';
import content from './content.md';

const schema = lgsSchema.refine((v) => hasAnswer(v.dy), {
  path: ['dy'],
  message: 'En az bir dersin doğru/yanlış sayısını girin',
});

const sozel = lgs.tests.filter((t) => ['turkce', 'inkilap', 'din', 'dil'].includes(t.key));
const sayisal = lgs.tests.filter((t) => ['mat', 'fen'].includes(t.key));

const defaults: Partial<LgsInput> = { dy: {} };
const example: LgsInput = {
  dy: {
    turkce: { d: 18, y: 2 },
    inkilap: { d: 9, y: 1 },
    din: { d: 10, y: 0 },
    dil: { d: 8, y: 2 },
    mat: { d: 15, y: 3 },
    fen: { d: 17, y: 3 },
  },
};

function present(v: Parameters<typeof calculateLgs>[0]): ResultView {
  const r = calculateLgs(v);
  return {
    main: {
      label: 'Tahmini LGS puanı',
      value: num(r.puan, 3, 3),
      caption: `Tahmini · ${lgs.year - 2}–${lgs.year - 1} LGS sonuçlarına dayalı katsayılar · ${lgs.min}–${lgs.max} ölçeği`,
    },
    status: {
      tone: 'info',
      text: 'MEB puanı standart puanla hesaplar; aynı net farklı yıllarda farklı puan getirebilir.',
    },
    rows: [
      ...lgs.tests.map((t) => ({
        label: t.label,
        value: `${num(r.netler[t.key], 2)} net`,
        hint: `Katsayı ${t.weight} · ${v.dy[t.key].d} D, ${v.dy[t.key].y} Y`,
      })),
      { label: 'Toplam net', value: num(r.toplamNet, 2), tone: 'total' as const },
      { label: 'Ağırlıklı net', value: num(r.agirlikliNet, 2), tone: 'muted' as const, hint: 'Σ net × ders katsayısı' },
    ],
    notes: [
      `Hesap: ${num(r.taban, 2)} (taban) + Türkçe/Mat/Fen net × ${num(lgs.perNet[4], 2)} + diğer net × ${num(lgs.perNet[1], 2)}. 3 yanlış 1 doğruyu götürür.`,
      'Yüzdelik dilim ve sıralama tahmini yapılmaz.',
    ],
  };
}

export default function LgsPuanPage() {
  return (
    <CalculatorLayout
      slug="lgs-puan-hesaplama"
      schema={schema}
      defaults={defaults}
      example={example}
      compute={present}
      content={content}
      emptyHint="Derslerin doğru ve yanlış sayılarını girdikçe netleriniz ve tahmini LGS puanınız hesaplanır."
    >
      <DYTable tests={sozel} penalty={lgs.wrongPenalty} caption="Sözel bölüm (50 soru)" />
      <DYTable tests={sayisal} penalty={lgs.wrongPenalty} caption="Sayısal bölüm (40 soru)" />
    </CalculatorLayout>
  );
}
