import { CIHAZLAR, cihazTuketimi, elektrikFaturasi, klimaWatt, meskenBirimFiyat } from '../../calculators/elektrikTuketimi.ts';
import { addDays } from '../../calculators/common.ts';
import { elektrikMesken, elektrikVergi, skttMeskenLimit } from '../../config/enerji.ts';
import { periodAt, valueAt } from '../../config/period.ts';
import { date, exampleVars, pct, tl } from '../../content/vars.ts';

const n = (v: number, d = 2) => new Intl.NumberFormat('tr-TR', { maximumFractionDigits: d }).format(v);
const kr = (v: number) => `${n(v, 4)} kr`;

/** content.md: güncel EPDK mesken tarifesi, cihaz tablosu ve örnekler derleme günündeki tarifeyle hesaplanır. */
export default function vars(today: string) {
  const p = periodAt(elektrikMesken, today);
  const t = p.value;
  const vg = valueAt(elektrikVergi, today);
  const dusuk = meskenBirimFiyat(today);
  const yuksek = meskenBirimFiyat(today, 'yuksek');
  const fatura = (kwh: number) => elektrikFaturasi({ tarife: 'tek', tarih: today, gun: 30, kwh });

  const o1 = cihazTuketimi(CIHAZLAR.klima12.watt, 8, 30, dusuk);
  const o2 = fatura(300);
  const o3 = elektrikFaturasi({ tarife: 'uc', tarih: today, gun: 30, gunduz: 150, puant: 80, gece: 70 });
  const buz = cihazTuketimi(CIHAZLAR.buzdolabi.watt, 24, 30, dusuk);

  const cihazTablo = Object.values(CIHAZLAR)
    .map((c) => {
      const r = cihazTuketimi(c.watt, c.saat, 30, dusuk);
      return `| ${c.label} | ${n(c.watt, 0)} W | ${n(c.saat)} saat | ${n(r.kwh, 1)} kWh | ${tl(r.tlSaat)} | ${tl(r.tl)} |`;
    })
    .join('\n');

  const klimaTablo = [9000, 12000, 18000, 24000]
    .map((btu) => {
      const w = Math.round(klimaWatt(btu) / 10) * 10;
      const r = cihazTuketimi(w, 8, 30, dusuk);
      return `| ${n(btu, 0)} BTU | ≈ ${n(w, 0)} W | ${tl(r.tlSaat)} | ${tl(r.tlGun)} | ${tl(r.tl)} |`;
    })
    .join('\n');

  const faturaTablo = [100, 150, 200, 240, 300, 400, 500]
    .map((k) => {
      const r = fatura(k);
      return `| ${n(k, 0)} kWh | ${tl(r.enerji)} | ${tl(r.dagitim)} | ${tl(r.tuketimVergisi + r.kdv)} | **${tl(r.toplam)}** |`;
    })
    .join('\n');

  const gecmis = elektrikMesken
    .map(
      (d) =>
        `| ${date(d.from)} – ${d.to ? date(d.to) : 'bugün'} | ${kr(d.value.tekDusuk)} | ${kr(d.value.tekYuksek)} | ${kr(d.value.dagitim)} | ${tl(elektrikFaturasi({ tarife: 'tek', tarih: d.from, gun: 30, kwh: 100 }).toplam)} |`,
    )
    .join('\n');

  const yil = Number(today.slice(0, 4));
  const sonrakiLimit = periodAt(skttMeskenLimit, `${yil + 1}-01-01`);

  return {
    'elk.baslangic': date(p.from),
    'elk.dusuk': `${n(dusuk, 3)} TL`,
    'elk.yuksek': `${n(yuksek, 3)} TL`,
    'elk.enerjiDusuk': kr(t.tekDusuk),
    'elk.enerjiYuksek': kr(t.tekYuksek),
    'elk.dagitim': kr(t.dagitim),
    'elk.gunduz': kr(t.gunduz),
    'elk.puant': kr(t.puant),
    'elk.gece': kr(t.gece),
    'elk.gunduzTop': `${n(((t.gunduz * (1 + vg.tuketimVergisi) + t.dagitim) * (1 + vg.kdv)) / 100, 3)} TL`,
    'elk.puantTop': `${n(((t.puant * (1 + vg.tuketimVergisi) + t.dagitim) * (1 + vg.kdv)) / 100, 3)} TL`,
    'elk.geceTop': `${n(((t.gece * (1 + vg.tuketimVergisi) + t.dagitim) * (1 + vg.kdv)) / 100, 3)} TL`,
    'elk.kademe': n(t.kademeGunluk),
    'elk.kademeAy': n(t.kademeGunluk * 30),
    'elk.btv': pct(vg.tuketimVergisi),
    'elk.kdv': pct(vg.kdv),
    'elk.sktt': n(valueAt(skttMeskenLimit, today), 0),
    'elk.skttAylik': n(valueAt(skttMeskenLimit, today) / 12, 0),
    'elk.skttSonraki': n(sonrakiLimit.value, 0),
    'elk.skttSonrakiYil': sonrakiLimit.from > today ? String(yil + 1) : String(yil),
    'elk.yuz': tl(fatura(100).toplam),
    'elk.sarj40': tl(40 * dusuk),
    'elk.cihazTablo': cihazTablo,
    'elk.klimaTablo': klimaTablo,
    'elk.faturaTablo': faturaTablo,
    'elk.gecmis': gecmis,
    'elk.buzKwh': `${n(buz.kwh, 1)} kWh`,
    'elk.buzYil': `${n(buz.kwhGun * 365, 0)} kWh`,
    'elk.buzTl': tl(buz.tl),
    ...exampleVars('elk.o1', o1),
    'elk.o1.kwh': `${n(o1.kwh, 0)} kWh`,
    'elk.o1.kwhSaat': `${n(o1.kwhSaat, 2)} kWh`,
    'elk.o1.watt': `${n(CIHAZLAR.klima12.watt, 0)} W`,
    'elk.buzW': `${n(CIHAZLAR.buzdolabi.watt, 0)} W`,
    ...exampleVars('elk.o2', o2),
    'elk.o2.yuksekKwh': n(o2.yuksekKwh),
    'elk.o2.vergiKdv': tl(o2.tuketimVergisi + o2.kdv),
    ...exampleVars('elk.o3', o3),
    'elk.o3.fark': tl(Math.abs(o3.toplam - o2.toplam)),
    'elk.o3.durum': o3.toplam > o2.toplam ? 'daha pahalıdır' : 'daha ucuzdur',
    // Örnek tarih: geçmiş fatura kontrolü için bir yıl önceki tarife
    'elk.gecenYil': tl(elektrikFaturasi({ tarife: 'tek', tarih: addDays(today, -365), gun: 30, kwh: 300 }).toplam),
  };
}
