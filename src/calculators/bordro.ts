/**
 * Ortak bordro motoru (saf fonksiyonlar). Brütten nete, netten brüte, asgari ücret, işveren maliyeti,
 * ihbar ve fazla mesai araçları aynı hesapları buradan kullanır.
 *
 * Bir ayın bordrosu:
 * - SGK matrahı = min(brüt, PEK tavanı); işçi SGK %14 + işsizlik %1 (5510 md. 81–82, 4447 md. 49)
 * - GV matrahı = brüt − işçi SGK − işçi işsizlik; vergi KÜMÜLATİF matraha tarife uygulanarak bulunur (GVK md. 103)
 * - Asgari ücret istisnası (GVK md. 23/18): asgari ücretin GV matrahına (aynı yolla kümülatif) düşen vergi
 *   o ayın vergisinden düşülür; damga vergisinde asgari ücretin damga vergisi kadar istisna (DVK md. 9/b)
 * - İşveren: SGK işveren + işsizlik işveren − (isteğe bağlı) hazine indirimi
 */
import {
  asgariUcret,
  damgaVergisiUcret,
  gelirVergisiUcret,
  sgkOranlari,
  sgkTabanTavan,
  type Bracket,
} from '../config/parameters-2026.ts';
import { valueAt } from '../config/period.ts';
/**
 * Kuruşa yuvarlama (yarım kuruş yukarı). Kümülatif vergi farkları kayan nokta gürültüsü taşır
 * (16.845,30 − 12.633,975 = 4.211,324999…); common.round2 bunu 4.211,32'ye yuvarlar, burada önce gürültü temizlenir.
 */
export const kurus = (x: number) => Math.round(Number((x * 100).toFixed(6))) / 100;

export type Tesvik = 'yok' | 'genel' | 'imalat';

/** yıl + ay (1–12) → o ayın ilk günü (parametre dönemi seçimi için) */
export const ayTarihi = (yil: number, ay: number) => `${yil}-${String(ay).padStart(2, '0')}-01`;

/** Bir matraha tarifenin tamamını uygular (yuvarlamasız) */
export function vergiTarife(matrah: number, tarife: Bracket[]): number {
  let vergi = 0;
  let alt = 0;
  for (const d of tarife) {
    if (matrah <= alt) break;
    vergi += (Math.min(matrah, d.upTo) - alt) * d.rate;
    alt = d.upTo;
  }
  return vergi;
}

/** Kümülatif matrahı `kumOnceki` olan kişiye `matrah` eklendiğinde doğan gelir vergisi (tarih: tarife dönemi) */
export function gelirVergisiFarki(kumOnceki: number, matrah: number, tarih: string): number {
  const tarife = valueAt(gelirVergisiUcret, tarih);
  return kurus(vergiTarife(kumOnceki + matrah, tarife) - vergiTarife(kumOnceki, tarife));
}

/** Asgari ücretin o ayki GV matrahı (brüt − %14 − %1) */
export function asgariGvMatrahi(yil: number, ay: number): number {
  const t = ayTarihi(yil, ay);
  const au = valueAt(asgariUcret, t).brutAylik;
  const o = valueAt(sgkOranlari, t);
  return kurus(au - kurus(au * o.isciSgk) - kurus(au * o.isciIssizlik));
}

/** Ayın asgari ücret GV ve DV istisnası (asgari ücretin kümülatif matrahına tarife uygulanarak) */
export function asgariIstisna(yil: number, ay: number): { gv: number; dv: number } {
  let kum = 0;
  for (let m = 1; m < ay; m++) kum += asgariGvMatrahi(yil, m);
  const t = ayTarihi(yil, ay);
  return {
    gv: gelirVergisiFarki(kum, asgariGvMatrahi(yil, ay), t),
    dv: kurus(valueAt(asgariUcret, t).brutAylik * valueAt(damgaVergisiUcret, t)),
  };
}

export interface AyBordro {
  ay: number;
  brut: number;
  sgkMatrah: number;
  sgkIsci: number;
  issizlikIsci: number;
  gvMatrah: number;
  /** bu ay dahil kümülatif GV matrahı */
  kumMatrah: number;
  gvHesaplanan: number;
  gvIstisna: number;
  gv: number;
  dvHesaplanan: number;
  dvIstisna: number;
  dv: number;
  net: number;
  sgkIsveren: number;
  issizlikIsveren: number;
  hazineIndirimi: number;
  /** brüt + işveren SGK + işveren işsizlik − hazine indirimi */
  maliyet: number;
}

