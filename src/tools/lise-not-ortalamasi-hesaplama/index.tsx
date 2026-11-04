import { CalculatorLayout } from '@/components/calc/CalculatorLayout';
import { SwitchField } from '@/components/calc/fields';
import type { ResultView } from '@/components/calc/ResultCard';
import { calculateLise, liseSchema, type GecmeDurumu, type LiseInput } from '@/calculators/liseOrtalama';
import { lise } from '@/config/sinavlar';
import { num } from '@/lib/format';
import { DersListesi } from './DersListesi';
import content from './content.md';

/** Varsayılan satırlar: Anadolu lisesi 9. sınıfa yakın bir ders listesi (saatler okul türüne göre değişir) */
const dersler: [string, number][] = [
  ['Türk Dili ve Edebiyatı', 5],
  ['Matematik', 6],
  ['Fizik', 2],
  ['Kimya', 2],
  ['Biyoloji', 2],
  ['Tarih', 2],
  ['Coğrafya', 2],
  ['Din Kültürü ve Ahlak Bilgisi', 2],
  ['Yabancı Dil', 4],
  ['Beden Eğitimi ve Spor', 2],
];
const ornekPuan = [78.5, 72, 81, 65, 88, 90, 84, 95, 76, 100];

const defaults: Partial<LiseInput> = { dersler: dersler.map(([ad, saat]) => ({ ad, saat })), davranis100: true };
const example: LiseInput = {
  dersler: dersler.map(([ad, saat], i) => ({ ad, saat, puan: ornekPuan[i] })),
  davranis100: true,
};

const gecmeText: Record<GecmeDurumu, { tone: 'ok' | 'warn' | 'info'; text: string }> = {
  dogrudan: { tone: 'ok', text: 'Tüm derslerden başarılısınız: doğrudan sınıf geçersiniz.' },
  ybp: {
    tone: 'ok',
    text: 'Bir başarısız dersiniz var ancak yıl sonu başarı puanınız en az 50 olduğu için doğrudan sınıf geçersiniz (md. 57).',
  },
  sorumlu: {
    tone: 'warn',
    text: 'Yıl sonu başarı puanınız en az 50 ve en fazla 3 başarısız dersiniz var: bu derslerden sorumlu olarak sınıf geçersiniz (md. 58).',
  },
  tekrar: {
    tone: 'warn',
    text: 'Bu notlarla sınıf geçme şartları sağlanmıyor (yıl sonu başarı puanı 50’nin altında veya 3’ten fazla başarısız ders): sınıf tekrarı söz konusu olabilir.',
  },
};

function present(v: Parameters<typeof calculateLise>[0]): ResultView {
  const r = calculateLise(v);
  return {
    main: {
      label: 'Yıl sonu başarı puanı',
      value: num(r.ortalama, 4, 4),
      caption: `${r.derece} · ${r.dersSayisi} ders, ${r.toplamSaat} saat`,
    },
    status: gecmeText[r.gecme],
    rows: [
      { label: 'Ağırlıklı puan toplamı', value: num(r.agirlikliToplam, 2), hint: 'Σ puan × haftalık saat' },
      { label: 'Toplam haftalık saat', value: String(r.toplamSaat) },
      { label: 'Başarısız ders (50 altı)', value: String(r.basarisiz), tone: r.basarisiz ? 'minus' : 'muted' },
      {
        label: 'Belge durumu',
        value: r.belge === 'takdir' ? 'Takdir belgesi' : r.belge === 'tesekkur' ? 'Teşekkür belgesi' : 'Belge yok',
        tone: r.belge ? 'total' : 'muted',
        hint:
          r.belgeEngeli ??
          (r.belge === 'takdir' ? `${lise.takdir},00 ve üzeri` : `${lise.tesekkur},00–${lise.takdir - 1},99 arası`),
      },
    ],
    notes: [
      'Belgeler dönem sonunda o dönemin puanlarıyla verilir; dönem notlarınızı girerek o döneme ait belge durumunu görebilirsiniz.',
      `Bir dersin yıl sonu puanı 50’nin altında olsa bile ikinci dönem puanı en az ${lise.secondTermPass} ise o ders başarılı sayılır (md. 56). Sorumlu dersler alt sınıflar dahil toplam 6’yı aşarsa sınıf tekrar edilir.`,
    ],
  };
}

export default function LiseNotOrtalamasiPage() {
  return (
    <CalculatorLayout
      slug="lise-not-ortalamasi-hesaplama"
      schema={liseSchema}
      defaults={defaults}
      example={example}
      compute={present}
      content={content}
      emptyHint="Derslerinizin yıl sonu puanlarını girdikçe ağırlıklı ortalamanız ve belge durumunuz hesaplanır."
    >
      <DersListesi />
      <SwitchField<LiseInput>
        name="davranis100"
        label="Davranış puanı 100"
        className="sm:col-span-2"
        help="Teşekkür ve takdir belgesi için davranış puanınızın 100 olması gerekir. Disiplin cezası aldıysanız kapatın."
      />
    </CalculatorLayout>
  );
}
