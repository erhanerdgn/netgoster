## Gün, hafta, ay ve yıl çevirici ne yapar?

Bu araç bir süreyi saniye, dakika, saat, gün, hafta, ay ve yıl arasında çevirir. Süreyi ve birimini girdiğinizde tüm birimlerdeki karşılığı ile en çok merak edilen bileşik gösterimi birlikte verir: **249 gün = {{zc.249.ayGun}}** (≈ {{zc.249.ay}} ay) ya da **{{zc.249.haftaGun}}**.

İsterseniz bir **başlangıç tarihi** de girebilirsiniz. Bu durumda süre takvim üzerinde sayılır; bitiş tarihi ve ayların 28–31 gün çekmesi hesaba katılmış kesin "X ay Y gün" sonucu ayrıca gösterilir.

## Birimlerin tanımı ve formül

Saniye, Uluslararası Birim Sistemi'nin (SI) temel zaman birimidir. Dakika, saat ve gün SI ile birlikte kullanılmasına izin verilen birimlerdir ve tanımları sabittir ([BIPM SI Broşürü](https://www.bipm.org/en/publications/si-brochure)). Hafta 7 gündür. Ay ve yıl ise takvime bağlıdır; uzunlukları değiştiği için hesapta ortalama değer kullanılır:

| Birim | Gün karşılığı | Saniye karşılığı |
| --- | --- | --- |
| 1 dakika | — | 60 saniye |
| 1 saat | — | 3.600 saniye |
| 1 gün | 1 gün | 86.400 saniye |
| 1 hafta | 7 gün | 604.800 saniye |
| 1 ay (ortalama) | 30,436875 gün | 2.629.746 saniye |
| 1 yıl (ortalama) | 365,2425 gün | 31.556.952 saniye |

Çeviri her zaman aynı iki adımla yapılır:

> **Hedef birimde süre** = Girilen süre × (kaynak birimin saniyesi ÷ hedef birimin saniyesi)

Örneğin gün → ay için: Ay = Gün ÷ 30,436875. Bileşik gösterimde önce tam aylar alınır, kalan gün en yakın tam güne yuvarlanır.

## Bir ay kaç gün, bir yıl kaç gün?

Türkiye'nin 1 Ocak 1926'dan beri kullandığı **Gregoryen takvimde** yıl 365 gündür; 4'e bölünen yıllar 366 gün (artık yıl) olur, ancak 100'e bölünüp 400'e bölünmeyen yıllar (1900, 2100 gibi) artık yıl sayılmaz. 400 yılda 97 artık yıl bulunduğundan **ortalama yıl 365,2425 gün**, ortalama ay bunun on ikide biri olan **30,436875 gün** (yaklaşık 30,44) eder.

Günlük hayatta ve bazı ticari hesaplarda ise yuvarlak kabuller kullanılır: **1 ay = 30 gün**, **1 yıl = 365 gün**. Araç bu iki kabulü de ayrı satırda gösterir. Örneğin 249 gün, 30 günlük ayla {{zc.249.ay30}} ay, yani {{zc.249.ay30Gun}} eder; ortalama ayla ise {{zc.249.ayGun}}. Hangisinin doğru olduğu, sorunun nerede kullanılacağına bağlıdır: maaş ve faiz hesaplarında çoğunlukla 30/360 kabulü, takvim planlamasında ise gerçek takvim esas alınır.

## Örnek hesaplamalar

### 249 gün kaç ay?

249 ÷ 30,436875 = {{zc.249.ay}} ay. Tam kısım 8 ay; 8 ay 243,5 gün ettiği için geriye 5,5 gün, yuvarlanınca 6 gün kalır: **{{zc.249.ayGun}}**. Hafta olarak 249 ÷ 7 = 35, kalan 4: **{{zc.249.haftaGun}}**.

### 40 hafta kaç ay?

40 × 7 = **{{zc.40h.gun}} gün**; bu da {{zc.40h.ay}} ortalama ay, yani **{{zc.40h.ayGun}}** eder. Gebelikte sık duyulan "9 ay 10 gün" sözü yaklaşık bir halk ifadesidir; doğum tarihi son adet tarihine 280 gün eklenerek bulunur. Haftanızı ve tahmini doğum tarihinizi [gebelik haftası hesaplama](/gebelik-haftasi-hesaplama) aracıyla görebilirsiniz.

### 100 saat kaç gün?

100 ÷ 24 = {{zc.100s.gun}} gün; tam günler ve kalan saatlerle **{{zc.100s.gunSaat}}**. Saat ve dakika toplamak, iki saat arasındaki süreyi bulmak için [saat hesaplama](/saat-hesaplama) aracı daha uygundur.

## Takvime göre kesin hesap: başlangıç tarihi girin

Ortalama ay bir istatistiktir; gerçek aylar 28 ile 31 gün arasında değişir. Bu yüzden aynı süre, başladığı tarihe göre farklı "ay + gün" sonucu verir:

- 01.01.2026'dan itibaren 249 gün **{{zc.249.takvimA.bitis}}** tarihinde dolar: takvime göre **{{zc.249.takvimA.metin}}**.
- 01.03.2026'dan itibaren 249 gün **{{zc.249.takvimB.bitis}}** tarihinde dolar: takvime göre **{{zc.249.takvimB.metin}}**.

