import { CalculatorLayout } from '@/components/calc/CalculatorLayout';
import { NumberField, SelectField } from '@/components/calc/fields';
import type { ResultView } from '@/components/calc/ResultCard';
import { calculateFazlaMesai, fazlaMesaiSchema, type FazlaMesaiInput } from '@/calculators/fazlaMesai';
import { todayISO } from '@/config/period';
import { isKanunu as K } from '@/config/parameters-2026';
import { monthNames, pct, tl } from '@/lib/format';
import content from './content.md';

const buAy = String(Number(todayISO().slice(5, 7)));
const ayOptions = monthNames.map((m, i) => ({ value: String(i + 1), label: m }));

const defaults: Partial<FazlaMesaiInput> = { fmSaat: 0, fsSaat: 0, bayramGun: 0, haftaTatiliGun: 0, ay: buAy };
const example: FazlaMesaiInput = { brut: 45000, fmSaat: 12, fsSaat: 0, bayramGun: 1, haftaTatiliGun: 0, ay: buAy };

function present(v: Parameters<typeof calculateFazlaMesai>[0]): ResultView {
  const r = calculateFazlaMesai(v);
  const kalem = (label: string, value: number, hint: string) =>
    value > 0 ? [{ label, value: tl(value), tone: 'plus' as const, hint }] : [];
  return {
    main: { label: 'Fazla çalışma ücreti (brüt)', value: tl(r.ek), caption: `Yaklaşık net: ${tl(r.netEk)}` },
    status: r.yillikSinirAsimi
      ? {
          tone: 'warn',
          text: `Bu tempoda yıllık ${K.yillikFazlaMesaiSiniri} saatlik fazla mesai sınırı aşılır (İş Kanunu md. 41).`,
        }
      : { tone: 'info', text: `Saatlik brüt ücretiniz ${tl(r.saatlik)}, günlük brüt ücretiniz ${tl(r.gunluk)}.` },
    rows: [
      { label: 'Saatlik brüt ücret', value: tl(r.saatlik), tone: 'muted', hint: `Brüt maaş / ${K.aylikSaat}` },
      ...kalem(
        `Fazla mesai (${pct(K.fazlaMesaiZam)} zamlı)`,
        r.fm,
        `${v.fmSaat} saat × ${tl(r.saatlik * (1 + K.fazlaMesaiZam))}`,
      ),
      ...kalem(
        `Fazla süreli çalışma (${pct(K.fazlaSurelerZam)} zamlı)`,
        r.fs,
        `${v.fsSaat} saat × ${tl(r.saatlik * (1 + K.fazlaSurelerZam))}`,
      ),
      ...kalem('Bayram / genel tatil çalışması', r.bayram, `${v.bayramGun} gün × ${tl(r.gunluk)} ek yevmiye`),
      ...kalem('Hafta tatili çalışması', r.haftaTatili, `${v.haftaTatiliGun} gün × ${tl(r.gunluk * (1 + K.fazlaMesaiZam))}`),
      { label: 'Toplam brüt ek ödeme', value: tl(r.ek), tone: 'total' },
      { label: 'SGK + işsizlik primi', value: tl(r.sgk), tone: 'minus' },
      { label: 'Gelir vergisi', value: tl(r.gv), tone: 'minus' },
      { label: 'Damga vergisi', value: tl(r.dv), tone: 'minus' },
      { label: 'Yaklaşık net ek ödeme', value: tl(r.netEk), tone: 'total' },
      {
        label: `${monthNames[Number(v.ay) - 1]} toplam net maaş`,
        value: tl(r.toplamNet),
        tone: 'muted',
        hint: `Mesaisiz ${tl(r.maasNet)}`,
      },
    ],
    notes: [
      'Net tutar, ek ödemenin seçtiğiniz ayın maaşına eklendiği ve yıl başından beri aynı brütü aldığınız varsayımıyla hesaplanır (kümülatif vergi dilimi).',
    ],
  };
}

export default function FazlaMesaiPage() {
  return (
    <CalculatorLayout
      slug="fazla-mesai-hesaplama"
      schema={fazlaMesaiSchema}
      defaults={defaults}
      example={example}
      compute={present}
      content={content}
      emptyHint="Brüt maaşınızı ve fazla çalışma saatlerinizi girdiğiniz anda mesai ücretiniz hesaplanır."
    >
      <NumberField<FazlaMesaiInput>
        name="brut"
        label="Aylık brüt maaş"
        unit="₺"
        placeholder="Örn. 45.000"
        help={`Kesintilerden önceki aylık ücretiniz. Saatlik ücret, brüt maaşın ${K.aylikSaat} saate bölünmesiyle bulunur.`}
      />
      <SelectField<FazlaMesaiInput>
        name="ay"
        label="Ödeme ayı"
        options={ayOptions}
        help="Mesainin ödeneceği bordro ayı. Yıl içinde biriken vergi matrahı, dolayısıyla vergi dilimi aya göre değişir."
      />
      <NumberField<FazlaMesaiInput>
        name="fmSaat"
        label={`Fazla mesai saati (${pct(K.fazlaMesaiZam)})`}
        unit="saat"
        decimals={1}
        help={`Haftalık ${K.haftalikAzami} saati aşan çalışma. Her saati, saatlik ücretin ${pct(K.fazlaMesaiZam)} fazlasıyla ödenir.`}
      />
      <NumberField<FazlaMesaiInput>
        name="fsSaat"
        label={`Fazla süreli çalışma saati (${pct(K.fazlaSurelerZam)})`}
        unit="saat"
        decimals={1}
        help={`Sözleşmenizde haftalık çalışma ${K.haftalikAzami} saatin altındaysa, sözleşme süresini aşıp ${K.haftalikAzami} saate kadar olan çalışma. ${pct(K.fazlaSurelerZam)} zamlı ödenir.`}
        hint="Yoksa 0 bırakın."
      />
      <NumberField<FazlaMesaiInput>
        name="bayramGun"
        label="Bayram / genel tatilde çalışılan gün"
        unit="gün"
        decimals={0}
        help="Ulusal bayram ve genel tatil günlerinde (ör. 1 Mayıs, 29 Ekim, dini bayramlar) çalışılan her gün için ayrıca bir günlük ücret ödenir."
      />
      <NumberField<FazlaMesaiInput>
        name="haftaTatiliGun"
        label="Hafta tatilinde çalışılan gün"
        unit="gün"
        decimals={0}
        help={`Haftalık izin gününüzde çalıştıysanız; bu çalışma ${pct(K.fazlaMesaiZam)} zamlı günlük ücretle ödenir.`}
        hint="Yoksa 0 bırakın."
      />
    </CalculatorLayout>
  );
}
