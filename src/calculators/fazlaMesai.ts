import { z } from 'zod';
import { DATA_YEAR, isKanunu } from '../config/parameters-2026.ts';
import { ayBordrosu, kurus, yillikBordro } from './bordro.ts';
import { zMoney, zNumber } from './common.ts';

export const fazlaMesaiSchema = z.object({
  brut: zMoney('Brüt maaş', { min: 1 }),
  fmSaat: zNumber('Fazla mesai saati', { max: 400 }).default(0),
  fsSaat: zNumber('Fazla süreli çalışma saati', { max: 400 }).default(0),
  bayramGun: zNumber('Bayram/genel tatil günü', { max: 31, int: true }).default(0),
  haftaTatiliGun: zNumber('Hafta tatili günü', { max: 6, int: true }).default(0),
  ay: z.string().regex(/^([1-9]|1[0-2])$/, 'Ay seçin'),
  yil: zNumber('Yıl', { min: 2025, max: 2100, int: true }).default(DATA_YEAR),
});

export type FazlaMesaiInput = z.input<typeof fazlaMesaiSchema>;

/**
 * İK md. 41 (fazla mesai %50, fazla süreli çalışma %25), md. 47 (UBGT: her gün için +1 günlük ücret),
 * hafta tatili çalışması %50 zamlı günlük ücret. Saatlik = brüt / 225, günlük = brüt / 30.
 * Net: ek ödeme seçilen ayın maaşına eklenir; aynı brütle önceki ayların kümülatif matrahı kullanılır,
 * net fark = (maaş + ek) neti − maaş neti (SGK tavanı ve asgari ücret istisnası bordro motorunda).
 */
export function calculateFazlaMesai(input: z.output<typeof fazlaMesaiSchema>) {
  const k = isKanunu;
  const ay = Number(input.ay);
  const saatlikHam = input.brut / k.aylikSaat;
  const gunlukHam = input.brut / 30;
  const fm = kurus(saatlikHam * (1 + k.fazlaMesaiZam) * input.fmSaat);
  const fs = kurus(saatlikHam * (1 + k.fazlaSurelerZam) * input.fsSaat);
  const bayram = kurus(gunlukHam * input.bayramGun);
  const haftaTatili = kurus(gunlukHam * (1 + k.fazlaMesaiZam) * input.haftaTatiliGun);
  const ek = kurus(fm + fs + bayram + haftaTatili);
  const kumOnceki = ay > 1 ? yillikBordro(input.yil, input.brut).aylar[ay - 2].kumMatrah : 0;
  const maas = ayBordrosu({ yil: input.yil, ay, brut: input.brut, kumOnceki });
  const toplam = ayBordrosu({ yil: input.yil, ay, brut: kurus(input.brut + ek), kumOnceki });
  const fark = (a: number, b: number) => kurus(a - b);
  return {
    saatlik: kurus(saatlikHam),
    gunluk: kurus(gunlukHam),
    fm,
    fs,
    bayram,
    haftaTatili,
    ek,
    sgk: fark(toplam.sgkIsci + toplam.issizlikIsci, maas.sgkIsci + maas.issizlikIsci),
    gv: fark(toplam.gv, maas.gv),
    dv: fark(toplam.dv, maas.dv),
    netEk: fark(toplam.net, maas.net),
    maasNet: maas.net,
    toplamNet: toplam.net,
    yillikSinirAsimi: input.fmSaat * 12 > k.yillikFazlaMesaiSiniri,
  };
}
