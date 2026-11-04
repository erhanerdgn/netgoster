/**
 * Sınav parametreleri. ÖSYM/MEB standart puan kullanır (aday dağılımına bağlı); sabit katsayı YAYIMLANMAZ.
 * Bu yüzden puanlar önceki yılların sonuçlarından türetilmiş TAHMİNİ katsayılarla hesaplanır ve sayfada
 * "tahmini sonuçtur" uyarısı gösterilir. Her yıl sonuçlar açıklandıktan sonra güncellenmelidir (README).
 */

export interface Test {
  key: string;
  label: string;
  questions: number;
}

// ─── YKS ───
// Kaynak (resmi): ÖSYM 2026-YKS SSS https://dokuman.osym.gov.tr/pdfdokuman/2026/YKS/sss_yksd19022026.pdf
// Net = D − Y/4 · TYT katkısı %40 · OBP = diploma notu × 5 (50 altı 50 sayılır) · OBP katsayısı 0,12 (2025'te merkezî yerleşen 0,06)
export const yks = {
  year: 2026,
  wrongPenalty: 1 / 4,
  obpFactor: 0.12,
  obpFactorPlaced: 0.06,
  minDiploma: 50,
  tyt: [
    { key: 'tytTurkce', label: 'Türkçe', questions: 40 },
    { key: 'tytSosyal', label: 'Sosyal Bilimler', questions: 20 },
    { key: 'tytMat', label: 'Temel Matematik', questions: 40 },
    { key: 'tytFen', label: 'Fen Bilimleri', questions: 20 },
  ] satisfies Test[],
  // AYT test içi dağılım: ikincil kaynak (Kızılcahamam AL 2025 broşürü). // TODO: DOĞRULA (2026 kılavuz tablosu)
  ayt: [
    { key: 'aytEdebiyat', label: 'Türk Dili ve Edebiyatı', questions: 24 },
    { key: 'aytTarih1', label: 'Tarih-1', questions: 10 },
    { key: 'aytCografya1', label: 'Coğrafya-1', questions: 6 },
    { key: 'aytTarih2', label: 'Tarih-2', questions: 11 },
    { key: 'aytCografya2', label: 'Coğrafya-2', questions: 11 },
    { key: 'aytFelsefe', label: 'Felsefe Grubu', questions: 12 },
    { key: 'aytDin', label: 'Din Kültürü', questions: 6 },
    { key: 'aytMat', label: 'Matematik', questions: 40 },
    { key: 'aytFizik', label: 'Fizik', questions: 14 },
    { key: 'aytKimya', label: 'Kimya', questions: 13 },
    { key: 'aytBiyoloji', label: 'Biyoloji', questions: 13 },
  ] satisfies Test[],
  ydt: { key: 'ydt', label: 'Yabancı Dil (YDT)', questions: 80 },
  /**
   * TAHMİNİ katsayılar — net başına puan. Kaynak: Kızılcahamam Anadolu Lisesi 2025 YKS broşürü
   * (https://kizilcahamamanadolulisesi.meb.k12.tr/...2025yksbrosur.pdf), eleman.net "2025 ortalaması" ile aynı.
   * Tam nette her puan türü ≈500 verir (kendi içinde tutarlı). // TODO: DOĞRULA (2026 sonuçlarıyla yeniden türet)
   */
  base: 100,
  coef: {
    TYT: { tytTurkce: 3.3, tytSosyal: 3.4, tytMat: 3.3, tytFen: 3.4 },
    /** SAY/EA/SÖZ/DİL içindeki TYT kısmı */
    tytPart: { tytTurkce: 1.32, tytSosyal: 1.36, tytMat: 1.32, tytFen: 1.36 },
    SAY: { aytMat: 3, aytFizik: 2.85, aytKimya: 3.07, aytBiyoloji: 3.07 },
    EA: { aytMat: 3, aytEdebiyat: 3, aytTarih1: 2.8, aytCografya1: 3.3 },
    SÖZ: { aytEdebiyat: 3, aytTarih1: 2.8, aytCografya1: 3.3, aytTarih2: 2.9, aytCografya2: 2.9, aytFelsefe: 3, aytDin: 3.3 },
    DİL: { ydt: 3 },
  } as Record<string, Record<string, number>>,
  source: 'https://dokuman.osym.gov.tr/pdfdokuman/2026/YKS/sss_yksd19022026.pdf',
};

