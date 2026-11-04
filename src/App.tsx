import { createContext, lazy, Suspense, useContext, type ComponentType } from 'react';
import { Route, Routes, useParams } from 'react-router';
import { SiteLayout } from '@/components/layout/SiteLayout';
import { categories, type Category } from '@/tools.registry';
import { staticPages } from '@/lib/seo';
import HomePage from '@/pages/HomePage';
import NotFoundPage from '@/pages/NotFoundPage';

/**
 * Sayfa bileşenleri. İstemcide tembel (rota başına ayrı paket); ön-render'da (entry-server) aynı harita EAGER
 * modüllerle verilir — böylece SSR hiç askıya alınmaz, içerik HTML'de yerinde ve görünür olur (CLS yok, SEO tam).
 */
export interface Pages {
  tools: Map<string, ComponentType>;
  Category: ComponentType<{ category: Category }>;
  Legal: ComponentType<{ path: string }>;
}

const slugOf = (path: string) => path.split('/')[2];

/** Her araç kendi klasöründe: src/tools/<slug>/index.tsx */
const clientPages: Pages = {
  tools: new Map(
    Object.entries(import.meta.glob<{ default: ComponentType }>('./tools/*/index.tsx')).map(([p, load]) => [
      slugOf(p),
      lazy(load),
    ]),
  ),
  Category: lazy(() => import('@/pages/CategoryPage')),
  Legal: lazy(() => import('@/pages/LegalPage')),
};

export const toolSlugsWithPages = [...clientPages.tools.keys()];

const PagesContext = createContext<Pages>(clientPages);

function SlugRoute() {
  const { slug = '' } = useParams();
  const { tools, Category, Legal } = useContext(PagesContext);
  const Tool = tools.get(slug);
  // Bileşenler modül düzeyinde bir kez oluşturulur; burada yalnızca haritadan okunur
  // eslint-disable-next-line react-hooks/static-components
  if (Tool) return <Tool />;
  const cat = categories.find((c) => c.slug === slug);
  if (cat) return <Category category={cat} />;
  if (staticPages[`/${slug}`]) return <Legal path={`/${slug}`} />;
  return <NotFoundPage />;
}

export function App({ pages = clientPages }: { pages?: Pages }) {
  return (
    <PagesContext.Provider value={pages}>
      <SiteLayout>
        <Suspense fallback={<div className="min-h-[70vh]" />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/:slug" element={<SlugRoute />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </SiteLayout>
    </PagesContext.Provider>
  );
}
