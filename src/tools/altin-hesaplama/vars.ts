import { altinSchema, altinTanimlari, altinTuruKodlari, calculateAltin } from '../../calculators/altin.ts';
import { tl } from '../../content/vars.ts';

const n = (x: number, d = 3) => new Intl.NumberFormat('tr-TR', { minimumFractionDigits: d, maximumFractionDigits: d }).format(x);

/** Örneklerde kullanılan VARSAYIMSAL has altın gram fiyatı (metinde açıkça belirtilir; canlı değer değildir). */
const HAS = 4500;

export default function vars(today: string) {
  const t = altinTanimlari(today);
  const a = (v: object) => calculateAltin(altinSchema.parse(v), HAS, today);
  const out: Record<string, string> = { 'altin.ornekHas': tl(HAS) };
  for (const k of altinTuruKodlari) {
    out[`altin.${k}.gram`] = n(t[k].gram);
    out[`altin.${k}.milyem`] = n(t[k].milyem);
    out[`altin.${k}.has`] = n(t[k].gram * t[k].milyem, 4);
  }
  const o1 = a({ tur: 'ceyrek', miktar: 5, kaynak: 'canli' });
  const o2 = a({ tur: 'ayar22', miktar: 30, kaynak: 'canli' });
  const o3 = a({ tur: 'gram24', miktar: 1, kaynak: 'elle', gramFiyat: 4600 });
  const o3b = a({ tur: 'cumhuriyet', miktar: 1, kaynak: 'elle', gramFiyat: 4600 });
  return {
    ...out,
    'altin.ceyrek.hasTam': n(t.ceyrek.gram * t.ceyrek.milyem, 6),
    'altin.ornek1.birim': tl(o1.birimDeger),
    'altin.ornek1.toplam': tl(o1.toplam),
    'altin.ornek2.has': n(o2.hasGramMiktar, 2),
    'altin.ornek2.toplam': tl(o2.toplam),
    'altin.ornek3.has': tl(o3.hasGram),
    'altin.ornek3.cumhuriyet': tl(o3b.toplam),
  };
}
