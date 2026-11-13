/**
 * Mutfak ölçüleri: hacim ölçülerinin ml karşılıkları ve malzeme yoğunlukları (g/ml).
 * Yoğunluk = USDA FoodData Central (SR Legacy) "household measure" gram ağırlığı ÷ ölçünün hacmi
 * (1 US cup = 236,5882365 ml, 1 tbsp = 14,7867648 ml, 1 tsp = 4,92892159 ml), King Arthur Baking ağırlık
 * çizelgesi ve Türkçe kaynaklarla (yemek.com) karşılaştırılmıştır. Toz malzemelerde değer ölçüş biçimine göre
 * ±%10 değişir; `verified: false` olan değerler tek kaynağa ya da fiziksel tahmine dayanır.
 */

export interface Olcu {
  ad: string;
  /** Ölçünün mililitre karşılığı */
  ml: number;
}

export const USDA_CUP = 236.5882365;
export const USDA_TBSP = USDA_CUP / 16;
export const USDA_TSP = USDA_CUP / 48;

/** Hacim ölçüleri. Türk ölçüleri yemek kitaplarında yaygın kabul gören standart değerlerdir. */
export const OLCULER = {
  ml: { ad: 'Mililitre (ml)', ml: 1 },
  l: { ad: 'Litre', ml: 1000 },
  suBardagi: { ad: 'Su bardağı', ml: 200 },
  olcuBardagi: { ad: 'Ölçü bardağı (250 ml)', ml: 250 },
  cayBardagi: { ad: 'Çay bardağı', ml: 100 },
  kahveFincani: { ad: 'Kahve fincanı', ml: 70 },
  yemekKasigi: { ad: 'Yemek kaşığı', ml: 15 },
  tatliKasigi: { ad: 'Tatlı kaşığı', ml: 10 },
  cayKasigi: { ad: 'Çay kaşığı', ml: 5 },
  usCup: { ad: 'Cup (ABD)', ml: USDA_CUP },
  usTbsp: { ad: 'Tablespoon (ABD)', ml: USDA_TBSP },
  usTsp: { ad: 'Teaspoon (ABD)', ml: USDA_TSP },
} as const satisfies Record<string, Olcu>;

export type OlcuKodu = keyof typeof OLCULER;

export interface Malzeme {
  ad: string;
  /** Yoğunluk, g/ml */
  gml: number;
  /** Ölçüş biçimine bağlı olası sapma (oran): sıvılarda küçük, tozlarda ~%10 */
  tolerans: number;
  kaynaklar: readonly string[];
  /** En az iki bağımsız kaynakla karşılaştırıldıysa true */
  verified: boolean;
  not?: string;
}

const KA = 'https://www.kingarthurbaking.com/learn/ingredient-weight-chart';
const YEMEK = 'https://yemek.com/bardak-olculeri/';
const fdc = (id: number) => `https://fdc.nal.usda.gov/food-details/${id}/measures`;
const nv = (ad: string) => `https://www.nutritionvalue.org/${ad}_nutritional_value.html`;

