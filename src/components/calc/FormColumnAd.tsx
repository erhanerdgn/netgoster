import { useEffect, useState, type RefObject } from 'react';
import { AdSlot } from '@/components/AdSlot';

/** Yalnızca uzun sonuç kartının solunda reklam için yeterli boşluk varsa çizilir. */
export function FormColumnAd({
  formRef,
  resultRef,
}: {
  formRef: RefObject<HTMLFormElement | null>;
  resultRef: RefObject<HTMLDivElement | null>;
}) {
  const [hasRoom, setHasRoom] = useState(false);
  useEffect(() => {
    const form = formRef.current;
    const result = resultRef.current;
    if (!form || !result) return;
    const media = window.matchMedia('(min-width: 1024px)');
    const measure = () => {
      const gap = result.getBoundingClientRect().height - form.getBoundingClientRect().height;
      setHasRoom(media.matches && gap >= 274);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(form);
    observer.observe(result);
    media.addEventListener('change', measure);
    measure();
    return () => {
      observer.disconnect();
      media.removeEventListener('change', measure);
    };
  }, [formRef, resultRef]);
  return hasRoom ? <AdSlot slot="form" desktopOnly className="my-0" /> : null;
}
