import { useId } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { CalculatorLayout } from '@/components/calc/CalculatorLayout';
import { ChoiceField, FieldShell, NumberField } from '@/components/calc/fields';
import type { ResultView } from '@/components/calc/ResultCard';
import { Input } from '@/components/ui/input';
import { calculateRomaRakami, romaRakamiSchema, type RomaRakamiInput, type RomaRakamiValues } from '@/calculators/romaRakami';
import { todayISO } from '@/config/period';
import content from './content.md';

const yil = Number(todayISO().slice(0, 4));
const defaults: Partial<RomaRakamiInput> = { yon: 'sayi', sayi: yil, roma: '' };
const example: RomaRakamiInput = { yon: 'roma', sayi: 1923, roma: 'MCMXXIII' };

const basamak = (d: number) => (d >= 1000 ? 'Binler' : d >= 100 ? 'Yüzler' : d >= 10 ? 'Onlar' : 'Birler');

function present(v: RomaRakamiValues): ResultView {
  const r = calculateRomaRakami(v);
  const toplam = r.adimlar.map((p) => p.deger).join(' + ');
  const harfler = r.adimlar.map((p) => p.roma).join(' + ');
  return {
    main:
      v.yon === 'sayi'
        ? { label: `${r.sayi} Roma rakamıyla`, value: r.roma, caption: harfler }
        : { label: `${r.roma} kaç eder?`, value: String(r.sayi), caption: toplam },
    rows: [
      ...r.adimlar.map((p) => ({ label: `${basamak(p.deger)}: ${p.roma}`, value: String(p.deger) })),
      { label: 'Toplam', value: `${r.roma} = ${r.sayi}`, tone: 'total' as const },
    ],
    status: { tone: 'info', text: `${r.sayi} = ${toplam} = ${harfler}` },
    notes: [
      'Sayı basamaklarına ayrılır ve her basamak ayrı yazılır; 4, 9, 40, 90, 400 ve 900 çıkarma yoluyla (IV, IX, XL, XC, CD, CM) gösterilir. Aynı harf en fazla 3 kez yan yana gelir; V, L ve D tekrarlanmaz.',
    ],
  };
}

function RomaField() {
  const id = useId();
  const { register, getFieldState, formState } = useFormContext<RomaRakamiInput>();
  const error = getFieldState('roma', formState).error?.message;
  return (
    <FieldShell
      id={id}
      label="Roma rakamı"
      help="I, V, X, L, C, D ve M harfleriyle yazın. Küçük harf ve Türkçe ı/i de kabul edilir (mmxxvi = MMXXVI)."
      hint="Örn. MCMXXIII, XIV, CDLIV"
      error={error}
      className="sm:col-span-2"
    >
      <Input
        id={id}
        {...register('roma')}
        autoComplete="off"
        autoCapitalize="characters"
        spellCheck={false}
        placeholder="Örn. MMXXVI"
        aria-invalid={!!error || undefined}
        aria-describedby={error ? `${id}-error` : `${id}-hint`}
        className="text-base tracking-wider uppercase"
      />
    </FieldShell>
  );
}

function Fields() {
  const yon = useWatch<RomaRakamiInput, 'yon'>({ name: 'yon' });
  return (
    <>
      <ChoiceField<RomaRakamiInput>
        name="yon"
        label="Çeviri yönü"
        className="sm:col-span-2"
        options={[
          { value: 'sayi', label: 'Sayı → Roma' },
          { value: 'roma', label: 'Roma → Sayı' },
        ]}
        help="Bir sayıyı Roma rakamıyla yazmak mı, yoksa bir Roma rakamının değerini bulmak mı istiyorsunuz?"
      />
      {yon === 'roma' ? (
        <RomaField />
      ) : (
        <NumberField<RomaRakamiInput>
          name="sayi"
          label="Sayı"
          decimals={0}
          placeholder="1–3999"
          className="sm:col-span-2"
          help="1 ile 3999 arasında bir tam sayı. Standart Roma rakamlarında sıfır ve 3999’dan büyük sayı yoktur."
        />
      )}
    </>
  );
}

export default function RomaRakamiCeviriciPage() {
  return (
    <CalculatorLayout
      slug="roma-rakami-cevirici"
      schema={romaRakamiSchema}
      defaults={defaults}
      example={example}
      compute={present}
      content={content}
      emptyHint="Bir sayı ya da Roma rakamı girin; karşılığı ve adım adım dökümü anında gösterilsin."
    >
      <Fields />
    </CalculatorLayout>
  );
}
