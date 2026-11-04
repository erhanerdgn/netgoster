import { lazy, Suspense, useEffect, useId, useState, type ReactNode } from 'react';
import { Controller, useFormContext, type FieldPath, type FieldValues } from 'react-hook-form';
import { CalendarDays, CircleHelp } from 'lucide-react';
import { cn } from 'cn';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatInput, formatTyping, parseTR } from '@/lib/format';

const DatePopover = lazy(() => import('./DatePopover'));

/** (?) ikonlu açıklama. Dokunmatik cihazlarda dokununca da açılır. */
export function HelpTip({ children, label }: { children: ReactNode; label: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger
        type="button"
        aria-label={`${label} nedir?`}
        onClick={() => setOpen((o) => !o)}
        className="-m-2 inline-flex size-9 items-center justify-center rounded-full text-muted-foreground hover:text-primary"
      >
        <CircleHelp className="size-4" aria-hidden />
      </TooltipTrigger>
      <TooltipContent className="max-w-72 text-sm leading-relaxed">{children}</TooltipContent>
    </Tooltip>
  );
}

interface ShellProps {
  id: string;
  label: string;
  help?: ReactNode;
  error?: string;
  hint?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function FieldShell({ id, label, help, error, hint, children, className }: ShellProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex min-h-6 items-center gap-1.5">
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
        {help && <HelpTip label={label}>{help}</HelpTip>}
      </div>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-sm font-medium text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function useFieldError(name: string): string | undefined {
  const { getFieldState, formState } = useFormContext();
  const st = getFieldState(name, formState);
  return st.error?.message;
}

interface BaseProps<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
  help?: ReactNode;
  hint?: ReactNode;
  className?: string;
}

/** Sayı alanı: tr-TR binlik ayraçla anlık biçimlenir, birim etiketi (₺, %, gün) gösterir. */
export function NumberField<T extends FieldValues>({
  name,
  label,
  help,
  hint,
  className,
  unit,
  placeholder,
  decimals = 2,
  allowNegative = false,
}: BaseProps<T> & { unit?: string; placeholder?: string; decimals?: number; allowNegative?: boolean }) {
  const id = useId();
  const { control } = useFormContext<T>();
  const error = useFieldError(name);
  return (
    <FieldShell id={id} label={label} help={help} error={error} hint={hint} className={className}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <NumberInput
            id={id}
            value={field.value as number | undefined}
            onChange={field.onChange}
            onBlur={field.onBlur}
            inputRef={field.ref}
            unit={unit}
            placeholder={placeholder}
            decimals={decimals}
            allowNegative={allowNegative}
            invalid={!!error}
          />
        )}
      />
    </FieldShell>
  );
}

interface NumberInputProps {
  id: string;
  value: number | undefined;
  onChange: (v: number | undefined) => void;
  onBlur?: () => void;
  inputRef?: React.Ref<HTMLInputElement>;
  unit?: string;
  placeholder?: string;
  decimals: number;
  allowNegative?: boolean;
  invalid?: boolean;
  label?: string;
}

export function NumberInput({
  id,
  value,
  onChange,
  onBlur,
  inputRef,
  unit,
  placeholder,
  decimals,
  allowNegative,
  invalid,
  label,
}: NumberInputProps) {
  const [text, setText] = useState(() => formatInput(value, decimals));
  // Dışarıdan gelen değer değişince (sıfırla, örnek doldur, URL) metni eşitle
  useEffect(() => {
    if (parseTR(text) !== value) setText(formatInput(value, decimals));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, decimals]);
  return (
    <div className="relative">
      <Input
        id={id}
        ref={inputRef}
        inputMode="decimal"
        autoComplete="off"
        aria-label={label}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? `${id}-error` : undefined}
        placeholder={placeholder}
        value={text}
        onChange={(e) => {
          const t = formatTyping(e.target.value, decimals, allowNegative);
          setText(t);
          onChange(parseTR(t));
        }}
        onBlur={() => {
          setText(formatInput(parseTR(text), decimals));
          onBlur?.();
        }}
        className={cn('tabular text-base', unit && 'pr-14')}
      />
      {unit && (
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-sm font-medium text-muted-foreground">
          {unit}
        </span>
      )}
    </div>
  );
}

