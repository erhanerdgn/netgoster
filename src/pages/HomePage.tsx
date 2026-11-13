import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { ArrowDown, ArrowUpRight, Bookmark, Check, History, Search, ShieldCheck, Trash2, Zap } from 'lucide-react';
import { openSearch } from '@/components/layout/Header';
import { ToolCard } from '@/components/ToolCard';
import { QuickCalculator } from '@/components/QuickCalculator';
import { IntentPaths } from '@/components/IntentPaths';
import { JsonLd } from '@/components/JsonLd';
import { AdSlot } from '@/components/AdSlot';
import { Button } from '@/components/ui/button';
import { kpiFor } from '@/lib/toolKpi';
import { Input } from '@/components/ui/input';
import { categories, toolBySlug, tools, toolsIn, type Tool } from '@/tools.registry';
import { getRecent, removeSaved } from '@/lib/storage';
import { useLibrary } from '@/hooks/useLibrary';
import { site } from '@/config/site';

export default function HomePage() {
  const [recent, setRecent] = useState<Tool[]>([]);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(false);
  const { favorites, saved } = useLibrary();
  useEffect(() => {
    setRecent(
      getRecent()
        .map((s) => toolBySlug.get(s))
        .filter((t): t is Tool => !!t),
    );
  }, []);
  const favoriteTools = favorites.map((s) => toolBySlug.get(s)).filter((t): t is Tool => !!t);
  // Varsayılan görünümde önce popüler araçlar (kayıt sırasıyla), sonra diğerleri
  const ordered = [...tools].sort((a, b) => Number(!!b.popular) - Number(!!a.popular));
  const filtered = ordered.filter((t) =>
    `${t.title} ${t.lead}`.toLocaleLowerCase('tr').includes(search.toLocaleLowerCase('tr').trim()),
  );
  const visible = expanded || search.trim() ? filtered : filtered.slice(0, 9);

  return (
    <>
      <AdSlot slot="top" variant="banner" className="container-page my-4" />
      <section className="home-hero relative overflow-hidden border-b">
        <div className="container-page relative grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.2fr_1fr] lg:gap-16 lg:py-20">
          <div>
            <p className="eyebrow flex items-center gap-2">
              <span className="size-2 rounded-full bg-result" /> GÜNLÜK HAYATIN HESAP KİTABI
            </p>
            <h1 className="mt-5 max-w-xl text-[2.65rem] leading-[1.08] font-bold tracking-tight sm:text-6xl">
              Aklındaki hesap,
              <br />
              <span className="text-primary">önündeki netlik.</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
              Maaşın, evin, birikimin, hedeflerin. {tools.length} ücretsiz araçla hesapla; seçeneklerini gör, kararını netleştir.
            </p>
            <button
              type="button"
              onClick={openSearch}
              className="mt-7 flex min-h-14 w-full max-w-lg items-center gap-3 rounded-xl border bg-card px-4 text-left shadow-soft transition-colors hover:border-primary"
            >
              <Search className="size-5 shrink-0 text-primary" aria-hidden />
              <span className="flex-1 text-sm text-muted-foreground">Neyi hesaplamak istiyorsun?</span>
              <kbd className="hidden rounded border bg-muted px-1.5 py-0.5 text-xs sm:inline">⌘ / Ctrl K</kbd>
            </button>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                ['Net maaş', 'brutten-nete-maas-hesaplama'],
                ['Kredi taksiti', 'kredi-hesaplama'],
                ['Kira artışı', 'kira-artis-hesaplama'],
                ['Fon getirisi', 'fon-getirisi-hesaplama'],
              ].map(([name, slug]) => (
                <Link
                  key={slug}
                  to={`/${slug}`}
                  className="inline-flex min-h-11 items-center gap-1 px-2 text-sm font-medium text-primary hover:underline"
                >
                  {name}
                  <ArrowUpRight className="size-3.5" aria-hidden />
                </Link>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Check className="size-4 text-result" aria-hidden /> Ücretsiz, kayıt yok
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-result" aria-hidden /> Hesaplar tarayıcında
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="size-4 text-result" aria-hidden /> Anında sonuç
              </span>
            </div>
          </div>
          <QuickCalculator />
        </div>
      </section>

      <div className="container-page flex flex-col gap-12 py-10 sm:gap-16 sm:py-14">
        <Vitrin />
        {(favoriteTools.length > 0 || recent.length > 0 || saved.length > 0) && (
          <section aria-labelledby="sana-ozel" className="rounded-2xl border bg-card p-5 sm:p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
              <h2 id="sana-ozel" className="flex items-center gap-2 text-xl font-semibold">
                <Bookmark className="size-5 text-primary" aria-hidden /> Senin hesap köşen
              </h2>
              <p className="text-xs text-muted-foreground">Bu tarayıcıda saklanır. İstediğin zaman silebilirsin.</p>
            </div>
            {favoriteTools.length > 0 && (
              <div className="mb-5">
                <h3 className="mb-3 text-sm font-medium text-muted-foreground">Favorilerin</h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {favoriteTools.map((t) => (
                    <ToolCard key={t.slug} tool={t} compact />
                  ))}
                </div>
              </div>
            )}
            {saved.length > 0 && (
              <div className="mb-5">
                <h3 className="mb-3 text-sm font-medium text-muted-foreground">Kaydettiğin hesaplamalar</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {saved
                    .filter((s) => toolBySlug.has(s.slug))
                    .map((s) => (
                      <div key={s.id} className="flex items-center gap-2 rounded-xl border p-3">
                        <Link to={`/${s.slug}?${s.query}`} className="flex min-w-0 flex-1 flex-col gap-1">
                          <span className="text-sm font-semibold">{s.title}</span>
                          <span className="text-xs text-muted-foreground">{s.label}</span>
                          <span className="tabular text-lg font-semibold text-primary">{s.value}</span>
                          <span className="text-xs text-muted-foreground">Hesabı yeniden aç →</span>
                        </Link>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() => removeSaved(s.id)}
                          aria-label={`${s.title}, ${s.value}: kaydı sil`}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    ))}
                </div>
              </div>
            )}
            {recent.length > 0 && (
              <div>
                <h3 className="mb-3 flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                  <History className="size-4" aria-hidden /> Son kullandıkların
                </h3>
                <div className="flex flex-wrap gap-2">
                  {recent.map((t) => (
                    <Link
                      key={t.slug}
                      to={`/${t.slug}`}
                      className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-muted px-3 text-sm hover:text-primary"
                    >
                      {t.name}
                      <ArrowUpRight className="size-3.5" aria-hidden />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        <IntentPaths />
        <AdSlot slot="home" className="my-0" />

        <section id="tum-araclar" aria-labelledby="araclar">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="eyebrow">BİR HESAPTAN DAHA FAZLASI</p>
              <h2 id="araclar" className="section-title mt-2">
                İhtiyacın olan araç burada.
              </h2>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute top-3.5 left-3 size-4 text-muted-foreground" aria-hidden />
              <Input
                aria-label="Hesaplama araçlarını filtrele"
                placeholder="Araçlarda ara…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <div id="tool-results" className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((t) => (
              <ToolCard key={t.slug} tool={t} />
            ))}
          </div>
          <p className="sr-only" aria-live="polite">
            {filtered.length} araç bulundu.
          </p>
          {filtered.length === 0 && (
            <div className="py-10 text-center">
              <p className="text-muted-foreground">Bu aramayla eşleşen araç bulunamadı.</p>
              <Button type="button" variant="link" onClick={() => setSearch('')}>
                Tüm araçları göster
              </Button>
            </div>
          )}
          {!search.trim() && (
            <div className="mt-6 text-center">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => setExpanded(!expanded)}
                aria-expanded={expanded}
                aria-controls="tool-results"
              >
                {expanded ? 'Daha az göster' : `${tools.length} aracın tümünü keşfet`}
                <ArrowDown data-icon="inline-end" />
              </Button>
            </div>
          )}
        </section>

        <section aria-labelledby="kategoriler" id="tool-directory">
          <div className="mb-5">
            <p className="eyebrow">KONU KONU KEŞFET</p>
            <h2 id="kategoriler" className="section-title mt-2">
              Hayatın her hesabına bir yer.
            </h2>
          </div>
          <div className="grid gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <Link
                key={c.id}
                to={`/${c.slug}`}
                className="group flex items-center gap-4 bg-card p-5 transition-colors hover:bg-accent"
              >
                <c.icon className="size-6 shrink-0 text-primary" aria-hidden />
                <div className="flex-1">
                  <h3 className="font-semibold">{c.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{toolsIn(c.id).length} ücretsiz araç</p>
                </div>
                <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-primary" aria-hidden />
              </Link>
            ))}
          </div>
        </section>
        <AdSlot slot="list" className="my-0" />
        <section className="grid gap-6 border-t pt-8 sm:grid-cols-3" aria-label="NetGöster nasıl çalışır?">
          {[
            ['01', 'Hesabını seç', 'Günlük bir ihtiyaçtan başla; maaş, kira, kredi veya sınav.'],
            ['02', 'Değerlerini gir', 'Alanları doldurdukça sonucun ve ayrıntılı dökümün oluşsun.'],
            ['03', 'Seçeneklerini gör', 'Senaryoları karşılaştır, sonucu kaydet veya paylaş.'],
          ].map(([n, title, description]) => (
            <div key={n}>
              <span className="text-sm font-semibold text-primary">{n} /</span>
              <h2 className="mt-3 font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
            </div>
          ))}
        </section>
      </div>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Organization',
              '@id': `${site.url}/#organization`,
              name: site.name,
              url: site.url,
              logo: { '@type': 'ImageObject', url: `${site.url}/icon-512.png`, width: 512, height: 512 },
              email: site.email,
            },
            {
              '@type': 'WebSite',
              '@id': `${site.url}/#website`,
              name: site.name,
              url: site.url,
              inLanguage: 'tr-TR',
              description: site.description,
              publisher: { '@id': `${site.url}/#organization` },
            },
            {
              '@type': 'ItemList',
              name: 'Hesaplama araçları',
              itemListElement: tools.map((t, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                url: `${site.url}/${t.slug}`,
                name: t.title,
              })),
            },
          ],
        }}
      />
    </>
  );
}

