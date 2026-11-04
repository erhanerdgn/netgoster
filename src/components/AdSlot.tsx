import { useEffect, useRef, useState } from 'react';
import { cn } from 'cn';
import { site } from '@/config/site';
import { adsEnabled, getConsent, onConsent } from '@/lib/consent';

export type SlotName = keyof typeof site.adSlots;

const slotLabels: Record<SlotName, string> = {
  top: 'Sayfa üstü',
  result: 'Sonucun altı',
  content: 'İçerik arası',
  content2: 'İçerik arası (2)',
  sidebar: 'Kenar çubuğu',
  footer: 'Sayfa sonu',
  list: 'Ana sayfa alt bölüm',
  home: 'Ana sayfa keşif alanı',
  category: 'Kategori araç listesi altı',
};

const sizes = {
  banner: 'min-h-[100px] sm:min-h-[90px]',
  horizontal: 'min-h-[280px] sm:min-h-[250px]',
  vertical: 'min-h-[600px]',
} as const;

interface Props {
  slot: SlotName;
  variant?: keyof typeof sizes;
  desktopOnly?: boolean;
  className?: string;
}

/** Ayrılan alan reklam gelene kadar sade bir Ads kutusu olarak kalır. */
export function AdSlot({ slot, variant = 'horizontal', desktopOnly, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [filled, setFilled] = useState(false);
  const [allowed, setAllowed] = useState(!desktopOnly);
  const [forcedPreview, setForcedPreview] = useState(false);
  const pushed = useRef(false);
  const slotId = site.adSlots[slot];

  useEffect(() => {
    setForcedPreview(new URLSearchParams(location.search).has('reklam-onizleme'));
  }, []);

  useEffect(() => {
    if (!desktopOnly) return;
    const media = window.matchMedia('(min-width: 1024px)');
    const update = () => {
      setAllowed(media.matches);
      if (!media.matches) {
        pushed.current = false;
        setReady(false);
        setFilled(false);
      }
    };
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [desktopOnly]);

  useEffect(() => {
    if (!adsEnabled || !slotId || !allowed || forcedPreview || !ref.current) return;
    const el = ref.current;
    let visible = false;
    let frame = 0;
    const tryPush = () => {
      if (visible && getConsent() && !pushed.current) {
        setReady(true);
        frame = requestAnimationFrame(() => {
          if (!el.querySelector('ins')) return;
          try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            pushed.current = true;
          } catch {
            /* Reklam engellenirse yer tutucu kalır. */
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
    const observer = new MutationObserver(() => {
      setFilled(el.querySelector('ins')?.getAttribute('data-ad-status') === 'filled');
    });
    observer.observe(el, { attributes: true, subtree: true, attributeFilter: ['data-ad-status'] });
    io.observe(el);
    const off = onConsent(tryPush);
    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      observer.disconnect();
      off();
    };
  }, [slotId, allowed, forcedPreview]);

  if (!allowed) return null;

  return (
    <aside data-no-print aria-label={`Reklam: ${slotLabels[slot]}`} className={cn('my-8', className)}>
      <div ref={ref} className={cn('relative border bg-muted/40', sizes[variant], variant === 'vertical' && 'mx-auto w-[302px]')}>
        {!filled && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm font-medium tracking-wide text-muted-foreground"
          >
            Ads
          </span>
        )}
        {ready && !forcedPreview && (
          <ins
            className="adsbygoogle relative block"
            style={{
              display: 'block',
              minHeight: variant === 'vertical' ? 600 : variant === 'banner' ? 90 : 250,
              ...(variant === 'vertical' ? { width: 300 } : {}),
            }}
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
