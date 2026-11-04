import { Link } from 'react-router';
import { site } from '@/config/site';

/** İkon: yuvarlatılmış kare içinde "=" — iki çizgi; alttaki kısa çizgi + nokta "net sonuç"u simgeler. */
export function LogoMark({ className = 'size-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="var(--primary)" />
      <rect x="8" y="10.5" width="16" height="3.2" rx="1.6" fill="var(--primary-foreground)" />
      <rect x="8" y="18.3" width="10" height="3.2" rx="1.6" fill="var(--primary-foreground)" />
      <circle cx="22.4" cy="19.9" r="2.2" fill="var(--result)" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link to="/" className="flex min-h-11 items-center gap-2.5" aria-label={`${site.name} ana sayfa`}>
      <LogoMark />
      <span className="text-[1.3rem] leading-none tracking-tight">
        <span className="font-bold">Net</span>
        <span className="font-medium text-primary">Göster</span>
      </span>
    </Link>
  );
}
