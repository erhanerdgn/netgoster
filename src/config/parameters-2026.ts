/**
 * TÜM yasal/mali parametreler — tek kaynak.
 *
 * Her değer bir zaman serisidir (Series<T>): { from, to?, value, source, verified? }.
 * Hesaplamalar işlem tarihine göre doğru dönemi `valueAt(seri, tarih)` ile seçer; yeni dönem
 * geldiğinde ilgili diziye kayıt eklemek yeterlidir (ör. Temmuz kıdem tavanı). İçerik metinlerindeki
 * rakamlar da buradan üretilir (src/content/vars.ts) — elle rakam yazılmaz.
 *
 * Güncelleme takvimi: README > "Parametre güncelleme takvimi".
 * `verified: false` olan kayıtlar resmi kaynakta birebir görülemeyen, türetilmiş/ikincil değerlerdir (// TODO: DOĞRULA).
 */
import { latestYear, type Series } from './period.ts';

// ════════════════════════ ÇALIŞMA VE MAAŞ ════════════════════════

/** Aylık brüt asgari ücret. Net, oranlardan türetilir (asgariNet). */
export const asgariUcret: Series<{ brutAylik: number; brutGunluk: number }> = [
  {
    from: '2025-01-01',
    to: '2025-12-31',
    value: { brutAylik: 26005.5, brutGunluk: 866.85 },
    source: 'Asgari Ücret Tespit Komisyonu Kararı, RG 24.12.2024/32762',
  },
  {
    from: '2026-01-01',
    to: '2026-12-31',
    value: { brutAylik: 33030, brutGunluk: 1101 },
    source:
      'Asgari Ücret Tespit Komisyonu Kararı 2025/1, RG 26.12.2025/33119 — https://www.resmigazete.gov.tr/eskiler/2025/12/20251226-6.pdf',
  },
];

export interface Bracket {
  /** Dilim üst sınırı (TL); son dilimde Infinity */
  upTo: number;
  rate: number;
}

/** Gelir vergisi tarifesi — ÜCRET gelirleri (GVK md. 103) */
export const gelirVergisiUcret: Series<Bracket[]> = [
  {
    from: '2025-01-01',
    to: '2025-12-31',
    value: [
      { upTo: 158000, rate: 0.15 },
      { upTo: 330000, rate: 0.2 },
      { upTo: 1200000, rate: 0.27 },
      { upTo: 4300000, rate: 0.35 },
      { upTo: Infinity, rate: 0.4 },
    ],
    source: '323 Seri No.lu GV Genel Tebliği, RG 30.12.2024',
    verified: false, // TODO: DOĞRULA (yalnız 2025 karşılaştırması için)
  },
  {
    from: '2026-01-01',
    to: '2026-12-31',
    value: [
      { upTo: 190000, rate: 0.15 },
      { upTo: 400000, rate: 0.2 },
      { upTo: 1500000, rate: 0.27 },
      { upTo: 5300000, rate: 0.35 },
      { upTo: Infinity, rate: 0.4 },
    ],
    source:
      '332 Seri No.lu GV Genel Tebliği md. 3/3, RG 31.12.2025/33124 (5. Mük.) — https://www.resmigazete.gov.tr/eskiler/2025/12/20251231M5-30.pdf',
  },
];

/** Gelir vergisi tarifesi — ücret DIŞI gelirler (bilgi amaçlı) */
export const gelirVergisiUcretDisi: Series<Bracket[]> = [
  {
    from: '2026-01-01',
    to: '2026-12-31',
    value: [
      { upTo: 190000, rate: 0.15 },
      { upTo: 400000, rate: 0.2 },
      { upTo: 1000000, rate: 0.27 },
      { upTo: 5300000, rate: 0.35 },
      { upTo: Infinity, rate: 0.4 },
    ],
    source: '332 Seri No.lu GV Genel Tebliği, RG 31.12.2025/33124',
  },
];

/** Ücretlerde damga vergisi oranı (DVK 1 sayılı tablo IV-1-b) */
export const damgaVergisiUcret: Series<number> = [
  {
    from: '2004-01-01',
    value: 0.00759,
    source: '488 sayılı DVK (1) sayılı tablo IV-1-b — https://www.mevzuat.gov.tr/MevzuatMetin/1.5.488.pdf',
  },
];

