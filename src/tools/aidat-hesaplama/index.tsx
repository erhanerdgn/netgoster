import { useId } from 'react';
import { Controller, useFieldArray, useFormContext, useWatch, type FieldPath } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { CalculatorLayout } from '@/components/calc/CalculatorLayout';
import { ChoiceField, HelpTip, NumberField, NumberInput } from '@/components/calc/fields';
import type { ResultView } from '@/components/calc/ResultCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { aidatSchema, calculateAidat, type AidatInput } from '@/calculators/aidat';
import { num, pct, tl } from '@/lib/format';
import content from './content.md';

const daire = (i: number) => ({ ad: `Daire ${i + 1}` });
const defaults: Partial<AidatInput> = {
  giderModu: 'toplam',
  yontem: 'esit',
  kalemler: [{ ad: 'Kapıcı' }, { ad: 'Ortak alan elektriği' }, { ad: 'Temizlik' }, { ad: 'Asansör bakımı' }],
  daireler: Array.from({ length: 6 }, (_, i) => daire(i)),
};
const ornekPay = [80, 80, 100, 100, 100, 100, 120, 120];
const example: AidatInput = {
  giderModu: 'kalem',
  toplamGider: 24000,
  yontem: 'arsa',
  kalemler: [
    { ad: 'Kapıcı', tutar: 12500 },
    { ad: 'Ortak alan elektriği', tutar: 2350.75 },
    { ad: 'Temizlik malzemesi', tutar: 1200 },
    { ad: 'Asansör bakımı', tutar: 3000 },
  ],
  daireler: ornekPay.map((p, i) => ({ ...daire(i), arsaPayi: p, m2: p })),
};

const yontemAdi = { esit: 'eşit', arsa: 'arsa payı oranında', m2: 'metrekare oranında' } as const;

function present(v: Parameters<typeof calculateAidat>[0]): ResultView {
  const r = calculateAidat(v);
  const n = r.satirlar.length;
  const aylik = r.satirlar.map((s) => s.aylik);
  const artik = r.artikDaire >= 0 ? r.satirlar[r.artikDaire] : null;
  return {
    main:
      v.yontem === 'esit'
        ? { label: 'Daire başı aylık aidat', value: tl(Math.min(...aylik)), caption: `${n} daireye eşit paylaştırıldı` }
        : { label: 'Toplam aylık gider', value: tl(r.toplamAylik), caption: `${n} daireye ${yontemAdi[v.yontem]} paylaştırıldı` },
    rows: [
      { label: 'Toplam aylık gider', value: tl(r.toplamAylik) },
      { label: 'Toplam yıllık gider', value: tl(r.toplamYillik) },
      { label: 'Daire sayısı', value: num(n) },
      ...(v.yontem === 'esit'
        ? []
        : [
            { label: 'En düşük aylık aidat', value: tl(Math.min(...aylik)), tone: 'muted' as const },
            { label: 'En yüksek aylık aidat', value: tl(Math.max(...aylik)), tone: 'muted' as const },
          ]),
      { label: 'Dairelerin aylık toplamı', value: tl(r.toplamAylik), tone: 'total' },
    ],
    status: artik
      ? {
          tone: 'info',
          text:
            artik.artikKurus > 0
              ? `Kuruş yuvarlamasından eksik kalan ${tl(artik.artikKurus / 100)}, ${artik.ad} aidatına eklendi; toplam gidere birebir eşittir.`
              : `Kuruş yuvarlamasından fazla çıkan ${tl(-artik.artikKurus / 100)}, ${artik.ad} aidatından düşüldü; toplam gidere birebir eşittir.`,
        }
      : { tone: 'ok', text: 'Daire aidatlarının toplamı aylık gidere kuruşu kuruşuna eşittir.' },
    table: {
      caption: 'Daire bazlı aidat tablosu',
      columns: ['Daire', 'Pay oranı', 'Aylık aidat', 'Yıllık aidat'],
      rows: r.satirlar.map((s) => [s.ad, pct(s.oran, 2), tl(s.aylik), tl(s.yillik)]),
      footer: ['Toplam', '%100', tl(r.toplamAylik), tl(r.toplamYillik)],
    },
    notes: [
      'KMK md. 20: yönetim planında aksi yazmıyorsa kapıcı, kaloriferci, bahçıvan ve bekçi giderleri eşit; sigorta, ortak yerlerin bakım-onarımı ve yönetici ücreti gibi giderler arsa payı oranında paylaşılır. Gider türleri farklı yöntemlere tabiyse her grubu ayrı hesaplayıp toplayın.',
    ],
  };
}

