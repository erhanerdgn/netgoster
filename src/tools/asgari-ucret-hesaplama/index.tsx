import { CalculatorLayout } from '@/components/calc/CalculatorLayout';
import { ChoiceField, DateField } from '@/components/calc/fields';
import type { ResultView } from '@/components/calc/ResultCard';
import { asgariUcretSchema, calculateAsgariUcret, type AsgariUcretInput } from '@/calculators/asgariUcret';
import { isKanunu } from '@/config/parameters-2026';
import { todayISO } from '@/config/period';
import { monthNames, tl } from '@/lib/format';
import { tesvikSecenekleri } from '@/calculators/bordro';
import content from './content.md';

const defaults: Partial<AsgariUcretInput> = { tarih: todayISO(), tesvik: 'yok' };
const example: AsgariUcretInput = { tarih: todayISO(), tesvik: 'genel' };

const tesvikOptions = tesvikSecenekleri(todayISO());

function present(v: Parameters<typeof calculateAsgariUcret>[0]): ResultView {
  const r = calculateAsgariUcret(v);
  const b = r.bordro;
  return {
    main: { label: 'Net asgari ücret', value: tl(b.net), caption: `${monthNames[r.ay - 1]} ${r.yil} · brüt ${tl(b.brut)}` },
    status: {
      tone: 'ok',
      text: 'Asgari ücret gelir vergisi ve damga vergisinden istisnadır; yalnız SGK ve işsizlik primi kesilir.',
    },
    rows: [
      { label: 'Brüt asgari ücret', value: tl(b.brut) },
      { label: 'SGK işçi payı', value: tl(b.sgkIsci), tone: 'minus' },
      { label: 'İşsizlik sigortası işçi payı', value: tl(b.issizlikIsci), tone: 'minus' },
      { label: 'Gelir vergisi', value: tl(b.gv), tone: 'muted', hint: `Hesaplanan ${tl(b.gvHesaplanan)}, tamamı istisna` },
      { label: 'Damga vergisi', value: tl(b.dv), tone: 'muted', hint: `Hesaplanan ${tl(b.dvHesaplanan)}, tamamı istisna` },
      { label: 'Net asgari ücret', value: tl(b.net), tone: 'total' },
      { label: 'Günlük brüt / net', value: `${tl(r.brutGunluk)} / ${tl(r.netGunluk)}`, tone: 'muted' },
      {
        label: 'Saatlik brüt / net',
        value: `${tl(r.brutSaatlik)} / ${tl(r.netSaatlik)}`,
        tone: 'muted',
        hint: `Aylık ${isKanunu.aylikSaat} saat`,
      },
      { label: 'Yıllık brüt / net', value: `${tl(r.yillikBrut)} / ${tl(r.yillikNet)}`, tone: 'muted' },
      { label: 'SGK işveren payı', value: tl(b.sgkIsveren), tone: 'plus' },
      { label: 'İşsizlik sigortası işveren payı', value: tl(b.issizlikIsveren), tone: 'plus' },
      ...(b.hazineIndirimi > 0 ? [{ label: 'Hazine indirimi', value: tl(b.hazineIndirimi), tone: 'minus' as const }] : []),
      { label: 'İşverene toplam maliyet', value: tl(b.maliyet), tone: 'total' },
      ...(r.destek > 0
        ? [
            {
              label: 'Asgari ücret desteği sonrası',
              value: tl(r.destekliMaliyet),
              tone: 'muted' as const,
              hint: `Şartları sağlayan işverene aylık ${tl(r.destek)} destek`,
            },
          ]
        : []),
      { label: 'Yıllık işveren maliyeti', value: tl(r.yillikMaliyet), tone: 'muted' },
    ],
    notes: [
      'Asgari ücret desteği prim borcundan mahsup edilir; işyerinin borcunun olmaması gibi şartlara bağlıdır, toplam maliyete otomatik dahil edilmez.',
    ],
  };
}

export default function AsgariUcretPage() {
  return (
    <CalculatorLayout
      slug="asgari-ucret-hesaplama"
      schema={asgariUcretSchema}
      defaults={defaults}
      example={example}
      compute={present}
      content={content}
      emptyHint="Dönemi seçtiğiniz anda asgari ücretin net tutarı ve işverene maliyeti hesaplanır."
    >
      <DateField<AsgariUcretInput>
        name="tarih"
        label="Dönem"
        help="Hangi tarihteki asgari ücretin hesaplanacağı. Asgari ücret ve prim oranları bu tarihe göre seçilir."
      />
      <ChoiceField<AsgariUcretInput>
        name="tesvik"
        label="İşveren teşviki"
        options={tesvikOptions}
        help="Hazine indirimi: borcu olmayan özel sektör işverenine SGK işveren payında puan indirimi. İmalat sektöründe (NACE C) indirim daha yüksektir."
      />
    </CalculatorLayout>
  );
}
