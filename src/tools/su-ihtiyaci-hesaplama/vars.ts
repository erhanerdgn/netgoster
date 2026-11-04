import { calculateSu, SU, suSchema } from '../../calculators/su.ts';

const ml = (x: number) => new Intl.NumberFormat('tr-TR').format(x) + ' ml';
const l = (x: number) => new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 2 }).format(x / 1000) + ' L';

/** content.md: varsayımlar ve örnekler calculators/su.ts sabitlerinden (tarihten bağımsız) */
export default function vars() {
  const ex = (p: string, v: object) => {
    const r = calculateSu(suSchema.parse(v));
    return {
      [`${p}.temel`]: ml(r.temel),
      [`${p}.min`]: l(r.aralikMin),
      [`${p}.max`]: l(r.aralikMax),
      [`${p}.egzersiz`]: ml(r.egzersizEk),
      [`${p}.toplam`]: l(r.toplam),
      [`${p}.bardak`]: String(r.bardak),
      [`${p}.efsa`]: l(r.efsa),
    };
  };
  return {
    'su.mlKgMin': String(SU.mlKgMin),
    'su.mlKgMax': String(SU.mlKgMax),
    'su.egzersiz': ml(SU.egzersiz30dk),
    'su.sicak': ml(SU.sicak),
    'su.efsaK': l(SU.efsa.kadin),
    'su.efsaE': l(SU.efsa.erkek),
    'su.hamile': ml(SU.durum.hamile),
    'su.emzirme': ml(SU.durum.emziriyor),
    'su.bardak': ml(SU.bardak),
    ...ex('su.a', { kilo: 70, cinsiyet: 'kadin' }),
    ...ex('su.b', { kilo: 85, cinsiyet: 'erkek', egzersiz: 60, sicak: true }),
    ...ex('su.c', { kilo: 62, cinsiyet: 'kadin', durum: 'emziriyor' }),
  };
}
