import { CalculatorLayout } from '@/components/calc/CalculatorLayout';
import { ChoiceField, NumberField, SwitchField } from '@/components/calc/fields';
import type { ResultView } from '@/components/calc/ResultCard';
import { calculateTapuHarci, tapuHarciSchema, type TapuHarciInput, type TapuHarciValues } from '@/calculators/tapuHarci';
import { num, pct, tl } from '@/lib/format';
import content from './content.md';

const defaults: Partial<TapuHarciInput> = { emlakDegeri: 0, odeme: 'ayri', katsayi: 1, adet: 1, bagimsizBolum: true };
const example: TapuHarciInput = {
  bedel: 3000000,
  emlakDegeri: 1800000,
  odeme: 'ayri',
  katsayi: 1,
  adet: 1,
  bagimsizBolum: true,
};

function present(v: TapuHarciValues): ResultView {
  const r = calculateTapuHarci(v);
  const tumuAlici = v.odeme === 'alici';
  const donerHint = v.bagimsizBolum
    ? `${v.adet} bağımsız bölüm × ${tl(r.donerIlk)}`
    : v.adet > 1
      ? `${tl(r.donerIlk)} + ${v.adet - 1} ilave taşınmaz × ${tl(r.donerIlave)}`
      : `Gösterge × yöresel katsayı (${num(v.katsayi, 2)})`;
  return {
    main: {
      label: 'Toplam tapu masrafı',
      value: tl(r.genelToplam),
      caption: `Alıcı ${tl(r.aliciToplam)} · Satıcı ${tl(r.saticiToplam)}`,
    },
    status: r.matrahEmlakDegeri
      ? {
          tone: 'warn',
          text: `Beyan ettiğiniz bedel emlak vergisi değerinin altında; harç ${tl(r.matrah)} emlak vergisi değeri üzerinden hesaplandı. Düşük beyan, eksik harcın bir katı vergi ziyaı cezasına yol açar.`,
        }
      : { tone: 'ok', text: `Harç, beyan edilen satış bedeli (${tl(r.matrah)}) üzerinden hesaplandı.` },
    rows: [
      { label: 'Harca esas değer', value: tl(r.harcMatrahi), hint: '10 TL’ye kadar kesirler dikkate alınmaz' },
      { label: `Alıcı payı tapu harcı (${pct(r.aliciOran)})`, value: tl(r.aliciHarc) },
      { label: `Satıcı payı tapu harcı (${pct(r.saticiOran)})`, value: tl(r.saticiHarc) },
      { label: 'Toplam tapu harcı', value: tl(r.toplamHarc), tone: 'total' },
      { label: 'Döner sermaye ücreti (KDV dahil)', value: tl(r.doner), hint: donerHint },
      {
        label: 'Alıcının ödeyeceği',
        value: tl(r.aliciToplam),
        tone: 'total',
        hint: tumuAlici ? 'Harcın tamamı + döner sermaye' : 'Alıcı harcı + döner sermaye',
      },
      {
        label: 'Satıcının ödeyeceği',
        value: tl(r.saticiToplam),
        tone: 'total',
        hint: tumuAlici ? 'Anlaşma gereği harcın tamamını alıcı üstlendi' : 'Satıcı harcı',
      },
    ],
    notes: [
      'Döner sermaye ücreti uygulamada alıcı tarafından ödenir. Yöresel katsayı il ve ilçeye göre 0,30–3,00 arasındadır; tapu müdürlüğünden veya Web Tapu’daki ön başvuru ekranından öğrenebilirsiniz.',
      'Tapu harcı alım ve satım için ayrı ayrı doğar; taraflar kendi aralarında harcın tamamını birinin ödemesini kararlaştırabilir, ancak tapu müdürlüğüne karşı her iki taraf da sorumludur.',
    ],
  };
}

export default function TapuHarciPage() {
  return (
    <CalculatorLayout
      slug="tapu-harci-hesaplama"
      schema={tapuHarciSchema}
      defaults={defaults}
      example={example}
      compute={present}
      content={content}
      emptyHint="Satış bedelini girdiğiniz anda alıcı ve satıcı tapu harcı ile döner sermaye ücreti hesaplanır."
    >
      <NumberField<TapuHarciInput>
        name="bedel"
        label="Satış bedeli (beyan edilen)"
        unit="₺"
        placeholder="Örn. 3.000.000"
        help="Tapu müdürlüğüne beyan edilecek gerçek satış bedeli. Gerçek bedelin altında beyan cezaya yol açar."
      />
      <NumberField<TapuHarciInput>
        name="emlakDegeri"
        label="Emlak vergisi değeri (isteğe bağlı)"
        unit="₺"
        placeholder="Örn. 1.800.000"
        help="Taşınmazın belediyedeki güncel emlak vergisi (rayiç) değeri. Harç matrahı bu değerden düşük olamaz; belediyeden veya e-Devlet’ten öğrenebilirsiniz."
        hint="Bilmiyorsanız boş bırakın."
      />
      <ChoiceField<TapuHarciInput>
        name="odeme"
        label="Harcı kim ödeyecek?"
        className="sm:col-span-2"
        options={[
          { value: 'ayri', label: 'Alıcı ve satıcı ayrı' },
          { value: 'alici', label: 'Tamamını alıcı öder' },
        ]}
        help="Kanuna göre alıcı ve satıcı ayrı ayrı binde 20 öder. Uygulamada harcın tamamının alıcıya bırakılması sık görülür."
      />
      <NumberField<TapuHarciInput>
        name="katsayi"
        label="Yöresel katsayı"
        decimals={2}
        placeholder="Örn. 1"
        help="Döner sermaye ücretinin çarpıldığı, il/ilçeye göre belirlenen katsayı (0,30–3,00). Tapu müdürlüğü veya Web Tapu üzerinden öğrenilir."
        hint="Bilmiyorsanız 1 bırakın."
      />
      <NumberField<TapuHarciInput>
        name="adet"
        label="Taşınmaz / bağımsız bölüm sayısı"
        decimals={0}
        placeholder="Örn. 1"
        help="Aynı işlemde devredilen taşınmaz sayısı. Toplam bedel tüm taşınmazların bedelidir."
      />
      <SwitchField<TapuHarciInput>
        name="bagimsizBolum"
        label="Kat mülkiyetli / kat irtifaklı bağımsız bölüm"
        className="sm:col-span-2"
        help="Daire, dükkân gibi bağımsız bölümlerde her bölüm için tam döner sermaye ücreti alınır. Arsa, tarla gibi diğer taşınmazlarda ilave her taşınmaz için daha düşük ilave ücret uygulanır."
      />
    </CalculatorLayout>
  );
}
