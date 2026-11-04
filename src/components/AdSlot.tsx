import { useEffect, useRef, useState } from 'react';
import { cn } from 'cn';
import { site } from '@/config/site';
import { adsEnabled, getConsent, onConsent } from '@/lib/consent';

export type SlotName = keyof typeof site.adSlots;

const slotLabels: Record<SlotName, string> = {
  result: 'Sonucun altı',
  content: 'İçerik arası',
  content2: 'İçerik arası (2)',
  sidebar: 'Kenar çubuğu (yapışkan)',
  footer: 'Sayfa sonu',
  list: 'Liste arası',
};

const sizes = {
  /** Yatay/duyarlı birim: mobilde 280px, masaüstünde 250px yer ayrılır */
  horizontal: 'min-h-[280px] sm:min-h-[250px]',
  /** Masaüstü kenar çubuğu (300×600) */
  vertical: 'min-h-[600px]',
} as const;

interface Props {
  slot: SlotName;
  variant?: keyof typeof sizes;
  /** Yalnız ≥1024px ekranda çizilir (gizli reklam = politika ihlali; CSS ile gizlemek yerine hiç çizilmez) */
  desktopOnly?: boolean;
  className?: string;
}

/**
 * Reklam alanı: sabit yükseklik (CLS yok), "Reklam" etiketi, ekrana yaklaşınca yüklenir (lazy).
 * - AdSense kimliği boşsa üretimde HİÇBİR şey çizmez; geliştirmede gri yer tutucu gösterir.
 * - Slot kimliği boşsa o birim çizilmez (Otomatik reklamlar açıksa Google kendisi yerleştirir).
 * - Çerez tercihi yapılmadan reklam isteği gönderilmez.
 */
export function AdSlot({ slot, variant = 'horizontal', desktopOnly, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(!desktopOnly);
  // ?reklam-onizleme → reklam yerleri canlı sitede de işaretli kutular olarak görünür (yerleşimi görmek için)
  const [preview, setPreview] = useState(import.meta.env.DEV);
  const pushed = useRef(false);
  const slotId = site.adSlots[slot];

  useEffect(() => {
    if (desktopOnly) setAllowed(window.matchMedia('(min-width: 1024px)').matches);
    if (new URLSearchParams(location.search).has('reklam-onizleme')) setPreview(true);
  }, [desktopOnly]);

  useEffect(() => {
    if (!adsEnabled || !slotId || !allowed || !ref.current) return;
    const el = ref.current;
    let visible = false;
    const tryPush = () => {
      if (visible && getConsent() && !pushed.current) {
        pushed.current = true;
        setReady(true);
        requestAnimationFrame(() => {
          try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          } catch {
            /* reklam engelleyici */
          }
        });
      }
    };
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          visible = true;
          io.disconnect();
          tryPush();
        }
      },
      { rootMargin: '400px' },
    );
    io.observe(el);
    const off = onConsent(tryPush);
    return () => {
      io.disconnect();
      off();
    };
  }, [slotId, allowed]);

  if (!allowed) return null;

  const label = <p className="mb-1 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">Reklam</p>;

  if (preview && (!adsEnabled || !slotId || new URLSearchParams(location.search).has('reklam-onizleme'))) {
    return (
      <div data-no-print className={cn('my-8', className)}>
        {label}
        <div
          className={cn(
            'flex flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-warning/60 bg-warning-soft p-4 text-center text-sm text-warning',
            sizes[variant],
          )}
        >
          <span className="text-base font-semibold">Reklam alanı: {slotLabels[slot]}</span>
          <code className="rounded bg-card px-2 py-0.5 text-xs text-foreground">VITE_AD_SLOT_{slot.toUpperCase()}</code>
          <span className="text-xs">
            {variant === 'vertical' ? '300×600 dikey · yalnız masaüstü' : 'Duyarlı · mobil 280px / masaüstü 250px'}
          </span>
        </div>
      </div>
    );
  }

  if (!adsEnabled || !slotId) return null;

  return (
    <aside data-no-print aria-label="Reklam" className={cn('my-8', className)}>
      {label}
      <div ref={ref} className={cn('overflow-hidden rounded-2xl border bg-card p-2', sizes[variant])}>
        {ready && (
          <ins
            className="adsbygoogle block"
            style={{ display: 'block', minHeight: variant === 'vertical' ? 600 : 250 }}
            data-ad-client={site.adsenseClient}
            data-ad-slot={slotId}
            data-ad-format={variant === 'vertical' ? 'vertical' : 'auto'}
            data-full-width-responsive={variant === 'vertical' ? 'false' : 'true'}
          />
        )}
      </div>
    </aside>
  );
}
