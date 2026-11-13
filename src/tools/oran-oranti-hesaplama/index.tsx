import { useWatch } from 'react-hook-form';
import { CalculatorLayout } from '@/components/calc/CalculatorLayout';
import { ChoiceField, NumberField } from '@/components/calc/fields';
import type { ResultView } from '@/components/calc/ResultCard';
import {
  calculateOranOranti,
  oranOrantiSchema,
  type OranOrantiInput,
  type OranOrantiValues,
  type OrantiSonucu,
  type SadeSonucu,
} from '@/calculators/oranOranti';
import { num, pct } from '@/lib/format';
import content from './content.md';

const defaults: Partial<OranOrantiInput> = { mod: 'dogru' };
const example: OranOrantiInput = { mod: 'dogru', a: 3, b: 150, c: 5 };

const n = (v: number) => num(v, 6);

const LABELS: Record<
  OranOrantiValues['mod'],
  { a: string; b: string; c?: string; aHelp: string; bHelp: string; cHelp?: string }
> = {
  dogru: {
    a: 'Bilinen miktar (a)',
    b: 'a’nın karşılığı (b)',
    c: 'Yeni miktar (c)',
    aHelp: 'Bildiğiniz durumdaki miktar. Örn. 3 kg elma.',
    bHelp: 'a miktarının karşılığı. Örn. 3 kg elmanın fiyatı 150 TL.',
    cHelp: 'Karşılığını bulmak istediğiniz yeni miktar. Örn. 5 kg. Sonuç x = b × c ÷ a.',
  },
  ters: {
    a: 'Bilinen miktar (a)',
    b: 'a’ya karşılık gelen (b)',
    c: 'Yeni miktar (c)',
    aHelp: 'Bildiğiniz durumdaki miktar. Örn. 6 işçi.',
    bHelp: 'a ile birlikte bilinen değer. Örn. 6 işçi işi 10 günde bitiriyor.',
    cHelp: 'Yeni durumdaki miktar. Örn. 4 işçi. Sonuç x = a × b ÷ c.',
  },
  sadelestir: {
    a: 'Birinci sayı (a)',
    b: 'İkinci sayı (b)',
    aHelp: 'a : b oranının birinci terimi. Ondalık olabilir (1,5).',
    bHelp: 'a : b oranının ikinci terimi. Ondalık olabilir (2,25).',
  },
};

