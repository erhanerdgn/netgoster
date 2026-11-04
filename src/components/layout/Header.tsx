import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { ChevronDown, Menu, Search } from 'lucide-react';
import { cn } from 'cn';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { categories, toolsIn } from '@/tools.registry';
import { Logo } from './Logo';
import { ThemeButton, ThemeToggle } from './ThemeToggle';

const SearchDialog = lazy(() => import('./SearchDialog'));

/** Sayfanın herhangi bir yerinden arama penceresini açar (ana sayfa arama kutusu, 404). */
export function openSearch() {
  window.dispatchEvent(new Event('ng:search'));
}

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchLoaded, setSearchLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [catsOpen, setCatsOpen] = useState(false);
  const catsRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    setMenuOpen(false);
    setCatsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!catsOpen) return;
    const close = (e: PointerEvent) => !catsRef.current?.contains(e.target as Node) && setCatsOpen(false);
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [catsOpen]);

  useEffect(() => {
    const open = () => {
      setSearchLoaded(true);
      setSearchOpen(true);
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        open();
      }
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('ng:search', open);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('ng:search', open);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-lg">
      <a
        href="#icerik"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-card focus:px-4 focus:py-3"
      >
        İçeriğe geç
      </a>
      <div className="container-page flex h-16 items-center gap-3">
        <Logo />
        <nav aria-label="Ana menü" className="ml-6 hidden items-center gap-1 lg:flex">
          <div
            ref={catsRef}
            className="relative"
            onKeyDown={(e) => e.key === 'Escape' && setCatsOpen(false)}
            onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setCatsOpen(false)}
          >
            <button
              type="button"
              aria-expanded={catsOpen}
              aria-controls="kategori-menu"
              onClick={() => setCatsOpen((o) => !o)}
              className="flex min-h-11 items-center gap-1 rounded-lg px-3 text-sm font-medium text-muted-foreground hover:text-foreground aria-expanded:text-foreground"
            >
              Hesaplamalar <ChevronDown className={cn('size-4 transition-transform', catsOpen && 'rotate-180')} aria-hidden />
            </button>
            {catsOpen && (
              <div
                id="kategori-menu"
                className="absolute top-full left-0 z-50 mt-2 w-[min(58rem,calc(100vw-2rem))] animate-in rounded-2xl border bg-popover p-5 shadow-lg duration-150 fade-in slide-in-from-top-1"
              >
                <div className="grid grid-cols-4 gap-x-6 gap-y-5">
                  {categories.map((c) => (
                    <div key={c.id}>
                      <Link to={`/${c.slug}`} className="flex items-center gap-2 text-sm font-semibold hover:text-primary">
                        <c.icon className="size-4 text-primary" aria-hidden /> {c.name}
                      </Link>
                      <ul className="mt-2 space-y-0.5">
                        {toolsIn(c.id).map((t) => (
                          <li key={t.slug}>
                            <Link
                              to={`/${t.slug}`}
                              className="block rounded-md py-1 text-sm text-muted-foreground hover:text-primary"
                            >
                              {t.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {categories.slice(0, 3).map((c) => (
            <NavLink
              key={c.id}
              to={`/${c.slug}`}
              className={({ isActive }) =>
                cn(
                  'flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-muted-foreground hover:text-foreground',
                  isActive && 'text-primary',
                )
              }
            >
              {c.name}
            </NavLink>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={openSearch}
            className="flex min-h-11 items-center gap-2 rounded-full border bg-card px-3.5 text-sm text-muted-foreground hover:border-primary/40 sm:w-56"
            aria-label="Araç ara"
            aria-keyshortcuts="Control+K Meta+K"
          >
            <Search className="size-4" aria-hidden />
            <span className="hidden sm:inline">Araç ara…</span>
            <kbd className="ml-auto hidden rounded border bg-muted px-1.5 text-[11px] font-medium sm:inline">Ctrl K</kbd>
          </button>
          <ThemeButton />
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger
              className="flex size-11 items-center justify-center rounded-full hover:bg-accent lg:hidden"
              aria-label="Menüyü aç"
            >
              <Menu className="size-5" aria-hidden />
            </SheetTrigger>
            <SheetContent side="right" className="w-[88vw] max-w-sm overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Hesaplamalar</SheetTitle>
              </SheetHeader>
              <nav aria-label="Mobil menü" className="space-y-5 px-4 pb-6">
                {categories.map((c) => (
                  <div key={c.id}>
                    <Link to={`/${c.slug}`} className="flex min-h-11 items-center gap-2 font-semibold">
                      <c.icon className="size-4 text-primary" aria-hidden /> {c.name}
                    </Link>
                    <ul>
                      {toolsIn(c.id).map((t) => (
                        <li key={t.slug}>
                          <Link to={`/${t.slug}`} className="flex min-h-11 items-center pl-6 text-sm text-muted-foreground">
                            {t.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <ThemeToggle />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      {searchLoaded && (
        <Suspense fallback={null}>
          <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
        </Suspense>
      )}
    </header>
  );
}