// ─── LGS ───
// Kaynak (resmi): MEB 2026 LGS Başvuru ve Uygulama Kılavuzu, Tablo-1/2, Md. 11
// https://odsgm.meb.gov.tr/meb_iys_dosyalar/2026_04/69cfb9daaf8f2557696260_LGS_Basvuru_ve_Uygulama_K%C4%B1lavuzu_2026.pdf
export const lgs = {
  year: 2026,
  wrongPenalty: 1 / 3,
  tests: [
    { key: 'turkce', label: 'Türkçe', questions: 20, weight: 4 },
    { key: 'inkilap', label: 'T.C. İnkılap Tarihi ve Atatürkçülük', questions: 10, weight: 1 },
    { key: 'din', label: 'Din Kültürü ve Ahlak Bilgisi', questions: 10, weight: 1 },
    { key: 'dil', label: 'Yabancı Dil', questions: 10, weight: 1 },
    { key: 'mat', label: 'Matematik', questions: 20, weight: 4 },
    { key: 'fen', label: 'Fen Bilimleri', questions: 20, weight: 4 },
  ],
  min: 100,
  max: 500,
  /**
   * TAHMİNİ: net başına puan (2024–2025 sonuçlarına dayalı kamuoyu yaklaşımı, unikazan.com) ve
   * tam net = 500 olacak şekilde türetilmiş taban. // TODO: DOĞRULA (2026 Merkezî Sınav Raporu ortalama/sapma)
   */
  perNet: { 4: 4.35, 1: 1.67 } as Record<number, number>,
  source:
    'https://odsgm.meb.gov.tr/meb_iys_dosyalar/2026_04/69cfb9daaf8f2557696260_LGS_Basvuru_ve_Uygulama_K%C4%B1lavuzu_2026.pdf',
};

// ─── KPSS ───
// Kaynak (resmi): ÖSYM 2026 KPSS Lisans/Önlisans/Ortaöğretim kılavuzları, Tablo-2 (GY 0,50 / GK 0,50)
// https://dokuman.osym.gov.tr/pdfdokuman/2026/KPSS/LISANS/kilavuz_Ld01072026.pdf
export const kpss = {
  year: 2026,
  wrongPenalty: 1 / 4,
  gy: 60,
  gk: 60,
  /**
   * TAHMİNİ doğrusal yaklaşım: puan ≈ sabit + katsayı × (GY net + GK net).
   * P3: hemenhesap.com'un 2024 istatistiklerine kalibre tablosundan türetildi (±3 puan).
   * P93/P94 için ayrı resmi/kamuoyu katsayısı bulunamadı; adaylar ortalaması daha düşük olduğundan aynı net
   * daha yüksek puan getirir — önceki yıl dağılımına göre tahmin. // TODO: DOĞRULA
   */
  types: {
    P3: { label: 'Lisans (P3)', base: 46, perNet: 0.48 },
    P93: { label: 'Önlisans (P93)', base: 50, perNet: 0.46 },
    P94: { label: 'Ortaöğretim (P94)', base: 52, perNet: 0.45 },
  } as Record<'P3' | 'P93' | 'P94', { label: string; base: number; perNet: number }>,
  source: 'https://dokuman.osym.gov.tr/pdfdokuman/2026/KPSS/LISANS/kilavuz_Ld01072026.pdf',
};

// ─── ALES ───
/** Tabanı koruyup eğimleri, 50+50 tam nette puan 100 olacak şekilde ölçekler */
function alesFit(label: string, base: number, say: number, soz: number) {
  const k = (100 - base) / (50 * (say + soz));
  return { label, base, say: say * k, soz: soz * k };
}