Tersi de geçerlidir. "6 ay" ortalama {{zc.6ay.ort}} gün, 30 günlük ayla {{zc.6ay.gelenek}} gündür; ama 01.01.2026'dan başlayan 6 ay **{{zc.6ay.takvimA}} gün**, 01.07.2026'dan başlayan 6 ay **{{zc.6ay.takvimB}} gün** sürer. Ortalama ile takvim arasındaki fark çoğunlukla 1–3 gündür. Takvim hesabında ay, başlangıç gününün sonraki aylardaki karşılığı sayılarak eklenir; o gün hedef ayda yoksa (31 Ocak + 1 ay gibi) bir sonraki ayın 1'i esas alınır. İki tarih arasındaki farkı doğrudan bulmak için [tarih hesaplama](/tarih-hesaplama), doğum tarihinden yaşınızı yıl-ay-gün olarak bulmak için [yaş hesaplama](/yas-hesaplama) aracını kullanabilirsiniz.

## Popüler değerler: gün kaç hafta, kaç ay, kaç yıl?

"Ay + gün" ve "Yıl / ay / gün" sütunları ortalama ay (30,44 gün) ve yılla (365,24 gün) hesaplanmıştır.

| Gün | Hafta + gün | Ay (ortalama) | Ay + gün | 30 günlük ayla | Yıl |
| --- | --- | --- | --- | --- | --- |
{{zc.tablo.gun}}

## Popüler değerler: hafta kaç ay?

| Hafta | Gün | Ay (ortalama) | Ay + gün |
| --- | --- | --- | --- |
{{zc.tablo.hafta}}

## Popüler değerler: saat kaç gün?

| Saat | Gün | Gün + saat | Dakika |
| --- | --- | --- | --- |
{{zc.tablo.saat}}

## Sık yapılan hatalar

- **Her ayı 30 gün saymak:** Kısa sürelerde fark küçüktür, ama 12 ay × 30 = 360 gün eder; gerçek yıldan 5–6 gün eksik kalır.
- **"3 ay" ile "90 gün"ü eş saymak:** Sözleşme, deneme süresi ve kira gibi işlerde "ay" çoğunlukla takvim ayıdır; 90 gün ise gün gün sayılır. İkisi aynı tarihe denk gelmeyebilir.
- **Ondalık ayı gün sanmak:** 8,18 ay "8 ay 18 gün" değildir; 0,18 ay yaklaşık 5,5 gündür.
- **Artık yılı unutmak:** Şubat'ı kapsayan uzun sürelerde 29 Şubat bir gün ekler; takvim hesabı bunu kendiliğinden dikkate alır.
- **Haftayı 4 ile çarpıp ay bulmak:** 1 ay 4 hafta değil, yaklaşık 4,35 haftadır.

<!-- sss -->

### 1 ay kaç gün eder?

Takvimde aylar 28, 29, 30 veya 31 gün çeker. Ortalama ay uzunluğu 365,2425 ÷ 12 = 30,44 gündür. Günlük kullanımda ve ticari hesaplarda 1 ay çoğunlukla 30 gün kabul edilir.

### 1 yıl kaç gün, kaç hafta, kaç saat?

Normal yıl 365 gün, artık yıl 366 gündür; ortalama 365,2425 gün eder. 365 günlük yıl 52 hafta 1 gün ve 8.760 saattir; artık yıl 52 hafta 2 gün ve 8.784 saattir.

### 249 gün kaç ay eder?

249 gün ortalama ayla {{zc.249.ay}} ay, yani {{zc.249.ayGun}} eder. 30 günlük ayla {{zc.249.ay30Gun}} bulunur. Takvime göre kesin sonuç başlangıç tarihine bağlıdır; aracın tarih alanını doldurarak görebilirsiniz.

### 40 hafta kaç ay ve kaç gün?

40 hafta {{zc.40h.gun}} gündür ve ortalama ayla {{zc.40h.ayGun}} ({{zc.40h.ay}} ay) eder. Gebelikte 40 hafta, son adet tarihinden itibaren sayılan ortalama gebelik süresidir.

### 100 gün kaç hafta, kaç ay?

100 gün {{zc.100g.haftaGun}} eder. Ortalama ayla {{zc.100g.ay}} ay, yani {{zc.100g.ayGun}}; 30 günlük ayla {{zc.100g.ay30Gun}} bulunur.

### 1 ay kaç hafta eder?

Ortalama ay 30,44 gün olduğundan 1 ay 30,44 ÷ 7 ≈ {{zc.ay.hafta}} haftadır. 4 hafta yalnızca 28 gündür ve bir aydan 2–3 gün kısadır.

### Neden ortalama ay ile takvim sonucu farklı çıkıyor?

Ortalama ay 30,44 gündür, ama gerçek aylar 28–31 gün arasında değişir. Şubat'ı içeren bir süre daha kısa, 31 çeken ayları içeren bir süre daha uzun olur. Bu yüzden takvim sonucu ortalamadan genellikle 1–3 gün farklıdır. Başlangıç tarihi girdiğinizde araç takvime göre kesin sonucu verir.

### 72 saat kaç gün eder?

72 saat 72 ÷ 24 = 3 gündür. 48 saat 2 gün, 168 saat 1 hafta, 720 saat 30 gündür.
