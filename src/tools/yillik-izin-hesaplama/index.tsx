import { CalculatorLayout } from '@/components/calc/CalculatorLayout';
import { DateField, SwitchField } from '@/components/calc/fields';
import type { ResultView } from '@/components/calc/ResultCard';
import { calculateYillikIzin, yillikIzinSchema, type YillikIzinInput } from '@/calculators/yillikIzin';
import { isKanunu as K } from '@/config/parameters-2026';
import { todayISO } from '@/config/period';
import { dateLong, dateTR, num } from '@/lib/format';
import content from './content.md';

const defaults: Partial<YillikIzinInput> = { tarih: todayISO(), yerAlti: false };
const example: YillikIzinInput = { giris: '2019-09-02', dogum: '1988-04-15', tarih: todayISO(), yerAlti: false };

function present(v: Parameters<typeof calculateYillikIzin>[0]): ResultView {
  const r = calculateYillikIzin(v);
  const sure = `${r.kidem.years} yıl ${r.kidem.months} ay ${r.kidem.days} gün`;
  const sonraki = [
    { label: 'Bir sonraki hak ediş', value: dateTR(r.sonrakiHakEdis), hint: `${num(r.kalanGun, 0)} gün sonra` },
    { label: 'O tarihte doğacak izin', value: `${r.sonrakiGun} gün` },
  ];
  if (r.kidemYil < 1) {
    return {
      main: { label: 'Yıllık izin hakkı', value: '0 gün', caption: `Kıdem: ${sure}` },
      status: {
        tone: 'warn',
        text: `Yıllık izne hak kazanmak için ${K.yillikIzin[0].minYil} yıl çalışmak gerekir; ilk izniniz ${dateLong(r.sonrakiHakEdis)} tarihinde doğar.`,
      },
      rows: sonraki,
    };
  }
  return {
    main: { label: 'Yıllık izin hakkı', value: `${r.gun} gün`, caption: `Kıdem: ${sure}` },
    status: { tone: 'ok', text: `Son izin hakkınız ${dateLong(r.sonHakEdis!)} tarihinde doğdu.` },
    rows: [
      { label: 'Tamamlanan hizmet yılı', value: `${r.kidemYil} yıl` },
      { label: 'Bugünkü yaş', value: `${r.yas}` },
      { label: 'Bu yılın izin hakkı', value: `${r.gun} gün`, tone: 'total' },
      ...sonraki,
      {
        label: 'İşe girişten bu yana doğan toplam izin',
        value: `${num(r.toplamHak, 0)} gün`,
        tone: 'muted',
        hint: 'Kullandığınız izinler düşülmemiştir',
      },
    ],
    notes: [
      'Süreler iş günü olarak verilir; izin süresine rastlayan hafta tatili ve resmî tatiller izinden sayılmaz. Sözleşme veya toplu sözleşme daha uzun izin öngörebilir.',
    ],
  };
}

export default function YillikIzinPage() {
  return (
    <CalculatorLayout
      slug="yillik-izin-hesaplama"
      schema={yillikIzinSchema}
      defaults={defaults}
      example={example}
      compute={present}
      content={content}
      emptyHint="İşe giriş ve doğum tarihinizi girdiğiniz anda yıllık izin hakkınız hesaplanır."
    >
      <DateField<YillikIzinInput>
        name="giris"
        label="İşe giriş tarihi"
        help="Aynı işverende çalışmaya başladığınız ilk gün. İzin hakkı her yıl bu tarihin yıl dönümünde doğar."
      />
      <DateField<YillikIzinInput>
        name="dogum"
        label="Doğum tarihi"
        help={`${K.izinYasAlt} yaş ve altındaki ve ${K.izinYasUst} yaş ve üstündeki çalışanların izni ${K.izinYasMinGun} günden az olamaz; yaş, hakkın doğduğu güne göre bakılır.`}
      />
      <DateField<YillikIzinInput>
        name="tarih"
        label="Hesap tarihi"
        help="Hangi tarih itibarıyla hesaplanacağı. Varsayılan bugündür."
      />
      <SwitchField<YillikIzinInput>
        name="yerAlti"
        label="Yer altı işinde çalışıyorum"
        help={`Maden gibi yer altı işlerinde çalışanların yıllık izin süreleri ${K.yerAltiEk} gün artırılarak uygulanır.`}
      />
    </CalculatorLayout>
  );
}