function present(v: OranOrantiValues): ResultView {
  const r = calculateOranOranti(v);
  if (r.mod === 'sadelestir') {
    const s = r as SadeSonucu;
    const ta = Math.round(v.a * s.carpan);
    const tb = Math.round(v.b * s.carpan);
    return {
      main: { label: `${n(v.a)} : ${n(v.b)} oranının en sade hali`, value: `${num(s.p, 0)} : ${num(s.q, 0)}` },
      rows: [
        ...(s.carpan > 1
          ? [{ label: `Adım 1: ondalıkları atmak için × ${num(s.carpan, 0)}`, value: `${num(ta, 0)} : ${num(tb, 0)}` }]
          : []),
        { label: `${s.carpan > 1 ? 'Adım 2' : 'Adım 1'}: EBOB(${num(ta, 0)}, ${num(tb, 0)})`, value: num(s.ebob, 0) },
        {
          label: `${s.carpan > 1 ? 'Adım 3' : 'Adım 2'}: EBOB’a böl`,
          value: `${num(ta, 0)} ÷ ${num(s.ebob, 0)} : ${num(tb, 0)} ÷ ${num(s.ebob, 0)}`,
        },
        { label: 'Sade oran', value: `${num(s.p, 0)} : ${num(s.q, 0)}`, tone: 'total' },
        { label: 'Ondalık değeri (a ÷ b)', value: n(s.ondalik), tone: 'muted' },
        {
          label: 'Toplam içindeki paylar',
          value: `${pct(s.payA)} / ${pct(1 - s.payA)}`,
          hint: `a + b = ${n(v.a + v.b)} paylaştırılırsa`,
          tone: 'muted',
        },
      ],
      status:
        s.ebob === 1 && s.carpan === 1
          ? { tone: 'info', text: `${n(v.a)} ve ${n(v.b)} aralarında asal: oran zaten en sade halinde.` }
          : undefined,
    };
  }
  const o = r as OrantiSonucu;
  const c = (v as { c: number }).c;
  if (o.mod === 'dogru') {
    return {
      main: { label: `${n(v.a)} için ${n(v.b)} ise ${n(c)} için`, value: n(o.x), caption: 'Doğru orantı: a ÷ b = c ÷ x' },
      status: { tone: 'info', text: 'Doğru orantı: miktar artınca karşılığı da aynı oranda artar (miktar–fiyat, kişi–malzeme).' },
      rows: [
        { label: 'Formül', value: 'x = b × c ÷ a', tone: 'muted' },
        { label: 'Adım 1: b × c', value: `${n(v.b)} × ${n(c)} = ${n(v.b * c)}` },
        { label: 'Adım 2: ÷ a', value: `${n(v.b * c)} ÷ ${n(v.a)} = ${n(o.x)}` },
        { label: 'x', value: n(o.x), tone: 'total' },
        { label: 'Birim oran (b ÷ a)', value: n(o.k), hint: '1 birim a’nın karşılığı', tone: 'muted' },
        { label: 'Sağlama', value: `${n(c)} × ${n(o.k)} = ${n(o.x)}`, tone: 'muted' },
      ],
    };
  }
  return {
    main: { label: `${n(v.a)} ile ${n(v.b)} ise ${n(c)} ile`, value: n(o.x), caption: 'Ters orantı: a × b = c × x' },
    status: { tone: 'info', text: 'Ters orantı: biri artınca diğeri aynı oranda azalır (işçi–gün, hız–süre).' },
    rows: [
      { label: 'Formül', value: 'x = a × b ÷ c', tone: 'muted' },
      { label: 'Adım 1: a × b (sabit çarpım)', value: `${n(v.a)} × ${n(v.b)} = ${n(o.k)}` },
      { label: 'Adım 2: ÷ c', value: `${n(o.k)} ÷ ${n(c)} = ${n(o.x)}` },
      { label: 'x', value: n(o.x), tone: 'total' },
      { label: 'Sağlama', value: `${n(c)} × ${n(o.x)} = ${n(o.k)}`, tone: 'muted' },
    ],
  };
}

function Fields() {
  const mod = useWatch<OranOrantiInput, 'mod'>({ name: 'mod' }) ?? 'dogru';
  const l = LABELS[mod];
  return (
    <>
      <ChoiceField<OranOrantiInput>
        name="mod"
        label="Hesaplama türü"
        className="sm:col-span-2"
        options={[
          { value: 'dogru', label: 'Doğru orantı' },
          { value: 'ters', label: 'Ters orantı' },
          { value: 'sadelestir', label: 'Oran sadeleştir' },
        ]}
        help="Doğru orantı: biri artınca diğeri de artar (3 kg 150 TL ise 5 kg?). Ters orantı: biri artınca diğeri azalır (6 işçi 10 gün ise 4 işçi?). Sadeleştir: a : b oranını EBOB ile en küçük tam sayılara indirir."
      />
      <NumberField<OranOrantiInput>
        name="a"
        label={l.a}
        decimals={6}
        placeholder={mod === 'ters' ? 'Örn. 6' : 'Örn. 3'}
        help={l.aHelp}
      />
      <NumberField<OranOrantiInput>
        name="b"
        label={l.b}
        decimals={6}
        placeholder={mod === 'ters' ? 'Örn. 10' : 'Örn. 150'}
        help={l.bHelp}
      />
      {l.c && (
        <NumberField<OranOrantiInput>
          name="c"
          label={l.c}
          decimals={6}
          placeholder={mod === 'ters' ? 'Örn. 4' : 'Örn. 5'}
          help={l.cHelp}
          hint={mod === 'dogru' ? 'a ise b, c ise x kaç?' : 'a × b = c × x'}
        />
      )}
    </>
  );
}

export default function OranOrantiHesaplamaPage() {
  return (
    <CalculatorLayout
      slug="oran-oranti-hesaplama"
      schema={oranOrantiSchema}
      defaults={defaults}
      example={example}
      compute={present}
      content={content}
      emptyHint="Orantı türünü seçip üç bilinen değeri girdiğinizde x ve adım adım çözüm görünür."
    >
      <Fields />
    </CalculatorLayout>
  );
}
