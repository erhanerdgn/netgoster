## Uzunluk birimleri nasıl çevrilir?

Uzunluk çevirmenin tek kuralı, her birimi önce **metreye**, sonra hedef birime dönüştürmektir. Metre, Uluslararası Birimler Sistemi'nin (SI) temel uzunluk birimidir ve 1983'ten beri ışığın boşlukta 1/299.792.458 saniyede aldığı yol olarak tanımlanır ([BIPM SI Broşürü](https://www.bipm.org/en/publications/si-brochure)). Milimetre, santimetre ve kilometre metrenin ondalık katlarıdır; inç, ayak (feet), yarda ve mil gibi İngiliz/Amerikan birimleri ise metreye sabit bir katsayıyla bağlıdır.

> **Hedef değer = Kaynak değer × (kaynak birimin metre karşılığı) ÷ (hedef birimin metre karşılığı)**

Örneğin 5 feet kaç cm sorusunda: 5 × 0,3048 m = 1,524 m; 1,524 ÷ 0,01 = **{{uz.5ft}} cm**. Yukarıdaki çevirici değeri girdiğiniz birimden diğer bütün birimlere aynı anda dönüştürür ve en çok aranan karşılığı büyük sonuç olarak gösterir.

## İnç, ayak ve mil neden "tam" sayılardır?

1959'a kadar ABD, İngiltere ve Commonwealth ülkelerinin yardası birbirinden milyonda birkaç parça farklıydı. 1 Temmuz 1959'da yürürlüğe giren **uluslararası yarda ve libre anlaşmasıyla** 1 yarda = 0,9144 metre olarak sabitlendi ([Federal Register, 1959](https://www.ngs.noaa.gov/PUBS_LIB/FedRegister/FRdoc59-5442.pdf)). Diğer birimler buradan türer ve hepsi **tam** (yuvarlanmamış) değerlerdir:

| Birim | Tanım | Metre karşılığı |
| --- | --- | --- |
| İnç (inch, ″) | 1/36 yarda | 0,0254 m = 2,54 cm |
| Ayak (foot/feet, ′) | 12 inç = 1/3 yarda | 0,3048 m |
| Yarda (yard) | 3 ayak | 0,9144 m |
| Mil (kara mili) | 1760 yarda | 1609,344 m |
| Deniz mili | 1852 m (uluslararası) | 1852 m |

Bu değerler ABD Ulusal Standartlar ve Teknoloji Enstitüsü'nün dönüşüm tablosunda da tam olarak listelenir ([NIST SP 811, Ek B.8](https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b8)). Deniz mili denizcilik ve havacılıkta kullanılır; kara milinden yaklaşık %15 uzundur. Saatte bir deniz millik hıza **knot** (deniz mili/saat) denir.

## Hazır karşılıklar: en çok aranan değerler

{{uz.tablo.populer}}

Pratik akılda tutma kuralları: 1 inç ≈ 2,5 cm, 1 feet ≈ 30 cm, 1 mil ≈ 1,6 km, 1 km ≈ 0,62 mil. Kesin sonuç için katsayıları kullanın; yuvarlanmış katsayılar uzun mesafede hata büyütür (100 mil için 1,6 kullanmak 0,93 km sapma demektir).

## Boy: metre, cm ve feet/inç karşılığı

Yurt dışı formlarında, sağlık uygulamalarında ve spor istatistiklerinde boy çoğunlukla **ayak + inç** (ör. 5′ 9″) olarak istenir. Çevirmek için boy önce inçe çevrilir, 12'ye bölünür; tam kısım ayak, kalan inçtir. Örneğin 175 cm ÷ 2,54 = **{{uz.175inc}} inç**; bunun 12'şerli {{uz.175ayak}} tanesi 60 inç eder, geriye **{{uz.175kalan}} inç** kalır: **{{uz.175ayak}}′ {{uz.175kalan}}″**.

{{uz.tablo.boy}}

Hesaplayıcıda metre, santimetre ya da ayak cinsinden 0,3–3 m arasında bir değer girdiğinizde sonuçta bu bileşik "ayak + inç" gösterimi de yer alır. Boy ve kilonuzu kullanarak [vücut kitle indeksi hesaplama](/vucut-kitle-indeksi-hesaplama) ve [kalori ihtiyacı hesaplama](/kalori-ihtiyaci-hesaplama) araçlarına geçebilirsiniz.

## TV ve monitör ekranı: inç kaç cm?

Televizyon ve monitör boyutu, ekranın **köşegen** uzunluğudur ve inçle verilir. Köşegeni cm'ye çevirmek için inç değeri 2,54 ile çarpılır: 55 inç × 2,54 = **{{uz.55cm}} cm**. Ancak salona sığıp sığmayacağı genişliğe bağlıdır. 16:9 en-boy oranlı bir ekranda Pisagor teoremiyle:

> **Genişlik = Köşegen × 16 ÷ √(16² + 9²)** · **Yükseklik = Köşegen × 9 ÷ √(16² + 9²)**

√337 ≈ 18,36 olduğundan 55 inçlik ekranın görüntü alanı yaklaşık **{{uz.55en}} × {{uz.55boy}} cm**'dir.

{{uz.tablo.tv}}

Tablodaki ölçüler yalnız görüntü alanıdır. Çerçeve modele göre her kenara 0,5–2 cm, ayaklık ise yüksekliğe 5–10 cm ekler; kesin ölçü için üreticinin teknik föyüne bakın. Çevirici "İnç" birimi seçiliyken 10–150 inç arası değerlerde bu genişlik × yükseklik hesabını da gösterir.

## Üç örnek hesap

1. **Mil → km:** Bir İngiliz yol tabelasında 26,2 mil (maraton) yazıyor: 26,2 × 1,609344 = **{{uz.maraton}} km**.
2. **km → mil:** 10 km'lik koşu kaç mil? 10 ÷ 1,609344 = **{{uz.10kmMil}} mil**. 1 km ise **{{uz.kmMil}} mil** eder.
3. **Deniz mili → m:** Kıyıdan 12 deniz mili uzaklık: 12 × {{uz.dmil}} m = **{{uz.12dmil}} m** ≈ {{uz.12dmilKm}} km.

## Sık yapılan hatalar

- **Feet ile inçi ondalık sanmak:** 5′ 9″, 5,9 feet değildir; 5 feet + 9 inç = {{uz.5ft9ft}} feet = {{uz.5ft9}} cm'dir. 5,9 feet ise {{uz.59ft}} cm eder.
- **Kara mili ile deniz milini karıştırmak:** Gemi ve uçak mesafeleri deniz miliyle (1852 m) verilir; kara mili 1609,344 m'dir.
- **TV inçini genişlik sanmak:** 55 inç = 139,7 cm köşegendir; genişlik bundan yaklaşık 18 cm kısadır.
- **Yuvarlanmış katsayı kullanmak:** 1 inç = 2,5 cm almak her inçte 0,4 mm hata demektir; 100 inçte 4 cm'ye ulaşır.
- **ABD "survey foot" ile karıştırmak:** Eski ABD harita verilerinde kullanılan ve 2022'de emekliye ayrılan "survey foot" (1200/3937 m) uluslararası ayaktan milyonda 2 uzundur; günlük kullanımda fark edilmez.

Alan ölçüleri (m², dönüm, hektar) için [alan çevirici](/alan-cevirici), kilo-pound dönüşümü için [ağırlık çevirici](/agirlik-cevirici), yolculuk maliyeti için [yakıt hesaplama](/yakit-hesaplama) araçlarını kullanabilirsiniz.

<!-- sss -->

### 1 inç kaç cm eder?

1 inç tam olarak **{{uz.inc}} cm**'dir (25,4 mm). Bu değer 1959 uluslararası anlaşmasıyla sabitlenmiştir; yuvarlanmış değil, tanım gereği kesindir.

### 5 feet kaç cm?

1 feet (ayak) {{uz.ft}} cm olduğundan 5 feet = 5 × {{uz.ft}} = **{{uz.5ft}} cm**'dir. Boy olarak 5 feet 9 inç ise {{uz.5ft}} + 9 × {{uz.inc}} = {{uz.5ft9}} cm eder.

### 1,75 m boy kaç feet?

175 cm ÷ 2,54 = {{uz.175inc}} inç; bu da **{{uz.175ayak}} feet {{uz.175kalan}} inç** (yazımı {{uz.175ayak}}′ {{uz.175kalan}}″) eder. Ondalık feet olarak yaklaşık {{uz.175ft}} feet'tir.

### 1 mil kaç km eder?

1 mil (kara mili) tam olarak **{{uz.mil}} km**'dir. Tersi: 1 km = {{uz.kmMil}} mil.

### 55 inç televizyon kaç cm?

55 inç köşegen **{{uz.55cm}} cm**'dir. 16:9 oranlı ekranda görüntü alanı yaklaşık {{uz.55en}} cm genişlik, {{uz.55boy}} cm yüksekliktir; çerçeveyle birkaç cm daha büyük olur.

### Deniz mili ile mil arasındaki fark nedir?

Deniz mili {{uz.dmil}} metredir ve Dünya'nın bir enlem dakikasına yakın bir uzunluk olarak denizcilik ve havacılıkta kullanılır. Kara mili 1609,344 metredir. Yani 1 deniz mili yaklaşık 1,15 kara milidir.

### 1 metre kaç feet eder?

1 m ÷ 0,3048 = yaklaşık **{{uz.mFt}} feet**'tir (3 feet {{uz.mKalan}} inç). Kabaca 1 metre ≈ 3 feet 3 inç diye akılda tutulabilir.

### Bir yarda kaç metre?

1 yarda tam olarak **0,9144 m** (91,44 cm) eder ve 3 feet'e eşittir. Futbol ve golf mesafelerinde hâlâ yaygın olarak kullanılır.
