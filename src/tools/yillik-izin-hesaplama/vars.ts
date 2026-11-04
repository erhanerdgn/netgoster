import { calculateYillikIzin, yillikIzinSchema } from '../../calculators/yillikIzin.ts';
import { isKanunu } from '../../config/parameters-2026.ts';

/** content.md: kademeler parametreden, örnekler derleme gününe göre kayan tarihlerle. */
export default function vars(today: string) {
  const y = Number(today.slice(0, 4));
  const c = (v: object) => calculateYillikIzin(yillikIzinSchema.parse({ tarih: today, ...v }));
  const k = isKanunu;
  const out: Record<string, string> = {
    'izin.yasAlt': String(k.izinYasAlt),
    'izin.yasUst': String(k.izinYasUst),
    'izin.yasMin': String(k.izinYasMinGun),
    'izin.yerAlti': String(k.yerAltiEk),
  };
  k.yillikIzin.forEach((s, i) => {
    out[`izin.k${i + 1}.yil`] = String(s.minYil);
    out[`izin.k${i + 1}.gun`] = String(s.gun);
  });
  const ornek = (p: string, v: object) => {
    const r = c(v);
    out[`${p}.gun`] = String(r.gun);
    out[`${p}.toplam`] = String(r.toplamHak);
    out[`${p}.sonraki`] = String(r.sonrakiGun);
    out[`${p}.kidem`] = String(r.kidemYil);
  };
  ornek('izin.ornek1', { giris: `${y - 3}-01-02`, dogum: '1992-06-10' });
  ornek('izin.ornek2', { giris: `${y - 7}-01-02`, dogum: '1985-09-20' });
  ornek('izin.ornek3', { giris: `${y - 2}-01-02`, dogum: `${y - 51}-01-01` });
  return out;
}
