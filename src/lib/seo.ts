import { site } from '../config/site.ts';
import { categories, toolBySlug } from '../tools.registry.ts';
import { DATA_YEAR } from '../config/parameters-2026.ts';

export interface PageMeta {
  title: string;
  description: string;
  path: string;
  ogImage: string;
  noindex?: boolean;
}

/** Yasal / kurumsal sayfaların meta bilgisi (içerikleri src/pages/legal.tsx) */
export const staticPages: Record<string, { title: string; description: string }> = {
  '/hakkimizda': {
    title: 'Hakkımızda',
    description: `${site.name}: Türkiye için güncel mevzuata dayalı, ücretsiz ve hızlı hesaplama araçları. Amacımız, yöntemimiz ve kaynaklarımız.`,
  },
  '/iletisim': {
    title: 'İletişim',
    description: `${site.name} ile iletişime geçin: hata bildirimi, öneri ve iş birliği talepleriniz için e-posta adresimiz.`,
  },
  '/gizlilik-politikasi': {
    title: 'Gizlilik Politikası',
    description: `${site.name} gizlilik politikası: hangi verilerin işlendiği, çerezler, reklam ortakları ve haklarınız.`,
  },
  '/cerez-politikasi': {
    title: 'Çerez Politikası',
    description: `${site.name} çerez politikası: zorunlu ve reklam çerezleri, Google AdSense ve çerez tercihlerinizi nasıl yöneteceğiniz.`,
  },
  '/kullanim-sartlari': {
    title: 'Kullanım Şartları',
    description: `${site.name} kullanım şartları: hesaplama sonuçlarının niteliği, sorumluluk sınırları ve fikri mülkiyet.`,
  },
  '/kvkk-aydinlatma-metni': {
    title: 'KVKK Aydınlatma Metni',
    description: `${site.name} 6698 sayılı KVKK kapsamında aydınlatma metni: veri sorumlusu, işleme amaçları, aktarım ve haklarınız.`,
  },
};

const suffix = ` | ${site.name}`;

export function getMeta(pathname: string): PageMeta {
  const path = pathname.replace(/\/+$/, '') || '/';
  const og = (name: string) => `${site.url}/og/${name}.png`;
  if (path === '/') {
    return {
      title: `Hesaplama Araçları ${DATA_YEAR}${suffix} – Maaş, Tazminat, Kredi, Sınav`,
      description: site.description,
      path,
      ogImage: og('home'),
    };
  }
  const slug = path.slice(1);
  const tool = toolBySlug.get(slug);
  if (tool) {
    return {
      title: `${tool.title}${tool.noYear ? '' : ` ${DATA_YEAR}`}${suffix}`,
      description: tool.description,
      path,
      ogImage: og(tool.slug),
    };
  }
  const cat = categories.find((c) => c.slug === slug);
  if (cat) {
    return {
      title: `${cat.title} ${DATA_YEAR}${suffix}`,
      description: `${cat.title}: ${cat.description} Güncel parametrelerle ücretsiz hesaplayın.`,
      path,
      ogImage: og(cat.slug),
    };
  }
  const page = staticPages[path];
  if (page) return { title: page.title + suffix, description: page.description, path, ogImage: og('home') };
  return {
    title: `Sayfa bulunamadı${suffix}`,
    description: 'Aradığınız sayfa bulunamadı. Hesaplama araçlarımıza göz atın.',
    path,
    ogImage: og('home'),
    noindex: true,
  };
}

/** Prerender ve istemci aynı <head> etiketlerini üretir */
export function headTags(meta: PageMeta): string {
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  const url = site.url + (meta.path === '/' ? '/' : meta.path);
  const tags = [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}">`,
    meta.noindex ? '<meta name="robots" content="noindex, follow">' : `<link rel="canonical" href="${url}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="${esc(site.name)}">`,
    `<meta property="og:locale" content="tr_TR">`,
    `<meta property="og:title" content="${esc(meta.title)}">`,
    `<meta property="og:description" content="${esc(meta.description)}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:image" content="${meta.ogImage}">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${esc(meta.title)}">`,
    `<meta name="twitter:description" content="${esc(meta.description)}">`,
    `<meta name="twitter:image" content="${meta.ogImage}">`,
  ];
  return tags.join('\n    ');
}
