/**
 * Statik ön-render (SSG): her rota derleme anında TAM HTML olarak üretilir
 * (içerik, title, meta, canonical, OG, JSON-LD dahil). Ardından sitemap, robots, ads.txt,
 * manifest, favicon'lar ve her araç için Open Graph görseli oluşturulur.
 */
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { ogImage, iconPng, logoSvg } from './og.ts';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
const ssr = await import(pathToFileURL(path.join(root, 'dist-ssr', 'entry-server.js')).href);
const { render, routes, getMeta, headTags, site, tools, categories, themeBootScript, consentDefaultScript } = ssr;

const template = await readFile(path.join(dist, 'index.html'), 'utf8');

// Latin font dosyasını önceden yükle (LCP metni için)
const assets = await readdir(path.join(dist, 'assets'));
const font = assets.find((f) => /^inter-tr-var-.*\.woff2$/.test(f));

function commonHead(): string {
  const tags = [`<script>${themeBootScript}</script>`];
  if (font) tags.push(`<link rel="preload" href="/assets/${font}" as="font" type="font/woff2" crossorigin>`);
  if (site.searchConsoleVerification)
    tags.push(`<meta name="google-site-verification" content="${site.searchConsoleVerification}">`);
  if (site.bingVerification) tags.push(`<meta name="msvalidate.01" content="${site.bingVerification}">`);
  if (site.adsenseClient) {
    tags.push(`<meta name="google-adsense-account" content="${site.adsenseClient}">`);
    tags.push(`<script>${consentDefaultScript}</script>`);
    tags.push('<link rel="preconnect" href="https://pagead2.googlesyndication.com" crossorigin>');
  }
  return tags.join('\n    ');
}

const head = commonHead();
const fileFor = (route: string) => (route === '/' ? 'index.html' : `${route.slice(1)}.html`);
const problems: string[] = [];

async function writePage(route: string, file: string) {
  const body = await render(route);
  const meta = getMeta(route);
  const html = template.replace('<!--head-->', `${headTags(meta)}\n    ${head}`).replace('<!--app-->', body);
  // Doğrulama: tek H1, başlık, açıklama
  if (/<!--\$[?!]-->/.test(body))
    problems.push(`${route}: askıda/istemci-çizimli Suspense sınırı (içerik HTML'de yerinde değil)`);
  const h1 = (body.match(/<h1[\s>]/g) ?? []).length;
  if (h1 !== 1) problems.push(`${route}: ${h1} adet H1`);
  if (meta.title.length > 70) problems.push(`${route}: başlık ${meta.title.length} karakter`);
  await writeFile(path.join(dist, file), html);
  return html.length;
}

let total = 0;
for (const route of routes as string[]) {
  total += await writePage(route, fileFor(route));
}
await writePage('/404', '404.html');
console.log(`✓ ${routes.length} sayfa + 404 ön-render edildi (${(total / 1024).toFixed(0)} KB HTML)`);

// sitemap.xml — yalnızca dizine eklenecek sayfalar
const today = new Date().toISOString().slice(0, 10);
const lastmod = (route: string) => tools.find((t: { slug: string; updated: string }) => `/${t.slug}` === route)?.updated ?? today;
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${(routes as string[])
  .map(
    (r) =>
      `  <url><loc>${site.url}${r === '/' ? '/' : r}</loc><lastmod>${lastmod(r)}</lastmod><priority>${
        r === '/'
          ? '1.0'
          : r.endsWith('hesaplamalari') || r.endsWith('hesaplamalar')
            ? '0.8'
            : tools.some((t: { slug: string }) => `/${t.slug}` === r)
              ? '0.9'
              : '0.3'
      }</priority></url>`,
  )
  .join('\n')}
</urlset>
`;
await writeFile(path.join(dist, 'sitemap.xml'), sitemap);
await writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${site.url}/sitemap.xml\n`);
await writeFile(
  path.join(dist, 'ads.txt'),
  site.adsenseClient
    ? `google.com, ${site.adsenseClient.replace(/^ca-/, '')}, DIRECT, f08c47fec0942fa0\n`
    : '# AdSense yayıncı kimliği src/config/site.ts içinde tanımlanınca otomatik doldurulur.\n',
);

// llms.txt — yapay zekâ arama/yanıt motorları için site özeti (https://llmstxt.org)
const llms = [
  `# ${site.name}`,
  '',
  `> ${site.description}`,
  '',
  'Tüm hesaplamalar Türkiye mevzuatına ve resmi kaynaklara (Resmî Gazete, GİB, SGK, İŞKUR, TÜİK, TCMB, ÖSYM, MEB) dayanır; parametreler tarih aralıklıdır ve hesaplama tarihine göre seçilir.',
  '',
  ...categories.flatMap((c: { id: string; title: string; slug: string }) => [
    `## ${c.title}`,
    '',
    ...tools
      .filter((t: { category: string }) => t.category === c.id)
      .map(
        (t: { slug: string; title: string; description: string }) => `- [${t.title}](${site.url}/${t.slug}): ${t.description}`,
      ),
    '',
  ]),
].join('\n');
await writeFile(path.join(dist, 'llms.txt'), llms);

// Logo, favicon ve PWA manifest — tek SVG'den türetilir
await writeFile(path.join(dist, 'favicon.svg'), logoSvg());
await writeFile(path.join(dist, 'favicon-32.png'), iconPng(32));
await writeFile(path.join(dist, 'apple-touch-icon.png'), iconPng(180));
await writeFile(path.join(dist, 'icon-192.png'), iconPng(192));
await writeFile(path.join(dist, 'icon-512.png'), iconPng(512));
await writeFile(
  path.join(dist, 'manifest.webmanifest'),
  JSON.stringify(
    {
      name: `${site.name} – Hesaplama Araçları`,
      short_name: site.name,
      description: site.description,
      lang: 'tr',
      start_url: '/',
      display: 'standalone',
      background_color: '#f4f7fb',
      theme_color: site.themeColor,
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    null,
    2,
  ),
);

// Open Graph görselleri (1200×630 PNG)
const ogDir = path.join(dist, 'og');
await rm(ogDir, { recursive: true, force: true });
await mkdir(ogDir, { recursive: true });
const ogJobs: [string, string, string][] = [
  ['home', 'Hesaplama Araçları', site.tagline],
  ...tools.map((t: { slug: string; title: string; name: string; category: string }) => [
    t.slug,
    t.title,
    categories.find((c: { id: string }) => c.id === t.category)?.title ?? '',
  ]),
  ...categories.map((c: { slug: string; title: string; description: string }) => [c.slug, c.title, `${site.name} kategorisi`]),
];
for (const [name, title, subtitle] of ogJobs) {
  await writeFile(path.join(ogDir, `${name}.png`), await ogImage(title, subtitle));
}
console.log(`✓ ${ogJobs.length} Open Graph görseli, sitemap.xml, robots.txt, ads.txt, manifest`);

if (problems.length) {
  console.error('✗ SEO denetimi:\n  ' + problems.join('\n  '));
  process.exit(1);
}
