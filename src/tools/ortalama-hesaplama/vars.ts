import { agirlikliOrtalama, listeIstatistik, sayilariOku } from '../../calculators/ortalama.ts';

const n = (v: number) => new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 4 }).format(v);
const n2 = (v: number) => new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 2 }).format(v);
const pct = (r: number) => '%' + n2(r * 100);
const ist = (metin: string) => listeIstatistik(sayilariOku(metin).sayilar);

const TABLO = ['1 2 3 4 5', '10 20 30', '2 4 4 4 5 5 7 9', '1 1 2 3 5 8 13', '50 60 70 80 90 100', '3,5 4 4,5 5', '45 70 85 85'];

export default function vars() {
  const o1 = ist('72 85,5 90 64 85 78 85 91');
  const o2 = ist('2 4 4 4 5 5 7 9');
  const o3 = agirlikliOrtalama([
    { deger: 55, agirlik: 40 },
    { deger: 80, agirlik: 60 },
  ]);
  const buyume = ist('1,1 1,5 0,8');
  const hiz = ist('60 40');
  const maas = ist('30000 32000 35000 38000 250000');
  const tablo = TABLO.map((t) => {
    const r = ist(t);
    return `| ${t.split(' ').join(' · ')} | ${n2(r.aritmetik)} | ${n2(r.medyan)} | ${r.modlar.length ? r.modlar.map(n2).join('; ') : 'yok'} | ${r.ssOrneklem !== undefined ? n2(r.ssOrneklem) : '—'} |`;
  }).join('\n');
  return {
    'ort.o1.n': n(o1.n),
    'ort.o1.toplam': n(o1.toplam),
    'ort.o1.aritmetik': n(o1.aritmetik),
    'ort.o1.medyan': n(o1.medyan),
    'ort.o1.mod': o1.modlar.map(n).join('; '),
    'ort.o1.aralik': n(o1.aralik),
    'ort.o2.aritmetik': n(o2.aritmetik),
    'ort.o2.kareler': n(o2.varyansPopulasyon * o2.n),
    'ort.o2.varyansPop': n(o2.varyansPopulasyon),
    'ort.o2.ssPop': n(o2.ssPopulasyon),
    'ort.o2.varyansOrn': n2(o2.varyansOrneklem!),
    'ort.o2.ssOrn': n2(o2.ssOrneklem!),
    'ort.o3.ortalama': n(o3.ortalama),
    'ort.o3.carpim': n(o3.carpimToplam),
    'ort.o3.basit': n(o3.basit),
    'ort.buyume.aritmetik': pct(buyume.aritmetik - 1),
    'ort.buyume.geometrik': pct(buyume.geometrik! - 1),
    'ort.buyume.sonuc': n(1.1 * 1.5 * 0.8),
    'ort.hiz.harmonik': n(hiz.harmonik!),
    'ort.hiz.aritmetik': n(hiz.aritmetik),
    'ort.maas.aritmetik': n(maas.aritmetik),
    'ort.maas.medyan': n(maas.medyan),
    'ort.tablo': tablo,
  };
}
