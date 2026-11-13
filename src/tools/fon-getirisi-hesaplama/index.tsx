import { useWatch } from 'react-hook-form';
import { CalculatorLayout } from '@/components/calc/CalculatorLayout';
import { ChoiceField, DateField, NumberField, SelectField } from '@/components/calc/fields';
import type { ResultView } from '@/components/calc/ResultCard';
import {
  calculateFonGetirisi,
  fonGetirisiSchema,
  type FonGetirisiInput,
  type FonGetirisiValues,
  type FonTuru,
} from '@/calculators/fonGetirisi';
import { addDays } from '@/calculators/common';
import { todayISO } from '@/config/period';
import { dateTR, num, pct, tl } from '@/lib/format';
import content from './content.md';

const today = todayISO();
const defaults: Partial<FonGetirisiInput> = { tur: 'indirimli', yontem: 'fiyat', alis: addDays(today, -365), satis: today };
const example: FonGetirisiInput = {
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

function Fields() {
  const yontem = useWatch<FonGetirisiInput, 'yontem'>({ name: 'yontem' });
  return (
    <>
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
