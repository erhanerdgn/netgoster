import { CalculatorLayout, type Source } from '@/components/calc/CalculatorLayout';
import { NumberField, SwitchField } from '@/components/calc/fields';
import type { ResultView } from '@/components/calc/ResultCard';
import { calculateVki, VKI_SINIFLARI, vkiSchema, type VkiInput } from '@/calculators/vki';
import { num } from '@/lib/format';
import content from './content.md';

const defaults: Partial<VkiInput> = { cocuk: false };
const example: VkiInput = { boy: 170, kilo: 72, cocuk: false };

const sources: Source[] = [
  {
    label: 'DSÖ — Obesity and overweight (bilgi notu)',
    url: 'https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight',
  },
  {
    label: 'DSÖ Küresel Sağlık Gözlemevi — Body mass index (BMI)',
    url: 'https://www.who.int/data/gho/data/themes/topics/topic-details/GHO/body-mass-index',
  },
  {
    label: 'DSÖ — Obesity: preventing and managing the global epidemic (Teknik Rapor 894, 2000)',
    url: 'https://iris.who.int/handle/10665/42330',
  },
  {
    label: 'T.C. Sağlık Bakanlığı — Türkiye Beslenme Rehberi (TÜBER 2022)',
    url: 'https://hsgm.saglik.gov.tr/media/attachments/2025/05/12/turkiye-beslenme-rehberi-2022.pdf',
  },
];

const kg = (n: number) => `${num(n, 1, 1)} kg`;
const v1 = (n: number) => num(n, 1, 1);

function present(v: Parameters<typeof calculateVki>[0]): ResultView {
  const r = calculateVki(v);
  const m2 = (v.boy / 100) ** 2;
  const durum =
    r.fark > 0
      ? `Sağlıklı aralığa ulaşmak için yaklaşık ${kg(r.fark)} almanız gerekir.`
      : r.fark < 0
        ? `Sağlıklı aralığın üst sınırına inmek için yaklaşık ${kg(-r.fark)} vermeniz gerekir.`
        : 'Kilonuz boyunuza göre sağlıklı aralıkta.';
  return {
    main: {
      label: 'Vücut kitle indeksiniz',
      value: `${num(r.vki, 1, 1)} kg/m²`,
      caption: `DSÖ sınıflaması: ${r.sinif.ad}`,
    },
    status: v.cocuk
      ? {
          tone: 'warn',
          text: '18 yaş altında yetişkin VKİ sınıfları kullanılmaz; çocuk ve ergenlerde yaşa ve cinsiyete göre persentil eğrileri değerlendirilir. Çocuk doktorunuza danışın.',
        }
      : { tone: r.sinif.id === 'normal' ? 'ok' : 'warn', text: `${r.sinif.ad}. ${durum}` },
    rows: [
      { label: 'Sınıf', value: r.sinif.ad, tone: 'total' },
      { label: 'Boyunuza göre sağlıklı kilo', value: `${kg(r.saglikliMin)} – ${kg(r.saglikliMax)}` },
      {
        label: r.fark > 0 ? 'Alınması gereken' : r.fark < 0 ? 'Verilmesi gereken' : 'Aralığa uzaklık',
        value: r.fark === 0 ? '—' : kg(Math.abs(r.fark)),
        tone: r.fark === 0 ? 'muted' : r.fark > 0 ? 'plus' : 'minus',
      },
      { label: 'Hesap', value: `${num(v.kilo, 1)} ÷ ${num(v.boy / 100, 2)}²`, tone: 'muted' },
    ],
    table: {
      caption: 'DSÖ yetişkin VKİ sınıfları ve boyunuza göre kilo aralıkları',
      columns: ['Sınıf', 'VKİ (kg/m²)', 'Boyunuz için kilo', 'Durumunuz'],
      rows: VKI_SINIFLARI.map((s) => [
        s.ad,
        s.min === 0 ? `< ${v1(s.max)}` : s.max === Infinity ? `≥ ${v1(s.min)}` : `${v1(s.min)} – ${v1(s.max - 0.1)}`,
        s.min === 0
          ? `< ${kg(s.max * m2)}`
          : s.max === Infinity
            ? `≥ ${kg(s.min * m2)}`
            : `${kg(s.min * m2)} – ${kg((s.max - 0.1) * m2)}`,
        s.id === r.sinif.id ? '◀ Sizin sınıfınız' : '',
      ]),
    },
    notes: [
      'VKİ vücut yağını doğrudan ölçmez; kas kütlesi yüksek sporcularda, yaşlılarda ve gebelikte yanıltıcı olabilir. Bel çevresi gibi ek ölçümler ve hekim değerlendirmesi önerilir.',
    ],
  };
}

export default function VkiPage() {
  return (
    <CalculatorLayout
      slug="vucut-kitle-indeksi-hesaplama"
      schema={vkiSchema}
      defaults={defaults}
      example={example}
      compute={present}
      content={content}
      sources={sources}
      emptyHint="Boyunuzu ve kilonuzu girdiğiniz anda VKİ değeriniz ve sınıfınız hesaplanır."
    >
      <NumberField<VkiInput>
        name="boy"
        label="Boy"
        unit="cm"
        decimals={0}
        placeholder="Örn. 170"
        help="Ayakkabısız, dik duruşta ölçülen boyunuz (santimetre)."
      />
      <NumberField<VkiInput>
        name="kilo"
        label="Kilo"
        unit="kg"
        decimals={1}
        placeholder="Örn. 72"
        help="Sabah, aç karnına ve hafif kıyafetle tartıldığınız ağırlık (kilogram)."
      />
      <SwitchField<VkiInput>
        name="cocuk"
        label="18 yaşından küçüğüm"
        help="Yetişkin VKİ sınıfları 18 yaş altında geçerli değildir; çocuklarda yaşa göre persentil eğrileri kullanılır."
        className="sm:col-span-2"
      />
    </CalculatorLayout>
  );
}
