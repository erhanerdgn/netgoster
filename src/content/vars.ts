/**
 * İçerik (content.md) yer tutucuları: {{anahtar}} → güncel parametreden biçimlenmiş metin.
 * Derleme anında (vite.config.ts) çalışır; tarih = derleme günü. Rakamları md dosyasına ELLE YAZMAYIN,
 * buraya anahtar ekleyin — parametre güncellenince tüm metinler kendiliğinden güncellenir.
 * Not: Bu dosya Vite config içinden yüklendiği için yalnız göreli import kullanır ('@/' takma adı yok).
 */
import * as P from '../config/parameters-2026.ts';
import { periodAt, todayISO, valueAt } from '../config/period.ts';
import { tufe } from '../config/tufe.ts';

export const tl = (n: number) =>
  new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n) + ' TL';
export const tl0 = (n: number) => new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 }).format(n) + ' TL';
export const pct = (r: number) => '%' + new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 2 }).format(r * 100);
export const date = (iso: string) => iso.split('-').reverse().join('.');

/** Hesaplanmış bir örneğin sayısal alanlarını `önek.alan` → "1.234,56 TL" olarak ekler (araç vars.ts dosyaları için) */
export function exampleVars(prefix: string, obj: object, fmt: (n: number) => string = tl): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, val] of Object.entries(obj)) if (typeof val === 'number') out[`${prefix}.${k}`] = fmt(val);
  return out;
}

export function contentVars(today = todayISO()): Record<string, string> {
  const au = valueAt(P.asgariUcret, today);
  const sgk = valueAt(P.sgkOranlari, today);
  const pek = valueAt(P.sgkTabanTavan, today);
  const gv = valueAt(P.gelirVergisiUcret, today);
  const dv = valueAt(P.damgaVergisiUcret, today);
  const kt = periodAt(P.kidemTavani, today);
  const io = valueAt(P.issizlikOdenegi, today);
  const bk = valueAt(P.bagkur, today);
  const year = String(P.DATA_YEAR);

  const asgariNet = au.brutAylik * (1 - sgk.isciSgk - sgk.isciIssizlik);
  const kidemPeriods = P.kidemTavani.filter((p) => p.from.startsWith(year));

  const v: Record<string, string> = {
    yil: year,
    'asgari.brut': tl(au.brutAylik),
    'asgari.net': tl(asgariNet),
    'asgari.gunluk': tl(au.brutGunluk),
    'sgk.isci': pct(sgk.isciSgk),
    'sgk.isciIssizlik': pct(sgk.isciIssizlik),
    'sgk.isciToplam': pct(sgk.isciSgk + sgk.isciIssizlik),
    'sgk.isveren': pct(sgk.isverenSgk),
    'sgk.isverenIssizlik': pct(sgk.isverenIssizlik),
    'sgk.isverenToplam': pct(sgk.isverenSgk + sgk.isverenIssizlik),
    'sgk.hazine': pct(sgk.hazineIndirimi),
    'sgk.hazineImalat': pct(sgk.hazineIndirimiImalat),
    'sgk.isverenIndirimli': pct(sgk.isverenSgk - sgk.hazineIndirimi),
    'sgk.taban': tl(pek.taban),
    'sgk.tavan': tl(pek.tavan),
    'damga.oran': 'binde ' + new Intl.NumberFormat('tr-TR').format(dv * 1000),
    'kidem.tavan': tl(kt.value),
    'kidem.tavanBaslangic': date(kt.from),
    'kidem.tavanBitis': kt.to ? date(kt.to) : '',
    'kidem.tavan1': tl(kidemPeriods[0]?.value ?? kt.value),
    'kidem.tavan2': tl(kidemPeriods[1]?.value ?? kt.value),
    'issizlik.oran': pct(io.oran),
    'issizlik.tavan': tl(au.brutAylik * io.tavanOrani),
    'issizlik.taban': tl(au.brutAylik * io.oran),
    'issizlik.tavanNet': tl(au.brutAylik * io.tavanOrani * (1 - dv)),
    'bagkur.oran': pct(bk.oran),
    'bagkur.indirimli': pct(bk.indirimliOran),
    'bagkur.altPrim': tl(pek.taban * bk.oran),
    'bagkur.altPrimIndirimli': tl(pek.taban * bk.indirimliOran),
    'bagkur.ustPrim': tl(pek.tavan * bk.oran),
    'destek.asgari': tl0(valueAt(P.asgariUcretDestegi, today)),
  };
  const kv = valueAt(P.krediVergileri, today);
  const st = valueAt(P.mevduatStopaj, today);
  const tp = valueAt(P.tapu, today);
  const ev = valueAt(P.emlakVergisi, today);
  const sonTufe = tufe[tufe.length - 1];
  const binde = (r: number) => 'binde ' + new Intl.NumberFormat('tr-TR').format(r * 1000);
  const ayAdi = (ym: string) =>
    ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'][
      Number(ym.slice(5)) - 1
    ] +
    ' ' +
    ym.slice(0, 4);
  Object.assign(v, {
    'kredi.kkdf': pct(kv.ihtiyac.kkdf),
    'kredi.bsmv': pct(kv.ihtiyac.bsmv),
    'kredi.vergiToplam': pct(kv.ihtiyac.kkdf + kv.ihtiyac.bsmv),
    'stopaj.alti6': pct(st.alti6Ay),
    'stopaj.yil1': pct(st.bir1Yil),
    'stopaj.uzun': pct(st.uzun),
    'stopaj.doviz': pct(st.doviz),
    'tapu.oran': pct(tp.aliciOran),
    'tapu.toplamOran': pct(tp.aliciOran + tp.saticiOran),
    'tapu.doner': tl(tp.donerGosterge),
    'tapu.donerIlave': tl(tp.donerIlave),
    'emlak.konut': binde(ev.konut.normal),
    'emlak.konutBs': binde(ev.konut.buyuksehir),
    'emlak.isyeri': binde(ev.isyeri.normal),
    'emlak.isyeriBs': binde(ev.isyeri.buyuksehir),
    'emlak.arsa': binde(ev.arsa.normal),
    'emlak.arsaBs': binde(ev.arsa.buyuksehir),
    'emlak.arazi': binde(ev.arazi.normal),
    'emlak.araziBs': binde(ev.arazi.buyuksehir),
    'tufe.sonAy': ayAdi(sonTufe.ay),
    'tufe.ortalama12': '%' + new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 2 }).format(sonTufe.ortalama12),
    'tufe.yillik': '%' + new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 2 }).format(sonTufe.yillik),
    'tufe.aylik': '%' + new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 2 }).format(sonTufe.aylik),
  });

  gv.forEach((b, i) => {
    v[`gv.dilim${i + 1}`] = Number.isFinite(b.upTo) ? tl0(b.upTo) : '';
    v[`gv.oran${i + 1}`] = pct(b.rate);
  });
  return v;
}
