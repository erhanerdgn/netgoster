import { useWatch } from 'react-hook-form';
import { CalculatorLayout } from '@/components/calc/CalculatorLayout';
import { NumberField, SelectField } from '@/components/calc/fields';
import type { ResultView } from '@/components/calc/ResultCard';
import { calculateMtv, mtvSchema, type MtvInput, type MtvTipi, type MtvValues } from '@/calculators/mtv';
import { mtvElektrik, mtvTarifeII } from '@/config/parameters-2026';
import { todayISO, valueAt } from '@/config/period';
import { num, pct, tl } from '@/lib/format';
import content from './content.md';

const today = todayISO();
const yil = Number(today.slice(0, 4));
const defaults: Partial<MtvInput> = { tip: 'oto', dilim: 'auto', modelYili: yil };
const example: MtvInput = { tip: 'oto', cc: 1598, deger: 450000, dilim: '2', modelYili: yil - 4, kw: 150, sinif: 'minibus' };

const TIPLER: { value: MtvTipi; label: string }[] = [
  { value: 'oto', label: 'Otomobil (01.01.2018 ve sonrası tescil)' },
  { value: 'otoEski', label: 'Otomobil (31.12.2017 ve öncesi tescil)' },
  { value: 'elektrik', label: 'Elektrikli otomobil' },
  { value: 'motosiklet', label: 'Motosiklet' },
  { value: 'tarifeII', label: 'Minibüs, panelvan, otobüs, kamyonet, kamyon' },
];
const sinifOptions = valueAt(mtvTarifeII, today).map((s) => ({ value: s.id, label: s.label }));

function present(v: MtvValues): ResultView {
  const r = calculateMtv(v, today);
  const tipAd = TIPLER.find((t) => t.value === v.tip)!.label;
  const degerli = v.tip === 'oto' || v.tip === 'elektrik';
  const status: ResultView['status'] = r.muaf
    ? { tone: 'ok', text: 'Silindir hacmi 100 cm³’ün altındaki motosikletler MTV’ye tabi değildir.' }
    : degerli && v.dilim === 'auto' && v.modelYili < r.yil
      ? {
          tone: 'warn',
          text: `Taşıt değeri dilimi, aracın ilk tescil edildiği yılın tarifesindeki sınırlara göre belirlenir ve sonraki yıllarda aynı sıra uygulanır. Aracınız ${r.yil} öncesinde tescil edildiyse “Taşıt değeri dilimi” alanından ilk tescildeki sırayı seçin.`,
        }
      : v.tip === 'elektrik'
        ? {
            tone: 'info',
            text: `${num(v.kw!, 2)} kW motor gücü ${Number.isFinite(r.esdegerCc!) ? `${num(r.esdegerCc!, 0)} cm³ ve altı` : '4.001 cm³ ve üzeri'} silindir satırına karşılık gelir; tarife tutarı ${pct(mtvElektrik.oran)} oranıyla alınır.`,
          }
        : undefined;
  return {
    main: { label: `${r.yil} yıllık MTV`, value: tl(r.yillik), caption: `${tipAd} · ${r.yas} yaş` },
    status,
    rows: [
      { label: 'Araç yaşı', value: `${r.yas}`, tone: 'muted', hint: `${r.yil} − ${v.modelYili} + 1 (model yılı 1. yaştır)` },
      ...(v.tip === 'elektrik'
        ? [
            {
              label: 'Eşdeğer tarife tutarı',
              value: tl(r.tarifeTutari),
              tone: 'muted' as const,
              hint: `Elektrikli araçta bu tutar × ${pct(mtvElektrik.oran)} ödenir`,
            },
          ]
        : []),
      { label: 'Yıllık MTV', value: tl(r.yillik), tone: 'total' },
      { label: '1. taksit (Ocak sonu)', value: tl(r.taksit1), hint: '1 – 31 Ocak' },
      { label: '2. taksit (Temmuz sonu)', value: tl(r.taksit2), hint: '1 – 31 Temmuz' },
    ],
    notes: [
      'Yıl içinde ilk kez tescil edilen araçlarda ödenecek tutar tescil tarihine göre farklılaşabilir. Kesin tutarı GİB İnteraktif Vergi Dairesi veya bankanız üzerinden plakayla sorgulayabilirsiniz.',
    ],
    table: {
      caption: `${r.yil} MTV tarifesi — ${tipAd}`,
      columns: [
        v.tip === 'tarifeII'
          ? 'Araç sınıfı'
          : v.tip === 'elektrik'
            ? 'Motor gücü · taşıt değeri'
            : degerli
              ? 'Silindir hacmi · taşıt değeri'
              : 'Silindir hacmi',
        ...r.tablo.yasKolonlari,
      ],
      rows: r.tablo.satirlar.map((s, i) => [
        i === r.tablo.secili ? `▶ ${s.etiket} (sizin aracınız)` : s.etiket,
        ...s.tutar.map((t, j) => (i === r.tablo.secili && j === r.yasGrubu ? `▶ ${tl(t)}` : tl(t))),
      ]),
    },
  };
}

