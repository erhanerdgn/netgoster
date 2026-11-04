import { useWatch } from 'react-hook-form';
import { CalculatorLayout } from '@/components/calc/CalculatorLayout';
import { ChoiceField, DateField, NumberField, SwitchField } from '@/components/calc/fields';
import type { ResultRow, ResultView } from '@/components/calc/ResultCard';
import { calculateAra, calculateEkle, gunAdi, tarihSchema, type TarihInput, type TarihValues } from '@/calculators/tarih';
import { todayISO } from '@/config/period';
import { dateLong, dateTR, num } from '@/lib/format';
import content from './content.md';

const today = todayISO();
const defaults: Partial<TarihInput> = {
  mod: 'ara',
  baslangic: today,
  bitisDahil: false,
  tarih: today,
  islem: 'ekle',
  gun: 30,
  birim: 'takvim',
};
const example: TarihInput = {
  mod: 'ara',
  baslangic: `${today.slice(0, 4)}-01-01`,
  bitis: `${today.slice(0, 4)}-12-31`,
  bitisDahil: true,
  tarih: today,
  islem: 'ekle',
  gun: 30,
  birim: 'is',
};

const eksikNot = (years: number[]) =>
  years.length
    ? `${years.join(', ')} için dini bayram tarihleri henüz listemizde yok; bu yıllarda yalnız hafta sonları ve sabit tarihli resmi tatiller düşüldü.`
    : undefined;

function present(v: TarihValues): ResultView {
  if (v.mod === 'ara') {
    const r = calculateAra(v);
    const { years, months, days } = r.ymd;
    const yarim = r.yarimGunler.length;
    const rows: ResultRow[] = [
      { label: 'Yıl / ay / gün', value: `${years} yıl ${months} ay ${days} gün`, tone: 'total' },
      { label: 'Ay ve gün', value: `${num(r.ay.months, 0)} ay ${r.ay.days} gün` },
      { label: 'Hafta ve gün', value: `${num(r.hafta.weeks, 0)} hafta ${r.hafta.days} gün` },
      { label: 'İş günü', value: `${num(r.isGunu, 0)} gün`, tone: 'total', hint: 'Hafta sonu ve resmi tatiller hariç' },
      { label: 'Hafta sonu günü', value: `${num(r.haftaSonu, 0)} gün`, tone: 'muted' },
      { label: 'Hafta içine denk gelen resmi tatil', value: `${num(r.tatilGunu, 0)} gün`, tone: 'muted' },
    ];
    if (yarim)
      rows.push({
        label: 'Yarım gün (arife) sayısı',
        value: `${yarim} gün`,
        hint: `İş gününe dahil; yarım günler düşülürse ${num(r.isGunu - yarim / 2, 1)} iş günü`,
      });
    const tatilListe = [...r.tatiller, ...r.yarimGunler]
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((t) => `${dateTR(t.date)} ${t.name}${t.half ? ' (yarım gün)' : ''}`);
    return {
      main: {
        label: 'İki tarih arası',
        value: `${num(r.gun, 0)} gün`,
        caption: `${dateLong(v.baslangic)} – ${dateLong(v.bitis)}${v.bitisDahil ? ' (bitiş günü dahil)' : ''}`,
      },
      rows,
      status: eksikNot(r.eksikYillar) ? { tone: 'warn', text: eksikNot(r.eksikYillar)! } : undefined,
      notes: [
        v.bitisDahil
          ? 'Başlangıç ve bitiş günleri sayıma dahildir.'
          : 'Başlangıç günü sayılır, bitiş günü sayılmaz (iş günü sayımı da bu aralıkta yapılır). Bitiş gününü de saymak için anahtarı açın.',
        ...(tatilListe.length ? [`Aralıktaki resmi tatiller: ${tatilListe.join(' · ')}.`] : []),
      ],
    };
  }
  const r = calculateEkle(v);
  const yon = v.islem === 'ekle' ? 'sonrası' : 'öncesi';
  const birim = v.birim === 'is' ? 'iş günü' : 'gün';
  const rows: ResultRow[] = [
    { label: 'Başlangıç tarihi', value: dateTR(v.tarih), hint: gunAdi(v.tarih) },
    { label: v.islem === 'ekle' ? 'Eklenen' : 'Çıkarılan', value: `${num(v.gun, 0)} ${birim}` },
    { label: 'Sonuç tarihi', value: dateTR(r.sonuc), tone: 'total', hint: r.gunAdi },
  ];
  if (v.birim === 'is') rows.push({ label: 'Takvim günü karşılığı', value: `${num(r.takvimGunu, 0)} gün`, tone: 'muted' });
  const uyarilar: string[] = [];
  if (v.birim === 'takvim' && r.sonucTatil && !r.sonucTatil.half)
    uyarilar.push(`Sonuç tarihi resmi tatile denk geliyor: ${r.sonucTatil.name}.`);
  else if (v.birim === 'takvim' && r.sonucHaftaSonu) uyarilar.push(`Sonuç tarihi hafta sonuna (${r.gunAdi}) denk geliyor.`);
  if (r.sonucTatil?.half) uyarilar.push(`Sonuç tarihi yarım gün tatil: ${r.sonucTatil.name} (13.00’ten sonra tatil).`);
  const eksik = eksikNot(r.eksikYillar);
  if (eksik) uyarilar.push(eksik);
  return {
    main: { label: `${num(v.gun, 0)} ${birim} ${yon}`, value: dateLong(r.sonuc), caption: r.gunAdi },
    rows,
    status: uyarilar.length ? { tone: 'warn', text: uyarilar.join(' ') } : undefined,
    notes: [
      v.birim === 'is'
        ? 'İş günü sayımında cumartesi, pazar ve tam gün resmi tatiller atlanır; yarım gün arifeler iş günü sayılır. Başlangıç günü sayılmaz.'
        : 'Takvim günü sayımında başlangıç günü sayılmaz: 1 gün sonrası ertesi gündür.',
      ...(r.atlananTatiller.length
        ? [`Atlanan resmi tatiller: ${r.atlananTatiller.map((t) => `${dateTR(t.date)} ${t.name}`).join(' · ')}.`]
        : []),
    ],
  };
}

