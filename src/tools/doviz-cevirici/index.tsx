import { useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { AlertTriangle, CalendarClock, RefreshCw, WifiOff } from 'lucide-react';
import { CalculatorLayout } from '@/components/calc/CalculatorLayout';
import { ChoiceField, NumberField, SelectField } from '@/components/calc/fields';
import type { ResultView } from '@/components/calc/ResultCard';
import { Button } from '@/components/ui/button';
import {
  calculateDoviz,
  dovizSchema,
  KurYokHatasi,
  kurTurleri,
  paraBirimleri,
  type DovizInput,
  type TcmbKurlari,
} from '@/calculators/doviz';
import { useLive, type Live } from '@/lib/liveData';
import { currency, dateLong, dateTR, num } from '@/lib/format';
import content from './content.md';

const defaults: Partial<DovizInput> = { tutar: 100, kaynak: 'USD', hedef: 'TRY', kurTuru: 'forexSelling' };
const example: DovizInput = { tutar: 2500, kaynak: 'EUR', hedef: 'TRY', kurTuru: 'banknoteSelling', elleKur: 48.5 };
const options = paraBirimleri.map((p) => ({ value: p.code, label: `${p.code} — ${p.name}` }));
const adi = (code: string) => paraBirimleri.find((p) => p.code === code)?.name ?? code;

/** "2026-11-04T09:12:00Z" → "04.11.2026 12:12" (Türkiye saati). Yalnız veri geldikten sonra (istemcide) çağrılır. */
const zaman = (iso: string) =>
  new Intl.DateTimeFormat('tr-TR', {
    timeZone: 'Europe/Istanbul',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));

/**
 * CalculatorLayout yalnız form değerleri değişince yeniden hesaplar; canlı veri sonradan geldiğinde
 * aynı değerlerle reset ederek (durum korunur) yeniden hesaplamayı tetikler.
 */
function useRecomputeOn(key: string | null) {
  const form = useFormContext<DovizInput>();
  useEffect(() => {
    if (!key) return;
    form.reset(form.getValues(), {
      keepDefaultValues: true,
      keepDirty: true,
      keepDirtyValues: true,
      keepErrors: true,
      keepTouched: true,
      keepIsSubmitted: true,
      keepSubmitCount: true,
      keepIsValid: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}

function KurDurumu({ live }: { live: Live<TcmbKurlari> }) {
  useRecomputeOn(live.status === 'loading' ? null : `${live.status}:${live.fetchedAt}`);
  const [kaynak, hedef] = useWatch<DovizInput, ['kaynak', 'hedef']>({ name: ['kaynak', 'hedef'] });

  if (live.status === 'loading') {
    return (
      <div role="status" aria-label="Kurlar yükleniyor" className="mb-5 flex items-center gap-3 rounded-xl bg-muted p-3.5">
        <span className="size-9 shrink-0 animate-pulse rounded-full bg-muted-foreground/20" />
        <span className="flex-1 space-y-2">
          <span className="block h-3.5 w-2/3 animate-pulse rounded bg-muted-foreground/20" />
          <span className="block h-3 w-1/3 animate-pulse rounded bg-muted-foreground/15" />
        </span>
        <span className="sr-only">TCMB kurları yükleniyor…</span>
      </div>
    );
  }

  if (live.status === 'error' || !live.data) {
    return (
      <div className="mb-5 space-y-4 rounded-xl border border-warning/30 bg-warning-soft p-4">
        <div className="flex items-start gap-3">
          <WifiOff className="mt-0.5 size-5 shrink-0 text-warning" aria-hidden />
          <div className="flex-1 text-sm">
            <p className="font-semibold text-foreground">TCMB kurları şu an alınamıyor</p>
            <p className="mt-0.5 text-muted-foreground">
              Bankanızın veya TCMB’nin güncel kurunu aşağıya elle girerek çeviriye devam edebilirsiniz.
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={live.retry}>
            <RefreshCw aria-hidden /> Yeniden dene
          </Button>
        </div>
        <NumberField<DovizInput>
          name="elleKur"
          label={`1 ${kaynak ?? ''} = ? ${hedef ?? ''}`}
          unit={hedef}
          decimals={6}
          placeholder="Örn. 41,8750"
          help="Seçtiğiniz kaynak para biriminin 1 biriminin hedef para birimindeki karşılığı."
        />
      </div>
    );
  }

  const d = live.data;
  const stale = live.status === 'stale';
  return (
    <div
      className={
        stale
          ? 'mb-5 flex items-start gap-3 rounded-xl border border-warning/30 bg-warning-soft p-3.5 text-sm'
          : 'mb-5 flex items-start gap-3 rounded-xl bg-accent p-3.5 text-sm text-accent-foreground'
      }
    >
      {stale ? (
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-warning" aria-hidden />
      ) : (
        <CalendarClock className="mt-0.5 size-5 shrink-0" aria-hidden />
      )}
      <div className="flex-1">
        <p className="font-semibold text-foreground">
          TCMB kurları: <time dateTime={d.date}>{dateLong(d.date)}</time>
          {d.bulletin && <span className="font-normal text-muted-foreground"> · Bülten {d.bulletin}</span>}
        </p>
        <p className="mt-0.5 text-muted-foreground">
          {stale
            ? `Canlı kur alınamadı; ${live.fetchedAt ? `${zaman(live.fetchedAt)} tarihinde alınan ` : ''}son başarılı veri gösteriliyor.`
            : `Veri alındı: ${live.fetchedAt ? zaman(live.fetchedAt) : '—'}. TCMB hafta içi 15.30’da yeni kur yayımlar.`}
        </p>
      </div>
      {stale && (
        <Button type="button" variant="outline" size="sm" onClick={live.retry}>
          <RefreshCw aria-hidden /> Yeniden dene
        </Button>
      )}
    </div>
  );
}

export default function DovizCeviriciPage() {
  const live = useLive<TcmbKurlari>('/api/kurlar');
  const data = live.data;

  function present(v: Parameters<typeof calculateDoviz>[0]): ResultView {
    if (!data && live.status !== 'error') throw new Error('Kurlar yükleniyor');
    let r;
    try {
      r = calculateDoviz(v, data?.rates ?? null);
    } catch (e) {
      if (!(e instanceof KurYokHatasi)) throw e;
      return { main: { label: `${v.hedef} karşılığı`, value: '—' }, status: { tone: 'warn', text: e.message } };
    }
    const tur = kurTurleri.find((k) => k.value === v.kurTuru)!.label;
    const jpy = [v.kaynak, v.hedef].includes('JPY');
    return {
      main: {
        label: `${adi(v.hedef)} karşılığı`,
        value: currency(r.sonuc, v.hedef),
        caption: `${currency(v.tutar, v.kaynak)} · ${r.elle ? 'elle girilen kur' : `TCMB ${tur.toLocaleLowerCase('tr-TR')} kuru`}`,
      },
      rows: [
        { label: `1 ${v.kaynak}`, value: `${num(r.kur, 6)} ${v.hedef}` },
        { label: `1 ${v.hedef}`, value: `${num(r.tersKur, 6)} ${v.kaynak}`, tone: 'muted' },
        ...(r.kaynakTl !== null
          ? [{ label: `${v.kaynak} birim kuru`, value: `${num(r.kaynakTl, 6)} ₺`, tone: 'muted' as const }]
          : []),
        ...(r.hedefTl !== null
          ? [{ label: `${v.hedef} birim kuru`, value: `${num(r.hedefTl, 6)} ₺`, tone: 'muted' as const }]
          : []),
        ...(data && !r.elle ? [{ label: 'Kur tarihi', value: dateTR(data.date), tone: 'muted' as const }] : []),
        { label: 'Sonuç', value: currency(r.sonuc, v.hedef), tone: 'total' },
      ],
      status: r.dovizeDusulen.length
        ? {
            tone: 'info',
            text: `TCMB ${r.dovizeDusulen.join(', ')} için efektif kur yayımlamıyor; aynı yöndeki döviz kuru kullanıldı.`,
          }
        : r.elle
          ? { tone: 'info', text: 'Canlı kur alınamadığı için girdiğiniz kur kullanıldı.' }
          : undefined,
      notes: [
        ...(v.kaynak !== 'TRY' && v.hedef !== 'TRY'
          ? ['Çapraz kur TRY üzerinden, her iki para biriminde aynı kur türüyle hesaplanır.']
          : []),
        ...(jpy ? ['TCMB Japon yeni kurunu 100 yen için yayımlar; birim kur 100’e bölünerek kullanılır.'] : []),
        'TCMB kurları gösterge niteliğindedir; bankaların ve döviz bürolarının uyguladığı kurlar farklı olabilir.',
      ],
    };
  }

  return (
    <CalculatorLayout
      slug="doviz-cevirici"
      schema={dovizSchema}
      defaults={defaults}
      example={example}
      compute={present}
      content={content}
      formTop={<KurDurumu live={live} />}
      emptyHint="Kurlar yüklendiğinde girdiğiniz tutar seçtiğiniz para birimine anında çevrilir."
    >
      <NumberField<DovizInput>
        name="tutar"
        label="Tutar"
        placeholder="Örn. 100"
        className="sm:col-span-2"
        help="Çevirmek istediğiniz, kaynak para birimi cinsinden tutar."
      />
      <SelectField<DovizInput> name="kaynak" label="Kaynak para birimi" options={options} help="Elinizdeki para birimi." />
      <SelectField<DovizInput>
        name="hedef"
        label="Hedef para birimi"
        options={options}
        help="Çevirmek istediğiniz para birimi. İki döviz arasında çeviri TRY üzerinden çapraz kurla yapılır."
      />
      <ChoiceField<DovizInput>
        name="kurTuru"
        label="Kur türü"
        className="sm:col-span-2"
        options={kurTurleri}
        help="Döviz kurları banka hesapları ve transferler, efektif kurlar nakit (banknot) alım-satımı içindir. Alış: bankanın sizden döviz aldığı, satış: size döviz sattığı kur."
      />
    </CalculatorLayout>
  );
}
