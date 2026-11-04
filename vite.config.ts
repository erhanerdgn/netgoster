import path from 'node:path';
import type { Plugin } from 'vite';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { compileMarkdown } from './scripts/markdown.ts';
import { themeBootScript } from './src/lib/theme.ts';
import { getMeta, headTags } from './src/lib/seo.ts';

/** `import content from './content.md'` → { body, toc, faqs, words } (derleme anında HTML'e çevrilir, çalışma anı maliyeti yok) */
function markdown(): Plugin {
  return {
    name: 'ng-markdown',
    enforce: 'pre',
    async transform(code, id) {
      if (!id.endsWith('.md')) return;
      const mod = await compileMarkdown(code, id);
      return { code: `export default ${JSON.stringify(mod)};`, map: null };
    },
  };
}

/** Geliştirme sunucusunda <head>: tema betiği + sayfa meta'sı (üretimde scripts/prerender.ts yazar) */
function devHead(): Plugin {
  return {
    name: 'ng-dev-head',
    apply: 'serve',
    transformIndexHtml(html, ctx) {
      const url = new URL(ctx.originalUrl ?? '/', 'http://x');
      return html.replace('<!--head-->', `<script>${themeBootScript}</script>\n    ${headTags(getMeta(url.pathname))}`);
    },
  };
}

export default defineConfig({
  plugins: [markdown(), devHead(), react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(import.meta.dirname, 'src') } },
  build: { target: 'es2022', cssCodeSplit: true },
  ssr: { noExternal: true },
  test: { include: ['src/**/*.test.ts'] },
});
