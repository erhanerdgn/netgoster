import { CalculatorLayout } from '@/components/calc/CalculatorLayout';
import { DateField, NumberField } from '@/components/calc/fields';
import type { ResultView } from '@/components/calc/ResultCard';
import { calculateKidem, kidemSchema, type KidemInput } from '@/calculators/kidem';
import { todayISO } from '@/config/period';
import { dateTR, num, tl } from '@/lib/format';
import content from './content.md';

const defaults: Partial<KidemInput> = { cikis: todayISO(), yanHaklar: 0 };
const example: KidemInput = { giris: '2018-04-02', cikis: todayISO(), brut: 45000, yanHaklar: 4000 };

function present(v: Parameters<typeof calculateKidem>[0]): ResultView {
  const r = calculateKidem(v);
  const sure = `${r.sure.years} yıl ${r.sure.months} ay ${r.sure.days} gün`;
  if (!r.hakVar) {
    return {
      main: { label: 'Net kıdem tazminatı', value: tl(0), caption: `Çalışma süresi: ${sure}` },
      status: { tone: 'warn', text: 'Kıdem tazminatı için aynı işverende en az 1 tam yıl çalışmış olmanız gerekir.' },
      rows: [{ label: 'Toplam çalışılan gün', value: `${num(r.toplamGun, 0)} gün` }],
    };
  }
  return {
    main: { label: 'Net kıdem tazminatı', value: tl(r.net), caption: `Çalışma süresi: ${sure}` },
    status: r.tavanUygulandi
      ? {
          tone: 'info',
          text: `Giydirilmiş ücretiniz (${tl(r.giydirilmis)}) tavanı aştığı için hesaplama ${tl(r.tavan)} tavan üzerinden yapıldı.`,
        }
      : { tone: 'ok', text: 'Ücretiniz kıdem tazminatı tavanının altında; tam ücretiniz esas alındı.' },
    rows: [
      { label: 'Giydirilmiş brüt ücret', value: tl(r.giydirilmis) },
      {
        label: 'Geçerli tavan',
        value: tl(r.tavan),
        tone: 'muted',
        hint: `${dateTR(r.tavanDonemi.from)}${r.tavanDonemi.to ? ` – ${dateTR(r.tavanDonemi.to)}` : ''} dönemi`,
      },
      { label: 'Hesaba esas ücret (1 yıllık)', value: tl(r.esasUcret) },
      { label: 'Brüt kıdem tazminatı', value: tl(r.brut), tone: 'total' },
      { label: 'Damga vergisi', value: tl(r.damga), tone: 'minus' },
      { label: 'Gelir vergisi', value: 'İstisna', tone: 'muted' },
      { label: 'Net kıdem tazminatı', value: tl(r.net), tone: 'total' },
    ],
    notes: ['Çıkış tarihi, çalışılan son gün olarak süreye dahil edilir. Kıdem tazminatına SGK primi kesilmez.'],
  };
}

export default function KidemTazminatiPage() {
  return (
    <CalculatorLayout
      slug="kidem-tazminati-hesaplama"
      schema={kidemSchema}
      defaults={defaults}
      example={example}
      compute={present}
      content={content}
      emptyHint="İşe giriş tarihinizi ve brüt maaşınızı girdiğiniz anda net kıdem tazminatınız hesaplanır."
    >
      <DateField<KidemInput>
        name="giris"
        label="İşe giriş tarihi"
        help="Aynı işverende (aynı şirketin farklı işyerleri dahil) çalışmaya başladığınız ilk gün."
      />
      <DateField<KidemInput>
        name="cikis"
        label="İşten çıkış tarihi"
        help="İş sözleşmesinin sona erdiği, çalıştığınız son gün. Tavan bu tarihe göre belirlenir."
      />
      <NumberField<KidemInput>
        name="brut"
        label="Son brüt maaş"
        unit="₺"
        placeholder="Örn. 45.000"
        help="Brüt maaş, vergi ve SGK kesintilerinden önceki ücrettir; bordronuzda “brüt ücret” olarak yazar."
      />
      <NumberField<KidemInput>
        name="yanHaklar"
        label="Aylık yan haklar (brüt)"
        unit="₺"
        placeholder="Örn. 4.000"
        help="Düzenli ödenen yemek, yol, yakacak yardımı ve ikramiyelerin aylık brüt karşılığı. Yıllık ikramiyeyi 12’ye bölerek ekleyin."
        hint="Yoksa 0 bırakın."
      />
    </CalculatorLayout>
  );
}
