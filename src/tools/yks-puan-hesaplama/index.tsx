import { CalculatorLayout } from '@/components/calc/CalculatorLayout';
import { NumberField, SwitchField } from '@/components/calc/fields';
import type { ResultRow, ResultView } from '@/components/calc/ResultCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { calculateYks, yksSchema, type YksInput } from '@/calculators/yks';
import { yks, type Test } from '@/config/sinavlar';
import { num } from '@/lib/format';
import { DYTable, hasAnswer } from './DYTable';
import content from './content.md';

const schema = yksSchema.refine((v) => hasAnswer(v.dy), {
  path: ['dy'],
  message: 'En az bir testin doğru/yanlış sayısını girin',
});

const pick = (...keys: string[]) => yks.ayt.filter((t) => keys.includes(t.key));
const aytGroups: { caption: string; tests: Test[] }[] = [
  { caption: 'Türk Dili ve Edebiyatı – Sosyal Bilimler-1', tests: pick('aytEdebiyat', 'aytTarih1', 'aytCografya1') },
  { caption: 'Sosyal Bilimler-2', tests: pick('aytTarih2', 'aytCografya2', 'aytFelsefe', 'aytDin') },
  { caption: 'Matematik', tests: pick('aytMat') },
  { caption: 'Fen Bilimleri', tests: pick('aytFizik', 'aytKimya', 'aytBiyoloji') },
];
const allTests: Test[] = [...yks.tyt, ...yks.ayt, yks.ydt];

const defaults: Partial<YksInput> = { dy: {}, yerlesti: false };
const example: YksInput = {
  dy: {
    tytTurkce: { d: 32, y: 6 },
    tytSosyal: { d: 14, y: 4 },
    tytMat: { d: 28, y: 8 },
    tytFen: { d: 12, y: 4 },
    aytEdebiyat: { d: 18, y: 4 },
    aytTarih1: { d: 6, y: 2 },
    aytCografya1: { d: 4, y: 1 },
    aytMat: { d: 22, y: 8 },
    aytFizik: { d: 7, y: 3 },
    aytKimya: { d: 6, y: 3 },
    aytBiyoloji: { d: 8, y: 2 },
  },
  diploma: 86.5,
  yerlesti: false,
};

const p3 = (n: number) => num(n, 3, 3);
const sartlar: Record<string, string> = {
  TYT: 'Türkçe veya Temel Matematik testinden en az 0,5 net',
  SAY: 'AYT Matematik veya Fen Bilimleri testinden en az 0,5 net',
  EA: 'TDE–Sosyal-1 veya Matematik testinden en az 0,5 net',
  SÖZ: 'TDE–Sosyal-1 veya Sosyal Bilimler-2 testinden en az 0,5 net',
  DİL: 'YDT’den en az 0,5 net',
};