/** SGK 4/a prim oranları */
export const sgkOranlari: Series<{
  isciSgk: number;
  isciIssizlik: number;
  isverenSgk: number;
  isverenIssizlik: number;
  /** Özel sektör imalat dışı hazine indirimi (puan, oran olarak) */
  hazineIndirimi: number;
  /** İmalat sektörü (NACE C) hazine indirimi */
  hazineIndirimiImalat: number;
}> = [
  {
    from: '2025-01-01',
    to: '2025-12-31',
    value: {
      isciSgk: 0.14,
      isciIssizlik: 0.01,
      isverenSgk: 0.2075,
      isverenIssizlik: 0.02,
      hazineIndirimi: 0.04,
      hazineIndirimiImalat: 0.05,
    },
    source: '5510 md. 81, 2025 uygulaması',
    verified: false, // TODO: DOĞRULA (karşılaştırma amaçlı)
  },
  {
    from: '2026-01-01',
    to: '2026-12-31',
    value: {
      isciSgk: 0.14,
      isciIssizlik: 0.01,
      isverenSgk: 0.2175,
      isverenIssizlik: 0.02,
      hazineIndirimi: 0.02,
      hazineIndirimiImalat: 0.05,
    },
    source:
      '5510 md. 81 (7566 s. K. md. 23, RG 19.12.2025/33112: MYÖ işveren %12) ve geçici 108; SGK Genelgesi 2026/1 — https://www.mevzuat.gov.tr/MevzuatMetin/1.5.5510.pdf',
  },
];

/** Prime esas kazanç (PEK) alt/üst sınırı — aylık */
export const sgkTabanTavan: Series<{ taban: number; tavan: number }> = [
  { from: '2025-01-01', to: '2025-12-31', value: { taban: 26005.5, tavan: 195041.4 }, source: 'SGK Genelgesi 2025/1 (7,5 kat)' },
  {
    from: '2026-01-01',
    to: '2026-12-31',
    value: { taban: 33030, tavan: 297270 },
    source: 'SGK Genelgesi 2026/2 (07.01.2026); 5510 md. 82 — 7566 s. K. md. 24 ile üst sınır asgari ücretin 9 katı',
  },
];

/** Asgari ücret desteği (işverene aylık, prim borcundan mahsup) */
export const asgariUcretDestegi: Series<number> = [
  {
    from: '2026-01-01',
    to: '2026-12-31',
    value: 1270,
    source: 'Asgari Ücret Tespit Komisyonu Kararı 2025/1 md. 3; 5510 geçici 112 (7573 s. K.); SGK Genelgesi 2026/8',
  },
];

/** Kıdem tazminatı tavanı (memur en yüksek devlet memuru emekli ikramiyesi) */
export const kidemTavani: Series<number> = [
  {
    from: '2025-01-01',
    to: '2025-06-30',
    value: 46655.43,
    source: 'HMB Mali ve Sosyal Haklar Genelgesi, Ocak 2025',
    verified: false,
  }, // TODO: DOĞRULA
  {
    from: '2025-07-01',
    to: '2025-12-31',
    value: 53919.68,
    source: 'HMB Mali ve Sosyal Haklar Genelgesi, Temmuz 2025',
    verified: false,
  }, // TODO: DOĞRULA
  {
    from: '2026-01-01',
    to: '2026-06-30',
    value: 64948.77,
    source:
      'HMB Mali ve Sosyal Haklar Genelgesi (06.01.2026, Sıra No 1) md. 3 — https://ms.hmb.gov.tr/uploads/sites/23/2026/01/2026-Yili-Ocak-Ayina-Ait-Mali-ve-Sosyal-Haklara-Iliskin-Genelge-79a07ffd14594fd6.pdf',
  },
  {
    from: '2026-07-01',
    to: '2026-12-31',
    value: 73729.87,
    source:
      'HMB Mali ve Sosyal Haklar Genelgesi (03.07.2026) md. 2 — https://ms.hmb.gov.tr/uploads/2026/07/2026-Yili-Temmuz-Ayina-Ait-Mali-ve-Sosyal-Haklara-Iliskin-Genelge-9b5304ed658d77cb.pdf',
  },
];

