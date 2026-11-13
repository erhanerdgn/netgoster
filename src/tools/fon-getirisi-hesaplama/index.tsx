import { useEffect, useMemo, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Loader2, X } from 'lucide-react';
import { CalculatorLayout } from '@/components/calc/CalculatorLayout';
import { ChoiceField, DateField, NumberField, SelectField } from '@/components/calc/fields';
import type { ResultView } from '@/components/calc/ResultCard';
import {
  calculateFonGetirisi,
  fiyatBul,
  fonGetirisiSchema,
  fonGrubu,
  fonUyarisi,
  type FonGetirisiInput,
  type FonGetirisiValues,
  type FonTuru,
} from '@/calculators/fonGetirisi';
import { addDays, dayNumber } from '@/calculators/common';
import { todayISO } from '@/config/period';
import { dateTR, num, pct, tl } from '@/lib/format';
import { useLive } from '@/lib/liveData';
import { norm } from '@/lib/search';
import content from './content.md';

const today = todayISO();
const defaults: Partial<FonGetirisiInput> = { tur: 'indirimli', yontem: 'fiyat', alis: addDays(today, -365), satis: today };
const example: FonGetirisiInput = {
  fon: '',
  tur: 'indirimli',
  yontem: 'fiyat',
  tutar: 100000,
  alisFiyat: 1.25,
  satisFiyat: 1.6,
  alis: addDays(today, -365),
  satis: today,
};

const TUR_AD: Record<FonTuru, string> = {
  hisse: 'Hisse senedi yoğun fon',
  indirimli: 'Para piyasası / borçlanma araçları / altın / katılım fonu',
  diger: 'Değişken / karma / serbest / eurobond / döviz fonu',
  gsyfGyf: 'Girişim sermayesi / gayrimenkul yatırım fonu',
};

const AYLAR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
const ayTR = (ym: string) => `${AYLAR[Number(ym.slice(5)) - 1]} ${ym.slice(0, 4)}`;

function present(v: FonGetirisiValues): ResultView {
  const r = calculateFonGetirisi(v);
  const zarar = r.brutKazanc < 0;
  return {
    main: {
      label: zarar ? 'Net zarar' : 'Net kazanç',
      value: tl(r.netKazanc),
      caption: `${r.gun} günde ${tl(v.tutar)} → ${tl(r.netTutar)} · net ${pct(r.netDonemsel)}`,
    },
    status: zarar
      ? { tone: 'warn', text: 'Fon zararda: kazanç olmadığı için stopaj kesilmez.' }
      : {
          tone: 'info',
          text: `${TUR_AD[v.tur]}, ${dateTR(v.alis)} alış tarihine göre ${pct(r.stopajOran)} stopaj uygulandı.`,
        },
    rows: [
      { label: 'Yatırım tutarı', value: tl(v.tutar) },
      ...(r.adet !== undefined
        ? [
            {
              label: 'Alınan pay adedi',
              value: num(r.adet, 4),
              tone: 'muted' as const,
              hint: `${tl(v.tutar)} / ${num(v.alisFiyat!, 6)}`,
            },
          ]
        : []),
      {
        label: 'Satış tutarı',
        value: tl(r.satisTutari),
        hint:
          r.adet !== undefined
            ? `${num(r.adet, 4)} pay × ${num(v.satisFiyat!, 6)}`
            : `${tl(v.tutar)} × (1 + %${num(v.oran!, 2)})^(${r.gun}/365)`,
      },
      { label: 'Brüt kazanç', value: tl(r.brutKazanc), tone: zarar ? 'minus' : 'plus' },
      { label: `Stopaj (${pct(r.stopajOran)})`, value: tl(r.stopaj), tone: 'minus' },
      { label: 'Net kazanç', value: tl(r.netKazanc), tone: 'total' },
      { label: 'Elinize geçen toplam', value: tl(r.netTutar), tone: 'total' },
      { label: 'Net dönem getirisi', value: pct(r.netDonemsel), tone: 'muted' },
      {
        label: 'Net yıllık getiri (bileşik)',
        value: pct(r.netYillik),
        tone: 'muted',
        hint: `(1 + dönem getirisi)^(365/${r.gun}) − 1`,
      },
      ...(r.enflasyon !== undefined
        ? [
            {
              label:
                r.enflasyonAylar![1] < v.satis.slice(0, 7)
                  ? `Enflasyon (TÜFE, ${ayTR(r.enflasyonAylar![1])} sonuna kadar)`
                  : 'Dönem enflasyonu (TÜFE)',
              value: pct(r.enflasyon),
              tone: 'muted' as const,
              hint: `${ayTR(r.enflasyonAylar![0])} – ${ayTR(r.enflasyonAylar![1])} aylık TÜFE değişimlerinin bileşimi`,
            },
            { label: 'Reel net getiri', value: pct(r.reel!), tone: r.reel! < 0 ? ('minus' as const) : ('plus' as const) },
          ]
        : []),
    ],
    notes: [
      'Stopaj oranı, fon payını ALDIĞINIZ tarihte geçerli Cumhurbaşkanı Kararına göre belirlenir; sonradan değişen oran mevcut paylarınızı etkilemez. Kesinti, satışta portföy yönetim şirketi veya bankanız tarafından yapılır ve nihai vergidir; beyanname gerekmez.',
      'Fon fiyatına yönetim ücreti ve fon giderleri zaten yansımıştır; alım-satım sırasında ayrıca komisyon ödüyorsanız sonuçtan düşün.',
      ...(r.enflasyon === undefined
        ? ['Alıştan sonraki aylara ait TÜFE verisi henüz yayımlanmadığı için reel getiri gösterilmedi.']
        : r.enflasyonAylar![1] < v.satis.slice(0, 7)
          ? [
              `Satış ayının TÜFE verisi henüz yayımlanmadı; reel getiri ${ayTR(r.enflasyonAylar![1])} sonuna kadarki enflasyonla hesaplandı.`,
            ]
          : []),
    ],
  };
}

