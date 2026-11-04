import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react';
import { FormProvider, useForm, useWatch, type DefaultValues, type FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { Calculator, CalendarCheck, RotateCcw, WandSparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AdSlot } from '@/components/AdSlot';
import { JsonLd } from '@/components/JsonLd';
import { ToolCard } from '@/components/ToolCard';
import { WarningNote } from '@/components/WarningNote';
import { categoryById, getTool, toolBySlug } from '@/tools.registry';
import { site } from '@/config/site';
import { dateLong } from '@/lib/format';
import { pushRecent } from '@/lib/storage';
import type { ContentModule } from '@/lib/content';
import { ResultCard, ResultTableView, type ResultView } from './ResultCard';

export interface Source {
  label: string;
  url: string;
}

interface Props<In extends FieldValues, Out> {
  slug: string;
  schema: z.ZodType<Out, In>;
  /** Formun açılış değerleri (akıllı varsayılanlar) */
  defaults: DefaultValues<In>;
  /** "Örnek değerlerle doldur" — tüm alanlar dolu olmalı (URL tip çözümü de buradan yapılır) */
  example: In;
  compute: (values: Out) => ResultView;
  content: ContentModule;
  /** Form alanları */
  children: ReactNode;
  emptyHint?: string;
  /** Bilimsel / resmi dayanak bağlantıları (sağlık araçlarında zorunlu) */
  sources?: Source[];
  /** Formun üstünde gösterilecek ek bilgi (ör. kur tarihi) */
  formTop?: ReactNode;
}

/** URL sorgusundan form değerlerini, örnek değerlerin tiplerine bakarak çözer */
function parseQuery<In extends FieldValues>(search: string, example: In): Partial<In> | null {
  const q = new URLSearchParams(search);
  if ([...q.keys()].length === 0) return null;
  const out: Record<string, unknown> = {};
  for (const [key, sample] of Object.entries(example)) {
    const raw = q.get(key);
    if (raw === null) continue;
    try {
      if (typeof sample === 'number') {
        const n = Number(raw);
        if (Number.isFinite(n)) out[key] = n;
      } else if (typeof sample === 'boolean') out[key] = raw === '1' || raw === 'true';
      else if (typeof sample === 'object') out[key] = JSON.parse(raw);
      else out[key] = raw;
    } catch {
      /* bozuk parametre: yok say */
    }
  }
  return out as Partial<In>;
}

function toQuery(values: FieldValues): string {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(values)) {
    if (v === undefined || v === null || v === '') continue;
    if (typeof v === 'object') q.set(k, JSON.stringify(v));
    else if (typeof v === 'boolean') q.set(k, v ? '1' : '0');
    else q.set(k, String(v));
  }
  return q.toString();
}

function safeCompute<Out>(compute: (v: Out) => ResultView, v: Out): ResultView | null {
  try {
    return compute(v);
  } catch (e) {
    if (import.meta.env.DEV) console.error(e);
    return null;
  }
}