/** İşsizlik ödeneği (4447 md. 50) */
export const issizlikOdenegi: Series<{
  oran: number;
  /** üst sınır = brüt asgari ücret × tavanOrani */
  tavanOrani: number;
  /** [en az prim günü, ödeme günü] */
  sureler: [number, number][];
  sonGunSarti: number;
}> = [
  {
    from: '2008-01-01',
    value: {
      oran: 0.4,
      tavanOrani: 0.8,
      sureler: [
        [600, 180],
        [900, 240],
        [1080, 300],
      ],
      sonGunSarti: 120,
    },
    source: '4447 s. İşsizlik Sigortası K. md. 50–51 — https://www.mevzuat.gov.tr/mevzuatmetin/1.5.4447.pdf',
  },
];

/** İş Kanunu süreleri (4857) — mevzuat değişmedikçe sabit */
export const isKanunu = {
  /** md. 17: [kıdem üst sınırı (ay, hariç), hafta] */
  ihbarSureleri: [
    { maxAy: 6, hafta: 2 },
    { maxAy: 18, hafta: 4 },
    { maxAy: 36, hafta: 6 },
    { maxAy: Infinity, hafta: 8 },
  ],
  /** md. 53 */
  yillikIzin: [
    { minYil: 1, gun: 14 },
    { minYil: 6, gun: 20 }, // "beş yıldan fazla": tamamlanan 6. yıldan itibaren
    { minYil: 15, gun: 26 },
  ],
  izinYasAlt: 18,
  izinYasUst: 50,
  izinYasMinGun: 20,
  yerAltiEk: 4,
  /** md. 41 */
  fazlaMesaiZam: 0.5,
  fazlaSurelerZam: 0.25,
  haftalikAzami: 45,
  yillikFazlaMesaiSiniri: 270,
  /** Aylık çalışma saati (ücretin saate bölünmesi: 30 gün × 7,5 saat) */
  aylikSaat: 225,
  source: '4857 s. İş Kanunu md. 17, 41, 47, 53 — https://www.mevzuat.gov.tr/mevzuatmetin/1.5.4857.pdf',
};

/** Bağkur (4/b) */
export const bagkur: Series<{ oran: number; indirimliOran: number }> = [
  {
    from: '2026-01-01',
    to: '2026-12-31',
    value: { oran: 0.3575, indirimliOran: 0.3075 },
    source: '5510 md. 81/1-a,f,j (7566 s. K.: MYÖ %21 + GSS %12,5 + KVS %2,25); SGK Genelgesi 2026/2',
  },
];

// ════════════════════════ FİNANS ════════════════════════

/** Tüketici kredisi vergileri — FAİZ tutarı üzerinden */
export const krediVergileri: Series<Record<'ihtiyac' | 'tasit' | 'konut', { kkdf: number; bsmv: number }>> = [
  {
    from: '2023-07-07',
    value: { ihtiyac: { kkdf: 0.15, bsmv: 0.15 }, tasit: { kkdf: 0.15, bsmv: 0.15 }, konut: { kkdf: 0, bsmv: 0 } },
    source:
      'BSMV %15: 7345 s. CK (RG 07.07.2023/32241); KKDF %15 tüketici kredisi (88/12944 s. Kararname, 10094 s. CK tüketici oranını değiştirmedi); konut finansmanı istisnası: 6802 s. K. md. 29/1-y — https://kpmgvergi.com/yayinlar/mali-bultenler/vergi/07-temmuz-2023-tarihli-resmi-gazetede-yayimlanan-cumhurbaskani-kararlari-ile-yapilan-bazi-duzenlemelere-bultenimizde-yer-verilmistir/2104',
    verified: false, // TODO: DOĞRULA — taşıt kredisinin ihtiyaçla aynı oranlara tabi olduğu çıkarım (tüketici kredisi)
  },
];

/** Kredi tahsis ücreti üst sınırı: anaparanın binde 5'i (+ BSMV) — kullanıcıya bilgi olarak gösterilir */
export const krediTahsisAzami: Series<number> = [
  {
    from: '2020-03-01',
    value: 0.005,
    source:
      'Finansal Tüketicilerden Alınacak Ücretlere İlişkin Usul ve Esaslar Hakkında Tebliğ md. 10 (BDDK/TCMB) — https://www.hesapkurdu.com/ihtiyac-kredisi/rehber/kredi-tahsis-ucreti',
    verified: false, // TODO: DOĞRULA — tebliğ metniyle birebir
  },
];

