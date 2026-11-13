import { ayAdi, calculateEnflasyon, enflasyonSchema } from '../../calculators/enflasyon.ts';
import { BAGLAMA, endeksAt, SON_AY } from '../../config/tufeEndeks.ts';
import { pct, tl } from '../../content/vars.ts';

/** content.md: tüm rakamlar TÜFE endeks serisinden; "bugün" = yayımlanan son ay (derleme gününden bağımsız). */
export default function vars() {
  const sonYil = SON_AY.slice(0, 4);
  const sonAy = String(Number(SON_AY.slice(5)));
  const e = (tutar: number, basAy: string, basYil: string, ay = sonAy, yil = sonYil) =>
    calculateEnflasyon(enflasyonSchema.parse({ tutar, basAy, basYil, sonAy: ay, sonYil: yil }));
  const num = (n: number, d: number) => new Intl.NumberFormat('tr-TR', { maximumFractionDigits: d }).format(n);
  const pv = (prefix: string, r: ReturnType<typeof e>) => ({
    [`${prefix}.karsilik`]: tl(r.karsilik),
    [`${prefix}.aySayisi`]: String(r.aySayisi),
    [`${prefix}.donemEnflasyonu`]: pct(r.donemEnflasyonu),
    [`${prefix}.yillikOrtalama`]: pct(r.yillikOrtalama),
    [`${prefix}.alimGucuKaybi`]: pct(r.alimGucuKaybi),
    [`${prefix}.carpan`]: num(r.carpan, 2),
  });
  const o1 = e(1000, '1', '2020');
  const o2 = e(20000, '1', '2023');
  const o3 = e(100000, sonAy, sonYil, '1', '2015');

  const tablo = Array.from({ length: Number(sonYil) - 2004 + 1 }, (_, i) => {
    const y = String(2004 + i);
    const r = e(1000, '1', y);
    return `| Ocak ${y} | ${tl(r.karsilik)} | ${pct(r.donemEnflasyonu)} | ${pct(r.yillikOrtalama)} |`;
  }).join('\n');

  // Yıl sonu (Aralık) yıllık TÜFE: 2004 ve öncesinde TÜİK oranları 1994=100 serisinden açıkladığı için 2005'ten
  const yilSonu = Array.from({ length: Number(sonYil) - 2005 }, (_, i) => {
    const y = 2005 + i;
    return `| ${y} | ${pct(endeksAt(`${y}-12`)! / endeksAt(`${y - 1}-12`)! - 1)} |`;
  })
    .reverse()
    .join('\n');

  return {
    'enf.sonAy': ayAdi(SON_AY),
    'enf.baglama': num(BAGLAMA, 4),
    'enf.o1.endeksBas': num(o1.endeksBas, 2),
    'enf.o1.endeksSon': num(o1.endeksSon, 2),
    ...pv('enf.o1', o1),
    ...pv('enf.o2', o2),
    ...pv('enf.o3', o3),
    'enf.tablo': tablo,
    'enf.yilSonu': yilSonu,
  };
}
