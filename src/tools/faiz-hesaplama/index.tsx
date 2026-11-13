import { useWatch } from 'react-hook-form';
import { CalculatorLayout } from '@/components/calc/CalculatorLayout';
import { ChoiceField, NumberField } from '@/components/calc/fields';
import type { ResultView } from '@/components/calc/ResultCard';
import {
  calculateFaiz,
  carpan,
  DONEM_SAYISI,
  faizSchema,
  type FaizDonem,
  type FaizInput,
  type FaizValues,
} from '@/calculators/faiz';
import { num, pct, pctValue, tl } from '@/lib/format';
import content from './content.md';

const defaults: Partial<FaizInput> = {
  mod: 'faiz',
  tur: 'bilesik',
  donem: 'aylik',
  anapara: 100000,
  oran: 40,
  sure: 1,
  sureBirim: 'yil',
};
const example: FaizInput = {
  mod: 'faiz',
  tur: 'bilesik',
  donem: 'aylik',
  anapara: 250000,
  oran: 45,
  sure: 18,
  sureBirim: 'ay',
  hedef: 500000,
};

const DONEM_AD: Record<FaizDonem, string> = { yillik: 'yıllık', aylik: 'aylık', gunluk: 'günlük' };
const BIRIM_AD = { gun: 'gün', ay: 'ay', yil: 'yıl' } as const;
const yontem = (v: FaizValues) => (v.tur === 'basit' ? 'Basit faiz' : `Bileşik faiz (${DONEM_AD[v.donem]})`);
const yil = (t: number) => `${num(t, 2)} yıl`;

function present(v: FaizValues): ResultView {
  const r = calculateFaiz(v);
  const sureMetni = v.mod === 'sure' ? yil(r.yil) : `${num(v.sure!, 2)} ${BIRIM_AD[v.sureBirim]}`;
  const main: ResultView['main'] =
    v.mod === 'sure'
      ? {
          label: `${tl(v.hedef!)} için gereken süre`,
          value: yil(r.yil),
          caption: `≈ ${num(r.yil * 12, 1)} ay · ${num(Math.ceil(r.yil * 365 - 1e-9), 0)} gün`,
        }
      : v.mod === 'oran'
        ? {
            label: `${sureMetni} içinde ${tl(v.hedef!)} için gereken oran`,
            value: `${pctValue(r.oran, 2)} yıllık`,
            caption: `${yontem(v)} · efektif yıllık ${pct(r.efektif)}`,
          }
        : { label: 'Vade sonu tutarı', value: tl(r.vadeSonu), caption: `Faiz geliri ${tl(r.faiz)} · ${yontem(v)}` };

  // Aynı oran ve sürede yöntemlerin karşılaştırması (yalnız tutar hesabında)
  const t = r.yil;
  const satir = (ad: string, g: number) => {
    const s = v.anapara * g;
    return [ad, tl(s), tl(s - v.anapara), pct(g ** (1 / t) - 1)];
  };
  const table: ResultView['table'] =
    v.mod === 'faiz' && r.oran > 0
      ? {
          caption: `Aynı oran (${pctValue(r.oran)}) ve sürede faiz yöntemleri`,
          columns: ['Yöntem', 'Vade sonu', 'Faiz', 'Efektif yıllık'],
          rows: [
            satir('Basit faiz', carpan('basit', r.oran / 100, t, 1)),
            ...(['yillik', 'aylik', 'gunluk'] as const).map((d) =>
              satir(`Bileşik, ${DONEM_AD[d]}`, carpan('bilesik', r.oran / 100, t, DONEM_SAYISI[d])),
            ),
          ],
        }
      : undefined;

  return {
    main,
    rows: [
      { label: 'Anapara', value: tl(v.anapara) },
      {
        label: 'Yıllık faiz oranı (nominal)',
        value: pctValue(r.oran, 2),
        tone: v.mod === 'oran' ? 'total' : undefined,
      },
      { label: 'Süre', value: sureMetni, tone: v.mod === 'sure' ? 'total' : undefined },
      { label: 'Yöntem', value: yontem(v), tone: 'muted' },
      { label: 'Faiz tutarı', value: tl(r.faiz), tone: 'plus' },
      { label: 'Vade sonu tutarı', value: tl(r.vadeSonu), tone: 'total' },
      {
        label: 'Efektif yıllık faiz',
        value: pct(r.efektif),
        tone: 'muted',
        hint: '(Vade sonu / anapara)^(1 / yıl) − 1',
      },
      ...(r.ikiKat !== undefined
        ? [
            { label: 'Paranın ikiye katlanma süresi', value: yil(r.ikiKat) },
            {
              label: '72 kuralıyla tahmin',
              value: `≈ ${yil(r.kural72!)}`,
              tone: 'muted' as const,
              hint: `72 / ${num(r.oran, 2)}`,
            },
          ]
        : []),
    ],
    table,
    notes: [
      'Sonuçlar brüt tutardır: mevduattaki stopaj kesintisi, kredideki KKDF ve BSMV bu araçta hesaba katılmaz. Net mevduat getirisi için Mevduat Faizi Hesaplama, taksit ve toplam geri ödeme için Kredi Hesaplama aracını kullanın.',
      'Gün hesabında yıl 365 gün sayılır. Bileşik dönem sayısı kesirli çıkarsa (ör. aylık bileşikte 45 gün) son kısmi dönem de bileşik üsle hesaplanır.',
    ],
  };
}

