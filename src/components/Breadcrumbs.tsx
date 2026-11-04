import { Link } from 'react-router';
import { ChevronRight, House } from 'lucide-react';
import { site } from '@/config/site';
import { JsonLd } from './JsonLd';

export interface Crumb {
  name: string;
  path: string;
}

/** Görünür breadcrumb + BreadcrumbList JSON-LD */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all = [{ name: 'Ana Sayfa', path: '/' }, ...items];
  return (
    <>
      <nav aria-label="Sayfa konumu" className="py-4 text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1">
          {all.map((c, i) => {
            const last = i === all.length - 1;
            return (
              <li key={c.path} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="size-3.5" aria-hidden />}
                {last ? (
                  <span aria-current="page" className="font-medium text-foreground">
                    {c.name}
                  </span>
                ) : (
                  <Link to={c.path} className="inline-flex min-h-8 items-center gap-1 hover:text-primary">
                    {i === 0 && <House className="size-3.5" aria-hidden />}
                    {c.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: all.map((c, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: c.name,
            item: site.url + (c.path === '/' ? '/' : c.path),
          })),
        }}
      />
    </>
  );
}