function RowError({ name }: { name: FieldPath<AidatInput> }) {
  const { getFieldState, formState } = useFormContext<AidatInput>();
  const msg = getFieldState(name, formState).error?.message;
  return msg ? (
    <p role="alert" className="col-span-full text-sm font-medium text-destructive">
      {msg}
    </p>
  ) : null;
}

/** Dizi düzeyindeki hata (zodResolver alan dizilerinde `root` altına yazar) */
function KalemlerError() {
  const { formState } = useFormContext<AidatInput>();
  const e = formState.errors.kalemler;
  const msg = e?.root?.message ?? e?.message;
  return msg ? (
    <p role="alert" className="text-sm font-medium text-destructive">
      {msg}
    </p>
  ) : null;
}

function Kalemler() {
  const id = useId();
  const { control, register } = useFormContext<AidatInput>();
  const mod = useWatch<AidatInput, 'giderModu'>({ name: 'giderModu' });
  const kalemler = useWatch<AidatInput, 'kalemler'>({ name: 'kalemler' }) ?? [];
  const { fields, append, remove } = useFieldArray({ control, name: 'kalemler' });
  if (mod !== 'kalem') {
    return (
      <NumberField<AidatInput>
        name="toplamGider"
        label="Toplam aylık gider"
        unit="₺"
        placeholder="Örn. 24.000"
        className="sm:col-span-2"
        help="Apartmanın bir aylık tüm ortak giderleri: kapıcı, elektrik, su, temizlik, asansör bakımı, sigorta, yönetici ücreti vb."
      />
    );
  }
  const toplam = kalemler.reduce((s, k) => s + Math.round((k?.tutar ?? 0) * 100), 0) / 100;
  return (
    <fieldset className="space-y-2 sm:col-span-2" aria-labelledby={id}>
      <legend id={id} className="text-sm font-medium">
        Gider kalemleri (aylık)
      </legend>
      {fields.map((f, i) => (
        <div key={f.id} className="grid grid-cols-[minmax(0,1fr)_9rem_auto] items-center gap-2">
          <Input {...register(`kalemler.${i}.ad`)} aria-label={`${i + 1}. kalem adı`} placeholder="Kalem adı" />
          <Controller
            control={control}
            name={`kalemler.${i}.tutar`}
            render={({ field }) => (
              <NumberInput
                id={`${id}-t${i}`}
                label={`${i + 1}. kalem tutarı`}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                inputRef={field.ref}
                unit="₺"
                decimals={2}
                placeholder="0"
              />
            )}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`${i + 1}. kalemi sil`}
            onClick={() => remove(i)}
            disabled={fields.length === 1}
          >
            <Trash2 aria-hidden />
          </Button>
          <RowError name={`kalemler.${i}.tutar`} />
        </div>
      ))}
      <KalemlerError />
      <div className="flex items-center justify-between gap-3 pt-1">
        <Button type="button" variant="outline" size="sm" onClick={() => append({ ad: '' })} disabled={fields.length >= 50}>
          <Plus aria-hidden /> Kalem ekle
        </Button>
        <p className="tabular text-sm text-muted-foreground">
          Toplam: <span className="font-semibold text-foreground">{tl(toplam)}</span>
        </p>
      </div>
    </fieldset>
  );
}