function Fields() {
  const mod = useWatch<FaizInput, 'mod'>({ name: 'mod' }) ?? 'faiz';
  const tur = useWatch<FaizInput, 'tur'>({ name: 'tur' }) ?? 'bilesik';
  return (
    <>
      <ChoiceField<FaizInput>
        name="mod"
        label="Ne hesaplansın?"
        className="sm:col-span-2"
        options={[
          { value: 'faiz', label: 'Vade sonu tutarı' },
          { value: 'sure', label: 'Gereken süre' },
          { value: 'oran', label: 'Gereken oran' },
        ]}
        help="Vade sonu tutarı: anapara, oran ve süreden faizi bulur. Gereken süre: hedef tutara kaç yılda ulaşılacağını, gereken oran: belirli sürede hedefe ulaşmak için yıllık kaç faiz gerektiğini hesaplar."
      />
      <ChoiceField<FaizInput>
        name="tur"
        label="Faiz türü"
        className="sm:col-span-2"
        options={[
          { value: 'basit', label: 'Basit faiz' },
          { value: 'bilesik', label: 'Bileşik faiz' },
        ]}
        help="Basit faizde faiz yalnız anaparaya işler. Bileşik faizde her dönem sonunda kazanılan faiz anaparaya eklenir ve sonraki dönemde o da faiz kazanır."
      />
      {tur === 'bilesik' && (
        <ChoiceField<FaizInput>
          name="donem"
          label="Bileşik dönemi"
          className="sm:col-span-2"
          options={[
            { value: 'yillik', label: 'Yıllık' },
            { value: 'aylik', label: 'Aylık' },
            { value: 'gunluk', label: 'Günlük' },
          ]}
          help="Faizin ne sıklıkla anaparaya eklendiği. Aylık bileşikte yıllık oran 12'ye bölünüp her ay uygulanır; dönem kısaldıkça efektif getiri artar."
        />
      )}
      <NumberField<FaizInput>
        name="anapara"
        label="Anapara"
        unit="₺"
        placeholder="Örn. 100.000"
        className="sm:col-span-2"
        help="Faize yatırılan ya da borç verilen başlangıç tutarı."
      />
      {mod !== 'faiz' && (
        <NumberField<FaizInput>
          name="hedef"
          label="Hedef tutar"
          unit="₺"
          placeholder="Örn. 200.000"
          className="sm:col-span-2"
          help="Ulaşmak istediğiniz vade sonu tutarı (anapara + faiz). Anaparadan büyük olmalı."
        />
      )}
      {mod !== 'oran' && (
        <NumberField<FaizInput>
          name="oran"
          label="Yıllık faiz oranı"
          unit="%"
          decimals={2}
          placeholder="Örn. 40"
          className="sm:col-span-2"
          help="Yıllık nominal (basit) faiz oranı. Bankaların ilan ettiği yıllık oran budur; aylık oran verildiyse 12 ile çarpın."
        />
      )}
      {mod !== 'sure' && (
        <>
          <NumberField<FaizInput>
            name="sure"
            label="Süre"
            decimals={2}
            placeholder="Örn. 12"
            help="Paranın faizde kalacağı süre; birimini yandan seçin. En fazla 100 yıl."
          />
          <ChoiceField<FaizInput>
            name="sureBirim"
            label="Süre birimi"
            options={[
              { value: 'gun', label: 'Gün' },
              { value: 'ay', label: 'Ay' },
              { value: 'yil', label: 'Yıl' },
            ]}
            help="Gün seçildiğinde yıl 365 gün, ay seçildiğinde yıl 12 ay sayılır."
          />
        </>
      )}
    </>
  );
}

export default function FaizPage() {
  return (
    <CalculatorLayout
      slug="faiz-hesaplama"
      schema={faizSchema}
      defaults={defaults}
      example={example}
      compute={present}
      content={content}
      emptyHint="Anapara, yıllık faiz oranı ve süreyi girdiğiniz anda basit ya da bileşik faiz, vade sonu tutarı ve efektif yıllık faiz hesaplanır."
    >
      <Fields />
    </CalculatorLayout>
  );
}
