import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight, History, Search, TrendingUp } from 'lucide-react';
import { openSearch } from '@/components/layout/Header';
import { ToolCard } from '@/components/ToolCard';
import { JsonLd } from '@/components/JsonLd';
import { AdSlot } from '@/components/AdSlot';
import { categories, popularTools, toolBySlug, tools, toolsIn, type Tool } from '@/tools.registry';
import { getRecent } from '@/lib/storage';
import { site } from '@/config/site';

export default function HomePage() {
  const [recent, setRecent] = useState<Tool[]>([]);
  useEffect(() => {
    setRecent(
      getRecent()
        .map((s) => toolBySlug.get(s))
        .filter((t): t is Tool => !!t),
    );
  }, []);

  return (
    <>
      <section className="border-b bg-card">
        <div className="container-page py-12 sm:py-16">
          <p className="text-sm font-semibold text-primary">{tools.length} ücretsiz hesaplama aracı</p>
          <h1 className="mt-3 max-w-3xl text-4xl leading-[1.1] font-bold tracking-tight sm:text-5xl">
            Maaştan krediye, sınavdan sağlığa: <span className="text-primary">hesaplayın, net görün.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Güncel mevzuat ve resmi parametrelerle çalışan, hızlı ve mobil uyumlu hesaplama araçları. Kayıt yok, ücret yok.
          </p>
          <button
            type="button"
            onClick={openSearch}
            className="mt-8 flex h-14 w-full max-w-2xl items-center gap-3 rounded-2xl border-2 bg-background px-5 text-left text-base text-muted-foreground shadow-soft transition-colors hover:border-primary/50"
          >
            <Search className="size-5 text-primary" aria-hidden />
            <span className="flex-1">Hangi hesaplamayı arıyorsunuz? (ör. kıdem, KDV, VKİ)</span>
            <kbd className="hidden rounded-md border bg-muted px-2 py-0.5 text-xs sm:inline">Ctrl K</kbd>
          </button>
          <div className="mt-4 flex flex-wrap gap-2">
            {popularTools.slice(0, 6).map((t) => (
              <Link
                key={t.slug}
                to={`/${t.slug}`}
                className="flex min-h-11 items-center rounded-full border bg-background px-4 text-sm font-medium hover:border-primary/50 hover:text-primary"
              >
                {t.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="container-page space-y-14 py-12">
        {recent.length > 0 && (
          <section aria-labelledby="son">
            <h2 id="son" className="flex items-center gap-2 text-xl font-semibold">
              <History className="size-5 text-primary" aria-hidden /> Son kullandıkların
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {recent.map((t) => (
                <ToolCard key={t.slug} tool={t} compact />
              ))}
            </div>
          </section>
        )}

        <section aria-labelledby="kategoriler">
          <h2 id="kategoriler" className="text-2xl font-semibold tracking-tight">
            Kategoriler
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <Link
                key={c.id}
                to={`/${c.slug}`}
                className="group rounded-2xl border bg-card p-5 shadow-soft transition-colors hover:border-primary/40"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-primary">
                    <c.icon className="size-5" aria-hidden />
                  </span>
                  <span className="text-lg font-semibold">{c.name}</span>
                  <span className="ml-auto rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                    {toolsIn(c.id).length} araç
                  </span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{c.description}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Tümünü gör <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <AdSlot slot="list" className="my-0" />

        <section aria-labelledby="populer">
          <h2 id="populer" className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <TrendingUp className="size-6 text-primary" aria-hidden /> En çok kullanılanlar
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {popularTools.map((t) => (
              <ToolCard key={t.slug} tool={t} />
            ))}
          </div>
        </section>

        <AdSlot slot="list" className="my-0" />

        <section aria-labelledby="tum-araclar">
          <h2 id="tum-araclar" className="text-2xl font-semibold tracking-tight">
            Tüm hesaplama araçları
          </h2>
          <div className="mt-5 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c) => (
              <nav key={c.id} aria-label={c.name}>
                <Link to={`/${c.slug}`} className="flex items-center gap-2 font-semibold hover:text-primary">
                  <c.icon className="size-4 text-primary" aria-hidden /> {c.name}
                </Link>
                <ul className="mt-2">
                  {toolsIn(c.id).map((t) => (
                    <li key={t.slug}>
                      <Link
                        to={`/${t.slug}`}
                        className="flex min-h-9 items-center text-sm text-muted-foreground hover:text-primary"
                      >
                        {t.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </section>

        <section aria-labelledby="neden" className="rounded-2xl border bg-card p-6 sm:p-8">
          <h2 id="neden" className="text-2xl font-semibold tracking-tight">
            Neden {site.name}?
          </h2>
          <div className="mt-5 grid gap-6 sm:grid-cols-3">
            {[
              [
                'Güncel parametreler',
                'Asgari ücret, vergi dilimleri, SGK oranları ve tavanlar resmi kaynaklardan dönemsel olarak güncellenir; hesaplama tarihinize göre doğru dönem seçilir.',
              ],
              [
                'Anında ve gizli',
                'Hesaplamalar tarayıcınızda yapılır; girdiğiniz maaş veya sağlık bilgileri sunucuya gönderilmez.',
              ],
              [
                'Açıklamalı sonuçlar',
                'Her sonucun altında kalem kalem döküm, formül, örnek hesaplamalar ve yasal dayanak bulunur.',
              ],
            ].map(([t, d]) => (
              <div key={t}>
                <h3 className="font-semibold">{t}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
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
