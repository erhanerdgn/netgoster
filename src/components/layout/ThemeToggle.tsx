import { Monitor, Moon, Sun } from 'lucide-react';
import { cn } from 'cn';
import { setTheme, useTheme, type ThemeChoice } from '@/lib/theme';

const options: { value: ThemeChoice; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Açık tema', icon: Sun },
  { value: 'system', label: 'Sistem teması', icon: Monitor },
  { value: 'dark', label: 'Koyu tema', icon: Moon },
];

export function ThemeToggle({ className }: { className?: string }) {
  const { choice } = useTheme();
  return (
    <div role="radiogroup" aria-label="Tema" className={cn('inline-flex rounded-full border bg-card p-1', className)}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={choice === o.value}
          aria-label={o.label}
          title={o.label}
          onClick={() => setTheme(o.value)}
          className={cn(
            'flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors',
            choice === o.value && 'bg-accent text-primary',
          )}
        >
          <o.icon className="size-4" aria-hidden />
        </button>
      ))}
    </div>
  );
}

/** Başlıkta tek tuş: açık ↔ koyu */
export function ThemeButton() {
  const { resolved } = useTheme();
  const next = resolved === 'dark' ? 'light' : 'dark';
  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={resolved === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç'}
      className="flex size-11 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-primary"
    >
      <Sun className="hidden size-5 dark:block" aria-hidden />
      <Moon className="size-5 dark:hidden" aria-hidden />
    </button>
  );
}
