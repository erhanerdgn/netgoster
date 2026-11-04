import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NumberInput } from '@/components/calc/fields';
import type { LiseInput } from '@/calculators/liseOrtalama';

const cols =
  'grid grid-cols-[minmax(0,1fr)_4.5rem_3.75rem_2.75rem] items-start gap-2 sm:grid-cols-[minmax(0,1fr)_6rem_5rem_2.75rem]';

/** Ders satırları: ad (isteğe bağlı) · yıl sonu puanı · haftalık saat · sil */
export function DersListesi() {
  const { control, register, getFieldState, formState } = useFormContext<LiseInput>();
  const { fields, append, remove } = useFieldArray({ control, name: 'dersler' });
  const listError = formState.errors.dersler?.root?.message ?? formState.errors.dersler?.message;
  return (
    <fieldset className="sm:col-span-2">
      <legend className="mb-1 text-sm font-semibold">Dersler</legend>
      <div className={`${cols} pb-1 text-xs font-medium text-muted-foreground`} aria-hidden>
        <span>Ders adı</span>
        <span className="text-center">Yıl sonu puanı</span>
        <span className="text-center">Saat</span>
        <span />
      </div>
      <div className="space-y-2">
        {fields.map((f, i) => {
          const err =
            getFieldState(`dersler.${i}.puan`, formState).error?.message ??
            getFieldState(`dersler.${i}.saat`, formState).error?.message ??
            getFieldState(`dersler.${i}.ad`, formState).error?.message;
          const n = i + 1;
          return (
            <div key={f.id}>
              <div className={cols}>
                <Input
                  {...register(`dersler.${i}.ad`)}
                  placeholder={`${n}. ders`}
                  aria-label={`${n}. ders adı`}
                  autoComplete="off"
                />
                {(['puan', 'saat'] as const).map((k) => (
                  <Controller
                    key={k}
                    control={control}
                    name={`dersler.${i}.${k}`}
                    render={({ field, fieldState }) => (
                      <NumberInput
                        id={`${f.id}-${k}`}
                        value={field.value as number | undefined}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        inputRef={field.ref}
                        decimals={k === 'puan' ? 2 : 0}
                        placeholder={k === 'puan' ? '0–100' : '1–12'}
                        invalid={!!fieldState.error}
                        label={`${n}. ders ${k === 'puan' ? 'yıl sonu puanı' : 'haftalık ders saati'}`}
                      />
                    )}
                  />
                ))}
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
        disabled={fields.length >= 30}
        onClick={() => append({ ad: '', puan: undefined, saat: 2 })}
      >
        <Plus aria-hidden /> Ders ekle
      </Button>
      <p className="mt-2 text-xs text-muted-foreground">
        Puanı boş bırakılan satırlar hesaba katılmaz. Haftalık ders saatlerini karnenizden veya e-Okul’dan kontrol edin.
      </p>
    </fieldset>
  );
}
