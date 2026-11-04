import { calculateEmeklilik, emeklilikSchema } from '../../calculators/emeklilik.ts';
import { eytBagkurMemur, eytSsk, gecis1999, yeniSistem } from '../../config/emeklilik.ts';
import { date } from '../../content/vars.ts';

const n = (x: number) => new Intl.NumberFormat('tr-TR').format(x);

/** content.md: kurallar config’ten, örnekler derleme gününe göre hesaplanır. */
export default function vars(today: string) {
  const e = (v: object) => calculateEmeklilik(emeklilikSchema.parse(v), today);
  const ex = (prefix: string, v: object) => {
    const r = e(v);
    const gun = r.secilen.sartlar.find((s) => s.tip === 'gun')!;
    const yas = r.secilen.sartlar.find((s) => s.tip === 'yas');
    return {
      [`${prefix}.gerekliGun`]: n(gun.gerekli),
      [`${prefix}.eksikGun`]: n(r.eksikGun),
      // ilk (ana) yolun gün şartı tarihi — geçiş dönemi örneğinde alternatif yolla karşılaştırma için
      [`${prefix}.gunTarih`]: date(r.yollar[0].sartlar.find((s) => s.tip === 'gun')!.tarih ?? today),
      [`${prefix}.yas`]: yas ? String(yas.gerekli) : '-',
      [`${prefix}.tarih`]: r.emeklilikTarihi ? date(r.emeklilikTarihi) : '-',
      [`${prefix}.emeklilikYasi`]: String(r.emeklilikYasi ?? '-'),
      [`${prefix}.yil`]: String(r.tamamlanmaYili ?? '-'),
    };
  };
  const ilk = (k: { gun: number }[]) => k[0].gun;
  const son = (k: { gun: number }[]) => k[k.length - 1].gun;

  let alt = 0;
  const satirlar = yeniSistem.yasTablosu.map(([ub, k, er]) => {
    const aralik = alt === 0 ? `${ub} ve öncesi` : ub === 9999 ? `${alt} ve sonrası` : `${alt} – ${ub}`;
    alt = ub + 1;
    return `| ${aralik} | ${k} | ${er} |`;
  });

  return {
    'em.eytKadinSure': String(eytSsk.kadin.sureYil),
    'em.eytErkekSure': String(eytSsk.erkek.sureYil),
    'em.eytKadinMin': n(ilk(eytSsk.kadin.kademeler)),
    'em.eytKadinMax': n(son(eytSsk.kadin.kademeler)),
    'em.eytErkekMin': n(ilk(eytSsk.erkek.kademeler)),
    'em.eytErkekMax': n(son(eytSsk.erkek.kademeler)),
    'em.eytBKKadin': n(eytBagkurMemur.kadin.gun),
    'em.eytBKErkek': n(eytBagkurMemur.erkek.gun),
    'em.gecisYasK': String(gecis1999['4a'].yasK),
    'em.gecisYasE': String(gecis1999['4a'].yasE),
    'em.gecis4aGun': n(gecis1999['4a'].gun),
    'em.gecisAltSure': String(gecis1999['4a'].alternatif.sureYil),
    'em.gecisAltGun': n(gecis1999['4a'].alternatif.gun),
    'em.gecis4bGun': n(gecis1999['4b'].gun),
    'em.yeni4aGun': n(yeniSistem.gun['4a']),
    'em.yeni4bGun': n(yeniSistem.gun['4b']),
    'em.yeniIlkYasK': String(yeniSistem.yasTablosu[0][1]),
    'em.yeniIlkYasE': String(yeniSistem.yasTablosu[0][2]),
    'em.yeniSonYas': String(yeniSistem.yasTablosu[yeniSistem.yasTablosu.length - 1][1]),
    'em.yasTablosu': ['| Prim günü şartının tamamlandığı yıl | Kadın | Erkek |', '| --- | --- | --- |', ...satirlar].join('\n'),
    ...ex('em.a', { tur: '4a', cinsiyet: 'erkek', dogum: '1979-05-10', giris: '1998-01-15', primGun: 5000 }),
    ...ex('em.b', { tur: '4a', cinsiyet: 'erkek', dogum: '1968-03-20', giris: '2000-01-10', primGun: 5000 }),
    ...ex('em.c', { tur: '4b', cinsiyet: 'kadin', dogum: '1995-07-07', giris: '2020-01-01', primGun: 1800 }),
  };
}
