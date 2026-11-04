import { CalculatorLayout, type Source } from '@/components/calc/CalculatorLayout';
import { DateField, NumberField } from '@/components/calc/fields';
import type { ResultView } from '@/components/calc/ResultCard';
import { addDays } from '@/calculators/common';
import { calculateGebelik, gebelikSchema, type GebelikInput, type TaramaDurum } from '@/calculators/gebelik';
import { todayISO } from '@/config/period';
import { dateLong, dateTR, num } from '@/lib/format';
import content from './content.md';

const defaults: Partial<GebelikInput> = { dongu: 28 };
const example: GebelikInput = { sat: addDays(todayISO(), -84), dongu: 28 };

const sources: Source[] = [
  {
    label: 'ACOG/AIUM/SMFM — Committee Opinion 700: Methods for Estimating the Due Date (2017)',
    url: 'https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2017/05/methods-for-estimating-the-due-date',
  },
  {
    label: 'DSÖ — Recommendations on antenatal care for a positive pregnancy experience (2016)',
    url: 'https://www.who.int/publications/i/item/9789241549912',
  },
  {
    label: 'ACOG — Prenatal Genetic Screening Tests (hasta bilgilendirme)',
    url: 'https://www.acog.org/womens-health/faqs/prenatal-genetic-screening-tests',
  },
  {
    label: 'ACOG — Practice Bulletin 190: Gestational Diabetes Mellitus',
    url: 'https://www.acog.org/clinical/clinical-guidance/practice-bulletin/articles/2018/02/gestational-diabetes-mellitus',
  },
  {
    label: 'ACOG — Committee Opinion 797: Prevention of Group B Streptococcal Early-Onset Disease in Newborns',
    url: 'https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2020/02/prevention-of-group-b-streptococcal-early-onset-disease-in-newborns',
  },
  {
    label: 'T.C. Sağlık Bakanlığı — Doğum Öncesi Bakım Yönetim Rehberi (2018)',
    url: 'https://platform.who.int/docs/default-source/mca-documents/policy-documents/guideline/TUR-MN-21-01-GUIDELINE-2018-tur-Antenatal-Care-Management-Guidelines.pdf',
  },
];

const durumMetni: Record<TaramaDurum, string> = { gecti: '✓ Geçti', simdi: '● Şu an', gelecek: '○ Yaklaşıyor' };

function present(v: Parameters<typeof calculateGebelik>[0]): ResultView {
  const r = calculateGebelik(v);
  const kalan =
    r.kalanGun > 0
      ? `${num(r.kalanGun, 0)} gün (${Math.floor(r.kalanGun / 7)} hafta ${r.kalanGun % 7} gün)`
      : r.kalanGun === 0
        ? 'Bugün'
        : `${num(-r.kalanGun, 0)} gün geçti`;
  return {
    main: {
      label: 'Gebelik haftanız',
      value: `${r.hafta} hafta ${r.gunArti} gün`,
      caption: `${r.trimester}. trimester · ${r.hafta + 1}. gebelik haftasındasınız`,
    },
    status:
      r.hafta >= 41
        ? { tone: 'warn', text: 'Tahmini doğum tarihi geçti. 41. haftadan sonra doktorunuzun yakın takibi önemlidir.' }
        : r.hafta >= 37
          ? { tone: 'ok', text: 'Miat dönemindesiniz (37+0 hafta ve sonrası). Doğum her an başlayabilir.' }
          : {
              tone: 'info',
              text: `Tahmini doğum tarihiniz ${dateLong(r.tdt)}. Bebeklerin yalnız küçük bir kısmı tam bu günde doğar.`,
            },
    rows: [
      { label: 'Tahmini doğum tarihi', value: dateTR(r.tdt), tone: 'total' },
      { label: 'Doğuma kalan süre', value: kalan },
      { label: 'Trimester', value: `${r.trimester}. trimester` },
      { label: 'Tahmini döllenme tarihi', value: dateTR(r.dollenme), tone: 'muted', hint: 'Yaklaşık; ±2-3 gün sapabilir' },
      ...(v.dongu !== 28
        ? [{ label: 'Döngü düzeltmesi', value: `${v.dongu - 28 > 0 ? '+' : ''}${v.dongu - 28} gün`, tone: 'muted' as const }]
        : []),
    ],
    table: {
      caption: 'Önemli tarama ve muayene haftaları',
      columns: ['Hafta', 'Tarama / muayene', 'Tarih aralığı', 'Durum'],
      rows: r.taramalar.map((t) => [
        t.from === t.to ? `${t.from}. hafta` : `${t.from}–${t.to}. hafta`,
        t.ad,
        `${dateTR(t.baslangic)} – ${dateTR(t.bitis)}`,
        durumMetni[t.durum],
      ]),
    },
    notes: [
      'Hesap son adet tarihine (Naegele kuralı) dayanır. İlk trimester ultrasonundaki ölçüm farklı bir tarih gösterirse doktorunuzun belirlediği tarih esas alınır. Tarama haftaları genel bir çerçevedir; takvimi doktorunuz belirler.',
    ],
  };
}

export default function GebelikHaftasiPage() {
  return (
    <CalculatorLayout
      slug="gebelik-haftasi-hesaplama"
      schema={gebelikSchema}
      defaults={defaults}
      example={example}
      compute={present}
      content={content}
      sources={sources}
      emptyHint="Son adet döneminizin ilk gününü girdiğiniz anda gebelik haftanız ve tahmini doğum tarihiniz hesaplanır."
    >
      <DateField<GebelikInput>
        name="sat"
        label="Son adet tarihi (ilk gün)"
        help="Son adet kanamanızın başladığı ilk gün. Gebelik haftası, döllenmeden değil bu tarihten itibaren sayılır."
        fromYear={new Date().getFullYear() - 1}
      />
      <NumberField<GebelikInput>
        name="dongu"
        label="Ortalama döngü süresi"
        unit="gün"
        decimals={0}
        help="Bir adet kanamasının ilk gününden bir sonrakinin ilk gününe kadar geçen gün sayısı. Bilmiyorsanız 28 bırakın."
        hint="Genellikle 21–35 gün; bilmiyorsanız 28"
      />
    </CalculatorLayout>
  );
}
