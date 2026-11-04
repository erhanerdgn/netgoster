import { Link } from 'react-router';
import { site } from '@/config/site';

export function Logo() {
  return (
    <Link to="/" className="flex min-h-11 items-center text-foreground" aria-label={`${site.name} ana sayfa`}>
      <span className="text-[1.3rem] leading-none font-normal tracking-tight">
        <span className="font-bold">Net</span>
        <span>Göster</span>
      </span>
    </Link>
  );
}