function Daireler() {
  const id = useId();
  const { control, register } = useFormContext<AidatInput>();
  const yontem = useWatch<AidatInput, 'yontem'>({ name: 'yontem' });
  const { fields, append, remove } = useFieldArray({ control, name: 'daireler' });
  const key = yontem === 'arsa' ? 'arsaPayi' : yontem === 'm2' ? 'm2' : null;
  return (
    <fieldset className="space-y-2 sm:col-span-2" aria-labelledby={id}>
      <legend id={id} className="flex min-h-6 items-center gap-1.5 text-sm font-medium">
        Daireler ({fields.length})
        <HelpTip label="Arsa payı">
          Arsa payı tapuda “arsa payı: 120/2400” gibi yazar; payı (120) girmeniz yeterli. Oranlar girilen payların toplamına göre
          hesaplanır, bu yüzden tüm bağımsız bölümleri ekleyin.
        </HelpTip>
      </legend>
      {key && (
        <div className="grid grid-cols-[minmax(0,1fr)_9rem_auto] gap-2 text-xs font-medium text-muted-foreground">
          <span>Daire no / adı</span>
          <span>{key === 'arsaPayi' ? 'Arsa payı' : 'Alan (m²)'}</span>
          <span className="w-11" />
        </div>
      )}
      {fields.map((f, i) => (
        <div
          key={f.id}
          className={
            key
              ? 'grid grid-cols-[minmax(0,1fr)_9rem_auto] items-center gap-2'
              : 'grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2'
          }
        >
          <Input {...register(`daireler.${i}.ad`)} aria-label={`${i + 1}. daire adı`} placeholder={`Daire ${i + 1}`} />
          {key && (
            <Controller
              key={key}
              control={control}
              name={`daireler.${i}.${key}`}
              render={({ field, fieldState }) => (
                <NumberInput
                  id={`${id}-${key}${i}`}
                  label={`${i + 1}. daire ${key === 'arsaPayi' ? 'arsa payı' : 'alanı'}`}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  inputRef={field.ref}
                  unit={key === 'm2' ? 'm²' : undefined}
                  decimals={key === 'm2' ? 2 : 4}
                  placeholder={key === 'm2' ? 'Örn. 110' : 'Örn. 120'}
                  invalid={!!fieldState.error}
                />
              )}
            />
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`${i + 1}. daireyi sil`}
            onClick={() => remove(i)}
            disabled={fields.length === 1}
          >
            <Trash2 aria-hidden />
          </Button>
          {key && <RowError name={`daireler.${i}.${key}`} />}
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append(daire(fields.length))}
        disabled={fields.length >= 500}
      >
        <Plus aria-hidden /> Daire ekle
      </Button>
    </fieldset>
  );
}

export default function AidatHesaplamaPage() {
  return (
    <CalculatorLayout
      slug="aidat-hesaplama"
      schema={aidatSchema}
      defaults={defaults}
      example={example}
      compute={present}
      content={content}
      emptyHint="Aylık gideri girin ve paylaştırma yöntemini seçin; daire bazlı aidat tablosu oluşsun."
    >
      <ChoiceField<AidatInput>
        name="giderModu"
        label="Gider girişi"
        className="sm:col-span-2"
        options={[
          { value: 'toplam', label: 'Toplam tutar' },
          { value: 'kalem', label: 'Kalem kalem' },
        ]}
        help="Aylık toplam gideri tek tutar olarak girebilir veya kapıcı, elektrik, temizlik gibi kalemleri ayrı ayrı yazabilirsiniz."
      />
      <Kalemler />
      <ChoiceField<AidatInput>
        name="yontem"
        label="Paylaştırma yöntemi"
        className="sm:col-span-2"
        options={[
          { value: 'esit', label: 'Eşit' },
          { value: 'arsa', label: 'Arsa payı' },
          { value: 'm2', label: 'm²' },
        ]}
        help="Kanuna göre aksi kararlaştırılmadıkça genel giderler arsa payı oranında, kapıcı/kaloriferci/bahçıvan/bekçi giderleri eşit paylaşılır. Yönetim planınızdaki kuralı seçin."
      />
      <Daireler />
    </CalculatorLayout>
  );
}
