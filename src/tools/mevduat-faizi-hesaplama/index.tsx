import { useWatch } from 'react-hook-form';
import { CalculatorLayout } from '@/components/calc/CalculatorLayout';
import { DateField, NumberField, SwitchField } from '@/components/calc/fields';
import type { ResultView } from '@/components/calc/ResultCard';
import { calculateMevduat, mevduatSchema, type MevduatInput, type MevduatValues, type StopajDilimi } from '@/calculators/mevduat';
import { todayISO } from '@/config/period';
import { dateTR, num, pct, tl } from '@/lib/format';
import content from './content.md';

const defaults: Partial<MevduatInput> = { acilis: todayISO(), gun: 32, yenile: false, donem: 4 };
const example: MevduatInput = { anapara: 100000, oran: 40, gun: 32, acilis: todayISO(), yenile: false, donem: 4 };

const DILIM_AD: Record<StopajDilimi, string> = {
  alti6: '6 aya kadar vadeli',
  yil1: '1 yıla kadar vadeli',
  uzun: '1 yıldan uzun vadeli',
};

function present(v: MevduatValues): ResultView {
  const r = calculateMevduat(v);
  const d = r.donemler;
  return {
    main: {
      label: 'Net faiz getirisi',
      value: tl(r.netFaiz),
      caption: `${v.gun} gün sonunda ${tl(r.vadeSonuTutar)} · vade sonu ${dateTR(r.vadeSonu)}`,
    },
    status: {
      tone: 'info',
      text: `${DILIM_AD[r.dilim]} hesap: ${dateTR(v.acilis)} açılış tarihine göre ${pct(r.stopajOran)} stopaj uygulandı.`,
    },
    rows: [
      { label: 'Anapara', value: tl(v.anapara) },
      { label: 'Brüt faiz', value: tl(r.brutFaiz), tone: 'plus', hint: `${tl(v.anapara)} × %${num(v.oran, 4)} × ${v.gun} / 365` },
      { label: `Stopaj (${pct(r.stopajOran)})`, value: tl(r.stopaj), tone: 'minus' },
      { label: 'Net faiz', value: tl(r.netFaiz), tone: 'total' },
      { label: 'Vade sonu toplam', value: tl(r.vadeSonuTutar), tone: 'total' },
      { label: 'Net yıllık getiri oranı', value: pct(r.netYillik), tone: 'muted', hint: 'Net faizin yıllık basit karşılığı' },
      ...(d
        ? [
            {
              label: `${d.length} dönem sonunda bakiye`,
              value: tl(r.sonBakiye!),
              tone: 'total' as const,
              hint: `${dateTR(d[d.length - 1].vadeSonu)} itibarıyla; toplam net faiz ${tl(r.toplamNetFaiz!)}`,
            },
            { label: 'Bileşik net yıllık getiri', value: pct(r.efektifYillik!), tone: 'muted' as const },
          ]
        : []),
    ],
    notes: [
      'Stopaj, mevduatın açıldığı veya yenilendiği tarihte geçerli orandan kesilir; “6 aya kadar” ve “1 yıla kadar” dilimleri takvim ayına göre belirlenir. Kesin dilim için bankanızın hesap cüzdanına bakın.',
      ...(d
        ? ['Yenileme tablosunda faiz oranının her dönem aynı kaldığı varsayıldı; bankalar yenilemede o günün oranını uygular.']
        : []),
    ],
    table: d && {
      caption: 'Vade sonunda yenileme (bileşik getiri)',
      columns: ['Dönem', 'Açılış', 'Vade sonu', 'Anapara', 'Brüt faiz', 'Stopaj', 'Net faiz', 'Bakiye'],
      rows: d.map((p) => [
        String(p.donem),
        dateTR(p.acilis),
        dateTR(p.vadeSonu),
        tl(p.anapara),
        tl(p.brutFaiz),
        `${tl(p.stopaj)} (${pct(p.stopajOran)})`,
        tl(p.netFaiz),
        tl(p.bakiye),
      ]),
      footer: [
        'Toplam',
        '',
        '',
        '',
        tl(d.reduce((s, p) => s + p.brutFaiz, 0)),
        tl(d.reduce((s, p) => s + p.stopaj, 0)),
        tl(r.toplamNetFaiz!),
        tl(r.sonBakiye!),
      ],
    },
  };
}

function Fields() {
  const yenile = useWatch<MevduatInput, 'yenile'>({ name: 'yenile' });
  return (
    <>
      <NumberField<MevduatInput>
        name="anapara"
        label="Anapara"
        unit="₺"
        placeholder="Örn. 100.000"
        help="Vadeli hesaba yatıracağınız Türk lirası tutar."
      />
      <NumberField<MevduatInput>
        name="oran"
        label="Yıllık brüt faiz oranı"
        unit="%"
        decimals={4}
        placeholder="Örn. 40"
        help="Bankanın ilan ettiği yıllık brüt (stopaj öncesi) faiz oranı."
      />
      <NumberField<MevduatInput>
        name="gun"
        label="Vade"
        unit="gün"
        decimals={0}
        placeholder="Örn. 32"
        help="Paranızın vadeli hesapta kalacağı gün sayısı."
        hint="Sık kullanılan vadeler: 32, 46, 92, 181 ve 365 gün."
      />
      <DateField<MevduatInput>
        name="acilis"
        label="Hesap açılış / yenileme tarihi"
        help="Stopaj oranı, hesabın açıldığı veya vadesinin yenilendiği tarihte geçerli orandır."
      />
      <SwitchField<MevduatInput>
        name="yenile"
        label="Vade sonunda yenile"
        className="sm:col-span-2"
        help="Her vade sonunda net faiz anaparaya eklenerek aynı vade ve oranla yeniden bağlanırsa oluşacak bileşik getiriyi gösterir."
      />
      {yenile && (
        <NumberField<MevduatInput>
          name="donem"
          label="Dönem sayısı"
          decimals={0}
          placeholder="Örn. 4"
          help="Vadenin kaç kez art arda yenileneceği (ilk dönem dahil)."
        />
      )}
    </>
  );
}

export default function MevduatFaiziPage() {
  return (
    <CalculatorLayout
      slug="mevduat-faizi-hesaplama"
      schema={mevduatSchema}
      defaults={defaults}
      example={example}
      compute={present}
      content={content}
      emptyHint="Anaparayı, yıllık faiz oranını ve vadeyi girdiğiniz anda stopaj sonrası net getiriniz hesaplanır."
    >
      <Fields />
    </CalculatorLayout>
  );
}
