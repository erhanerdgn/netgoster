import { useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router';
import { getMeta } from '@/lib/seo';
import { Header } from './Header';
import { Footer } from './Footer';
import { ConsentBanner } from './ConsentBanner';

function setMeta(selector: string, attr: string, value: string) {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

/** İstemci tarafı gezinmede <head> etiketlerini günceller (ilk yükte prerender HTML zaten doğru). */
function RouteEffects() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    const m = getMeta(pathname);
    document.title = m.title;
    setMeta('meta[name="description"]', 'content', m.description);
    setMeta('link[rel="canonical"]', 'href', m.path === '/' ? location.origin + '/' : location.origin + m.path);
    setMeta('meta[property="og:title"]', 'content', m.title);
    setMeta('meta[property="og:description"]', 'content', m.description);
    setMeta('meta[property="og:image"]', 'content', m.ogImage);
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <RouteEffects />
      <Header />
      <main id="icerik">{children}</main>
      <Footer />
      <ConsentBanner />
    </>
  );
}
