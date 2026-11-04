/**
 * Emeklilik şartları (5510 ve geçiş hükümleri). Mevzuat değişmedikçe sabittir.
 * Kaynaklar: 5510 md. 28, geçici 9; 506 geçici 81; 1479 geçici 10; 5434 geçici 205;
 * 7438 s. K. (EYT, RG 03.03.2023/32121) — https://www.mevzuat.gov.tr/MevzuatMetin/1.5.5510.pdf
 *
 * Kapsam dışı: 2925 (tarım), fiili hizmet zammı, malullük, engelli çocuk nedeniyle prim günü eklenmesi,
 * borçlanmalar — sayfada belirtilir.
 */

/** 08.09.1999 öncesi giriş — 506 geçici 81/B (4/a). EYT ile yaş şartı kalktı; gün ve sigortalılık süresi aranır. */
export const eytSsk = {
  kadin: {
    sureYil: 20,
    eskiSinir: '1981-09-08', // bu tarih ve öncesi giriş: 5000 gün (A bendi)
    kademeler: [
      { until: '1985-05-23', gun: 5000 },
      { until: '1986-05-23', gun: 5075 },
      { until: '1987-05-23', gun: 5150 },
      { until: '1988-05-23', gun: 5225 },
      { until: '1989-05-23', gun: 5300 },
      { until: '1990-05-23', gun: 5375 },
      { until: '1991-05-23', gun: 5450 },
      { until: '1992-05-23', gun: 5525 },
      { until: '1993-05-23', gun: 5600 },
      { until: '1994-05-23', gun: 5675 },
      { until: '1995-05-23', gun: 5750 },
      { until: '1996-05-23', gun: 5825 },
      { until: '1997-05-23', gun: 5900 },
      { until: '1999-09-08', gun: 5975 },
    ],
  },
  erkek: {
    sureYil: 25,
    eskiSinir: '1976-09-08',
    kademeler: [
      { until: '1980-11-23', gun: 5000 },
      { until: '1982-05-23', gun: 5075 },
      { until: '1983-11-23', gun: 5150 },
      { until: '1985-05-23', gun: 5225 },
      { until: '1986-11-23', gun: 5300 },
      { until: '1988-05-23', gun: 5375 },
      { until: '1989-11-23', gun: 5450 },
      { until: '1991-05-23', gun: 5525 },
      { until: '1992-11-23', gun: 5600 },
      { until: '1994-05-23', gun: 5675 },
      { until: '1995-11-23', gun: 5750 },
      { until: '1997-05-23', gun: 5825 },
      { until: '1998-11-23', gun: 5900 },
      { until: '1999-09-08', gun: 5975 },
    ],
  },
  /** Giriş tarihi aralıkları kanundaki süre aralıklarından türetilmiştir — sınır günlerinde SGK ile teyit. // TODO: DOĞRULA */
  verified: false,
};

/** 08.09.1999 öncesi 4/b (1479 geçici 10/2) ve 4/c (5434 geçici 205): EYT ile yaş yok, tam yıl hizmet. */
export const eytBagkurMemur = {
  kadin: { yil: 20, gun: 7200 },
  erkek: { yil: 25, gun: 9000 },
};

/** 08.09.1999 – 30.04.2008 girişli (5510 geçici 9) */
export const gecis1999 = {
  '4a': { yasK: 58, yasE: 60, gun: 7000, alternatif: { sureYil: 25, gun: 4500 } },
  '4b': { yasK: 58, yasE: 60, gun: 9000 },
  '4c': { yasK: 58, yasE: 60, gun: 9000 },
};

/** 01.05.2008 sonrası (5510 md. 28): yaş, prim günü şartının tamamlandığı yıla göre */
export const yeniSistem = {
  gun: { '4a': 7200, '4b': 9000, '4c': 9000 },
  /** [tamamlanma yılı üst sınırı (dahil), kadın yaşı, erkek yaşı] */
  yasTablosu: [
    [2035, 58, 60],
    [2037, 59, 61],
    [2039, 60, 62],
    [2041, 61, 63],
    [2043, 62, 64],
    [2045, 63, 65],
    [2047, 64, 65],
    [9999, 65, 65],
  ] as [number, number, number][],
};
