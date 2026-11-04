import { calculateAra, calculateEkle, tarihSchema, type AraResult, type EkleResult } from '../../calculators/tarih.ts';
import { date } from '../../content/vars.ts';

const n = (v: number) => new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 1 }).format(v);

/** content.md örnekleri: yıl ve "bugün" derleme gününe göre kayar. */
export default function vars(today: string) {
  const y = today.slice(0, 4);
  const ara = (v: object) => calculateAra(tarihSchema.parse({ mod: 'ara', ...v }) as never) as AraResult;
  const ekle = (v: object) => calculateEkle(tarihSchema.parse({ mod: 'ekle', ...v }) as never) as EkleResult;
  const yil = ara({ baslangic: `${y}-01-01`, bitis: `${y}-12-31`, bitisDahil: true });
  const bayram = ara({ baslangic: '2026-03-16', bitis: '2026-03-22', bitisDahil: true });
  const is = ekle({ tarih: today, islem: 'ekle', gun: 10, birim: 'is' });
  const takvim = ekle({ tarih: today, islem: 'ekle', gun: 10, birim: 'takvim' });
  return {
    'tarih.bugun': date(today),
    'tarih.yilNo': y,
    'tarih.yil.gun': n(yil.gun),
    'tarih.yil.isGunu': n(yil.isGunu),
    'tarih.yil.haftaSonu': n(yil.haftaSonu),
    'tarih.yil.tatil': n(yil.tatilGunu),
    'tarih.yil.yarim': n(yil.yarimGunler.length),
    'tarih.yil.net': n(yil.isGunu - yil.yarimGunler.length / 2),
    'tarih.bayram.isGunu': n(bayram.isGunu),
    'tarih.bayram.tatil': n(bayram.tatilGunu),
    'tarih.bayram.haftaSonu': n(bayram.haftaSonu),
    'tarih.is.sonuc': date(is.sonuc),
    'tarih.is.gunAdi': is.gunAdi,
    'tarih.is.takvim': n(is.takvimGunu),
    'tarih.takvim.sonuc': date(takvim.sonuc),
    'tarih.takvim.gunAdi': takvim.gunAdi,
  };
}