function Fields() {
  const tip = useWatch<MtvInput, 'tip'>({ name: 'tip' }) ?? 'oto';
  const dilim = useWatch<MtvInput, 'dilim'>({ name: 'dilim' }) ?? 'auto';
  const degerli = tip === 'oto' || tip === 'elektrik';
  return (
    <>
      <SelectField<MtvInput>
        name="tip"
        label="Araç tipi"
        className="sm:col-span-2"
        options={TIPLER}
        help="Otomobillerde ilk tescil tarihi önemlidir: 01.01.2018 ve sonrası tescilli otomobillerde vergi taşıt değerine göre de değişir."
      />
      {(tip === 'oto' || tip === 'otoEski' || tip === 'motosiklet') && (
        <NumberField<MtvInput>
          name="cc"
          label="Motor silindir hacmi"
          unit="cm³"
          decimals={0}
          placeholder="Örn. 1.598"
          help="Ruhsatta “silindir hacmi” olarak yazan değer (cm³). 1.6 motor genellikle 1.598 cm³’tür."
        />
      )}
      {tip === 'elektrik' && (
        <NumberField<MtvInput>
          name="kw"
          label="Motor gücü"
          unit="kW"
          placeholder="Örn. 160"
          help="Ruhsattaki azami net motor gücü (kW). Beygir gücünü 1,36’ya bölerek kW’a çevirebilirsiniz."
        />
      )}
      {tip === 'tarifeII' && (
        <SelectField<MtvInput>
          name="sinif"
          label="Araç sınıfı"
          className="sm:col-span-2"
          options={sinifOptions}
          help="Minibüs ve otobüste oturma yeri, panelvanda silindir hacmi, kamyonet ve kamyonda azami toplam ağırlık esas alınır."
        />
      )}
      <NumberField<MtvInput>
        name="modelYili"
        label="Model yılı"
        decimals={0}
        placeholder={`Örn. ${yil - 4}`}
        help="Ruhsattaki model yılı. Yaş = içinde bulunulan yıl − model yılı + 1; model yılında araç 1 yaşındadır."
      />
      {degerli && (
        <SelectField<MtvInput>
          name="dilim"
          label="Taşıt değeri dilimi"
          options={[
            { value: 'auto', label: `Taşıt değerine göre (${yil} tescil)` },
            { value: '1', label: '1. dilim (en düşük değer)' },
            { value: '2', label: '2. dilim' },
            { value: '3', label: '3. dilim (en yüksek değer)' },
          ]}
          help="Dilim, ilk tescildeki taşıt değerinin o yılın tarifesindeki sınırlara göre belirlenir ve aracın ömrü boyunca aynı sıra uygulanır. Bu yıl tescil edilen araçta değeri girmeniz yeterli; önceki yıllarda tescilli araçta dilimi seçin."
          hint="1.600 cm³ üzeri silindir gruplarında iki dilim vardır; 3. dilim seçilirse en yüksek dilim kullanılır."
        />
      )}
      {degerli && dilim === 'auto' && (
        <NumberField<MtvInput>
          name="deger"
          label="İlk tescildeki taşıt değeri"
          unit="₺"
          placeholder="Örn. 1.250.000"
          help="Aracın ilk alımındaki KDV matrahı: ÖTV dahil, KDV hariç fatura bedeli (vade farkı ÖTV’si hariç)."
        />
      )}
    </>
  );
}

export default function MtvHesaplamaPage() {
  return (
    <CalculatorLayout
      slug="mtv-hesaplama"
      schema={mtvSchema}
      defaults={defaults}
      example={example}
      compute={present}
      content={content}
      emptyHint="Araç tipini, motor hacmini ve model yılını girdiğiniz anda yıllık MTV ve taksitler hesaplanır."
    >
      <Fields />
    </CalculatorLayout>
  );
}
