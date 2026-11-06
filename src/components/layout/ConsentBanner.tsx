import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Cookie } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { consentNeeded, getConsent, initConsent, setConsent } from '@/lib/consent';

/** Rahatsız etmeyen alt kart. Yalnızca reklam/analitik açıksa ve kullanıcı henüz seçim yapmadıysa görünür. */
export function ConsentBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!consentNeeded) return;
    initConsent();
    setShow(getConsent() === null);
    const open = () => setShow(true);
    window.addEventListener('ng:consent', open);
    return () => window.removeEventListener('ng:consent', open);
  }, []);
  if (!show) return null;
  const choose = (c: 'granted' | 'denied') => {
    setConsent(c);
    setShow(false);
  };
  return (
    <div
      role="dialog"
      aria-labelledby="cerez-baslik"
      data-no-print
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl animate-in rounded-2xl border bg-card p-4 shadow-lg duration-300 fade-in slide-in-from-bottom-3 sm:p-5"
    >
      <div className="flex gap-3">
        <Cookie className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
        <div>
          <p id="cerez-baslik" className="font-semibold">
            Çerez tercihiniz
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Siteyi ücretsiz sunabilmek için reklam gösteriyor, ziyaretleri ölçmek için Google Analytics kullanıyoruz. Reklam ve
            analitik çerezlerine izin verebilir veya yalnızca zorunlu çerezlerle devam edebilirsiniz.{' '}
            <Link to="/cerez-politikasi" className="text-primary underline underline-offset-4">
              Ayrıntılar
            </Link>
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button onClick={() => choose('granted')}>Kabul et</Button>
            <Button variant="outline" onClick={() => choose('denied')}>
              Yalnızca zorunlu
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CookieSettingsLink() {
  if (!consentNeeded) return null;
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event('ng:consent'))}
      className="mt-0.5 flex min-h-9 items-center text-sm text-muted-foreground hover:text-primary"
    >
      Çerez tercihleri
    </button>
  );
}
