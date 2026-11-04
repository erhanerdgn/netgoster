import { CalculatorLayout } from '@/components/calc/CalculatorLayout';
import { ChoiceField, NumberField, SelectField } from '@/components/calc/fields';
import type { ResultView } from '@/components/calc/ResultCard';
import { calculateKiraArtis, kiraArtisSchema, type KiraArtisInput, type KiraArtisValues } from '@/calculators/kiraArtis';
import { todayISO } from '@/config/period';
import { kira25Siniri, tufe } from '@/config/tufe';
import { dateTR, monthNames, pctValue, tl } from '@/lib/format';
import content from './content.md';

const today = todayISO();
const buAy = String(Number(today.slice(5, 7)));
const buYil = today.slice(0, 4);
const defaults: Partial<KiraArtisInput> = { tur: 'konut', ay: buAy, yil: buYil };
const example: KiraArtisInput = { tur: 'konut', kira: 20000, ay: buAy, yil: buYil };

const ayAdi = (ym: string) => `${monthNames[Number(ym.slice(5)) - 1]} ${ym.slice(0, 4)}`;
const ayOptions = monthNames.map((m, i) => ({ value: String(i + 1), label: m }));
const yilOptions = Array.from({ length: Number(buYil) + 2 - Number(tufe[0].ay.slice(0, 4)) }, (_, i) => {
  const y = String(Number(tufe[0].ay.slice(0, 4)) + i);
  return { value: y, label: y };
});

function present(v: KiraArtisValues): ResultView {
  const r = calculateKiraArtis(v);
  const status: ResultView['status'] = r.yayimlanmadi
    ? {
        tone: 'warn',
        text: `${ayAdi(r.gerekenAy)} TÜFE verisi henüz açıklanmadı (TÜİK, izleyen ayın 3’ünde yayımlar). Tahmini olarak en son açıklanan ${ayAdi(r.kullanilanAy)} oranı (${pctValue(r.tufeOrani)}) kullanıldı.`,
      }
    : r.sinir25
      ? {
          tone: 'info',
          text: `Konut kiralarında ${dateTR(kira25Siniri.from)}–${dateTR(kira25Siniri.to)} arasında yenilenen sözleşmelerde artış en fazla %${kira25Siniri.oran} olabiliyordu. TÜFE ortalaması ${pctValue(r.tufeOrani)} olsa da %${kira25Siniri.oran} uygulandı.`,
        }
      : r.sinir25SonGun
        ? {
            tone: 'warn',
            text: `%${kira25Siniri.oran} sınırı ${dateTR(kira25Siniri.to)} tarihinde sona erdi. Sözleşmeniz tam bu gün yenilendiyse artış en fazla %${kira25Siniri.oran}’tir; sonraki günlerde yenilenenlerde ${pctValue(r.tufeOrani)} geçerlidir.`,
          }
        : {
            tone: 'ok',
            text: `${ayAdi(r.yenileme)} yenilemesinde yasal azami artış, ${ayAdi(r.kullanilanAy)} itibarıyla TÜFE’nin 12 aylık ortalama değişimidir: ${pctValue(r.oran)}.`,
          };
  return {
    main: { label: 'Yeni aylık kira (azami)', value: tl(r.yeniKira), caption: `Azami artış oranı ${pctValue(r.oran)}` },
    status,
    rows: [
      { label: 'Mevcut kira', value: tl(v.kira) },
      { label: 'Aylık artış tutarı', value: tl(r.artis), tone: 'plus' },
      { label: 'Yeni aylık kira', value: tl(r.yeniKira), tone: 'total' },
      { label: 'Yıllık ek ödeme', value: tl(r.yillikFark), tone: 'muted', hint: 'Aylık artış × 12' },
      {
        label: 'Esas alınan veri',
        value: `${ayAdi(r.kullanilanAy)} · ${pctValue(r.tufeOrani)}`,
        tone: 'muted',
        hint: 'TÜFE 12 aylık ortalama değişim',
      },
    ],
    notes: [
      'Bu oran üst sınırdır: taraflar daha düşük bir artışta anlaşabilir, sözleşmede daha yüksek bir oran yazsa bile bu sınır aşılamaz (TBK md. 344).',
    ],
    table: {
      caption: `Son 12 ay TÜFE (${ayAdi(r.son12[0].ay)} – ${ayAdi(r.son12[r.son12.length - 1].ay)})`,
      columns: ['Ay', 'Aylık değişim', 'Yıllık değişim', '12 aylık ortalama (kira sınırı)'],
      rows: [...r.son12].reverse().map((t) => [ayAdi(t.ay), pctValue(t.aylik), pctValue(t.yillik), pctValue(t.ortalama12)]),
    },
  };
}

export default function KiraArtisPage() {
  return (
    <CalculatorLayout
      slug="kira-artis-hesaplama"
      schema={kiraArtisSchema}
      defaults={defaults}
      example={example}
      compute={present}
      content={content}
      emptyHint="Mevcut kiranızı girip yenileme ayını seçtiğiniz anda yasal azami artış ve yeni kiranız hesaplanır."
    >
      <ChoiceField<KiraArtisInput>
        name="tur"
        label="Kira türü"
        className="sm:col-span-2"
        options={[
          { value: 'konut', label: 'Konut' },
          { value: 'isyeri', label: 'İşyeri' },
        ]}
        help="Konut ve çatılı işyeri kiralarında aynı TÜFE sınırı uygulanır. 2022–2024 arasındaki %25 sınırı yalnız konutlar içindi."
      />
      <NumberField<KiraArtisInput>
        name="kira"
        label="Mevcut aylık kira"
        unit="₺"
        className="sm:col-span-2"
        placeholder="Örn. 20.000"
        help="Şu anda ödediğiniz aylık kira bedeli (aidat hariç)."
      />
      <SelectField<KiraArtisInput>
        name="ay"
        label="Yenileme ayı"
        options={ayOptions}
        help="Yeni kira yılının başladığı ay; genellikle sözleşmenin başlangıç ayıdır. Artışa bu aydan önceki ayın TÜFE verisi esas alınır."
      />
      <SelectField<KiraArtisInput>
        name="yil"
        label="Yenileme yılı"
        options={yilOptions}
        help="Kira artışının yapılacağı yıl. Geçmiş yıl seçerek eski artışları da kontrol edebilirsiniz."
      />
    </CalculatorLayout>
  );
}