/** ISO (YYYY-MM-DD) ↔ gg.aa.yyyy */
function isoToTR(iso?: string) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}`;
}
function trToISO(text: string): string | undefined {
  const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(text);
  if (!m) return undefined;
  const [, d, mo, y] = m;
  const date = new Date(Number(y), Number(mo) - 1, Number(d));
  if (date.getFullYear() !== Number(y) || date.getMonth() !== Number(mo) - 1 || date.getDate() !== Number(d)) return undefined;
  return `${y}-${mo}-${d}`;
}
function maskDate(raw: string) {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean);
  return parts.join('.');
}

/** Tarih alanı: gg.aa.yyyy maskeli metin + Türkçe takvim. Değer ISO (YYYY-MM-DD) dizesidir. */
export function DateField<T extends FieldValues>({
  name,
  label,
  help,
  hint,
  className,
  fromYear = 1940,
  toYear = new Date().getFullYear() + 2,
}: BaseProps<T> & { fromYear?: number; toYear?: number }) {
  const id = useId();
  const { control } = useFormContext<T>();
  const error = useFieldError(name);
  return (
    <FieldShell id={id} label={label} help={help} error={error} hint={hint} className={className}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <DateInput
            id={id}
            value={field.value as string | undefined}
            onChange={field.onChange}
            onBlur={field.onBlur}
            inputRef={field.ref}
            invalid={!!error}
            fromYear={fromYear}
            toYear={toYear}
            label={label}
          />
        )}
      />
    </FieldShell>
  );
}

interface DateInputProps {
  id: string;
  value: string | undefined;
  onChange: (v: string) => void;
  onBlur?: () => void;
  inputRef?: React.Ref<HTMLInputElement>;
  invalid?: boolean;
  fromYear: number;
  toYear: number;
  label: string;
}

function DateInput({ id, value, onChange, onBlur, inputRef, invalid, fromYear, toYear, label }: DateInputProps) {
  const [text, setText] = useState(() => isoToTR(value));
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (trToISO(text) !== value) setText(isoToTR(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return (
    <div className="relative">
      <Input
        id={id}
        ref={inputRef}
        inputMode="numeric"
        autoComplete="off"
        placeholder="gg.aa.yyyy"
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? `${id}-error` : undefined}
        value={text}
        onChange={(e) => {
          const t = maskDate(e.target.value);
          setText(t);
          onChange(trToISO(t) ?? (t === '' ? '' : `invalid:${t}`));
        }}
        onBlur={onBlur}
        className="tabular pr-12 text-base"
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          type="button"
          aria-label={`${label}: takvimden seç`}
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-muted-foreground hover:text-primary"
        >
          <CalendarDays className="size-5" aria-hidden />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          {open && (
            <Suspense fallback={<div className="h-80 w-72" />}>
              <DatePopover
                value={value && !value.startsWith('invalid') ? value : undefined}
                fromYear={fromYear}
                toYear={toYear}
                onSelect={(iso) => {
                  onChange(iso);
                  setText(isoToTR(iso));
                  setOpen(false);
                }}
              />
            </Suspense>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}

export interface Option {
  value: string;
  label: string;
}

export function SelectField<T extends FieldValues>({
  name,
  label,
  help,
  hint,
  className,
  options,
  placeholder = 'Seçin',
}: BaseProps<T> & { options: Option[]; placeholder?: string }) {
  const id = useId();
  const { control } = useFormContext<T>();
  const error = useFieldError(name);
  return (
    <FieldShell id={id} label={label} help={help} error={error} hint={hint} className={className}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select value={(field.value as string) ?? ''} onValueChange={field.onChange}>
            <SelectTrigger id={id} className="w-full" aria-invalid={!!error || undefined}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((o) => (
                <SelectItem key={o.value} value={o.value} className="min-h-10">
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </FieldShell>
  );
}

/** Segment görünümlü seçim (RadioGroup semantiğiyle). Az seçenekli alanlar için. */
export function ChoiceField<T extends FieldValues>({
  name,
  label,
  help,
  hint,
  className,
  options,
}: BaseProps<T> & { options: Option[] }) {
  const id = useId();
  const { control } = useFormContext<T>();
  const error = useFieldError(name);
  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex min-h-6 items-center gap-1.5">
        <span id={id} className="text-sm font-medium">
          {label}
        </span>
        {help && <HelpTip label={label}>{help}</HelpTip>}
      </div>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <div
            role="radiogroup"
            aria-labelledby={id}
            className="grid gap-1 rounded-xl bg-muted p-1"
            style={{ gridTemplateColumns: `repeat(${Math.min(options.length, 4)}, minmax(0, 1fr))` }}
          >
            {options.map((o) => {
              const active = field.value === o.value;
              return (
                <button
                  key={o.value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => field.onChange(o.value)}
                  onKeyDown={(e) => {
                    const idx = options.findIndex((x) => x.value === field.value);
                    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                      e.preventDefault();
                      field.onChange(options[(idx + 1) % options.length].value);
                    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                      e.preventDefault();
                      field.onChange(options[(idx - 1 + options.length) % options.length].value);
                    }
                  }}
                  tabIndex={active || (!field.value && o === options[0]) ? 0 : -1}
                  className={cn(
                    'min-h-11 rounded-lg px-2 text-sm font-medium transition-colors',
                    active ? 'bg-card text-foreground shadow-soft' : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
        )}
      />
      {error ? (
        <p role="alert" className="text-sm font-medium text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

export function SwitchField<T extends FieldValues>({ name, label, help, hint, className }: BaseProps<T>) {
  const id = useId();
  const { control } = useFormContext<T>();
  return (
    <div className={cn('flex min-h-11 items-center justify-between gap-3 rounded-xl border bg-card px-3.5 py-2', className)}>
      <div>
        <div className="flex items-center gap-1.5">
          <Label htmlFor={id} className="text-sm font-medium">
            {label}
          </Label>
          {help && <HelpTip label={label}>{help}</HelpTip>}
        </div>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
      <Controller
        control={control}
        name={name}
        render={({ field }) => <Switch id={id} checked={!!field.value} onCheckedChange={field.onChange} />}
      />
    </div>
  );
}
