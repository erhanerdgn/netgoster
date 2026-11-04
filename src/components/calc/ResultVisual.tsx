import { cn } from 'cn';

export interface ResultChart {
  title: string;
  kind?: 'distribution' | 'trend';
  items: { label: string; value: number; formatted: string }[];
}

export function ResultVisual({ chart }: { chart: ResultChart }) {
  const items = chart.items.filter((i) => Number.isFinite(i.value) && i.value >= 0);
  const sum = items.reduce((s, i) => s + i.value, 0);
  const max = Math.max(...items.map((i) => i.value), 1);
  if (!items.length || sum <= 0) return null;
  return (
    <figure className="rounded-xl border bg-background p-4">
      <figcaption className="mb-4 text-sm font-semibold">{chart.title}</figcaption>
      {chart.kind === 'trend' ? (
        <>
          <div className="flex h-24 items-end gap-1.5" aria-hidden>
            {items.map((item) => (
              <div
                key={item.label}
                title={`${item.label}: ${item.formatted}`}
                className="flex-1 rounded-t bg-primary/70"
                style={{ height: `${Math.max(2, (item.value / max) * 100)}%` }}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-xs text-muted-foreground" aria-hidden>
            <span>{items[0].label}</span>
            <span>{items.at(-1)?.label}</span>
          </div>
          <details className="mt-3">
            <summary className="cursor-pointer py-2 text-xs font-medium text-primary">Grafik değerlerini gör</summary>
            <dl className="mt-2 grid grid-cols-2 gap-2 text-xs">
              {items.map((item) => (
                <div key={item.label}>
                  <dt className="text-muted-foreground">{item.label}</dt>
                  <dd className="tabular font-medium">{item.formatted}</dd>
                </div>
              ))}
            </dl>
          </details>
        </>
      ) : (
        <>
          <div className="mb-4 flex h-3 overflow-hidden rounded-full bg-muted" aria-hidden>
            {items.map((item, i) => (
              <span
                key={item.label}
                className={cn(i % 3 === 0 ? 'bg-primary' : i % 3 === 1 ? 'bg-result' : 'bg-warning')}
                style={{ width: `${(item.value / sum) * 100}%` }}
              />
            ))}
          </div>
          <dl className="flex flex-col gap-2.5 text-xs">
            {items.map((item, i) => (
              <div key={item.label} className="flex items-center justify-between gap-3">
                <dt className="flex items-center gap-2 text-muted-foreground">
                  <span
                    className={cn('size-2 rounded-full', i % 3 === 0 ? 'bg-primary' : i % 3 === 1 ? 'bg-result' : 'bg-warning')}
                    aria-hidden
                  />
                  {item.label}
                </dt>
                <dd className="tabular font-medium">{item.formatted}</dd>
              </div>
            ))}
          </dl>
        </>
      )}
    </figure>
  );
}