/** TL mevduat stopajı (GVK geçici 67, 2006/10731 BKK) — hesabın AÇILIŞ/YENİLEME tarihine göre */
export const mevduatStopaj: Series<{ alti6Ay: number; bir1Yil: number; uzun: number; doviz: number }> = [
  {
    from: '2024-05-01',
    to: '2024-10-31',
    value: { alti6Ay: 0.075, bir1Yil: 0.05, uzun: 0.025, doviz: 0.25 },
    source: 'Yapı Kredi stopaj tablosu (CK özetleri)',
    verified: false,
  },
  {
    from: '2024-11-01',
    to: '2025-01-31',
    value: { alti6Ay: 0.1, bir1Yil: 0.075, uzun: 0.05, doviz: 0.25 },
    source: 'Yapı Kredi stopaj tablosu (CK özetleri)',
    verified: false,
  },
  {
    from: '2025-02-01',
    to: '2025-07-08',
    value: { alti6Ay: 0.15, bir1Yil: 0.12, uzun: 0.1, doviz: 0.25 },
    source: 'Yapı Kredi stopaj tablosu (CK özetleri)',
    verified: false,
  },
  {
    from: '2025-07-09',
    to: '2026-12-31',
    value: { alti6Ay: 0.175, bir1Yil: 0.15, uzun: 0.1, doviz: 0.25 },
    source:
      "10041 s. CK (RG 09.07.2025/32951); süresi 11444 s. CK (RG 20.06.2026/33286) ile 31.12.2026'ya uzatıldı — https://www.yontemymm.com.tr/mali-aciklamalar/2026-041-tl-mevduat-hesaplarinda-uygulanan-stopaj-oranlarinin-suresi-uzatildi",
  },
];

/** KDV oranları — src/config/kdv.ts (araç klasörüyle birlikte yönetilir) */

// ════════════════════════ KONUT ════════════════════════

/** Tapu harcı (492 s. K. 4 sayılı tarife I/20-a) ve TKGM döner sermaye (I) sayılı tarife */
export const tapu: Series<{ aliciOran: number; saticiOran: number; donerGosterge: number; donerIlave: number }> = [
  {
    from: '2026-01-01',
    to: '2026-12-31',
    value: { aliciOran: 0.02, saticiOran: 0.02, donerGosterge: 2227, donerIlave: 307 },
    source:
      'Harç: 492 s. K. (4) s. tarife I/20-a, 2012/3735 BKK — https://www.mevzuat.gov.tr/mevzuatmetin/1.5.492.pdf; döner sermaye: TKGM 2026 tarife cetveli (KDV dahil, × yöresel katsayı) — https://cms-api.tkgm.gov.tr/media/101465/view',
  },
];

/** Emlak vergisi oranları (1319 s. K. md. 8, 18) — oran (binde 1 = 0.001) */
export const emlakVergisi: Series<Record<'konut' | 'isyeri' | 'arsa' | 'arazi', { normal: number; buyuksehir: number }>> = [
  {
    from: '2002-01-01',
    value: {
      konut: { normal: 0.001, buyuksehir: 0.002 },
      isyeri: { normal: 0.002, buyuksehir: 0.004 },
      arsa: { normal: 0.003, buyuksehir: 0.006 },
      arazi: { normal: 0.001, buyuksehir: 0.002 },
    },
    source: '1319 s. Emlak Vergisi K. md. 8, 18 (4736 s. K.) — https://www.mevzuat.gov.tr/mevzuatmetin/1.5.1319.pdf',
  },
];

/** 2026 emlak vergisi değeri artış sınırı: 2025 değerinin en fazla 3 katı (7566 s. K., 1319 geçici 23; Tebliğ 89) */
export const emlakArtisSiniri: Series<{ katsayi: number }> = [
  {
    from: '2026-01-01',
    to: '2026-12-31',
    value: { katsayi: 3 },
    source:
      'Emlak Vergisi Genel Tebliği Seri No 89, RG 31.12.2025/33124 (5. Mük.) — https://www.resmigazete.gov.tr/eskiler/2025/12/20251231M5-27.pdf',
  },
];

