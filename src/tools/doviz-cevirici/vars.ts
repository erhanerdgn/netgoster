import { calculateDoviz, dovizSchema, type KurKaydi } from '../../calculators/doviz.ts';

/** İçerik örnekleri için VARSAYIMSAL kur listesi (metinde "örnek kur" olarak belirtilir; canlı kur değildir). */
const ornek: KurKaydi[] = [
  { code: 'USD', unit: 1, forexBuying: 41.8, forexSelling: 41.9, banknoteBuying: 41.77, banknoteSelling: 41.96 },
  { code: 'EUR', unit: 1, forexBuying: 48.2, forexSelling: 48.3, banknoteBuying: 48.17, banknoteSelling: 48.37 },
  { code: 'JPY', unit: 100, forexBuying: 27.5, forexSelling: 27.7, banknoteBuying: 27.4, banknoteSelling: 27.8 },
];

const n = (x: number, d = 2) => new Intl.NumberFormat('tr-TR', { minimumFractionDigits: d, maximumFractionDigits: d }).format(x);

export default function vars() {
  const c = (v: object) => calculateDoviz(dovizSchema.parse(v), ornek);
  const o1 = c({ tutar: 1500, kaynak: 'USD', hedef: 'TRY', kurTuru: 'banknoteSelling' });
  const o2 = c({ tutar: 1000, kaynak: 'EUR', hedef: 'USD', kurTuru: 'forexSelling' });
  const o3 = c({ tutar: 50000, kaynak: 'JPY', hedef: 'TRY', kurTuru: 'forexBuying' });
  return {
    'doviz.usd.efs': n(ornek[0].banknoteSelling!, 4),
    'doviz.usd.ds': n(ornek[0].forexSelling!, 4),
    'doviz.eur.ds': n(ornek[1].forexSelling!, 4),
    'doviz.jpy.da': n(ornek[2].forexBuying!, 4),
    'doviz.ornek1': n(o1.sonuc),
    'doviz.ornek2': n(o2.sonuc),
    'doviz.ornek2.kur': n(o2.kur, 4),
    'doviz.ornek3': n(o3.sonuc),
    'doviz.ornek3.birim': n(o3.kaynakTl!, 4),
  };
}
