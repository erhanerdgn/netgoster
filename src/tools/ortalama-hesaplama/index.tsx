import { useId } from 'react';
import { Controller, useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { CalculatorLayout } from '@/components/calc/CalculatorLayout';
import { ChoiceField, FieldShell, NumberInput, SelectField } from '@/components/calc/fields';
import type { ResultRow, ResultView } from '@/components/calc/ResultCard';
import { Button } from '@/components/ui/button';
import {
  agirlikliOrtalama,
  listeIstatistik,
  ortalamaSchema,
  sayilariOku,
  type AnaOlcu,
  type OrtalamaInput,
  type OrtalamaValues,
} from '@/calculators/ortalama';
import { num, pct } from '@/lib/format';
import content from './content.md';

const bos = () => ({ deger: undefined, agirlik: undefined });
const defaults: Partial<OrtalamaInput> = { mod: 'liste', ana: 'aritmetik', veriler: '', satirlar: [bos(), bos(), bos()] };
const example: OrtalamaInput = {
  mod: 'liste',
  ana: 'aritmetik',
  veriler: '72 85,5 90 64 85 78 85 91',
  satirlar: [
    { deger: 55, agirlik: 40 },
    { deger: 80, agirlik: 60 },
  ],
};

const n = (v: number) => num(v, 4);

const ANA: Record<AnaOlcu, string> = {
  aritmetik: 'Aritmetik ortalama',
  medyan: 'Medyan (ortanca)',
  mod: 'Mod (tepe değer)',
  geometrik: 'Geometrik ortalama',
  harmonik: 'Harmonik ortalama',
  ssOrneklem: 'Standart sapma (örneklem, s)',
  ssPopulasyon: 'Standart sapma (popülasyon, σ)',
  aralik: 'Aralık (en büyük − en küçük)',
};

function listeSonucu(v: Extract<OrtalamaValues, { mod: 'liste' }>): ResultView {
  const r = listeIstatistik(v.veriler);
  const tanimsiz = 'Tanımsız';
  const modMetni = r.modlar.length ? r.modlar.map(n).join('; ') : 'Yok';
  const deger: Record<AnaOlcu, string> = {
    aritmetik: n(r.aritmetik),
    medyan: n(r.medyan),
    mod: modMetni,
    geometrik: r.geometrik !== undefined ? n(r.geometrik) : tanimsiz,
    harmonik: r.harmonik !== undefined ? n(r.harmonik) : tanimsiz,
    ssOrneklem: r.ssOrneklem !== undefined ? n(r.ssOrneklem) : tanimsiz,
    ssPopulasyon: n(r.ssPopulasyon),
    aralik: n(r.aralik),
  };
  const satir = (k: AnaOlcu, hint?: string): ResultRow => ({
    label: ANA[k],
    value: deger[k],
    hint,
    tone: k === v.ana ? 'total' : undefined,
  });
  const caption: Record<AnaOlcu, string> = {
    aritmetik: `Toplam ${n(r.toplam)} ÷ ${num(r.n, 0)} değer`,
    medyan: r.n % 2 ? 'Sıralı listenin ortasındaki değer' : 'Ortadaki iki değerin ortalaması',
    mod: r.modlar.length ? `${num(r.modFrekans, 0)} kez tekrar ediyor` : 'Her değer bir kez geçiyor',
    geometrik: r.geometrik !== undefined ? 'n. dereceden kök (çarpım)^(1/n)' : 'Yalnız pozitif değerlerde tanımlı',
    harmonik: r.harmonik !== undefined ? 'n ÷ Σ(1/x)' : 'Yalnız pozitif değerlerde tanımlı',
    ssOrneklem: r.ssOrneklem !== undefined ? '√(Σ(x − ort)² ÷ (n − 1))' : 'En az 2 değer gerekir',
    ssPopulasyon: '√(Σ(x − ort)² ÷ n)',
    aralik: `${n(r.max)} − ${n(r.min)}`,
  };
  const kareler = r.varyansPopulasyon * r.n;
  return {
    main: { label: ANA[v.ana], value: deger[v.ana], caption: caption[v.ana] },
    rows: [
      { label: 'Değer sayısı (n)', value: num(r.n, 0), tone: 'muted' },
      { label: 'Toplam (Σx)', value: n(r.toplam), tone: 'muted' },
      satir('aritmetik'),
      satir('medyan'),
      satir('mod', r.modlar.length ? `${num(r.modFrekans, 0)} kez` : undefined),
      satir('geometrik', r.geometrik === undefined ? 'Sıfır/negatif değer var' : undefined),
      satir('harmonik', r.harmonik === undefined ? 'Sıfır/negatif değer var' : undefined),
      { label: 'En küçük / en büyük', value: `${n(r.min)} / ${n(r.max)}` },
      satir('aralik'),
      satir('ssOrneklem', 'n − 1 ile bölünür'),
      satir('ssPopulasyon', 'n ile bölünür'),
      {
        label: 'Varyans (örneklem / popülasyon)',
        value: `${r.varyansOrneklem !== undefined ? n(r.varyansOrneklem) : '—'} / ${n(r.varyansPopulasyon)}`,
        tone: 'muted',
      },
    ],
    notes: [
      'Verileriniz bir grubun tamamıysa (sınıftaki tüm öğrenciler) popülasyon, daha büyük bir kitleden alınmış örnekse (anket) örneklem standart sapmasını kullanın.',
    ],
    table:
      r.n > 1 && r.n <= 500
        ? {
            caption: 'Sıralı değerler ve ortalamadan sapmalar',
            columns: ['Sıra', 'Değer (x)', 'x − ortalama', '(x − ortalama)²'],
            rows: r.sirali.map((x, i) => [num(i + 1, 0), n(x), n(x - r.aritmetik), n((x - r.aritmetik) ** 2)]),
            footer: ['Toplam', n(r.toplam), '0', n(kareler)],
          }
        : undefined,
  };
}

function agirlikliSonucu(v: Extract<OrtalamaValues, { mod: 'agirlikli' }>): ResultView {
  const r = agirlikliOrtalama(v.satirlar);
  return {
    main: {
      label: 'Ağırlıklı ortalama',
      value: n(r.ortalama),
      caption: `${n(r.carpimToplam)} ÷ ${n(r.agirlikToplam)}`,
    },
    rows: [
      { label: 'Formül', value: 'Σ(değer × ağırlık) ÷ Σ ağırlık', tone: 'muted' },
      { label: 'Σ(değer × ağırlık)', value: n(r.carpimToplam) },
      { label: 'Σ ağırlık', value: n(r.agirlikToplam) },
      { label: 'Ağırlıklı ortalama', value: n(r.ortalama), tone: 'total' },
      { label: 'Ağırlıksız (basit) ortalama', value: n(r.basit), hint: 'Karşılaştırma için', tone: 'muted' },
    ],
    table: {
      caption: 'Satır satır ağırlıklı ortalama',
      columns: ['Satır', 'Değer', 'Ağırlık', 'Değer × ağırlık', 'Ağırlık payı'],
      rows: r.satirlar.map((s, i) => [num(i + 1, 0), n(s.deger), n(s.agirlik), n(s.carpim), pct(s.pay)]),
      footer: ['Toplam', '', n(r.agirlikToplam), n(r.carpimToplam), '%100'],
    },
  };
}

const present = (v: OrtalamaValues): ResultView => (v.mod === 'liste' ? listeSonucu(v) : agirlikliSonucu(v));

function VeriAlani() {
  const id = useId();
  const { register, getFieldState, formState } = useFormContext<OrtalamaInput>();
  const metin = useWatch<OrtalamaInput, 'veriler'>({ name: 'veriler' }) ?? '';
  const error = getFieldState('veriler', formState).error?.message;
  const { sayilar, hatali } = sayilariOku(metin);
  const sayac = metin.trim()
    ? `${num(sayilar.length, 0)} sayı okundu${hatali.length ? `, ${num(hatali.length, 0)} değer okunamadı` : ''}. `
    : '';
  return (
    <FieldShell
      id={id}
      label="Sayılar"
      className="sm:col-span-2"
      error={error}
      hint={`${sayac}Sayıları boşluk, alt satır, noktalı virgül (;) ya da “virgül + boşluk” ile ayırın. Ondalık için virgül: 3,5 (3.5 de olur).`}
      help="Excel veya not defterinden kopyalayıp yapıştırabilirsiniz. Türkçe biçim (1.250,75) tanınır; noktadan sonra tam üç rakam varsa (1.250) nokta binlik ayraç sayılır. Boşluksuz 10,20,30 yazımı virgülle ayrılmış liste kabul edilir."
    >
      <textarea
        id={id}
        {...register('veriler')}
        rows={5}
        inputMode="decimal"
        autoComplete="off"
        spellCheck={false}
        placeholder={'Örn. 72 85,5 90 64 85 78\nveya her satıra bir sayı'}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : `${id}-hint`}
        className="tabular w-full min-w-0 resize-y rounded-lg border border-input bg-card px-3 py-2 text-base shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive dark:bg-input/30"
      />
    </FieldShell>
  );
}

