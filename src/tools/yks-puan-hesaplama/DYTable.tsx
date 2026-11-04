import { useId } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { cn } from 'cn';
import { NumberInput } from '@/components/calc/fields';
import type { Test } from '@/config/sinavlar';
import { num } from '@/lib/format';

/** Form değerlerinde `dy.<test>.{d,y}` — boşsa 0 */
type DYValues = Record<string, { d?: number; y?: number } | undefined>;

/** En az bir testte doğru/yanlış girilmiş mi (boş formda sonuç yerine ipucu gösterilsin diye) */
export const hasAnswer = (dy: DYValues) => Object.values(dy).some((v) => (v?.d ?? 0) + (v?.y ?? 0) > 0);

const cols =
  'grid grid-cols-[minmax(0,1fr)_3.5rem_3.5rem_3rem] items-center gap-2 sm:grid-cols-[minmax(0,1fr)_5.5rem_5.5rem_4rem]';

/**
 * Kompakt doğru/yanlış tablosu (YKS, LGS, KPSS, ALES). Her satır: test adı · D · Y · canlı net.
 * ponytail: dört sınav aracı ortak kullanıyor; components/calc altına taşınabilir.
 */
export function DYTable({
  tests,
  penalty,
  caption,
  className,
}: {
  tests: readonly Test[];
  penalty: number;
  caption?: string;
  className?: string;
}) {
  return (
    <fieldset className={cn('sm:col-span-2', className)}>
      {caption && <legend className="mb-1 text-sm font-semibold">{caption}</legend>}
      <div className={cn(cols, 'pb-1 text-xs font-medium text-muted-foreground')} aria-hidden>
        <span>Test</span>
        <span className="text-center">Doğru</span>
        <span className="text-center">Yanlış</span>
        <span className="text-right">Net</span>
      </div>
      <div className="divide-y">
        {tests.map((t) => (
          <DYRow key={t.key} test={t} penalty={penalty} />
        ))}
      </div>
    </fieldset>
  );
}

function DYRow({ test: t, penalty }: { test: Test; penalty: number }) {
  const id = useId();
  const { control, getFieldState, formState } = useFormContext();
  const v = useWatch({ control, name: `dy.${t.key}` }) as { d?: number; y?: number } | undefined;
  const net = (v?.d ?? 0) - (v?.y ?? 0) * penalty;
  const error =
    getFieldState(`dy.${t.key}.y`, formState).error?.message ?? getFieldState(`dy.${t.key}.d`, formState).error?.message;
  return (
    <div className="py-1.5">
      <div className={cols}>
        <span className="text-sm leading-tight font-medium">
          {t.label}
          <span className="block text-xs font-normal text-muted-foreground">{t.questions} soru</span>
        </span>
        {(['d', 'y'] as const).map((f) => (
          <Controller
            key={f}
            control={control}
            name={`dy.${t.key}.${f}`}
            render={({ field, fieldState }) => (
              <NumberInput
                id={`${id}-${f}`}
                value={field.value as number | undefined}
                onChange={field.onChange}
                onBlur={field.onBlur}
                inputRef={field.ref}
                decimals={0}
                placeholder="0"
                invalid={!!fieldState.error}
                label={`${t.label} ${f === 'd' ? 'doğru' : 'yanlış'} sayısı`}
              />
            )}
          />
        ))}
        <output aria-label={`${t.label} net`} className="tabular text-right text-sm font-semibold">
          {num(net, 2)}
        </output>
      </div>
      {error && (
        <p id={`${id}-y-error`} role="alert" className="mt-1 text-sm font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