export function CalculatorLayout<In extends FieldValues, Out>({
  slug,
  schema,
  defaults,
  example,
  compute,
  content,
  children,
  emptyHint = 'Alanları doldurdukça sonuç anında hesaplanır.',
  sources,
  formTop,
}: Props<In, Out>) {
  const tool = getTool(slug);
  const category = categoryById.get(tool.category)!;
  const form = useForm<In, unknown, Out>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any) as any,
    defaultValues: defaults,
    mode: 'onTouched',
  });
  const [result, setResult] = useState<ResultView | null>(() => {
    const r = schema.safeParse(defaults);
    return r.success ? safeCompute(compute, r.data) : null;
  });
  const values = useWatch({ control: form.control });
  const hydrated = useRef(false);
  // compute/schema her render'da yeni referans olabilir; efekt döngüsüne girmesin diye ref'te tutulur
  const fns = useRef({ compute, schema });
  fns.current = { compute, schema };

  // URL'deki paylaşılmış değerleri yükle + son kullanılanlara ekle
  useEffect(() => {
    pushRecent(slug);
    const fromUrl = parseQuery(location.search, example);
    if (fromUrl) form.reset({ ...defaults, ...fromUrl } as In);
    hydrated.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Canlı hesaplama (debounce) + URL senkronu
  useEffect(() => {
    const t = setTimeout(() => {
      const r = fns.current.schema.safeParse(values);
      if (r.success) {
        setResult(safeCompute(fns.current.compute, r.data));
        if (hydrated.current) history.replaceState(history.state, '', `${location.pathname}?${toQuery(values)}`);
      } else {
        setResult(null);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [values]);

  const onSubmit = form.handleSubmit((data) => {
    setResult(safeCompute(compute, data));
    if (window.matchMedia('(max-width: 1023px)').matches) {
      document.getElementById('sonuc')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  const related = tool.related.map((s) => toolBySlug.get(s)).filter((t) => t !== undefined);
  const url = `${site.url}/${tool.slug}`;

  return (
    <TooltipProvider delayDuration={200}>
      <div className="container-page pb-24 lg:pb-12">
        <Breadcrumbs
          items={[
            { name: category.name, path: `/${category.slug}` },
            { name: tool.title, path: `/${tool.slug}` },
          ]}
        />
        <header className="max-w-3xl">
          <h1 className="text-[1.875rem] leading-tight font-bold tracking-tight sm:text-4xl">{tool.title}</h1>
          <p className="mt-2 text-base text-muted-foreground sm:text-lg">{tool.lead}</p>
        </header>

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_25rem]">
          <FormProvider {...form}>
            <form
              onSubmit={onSubmit}
              noValidate
              aria-label={`${tool.name} formu`}
              className="rounded-2xl border bg-card p-5 shadow-soft sm:p-6"
            >
              {formTop}
              <div className="grid gap-5 sm:grid-cols-2">{children}</div>
              <div className="mt-6 flex flex-wrap gap-2 border-t pt-5" data-no-print>
                <Button type="submit" size="lg" className="flex-1 sm:flex-none">
                  <Calculator aria-hidden /> Hesapla
                </Button>
                <Button type="button" variant="secondary" size="lg" onClick={() => form.reset(example)}>
                  <WandSparkles aria-hidden /> Örnek değerlerle doldur
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="lg"
                  onClick={() => {
                    form.reset(defaults);
                    history.replaceState(history.state, '', location.pathname);
                  }}
                >
                  <RotateCcw aria-hidden /> Sıfırla
                </Button>
              </div>
            </form>
          </FormProvider>
          <div className="space-y-4 lg:sticky lg:top-20">
            <ResultCard result={result} title={tool.title} emptyHint={emptyHint} />
            {result?.extra}
          </div>
        </div>

        {result?.table && <ResultTableView table={result.table} />}

        <AdSlot slot="result" />

        <div className="mt-2 space-y-3">
          <WarningNote type={tool.warning} />
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarCheck className="size-4" aria-hidden />
            Son güncelleme: <time dateTime={tool.updated}>{dateLong(tool.updated)}</time>
          </p>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_16rem]">
          <article className="min-w-0">
            {content.toc.length > 2 && (
              <nav aria-label="İçindekiler" className="mb-8 rounded-2xl border bg-card p-5 lg:hidden">
                <p className="font-semibold">İçindekiler</p>
                <TocList toc={content.toc} />
              </nav>
            )}
            {content.body.map((html, i) => (
              <Fragment key={i}>
                {i > 0 && <AdSlot slot={i === 1 ? 'content' : 'content2'} />}
                <div className="prose-ng" dangerouslySetInnerHTML={{ __html: html }} />
              </Fragment>
            ))}
            {sources && sources.length > 0 && (
              <section className="mt-8 rounded-2xl border bg-card p-5">
                <h2 className="font-semibold">Kaynaklar</h2>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                  {sources.map((s) => (
                    <li key={s.url}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline underline-offset-4"
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {content.faqs.length > 0 && (
              <section id="sss" aria-labelledby="sss-baslik" className="mt-12 scroll-mt-24">
                <h2 id="sss-baslik" className="text-2xl font-semibold tracking-tight">
                  Sık Sorulan Sorular
                </h2>
                <Accordion type="multiple" className="mt-4 rounded-2xl border bg-card px-5">
                  {content.faqs.map((f, i) => (
                    <AccordionItem key={i} value={`s${i}`}>
                      <AccordionTrigger>{f.q}</AccordionTrigger>
                      <AccordionContent forceMount>
                        <div className="prose-ng text-base" dangerouslySetInnerHTML={{ __html: f.a }} />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            )}
          </article>
          <aside className="hidden lg:block">
            <div className="sticky top-20">
              {content.toc.length > 2 && (
                <nav aria-label="İçindekiler" className="rounded-2xl border bg-card p-5">
                  <p className="font-semibold">İçindekiler</p>
                  <TocList toc={content.toc} />
                </nav>
              )}
              <AdSlot slot="sidebar" variant="vertical" desktopOnly className="mt-6 mb-0" />
            </div>
          </aside>
        </div>

        <AdSlot slot="footer" />

        {related.length > 0 && (
          <section aria-labelledby="ilgili" className="mt-4">
            <h2 id="ilgili" className="text-2xl font-semibold tracking-tight">
              İlgili hesaplamalar
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {related.map((t) => (
                <ToolCard key={t.slug} tool={t} />
              ))}
            </div>
          </section>
        )}

        <MobileResultBar result={result} />

        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: tool.title,
            url,
            description: tool.description,
            applicationCategory: 'FinanceApplication',
            operatingSystem: 'Any',
            inLanguage: 'tr-TR',
            isAccessibleForFree: true,
            dateModified: tool.updated,
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'TRY' },
            publisher: { '@type': 'Organization', '@id': `${site.url}/#organization`, name: site.name, url: site.url },
          }}
        />
        {content.faqs.length > 0 && (
          <JsonLd
            data={{
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: content.faqs.map((f) => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a.replace(/<[^>]+>/g, '').trim() },
              })),
            }}
          />
        )}
        <Toaster />
      </div>
    </TooltipProvider>
  );
}

function TocList({ toc }: { toc: ContentModule['toc'] }) {
  return (
    <ol className="mt-2 space-y-1 text-sm">
      {toc.map((t) => (
        <li key={t.id}>
          <a href={`#${t.id}`} className="block rounded-md py-1.5 text-muted-foreground hover:text-primary">
            {t.text}
          </a>
        </li>
      ))}
      <li>
        <a href="#sss" className="block rounded-md py-1.5 text-muted-foreground hover:text-primary">
          Sık Sorulan Sorular
        </a>
      </li>
    </ol>
  );
}

/** Mobilde ekranın altında sonuç özeti; sonuç kartı görünürken gizlenir */
function MobileResultBar({ result }: { result: ResultView | null }) {
  const [cardVisible, setCardVisible] = useState(true);
  useEffect(() => {
    const el = document.getElementById('sonuc');
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setCardVisible(e.isIntersecting), { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  if (!result || cardVisible) return null;
  return (
    <button
      type="button"
      data-no-print
      onClick={() => document.getElementById('sonuc')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
      className="fixed inset-x-3 bottom-3 z-30 flex min-h-14 animate-in items-center justify-between gap-3 rounded-2xl bg-foreground px-4 py-2.5 text-left text-background shadow-lg duration-200 fade-in slide-in-from-bottom-2 lg:hidden"
    >
      <span className="text-sm opacity-80">{result.main.label}</span>
      <span className="tabular text-lg font-bold">{result.main.value}</span>
    </button>
  );
}
