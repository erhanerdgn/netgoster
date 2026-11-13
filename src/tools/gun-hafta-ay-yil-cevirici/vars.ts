import { calculateZamanCevirici, sayi, zamanCeviriciSchema, type Birim } from '../../calculators/zamanCevirici.ts';
import { date } from '../../content/vars.ts';

const c = (deger: number, birim: Birim, baslangic?: string) =>
  calculateZamanCevirici(zamanCeviriciSchema.parse({ deger, birim, baslangic }));

/** 30 günlük ay kabulüyle: 249 → "8 ay 9 gün" */
const ay30 = (g: number) => `${Math.floor(g / 30)} ay ${g % 30} gün`;

const GUNLER = [7, 10, 14, 15, 20, 21, 28, 30, 40, 45, 60, 90, 100, 120, 150, 180, 200, 240, 249, 270, 280, 300, 365, 500, 1000];
const HAFTALAR = [4, 8, 12, 16, 20, 24, 30, 36, 40, 52];
const SAATLER = [24, 48, 72, 100, 168, 720];

/** content.md: örnekler ve popüler değer tabloları hesaplayıcıdan üretilir (tarihler sabit örnek tarihlerdir). */
export default function vars() {
  const gunTablo = GUNLER.map((g) => {
    const r = c(g, 'gun');
    const bilesik = g >= 365 ? r.yilAyGun : g >= 30 ? r.ayGun : '—';
    return `| ${sayi(g)} gün | ${r.haftaGun} | ${sayi(r.karsilik.ay)} ay | ${bilesik} | ${sayi(r.ay30)} ay | ${sayi(r.karsilik.yil)} yıl |`;
  }).join('\n');
  const haftaTablo = HAFTALAR.map((h) => {
    const r = c(h, 'hafta');
    return `| ${h} hafta | ${sayi(r.gun)} gün | ${sayi(r.karsilik.ay)} ay | ${r.gun >= 30 ? r.ayGun : '—'} |`;
  }).join('\n');
  const saatTablo = SAATLER.map((s) => {
    const r = c(s, 'saat');
    return `| ${s} saat | ${sayi(r.gun)} gün | ${r.gunSaat} | ${sayi(r.karsilik.dakika)} dakika |`;
  }).join('\n');

  const g249 = c(249, 'gun');
  const g100 = c(100, 'gun');
  const h40 = c(40, 'hafta');
  const s100 = c(100, 'saat');
  const t249a = c(249, 'gun', '2026-01-01').takvim!;
  const t249b = c(249, 'gun', '2026-03-01').takvim!;
  const ay6a = c(6, 'ay', '2026-01-01');
  const ay6b = c(6, 'ay', '2026-07-01').takvim!;

  return {
    'zc.tablo.gun': gunTablo,
    'zc.tablo.hafta': haftaTablo,
    'zc.tablo.saat': saatTablo,
    'zc.249.ayGun': g249.ayGun,
    'zc.249.ay': sayi(g249.karsilik.ay),
    'zc.249.haftaGun': g249.haftaGun,
    'zc.249.ay30': sayi(g249.ay30),
    'zc.249.ay30Gun': ay30(249),
    'zc.100g.haftaGun': g100.haftaGun,
    'zc.100g.ay': sayi(g100.karsilik.ay),
    'zc.100g.ayGun': g100.ayGun,
    'zc.100g.ay30Gun': ay30(100),
    'zc.ay.hafta': sayi(c(1, 'ay').karsilik.hafta),
    'zc.249.takvimA.bitis': date(t249a.bitis),
    'zc.249.takvimA.metin': t249a.metin,
    'zc.249.takvimB.bitis': date(t249b.bitis),
    'zc.249.takvimB.metin': t249b.metin,
    'zc.40h.gun': sayi(h40.gun),
    'zc.40h.ayGun': h40.ayGun,
    'zc.40h.ay': sayi(h40.karsilik.ay),
    'zc.100s.gunSaat': s100.gunSaat,
    'zc.100s.gun': sayi(s100.gun),
    'zc.6ay.ort': sayi(ay6a.gun),
    'zc.6ay.gelenek': sayi(ay6a.gunGelenek!),
    'zc.6ay.takvimA': sayi(ay6a.takvim!.gun),
    'zc.6ay.takvimB': sayi(ay6b.gun),
  };
}