const cols = 'grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_2.75rem] items-start gap-2';

function AgirlikSatirlari() {
  const id = useId();
  const { control, formState } = useFormContext<OrtalamaInput>();
  const { fields, append, remove } = useFieldArray({ control, name: 'satirlar' });
  const e = formState.errors.satirlar;
  const listError = e?.root?.message ?? e?.message;
  return (
    <fieldset className="sm:col-span-2">
      <legend className="mb-1 text-sm font-semibold">Değerler ve ağırlıkları</legend>
      <div className={`${cols} pb-1 text-xs font-medium text-muted-foreground`} aria-hidden>
        <span>Değer (not, fiyat…)</span>
        <span>Ağırlık (%, kredi, adet…)</span>
        <span />
      </div>
      <div className="space-y-2">
        {fields.map((f, i) => (
          <div key={f.id} className={cols}>
            <Controller
              control={control}
              name={`satirlar.${i}.deger`}
              render={({ field }) => (
                <NumberInput
                  id={`${id}-d${i}`}
                  label={`${i + 1}. değer`}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  inputRef={field.ref}
                  decimals={4}
                  allowNegative
                  placeholder={i === 0 ? 'Örn. 55' : ''}
                />
              )}
            />
            <Controller
              control={control}
              name={`satirlar.${i}.agirlik`}
              render={({ field }) => (
                <NumberInput
                  id={`${id}-a${i}`}
                  label={`${i + 1}. ağırlık`}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  inputRef={field.ref}
                  decimals={4}
                  placeholder={i === 0 ? 'Örn. 40' : ''}
                />
              )}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-11 text-muted-foreground hover:text-destructive"
              aria-label={`${i + 1}. satırı sil`}
              disabled={fields.length === 1}
              onClick={() => remove(i)}
            >
              <Trash2 aria-hidden />
            </Button>
          </div>
        ))}
      </div>
      {listError && (
        <p role="alert" className="mt-2 text-sm font-medium text-destructive">
          {listError}
        </p>
      )}
      <Button type="button" variant="outline" className="mt-3 h-11" disabled={fields.length >= 50} onClick={() => append(bos())}>
        <Plus aria-hidden /> Satır ekle
      </Button>
      <p className="mt-2 text-xs text-muted-foreground">
        Değeri ya da ağırlığı boş satırlar hesaba katılmaz. Ağırlıkların toplamının 100 olması gerekmez.
      </p>
    </fieldset>
  );
}

