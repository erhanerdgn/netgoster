import { CalculatorLayout } from '@/components/calc/CalculatorLayout';
import { DateField } from '@/components/calc/fields';
import type { ResultView } from '@/components/calc/ResultCard';
import { calculateYas, yasSchema, type YasInput } from '@/calculators/yas';
import { todayISO } from '@/config/period';
import { dateLong, num } from '@/lib/format';
import content from './content.md';

const defaults: Partial<YasInput> = { tarih: todayISO() };
const example: YasInput = { dogum: '1990-05-15', tarih: todayISO() };

function present(v: Parameters<typeof calculateYas>[0]): ResultView {
  const r = calculateYas(v);
  const { years, months, days } = r.yas;
  const notes = [
    'Yaş, doğum gününüzden hesap tarihine kadar dolan tam yıl, ay ve gün olarak hesaplanır; doğduğunuz gün 0 yaşındasınız.',
  ];
  if (r.subat29)
    notes.push(
      '29 Şubat doğumlusunuz: artık olmayan yıllarda yeni yaşınızı 1 Mart’ta doldurmuş sayılırsınız. Bazı kurum ve uygulamalar 28 Şubat’ı esas alır; resmi bir işlem için ilgili kurumun uygulamasını teyit edin.',
    );
  return {
    main: {
      label: 'Yaşınız',
      value: `${years} yaş`,
      caption: `${years} yıl ${months} ay ${days} gün`,
    },
    status: r.bugunDogumGunu
      ? { tone: 'ok', text: `İyi ki doğdunuz! Bugün ${r.sonrakiYas} yaşına girdiniz.` }
      : {
          tone: 'info',
          text: `${r.sonrakiYas}. doğum gününüze ${num(r.kalanGun, 0)} gün kaldı: ${dateLong(r.sonrakiDogumGunu)} ${r.sonrakiGunAdi}.`,
        },
    rows: [
      { label: 'Tam yaş', value: `${years} yıl ${months} ay ${days} gün`, tone: 'total' },
      { label: 'Toplam ay', value: `${num(r.toplamAy, 0)} ay ${days} gün` },
      {
        label: 'Toplam hafta',
        value: `${num(r.toplamHafta.weeks, 0)} hafta${r.toplamHafta.days ? ` ${r.toplamHafta.days} gün` : ''}`,
      },
      { label: 'Yaşanan toplam gün', value: `${num(r.toplamGun, 0)} gün` },
      { label: 'Yaşanan toplam saat', value: `${num(r.toplamSaat, 0)} saat`, tone: 'muted', hint: 'Gün × 24' },
      { label: 'Doğduğunuz gün', value: r.dogumGunu },
      {
        label: 'Sonraki doğum günü',
        value: dateLong(r.sonrakiDogumGunu),
        hint: `${r.sonrakiGunAdi}, ${num(r.kalanGun, 0)} gün sonra`,
      },
    ],
    notes,
  };
}

export default function YasHesaplamaPage() {
  return (
    <CalculatorLayout
      slug="yas-hesaplama"
      schema={yasSchema}
      defaults={defaults}
      example={example}
      compute={present}
      content={content}
      emptyHint="Doğum tarihinizi girdiğiniz anda tam yaşınız ve doğum gününüze kalan süre hesaplanır."
    >
      <DateField<YasInput>
        name="dogum"
        label="Doğum tarihi"
        fromYear={1900}
        help="Nüfus cüzdanınızda (kimlik kartınızda) yazan doğum tarihiniz. gg.aa.yyyy biçiminde yazabilir ya da takvimden seçebilirsiniz."
      />
      <DateField<YasInput>
        name="tarih"
        label="Hesap tarihi"
        fromYear={1900}
        toYear={new Date().getFullYear() + 100}
        help="Yaşın hangi güne göre hesaplanacağı. Varsayılan bugündür; geçmiş veya gelecek bir tarihteki yaşınızı görmek için değiştirin."
        hint="Varsayılan: bugün"
      />
    </CalculatorLayout>
  );
}