// Kaynak (resmi): ÖSYM 2026-ALES/2 kılavuzu — Sayısal 50 + Sözel 50, net = D − Y/4, ağırlıklar 0,75/0,25 · 0,50/0,50
// https://dokuman.osym.gov.tr/web/2026/7/basvuru-kilavuzu-s8si6u-30101118.pdf
export const ales = {
  year: 2026,
  wrongPenalty: 1 / 4,
  sayisal: 50,
  sozel: 50,
  /**
   * TAHMİNİ. Ham katsayılar rehberpanda.com (2024–2026) kaynaklı; kendi içinde tutarsızdı (tam nette SÖZ 93,16,
   * SAY/EA 100'ü aşıyordu). Taban (0 net) korunarak eğimler tam net = 100 olacak şekilde ölçeklenir (alesFit).
   * // TODO: DOĞRULA — ÖSYM ALES sayısal bilgileriyle (ortalama/standart sapma) yeniden türetin.
   */
  types: {
    SAY: alesFit('Sayısal', 47.433, 0.775, 0.325),
    SÖZ: alesFit('Sözel', 40.91, 0.27, 0.775),
    EA: alesFit('Eşit Ağırlık', 45.408, 0.518, 0.652),
  } as Record<'SAY' | 'SÖZ' | 'EA', { label: string; base: number; say: number; soz: number }>,
  source: 'https://dokuman.osym.gov.tr/web/2026/7/basvuru-kilavuzu-s8si6u-30101118.pdf',
};

// ─── YDS ───
// Kaynak (resmi): ÖSYM 2026-YDS/1 kılavuzu — 80 soru, yanlış götürmez, 100 üzerinden; seviyeler A–E
// https://dokuman.osym.gov.tr/pdfdokuman/2026/YDS-1/kilavuz_yd1d18022026.pdf
export const yds = {
  questions: 80,
  /** 100/80 — iptal edilen soru olursa ÖSYM yeniden belirler */
  perCorrect: 1.25,
  levels: [
    { min: 90, level: 'A' },
    { min: 80, level: 'B' },
    { min: 70, level: 'C' },
    { min: 60, level: 'D' },
    { min: 50, level: 'E' },
  ],
  source: 'https://dokuman.osym.gov.tr/pdfdokuman/2026/YDS-1/kilavuz_yd1d18022026.pdf',
};

// ─── Lise ───
// Kaynak (resmi): MEB Ortaöğretim Kurumları Yönetmeliği md. 44, 54–58, 160 — https://www.mevzuat.gov.tr/MevzuatMetin/yonetmelik/7.5.18812.pdf
export const lise = {
  passMark: 50,
  /** md. 57–58 (8/9/2023 değişikliği): doğrudan geçme ≤1 başarısız ders (YBP ≥ 50), sorumlu geçme ≤3, alt sınıflar dahil >6 → tekrar */
  gecme: { dogrudanMaxBasarisiz: 1, sorumluMaxBasarisiz: 3, toplamMaxSorumlu: 6 },
  /** 2. dönem en az 70 ise 1. dönemden bağımsız başarılı (md. 56) */
  secondTermPass: 70,
  tesekkur: 70,
  takdir: 85,
  scale: [
    { min: 85, label: 'Pekiyi' },
    { min: 70, label: 'İyi' },
    { min: 60, label: 'Orta' },
    { min: 50, label: 'Geçer' },
    { min: 0, label: 'Geçmez' },
  ],
  source: 'https://www.mevzuat.gov.tr/MevzuatMetin/yonetmelik/7.5.18812.pdf',
};

// ─── Üniversite ───
// YÖK 4'lük → 100'lük dönüşüm tablosu: 100'lük = (70/3) × GNO + 20/3, iki ondalığa KESİLİR (1,00–4,00 arası)
// https://atauni.edu.tr/ogrenci-isleri-daire-baskanligi/wp-content/uploads/sites/18/2025/10/YOK_Cevirim-Tablosu_4-LUKTEN-100-LUGE.pdf
export const universite = {
  letters: [
    { letter: 'AA', point: 4 },
    { letter: 'BA', point: 3.5 },
    { letter: 'BB', point: 3 },
    { letter: 'CB', point: 2.5 },
    { letter: 'CC', point: 2 },
    { letter: 'DC', point: 1.5 },
    { letter: 'DD', point: 1 },
    { letter: 'FD', point: 0.5 },
    { letter: 'FF', point: 0 },
  ],
  source:
    'https://atauni.edu.tr/ogrenci-isleri-daire-baskanligi/wp-content/uploads/sites/18/2025/10/YOK_Cevirim-Tablosu_4-LUKTEN-100-LUGE.pdf',
};
