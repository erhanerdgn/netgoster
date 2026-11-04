import { useState } from 'react';
import { ArrowUp, BookmarkPlus, Columns2, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { saveCalculation } from '@/lib/storage';
import { cn } from 'cn';
import type { ResultView } from './ResultCard';

type Snapshot = Pick<ResultView, 'main' | 'rows'>;

export function ResultWorkbench({
  result,
  slug,
  title,
  query,
}: {
  result: ResultView | null;
  slug: string;
  title: string;
  query: string;
}) {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [savedQuery, setSavedQuery] = useState<string | null>(null);
  if (!result && !snapshot) return null;
  const rows =
    snapshot && result
      ? [...new Set([...(snapshot.rows ?? []).map((r) => r.label), ...(result.rows ?? []).map((r) => r.label)])].slice(0, 6)
      : [];
  return (
    <section className="mt-6 rounded-2xl border bg-card p-5 sm:p-6" aria-labelledby="senaryolar" data-no-print>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow">SONUÇTAN SONRA</p>
          <h2 id="senaryolar" className="mt-2 text-lg font-semibold">
            Bir de diğer seçeneği gör.
          </h2>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Bu sonucu sabitle, yukarıdaki değerleri değiştir. İki hesabı yan yana karşılaştır.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {snapshot && (
            <Button
              type="button"
              variant="outline"
              onClick={() => document.querySelector('form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            >
              <ArrowUp data-icon="inline-start" /> Diğer senaryoyu gir
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            disabled={!result}
            onClick={() => result && setSnapshot({ main: { ...result.main }, rows: result.rows?.map((r) => ({ ...r })) })}
          >
            <Columns2 data-icon="inline-start" />
            {snapshot ? 'Sabit sonucu güncelle' : 'Karşılaştırmak için sabitle'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={!result || savedQuery === query}
            onClick={() => {
              if (!result) return;
              const success = saveCalculation({ slug, title, label: result.main.label, value: result.main.value, query });
              if (success) {
                setSavedQuery(query);
                toast.success('Hesaplama bu tarayıcıya kaydedildi', {
                  description: 'Ana sayfadaki hesap köşenden açabilir veya silebilirsin.',
                });
              } else toast.error('Tarayıcı depolaması kullanılamıyor. Hesaplama kaydedilemedi.');
            }}
          >
            <BookmarkPlus data-icon="inline-start" />
            {savedQuery === query ? 'Kaydedildi' : 'Sonucu kaydet'}
          </Button>
        </div>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Yalnızca “Sonucu kaydet” dediğinde girdilerin bu cihazda saklanır. Paylaşılan cihazlarda kişisel bilgilerini kaydetme.
      </p>
      {snapshot && (
        <div className="mt-5 overflow-hidden rounded-xl border">
          <div className="flex items-center justify-between gap-3 bg-muted px-4 py-2">
            <h3 className="text-sm font-semibold">Senaryo karşılaştırması</h3>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-label="Karşılaştırmayı kaldır"
              onClick={() => setSnapshot(null)}
            >
              <X />
            </Button>
          </div>
          <div className="grid grid-cols-2 divide-x">
            <div className="min-w-0 p-4">
              <p className="text-xs text-muted-foreground">Sabitlenen hesap</p>
              <p className="mt-2 text-sm">{snapshot.main.label}</p>
              <p className="tabular mt-1 text-xl font-bold break-words sm:text-2xl">{snapshot.main.value}</p>
              {snapshot.main.caption && (
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{snapshot.main.caption}</p>
              )}
            </div>
            <div className="min-w-0 bg-result-soft p-4" aria-live="polite">
              <p className="text-xs text-result">Şimdiki hesap</p>
              <p className="mt-2 text-sm">{result?.main.label ?? 'Değerlerini kontrol et'}</p>
              <p className="tabular mt-1 text-xl font-bold break-words sm:text-2xl">{result?.main.value ?? '—'}</p>
              {result?.main.caption && (
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{result.main.caption}</p>
              )}
            </div>
          </div>
          {rows.length > 0 && (
            <dl className="divide-y border-t">
              {rows.map((label) => {
                const before = snapshot.rows?.find((r) => r.label === label)?.value ?? '—';
                const after = result?.rows?.find((r) => r.label === label)?.value ?? '—';
                return (
                  <div key={label} className="px-4 py-3">
                    <dt className="mb-1 text-xs text-muted-foreground">{label}</dt>
                    <dd className="tabular grid grid-cols-2 gap-4 text-sm">
                      <span className="break-words">{before}</span>
                      <span className={cn('break-words', before !== after && 'font-semibold text-primary')}>{after}</span>
                    </dd>
                  </div>
                );
              })}
            </dl>
          )}
          <div className="px-4 py-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => setSnapshot(null)}>
              <Trash2 data-icon="inline-start" /> Karşılaştırmayı temizle
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
