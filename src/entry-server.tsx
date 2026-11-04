import { StrictMode } from 'react';
import { prerenderToNodeStream } from 'react-dom/static';
import { StaticRouter } from 'react-router';
import type { ComponentType } from 'react';
import { App, toolSlugsWithPages, type Pages } from './App';
import CategoryPage from './pages/CategoryPage';
import LegalPage from './pages/LegalPage';
import { getMeta, headTags, staticPages } from './lib/seo';
import { categories, tools } from './tools.registry';

export { getMeta, headTags, categories, tools, toolSlugsWithPages };
export { site } from './config/site';
export { themeBootScript } from './lib/theme';
export { consentDefaultScript } from './lib/consent';

export const routes = [
  '/',
  ...toolSlugsWithPages.map((s) => `/${s}`),
  ...categories.map((c) => `/${c.slug}`),
  ...Object.keys(staticPages),
];

/** Ön-render için EAGER sayfa haritası — hiçbir Suspense sınırı askıya alınmaz */
const ssrPages: Pages = {
  tools: new Map(
    Object.entries(import.meta.glob<{ default: ComponentType }>('./tools/*/index.tsx', { eager: true })).map(([p, m]) => [
      p.split('/')[2],
      m.default,
    ]),
  ),
  Category: CategoryPage,
  Legal: LegalPage,
};

/** Rotayı tam HTML'e çevirir; Suspense/lazy sınırlarının hepsini bekler. */
export async function render(url: string): Promise<string> {
  const { prelude } = await prerenderToNodeStream(
    <StrictMode>
      <StaticRouter location={url}>
        <App pages={ssrPages} />
      </StaticRouter>
    </StrictMode>,
    // Büyük Suspense sınırlarını sayfa sonuna "dışarı alma" — içerik yerinde, gizli değil, JS'siz de görünür
    { progressiveChunkSize: Number.MAX_SAFE_INTEGER },
  );
  let html = '';
  for await (const chunk of prelude) html += chunk;
  return html;
}
