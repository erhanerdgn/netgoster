import { calculateMutfakOlculeri, mutfakOlculeriSchema, MALZEME_KODLARI } from '../../calculators/mutfakOlculeri.ts';
import { MALZEMELER, OLCULER, type MalzemeKodu } from '../../config/mutfak.ts';

const n = (v: number, d = 1) => new Intl.NumberFormat('tr-TR', { maximumFractionDigits: d }).format(v);
/** Gram: 100 g ve üstü tam sayı, altı 1 ondalık (sayfadaki sonuçla aynı) */
const g = (v: number) => `${n(v, v >= 100 ? 0 : 1)} g`;
const kucuk = (s: string) => s.charAt(0).toLocaleLowerCase('tr') + s.slice(1);

/** content.md: tüm tablolar ve örnekler hesaplayıcıdan üretilir. */
export default function vars() {
  const h = (miktar: number, birim: string, malzeme: MalzemeKodu) =>
    calculateMutfakOlculeri(mutfakOlculeriSchema.parse({ miktar, birim, malzeme }));
  const bir = (birim: string, malzeme: MalzemeKodu) => g(h(1, birim, malzeme).gram);
  const bardak = (r: ReturnType<typeof h>) => n(r.karsiliklar.find((k) => k.kod === 'suBardagi')!.miktar, 2);

  const malzemeTablo = MALZEME_KODLARI.map(
    (k) =>
      `| ${MALZEMELER[k].ad} | ${bir('suBardagi', k)} | ${bir('cayBardagi', k)} | ${bir('yemekKasigi', k)} | ${bir('cayKasigi', k)} |`,
  ).join('\n');

  const gramTablo = (['un', 'tozSeker', 'pudraSekeri', 'tereyagi'] as const)
    .flatMap((k) =>
      [100, 250, 500].map((gr) => {
        const r = h(gr, 'g', k);
        return `| ${gr} g ${kucuk(MALZEMELER[k].ad)} | ${bardak(r)} | ${r.bilesik} |`;
      }),
    )
    .join('\n');

  const olcuTablo = (Object.keys(OLCULER) as (keyof typeof OLCULER)[])
    .filter((k) => k !== 'ml' && k !== 'l')
    .map((k) => `| ${OLCULER[k].ad} | ${n(OLCULER[k].ml, 2)} ml | ${n(OLCULER[k].ml / 15, 2)} | ${n(OLCULER[k].ml / 5, 2)} |`)
    .join('\n');

  const o1 = h(2, 'suBardagi', 'un');
  const o2 = h(250, 'g', 'tozSeker');
  const o3a = h(3, 'yemekKasigi', 'tereyagi');
  const o3b = h(3, 'yemekKasigi', 'tereyagiEritilmis');
  const o4 = h(1, 'usCup', 'un');
  const kg = h(1, 'kg', 'un');

  return {
    'mo.malzemeTablo': malzemeTablo,
    'mo.gramTablo': gramTablo,
    'mo.olcuTablo': olcuTablo,
    'mo.cup': n(OLCULER.usCup.ml, 2),
    'mo.cupBardak': n(OLCULER.usCup.ml / OLCULER.suBardagi.ml, 2),
    'mo.olcuBardak': n(OLCULER.olcuBardagi.ml / OLCULER.suBardagi.ml, 2),
    'mo.unGml': n(MALZEMELER.un.gml, 2),
    'mo.sekerGml': n(MALZEMELER.tozSeker.gml, 2),
    'mo.sb.un': bir('suBardagi', 'un'),
    'mo.sb.unDaldirma': bir('suBardagi', 'unDaldirma'),
    'mo.sb.unElenmis': bir('suBardagi', 'unElenmis'),
    'mo.sb.seker': bir('suBardagi', 'tozSeker'),
    'mo.sb.pudra': bir('suBardagi', 'pudraSekeri'),
    'mo.sb.sut': bir('suBardagi', 'sut'),
    'mo.sb.yag': bir('suBardagi', 'siviYag'),
    'mo.sb.tereyagi': bir('suBardagi', 'tereyagi'),
    'mo.yk.un': bir('yemekKasigi', 'un'),
    'mo.yk.seker': bir('yemekKasigi', 'tozSeker'),
    'mo.yk.yag': bir('yemekKasigi', 'siviYag'),
    'mo.yk.tereyagi': bir('yemekKasigi', 'tereyagi'),
    'mo.ck.tuz': bir('cayKasigi', 'tuz'),
    'mo.ck.kabartma': bir('cayKasigi', 'kabartmaTozu'),
    'mo.100un': h(100, 'g', 'un').bilesik,
    'mo.100unDaldirma': h(100, 'g', 'unDaldirma').bilesik,
    'mo.olcuFark': g(h(3, 'olcuBardagi', 'un').gram - h(3, 'suBardagi', 'un').gram),
    'mo.cupFark': n((OLCULER.usCup.ml / OLCULER.suBardagi.ml - 1) * 100, 0),
    'mo.esmerFark': n((MALZEMELER.esmerSekerBastirilmis.gml / MALZEMELER.esmerSeker.gml - 1) * 100, 0),
    'mo.paketKabartma': h(10, 'g', 'kabartmaTozu').bilesik,
    'mo.kgUn.bardak': bardak(kg),
    'mo.kgUn.bilesik': kg.bilesik,
    'mo.o1.gram': g(o1.gram),
    'mo.o2.ml': n(o2.ml, 1),
    'mo.o2.bardak': bardak(o2),
    'mo.o2.bilesik': o2.bilesik,
    'mo.o3a.gram': g(o3a.gram),
    'mo.o3b.gram': g(o3b.gram),
    'mo.o4.gram': g(o4.gram),
    'mo.o4.bardak': bardak(o4),
    'mo.o4.bilesik': o4.bilesik,
  };
}
