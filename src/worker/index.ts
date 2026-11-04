/**
 * NetGöster Worker
 * - www.netgoster.com → netgoster.com (301, yol ve sorgu korunur)
 * - /api/kurlar: TCMB today.xml → JSON (Cache API, 1 saat; hata olursa son başarılı veri)
 * - /api/altin:  ons altın (USD) × TCMB USD/TRY → gram fiyatı (Cache API, 15 dk)
 * - Statik dosyalara güvenlik ve önbellek başlıkları
 */
import { site } from '../config/site.ts';
import { getGold, getRates } from './rates.ts';

interface Env {
  ASSETS: Fetcher;
}

const security: Record<string, string> = {
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
};

function withHeaders(res: Response, path: string): Response {
  const out = new Response(res.body, res);
  for (const [k, v] of Object.entries(security)) out.headers.set(k, v);
  const type = out.headers.get('Content-Type') ?? '';
  if (path.startsWith('/assets/')) {
    // Vite hash'li dosyalar: içerik değişirse adı değişir → 1 yıl, değişmez
    out.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  } else if (type.includes('text/html')) {
    out.headers.set('Cache-Control', 'public, max-age=0, s-maxage=600, must-revalidate');
  } else if (path.startsWith('/og/') || /\.(png|svg|ico|webmanifest)$/.test(path)) {
    out.headers.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
  } else if (/\.(xml|txt)$/.test(path)) {
    out.headers.set('Cache-Control', 'public, max-age=3600');
  }
  return out;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    const host = (request.headers.get('host') ?? url.hostname).split(':')[0];
    if (host === `www.${site.domain}`) {
      url.hostname = site.domain;
      url.port = '';
      url.protocol = 'https:';
      return Response.redirect(url.toString(), 301);
    }

    if (url.pathname === '/api/kurlar') return withHeaders(await getRates(ctx), url.pathname);
    if (url.pathname === '/api/altin') return withHeaders(await getGold(ctx), url.pathname);

    const res = await env.ASSETS.fetch(request);
    return withHeaders(res, url.pathname);
  },
} satisfies ExportedHandler<Env>;