function Fields() {
  const mod = useWatch<TarihInput, 'mod'>({ name: 'mod' });
  return (
    <>
      <ChoiceField<TarihInput>
        name="mod"
        label="Hesaplama türü"
        className="sm:col-span-2"
        options={[
          { value: 'ara', label: 'İki tarih arası' },
          { value: 'ekle', label: 'Gün ekle / çıkar' },
        ]}
        help="İki tarih arasındaki farkı mı bulmak istiyorsunuz, yoksa bir tarihe gün ekleyip çıkararak yeni tarihi mi?"
      />
      {mod === 'ekle' ? (
        <>
          <DateField<TarihInput>
            name="tarih"
            label="Başlangıç tarihi"
            toYear={new Date().getFullYear() + 50}
            help="Gün eklenecek veya çıkarılacak tarih. Bu gün sayıma dahil edilmez."
          />
          <NumberField<TarihInput>
            name="gun"
            label="Gün sayısı"
            unit="gün"
            decimals={0}
            placeholder="Örn. 30"
            help="Eklenecek ya da çıkarılacak gün sayısı (en fazla 36.500)."
          />
          <ChoiceField<TarihInput>
            name="islem"
            label="İşlem"
            options={[
              { value: 'ekle', label: 'Ekle (+)' },
              { value: 'cikar', label: 'Çıkar (−)' },
            ]}
            help="Ekle: ileri tarih (ör. vade, teslim). Çıkar: geri tarih (ör. bir süre önce hangi gündü)."
          />
          <ChoiceField<TarihInput>
            name="birim"
            label="Gün türü"
            options={[
              { value: 'takvim', label: 'Takvim günü' },
              { value: 'is', label: 'İş günü' },
            ]}
            help="Takvim günü: tüm günler sayılır. İş günü: cumartesi, pazar ve resmi tatiller atlanır."
          />
        </>
      ) : (
        <>
          <DateField<TarihInput>
            name="baslangic"
            label="Başlangıç tarihi"
            toYear={new Date().getFullYear() + 50}
            help="Sayımın başladığı gün. Bu gün her zaman sayıma dahildir."
          />
          <DateField<TarihInput>
            name="bitis"
            label="Bitiş tarihi"
            toYear={new Date().getFullYear() + 50}
            help="Sayımın bittiği gün. Dahil edilip edilmeyeceğini aşağıdaki anahtarla seçin."
          />
          <SwitchField<TarihInput>
            name="bitisDahil"
            label="Bitiş günü dahil"
            className="sm:col-span-2"
            help="Açıkken bitiş günü de sayılır (ör. 1–31 Ocak = 31 gün). İzin, rapor ve sözleşme sürelerinde genellikle her iki gün de sayılır."
            hint="Kapalıyken 1–31 Ocak = 30 gün"
          />
        </>
      )}
    </>
  );
}

export default function TarihHesaplamaPage() {
  return (
    <CalculatorLayout
      slug="tarih-hesaplama"
      schema={tarihSchema}
      defaults={defaults}
      example={example}
      compute={present}
      content={content}
      emptyHint="Tarihleri girdiğiniz anda gün farkı, iş günü sayısı veya yeni tarih hesaplanır."
    >
      <Fields />
    </CalculatorLayout>
  );
}
