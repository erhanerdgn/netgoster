import { Link } from 'react-router';
import { site } from '@/config/site';
import { categories, popularTools } from '@/tools.registry';
import { staticPages } from '@/lib/seo';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { CookieSettingsLink } from './ConsentBanner';

export function Footer() {
  return (
    <footer className="mt-16 border-t bg-card">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">
            {site.tagline}. Tüm araçlar ücretsizdir ve hesaplamalar tarayıcınızda yapılır.
          </p>
          <ThemeToggle />
        </div>
        <FooterCol title="Kategoriler" links={categories.map((c) => ({ to: `/${c.slug}`, label: c.name }))} />
        <FooterCol title="Popüler araçlar" links={popularTools.slice(0, 8).map((t) => ({ to: `/${t.slug}`, label: t.name }))} />
        <div>
          <FooterCol title="Kurumsal" links={Object.entries(staticPages).map(([to, p]) => ({ to, label: p.title }))} />
          <CookieSettingsLink />
        </div>
      </div>
      <div className="border-t">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-muted-foreground md:flex-row md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name} · {site.domain}. Sonuçlar bilgilendirme amaçlıdır; resmi işlemlerde ilgili
            kuruma danışın.
          </p>
          <p>
            Diğer projelerimiz:{' '}
            <a href="https://www.beyyine.app/" className="underline-offset-2 hover:text-primary hover:underline">
              Beyyine
            </a>{' '}
            ·{' '}
            <a href="https://www.bluconnect.app/" className="underline-offset-2 hover:text-primary hover:underline">
              BluConnect
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <nav aria-label={title}>
      <p className="text-sm font-semibold">{title}</p>
      <ul className="mt-3 space-y-0.5">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="flex min-h-9 items-center text-sm text-muted-foreground hover:text-primary">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
