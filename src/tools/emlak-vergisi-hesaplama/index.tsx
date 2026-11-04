import { useWatch } from 'react-hook-form';
import { CalculatorLayout } from '@/components/calc/CalculatorLayout';
import { ChoiceField, NumberField, SwitchField } from '@/components/calc/fields';
import type { ResultView } from '@/components/calc/ResultCard';
import {
  calculateEmlakVergisi,
  emlakVergisiSchema,
  type EmlakVergisiInput,
  type EmlakVergisiValues,
  type TasinmazTuru,
} from '@/calculators/emlakVergisi';
import { emlakArtisSiniri } from '@/config/parameters-2026';
import { periodAt, todayISO } from '@/config/period';
import { num, pctValue, tl } from '@/lib/format';
import content from './content.md';

const defaults: Partial<EmlakVergisiInput> = { tur: 'konut', buyuksehir: true, hisse: 100, muaf: false, oncekiDeger: 0 };
const example: EmlakVergisiInput = {
  tur: 'konut',
  deger: 1500000,
  buyuksehir: true,
  hisse: 100,
  muaf: false,
  oncekiDeger: 0,
};

const TUR_AD: Record<TasinmazTuru, string> = { konut: 'Konut', isyeri: 'İşyeri', arsa: 'Arsa', arazi: 'Arazi' };
const binde = (r: number) => `binde ${num(r * 1000, 2)}`;
const today = todayISO();
const sinir = periodAt(emlakArtisSiniri, today);
const sinirGecerli = today >= sinir.from && (!sinir.to || today <= sinir.to);
const sinirYil = Number(sinir.from.slice(0, 4));

const MUAFIYET_SARTLARI =
  'Sıfır oran için: Türkiye genelinde brüt 200 m²’yi geçmeyen tek konuta (hisseli dahil) sahip olmak ve emekli/SGK’dan aylık alan, hiçbir geliri olmayan, engelli, gazi ya da şehit dul ve yetimi olmak gerekir. Emekliler ve geliri olmayanlar için aylık dışında gelir (ör. kira) bulunmamalıdır. Belediyeye dilekçe ile başvurulur.';

function present(v: EmlakVergisiValues): ResultView {
  const r = calculateEmlakVergisi(v);
  const yil = today.slice(0, 4);
  return {
    main: {
      label: `${yil} yıllık emlak vergisi`,
      value: tl(r.yillik),
      caption: r.muafiyet
        ? 'Sıfır oran (muafiyet) uygulandı'
        : `${TUR_AD[v.tur]} · ${binde(r.oran)} · ${v.buyuksehir ? 'büyükşehir/mücavir alan' : 'büyükşehir dışı'}`,
    },
    status: r.muafiyet
      ? { tone: 'ok', text: MUAFIYET_SARTLARI }
      : v.muaf
        ? {
            tone: 'warn',
            text: 'Emekli/engelli sıfır oranı yalnız konutlar (mesken) için geçerlidir; bu taşınmaz türünde vergi hesaplandı.',
          }
        : r.sinirUygulandi
          ? {
              tone: 'info',
              text: `${r.sinirYili} artış sınırı uygulandı: vergi değeri önceki yıl değerinin ${r.sinirKatsayi} katı olan ${tl(r.matrah)} ile sınırlandı.`,
            }
          : undefined,
    rows: [
      { label: 'Vergi değeri', value: tl(v.deger) },
      ...(r.sinirUygulandi ? [{ label: 'Sınırlanmış vergi değeri', value: tl(r.matrah) }] : []),
      ...(v.hisse < 100 ? [{ label: `Hisseye düşen değer (${pctValue(v.hisse)})`, value: tl(r.hisseMatrah) }] : []),
      { label: 'Vergi oranı', value: r.muafiyet ? 'Sıfır oran' : binde(r.oran), tone: 'muted' },
      { label: 'Yıllık emlak vergisi', value: tl(r.yillik), tone: 'total' },
      { label: '1. taksit (Mayıs sonu)', value: tl(r.taksit1), hint: '1 Mart – 31 Mayıs arası' },
      { label: '2. taksit (Kasım sonu)', value: tl(r.taksit2), hint: '1 – 30 Kasım arası' },
    ],
    notes: [
      'Vergi değeri, belediyenin bina için emsal m² değerleri ve inşaat maliyetiyle, arsa ve arazi için takdir komisyonunun belirlediği m² birim değeriyle hesapladığı değerdir; e-Devlet veya belediyeden öğrenebilirsiniz.',
      'Değerli konut vergisi bu hesaba dahil değildir; ayrıca beyan edilip ödenir.',
    ],
  };
}

