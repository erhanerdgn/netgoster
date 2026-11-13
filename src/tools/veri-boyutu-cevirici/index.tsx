import { useWatch } from 'react-hook-form';
import { CalculatorLayout, type Source } from '@/components/calc/CalculatorLayout';
import { ChoiceField, NumberField, SelectField } from '@/components/calc/fields';
import type { ResultRow, ResultView } from '@/components/calc/ResultCard';
import {
  birimSecenekleri,
  cevir,
  cevirTumu,
  degerTR,
  indirmeSuresi,
  sayiTR,
  sureTR,
  veriHedef,
  veriSchema,
  type VeriInput,
  type VeriValues,
} from '@/calculators/birim';
import { num } from '@/lib/format';
import content from './content.md';

const defaults: Partial<VeriInput> = { mod: 'boyut', deger: 1, birim: 'TB', sistem: 'iec', hiz: 100 };
const example: VeriInput = { mod: 'indirme', deger: 5, birim: 'GB', sistem: 'si', hiz: 100 };

const sources: Source[] = [
  { label: 'NIST — Prefixes for binary multiples (IEC ikili ön ekleri)', url: 'https://physics.nist.gov/cuu/Units/binary.html' },
  { label: 'BIPM — SI Broşürü (SI ön ekleri: kilo = 1000)', url: 'https://www.bipm.org/en/publications/si-brochure' },
];

/** Ağ protokolü (TCP/IP) ve kablosuz bağlantı payı için kaba tahmin; gerçek verim bağlantıya göre değişir. */
const AG_VERIMI = 0.9;

function present(v: VeriValues): ResultView {
  const r = cevirTumu('veri', v.deger, v.birim);
  const kaynak = r.find((k) => k.id === v.birim)!;
  if (v.mod === 'indirme') {
    const hiz = v.hiz!;
    const sn = indirmeSuresi(cevir('veri', v.deger, v.birim, 'B'), hiz);
    return {
      main: {
        label: `${degerTR(kaynak)} dosya, ${num(hiz)} Mbps ile`,
        value: sureTR(sn),
        caption: 'ideal koşulda indirme süresi',
      },
      rows: [
        { label: 'Formül', value: 'Süre = boyut (bit) ÷ hız (bit/sn)', tone: 'muted' },
        { label: 'Dosya boyutu (megabit)', value: `${sayiTR(cevir('veri', v.deger, v.birim, 'bit') / 1e6)} Mb` },
        { label: 'İndirme hızı (megabayt/sn)', value: `${sayiTR(hiz / 8)} MB/s` },
        { label: 'İdeal süre', value: `${sureTR(sn)} (${sayiTR(sn, 5)} sn)` },
        {
          label: `Gerçekçi tahmin (%${AG_VERIMI * 100} verim)`,
          value: sureTR(sn / AG_VERIMI),
          tone: 'total',
          hint: 'Protokol payı ve kablosuz bağlantı kayıpları için kaba tahmin.',
        },
      ],
      notes: [
        'İnternet hızı megabit/saniye (Mbps), dosya boyutu megabayt (MB) ile verilir: 1 bayt = 8 bit, bu yüzden 100 Mbps en fazla 12,5 MB/s eder.',
      ],
    };
  }
  const hedef = veriHedef(v.deger, v.birim, v.sistem);
  const ana = r.find((k) => k.id === hedef)!;
  const rows: ResultRow[] = r
    .filter((k) => k.id !== v.birim && (!k.grup || k.grup === v.sistem))
    .map((k) => ({ label: k.ad, value: degerTR(k), tone: k.id === ana.id ? 'total' : undefined }));
  const windows = kaynak.grup === 'si' && ana.grup === 'iec';
  return {
    main: {
      label: `${degerTR(kaynak)} kaç ${ana.sembol}?`,
      value: degerTR(ana, 6),
      caption: windows ? `Windows bunu “${sayiTR(ana.deger, 5)} ${ana.sembol.replace('i', '')}” olarak gösterir` : undefined,
    },
    rows,
    notes: [
      v.sistem === 'si'
        ? 'SI (ondalık) ön ekler: 1 kB = 1000 B, 1 GB = 10⁹ B. Disk ve USB bellek üreticileri, ağ hızları ve macOS bu sistemi kullanır.'
        : 'IEC (ikili) ön ekler: 1 KiB = 1024 B, 1 GiB = 2³⁰ B. Windows bu değerleri “KB, MB, GB” etiketiyle gösterir; RAM de ikili katlarla üretilir.',
    ],
  };
}

function Fields() {
  const mod = useWatch<VeriInput, 'mod'>({ name: 'mod' }) ?? 'boyut';
  const indirme = mod === 'indirme';
  return (
    <>
      <ChoiceField<VeriInput>
        name="mod"
        label="Hesaplama"
        className="sm:col-span-2"
        options={[
          { value: 'boyut', label: 'Birim çevir' },
          { value: 'indirme', label: 'İndirme süresi' },
        ]}
        help="Birim çevir: bir veri boyutunu bit, bayt, KB, MB, GB, TB ve KiB, MiB, GiB, TiB karşılıklarına çevirir. İndirme süresi: dosyanın internet hızınızla kaç dakikada ineceğini hesaplar."
      />
      <NumberField<VeriInput>
        name="deger"
        label={indirme ? 'Dosya boyutu' : 'Veri boyutu'}
        decimals={6}
        placeholder="Örn. 500"
        help={
          indirme
            ? 'İndireceğiniz dosyanın boyutu. Oyun ve film boyutları genellikle GB ile verilir.'
            : 'Çevirmek istediğiniz veri miktarı.'
        }
      />
      <SelectField<VeriInput>
        name="birim"
        label="Birim"
        options={birimSecenekleri('veri')}
        help="kB, MB, GB, TB, PB ondalık (1000) katlardır; KiB, MiB, GiB, TiB, PiB ikili (1024) katlardır."
      />
      {indirme ? (
        <NumberField<VeriInput>
          name="hiz"
          label="İnternet hızı"
          unit="Mbps"
          decimals={2}
          placeholder="Örn. 100"
          className="sm:col-span-2"
          help="İnternet paketinizin indirme hızı, megabit/saniye. Hız testi sonucunu da yazabilirsiniz."
        />
      ) : (
        <ChoiceField<VeriInput>
          name="sistem"
          label="Gösterilecek sistem"
          className="sm:col-span-2"
          options={[
            { value: 'si', label: 'SI (1000) — kB, MB, GB' },
            { value: 'iec', label: 'IEC (1024) — KiB, MiB, GiB' },
          ]}
          help="SI: disk üreticileri ve ağ hızları (1 GB = 1000 MB). IEC: Windows ve RAM (1 GiB = 1024 MiB). Windows, IEC değerini “GB” diye yazar."
        />
      )}
    </>
  );
}

export default function VeriBoyutuCeviriciPage() {
  return (
    <CalculatorLayout
      slug="veri-boyutu-cevirici"
      schema={veriSchema}
      defaults={defaults}
      example={example}
      compute={present}
      content={content}
      sources={sources}
      emptyHint="Veri boyutunu ve birimini girdiğiniz anda bit, bayt, KB, MB, GB, TB ve ikili (KiB, GiB) karşılıkları görünür."
    >
      <Fields />
    </CalculatorLayout>
  );
}
