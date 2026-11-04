import { calculateYas, yasSchema } from '../../calculators/yas.ts';
import { date } from '../../content/vars.ts';

const n = (v: number) => new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 }).format(v);

/** content.md örnekleri: 1. örnek derleme gününe göre hesaplanır. */
export default function vars(today: string) {
  const y = (v: object) => calculateYas(yasSchema.parse(v));
  const out: Record<string, string> = { 'yas.bugun': date(today) };
  const add = (p: string, r: ReturnType<typeof calculateYas>) => {
    Object.assign(out, {
      [`${p}.yil`]: n(r.yas.years),
      [`${p}.ay`]: n(r.yas.months),
      [`${p}.gun`]: n(r.yas.days),
      [`${p}.toplamGun`]: n(r.toplamGun),
      [`${p}.toplamAy`]: n(r.toplamAy),
      [`${p}.hafta`]: n(r.toplamHafta.weeks),
      [`${p}.saat`]: n(r.toplamSaat),
      [`${p}.kalan`]: n(r.kalanGun),
      [`${p}.sonraki`]: date(r.sonrakiDogumGunu),
      [`${p}.sonrakiGun`]: r.sonrakiGunAdi,
      [`${p}.dogumGunu`]: r.dogumGunu,
    });
  };
  add('yas.ornek1', y({ dogum: '1990-05-15', tarih: today }));
  add('yas.ornek2', y({ dogum: '2000-02-29', tarih: '2027-02-28' }));
  add('yas.ornek3', y({ dogum: '2000-02-29', tarih: '2027-03-01' }));
  return out;
}