export interface AyGirdi {
  yil: number;
  ay: number;
  brut: number;
  /** önceki ayların kümülatif GV matrahı */
  kumOnceki?: number;
  tesvik?: Tesvik;
}

export function ayBordrosu({ yil, ay, brut, kumOnceki = 0, tesvik = 'yok' }: AyGirdi): AyBordro {
  const t = ayTarihi(yil, ay);
  const o = valueAt(sgkOranlari, t);
  const sgkMatrah = Math.min(brut, valueAt(sgkTabanTavan, t).tavan);
  const sgkIsci = kurus(sgkMatrah * o.isciSgk);
  const issizlikIsci = kurus(sgkMatrah * o.isciIssizlik);
  const gvMatrah = kurus(brut - sgkIsci - issizlikIsci);
  const gvHesaplanan = gelirVergisiFarki(kumOnceki, gvMatrah, t);
  const ist = asgariIstisna(yil, ay);
  const gvIstisna = Math.min(ist.gv, gvHesaplanan);
  const gv = kurus(gvHesaplanan - gvIstisna);
  const dvHesaplanan = kurus(brut * valueAt(damgaVergisiUcret, t));
  const dvIstisna = Math.min(ist.dv, dvHesaplanan);
  const dv = kurus(dvHesaplanan - dvIstisna);
  const sgkIsveren = kurus(sgkMatrah * o.isverenSgk);
  const issizlikIsveren = kurus(sgkMatrah * o.isverenIssizlik);
  const indirimOrani = tesvik === 'imalat' ? o.hazineIndirimiImalat : tesvik === 'genel' ? o.hazineIndirimi : 0;
  const hazineIndirimi = kurus(sgkMatrah * indirimOrani);
  return {
    ay,
    brut,
    sgkMatrah,
    sgkIsci,
    issizlikIsci,
    gvMatrah,
    kumMatrah: kurus(kumOnceki + gvMatrah),
    gvHesaplanan,
    gvIstisna,
    gv,
    dvHesaplanan,
    dvIstisna,
    dv,
    net: kurus(brut - sgkIsci - issizlikIsci - gv - dv),
    sgkIsveren,
    issizlikIsveren,
    hazineIndirimi,
    maliyet: kurus(brut + sgkIsveren + issizlikIsveren - hazineIndirimi),
  };
}

export type BordroToplam = Omit<AyBordro, 'ay' | 'kumMatrah'>;

/** 12 ayın bordrosu (kümülatif matrah Ocak'ta sıfırdan başlar). `brut`: her ay aynı tutar ya da 12 elemanlı dizi. */
export function yillikBordro(yil: number, brut: number | number[], tesvik: Tesvik = 'yok') {
  const aylar: AyBordro[] = [];
  let kum = 0;
  for (let ay = 1; ay <= 12; ay++) {
    const b = ayBordrosu({ yil, ay, brut: Array.isArray(brut) ? brut[ay - 1] : brut, kumOnceki: kum, tesvik });
    kum = b.kumMatrah;
    aylar.push(b);
  }
  return { aylar, toplam: toplamBordro(aylar) };
}

export function toplamBordro(aylar: AyBordro[]): BordroToplam {
  const keys = Object.keys(aylar[0]).filter((k) => k !== 'ay' && k !== 'kumMatrah') as (keyof BordroToplam)[];
  const out = {} as BordroToplam;
  for (const k of keys) out[k] = kurus(aylar.reduce((s, a) => s + a[k], 0));
  return out;
}

/** Teşvik seçenekleri (etiketler parametredeki puanlardan) */
export function tesvikSecenekleri(tarih: string): { value: Tesvik; label: string }[] {
  const o = valueAt(sgkOranlari, tarih);
  const puan = (r: number) => `${Math.round(r * 10000) / 100} puan`;
  return [
    { value: 'yok', label: 'Yok' },
    { value: 'genel', label: puan(o.hazineIndirimi) },
    { value: 'imalat', label: `İmalat ${puan(o.hazineIndirimiImalat)}` },
  ];
}
