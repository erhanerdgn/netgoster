import { useWatch } from 'react-hook-form';
import { CalculatorLayout } from '@/components/calc/CalculatorLayout';
import { ChoiceField, NumberField } from '@/components/calc/fields';
import type { ResultView } from '@/components/calc/ResultCard';
import { calculateIndirim, indirimSchema, type IndirimInput, type IndirimValues } from '@/calculators/indirim';
import { pctValue, tl } from '@/lib/format';
import content from './content.md';

const defaults: Partial<IndirimInput> = { mod: 'fiyat', oran3: 0 };
const example: IndirimInput = { mod: 'fiyat', fiyat: 1250, oran: 15, oran2: 20, oran3: 0, yeni: 999 };

function present(v: IndirimValues): ResultView {
  const r = calculateIndirim(v);
  if (r.mod === 'oran') {
    const zam = r.oran < 0;
    return {
      main: {
        label: zam ? 'Zam oranı' : 'İndirim oranı',
        value: pctValue(Math.abs(r.oran)),
        caption: `${tl(r.fiyat)} → ${tl(r.indirimli)}`,
      },
      status: zam ? { tone: 'warn', text: 'Yeni fiyat eski fiyattan yüksek: bu bir indirim değil, zamdır.' } : undefined,
      rows: [
        { label: 'Eski fiyat', value: tl(r.fiyat) },
        { label: 'Yeni fiyat', value: tl(r.indirimli) },
        { label: zam ? 'Fiyat farkı (artış)' : 'İndirim tutarı', value: tl(Math.abs(r.indirim)), tone: zam ? 'plus' : 'minus' },
        { label: 'Formül', value: '(Eski − Yeni) ÷ Eski × 100', tone: 'muted' },
        { label: zam ? 'Zam oranı' : 'İndirim oranı', value: pctValue(Math.abs(r.oran)), tone: 'total' },
      ],
    };
  }
  if (r.mod === 'fiyat') {
    return {
      main: {
        label: 'İndirimli fiyat',
        value: tl(r.indirimli),
        caption: `${pctValue(r.oran)} indirimle ${tl(r.indirim)} tasarruf`,
      },
      rows: [
        { label: 'Etiket fiyatı', value: tl(r.fiyat) },
        {
          label: `İndirim (${pctValue(r.oran)})`,
          value: tl(r.indirim),
          tone: 'minus',
          hint: `${tl(r.fiyat)} × ${pctValue(r.oran)}`,
        },
        { label: 'İndirimli fiyat', value: tl(r.indirimli), tone: 'total' },
        { label: 'Ödediğiniz oran', value: pctValue(100 - r.oran), tone: 'muted', hint: 'Etiket fiyatının yüzdesi' },
      ],
    };
  }
  return {
    main: { label: 'Son fiyat', value: tl(r.indirimli), caption: `Gerçek toplam indirim: ${pctValue(r.oran)}` },
    status: {
      tone: 'info',
      text: `Ardışık indirimler toplanmaz: ${r.adimlar!.map((a) => pctValue(a.oran)).join(' + ')} = ${pctValue(r.oran)} (basit toplam ${pctValue(r.basitToplam!)} değil). Her indirim bir öncekinin indirimli fiyatına uygulanır.`,
    },
    rows: [
      { label: 'Etiket fiyatı', value: tl(r.fiyat) },
      ...r.adimlar!.map((a, i) => ({
        label: `${i + 1}. indirim (${pctValue(a.oran)})`,
        value: tl(a.indirim),
        tone: 'minus' as const,
        hint: `${tl(a.once)} → ${tl(a.sonra)}`,
      })),
      { label: 'Toplam indirim', value: tl(r.indirim), tone: 'minus' },
      { label: 'Etkin oran', value: pctValue(r.oran), hint: '1 − Π(1 − rᵢ)' },
      { label: 'Son fiyat', value: tl(r.indirimli), tone: 'total' },
    ],
  };
}

const oranHelp = 'İndirim yüzdesi. Örn. “%20 indirim” için 20 yazın.';

function Fields() {
  const mod = useWatch<IndirimInput, 'mod'>({ name: 'mod' }) ?? 'fiyat';
  return (
    <>
      <ChoiceField<IndirimInput>
        name="mod"
        label="Hesaplama türü"
        className="sm:col-span-2"
        options={[
          { value: 'fiyat', label: 'İndirimli fiyat' },
          { value: 'oran', label: 'İndirim oranı' },
          { value: 'ardisik', label: 'Ardışık indirim' },
        ]}
        help="İndirimli fiyat: fiyat ve oranla yeni fiyatı bulur. İndirim oranı: eski ve yeni fiyattan yüzdeyi bulur. Ardışık indirim: art arda uygulanan 2–3 indirimin gerçek toplamını bulur."
      />
      <NumberField<IndirimInput>
        name="fiyat"
        label={mod === 'oran' ? 'Eski fiyat' : 'Etiket fiyatı'}
        unit="₺"
        placeholder="Örn. 1.250"
        help={mod === 'oran' ? 'İndirimden önceki (üstü çizili) fiyat.' : 'Ürünün indirimsiz, etikette yazan fiyatı.'}
      />
      {mod === 'oran' ? (
        <NumberField<IndirimInput>
          name="yeni"
          label="İndirimli fiyat"
          unit="₺"
          placeholder="Örn. 999"
          help="İndirim sonrası ödenecek (yeni) fiyat."
        />
      ) : (
        <NumberField<IndirimInput>
          name="oran"
          label={mod === 'ardisik' ? '1. indirim' : 'İndirim oranı'}
          unit="%"
          placeholder="Örn. 15"
          help={oranHelp}
        />
      )}
      {mod === 'ardisik' && (
        <>
          <NumberField<IndirimInput>
            name="oran2"
            label="2. indirim"
            unit="%"
            placeholder="Örn. 20"
            help="İlk indirimden sonra kalan fiyata uygulanan ek indirim (sepette, kuponla, kartla vb.)."
          />
          <NumberField<IndirimInput>
            name="oran3"
            label="3. indirim"
            unit="%"
            placeholder="Örn. 10"
            help="Varsa üçüncü ek indirim. Yoksa 0 bırakın."
            hint="Yoksa 0 bırakın."
          />
        </>
      )}
    </>
  );
}

export default function IndirimHesaplamaPage() {
  return (
    <CalculatorLayout
      slug="indirim-hesaplama"
      schema={indirimSchema}
      defaults={defaults}
      example={example}
      compute={present}
      content={content}
      emptyHint="Fiyatı ve indirim oranını girdiğiniz anda indirimli fiyat ve tasarruf tutarı hesaplanır."
    >
      <Fields />
    </CalculatorLayout>
  );
}
