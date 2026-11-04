import { z } from 'zod';
import { asgariUcret, asgariUcretDestegi, isKanunu } from '../config/parameters-2026.ts';
import { periodAt, valueAt } from '../config/period.ts';
import { ayTarihi, kurus, yillikBordro, type Tesvik } from './bordro.ts';
import { zDate } from './common.ts';

export const asgariUcretSchema = z.object({
  tarih: zDate('Dönem'),
  tesvik: z.enum(['yok', 'genel', 'imalat']).default('yok'),
});

export type AsgariUcretInput = z.input<typeof asgariUcretSchema>;

/** Tarih serinin kapsadığı dönemde değilse 0 (destek her yıl yeniden belirlenir; yoksa varsayılmaz). */
function destekAt(tarih: string): number {
  const p = periodAt(asgariUcretDestegi, tarih);
  return tarih >= p.from && (!p.to || tarih <= p.to) ? p.value : 0;
}

/** Asgari ücretlinin seçilen aydaki bordrosu (yıl boyu asgari ücretle çalıştığı varsayılır) ve işveren maliyeti. */
export function calculateAsgariUcret(input: z.output<typeof asgariUcretSchema>) {
  const yil = Number(input.tarih.slice(0, 4));
  const ay = Number(input.tarih.slice(5, 7));
  const brutler = Array.from({ length: 12 }, (_, i) => valueAt(asgariUcret, ayTarihi(yil, i + 1)).brutAylik);
  const { aylar, toplam } = yillikBordro(yil, brutler, input.tesvik as Tesvik);
  const b = aylar[ay - 1];
  const destek = destekAt(input.tarih);
  const saat = isKanunu.aylikSaat;
  return {
    yil,
    ay,
    bordro: b,
    brutGunluk: valueAt(asgariUcret, input.tarih).brutGunluk,
    netGunluk: kurus(b.net / 30),
    brutSaatlik: kurus(b.brut / saat),
    netSaatlik: kurus(b.net / saat),
    yillikBrut: toplam.brut,
    yillikNet: toplam.net,
    yillikMaliyet: toplam.maliyet,
    destek,
    destekliMaliyet: kurus(b.maliyet - destek),
  };
}
