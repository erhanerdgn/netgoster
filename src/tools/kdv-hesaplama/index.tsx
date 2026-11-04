import { useWatch } from 'react-hook-form';
import { CalculatorLayout } from '@/components/calc/CalculatorLayout';
import { ChoiceField, NumberField } from '@/components/calc/fields';
import type { ResultView } from '@/components/calc/ResultCard';
import { calculateKdv, kdvSchema, yasalKdvOranlari, type KdvInput } from '@/calculators/kdv';
import { pctValue, tl } from '@/lib/format';
import content from './content.md';

const oranlar = yasalKdvOranlari();
const defaults: Partial<KdvInput> = { yon: 'haricten', oran: '2' };
const example: KdvInput = { yon: 'dahilden', tutar: 2499.9, oran: '2', digerOran: 18 };

function present(v: Parameters<typeof calculateKdv>[0]): ResultView {
  const r = calculateKdv(v);
  const haricten = v.yon === 'haricten';
  return {
    main: haricten
      ? { label: 'KDV dahil tutar', value: tl(r.dahil), caption: `${pctValue(r.oran)} KDV ile` }
      : { label: 'KDV hariç tutar', value: tl(r.haric), caption: `${pctValue(r.oran)} KDV dahil ${tl(r.dahil)} içinden` },
    rows: [
      { label: 'KDV hariç tutar (matrah)', value: tl(r.haric) },
      { label: `KDV tutarı (${pctValue(r.oran)})`, value: tl(r.kdv), tone: 'plus' },
      { label: 'KDV dahil tutar', value: tl(r.dahil), tone: 'total' },
    ],
    status:
      v.oran === 'diger' && !oranlar.includes(r.oran)
        ? {
            tone: 'warn',
            text: `${pctValue(r.oran)} yürürlükteki KDV oranlarından (${oranlar.map((o) => pctValue(o)).join(', ')}) biri değil.`,
          }
        : undefined,
    notes: [
      haricten
        ? 'KDV tutarı kuruşa yuvarlanır; dahil tutar = hariç tutar + KDV.'
        : 'Hariç tutar kuruşa yuvarlanır, KDV aradaki farktır; böylece hariç tutar + KDV, girdiğiniz dahil tutara kuruşu kuruşuna eşittir.',
    ],
  };
}

function DigerOran() {
  const oran = useWatch<KdvInput, 'oran'>({ name: 'oran' });
  if (oran !== 'diger') return null;
  return (
    <NumberField<KdvInput>
      name="digerOran"
      label="KDV oranı"
      unit="%"
      placeholder="Örn. 18"
      help="Geçmiş dönem faturaları veya özel durumlar için oranı elle girin (ör. 2023 öncesi %18 ve %8)."
    />
  );
}

export default function KdvHesaplamaPage() {
  return (
    <CalculatorLayout
      slug="kdv-hesaplama"
      schema={kdvSchema}
      defaults={defaults}
      example={example}
      compute={present}
      content={content}
      emptyHint="Tutarı girdiğiniz anda KDV tutarı ile KDV hariç ve dahil toplam hesaplanır."
    >
      <ChoiceField<KdvInput>
        name="yon"
        label="Hesaplama yönü"
        className="sm:col-span-2"
        options={[
          { value: 'haricten', label: 'KDV hariçten dahile' },
          { value: 'dahilden', label: 'KDV dahilden hariçe' },
        ]}
        help="Elinizdeki tutar vergisiz (matrah) ise “hariçten dahile”, fiyata KDV zaten eklenmişse “dahilden hariçe” seçin."
      />
      <NumberField<KdvInput>
        name="tutar"
        label="Tutar"
        unit="₺"
        placeholder="Örn. 1.000"
        className="sm:col-span-2"
        help="Seçtiğiniz yöne göre KDV hariç (matrah) veya KDV dahil tutar."
      />
      <ChoiceField<KdvInput>
        name="oran"
        label="KDV oranı"
        className="sm:col-span-2"
        options={[...oranlar.map((o, i) => ({ value: String(i), label: pctValue(o) })), { value: 'diger', label: 'Diğer' }]}
        help={`Genel oran ${pctValue(oranlar[2])}; temel gıda gibi (I) sayılı liste ürünleri ${pctValue(oranlar[0])}, (II) sayılı liste ${pctValue(oranlar[1])}.`}
      />
      <DigerOran />
    </CalculatorLayout>
  );
}
