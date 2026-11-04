import { CalculatorLayout, type Source } from '@/components/calc/CalculatorLayout';
import { ChoiceField, NumberField, SelectField } from '@/components/calc/fields';
import type { ResultView } from '@/components/calc/ResultCard';
import { AKTIVITE, calculateKalori, HEDEF, kaloriSchema, MAKRO, type KaloriInput } from '@/calculators/kalori';
import { num, pct } from '@/lib/format';
import content from './content.md';

const defaults: Partial<KaloriInput> = { cinsiyet: 'kadin', aktivite: 'hafif', hedef: 'koru' };
const example: KaloriInput = { cinsiyet: 'erkek', yas: 30, boy: 180, kilo: 80, aktivite: 'orta', hedef: 'koru' };

const sources: Source[] = [
  {
    label:
      'Mifflin MD, St Jeor ST ve ark. A new predictive equation for resting energy expenditure in healthy individuals. Am J Clin Nutr. 1990;51(2):241-7',
    url: 'https://pubmed.ncbi.nlm.nih.gov/2305711/',
  },
  {
    label:
      'National Academies — Dietary Reference Intakes for Energy, Carbohydrate, Fiber, Fat, Fatty Acids, Cholesterol, Protein, and Amino Acids (AMDR)',
    url: 'https://nap.nationalacademies.org/catalog/10490/dietary-reference-intakes-for-energy-carbohydrate-fiber-fat-fatty-acids-cholesterol-protein-and-amino-acids',
  },
  {
    label: 'NIH NIDDK — Body Weight Planner',
    url: 'https://www.niddk.nih.gov/bwp',
  },
  {
    label: 'T.C. Sağlık Bakanlığı — Türkiye Beslenme Rehberi (TÜBER 2022)',
    url: 'https://hsgm.saglik.gov.tr/media/attachments/2025/05/12/turkiye-beslenme-rehberi-2022.pdf',
  },
];

const kcal = (n: number) => `${num(n, 0)} kcal`;
const hedefAd = { koru: 'Kiloyu korumak', ver: 'Kilo vermek (≈ 0,5 kg/hafta)', al: 'Kilo almak (≈ 0,5 kg/hafta)' } as const;

function present(v: Parameters<typeof calculateKalori>[0]): ResultView {
  const r = calculateKalori(v);
  const a = AKTIVITE[v.aktivite];
  return {
    main: {
      label: 'Günlük kalori ihtiyacınız',
      value: `${kcal(r.hedefKcal)}/gün`,
      caption: `${hedefAd[v.hedef]} · ${a.ad} (×${num(a.k, 3)})`,
    },
    status: r.bmrAlti
      ? {
          tone: 'warn',
          text: 'Hedef kaloriniz bazal metabolizma hızınızın altında. Bu düzeyde uzun süreli diyet için bir hekim veya diyetisyene danışın.',
        }
      : {
          tone: 'info',
          text: 'Sonuç bir tahmindir; gerçek ihtiyaç kişiden kişiye yaklaşık ±%10 değişebilir. Kilonuzu 2–3 hafta izleyerek ayarlayın.',
        },
    rows: [
      { label: 'Bazal metabolizma hızı (BMR)', value: kcal(r.bmr), hint: 'Mifflin-St Jeor, tam dinlenmede' },
      { label: 'Koruma kalorisi (TDEE)', value: kcal(r.tdee), hint: `BMR × ${num(a.k, 3)}` },
      ...(v.hedef !== 'koru'
        ? [
            {
              label: 'Hedef farkı',
              value: `${HEDEF[v.hedef] > 0 ? '+' : ''}${kcal(Math.abs(HEDEF[v.hedef]))}`,
              tone: (HEDEF[v.hedef] > 0 ? 'plus' : 'minus') as 'plus' | 'minus',
            },
          ]
        : []),
      { label: 'Günlük hedef', value: kcal(r.hedefKcal), tone: 'total' },
    ],
    extra: (
      <section aria-label="Makro besin dağılımı önerisi" className="rounded-2xl border bg-card p-4 shadow-soft">
        <h2 className="font-semibold">Makro besin dağılımı önerisi</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          IOM kabul edilebilir aralıklarının (protein %10–35, yağ %20–35, karbonhidrat %45–65) orta değerleri.
        </p>
        <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
          {(
            [
              ['Protein', r.makro.protein, MAKRO.protein],
              ['Yağ', r.makro.yag, MAKRO.yag],
              ['Karbonhidrat', r.makro.karbonhidrat, MAKRO.karbonhidrat],
            ] as const
          ).map(([ad, g, p]) => (
            <div key={ad} className="rounded-xl bg-muted px-2 py-3">
              <dt className="text-xs text-muted-foreground">
                {ad} ({pct(p)})
              </dt>
              <dd className="tabular mt-1 text-lg font-semibold">{num(g, 0)} g</dd>
            </div>
          ))}
        </dl>
      </section>
    ),
    table: {
      caption: 'Aktivite düzeyine göre günlük kalori ihtiyacı',
      columns: ['Aktivite düzeyi', 'Katsayı', 'Kiloyu korumak', 'Kilo vermek', 'Kilo almak'],
      rows: r.seviyeler.map((s) => [
        `${AKTIVITE[s.id].ad}${s.id === v.aktivite ? ' ◀' : ''}`,
        `×${num(AKTIVITE[s.id].k, 3)}`,
        kcal(s.tdee),
        kcal(s.tdee + HEDEF.ver),
        kcal(s.tdee + HEDEF.al),
      ]),
    },
    notes: [
      'Formül gebelik, emzirme, 18 yaş altı, ileri derecede obezite veya kronik hastalık durumlarında yanıltıcı olabilir. Tıbbi beslenme tedavisinin yerini tutmaz.',
    ],
  };
}

