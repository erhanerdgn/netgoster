import { CalculatorLayout, type Source } from '@/components/calc/CalculatorLayout';
import { NumberField, SelectField } from '@/components/calc/fields';
import type { ResultView } from '@/components/calc/ResultCard';
import { ayAdi, calculateEnflasyon, enflasyonSchema, type EnflasyonInput, type EnflasyonValues } from '@/calculators/enflasyon';
import { ILK_AY, SON_AY } from '@/config/tufeEndeks';
import { monthNames, num, pct, tl } from '@/lib/format';
import content from './content.md';

const sonYil = SON_AY.slice(0, 4);
const sonAy = String(Number(SON_AY.slice(5)));
const defaults: Partial<EnflasyonInput> = { tutar: 1000, basAy: '1', basYil: '2020', sonAy, sonYil };
const example: EnflasyonInput = { tutar: 10000, basAy: '1', basYil: '2015', sonAy, sonYil };

const ayOptions = monthNames.map((m, i) => ({ value: String(i + 1), label: m }));
const ilkYil = Number(ILK_AY.slice(0, 4));
const yilOptions = Array.from({ length: Number(sonYil) - ilkYil + 1 }, (_, i) => {
  const y = String(Number(sonYil) - i);
  return { value: y, label: y };
});

const sources: Source[] = [
  { label: 'TÜİK — Tüketici Fiyat Endeksi (veri portalı)', url: 'https://veriportali.tuik.gov.tr' },
  {
    label: 'TCMB — Fiyat istatistikleri',
    url: 'https://www.tcmb.gov.tr/wps/wcm/connect/tr/tcmb+tr/main+menu/istatistikler/enflasyon+verileri',
  },
];

const sure = (n: number) => {
  const y = Math.floor(n / 12);
  const a = n % 12;
  return [y && `${y} yıl`, a && `${a} ay`].filter(Boolean).join(' ');
};

function present(v: EnflasyonValues): ResultView {
  const r = calculateEnflasyon(v);
  const [eski, yeni] = r.geriye ? [r.son, r.bas] : [r.bas, r.son];
  return {
    main: {
      label: `${ayAdi(r.bas)} · ${tl(v.tutar)}`,
      value: tl(r.karsilik),
      caption: `${ayAdi(r.son)} fiyatlarıyla karşılığı (× ${num(r.carpan, 4)})`,
    },
    status: {
      tone: 'info',
      text: r.geriye
        ? `${ayAdi(r.bas)} tarihindeki ${tl(v.tutar)} ile alınabilenler, ${ayAdi(r.son)} fiyatlarıyla ${tl(r.karsilik)} ediyordu.`
        : `${ayAdi(r.bas)} tarihindeki ${tl(v.tutar)}, ${ayAdi(r.son)} fiyatlarıyla ${tl(r.karsilik)} eder: aynı alışveriş için bu kadar para gerekir.`,
    },
    rows: [
      { label: `TÜFE endeksi, ${ayAdi(r.bas)}`, value: num(r.endeksBas, 2), tone: 'muted', hint: '2003=100 ölçeği' },
      { label: `TÜFE endeksi, ${ayAdi(r.son)}`, value: num(r.endeksSon, 2), tone: 'muted', hint: '2003=100 ölçeği' },
      { label: 'Süre', value: sure(r.aySayisi), hint: `${ayAdi(eski)} → ${ayAdi(yeni)}` },
      {
        label: 'Dönem enflasyonu (kümülatif)',
        value: pct(r.donemEnflasyonu),
        tone: 'total',
        hint: r.geriye
          ? `${num(r.endeksBas, 2)} / ${num(r.endeksSon, 2)} − 1`
          : `${num(r.endeksSon, 2)} / ${num(r.endeksBas, 2)} − 1`,
      },
      {
        label: 'Yıllık ortalama enflasyon (bileşik)',
        value: pct(r.yillikOrtalama),
        hint: `(1 + dönem enflasyonu)^(12 / ${r.aySayisi}) − 1`,
      },
      {
        label: 'Satın alma gücü kaybı',
        value: pct(r.alimGucuKaybi),
        tone: 'minus',
        hint: `${ayAdi(eski)} tarihindeki paranın ${ayAdi(yeni)} itibarıyla yitirdiği alım gücü`,
      },
    ],
    notes: [
      `Hesap TÜİK Tüketici Fiyat Endeksi (genel) ile yapılır; aylık endeks o ayın ortalama fiyat düzeyini gösterir. Yayımlanan son veri ${ayAdi(SON_AY)} ayına aittir.`,
      'Ocak 2026’dan itibaren yayımlanan 2025=100 bazlı endeks, 2003=100 serisine 2025 ortalamasıyla bağlandı; aylık ve yıllık değişim oranları TÜİK’in açıkladığıyla aynıdır.',
      'TÜFE ortalama bir hane halkının harcama sepetini ölçer; kira, gıda ya da eğitim ağırlığı farklı olan bir bütçede hissedilen enflasyon farklı olabilir.',
    ],
  };
}

export default function EnflasyonPage() {
  return (
    <CalculatorLayout
      slug="enflasyon-hesaplama"
      schema={enflasyonSchema}
      defaults={defaults}
      example={example}
      compute={present}
      content={content}
      sources={sources}
      emptyHint="Tutarı ve iki ayı seçtiğiniz anda paranın TÜFE’ye göre karşılığı, dönem enflasyonu ve alım gücü kaybı hesaplanır."
    >
      <NumberField<EnflasyonInput>
        name="tutar"
        label="Tutar"
        unit="₺"
        placeholder="Örn. 1.000"
        className="sm:col-span-2"
        help="Değerini bugüne (ya da başka bir aya) taşımak istediğiniz Türk lirası tutar: eski bir maaş, fiyat, kira ya da birikim."
      />
      <SelectField<EnflasyonInput>
        name="basAy"
        label="Paranın ayı"
        options={ayOptions}
        help="Tutarın ait olduğu ay. Örneğin 2020 başındaki maaşınız için Ocak."
      />
      <SelectField<EnflasyonInput>
        name="basYil"
        label="Paranın yılı"
        options={yilOptions}
        help={`TÜFE (2003=100) serisi ${ayAdi(ILK_AY)} ayından başlar.`}
      />
      <SelectField<EnflasyonInput>
        name="sonAy"
        label="Karşılığı istenen ay"
        options={ayOptions}
        help="Tutarın hangi ayın fiyatlarıyla ifade edileceği. Bugünkü değer için en son açıklanan ayı seçin."
        hint={`Son veri: ${ayAdi(SON_AY)}`}
      />
      <SelectField<EnflasyonInput>
        name="sonYil"
        label="Karşılığı istenen yıl"
        options={yilOptions}
        help="Paranın ayından önceki bir tarih seçerseniz ters hesap yapılır: bugünkü bir tutarın geçmişteki karşılığı bulunur."
      />
    </CalculatorLayout>
  );
}