function Fields() {
  const tur = useWatch<EmlakVergisiInput, 'tur'>({ name: 'tur' });
  return (
    <>
      <ChoiceField<EmlakVergisiInput>
        name="tur"
        label="Taşınmaz türü"
        className="sm:col-span-2"
        options={[
          { value: 'konut', label: 'Konut' },
          { value: 'isyeri', label: 'İşyeri' },
          { value: 'arsa', label: 'Arsa' },
          { value: 'arazi', label: 'Arazi' },
        ]}
        help="Konut: mesken. İşyeri: dükkân, ofis gibi diğer binalar. Arsa: belediye sınırı içindeki imarlı parsel. Arazi: tarla, bağ, bahçe."
      />
      <NumberField<EmlakVergisiInput>
        name="deger"
        label={`${today.slice(0, 4)} vergi değeri`}
        unit="₺"
        placeholder="Örn. 1.500.000"
        help="Belediyenin hesapladığı emlak vergisi değeri; piyasa (satış) değeri değildir. Emlak vergisi tahakkuk belgesinde veya e-Devlet’te yazar."
      />
      <NumberField<EmlakVergisiInput>
        name="hisse"
        label="Hisse oranı"
        unit="%"
        placeholder="Örn. 100"
        help="Taşınmazdaki payınız. Tek malikseniz 100; eşinizle yarı yarıya ise 50 girin. Her hissedar kendi payı kadar vergi öder."
      />
      <SwitchField<EmlakVergisiInput>
        name="buyuksehir"
        label="Büyükşehir belediyesi / mücavir alan"
        className="sm:col-span-2"
        help="Büyükşehir belediye sınırları ve mücavir alanlar içindeki taşınmazlarda oranlar %100 artırımlı (iki katı) uygulanır."
      />
      {tur === 'konut' && (
        <SwitchField<EmlakVergisiInput>
          name="muaf"
          label="Emekli / engelli / gazi tek konut muafiyeti"
          className="sm:col-span-2"
          help={MUAFIYET_SARTLARI}
        />
      )}
      {sinirGecerli && (
        <NumberField<EmlakVergisiInput>
          name="oncekiDeger"
          label={`${sinirYil - 1} vergi değeri (isteğe bağlı)`}
          unit="₺"
          className="sm:col-span-2"
          placeholder={`Örn. ${num(500000, 0)}`}
          help={`${sinirYil} yılına özgü artış sınırı: ${sinirYil} vergi değeri, ${sinirYil - 1} değerinin en fazla ${sinir.value.katsayi} katı olabilir.`}
          hint="Belediyenin hesapladığı değer sınırı aşıyorsa kontrol için girin; yoksa boş bırakın."
        />
      )}
    </>
  );
}

export default function EmlakVergisiPage() {
  return (
    <CalculatorLayout
      slug="emlak-vergisi-hesaplama"
      schema={emlakVergisiSchema}
      defaults={defaults}
      example={example}
      compute={present}
      content={content}
      emptyHint="Taşınmaz türünü ve vergi değerini girdiğiniz anda yıllık emlak vergisi ve taksitleri hesaplanır."
    >
      <Fields />
    </CalculatorLayout>
  );
}
