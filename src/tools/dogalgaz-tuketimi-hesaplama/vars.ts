import { calculateDogalgaz, dogalgazFiyat, dogalgazTuketimiSchema } from '../../calculators/dogalgazTuketimi.ts';
import { BOTAS_KWH_SM3, IGDAS_UID_2026, igdasSkb, istanbulKademeLimit } from '../../config/enerji.ts';
import { date, exampleVars, pct, tl } from '../../content/vars.ts';

const n = (v: number, d = 2) => new Intl.NumberFormat('tr-TR', { maximumFractionDigits: d }).format(v);
const AYLAR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
const ayAdi = (iso: string) => `${AYLAR[Number(iso.slice(5, 7)) - 1]} ${iso.slice(0, 4)}`;

/** content.md: derleme ayındaki İstanbul (İGDAŞ) konut fiyatı ve kademe limitiyle örnekler, tablolar ve fiyat geçmişi. */
export default function vars(today: string) {
  const f = dogalgazFiyat(today);
  const limit = f.limit ?? undefined;
  /** lim: null → kademe yok (yalnız Kademe-1) */
  const h = (v: object, lim: number | null = limit ?? null) =>
    calculateDogalgaz(
      dogalgazTuketimiSchema.parse({
        mod: 'm3',
        verim: 90,
        faktor: BOTAS_KWH_SM3,
        fiyat: f.k1,
        fiyat2: f.k2,
        limit: lim ?? undefined,
        ...v,
      }),
      f.kdv,
    );
  const o1 = h({ m3: 100 });
  // Örnek 2: limiti %10 aşan tüketim (limit yoksa 150 m³)
  const asim = limit !== undefined ? Math.ceil(limit * 1.1) : 150;
  const o2 = h({ m3: asim });
  const o2k1 = h({ m3: asim }, null);
  const o3 = h({ mod: 'kombi', guc: 24, saat: 4 });
  const o4 = h({ mod: 'tl', butce: 2000 });

  const tablo = [25, 50, 75, 100, 150, 200, 300]
    .map((m) => {
      const k1 = h({ m3: m }, null);
      const k2 = h({ m3: m }, 0);
      return `| ${n(m, 0)} m³ | ${n(m * BOTAS_KWH_SM3, 0)} kWh | ${tl(k1.tl)} | ${tl(k2.tl)} |`;
    })
    .join('\n');

  // Son 12 ayın İstanbul Kademe-1 fiyatı (ayın 15'i)
  const aylar = igdasSkb.filter((p) => p.from <= today).slice(-12);
  const gecmis = aylar
    .map((p) => {
      const g = dogalgazFiyat(`${p.from.slice(0, 7)}-15`);
      return `| ${ayAdi(p.from)} | ${n(g.botas1, 4)} TL | ${n(g.skb, 4)} TL | ${n(g.otv, 4)} TL | **${n(g.k1, 4)} TL** |`;
    })
    .join('\n');

  const limitTablo = istanbulKademeLimit
    .filter((p) => p.value !== null && p.verified !== false)
    .map((p) => {
      const ay = Number(p.from.slice(5, 7));
      const gun = new Date(Date.UTC(Number(p.from.slice(0, 4)), ay, 0)).getUTCDate();
      return `| ${ayAdi(p.from)} | ${n(p.value!, 2)} m³ | ${n(Math.round((p.value! / gun) * 100) / 100, 2)} m³ |`;
    })
    .join('\n');

  return {
    'gaz.ay': ayAdi(today),
    'gaz.k1': `${n(f.k1, 4)} TL`,
    'gaz.k2': `${n(f.k2, 4)} TL`,
    'gaz.k1Kwh': `${n(f.k1 / BOTAS_KWH_SM3, 4)} TL`,
    'gaz.k1Haric': `${n(f.k1 / (1 + f.kdv), 4)} TL`,
    'gaz.botas1': `${n(f.botas1, 4)} TL`,
    'gaz.botas2': `${n(f.botas2, 4)} TL`,
    'gaz.skb': `${n(f.skb, 4)} TL`,
    'gaz.otv': `${n(f.otv, 4)} TL`,
    'gaz.kdv': pct(f.kdv),
    'gaz.kwhM3': n(BOTAS_KWH_SM3),
    'gaz.yuzKwh': `${n(100 * BOTAS_KWH_SM3, 0)} kWh`,
    'gaz.uidMin': n(IGDAS_UID_2026.min),
    'gaz.uidMax': n(IGDAS_UID_2026.max),
    'gaz.limit': limit !== undefined ? `${n(limit, 2)} m³` : 'uygulanmıyor',
    'gaz.tablo': tablo,
    'gaz.gecmis': gecmis,
    'gaz.gecmisBas': aylar.length ? date(aylar[0].from) : '',
    'gaz.limitTablo': limitTablo,
    ...exampleVars('gaz.o1', o1),
    'gaz.o2.m3': `${n(asim, 0)} m³`,
    'gaz.o2.tl': tl(o2.tl),
    'gaz.o2.k1': tl(o2k1.tl),
    'gaz.o2.fark': tl(o2.tl - o2k1.tl),
    'gaz.o3.m3Gun': `${n(o3.m3Gun!, 2)} m³`,
    'gaz.o3.m3': `${n(o3.m3, 0)} m³`,
    'gaz.o3.gazKwh': `${n(o3.isiGun! / 0.9, 1)} kWh`,
    'gaz.o3.tl': tl(o3.tl),
    'gaz.o3.kademe': String(o3.kademe),
    'gaz.o4.m3': `${n(o4.m3, 1)} m³`,
  };
}