/** Ana sayfa vitrin (bento): öne çıkan araç büyük kutuda, popülerler canlı rakamlarıyla. Slug'ları buradan değiştirin. */
const VITRIN = {
  one: 'fon-getirisi-hesaplama',
  uzun: 'brutten-nete-maas-hesaplama',
  kucuk: ['kidem-tazminati-hesaplama', 'yks-puan-hesaplama'],
  genis: ['kira-artis-hesaplama', 'mevduat-faizi-hesaplama'],
};

function Vitrin() {
  const one = toolBySlug.get(VITRIN.one)!;
  const uzun = toolBySlug.get(VITRIN.uzun)!;
  const uzunKpi = kpiFor(uzun.slug);
  const UzunIcon = uzun.icon;
  return (
    <section
      aria-label="Öne çıkan hesaplamalar"
      className="grid grid-cols-2 gap-3 sm:gap-3.5 lg:auto-rows-[7.5rem] lg:grid-cols-4"
    >
      <Link
        to={`/${one.slug}`}
        className={`tone-${one.category} vitrin-one relative col-span-2 flex min-h-64 flex-col overflow-hidden rounded-[1.375rem] border p-6 lg:row-span-2`}
      >
        <span className="flex items-center gap-2 text-[11px] font-bold tracking-wider text-[var(--tone)] uppercase">
          <span className="rounded-full bg-[var(--tone)] px-2 py-0.5 text-[10px] tracking-normal text-[var(--tone-ink)]">
            YENİ
          </span>
          {one.title}
        </span>
        <span className="relative mt-3 block max-w-md text-2xl leading-tight font-bold tracking-tight sm:text-[1.7rem]">
          Fonun stopajdan ve enflasyondan sonra ne kazandırdı?
        </span>
        <span className="relative mt-2 block max-w-sm text-sm text-muted-foreground">
          Alış-satış fiyatını gir; alış tarihine göre stopajı düşelim, net ve reel getirini gösterelim.
        </span>
        <span className="relative mt-auto inline-flex items-center gap-1.5 self-start rounded-xl bg-[var(--tone)] px-4 py-2.5 pt-2.5 text-sm font-semibold text-[var(--tone-ink)]">
          Fon getirini hesapla <ArrowUpRight className="size-4" aria-hidden />
        </span>
        <svg
          className="pointer-events-none absolute -right-2 -bottom-2 hidden h-40 w-60 text-[var(--tone)] opacity-80 sm:block"
          viewBox="0 0 230 160"
          aria-hidden
        >
          <defs>
            <linearGradient id="vitrin-g" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="currentColor" stopOpacity=".35" />
              <stop offset="1" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0 140 L25 130 L50 135 L75 105 L100 112 L125 82 L150 88 L175 54 L200 60 L230 20 L230 160 L0 160Z"
            fill="url(#vitrin-g)"
          />
          <path
            d="M0 140 L25 130 L50 135 L75 105 L100 112 L125 82 L150 88 L175 54 L200 60 L230 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />
        </svg>
      </Link>

      <Link
        to={`/${uzun.slug}`}
        className={`tone-${uzun.category} tool-card col-span-2 flex min-h-48 flex-col rounded-[1.375rem] border p-5 sm:col-span-1 lg:row-span-2`}
      >
        <span className="flex size-10 items-center justify-center rounded-xl bg-[var(--tone-soft)] text-[var(--tone)]">
          <UzunIcon className="size-5" aria-hidden />
        </span>
        {uzunKpi && (
          <>
            <span className="tabular mt-4 text-3xl leading-none font-extrabold tracking-tight">{uzunKpi.value}</span>
            <span className="mt-1.5 text-xs text-muted-foreground">{uzunKpi.caption}</span>
          </>
        )}
        <span className="mt-auto font-semibold">{uzun.title}</span>
      </Link>

      {VITRIN.kucuk.map((slug) => {
        const t = toolBySlug.get(slug)!;
        const Icon = t.icon;
        return (
          <Link
            key={slug}
            to={`/${slug}`}
            className={`tone-${t.category} tool-card flex min-h-28 flex-col rounded-[1.375rem] border p-4 sm:p-5`}
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-[var(--tone-soft)] text-[var(--tone)]">
              <Icon className="size-5" aria-hidden />
            </span>
            <span className="mt-auto pt-3 font-semibold">{t.title}</span>
          </Link>
        );
      })}

      {VITRIN.genis.map((slug) => {
        const t = toolBySlug.get(slug)!;
        const k = kpiFor(slug);
        const Icon = t.icon;
        return (
          <Link
            key={slug}
            to={`/${slug}`}
            className={`tone-${t.category} tool-card col-span-2 flex min-h-28 items-center gap-4 rounded-[1.375rem] border p-5`}
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--tone-soft)] text-[var(--tone)]">
              <Icon className="size-5" aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block font-semibold">{t.title}</span>
              {k && <span className="block text-xs text-muted-foreground">{k.caption}</span>}
            </span>
            {k && <span className="tabular ml-auto text-2xl font-extrabold tracking-tight text-[var(--tone)]">{k.value}</span>}
          </Link>
        );
      })}
    </section>
  );
}