function present(v: Parameters<typeof calculateYks>[0]): ResultView {
  const r = calculateYks(v);
  const ok = r.puanlar.filter((p) => p.hesaplandi);
  const tytOk = ok.some((p) => p.tur === 'TYT');
  const table = {
    caption: 'Net dökümü',
    columns: ['Test', 'Doğru', 'Yanlış', 'Net'],
    rows: allTests
      .filter((t) => v.dy[t.key].d + v.dy[t.key].y > 0)
      .map((t) => [t.label, String(v.dy[t.key].d), String(v.dy[t.key].y), num(r.netler[t.key], 2, 2)]),
  };
  const notes = [
    `Tahmini: katsayılar ${yks.year - 1} YKS sonuçlarından türetilmiştir; ÖSYM standart puan kullandığı için gerçek puanınız birkaç puan farklı olabilir.`,
    'Sıralama tahmini yapılmaz; puanlar adayların genel başarısına göre her yıl değişir.',
  ];
  if (!tytOk) {
    return {
      main: { label: 'Tahmini YKS puanı', value: 'Hesaplanmadı', caption: `TYT net: ${num(r.tytNet, 2)}` },
      status: { tone: 'warn', text: `TYT puanı hesaplanmaz: ${sartlar.TYT} gerekir. AYT puanları da TYT puanına bağlıdır.` },
      table,
      notes,
    };
  }
  // Manşet: lisans puan türlerinin en yükseği (TYT yalnız önlisans için kullanıldığından yalnızca başka tür yoksa)
  const alan = ok.filter((p) => p.tur !== 'TYT');
  const best = [...(alan.length ? alan : ok)].sort((a, b) => (b.yerlestirme ?? b.ham) - (a.yerlestirme ?? a.ham))[0];
  const yer = best.yerlestirme !== null;
  const eksik = r.puanlar.filter((p) => !p.hesaplandi).map((p) => p.tur);
  const rows: ResultRow[] = r.puanlar.map((p) =>
    p.hesaplandi
      ? {
          label: `${p.tur} puanı`,
          value: p3(p.yerlestirme ?? p.ham),
          hint: p.yerlestirme !== null ? `Ham: ${p3(p.ham)} · OBP ile yerleştirme puanı` : 'Ham puan (diploma notu girilmedi)',
        }
      : { label: `${p.tur} puanı`, value: 'Hesaplanmadı', tone: 'muted', hint: sartlar[p.tur] },
  );
  rows.push(
    { label: 'TYT toplam net', value: num(r.tytNet, 2), tone: 'muted' },
    { label: 'AYT toplam net', value: num(r.aytNet, 2), tone: 'muted' },
  );
  if (r.obp !== null)
    rows.push({
      label: 'OBP katkısı',
      value: `+${p3(r.obpKatkisi!)}`,
      tone: 'plus',
      hint: `OBP ${num(r.obp, 2)} × ${num(v.yerlesti ? yks.obpFactorPlaced : yks.obpFactor, 2)}`,
    });
  return {
    main: {
      label: `En yüksek tahmini ${yer ? 'yerleştirme' : 'ham'} puanı (${best.tur})`,
      value: p3(yer ? best.yerlestirme! : best.ham),
      caption: `Tahmini · ${yks.year - 1} YKS verisine dayalı katsayılar`,
    },
    status: eksik.length
      ? { tone: 'info', text: `${eksik.join(', ')} puanı hesaplanmadı: ilgili testlerden en az 0,5 net gerekir.` }
      : { tone: 'ok', text: 'Tüm puan türleri hesaplandı.' },
    rows,
    table,
    notes,
  };
}

export default function YksPuanPage() {
  return (
    <CalculatorLayout
      slug="yks-puan-hesaplama"
      schema={schema}
      defaults={defaults}
      example={example}
      compute={present}
      content={content}
      emptyHint="TYT ve AYT doğru-yanlış sayılarınızı girdikçe netleriniz ve tahmini puanlarınız hesaplanır."
    >
      <Tabs defaultValue="tyt" className="sm:col-span-2">
        <TabsList className="w-full">
          <TabsTrigger value="tyt">TYT</TabsTrigger>
          <TabsTrigger value="ayt">AYT</TabsTrigger>
          <TabsTrigger value="ydt">YDT</TabsTrigger>
        </TabsList>
        {/* forceMount: gizli sekmedeki alanlar da kayıtlı kalsın, hata olduğunda odaklanabilsin */}
        <TabsContent value="tyt" forceMount className="pt-2 data-[state=inactive]:hidden">
          <DYTable tests={yks.tyt} penalty={yks.wrongPenalty} caption="Temel Yeterlilik Testi (120 soru)" />
        </TabsContent>
        <TabsContent value="ayt" forceMount className="space-y-5 pt-2 data-[state=inactive]:hidden">
          {aytGroups.map((g) => (
            <DYTable key={g.caption} tests={g.tests} penalty={yks.wrongPenalty} caption={g.caption} />
          ))}
        </TabsContent>
        <TabsContent value="ydt" forceMount className="pt-2 data-[state=inactive]:hidden">
          <DYTable tests={[yks.ydt]} penalty={yks.wrongPenalty} caption="Yabancı Dil Testi (DİL puanı için)" />
        </TabsContent>
      </Tabs>
      <NumberField<YksInput>
        name="diploma"
        label="Diploma notu"
        placeholder="Örn. 85,40"
        help="Lise diploma notunuz (100’lük). OBP = diploma notu × 5 olarak hesaplanır ve yerleştirme puanına eklenir."
        hint="Boş bırakırsanız yalnız ham puan gösterilir."
      />
      <SwitchField<YksInput>
        name="yerlesti"
        label={`${yks.year - 1}’te bir programa yerleştim`}
        help={`Bir önceki yıl (${yks.year - 1}) merkezî yerleştirmeyle bir yükseköğretim programına yerleştiyseniz OBP katsayısı 0,12 yerine 0,06 uygulanır.`}
        className="self-end"
      />
    </CalculatorLayout>
  );
}