export default function KaloriIhtiyaciPage() {
  return (
    <CalculatorLayout
      slug="kalori-ihtiyaci-hesaplama"
      schema={kaloriSchema}
      defaults={defaults}
      example={example}
      compute={present}
      content={content}
      sources={sources}
      emptyHint="Yaş, boy, kilo ve aktivite düzeyinizi girdiğiniz anda günlük kalori ihtiyacınız hesaplanır."
    >
      <ChoiceField<KaloriInput>
        name="cinsiyet"
        label="Cinsiyet"
        options={[
          { value: 'kadin', label: 'Kadın' },
          { value: 'erkek', label: 'Erkek' },
        ]}
      />
      <NumberField<KaloriInput> name="yas" label="Yaş" unit="yıl" decimals={0} placeholder="Örn. 30" />
      <NumberField<KaloriInput> name="boy" label="Boy" unit="cm" decimals={0} placeholder="Örn. 170" />
      <NumberField<KaloriInput> name="kilo" label="Kilo" unit="kg" decimals={1} placeholder="Örn. 70" />
      <SelectField<KaloriInput>
        name="aktivite"
        label="Aktivite düzeyi"
        help="Günlük işiniz ve egzersiz alışkanlığınıza en yakın seçeneği seçin. Emin değilseniz bir alt düzeyi seçmek daha gerçekçi sonuç verir."
        options={(Object.keys(AKTIVITE) as (keyof typeof AKTIVITE)[]).map((k) => ({
          value: k,
          label: `${AKTIVITE[k].ad} — ${AKTIVITE[k].aciklama}`,
        }))}
        className="sm:col-span-2"
      />
      <ChoiceField<KaloriInput>
        name="hedef"
        label="Hedef"
        help="Kilo vermek veya almak için günlük ihtiyaca yaklaşık 500 kcal açık ya da fazlalık eklenir; bu, haftada yaklaşık 0,5 kg değişime karşılık gelir."
        options={[
          { value: 'ver', label: 'Kilo ver' },
          { value: 'koru', label: 'Koru' },
          { value: 'al', label: 'Kilo al' },
        ]}
        className="sm:col-span-2"
      />
    </CalculatorLayout>
  );
}