function Fields() {
  const mod = useWatch<OrtalamaInput, 'mod'>({ name: 'mod' }) ?? 'liste';
  return (
    <>
      <ChoiceField<OrtalamaInput>
        name="mod"
        label="Hesaplama türü"
        className="sm:col-span-2"
        options={[
          { value: 'liste', label: 'Sayı listesi' },
          { value: 'agirlikli', label: 'Ağırlıklı ortalama' },
        ]}
        help="Sayı listesi: aritmetik, geometrik, harmonik ortalama, medyan, mod, aralık ve standart sapmayı birlikte verir. Ağırlıklı ortalama: her değerin farklı önemde (ağırlıkta) olduğu durumlar, ör. vize %40 final %60."
      />
      {mod === 'liste' ? (
        <>
          <VeriAlani />
          <SelectField<OrtalamaInput>
            name="ana"
            label="Öne çıkan sonuç"
            className="sm:col-span-2"
            options={Object.entries(ANA).map(([value, label]) => ({ value, label }))}
            help="Büyük gösterilecek ölçü. Diğer tüm ölçüler sonuç kartında ayrıca listelenir."
          />
        </>
      ) : (
        <AgirlikSatirlari />
      )}
    </>
  );
}

export default function OrtalamaHesaplamaPage() {
  return (
    <CalculatorLayout
      slug="ortalama-hesaplama"
      schema={ortalamaSchema}
      defaults={defaults}
      example={example}
      compute={present}
      content={content}
      emptyHint="Sayıları yazdıkça ortalama, medyan, mod ve standart sapma anında hesaplanır."
    >
      <Fields />
    </CalculatorLayout>
  );
}
