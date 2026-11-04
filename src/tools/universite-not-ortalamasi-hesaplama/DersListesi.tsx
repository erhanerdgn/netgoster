import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NumberInput } from '@/components/calc/fields';
import type { UniversiteInput } from '@/calculators/universiteOrtalama';
import { universite } from '@/config/sinavlar';
import { num } from '@/lib/format';

const cols =
  'grid grid-cols-[minmax(0,1fr)_5rem_3.5rem_2.75rem] items-start gap-2 sm:grid-cols-[minmax(0,1fr)_7rem_5rem_2.75rem]';

/** Ders satırları: ad (isteğe bağlı) · harf notu · AKTS/kredi · sil */
export function DersListesi() {
  const { control, register, getFieldState, formState } = useFormContext<UniversiteInput>();
  const { fields, append, remove } = useFieldArray({ control, name: 'dersler' });
  const listError = formState.errors.dersler?.root?.message ?? formState.errors.dersler?.message;
  return (
    <fieldset className="sm:col-span-2">
      <legend className="mb-1 text-sm font-semibold">Bu dönemin dersleri</legend>
      <div className={`${cols} pb-1 text-xs font-medium text-muted-foreground`} aria-hidden>
        <span>Ders adı</span>
        <span className="text-center">Harf notu</span>
        <span className="text-center">AKTS</span>
        <span />
      </div>
      <div className="space-y-2">
        {fields.map((f, i) => {
          const n = i + 1;
          const err =
            getFieldState(`dersler.${i}.harf`, formState).error?.message ??
            getFieldState(`dersler.${i}.kredi`, formState).error?.message;
          return (
            <div key={f.id}>
              <div className={cols}>
                <Input
                  {...register(`dersler.${i}.ad`)}
                  placeholder={`${n}. ders`}
                  aria-label={`${n}. ders adı`}
                  autoComplete="off"
                />
                <Controller
                  control={control}
                  name={`dersler.${i}.harf`}
                  render={({ field }) => (
                    <Select value={field.value ?? ''} onValueChange={field.onChange}>
                      <SelectTrigger className="h-11 w-full" aria-label={`${n}. ders harf notu`}>
                        <SelectValue placeholder="Seçin">{field.value}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {universite.letters.map((l) => (
                          <SelectItem key={l.letter} value={l.letter} className="min-h-10">
                            {l.letter} <span className="text-muted-foreground">({num(l.point, 2, 2)})</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <Controller
                  control={control}
                  name={`dersler.${i}.kredi`}
                  render={({ field, fieldState }) => (
                    <NumberInput
                      id={`${f.id}-kredi`}
                      value={field.value as number | undefined}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      inputRef={field.ref}
                      decimals={1}
                      placeholder="5"
                      invalid={!!fieldState.error}
                      label={`${n}. ders AKTS veya kredi`}
                    />
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-11 text-muted-foreground hover:text-destructive"
                  aria-label={`${n}. dersi sil`}
                  disabled={fields.length === 1}
                  onClick={() => remove(i)}
                >
                  <Trash2 aria-hidden />
                </Button>
              </div>
              {err && (
                <p role="alert" className="mt-1 text-sm font-medium text-destructive">
                  {err}
                </p>
              )}
            </div>
          );
        })}
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
        disabled={fields.length >= 40}
        onClick={() => append({ ad: '', harf: undefined, kredi: 5 })}
      >
        <Plus aria-hidden /> Ders ekle
      </Button>
      <p className="mt-2 text-xs text-muted-foreground">
        Harf notu seçilmeyen satırlar hesaba katılmaz. Üniversiteniz ulusal kredi kullanıyorsa AKTS yerine krediyi girin.
      </p>
    </fieldset>
  );
}