// ════════════════════════ ARAÇ (MTV) ════════════════════════
// MTV Genel Tebliği Seri No 58, RG 31.12.2025/33124 (5. Mük.); 2026 yeniden değerleme %18,95.
// RG tabloları resim olduğundan iki bağımsız ikincil kaynağın birebir eşleşmesine dayanır:
// https://www.alomaliye.com/2025/12/31/2026-yili-mtv/ · https://www.yontemymm.com.tr/pratik-bilgiler/2026-yili-motorlu-tasitlar-vergisi
// TODO: DOĞRULA — RG görüntüsüyle karşılaştırılmadı. Yaş grupları: [1-3, 4-6, 7-11, 12-15, 16+]

type Yas5 = [number, number, number, number, number];
export interface MtvOtoRow {
  /** silindir hacmi üst sınırı (cm³, dahil) */
  maxCc: number;
  /** ilk tescildeki taşıt değeri üst sınırı (TL, dahil); son dilimde Infinity */
  maxDeger: number;
  tutar: Yas5;
}

const MTV_SRC =
  'MTV Genel Tebliği Seri No 58, RG 31.12.2025/33124 (5. Mük.) — https://www.resmigazete.gov.tr/eskiler/2025/12/20251231M5-23.pdf';
const I = Infinity;

/** (I) otomobil, kaptıkaçtı, arazi taşıtı — 01.01.2018 ve sonrası tescilli */
export const mtvOtomobil: Series<MtvOtoRow[]> = [
  {
    from: '2026-01-01',
    to: '2026-12-31',
    source: MTV_SRC,
    verified: false,
    value: [
      { maxCc: 1300, maxDeger: 309100, tutar: [5750, 4010, 2238, 1689, 593] },
      { maxCc: 1300, maxDeger: 541500, tutar: [6319, 4409, 2459, 1861, 655] },
      { maxCc: 1300, maxDeger: I, tutar: [6902, 4807, 2693, 2032, 706] },
      { maxCc: 1600, maxDeger: 309100, tutar: [10016, 7510, 4354, 3077, 1181] },
      { maxCc: 1600, maxDeger: 541500, tutar: [11023, 8264, 4794, 3375, 1290] },
      { maxCc: 1600, maxDeger: I, tutar: [12028, 9012, 5220, 3685, 1408] },
      { maxCc: 1800, maxDeger: 775100, tutar: [19472, 15226, 8948, 5458, 2113] },
      { maxCc: 1800, maxDeger: I, tutar: [21251, 16600, 9775, 5964, 2307] },
      { maxCc: 2000, maxDeger: 775100, tutar: [30679, 23625, 13886, 8264, 3248] },
      { maxCc: 2000, maxDeger: I, tutar: [33474, 25784, 15147, 9012, 3547] },
      { maxCc: 2500, maxDeger: 968100, tutar: [46027, 33413, 20874, 12465, 4930] },
      { maxCc: 2500, maxDeger: I, tutar: [50217, 36448, 22768, 13606, 5378] },
      { maxCc: 3000, maxDeger: 1937500, tutar: [64175, 55837, 34878, 18758, 6875] },
      { maxCc: 3000, maxDeger: I, tutar: [70018, 60905, 38053, 20466, 7503] },
      { maxCc: 3500, maxDeger: 1937500, tutar: [97744, 87954, 52976, 26443, 9684] },
      { maxCc: 3500, maxDeger: I, tutar: [106641, 95940, 57791, 28839, 10578] },
      { maxCc: 4000, maxDeger: 3101800, tutar: [153684, 132712, 78152, 34878, 13886] },
      { maxCc: 4000, maxDeger: I, tutar: [167671, 144770, 85271, 38053, 15147] },
      { maxCc: I, maxDeger: 3683200, tutar: [251554, 188627, 111714, 50206, 19472] },
      { maxCc: I, maxDeger: I, tutar: [274415, 205781, 121873, 54769, 21251] },
    ],
  },
];

