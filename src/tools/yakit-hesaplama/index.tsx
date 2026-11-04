import { CalculatorLayout } from '@/components/calc/CalculatorLayout';
import { NumberField, SwitchField } from '@/components/calc/fields';
import type { ResultView } from '@/components/calc/ResultCard';
import { calculateYakit, yakitSchema, type YakitInput } from '@/calculators/yakit';
import { num, tl } from '@/lib/format';
import content from './content.md';

const defaults: Partial<YakitInput> = { gidisDonus: false, kisi: 1 };
const example: YakitInput = { mesafe: 450, tuketim: 6.5, fiyat: 50, gidisDonus: true, kisi: 3 };

function present(v: Parameters<typeof calculateYakit>[0]): ResultView {
  const r = calculateYakit(v);
  return {
    main: {
      label: 'Toplam yakıt masrafı',
      value: tl(r.tutar),
      caption: `${num(r.toplamKm)} km${v.gidisDonus ? ' (gidiş-dönüş)' : ''} · ${num(r.litre)} litre`,
    },
    rows: [
      { label: 'Toplam mesafe', value: `${num(r.toplamKm)} km` },
      { label: 'Harcanacak yakıt', value: `${num(r.litre)} L` },
      { label: 'Kilometre başı maliyet', value: tl(r.kmBasi) },
      { label: 'Toplam masraf', value: tl(r.tutar), tone: 'total' },
      ...(v.kisi > 1 ? [{ label: `Kişi başı (${v.kisi} kişi)`, value: tl(r.kisiBasi), tone: 'total' as const }] : []),
    ],
    notes: [
      'Gerçek tüketim; hız, trafik, yük, klima kullanımı, lastik basıncı ve yol eğimine göre katalog değerinden farklı olabilir. Otoyol ve köprü ücretleri dahil değildir.',
    ],
  };
}

export default function YakitHesaplamaPage() {
  return (
    <CalculatorLayout
      slug="yakit-hesaplama"
      schema={yakitSchema}
      defaults={defaults}
      example={example}
      compute={present}
      content={content}
      emptyHint="Mesafeyi, tüketimi ve yakıt fiyatını girdiğinizde yol masrafı hesaplanır."
    >
      <NumberField<YakitInput>
        name="mesafe"
        label="Mesafe (tek yön)"
        unit="km"
        decimals={1}
        placeholder="Örn. 450"
        help="Gideceğiniz yolun tek yön uzunluğu. Harita uygulamasındaki rota mesafesini kullanabilirsiniz."
      />
      <NumberField<YakitInput>
        name="tuketim"
        label="100 km’de tüketim"
        unit="L"
        decimals={2}
        placeholder="Örn. 6,5"
        help="Aracınızın 100 km’de yaktığı ortalama litre. Yol bilgisayarındaki ortalama veya katalogdaki karma tüketim değeri."
      />
      <NumberField<YakitInput>
        name="fiyat"
        label="Yakıt fiyatı"
        unit="₺/L"
        placeholder="Örn. 47,50"
        help="Benzin, motorin veya LPG’nin güncel litre fiyatı. Fiyatlar il ve akaryakıt şirketine göre değişir; pompadaki fiyatı girin."
      />
      <NumberField<YakitInput>
        name="kisi"
        label="Kişi sayısı"
        decimals={0}
        placeholder="1"
        help="Masrafı paylaşacak kişi sayısı (sürücü dahil)."
      />
      <SwitchField<YakitInput>
        name="gidisDonus"
        label="Gidiş-dönüş"
        hint="Mesafe iki katına çıkar."
        className="sm:col-span-2"
        help="Açıkken girdiğiniz tek yön mesafe dönüş yolu için de hesaba katılır."
      />
    </CalculatorLayout>
  );
}
