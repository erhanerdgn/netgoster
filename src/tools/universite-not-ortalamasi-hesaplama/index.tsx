import { CalculatorLayout } from '@/components/calc/CalculatorLayout';
import { NumberField } from '@/components/calc/fields';
import type { ResultView } from '@/components/calc/ResultCard';
import { calculateUniversite, universiteSchema, type UniversiteInput } from '@/calculators/universiteOrtalama';
import { num } from '@/lib/format';
import { DersListesi } from './DersListesi';
import content from './content.md';

const defaults: Partial<UniversiteInput> = { dersler: Array.from({ length: 6 }, () => ({ ad: '', kredi: 5 })) };
const example: UniversiteInput = {
  dersler: [
    { ad: 'Matematik I', harf: 'BA', kredi: 6 },
    { ad: 'Fizik I', harf: 'CB', kredi: 6 },
    { ad: 'Programlamaya Giriş', harf: 'AA', kredi: 5 },
    { ad: 'Teknik Resim', harf: 'BB', kredi: 4 },
    { ad: 'İngilizce I', harf: 'CC', kredi: 3 },
    { ad: 'Türk Dili I', harf: 'BA', kredi: 2 },
  ],
  oncekiGano: 2.85,
  oncekiKredi: 90,
};

const f2 = (n: number) => num(n, 2, 2);

function present(v: Parameters<typeof calculateUniversite>[0]): ResultView {
  const r = calculateUniversite(v);
  const ganoVar = r.gano !== null;
  return {
    main: {
      label: ganoVar ? 'Yeni GANO' : 'Dönem not ortalaması',
      value: f2(r.esas),
      caption: r.yuzluk !== null ? `100’lük karşılığı: ${f2(r.yuzluk)}` : '100’lük karşılığı: YÖK tablosunda yok',
    },
    status:
      r.yuzluk === null
        ? {
            tone: 'warn',
            text: 'YÖK dönüşüm tablosu 1,00–4,00 arasını kapsar; 1,00’ın altındaki ortalamaların 100’lük karşılığı yoktur.',
          }
        : {
            tone: 'info',
            text: 'Harf notlarının katsayıları üniversiteye göre değişebilir; kendi yönetmeliğinizi kontrol edin.',
          },
    rows: [
      { label: 'Dönem ortalaması', value: f2(r.donemOrt), hint: `${r.dersSayisi} ders · ${num(r.donemKredi, 1)} AKTS/kredi` },
      { label: 'Dönem ağırlıklı puanı', value: f2(r.donemAgirlikli), tone: 'muted', hint: 'Σ katsayı × kredi' },
      ...(ganoVar
        ? [
            { label: 'Önceki GANO', value: f2(v.oncekiGano!), tone: 'muted' as const, hint: `${num(v.oncekiKredi!, 1)} kredi` },
            { label: 'Yeni GANO', value: f2(r.gano!), tone: 'total' as const, hint: `Toplam ${num(r.toplamKredi, 1)} kredi` },
          ]
        : []),
      { label: '100’lük karşılığı (YÖK)', value: r.yuzluk !== null ? f2(r.yuzluk) : 'Tabloda yok' },
    ],
    notes: [
      'Dönüşüm: 100’lük = (70/3) × ortalama + 20/3, iki ondalığa kesilir (YÖK 4’lük → 100’lük çevirim tablosu).',
      'Tekrar edilen derslerde yeni not eskisinin yerine geçer; bu hesap tekrarları ayrıca düşmez.',
    ],
  };
}

export default function UniversiteNotOrtalamasiPage() {
  return (
    <CalculatorLayout
      slug="universite-not-ortalamasi-hesaplama"
      schema={universiteSchema}
      defaults={defaults}
      example={example}
      compute={present}
      content={content}
      emptyHint="Derslerinizin harf notlarını seçtikçe dönem ortalamanız ve 100’lük karşılığı hesaplanır."
    >
      <DersListesi />
      <NumberField<UniversiteInput>
        name="oncekiGano"
        label="Önceki GANO (isteğe bağlı)"
        placeholder="Örn. 2,85"
        help="Bu dönemden önceki genel akademik not ortalamanız. Transkriptinizde yazar. Yeni GANO’yu bulmak için toplam krediyle birlikte girin."
      />
      <NumberField<UniversiteInput>
        name="oncekiKredi"
        label="Önceki toplam AKTS/kredi"
        decimals={1}
        placeholder="Örn. 90"
        help="Önceki GANO’nun hesaplandığı derslerin toplam AKTS veya kredisi (genellikle her dönem 30 AKTS)."
      />
    </CalculatorLayout>
  );
}