/** (I/A) 31.12.2017 ve öncesi tescilli otomobiller (taşıt değeri dilimi yok) */
export const mtvOtomobilEski: Series<{ maxCc: number; tutar: Yas5 }[]> = [
  {
    from: '2026-01-01',
    to: '2026-12-31',
    source: MTV_SRC,
    verified: false,
    value: [
      { maxCc: 1300, tutar: [5750, 4010, 2238, 1689, 593] },
      { maxCc: 1600, tutar: [10016, 7510, 4354, 3077, 1181] },
      { maxCc: 1800, tutar: [17705, 13829, 8145, 4957, 1917] },
      { maxCc: 2000, tutar: [27898, 21478, 12624, 7510, 2958] },
      { maxCc: 2500, tutar: [41840, 30372, 18977, 11333, 4479] },
      { maxCc: 3000, tutar: [58347, 50754, 31704, 17044, 6255] },
      { maxCc: 3500, tutar: [88859, 79955, 48158, 24031, 8813] },
      { maxCc: 4000, tutar: [139721, 120647, 71048, 31704, 12624] },
      { maxCc: I, tutar: [228681, 171485, 101555, 45632, 17705] },
    ],
  },
];

/** Elektrikli otomobil: motor gücüne göre (I) tarife satır grubu, tutarın %25'i (197 s. K. md. 5) */
export const mtvElektrik = {
  oran: 0.25,
  /** [kW üst sınırı (dahil), eşdeğer silindir üst sınırı] */
  kwEsdeger: [
    [70, 1300],
    [85, 1600],
    [105, 1800],
    [120, 2000],
    [150, 2500],
    [180, 3000],
    [210, 3500],
    [240, 4000],
    [I, I],
  ] as [number, number][],
  source: '197 s. MTV K. md. 5 — https://www.mevzuat.gov.tr/mevzuatmetin/1.5.197.pdf',
};

/** Motosiklet ((I) tarife 2. bölüm) — 100 cm³ altı vergiden muaf */
export const mtvMotosiklet: Series<{ minCc: number; maxCc: number; tutar: Yas5 }[]> = [
  {
    from: '2026-01-01',
    to: '2026-12-31',
    source: MTV_SRC,
    verified: false,
    value: [
      { minCc: 100, maxCc: 250, tutar: [1069, 799, 589, 362, 136] },
      { minCc: 251, maxCc: 650, tutar: [2214, 1676, 1069, 589, 362] },
      { minCc: 651, maxCc: 1200, tutar: [5719, 3398, 1676, 1069, 589] },
      { minCc: 1201, maxCc: I, tutar: [13876, 9167, 5719, 4540, 2214] },
    ],
  },
];

/** (II) sayılı tarife — yaş grupları [1-6, 7-15, 16+] */
export const mtvTarifeII: Series<{ id: string; label: string; tutar: [number, number, number] }[]> = [
  {
    from: '2026-01-01',
    to: '2026-12-31',
    source: MTV_SRC,
    verified: false,
    value: [
      { id: 'minibus', label: 'Minibüs', tutar: [6875, 4540, 2214] },
      { id: 'panelvan1900', label: 'Panelvan / motorlu karavan (1.900 cm³ ve altı)', tutar: [9167, 5719, 3398] },
      { id: 'panelvan1901', label: 'Panelvan / motorlu karavan (1.901 cm³ ve üzeri)', tutar: [13876, 9167, 5719] },
      { id: 'otobus25', label: 'Otobüs (25 kişiye kadar)', tutar: [17370, 10372, 4540] },
      { id: 'otobus35', label: 'Otobüs (26–35 kişi)', tutar: [20831, 17370, 6875] },
      { id: 'otobus45', label: 'Otobüs (36–45 kişi)', tutar: [23182, 19662, 9167] },
      { id: 'otobus46', label: 'Otobüs (46 kişi ve üzeri)', tutar: [27811, 23182, 13876] },
      { id: 'kamyon1500', label: 'Kamyonet/kamyon/çekici (1.500 kg’a kadar)', tutar: [6163, 4094, 2004] },
      { id: 'kamyon3500', label: 'Kamyonet/kamyon/çekici (1.501–3.500 kg)', tutar: [12488, 7234, 4094] },
      { id: 'kamyon5000', label: 'Kamyon/çekici (3.501–5.000 kg)', tutar: [18763, 15616, 6163] },
      { id: 'kamyon10000', label: 'Kamyon/çekici (5.001–10.000 kg)', tutar: [20831, 17690, 8292] },
      { id: 'kamyon20000', label: 'Kamyon/çekici (10.001–20.000 kg)', tutar: [25036, 20831, 12488] },
      { id: 'kamyon20001', label: 'Kamyon/çekici (20.001 kg ve üzeri)', tutar: [31315, 25036, 14548] },
    ],
  },
];

export const DATA_YEAR = latestYear(asgariUcret);