interface FonListesi {
  fonlar: [string, string][];
  fetchedAt?: string;
  stale?: boolean;
}
interface FonFiyat {
  kod: string;
  unvan: string;
  fiyatlar: [string, number][];
}

/**
 * TEFAS'tan fon seçimi: kod ya da adla arama (alan genişliğinde açılır liste, klavyeyle gezilebilir), seçilince stopaj grubu
 * unvandan bulunur, alış/satış tarihindeki birim pay fiyatları doldurulur. Veri gelmezse elle giriş sürer.
 */
function FonSecici() {
  const { setValue } = useFormContext<FonGetirisiInput>();
  const fon = useWatch<FonGetirisiInput, 'fon'>({ name: 'fon' });
  const alis = useWatch<FonGetirisiInput, 'alis'>({ name: 'alis' });
  const satis = useWatch<FonGetirisiInput, 'satis'>({ name: 'satis' });
  const liste = useLive<FonListesi>('/api/fonlar');
  const [metin, setMetin] = useState(fon ?? '');
  const [seri, setSeri] = useState<FonFiyat | null>(null);
  const [durum, setDurum] = useState<'bos' | 'yukleniyor' | 'tamam' | 'hata'>('bos');
  const [acik, setAcik] = useState(false);
  const [aktif, setAktif] = useState(0);

  const unvanlar = useMemo(() => new Map(liste.data?.fonlar ?? []), [liste.data]);
  const aranabilir = useMemo(
    () => (liste.data?.fonlar ?? []).map(([kod, ad]) => ({ kod, ad, n: norm(`${kod} ${ad}`) })),
    [liste.data],
  );
  // Tüm kelimeler geçmeli; tam kod > kodla başlayan > adda geçen. En fazla 50 sonuç.
  const sonuclar = useMemo(() => {
    const q = norm(metin)
      .split(/[\s·]+/)
      .filter(Boolean);
    if (!q.length) return aranabilir.slice(0, 30);
    const kodQ = q[0];
    return aranabilir
      .filter((f) => q.every((w) => f.n.includes(w)))
      .map((f) => ({ f, puan: norm(f.kod) === kodQ ? 0 : norm(f.kod).startsWith(kodQ) ? 1 : 2 }))
      .sort((a, b) => a.puan - b.puan || a.f.kod.localeCompare(b.f.kod))
      .slice(0, 50)
      .map((x) => x.f);
  }, [aranabilir, metin]);

  // Form dışarıdan değişirse (paylaşım linki, Sıfırla, Örnek) kutudaki metni eşitle
  useEffect(() => {
    setMetin((m) => (m.trim().split(/\s/)[0].toLocaleUpperCase('tr') === (fon ?? '') ? m : (fon ?? '')));
  }, [fon]);

  // Kod seçildi/değişti → fiyat geçmişini çek
  useEffect(() => {
    if (!fon) {
      setSeri(null);
      setDurum('bos');
      return;
    }
    let alive = true;
    setDurum('yukleniyor');
    fetch(`/api/fon/${encodeURIComponent(fon)}`)
      .then(async (r) => {
        if (!r.ok) throw new Error(String(r.status));
        const d = (await r.json()) as FonFiyat & { error?: string };
        if (!d.fiyatlar?.length) throw new Error(d.error ?? 'boş');
        if (!alive) return;
        setSeri(d);
        setDurum('tamam');
        setValue('tur', fonGrubu(d.unvan), { shouldValidate: true });
        setValue('yontem', 'fiyat', { shouldValidate: true });
      })
      .catch(() => alive && setDurum('hata'));
    return () => {
      alive = false;
    };
  }, [fon, setValue]);

  const alisF = seri && alis ? fiyatBul(seri.fiyatlar, alis) : undefined;
  const satisF = seri && satis ? fiyatBul(seri.fiyatlar, satis) : undefined;

  // Tarih ya da seri değişince fiyatları doldur
  useEffect(() => {
    if (alisF) setValue('alisFiyat', alisF.fiyat, { shouldValidate: true });
    if (satisF) setValue('satisFiyat', satisF.fiyat, { shouldValidate: true });
  }, [alisF?.fiyat, satisF?.fiyat, setValue]); // eslint-disable-line react-hooks/exhaustive-deps

  const sec = (kod: string, ad: string) => {
    setMetin(`${kod} · ${ad}`);
    setAcik(false);
    setValue('fon', kod, { shouldValidate: true });
  };
  const tus = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      setAcik(true);
      setAktif((i) => Math.max(0, Math.min(sonuclar.length - 1, i + (e.key === 'ArrowDown' ? 1 : -1))));
    } else if (e.key === 'Enter' && acik && sonuclar[aktif]) {
      e.preventDefault();
      sec(sonuclar[aktif].kod, sonuclar[aktif].ad);
    } else if (e.key === 'Escape') setAcik(false);
  };
  const temizle = () => {
    setMetin('');
    setValue('fon', undefined, { shouldValidate: true });
  };

  const unvan = seri?.unvan ?? (fon ? unvanlar.get(fon) : undefined);
  const eskiFiyat = satisF && satis && dayNumber(satis) - dayNumber(satisF.tarih) > 5;
  const uyari = [
    unvan && fonUyarisi(unvan),
    eskiFiyat &&
      `Fonun ${dateTR(satisF.tarih)} sonrasına ait fiyatı yok; fon işlem görmüyor olabilir. Satış fiyatı olarak o günün fiyatı kullanıldı.`,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <div className="space-y-1.5 sm:col-span-2">
      <label htmlFor="fon-ara" className="text-sm font-medium">
        Fon (TEFAS'tan seç — isteğe bağlı)
      </label>
      <div className="relative">
        <input
          id="fon-ara"
          role="combobox"
          aria-expanded={acik}
          aria-controls="fon-listesi"
          aria-autocomplete="list"
          aria-activedescendant={acik && sonuclar[aktif] ? `fon-${sonuclar[aktif].kod}` : undefined}
          value={metin}
          onChange={(e) => {
            setMetin(e.target.value);
            setAktif(0);
            setAcik(true);
          }}
          onFocus={() => setAcik(true)}
          onBlur={() => setAcik(false)}
          onKeyDown={tus}
          placeholder={
            liste.status === 'error'
              ? 'Fon listesi alınamadı — aşağıya elle girin'
              : 'Fon kodu ya da adı: TTE, para piyasası, altın…'
          }
          autoComplete="off"
          className="h-11 w-full truncate rounded-lg border border-input bg-background px-3 pr-10 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
        />
        {(metin || fon) && (
          <button
            type="button"
            onClick={temizle}
            aria-label="Fon seçimini temizle"
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
        {acik && liste.data && (
          <ul
            id="fon-listesi"
            role="listbox"
            aria-label="TEFAS fonları"
            className="absolute inset-x-0 top-full z-30 mt-1.5 max-h-80 overflow-y-auto rounded-xl border bg-popover p-1.5 shadow-lg"
          >
            {sonuclar.length === 0 && <li className="px-3 py-2.5 text-sm text-muted-foreground">Eşleşen fon yok.</li>}
            {sonuclar.map((f, i) => (
              <li
                key={f.kod}
                id={`fon-${f.kod}`}
                role="option"
                aria-selected={i === aktif}
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => setAktif(i)}
                onClick={() => sec(f.kod, f.ad)}
                className={`flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2 ${i === aktif ? 'bg-accent' : ''}`}
              >
                <span className="tabular w-12 shrink-0 pt-px text-sm font-bold text-primary">{f.kod}</span>
                <span className="text-sm leading-snug">{f.ad}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <p className="text-xs text-muted-foreground" aria-live="polite">
        {durum === 'yukleniyor' && (
          <span className="inline-flex items-center gap-1.5">
            <Loader2 className="size-3.5 animate-spin" aria-hidden /> TEFAS fiyatları alınıyor…
          </span>
        )}
        {durum === 'hata' && 'TEFAS fiyatları şu an alınamadı; alış ve satış fiyatlarını aşağıya elle girebilirsiniz.'}
        {durum === 'tamam' && seri && (
          <>
            <strong className="text-foreground">{seri.kod}</strong> · {seri.unvan}
            <br />
            {alisF
              ? `Alış: ${dateTR(alisF.tarih)} fiyatı ${num(alisF.fiyat, 6)}`
              : `Alış tarihi TEFAS verisinden (${dateTR(seri.fiyatlar[0][0])}) eski; alış fiyatını elle girin`}
            {satisF && ` · Satış: ${dateTR(satisF.tarih)} fiyatı ${num(satisF.fiyat, 6)}`}
          </>
        )}
        {durum === 'bos' && 'Fon seçerseniz stopaj grubu ve tarihlerdeki fiyatlar TEFAS verisiyle otomatik dolar.'}
      </p>
      {uyari && <p className="text-xs font-medium text-warning">{uyari}</p>}
    </div>
  );
}

function Fields() {
  const yontem = useWatch<FonGetirisiInput, 'yontem'>({ name: 'yontem' });
  return (
    <>
      <FonSecici />
      <SelectField<FonGetirisiInput>
        name="tur"
        label="Fon türü"
        className="sm:col-span-2"
        help="Stopaj grubunu fonun UNVANI belirler: unvanında değişken, karma, serbest, eurobond, dış borçlanma, yabancı ya da döviz geçen fonlar ayrı gruptadır. Unvan TEFAS'taki fon kartında yazar."
        options={[
          { value: 'hisse', label: 'Hisse senedi yoğun fon (%80+ BIST hissesi)' },
          { value: 'indirimli', label: 'Para piyasası, borçlanma araçları, altın, katılım, fon sepeti, endeks' },
          { value: 'diger', label: 'Unvanında değişken, karma, serbest, eurobond, yabancı ya da döviz geçen' },
          { value: 'gsyfGyf', label: 'Girişim sermayesi / gayrimenkul yatırım fonu' },
        ]}
      />
      <ChoiceField<FonGetirisiInput>
        name="yontem"
        label="Hesaplama yöntemi"
        className="sm:col-span-2"
        help="Fonu aldınız ve sattıysanız birim pay fiyatlarıyla; ileriye dönük tahmin için beklenen yıllık getiriyle hesaplayın."
        options={[
          { value: 'fiyat', label: 'Alış / satış fiyatıyla' },
          { value: 'oran', label: 'Yıllık getiriyle' },
        ]}
      />
      <NumberField<FonGetirisiInput>
        name="tutar"
        label="Yatırım tutarı"
        unit="₺"
        placeholder="Örn. 100.000"
        help="Fona yatırdığınız toplam Türk lirası tutar."
        className="sm:col-span-2"
      />
      {yontem === 'oran' ? (
        <NumberField<FonGetirisiInput>
          name="oran"
          label="Beklenen yıllık getiri"
          unit="%"
          decimals={2}
          allowNegative
          placeholder="Örn. 42"
          help="Fonun yıllık (bileşik) getirisi. TEFAS'ta fonun son 1 yıllık getirisini başlangıç noktası olarak kullanabilirsiniz; geçmiş getiri geleceği garanti etmez."
          className="sm:col-span-2"
        />
      ) : (
        <>
          <NumberField<FonGetirisiInput>
            name="alisFiyat"
            label="Alış fiyatı (birim pay)"
            unit="₺"
            decimals={6}
            placeholder="Örn. 1,254321"
            help="Payları aldığınız günün fon birim pay fiyatı. TEFAS'ta ve bankanızın işlem dekontunda yazar."
          />
          <NumberField<FonGetirisiInput>
            name="satisFiyat"
            label="Satış fiyatı (birim pay)"
            unit="₺"
            decimals={6}
            placeholder="Örn. 1,603210"
            help="Payları sattığınız (ya da bugünkü) fon birim pay fiyatı."
          />
        </>
      )}
      <DateField<FonGetirisiInput>
        name="alis"
        label="Alış tarihi"
        help="Stopaj oranı, payları aldığınız tarihte geçerli orandır."
      />
      <DateField<FonGetirisiInput>
        name="satis"
        label="Satış tarihi"
        help="Payları sattığınız ya da satmayı planladığınız tarih."
      />
    </>
  );
}

export default function FonGetirisiPage() {
  return (
    <CalculatorLayout
      slug="fon-getirisi-hesaplama"
      schema={fonGetirisiSchema}
      defaults={defaults}
      example={example}
      compute={present}
      content={content}
      emptyHint="Fon türünü, yatırım tutarını ve alış-satış fiyatlarını girdiğiniz anda stopaj sonrası net getiriniz hesaplanır."
    >
      <Fields />
    </CalculatorLayout>
  );
}
