import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ToolCard } from '@/components/ToolCard';
import { JsonLd } from '@/components/JsonLd';
import { AdSlot } from '@/components/AdSlot';
import { categories, toolsIn, type Category } from '@/tools.registry';
import { site } from '@/config/site';
import { Link } from 'react-router';
import { categoryIntro } from '@/content/categories';

export default function CategoryPage({ category }: { category: Category }) {
  const list = toolsIn(category.id);
  return (
    <div className="container-page pb-12">
      <Breadcrumbs items={[{ name: category.name, path: `/${category.slug}` }]} />
      <header className="flex items-start gap-4">
        <span className="hidden size-14 shrink-0 items-center justify-center rounded-2xl bg-accent text-primary sm:flex">
          <category.icon className="size-7" aria-hidden />
        </span>
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{category.title}</h1>
          <p className="mt-2 max-w-2xl text-lg text-muted-foreground">{categoryIntro[category.id].lead}</p>
        </div>
      </header>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {list.map((t) => (
          <ToolCard key={t.slug} tool={t} />
        ))}
      </div>
      <section aria-labelledby="hakkinda" className="mt-10 max-w-3xl">
        <h2 id="hakkinda" className="text-xl font-semibold">
          {category.name} hesaplamaları hakkında
        </h2>
        <div className="prose-ng mt-2">
          {categoryIntro[category.id].paragraphs.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
      </section>
      <AdSlot slot="list" />
      <section aria-labelledby="diger" className="mt-4">
        <h2 id="diger" className="text-xl font-semibold">
          Diğer kategoriler
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {categories
            .filter((c) => c.id !== category.id)
            .map((c) => (
              <Link
                key={c.id}
                to={`/${c.slug}`}
                className="flex min-h-11 items-center gap-2 rounded-full border bg-card px-4 text-sm font-medium hover:border-primary/50 hover:text-primary"
              >
                <c.icon className="size-4 text-primary" aria-hidden /> {c.name}
              </Link>
            ))}
        </div>
      </section>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: category.title,
          url: `${site.url}/${category.slug}`,
          hasPart: list.map((t) => ({ '@type': 'WebApplication', name: t.title, url: `${site.url}/${t.slug}` })),
        }}
      />
    </div>
  );
}