export const MALZEMELER = {
  // Fiziksel tanım: su ~1 g/ml (4–20 °C arası fark binde 2'nin altında)
  su: { ad: 'Su', gml: 1, tolerans: 0.01, kaynaklar: [KA], verified: true },
  // USDA tam yağlı süt: 1 cup = 244 g → 1,031; 1 tbsp = 15 g
  sut: {
    ad: 'Süt',
    gml: 1.03,
    tolerans: 0.01,
    kaynaklar: [nv('Milk%2C_with_added_vitamin_D%2C_3.25%25_milkfat%2C_whole'), KA],
    verified: true,
  },
  // USDA soya yağı: 1 cup = 218 g → 0,921; "1 ml = 0,92 g". (King Arthur 198 g/cup daha düşük verir.)
  siviYag: {
    ad: 'Sıvı yağ (ayçiçek, mısır)',
    gml: 0.92,
    tolerans: 0.02,
    kaynaklar: [nv('Oil%2C_salad_or_cooking%2C_soybean'), KA],
    verified: true,
  },
  // USDA zeytinyağı: 1 cup = 216 g → 0,913; 1 tbsp = 13,5 g
  zeytinyagi: {
    ad: 'Zeytinyağı',
    gml: 0.91,
    tolerans: 0.02,
    kaynaklar: [nv('Oil%2C_salad_or_cooking%2C_olive'), KA],
    verified: true,
  },
  // USDA tereyağı: 1 cup = 227 g → 0,959; 1 tbsp = 14,2 g. King Arthur 1/2 cup = 113 g → 0,955
  tereyagi: {
    ad: 'Tereyağı (oda sıcaklığında, bastırılmış)',
    gml: 0.96,
    tolerans: 0.05,
    kaynaklar: [nv('Butter%2C_salted'), KA],
    verified: true,
    not: 'Kaşığa ya da bardağa boşluk kalmadan bastırılmış yumuşak tereyağı.',
  },
  // Eritilmiş tereyağı: süt yağı (~0,91) ve su (~%16) karışımı; fiziksel tahmin
  tereyagiEritilmis: {
    ad: 'Tereyağı (eritilmiş)',
    gml: 0.91,
    tolerans: 0.03,
    kaynaklar: [nv('Butter%2C_salted')],
    verified: false,
    not: 'Eriyen tereyağı katı hâline göre biraz daha fazla yer kaplar; yoğunluk yaklaşık değerdir.',
  },
  // Kaşıkla doldurup sıyırma: USDA 1 cup = 125 g → 0,528; King Arthur 120 g → 0,507
  un: {
    ad: 'Un (elenmemiş, kaşıkla doldurulmuş)',
    gml: 0.53,
    tolerans: 0.1,
    kaynaklar: [fdc(168894), KA, 'https://cafefernando.com/turkce/un-nasil-olculur'],
    verified: true,
    not: 'Un bardağa kaşıkla, bastırmadan doldurulup üstü bıçakla sıyrılır.',
  },
  // Bardağı una daldırıp sıyırma: Cafe Fernando 140 g / 237 ml → 0,591; yemek.com 120 g / 200 ml → 0,60
  unDaldirma: {
    ad: 'Un (bardağı una daldırarak)',
    gml: 0.59,
    tolerans: 0.1,
    kaynaklar: ['https://cafefernando.com/turkce/un-nasil-olculur', YEMEK],
    verified: true,
    not: 'Bardak un torbasına daldırılınca un sıkışır; aynı bardak ~%10 daha ağır gelir.',
  },
  // Elenmiş un: 1 cup ≈ 110–115 g → ~0,47 (blog/çizelge kaynakları; USDA pudra şekerinde elenmiş/elenmemiş = 100/120)
  unElenmis: {
    ad: 'Un (elenmiş)',
    gml: 0.47,
    tolerans: 0.1,
    kaynaklar: ['https://www.melskitchencafe.com/kitchen-tip-measuring-flour/', fdc(169656)],
    verified: false,
    not: 'Elenip bardağa serpilerek doldurulan un en hafif ölçüdür.',
  },
  // USDA 1 cup = 200 g → 0,845; King Arthur 198 g → 0,837. (yemek.com 160 g / 200 ml = 0,80)
  tozSeker: {
    ad: 'Toz şeker',
    gml: 0.85,
    tolerans: 0.05,
    kaynaklar: [fdc(169655), KA, YEMEK],
    verified: true,
  },
  // USDA elenmemiş 1 cup = 120 g → 0,507; King Arthur 113 g → 0,478
  pudraSekeri: {
    ad: 'Pudra şekeri',
    gml: 0.5,
    tolerans: 0.1,
    kaynaklar: [fdc(169656), KA],
    verified: true,
  },
  // USDA gevşek 1 cup = 145 g → 0,613
  esmerSeker: {
    ad: 'Esmer şeker (gevşek)',
    gml: 0.61,
    tolerans: 0.1,
    kaynaklar: [fdc(168833)],
    verified: false,
  },
  // USDA bastırılmış 1 cup = 220 g → 0,930; King Arthur 213 g → 0,900
  esmerSekerBastirilmis: {
    ad: 'Esmer şeker (bastırılmış)',
    gml: 0.92,
    tolerans: 0.05,
    kaynaklar: [fdc(168833), KA],
    verified: true,
  },
  // USDA 1 cup = 86 g → 0,363; King Arthur 1/2 cup = 42 g → 0,355
  kakao: { ad: 'Kakao', gml: 0.36, tolerans: 0.1, kaynaklar: [fdc(169593), KA, YEMEK], verified: true },
  // USDA mısır nişastası 1 cup = 128 g → 0,541; King Arthur 1/4 cup = 28 g → 0,473
  nisasta: { ad: 'Nişasta (mısır)', gml: 0.51, tolerans: 0.1, kaynaklar: [fdc(169698), KA], verified: true },
  // USDA semolina 1 cup = 167 g → 0,706; King Arthur 163 g → 0,689
  irmik: { ad: 'İrmik', gml: 0.7, tolerans: 0.1, kaynaklar: [fdc(169715), KA, YEMEK], verified: true },
  // USDA uzun taneli çiğ 1 cup = 185 g → 0,782; King Arthur 1/2 cup = 99 g → 0,837; yemek.com 160 g / 200 ml = 0,80
  pirinc: { ad: 'Pirinç (çiğ)', gml: 0.8, tolerans: 0.05, kaynaklar: [fdc(168877), KA, YEMEK], verified: true },
  // USDA 1 cup = 140 g → 0,592; King Arthur 152 g → 0,642; yemek.com (pilavlık) 150 g / 200 ml = 0,75
  bulgur: {
    ad: 'Bulgur',
    gml: 0.63,
    tolerans: 0.1,
    kaynaklar: [fdc(170688), KA, YEMEK],
    verified: true,
    not: 'İri pilavlık bulgur ince köftelik bulgurdan biraz daha ağır gelebilir.',
  },
  // USDA çiğ mercimek 1 cup = 192 g → 0,812; 1 tbsp = 12 g; yemek.com 170 g / 200 ml = 0,85
  mercimek: { ad: 'Mercimek (çiğ)', gml: 0.82, tolerans: 0.05, kaynaklar: [fdc(172420), YEMEK], verified: true },
  // USDA sofra tuzu 1 tbsp = 18 g, 1 tsp = 6 g → 1,217; King Arthur 1 tbsp = 18 g
  tuz: {
    ad: 'Tuz (ince sofra tuzu)',
    gml: 1.22,
    tolerans: 0.05,
    kaynaklar: [fdc(173468), KA],
    verified: true,
    not: 'İri kaya tuzu ve pul tuz aynı kaşıkta daha hafif gelir.',
  },
  // USDA 1 tbsp = 21 g → 1,420; 1 cup = 339 g → 1,433; King Arthur 1 tbsp = 21 g
  bal: { ad: 'Bal', gml: 1.42, tolerans: 0.02, kaynaklar: [nv('Honey'), KA], verified: true },
  // USDA tam yağlı yoğurt 1 cup = 245 g → 1,036
  yogurt: {
    ad: 'Yoğurt',
    gml: 1.03,
    tolerans: 0.05,
    kaynaklar: [nv('Yogurt%2C_whole_milk%2C_plain'), YEMEK],
    verified: true,
  },
  // USDA sıvı krema 1 cup = 238 g → 1,006; 1 tbsp = 15 g
  krema: {
    ad: 'Krema (sıvı)',
    gml: 1,
    tolerans: 0.02,
    kaynaklar: [nv('Cream%2C_heavy_whipping%2C_fluid'), KA],
    verified: true,
  },
  // USDA kıyılmış ceviz 1 cup = 117 g → 0,495; King Arthur 113 g → 0,478
  ceviz: {
    ad: 'Ceviz içi (kıyılmış)',
    gml: 0.49,
    tolerans: 0.1,
    kaynaklar: [nv('Nuts%2C_english%2C_walnuts'), KA],
    verified: true,
  },
  // USDA 1 cup = 81 g → 0,342; King Arthur 89 g → 0,376; yemek.com 90 g / 200 ml = 0,45
  yulaf: {
    ad: 'Yulaf ezmesi',
    gml: 0.37,
    tolerans: 0.1,
    kaynaklar: [nv('Cereals%2C_dry%2C_not_fortified%2C_regular_and_quick%2C_oats'), KA, YEMEK],
    verified: true,
  },
  // USDA 1 tsp = 4,6 g → 0,933; King Arthur 1 tsp = 4 g → 0,812
  kabartmaTozu: {
    ad: 'Kabartma tozu',
    gml: 0.9,
    tolerans: 0.1,
    kaynaklar: [nv('Leavening_agents%2C_sodium_aluminum_sulfate%2C_double-acting%2C_baking_powder'), KA],
    verified: true,
  },
} as const satisfies Record<string, Malzeme>;

export type MalzemeKodu = keyof typeof MALZEMELER;
