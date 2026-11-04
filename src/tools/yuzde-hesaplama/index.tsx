import { useWatch } from 'react-hook-form';
import { CalculatorLayout } from '@/components/calc/CalculatorLayout';
import { ChoiceField, NumberField } from '@/components/calc/fields';
import type { ResultView } from '@/components/calc/ResultCard';
import { calculateYuzde, yuzdeSchema, type YuzdeInput, type YuzdeValues } from '@/calculators/yuzde';
import { num, pctValue } from '@/lib/format';
import content from './content.md';

const defaults: Partial<YuzdeInput> = { mod: 'yuzdesi', yon: 'artir' };
const example: YuzdeInput = { mod: 'yuzdesi', x: 250, y: 18, yon: 'artir' };

const n = (v: number) => num(v, 4);
/** Negatif sayıları formülde parantez içinde gösterir */
const p = (v: number) => (v < 0 ? `(${n(v)})` : n(v));
const signed = (v: number) => (v > 0 ? `+${pctValue(v, 4)}` : v < 0 ? `−${pctValue(-v, 4)}` : '%0');

const LABELS: Record<YuzdeValues['mod'], { x: string; y: string; xHelp: string; yHelp: string; yUnit?: string }> = {
  yuzdesi: {
    x: 'Sayı (X)',
    y: 'Yüzde (Y)',
    yUnit: '%',
    xHelp: 'Yüzdesini almak istediğiniz sayı veya tutar. Örn. 250.',
    yHelp: 'Kaçta kaçını hesaplayacağınız oran. Örn. 18 yazarsanız %18’i hesaplanır.',
  },
  degisim: {
    x: 'Eski değer',
    y: 'Yeni değer',
    xHelp: 'Karşılaştırmanın başlangıç (önceki) değeri: eski fiyat, geçen yılki satış vb. Sıfır olamaz.',
    yHelp: 'Karşılaştırmanın son (güncel) değeri.',
  },
  kac: {
    x: 'Parça (X)',
    y: 'Bütün (Y)',
    xHelp: 'Oranını bulmak istediğiniz kısım. Örn. sınavda doğru sayısı.',
    yHelp: 'Karşılaştırmanın yapıldığı bütün. Örn. toplam soru sayısı. Sıfır olamaz.',
  },
  artir: {
    x: 'Sayı',
    y: 'Yüzde',
    yUnit: '%',
    xHelp: 'Artırılacak veya azaltılacak başlangıç değeri.',
    yHelp: 'Uygulanacak artış ya da azalış oranı. Örn. 20 = %20.',
  },
};

