import { Link } from 'react-router';
import { site } from '@/config/site';

/*
 * Logo işareti: "N" monogramı + sağ üstte sonuç noktası.
 * Geometri scripts/og.ts > logoSvg() ile birebir aynı (favicon, apple-touch-icon ve PWA
 * ikonları oradan üretilir). Birini değiştirirseniz ötekini de değiştirin.
 * Kutu rengi `currentColor` değil sabit: koyu header ve açık zemin fark etmeksizin
 * aynı görünsün diye marka mavisi doğrudan yazılı.
 */
function Isaret({ boyut = 30 }: { boyut?: number }) {
  return (
    <svg width={boyut} height={boyut} viewBox="0 0 32 32" aria-hidden className="shrink-0">
      <rect width="32" height="32" rx="9" fill="#1663a3" />
      <rect x="8" y="9" width="3.2" height="14" rx="1.6" fill="#fff" />
      <rect x="20.8" y="9" width="3.2" height="14" rx="1.6" fill="#fff" />
      <path d="M11.2 10.6 L20.8 21.4" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" />
      <circle cx="24.2" cy="8.6" r="3" fill="#4fd1a0" stroke="#1663a3" strokeWidth="1.6" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link to="/" className="flex min-h-11 items-center gap-2 text-foreground" aria-label={`${site.name} ana sayfa`}>
      <Isaret />
      <span className="text-[1.3rem] leading-none font-normal tracking-tight">
        <span className="font-bold">Net</span>
        <span>Göster</span>
      </span>
    </Link>
  );
}
