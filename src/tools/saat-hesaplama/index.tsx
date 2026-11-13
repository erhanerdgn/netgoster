import { useId } from 'react';
import { Controller, useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { Link } from 'react-router';
import { Plus, Trash2 } from 'lucide-react';
import { CalculatorLayout } from '@/components/calc/CalculatorLayout';
import { ChoiceField, FieldShell, NumberField, NumberInput } from '@/components/calc/fields';
import type { ResultView } from '@/components/calc/ResultCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  calculateSaat,
  gunMetni,
  HAFTALIK_SINIR_DK,
  saatSchema,
  sureMetin,
  sureSSDD,
  type SaatInput,
  type SaatValues,
} from '@/calculators/saatHesaplama';
import { num } from '@/lib/format';
import content from './content.md';

const defaults: Partial<SaatInput> = {
  mod: 'ara',
  baslangic: '09:00',
  bitis: '18:00',
  mola: 60,
  saat: '08:00',
  islem: 'ekle',
  sureSaat: 8,
  sureDakika: 30,
  sureler: Array.from({ length: 5 }, () => ({ saat: 9, dakika: 0 })),
};
const example: SaatInput = {
  mod: 'ara',
  baslangic: '22:30',
  bitis: '06:15',
  mola: 30,
  saat: '23:30',
  islem: 'ekle',
  sureSaat: 2,
  sureDakika: 15,
  sureler: [
    { saat: 8, dakika: 30 },
    { saat: 9, dakika: 15 },
    { saat: 9, dakika: 0 },
    { saat: 9, dakika: 45 },
    { saat: 8, dakika: 0 },
    { saat: 5, dakika: 30 },
  ],
};

const ondalik = (dk: number) => `${num(dk / 60, 2)} saat`;

function present(v: SaatValues): ResultView {
  const r = calculateSaat(v);
  if (r.mod === 'ara' && v.mod === 'ara') {
    return {
      main: {
        label: 'İki saat arası süre',
        value: sureMetin(r.net),
        caption: `${v.baslangic} → ${v.bitis}${r.geceYarisi ? ' (ertesi gün)' : ''}${r.mola ? ` · ${r.mola} dk mola düşüldü` : ''}`,
      },
      rows: [
        { label: 'Toplam süre', value: sureMetin(r.brut) },
        ...(r.mola ? [{ label: 'Mola', value: `${r.mola} dakika`, tone: 'minus' as const }] : []),
        { label: 'Net süre (SS:DD)', value: sureSSDD(r.net), tone: 'total' },
        { label: 'Ondalık saat', value: ondalik(r.net), hint: 'Ücret ve puantaj hesabında kullanılır' },
        { label: 'Dakika olarak', value: `${num(r.net, 0)} dakika`, tone: 'muted' },
      ],
      status: r.tamGun
        ? { tone: 'info', text: 'Başlangıç ve bitiş saati aynı: süre 24 saat kabul edildi.' }
        : r.geceYarisi
          ? { tone: 'info', text: 'Bitiş saati başlangıçtan erken olduğu için gece yarısı geçildi, bitiş ertesi gün sayıldı.' }
          : undefined,
    };
  }
  if (r.mod === 'ekle' && v.mod === 'ekle') {
    const isaret = v.islem === 'ekle' ? '+' : '−';
    return {
      main: {
        label: `${v.saat} ${isaret} ${sureMetin(r.sure)}`,
        value: r.sonuc,
        caption: gunMetni(r.gunFarki).replace(/^./, (c) => c.toLocaleUpperCase('tr')),
      },
      rows: [
        { label: 'Başlangıç saati', value: v.saat },
        { label: v.islem === 'ekle' ? 'Eklenen süre' : 'Çıkarılan süre', value: sureMetin(r.sure) },
        { label: 'Sonuç saati', value: r.sonuc, tone: 'total', hint: gunMetni(r.gunFarki) },
      ],
      status: r.gunFarki ? { tone: 'info', text: `Gün değişti: sonuç ${gunMetni(r.gunFarki)} saat ${r.sonuc}.` } : undefined,
    };
  }
  if (r.mod !== 'topla') throw new Error('mod');
  return {
    main: {
      label: 'Toplam süre',
      value: sureMetin(r.toplam),
      caption: `${sureSSDD(r.toplam)} · ${ondalik(r.toplam)}`,
    },
    rows: [
      { label: 'Toplam (SS:DD)', value: sureSSDD(r.toplam), tone: 'total' },
      { label: 'Ondalık saat', value: ondalik(r.toplam), tone: 'total' },
      { label: 'Dakika olarak', value: `${num(r.toplam, 0)} dakika`, tone: 'muted' },
      { label: 'Girilen satır', value: String(r.satir), tone: 'muted' },
      ...(r.fazla
        ? [
            {
              label: `${HAFTALIK_SINIR_DK / 60} saati aşan`,
              value: sureMetin(r.fazla),
              tone: 'plus' as const,
              hint: `${ondalik(r.fazla)} · haftalık toplamsa fazla çalışma`,
            },
          ]
        : []),
    ],
    extra: (
      <p className="rounded-xl bg-accent px-3 py-2.5 text-sm text-accent-foreground">
        {r.fazla
          ? `Bu toplam bir haftaya aitse ${HAFTALIK_SINIR_DK / 60} saati aşan ${ondalik(r.fazla)} fazla çalışmadır (İş Kanunu md. 41). `
          : `Haftalık çalışmada ${HAFTALIK_SINIR_DK / 60} saati aşan kısım fazla çalışmadır (İş Kanunu md. 41). `}
        Ücretini{' '}
        <Link to="/fazla-mesai-hesaplama" className="font-medium underline underline-offset-2">
          fazla mesai hesaplama
        </Link>{' '}
        aracıyla bulabilirsiniz.
      </p>
    ),
  };
}

