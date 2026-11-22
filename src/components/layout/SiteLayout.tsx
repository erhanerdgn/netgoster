import { useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router';
import { EmbedContext, isEmbedPath } from '@/lib/embed';
import { getMeta } from '@/lib/seo';
import { Header } from './Header';
import { Footer } from './Footer';
import { ConsentBanner } from './ConsentBanner';
import { PiyasaBar } from './PiyasaBar';

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
  const { pathname } = useLocation();

  // Gömülü hesaplayıcı: yalnız içerik. Piyasa şeridi (Binance websocket), başlık, altbilgi ve
  // çerez bandı yok — çerez bandı olmayınca initConsent() hiç çağrılmaz, AdSense/GA betiği yüklenmez.
  if (isEmbedPath(pathname)) {
    return (
      <EmbedContext.Provider value>
        <RouteEffects />
        <main id="icerik">{children}</main>
      </EmbedContext.Provider>
    );
  }

  return (
    <>
      <RouteEffects />
      <PiyasaBar />
      <Header />
      <main id="icerik">{children}</main>
      <Footer />
      <ConsentBanner />
    </>
  );
}