function present(v: YuzdeValues): ResultView {
  const r = calculateYuzde(v);
  switch (v.mod) {
    case 'yuzdesi':
      return {
        main: { label: `${n(v.x)} sayısının %${n(v.y)}’i`, value: n(r.sonuc) },
        rows: [
          { label: 'Formül', value: 'X × Y ÷ 100', tone: 'muted' },
          { label: 'Adım 1', value: `${p(v.x)} × ${p(v.y)} = ${n(v.x * v.y)}` },
          { label: 'Adım 2', value: `${n(v.x * v.y)} ÷ 100 = ${n(r.sonuc)}` },
          { label: 'Sonuç', value: n(r.sonuc), tone: 'total' },
        ],
      };
    case 'degisim':
      return {
        main: { label: `${n(v.x)} → ${n(v.y)} değişimi`, value: signed(r.sonuc), caption: r.sonuc >= 0 ? 'Artış' : 'Azalış' },
        rows: [
          { label: 'Formül', value: '(Yeni − Eski) ÷ |Eski| × 100', tone: 'muted' },
          { label: 'Adım 1: fark', value: `${p(v.y)} − ${p(v.x)} = ${n(r.fark!)}` },
          { label: 'Adım 2: oran', value: `${p(r.fark!)} ÷ ${n(Math.abs(v.x))} = ${n(r.fark! / Math.abs(v.x))}` },
          { label: 'Adım 3: yüzde', value: `${n(r.fark! / Math.abs(v.x))} × 100 = ${n(r.sonuc)}` },
          { label: 'Yüzde değişim', value: signed(r.sonuc), tone: 'total' },
        ],
        notes: [
          'Yüzde değişim simetrik değildir: 80’den 100’e çıkış %25 artış, 100’den 80’e iniş %20 azalıştır.',
          ...(v.x < 0
            ? ['Eski değer negatif olduğu için mutlak değerine bölündü; böylece yükseliş artış, düşüş azalış olarak görünür.']
            : []),
        ],
      };
    case 'kac':
      return {
        main: { label: `${n(v.x)}, ${n(v.y)} sayısının`, value: pctValue(r.sonuc, 4), caption: 'yüzdesidir' },
        rows: [
          { label: 'Formül', value: 'X ÷ Y × 100', tone: 'muted' },
          { label: 'Adım 1', value: `${p(v.x)} ÷ ${p(v.y)} = ${n(v.x / v.y)}` },
          { label: 'Adım 2', value: `${n(v.x / v.y)} × 100 = ${n(r.sonuc)}` },
          { label: 'Sonuç', value: pctValue(r.sonuc, 4), tone: 'total' },
        ],
      };
    case 'artir': {
      const artir = v.yon === 'artir';
      return {
        main: { label: `${n(v.x)} sayısının %${n(v.y)} ${artir ? 'fazlası' : 'eksiği'}`, value: n(r.sonuc) },
        rows: [
          { label: 'Formül', value: artir ? 'X × (1 + Y ÷ 100)' : 'X × (1 − Y ÷ 100)', tone: 'muted' },
          { label: 'Adım 1: çarpan', value: `1 ${artir ? '+' : '−'} ${n(v.y)} ÷ 100 = ${n(1 + (artir ? v.y : -v.y) / 100)}` },
          { label: 'Adım 2', value: `${p(v.x)} × ${n(1 + (artir ? v.y : -v.y) / 100)} = ${n(r.sonuc)}` },
          { label: artir ? 'Eklenen' : 'Düşülen', value: n(Math.abs(r.fark!)), tone: artir ? 'plus' : 'minus' },
          { label: 'Sonuç', value: n(r.sonuc), tone: 'total' },
        ],
        notes:
          r.tersYuzde === undefined
            ? ['%100 azaltılan bir değer sıfırlanır; yüzdeyle eski değerine geri döndürülemez.']
            : [
                `Sonucu yeniden ${n(v.x)} yapmak için ${n(r.sonuc)} sayısını %${n(Math.abs(r.tersYuzde))} ${r.tersYuzde < 0 ? 'azaltmanız' : 'artırmanız'} gerekir; aynı yüzdeyle geri dönülmez.`,
              ],
      };
    }
  }
}

function Fields() {
  const mod = useWatch<YuzdeInput, 'mod'>({ name: 'mod' }) ?? 'yuzdesi';
  const l = LABELS[mod];
  return (
    <>
      <ChoiceField<YuzdeInput>
        name="mod"
        label="Hesaplama türü"
        className="sm:col-span-2"
        options={[
          { value: 'yuzdesi', label: "X'in %Y'si" },
          { value: 'degisim', label: 'Yüzde değişim' },
          { value: 'kac', label: 'Yüzde kaçı?' },
          { value: 'artir', label: 'Artır / azalt' },
        ]}
        help="X'in %Y'si: bir sayının yüzdesi. Yüzde değişim: eskiden yeniye artış/azalış oranı. Yüzde kaçı: bir sayının diğerine oranı. Artır/azalt: sayıya yüzde ekleme veya çıkarma."
      />
      <NumberField<YuzdeInput> name="x" label={l.x} decimals={4} allowNegative placeholder="Örn. 250" help={l.xHelp} />
      <NumberField<YuzdeInput>
        name="y"
        label={l.y}
        unit={l.yUnit}
        decimals={4}
        allowNegative={mod !== 'artir'}
        placeholder={l.yUnit ? 'Örn. 18' : 'Örn. 300'}
        help={l.yHelp}
      />
      {mod === 'artir' && (
        <ChoiceField<YuzdeInput>
          name="yon"
          label="İşlem"
          className="sm:col-span-2"
          options={[
            { value: 'artir', label: 'Artır (+)' },
            { value: 'azalt', label: 'Azalt (−)' },
          ]}
          help="Artır: zam, KDV, faiz gibi eklemeler. Azalt: indirim, kesinti gibi düşüşler."
        />
      )}
    </>
  );
}

export default function YuzdeHesaplamaPage() {
  return (
    <CalculatorLayout
      slug="yuzde-hesaplama"
      schema={yuzdeSchema}
      defaults={defaults}
      example={example}
      compute={present}
      content={content}
      emptyHint="Hesaplama türünü seçip iki sayıyı girdiğiniz anda sonuç ve adım adım formül görünür."
    >
      <Fields />
    </CalculatorLayout>
  );
}
