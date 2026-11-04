import type { ReactNode } from 'react';
import { AlertTriangle, CheckCircle2, Info, Link2, MessageCircle, Printer, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from 'cn';
import { Button } from '@/components/ui/button';

export interface ResultRow {
  label: string;
  value: string;
  /** plus: ekleme, minus: kesinti, total: ara/genel toplam, muted: bilgi */
  tone?: 'plus' | 'minus' | 'total' | 'muted';
  hint?: string;
}

export interface ResultTable {
  caption: string;
  columns: string[];
  rows: string[][];
  footer?: string[];
}

export interface ResultStatus {
  tone: 'ok' | 'warn' | 'info';
  text: string;
}

/** Her aracın hesaplama sonucunu gösterim için dönüştürdüğü yapı */
export interface ResultView {
  main: { label: string; value: string; caption?: string };
  rows?: ResultRow[];
  status?: ResultStatus;
  table?: ResultTable;
  notes?: string[];
  /** Sonuç kartının altında araca özel ek içerik */
  extra?: ReactNode;
}

const statusStyle = {
  ok: { icon: CheckCircle2, cls: 'bg-result-soft text-result' },
  warn: { icon: AlertTriangle, cls: 'bg-warning-soft text-warning' },
  info: { icon: Info, cls: 'bg-accent text-accent-foreground' },
} as const;

export function StatusNote({ status }: { status: ResultStatus }) {
  const s = statusStyle[status.tone];
  const Icon = s.icon;
  return (
    <p className={cn('flex items-start gap-2 rounded-xl px-3 py-2.5 text-sm font-medium', s.cls)}>
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      <span>{status.text}</span>
    </p>
  );
}

export function ResultCard({ result, title, emptyHint }: { result: ResultView | null; title: string; emptyHint: string }) {
  return (
    <section
      id="sonuc"
      aria-live="polite"
      aria-label="Hesaplama sonucu"
      className="scroll-mt-20 overflow-hidden rounded-2xl border bg-card shadow-soft"
    >
      {result ? (
        <>
          <div className="bg-result-soft px-5 pt-5 pb-4">
            <p className="text-sm font-medium text-result">{result.main.label}</p>
            <p
              key={result.main.value}
              className="tabular mt-1 animate-in text-[2.125rem] leading-tight font-bold tracking-tight break-words text-foreground duration-300 fade-in slide-in-from-bottom-1"
            >
              {result.main.value}
            </p>
            {result.main.caption && <p className="mt-1 text-sm text-muted-foreground">{result.main.caption}</p>}
          </div>
          <div className="space-y-4 px-5 py-4">
            {result.status && <StatusNote status={result.status} />}
            {result.rows && result.rows.length > 0 && (
              <dl className="divide-y text-[0.9375rem]">
                {result.rows.map((r) => (
                  <div
                    key={r.label}
                    className={cn('flex items-baseline justify-between gap-4 py-2.5', r.tone === 'total' && 'font-semibold')}
                  >
                    <dt className={cn('text-muted-foreground', r.tone === 'total' && 'text-foreground')}>
                      {r.label}
                      {r.hint && <span className="block text-xs font-normal text-muted-foreground">{r.hint}</span>}
                    </dt>
                    <dd
                      className={cn(
                        'tabular shrink-0 text-right font-medium',
                        r.tone === 'minus' && 'text-destructive',
                        r.tone === 'plus' && 'text-result',
                        r.tone === 'muted' && 'font-normal text-muted-foreground',
                      )}
                    >
                      {r.tone === 'minus' && <span className="sr-only">eksi </span>}
                      {r.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
            {result.notes?.map((n) => (
              <p key={n} className="text-xs leading-relaxed text-muted-foreground">
                {n}
              </p>
            ))}
            <ShareActions title={title} summary={`${result.main.label}: ${result.main.value}`} />
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center px-6 py-12 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-accent text-primary">
            <Sparkles className="size-6" aria-hidden />
          </span>
          <p className="mt-4 font-semibold">Sonuç burada görünecek</p>
          <p className="mt-1 max-w-64 text-sm text-muted-foreground">{emptyHint}</p>
        </div>
      )}
    </section>
  );
}

function ShareActions({ title, summary }: { title: string; summary: string }) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      toast.success('Link kopyalandı', { description: 'Sonuçla birlikte paylaşabilirsiniz.' });
    } catch {
      toast.error('Link kopyalanamadı');
    }
  };
  const wa = () => {
    const text = `${title} — ${summary}\n${location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  };
  return (
    <div data-no-print className="grid grid-cols-3 gap-2 border-t pt-4">
      <Button type="button" variant="outline" size="sm" className="h-11" onClick={copy}>
        <Link2 aria-hidden /> <span className="text-xs sm:text-sm">Linki kopyala</span>
      </Button>
      <Button type="button" variant="outline" size="sm" className="h-11" onClick={() => window.print()}>
        <Printer aria-hidden /> <span className="text-xs sm:text-sm">Yazdır / PDF</span>
      </Button>
      <Button type="button" variant="outline" size="sm" className="h-11" onClick={wa}>
        <MessageCircle aria-hidden /> <span className="text-xs sm:text-sm">WhatsApp</span>
      </Button>
    </div>
  );
}

/** Uzun tablolar: mobilde yatay kaydırmalı, başlık satırı yapışkan */
export function ResultTableView({ table }: { table: ResultTable }) {
  return (
    <section aria-label={table.caption} className="mt-8 rounded-2xl border bg-card shadow-soft">
      <h2 className="px-5 pt-5 text-lg font-semibold">{table.caption}</h2>
      <div
        className="mt-3 max-h-[32rem] overflow-auto"
        tabIndex={0}
        role="region"
        aria-label={`${table.caption} (kaydırılabilir)`}
      >
        <table className="tabular w-full min-w-[40rem] text-sm">
          <thead className="sticky top-0 z-10 bg-muted">
            <tr>
              {table.columns.map((c, i) => (
                <th
                  key={c}
                  scope="col"
                  className={cn(
                    'px-4 py-2.5 font-semibold whitespace-nowrap',
                    i === 0 ? 'sticky left-0 bg-muted text-left' : 'text-right',
                  )}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, ri) => (
              <tr key={ri} className="border-t">
                {row.map((cell, i) => (
                  <td
                    key={i}
                    className={cn('px-4 py-2 whitespace-nowrap', i === 0 ? 'sticky left-0 bg-card font-medium' : 'text-right')}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          {table.footer && (
            <tfoot>
              <tr className="border-t-2 font-semibold">
                {table.footer.map((cell, i) => (
                  <td key={i} className={cn('px-4 py-2.5 whitespace-nowrap', i === 0 ? 'sticky left-0 bg-card' : 'text-right')}>
                    {cell}
                  </td>
                ))}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </section>
  );
}