/** Yerel saat alanı (SS:DD). Tarayıcının saat seçicisini kullanır; değer her zaman "HH:MM" gelir. */
function SaatField({ name, label, help }: { name: 'baslangic' | 'bitis' | 'saat'; label: string; help: string }) {
  const id = useId();
  const { register, getFieldState, formState } = useFormContext<SaatInput>();
  const error = getFieldState(name, formState).error?.message;
  return (
    <FieldShell id={id} label={label} help={help} error={error}>
      <Input
        id={id}
        type="time"
        {...register(name)}
        aria-invalid={!!error || undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className="tabular text-base"
      />
    </FieldShell>
  );
}

const cols = 'grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_2.75rem] items-start gap-2';

function SureListesi() {
  const { control, formState } = useFormContext<SaatInput>();
  const { fields, append, remove } = useFieldArray({ control, name: 'sureler' });
  const listError = formState.errors.sureler?.root?.message ?? formState.errors.sureler?.message;
  return (
    <fieldset className="sm:col-span-2">
      <legend className="mb-1 text-sm font-semibold">Süreler</legend>
      <div className={`${cols} pb-1 text-xs font-medium text-muted-foreground`} aria-hidden>
        <span>Saat</span>
        <span>Dakika</span>
        <span />
      </div>
      <div className="space-y-2">
        {fields.map((f, i) => (
          <div key={f.id} className={cols}>
            {(['saat', 'dakika'] as const).map((k) => (
              <Controller
                key={k}
                control={control}
                name={`sureler.${i}.${k}`}
                render={({ field, fieldState }) => (
                  <NumberInput
                    id={`${f.id}-${k}`}
                    value={field.value as number | undefined}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    inputRef={field.ref}
                    decimals={k === 'saat' ? 2 : 0}
                    unit={k === 'saat' ? 'sa' : 'dk'}
                    placeholder="0"
                    invalid={!!fieldState.error}
                    label={`${i + 1}. satır ${k}`}
                  />
                )}
              />
            ))}
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
      <Button
        type="button"
        variant="outline"
        className="mt-3 h-11"
        disabled={fields.length >= 50}
        onClick={() => append({ saat: undefined, dakika: undefined })}
      >
        <Plus aria-hidden /> Satır ekle
      </Button>
      <p className="mt-2 text-xs text-muted-foreground">
        Her satıra bir günün ya da bir işin süresini yazın. Saat ondalık olabilir (7,5 = 7 saat 30 dakika); 60’tan büyük dakika da
        kabul edilir. Boş satırlar sayılmaz.
      </p>
    </fieldset>
  );
}

function Fields() {
  const mod = useWatch<SaatInput, 'mod'>({ name: 'mod' });
  return (
    <>
      <ChoiceField<SaatInput>
        name="mod"
        label="Hesaplama türü"
        className="sm:col-span-2"
        options={[
          { value: 'ara', label: 'İki saat arası' },
          { value: 'ekle', label: 'Ekle / çıkar' },
          { value: 'topla', label: 'Süre topla' },
        ]}
        help="İki saat arasındaki süreyi mi bulmak istiyorsunuz, bir saate süre mi ekleyeceksiniz, yoksa birden çok süreyi mi toplayacaksınız?"
      />
      {mod === 'ekle' ? (
        <>
          <SaatField name="saat" label="Saat" help="Süre eklenecek ya da çıkarılacak saat (24 saat biçimi)." />
          <ChoiceField<SaatInput>
            name="islem"
            label="İşlem"
            options={[
              { value: 'ekle', label: 'Ekle (+)' },
              { value: 'cikar', label: 'Çıkar (−)' },
            ]}
            help="Ekle: ileri saat (ör. bitiş saati). Çıkar: geri saat (ör. kaçta başlamalıyım)."
          />
          <NumberField<SaatInput>
            name="sureSaat"
            label="Süre (saat)"
            unit="sa"
            decimals={0}
            placeholder="0"
            help="Eklenecek ya da çıkarılacak tam saat. 24’ten büyük olabilir; gün değişimi sonuçta belirtilir."
          />
          <NumberField<SaatInput>
            name="sureDakika"
            label="Süre (dakika)"
            unit="dk"
            decimals={0}
            placeholder="0"
            help="Saate ek olarak dakika. 60’tan büyük girerseniz saate çevrilir."
          />
        </>
      ) : mod === 'topla' ? (
        <SureListesi />
      ) : (
        <>
          <SaatField
            name="baslangic"
            label="Başlangıç saati"
            help="İşe giriş, vardiya ya da etkinliğin başladığı saat (24 saat biçimi)."
          />
          <SaatField
            name="bitis"
            label="Bitiş saati"
            help="Bitiş saati başlangıçtan erkense gece yarısı geçilmiş sayılır (ör. 22:30 → 06:15)."
          />
          <NumberField<SaatInput>
            name="mola"
            label="Mola (isteğe bağlı)"
            unit="dk"
            decimals={0}
            placeholder="0"
            className="sm:col-span-2"
            help="Süreden düşülecek ara dinlenme. İş Kanunu md. 68’e göre ara dinlenmeleri çalışma süresinden sayılmaz."
            hint="Boş bırakırsanız mola düşülmez."
          />
        </>
      )}
    </>
  );
}

export default function SaatHesaplamaPage() {
  return (
    <CalculatorLayout
      slug="saat-hesaplama"
      schema={saatSchema}
      defaults={defaults}
      example={example}
      compute={present}
      content={content}
      emptyHint="Saatleri girdiğiniz anda süre, sonuç saati ya da toplam süre hesaplanır."
    >
      <Fields />
    </CalculatorLayout>
  );
}
