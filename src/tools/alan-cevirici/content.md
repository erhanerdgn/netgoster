## Alan birimleri nasıl çevrilir?

Alan birimleri, uzunluk biriminin karesidir: 1 m² kenarı 1 metre olan karenin alanıdır. Çevirmenin en güvenli yolu değeri önce **metrekareye**, sonra hedef birime dönüştürmektir:

> **Hedef değer = Kaynak değer × (kaynak birimin m² karşılığı) ÷ (hedef birimin m² karşılığı)**

Uzunlukta 10 kat olan fark alanda 100 kata çıkar: 1 m = 100 cm iken 1 m² = 10.000 cm²'dir. Çeviricide alanı ve birimini seçtiğinizde m², dönüm, dekar, hektar, ar, km², fit kare ve akre karşılıklarının hepsi aynı anda listelenir; büyük sonuç en çok aranan karşılığı (ör. m² → dönüm, hektar → dönüm) gösterir.

| Birim | m² karşılığı | Not |
| --- | --- | --- |
| Ar | 100 m² | 10 m × 10 m |
| Dekar | 1.000 m² | 10 ar |
| Dönüm | 1.000 m² | Dekarla aynı (1945'ten beri) |
| Hektar | 10.000 m² | 100 m × 100 m = 10 dönüm |
| Kilometrekare | 1.000.000 m² | 100 hektar |
| Fit kare (ft²) | 0,09290304 m² | 0,3048 m × 0,3048 m |
| Akre (acre) | 4.046,8564224 m² | 43.560 ft² |

Ar, dekar ve hektar metrenin ondalık katlarından türetilmiş birimlerdir ([BIPM SI Broşürü](https://www.bipm.org/en/publications/si-brochure)). Fit kare ve akre katsayıları 1959 uluslararası ayak tanımından (0,3048 m) gelir ve tamdır ([NIST SP 811, Ek B.8](https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b8)).

## 1 dönüm kaç m²? Yeni ve eski dönüm farkı

Bugün Türkiye'de **1 dönüm = {{alan.donumM2}} m²** kabul edilir ve **dekar** ile aynı birimdir. Bu değer 11 Haziran 1945 tarihli **4753 sayılı Kanun**'un 5. maddesiyle belirlenmiştir. Tapu, kadastro, tarım desteği ve imar işlemlerinde "dönüm" dendiğinde bu 1000 m²'lik **yeni dönüm** anlaşılır; çevirici de bu değeri kullanır.

Osmanlı döneminde ise **şer'î (eski) dönüm** 40 × 40 = 1600 kare mimar arşını olarak tanımlanırdı. Arşının metre karşılığı kaynaklara göre biraz değiştiği için eski dönüm yaklaşık 916,8 ile **{{alan.eski}} m²** arasında verilir; dönümün dörtte birine **evlek** denirdi (≈ {{alan.eskiEvlek}} m²) ([TDV İslâm Ansiklopedisi, "Dönüm"](https://islamansiklopedisi.org.tr/donum)). Yani eski dönüm, yeni dönümden yaklaşık {{alan.eskiFark}} m² küçüktür. 1945 öncesine ait tapu kayıtlarında, miras paylaşımında veya köylerdeki sözlü ölçülerde bu fark önemlidir: eski kayıtta "5 dönüm" yazan bir tarla bugünkü ölçüyle yaklaşık {{alan.eski5}} dönümdür. Çevirici sonuçta bu yaklaşık "eski dönüm" karşılığını ayrıca gösterir; resmî işlemler için tapudaki m² değerini esas alın.

## Dönüm → m², hektar ve ar tablosu

{{alan.tablo.donum}}

## m² kaç dönüm eder?

Metrekareyi dönüme çevirmek için 1000'e bölmek yeterlidir: 2.500 m² ÷ 1000 = 2,5 dönüm.

{{alan.tablo.m2}}

## Hektar kaç dönüm?

1 hektar = {{alan.haM2}} m² = **{{alan.haDonum}} dönüm**'dür. Avrupa Birliği tarım istatistikleri ve uluslararası raporlar hektar, ABD ve İngiltere ise akre kullanır.

{{alan.tablo.ha}}

## Üç örnek hesap

1. **Arsa ilanı:** 3.750 m²'lik tarla kaç dönüm? 3.750 ÷ 1000 = **{{alan.o1}} dönüm**.
2. **Hektardan dönüme:** 2,5 hektarlık bağ: 2,5 × 10 = **{{alan.o2}} dönüm** = {{alan.o2m2}} m².
3. **m² → ft²:** Yurt dışı ilanı için 120 m²'lik daire: 120 × {{alan.m2Ft2}} ≈ **{{alan.o3}} ft²**.

## Tapu, vergi ve ilanlarda alan

Tapu senedinde yüzölçümü m² olarak yazılır. Arsa ve tarla alım satımında ödenecek tapu harcı alana değil, beyan edilen satış bedeline göre hesaplanır; tutarı [tapu harcı hesaplama](/tapu-harci-hesaplama) aracıyla bulabilirsiniz. Belediyeye ödenen arsa ve arazi vergisi ise m² başına belirlenen birim değer ile alanın çarpımından hesaplanan vergi değeri üzerinden alınır; ayrıntı için [emlak vergisi hesaplama](/emlak-vergisi-hesaplama) aracına bakın. Apartman gider paylaşımında metrekare oranı kullanılıyorsa [aidat hesaplama](/aidat-hesaplama) aracı işinize yarar.

## Sık yapılan hatalar

- **Uzunluk katsayısını alana uygulamak:** 1 m = 3,28 feet ama 1 m² = 3,28 ft² değil, {{alan.m2Ft2}} ft²'dir (katsayının karesi).
- **Eski ve yeni dönümü karıştırmak:** Eski tapu ya da miras kaydındaki dönüm 1000 m² değil, yaklaşık {{alan.eski}} m² olabilir.
- **Hektarı 1000 m² sanmak:** Hektar 10.000 m²'dir; 1000 m² dekar/dönümdür.
- **Brüt ve net alanı karıştırmak:** Konut ilanlarındaki brüt m² duvarları ve ortak alan payını içerir; tapudaki ve kullanılabilir alan farklı olabilir.
- **Akreyi dönüm sanmak:** 1 akre yaklaşık {{alan.acreDonum}} dönümdür.

Uzunluk ölçüleri için [uzunluk çevirici](/uzunluk-cevirici), ağırlık için [ağırlık çevirici](/agirlik-cevirici) araçlarını kullanabilirsiniz.

<!-- sss -->

### 1 dönüm kaç metrekare?

1 dönüm **{{alan.donumM2}} m²**'dir. Bu değer 1945 tarihli 4753 sayılı Kanun'la belirlenmiştir ve dekarla aynıdır. Osmanlı dönemine ait eski dönüm ise yaklaşık {{alan.eski}} m²'dir.

### Dönüm ile dekar arasında fark var mı?

Bugün yoktur: ikisi de 1000 m²'dir. "Dekar" resmî ve teknik metinlerde, "dönüm" günlük dilde ve ilanlarda kullanılır. Fark yalnız 1945 öncesi eski dönüm için söz konusudur.

### 1 hektar kaç dönüm eder?

1 hektar = {{alan.haM2}} m² = **{{alan.haDonum}} dönüm**'dür. 1 km² ise {{alan.km2Ha}} hektar, yani {{alan.km2Donum}} dönüm eder.

### 2500 m² kaç dönüm?

2.500 ÷ 1000 = **2,5 dönüm**'dür (iki buçuk dönüm). Hektar olarak 0,25 hektar eder.

### Eski dönüm kaç m²?

Osmanlı'daki şer'î dönüm 1600 kare mimar arşınıdır; kaynaklara göre 916,8 ile {{alan.eski}} m² arasında verilir. Dörtte birine evlek denir. Resmî işlemlerde tapudaki m² değeri esas alınır.

### 1 acre (akre) kaç m²?

1 uluslararası akre 43.560 fit kare = **{{alan.acreM2}} m²**'dir; yaklaşık {{alan.acreDonum}} dönüm eder.

### 1 m² kaç fit kare?

1 m² ≈ **{{alan.m2Ft2}} ft²**'dir. Tersi: 1 ft² = 0,09290304 m² (yaklaşık 929 cm²).

### Ar ne kadardır?

1 ar = 100 m²'dir (10 m × 10 m). 10 ar 1 dekar (dönüm), 100 ar 1 hektar eder. Ar Türkiye'de günlük kullanımda pek yer almaz ama kadastro belgelerinde görülebilir.
