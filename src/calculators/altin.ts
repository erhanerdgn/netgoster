import { z } from 'zod';
import { altinTurleri, type AltinTuru } from '../config/altin.ts';
import { todayISO, valueAt } from '../config/period.ts';
import { round2, zMoney, zNumber } from './common.ts';

export const altinTuruKodlari = ['gram24', 'ayar22', 'ayar18', 'ayar14', 'ceyrek', 'yarim', 'tam', 'cumhuriyet'] as const;

export const altinTanimlari = (date = todayISO()) => valueAt(altinTurleri, date);

export const altinSchema = z
  .object({
    tur: z.enum(altinTuruKodlari),
    miktar: zNumber('Miktar', { min: 0.001, max: 1e6 }),
    kaynak: z.enum(['canli', 'elle']),
    /** Kullanıcının gram fiyatı: 24 ayar (995) gram altın, ₺/g */
    gramFiyat: zMoney('Gram altın fiyatı', { min: 0.01 }).optional(),
  })
  .superRefine((v, ctx) => {
    if (altinTanimlari()[v.tur as AltinTuru].adet && !Number.isInteger(v.miktar))
      ctx.addIssue({ code: 'custom', path: ['miktar'], message: 'Adet tam sayı olmalı' });
    if (v.kaynak === 'elle' && v.gramFiyat === undefined)
      ctx.addIssue({ code: 'custom', path: ['gramFiyat'], message: 'Gram altın fiyatını girin' });
  });

export type AltinInput = z.input<typeof altinSchema>;

export interface AltinResult {
  /** Hesapta kullanılan has (1000/1000) altın gram değeri, ₺ */
  hasGram: number;
  /** 'canli': /api/altin; 'elle': kullanıcı fiyatı; 'elleYedek': canlı istendi ama veri yok, kullanıcı fiyatı */
  fiyatKaynagi: 'canli' | 'elle' | 'elleYedek';
  /** 1 adet (veya 1 gram) değeri */
  birimDeger: number;
  toplam: number;
  brutGram: number;
  hasGramMiktar: number;
  milyem: number;
}

export class FiyatYokHatasi extends Error {}

/**
 * Altın değeri (saf): değer = miktar × brüt gram × milyem × has gram fiyatı.
 * - Canlı has fiyat parametre olarak gelir (/api/altin gram24 = ons USD × USD/TRY ÷ 31,1034768).
 * - Kullanıcı fiyatı 24 ayar (995) gram altın fiyatıdır → has = fiyat ÷ 0,995.
 * - Canlı fiyat yoksa ve kullanıcı fiyatı girilmişse ona düşer; ikisi de yoksa FiyatYokHatasi.
 */
export function calculateAltin(input: z.output<typeof altinSchema>, canliHasGram: number | null, date = todayISO()): AltinResult {
  const t = altinTanimlari(date);
  const elleHas = input.gramFiyat !== undefined ? input.gramFiyat / t.gram24.milyem : null;
  let hasGram: number;
  let fiyatKaynagi: AltinResult['fiyatKaynagi'];
  if (input.kaynak === 'canli' && canliHasGram) {
    hasGram = canliHasGram;
    fiyatKaynagi = 'canli';
  } else if (elleHas !== null) {
    hasGram = elleHas;
    fiyatKaynagi = input.kaynak === 'canli' ? 'elleYedek' : 'elle';
  } else {
    throw new FiyatYokHatasi('Canlı altın fiyatı alınamadı; gram altın fiyatını elle girin');
  }
  const d = t[input.tur];
  const brutGram = input.miktar * d.gram;
  const hasGramMiktar = brutGram * d.milyem;
  return {
    hasGram: round2(hasGram),
    fiyatKaynagi,
    birimDeger: round2(d.gram * d.milyem * hasGram),
    toplam: round2(hasGramMiktar * hasGram),
    brutGram: Math.round(brutGram * 1000) / 1000,
    hasGramMiktar: Math.round(hasGramMiktar * 10000) / 10000,
    milyem: d.milyem,
  };
}

/** /api/altin yanıtı (src/worker/rates.ts → loadGold + fetchedAt/stale) */
export interface AltinFiyati {
  source: string;
  ounceUsd: number;
  usdTry: number;
  /** Has (saf) altın TL/gram */
  gram24: number;
  priceAt: string | null;
  usdDate: string;
  fetchedAt: string;
  stale: boolean;
}
