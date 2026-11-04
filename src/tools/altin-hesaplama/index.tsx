import { useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { AlertTriangle, Gem, Info, RefreshCw, WifiOff } from 'lucide-react';
import { CalculatorLayout } from '@/components/calc/CalculatorLayout';
import { ChoiceField, NumberField, SelectField } from '@/components/calc/fields';
import type { ResultView } from '@/components/calc/ResultCard';
import { Button } from '@/components/ui/button';
import {
  altinSchema,
  altinTanimlari,
  altinTuruKodlari,
  calculateAltin,
  FiyatYokHatasi,
  type AltinFiyati,
  type AltinInput,
} from '@/calculators/altin';
import { useLive, type Live } from '@/lib/liveData';
import { currency, dateTR, num, tl } from '@/lib/format';
import content from './content.md';

const turler = altinTanimlari();
const options = altinTuruKodlari.map((k) => ({ value: k, label: turler[k].label }));
const defaults: Partial<AltinInput> = { tur: 'ceyrek', miktar: 1, kaynak: 'canli' };
const example: AltinInput = { tur: 'cumhuriyet', miktar: 2, kaynak: 'canli', gramFiyat: 4500 };

const zaman = (iso: string) =>
  new Intl.DateTimeFormat('tr-TR', {
    timeZone: 'Europe/Istanbul',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));

/** Canlı veri sonradan gelince aynı değerlerle reset ederek CalculatorLayout'un yeniden hesaplamasını tetikler. */
function useRecomputeOn(key: string | null) {
  const form = useFormContext<AltinInput>();
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

const HasNotu = () => (
  <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
    <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
    <span>
      Canlı değer, uluslararası ons fiyatı × TCMB USD kurundan hesaplanan <strong>has (saf) altın</strong> değeridir. Kuyumcu
      alış/satış fiyatları işçilik ve makas nedeniyle farklıdır; kesin fiyat için kuyumcunuza danışın.
    </span>
  </p>
);

function AltinDurumu({ live }: { live: Live<AltinFiyati> }) {
  useRecomputeOn(live.status === 'loading' ? null : `${live.status}:${live.fetchedAt}`);

  if (live.status === 'loading') {
    return (
      <div className="mb-5">
        <div role="status" aria-label="Altın fiyatı yükleniyor" className="flex items-center gap-3 rounded-xl bg-muted p-3.5">
          <span className="size-9 shrink-0 animate-pulse rounded-full bg-muted-foreground/20" />
          <span className="flex-1 space-y-2">
            <span className="block h-3.5 w-1/2 animate-pulse rounded bg-muted-foreground/20" />
            <span className="block h-3 w-3/4 animate-pulse rounded bg-muted-foreground/15" />
          </span>
          <span className="sr-only">Canlı altın fiyatı yükleniyor…</span>
        </div>
        <HasNotu />
      </div>
    );
  }

  if (live.status === 'error' || !live.data) {
    return (
      <div className="mb-5">
        <div className="flex items-start gap-3 rounded-xl border border-warning/30 bg-warning-soft p-3.5 text-sm">
          <WifiOff className="mt-0.5 size-5 shrink-0 text-warning" aria-hidden />
          <div className="flex-1">
            <p className="font-semibold text-foreground">Canlı altın fiyatı şu an alınamıyor</p>
            <p className="mt-0.5 text-muted-foreground">
              Aşağıdaki “Gram altın fiyatı” alanına kuyumcunuzun veya bankanızın 24 ayar gram fiyatını girerek hesaplamaya devam
              edebilirsiniz.
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={live.retry}>
            <RefreshCw aria-hidden /> Yeniden dene
          </Button>
        </div>
        <HasNotu />
      </div>
    );
  }

  const d = live.data;
  const stale = live.status === 'stale';
  return (
    <div className="mb-5">
      <div
        className={
          stale
            ? 'flex items-start gap-3 rounded-xl border border-warning/30 bg-warning-soft p-3.5 text-sm'
            : 'flex items-start gap-3 rounded-xl bg-accent p-3.5 text-sm text-accent-foreground'
        }
      >
        {stale ? (
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-warning" aria-hidden />
        ) : (
          <Gem className="mt-0.5 size-5 shrink-0" aria-hidden />
        )}
        <div className="flex-1">
          <p className="font-semibold text-foreground">
            Has altın: <span className="tabular">{tl(d.gram24)}</span> / gram
          </p>
          <p className="tabular mt-0.5 text-muted-foreground">
            Ons {currency(d.ounceUsd, 'USD')} × USD/TRY {num(d.usdTry, 4)} (TCMB {dateTR(d.usdDate)})
          </p>
          <p className="mt-0.5 text-muted-foreground">
            {stale
              ? `Canlı fiyat alınamadı; ${live.fetchedAt ? `${zaman(live.fetchedAt)} tarihinde alınan ` : ''}son başarılı değer gösteriliyor.`
              : `Fiyat alındı: ${zaman(d.priceAt ?? d.fetchedAt)}`}
          </p>
        </div>
        {stale && (
          <Button type="button" variant="outline" size="sm" onClick={live.retry}>
            <RefreshCw aria-hidden /> Yeniden dene
          </Button>
        )}
      </div>
      <HasNotu />
    </div>
  );
}

function Miktar() {
  const tur = useWatch<AltinInput, 'tur'>({ name: 'tur' });
  const adet = turler[tur ?? 'ceyrek'].adet;
  return (
    <NumberField<AltinInput>
      name="miktar"
      label={adet ? 'Adet' : 'Ağırlık'}
      unit={adet ? 'adet' : 'g'}
      decimals={adet ? 0 : 3}
      placeholder={adet ? 'Örn. 2' : 'Örn. 10'}
      help={
        adet ? 'Kaç adet altınınız olduğunu girin.' : 'Altının brüt ağırlığı (gram). Bilezik ve takılarda tartı ağırlığını girin.'
      }
    />
  );
}

function GramFiyat({ canliYok }: { canliYok: boolean }) {
  const kaynak = useWatch<AltinInput, 'kaynak'>({ name: 'kaynak' });
  return (
    <>
      {(kaynak === 'elle' || canliYok) && (
        <NumberField<AltinInput>
          className="sm:col-span-2"
          name="gramFiyat"
          label="Gram altın fiyatı (24 ayar)"
          unit="₺/g"
          placeholder="Örn. 4.500"
          hint={canliYok && kaynak === 'canli' ? 'Canlı fiyat alınamadığı için bu fiyat kullanılır.' : undefined}
          help="Kuyumcunun veya bankanın 24 ayar (995) gram altın fiyatı. Has değere 0,995 milyemle çevrilir, diğer ayarlar buradan hesaplanır."
        />
      )}
    </>
  );
}

export default function AltinHesaplamaPage() {
  const live = useLive<AltinFiyati>('/api/altin');
  const has = live.data?.gram24 ?? null;

  function present(v: Parameters<typeof calculateAltin>[0]): ResultView {
    if (v.kaynak === 'canli' && !has && live.status === 'loading') {
      throw new Error('Fiyat yükleniyor');
    }
    let r;
    try {
      r = calculateAltin(v, has);
    } catch (e) {
      if (!(e instanceof FiyatYokHatasi)) throw e;
      return { main: { label: 'Toplam değer', value: '—' }, status: { tone: 'warn', text: e.message } };
    }
    const d = turler[v.tur];
    const birim = d.adet ? 'adet' : 'gram';
    return {
      main: {
        label: r.fiyatKaynagi === 'canli' ? 'Toplam has değer' : 'Toplam değer',
        value: tl(r.toplam),
        caption: `${num(v.miktar, 3)} ${d.adet ? 'adet' : 'g'} ${d.label}`,
      },
      rows: [
        { label: `1 ${birim} değeri`, value: tl(r.birimDeger) },
        { label: 'Toplam brüt ağırlık', value: `${num(r.brutGram, 3)} g` },
        { label: 'Saflık (milyem)', value: num(r.milyem, 3), tone: 'muted' },
        { label: 'İçerdiği has altın', value: `${num(r.hasGramMiktar, 4)} g` },
        {
          label: 'Has altın gram fiyatı',
          value: tl(r.hasGram),
          tone: 'muted',
          hint: r.fiyatKaynagi === 'canli' ? 'Canlı: ons × USD/TRY ÷ 31,1035' : 'Girdiğiniz fiyat ÷ 0,995',
        },
        { label: 'Toplam değer', value: tl(r.toplam), tone: 'total' },
      ],
      status:
        r.fiyatKaynagi === 'elleYedek'
          ? { tone: 'info', text: 'Canlı fiyat alınamadığı için girdiğiniz gram fiyatı kullanıldı.' }
          : r.fiyatKaynagi === 'canli' && live.status === 'stale'
            ? { tone: 'warn', text: 'Son başarılı canlı fiyat kullanıldı; güncel olmayabilir.' }
            : undefined,
      notes: [
        'Bu tutar has (saf) altın karşılığıdır; kuyumcu alış/satış fiyatları işçilik ve makas nedeniyle farklıdır. Kesin fiyat için kuyumcunuza danışın.',
      ],
    };
  }

  return (
    <CalculatorLayout
      slug="altin-hesaplama"
      schema={altinSchema}
      defaults={defaults}
      example={example}
      compute={present}
      content={content}
      formTop={<AltinDurumu live={live} />}
      emptyHint="Altın türünü ve miktarını seçin; güncel has değer üzerinden toplam tutar hesaplansın."
    >
      <SelectField<AltinInput>
        name="tur"
        label="Altın türü"
        options={options}
        help="Çeyrek, yarım ve tam: kuyumcuda satılan ziynet altınlar (Darphane ağırlıkları). Cumhuriyet / Ata lira: 7,216 g sikke."
      />
      <Miktar />
      <ChoiceField<AltinInput>
        name="kaynak"
        label="Fiyat kaynağı"
        className="sm:col-span-2"
        options={[
          { value: 'canli', label: 'Canlı has değer' },
          { value: 'elle', label: 'Kendi gram fiyatım' },
        ]}
        help="Canlı has değer: ons fiyatı ve TCMB dolar kurundan hesaplanan saf altın değeri. Kendi gram fiyatım: kuyumcunuzun 24 ayar gram fiyatı."
      />
      <GramFiyat canliYok={live.status === 'error'} />
    </CalculatorLayout>
  );
}
