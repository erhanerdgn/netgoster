import { CalculatorLayout } from '@/components/calc/CalculatorLayout';
import { DateField, NumberField } from '@/components/calc/fields';
import type { ResultView } from '@/components/calc/ResultCard';
import { calculateIhbar, ihbarSchema, type IhbarInput } from '@/calculators/ihbar';
import { todayISO } from '@/config/period';
import { tl } from '@/lib/format';
import content from './content.md';

const defaults: Partial<IhbarInput> = { cikis: todayISO(), yanHaklar: 0, kumMatrah: 0 };
const example: IhbarInput = { giris: '2022-09-12', cikis: todayISO(), brut: 45000, yanHaklar: 3000, kumMatrah: 0 };

function present(v: Parameters<typeof calculateIhbar>[0]): ResultView {
  const r = calculateIhbar(v);
  const sure = `${r.sure.years} yıl ${r.sure.months} ay ${r.sure.days} gün`;
  return {
    main: { label: 'Net ihbar tazminatı', value: tl(r.net), caption: `İhbar süresi: ${r.hafta} hafta (${r.gun} gün)` },
    status: { tone: 'info', text: `Çalışma süreniz ${sure}; İş Kanunu md. 17'ye göre bildirim süreniz ${r.hafta} haftadır.` },
    rows: [
      { label: 'Giydirilmiş brüt ücret', value: tl(r.giydirilmis) },
      { label: 'Günlük brüt ücret', value: tl(r.gunluk), tone: 'muted', hint: 'Aylık ücret / 30' },
      { label: 'Brüt ihbar tazminatı', value: tl(r.brut), tone: 'total', hint: `${r.gun} gün × günlük ücret` },
      { label: 'Gelir vergisi', value: tl(r.gv), tone: 'minus' },
      { label: 'Damga vergisi', value: tl(r.damga), tone: 'minus' },
      { label: 'SGK primi', value: 'Kesilmez', tone: 'muted' },
      { label: 'Net ihbar tazminatı', value: tl(r.net), tone: 'total' },
    ],
    notes: [
      'Gelir vergisi, girdiğiniz yıllık kümülatif matrahın üzerine eklenerek hesaplanır. Asgari ücret vergi istisnasının aynı ayın maaşında kullanıldığı varsayılmıştır.',
    ],
  };
}

export default function IhbarTazminatiPage() {
  return (
    <CalculatorLayout
      slug="ihbar-tazminati-hesaplama"
      schema={ihbarSchema}
      defaults={defaults}
      example={example}
      compute={present}
      content={content}
      emptyHint="İşe giriş tarihinizi ve brüt maaşınızı girdiğiniz anda ihbar süreniz ve net ihbar tazminatınız hesaplanır."
    >
      <DateField<IhbarInput>
        name="giris"
        label="İşe giriş tarihi"
        help="Aynı işverende çalışmaya başladığınız ilk gün. İhbar süresi bu tarihten itibaren geçen kıdeme göre belirlenir."
      />
      <DateField<IhbarInput>
        name="cikis"
        label="İşten çıkış tarihi"
        help="İş sözleşmesinin feshedildiği, çalıştığınız son gün."
      />
      <NumberField<IhbarInput>
        name="brut"
        label="Son brüt maaş"
        unit="₺"
        placeholder="Örn. 45.000"
        help="Vergi ve SGK kesintilerinden önceki aylık ücretiniz; bordroda “brüt ücret” olarak yazar."
      />
      <NumberField<IhbarInput>
        name="yanHaklar"
        label="Aylık yan haklar (brüt)"
        unit="₺"
        placeholder="Örn. 3.000"
        help="Düzenli ödenen yemek, yol, ikramiye gibi ödemelerin aylık brüt karşılığı. İhbar tazminatı da giydirilmiş ücretle hesaplanır."
        hint="Yoksa 0 bırakın."
      />
      <NumberField<IhbarInput>
        name="kumMatrah"
        label="Bu yılki kümülatif vergi matrahı"
        unit="₺"
        placeholder="Örn. 250.000"
        className="sm:col-span-2"
        help="Ocak'tan bu yana ödenen ücretlerinizin gelir vergisi matrahları toplamı. Son bordronuzda “kümülatif vergi matrahı” olarak yazar; vergi dilimini belirler."
        hint="Bilmiyorsanız 0 bırakın (en düşük dilimden hesaplanır)."
      />
    </CalculatorLayout>
  );
}
