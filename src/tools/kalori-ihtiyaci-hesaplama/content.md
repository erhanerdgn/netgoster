## Günlük kalori ihtiyacı nedir?

Günlük kalori ihtiyacı, vücudunuzun bir gün boyunca harcadığı toplam enerjidir (İngilizcede *Total Daily Energy Expenditure, TDEE*). Üç bileşenden oluşur:

- **Bazal metabolizma hızı (BMR):** Tam dinlenme hâlinde solunum, dolaşım, vücut ısısı ve hücre yenilenmesi için harcanan enerji. Çoğu kişide toplam harcamanın en büyük kısmıdır.
- **Fiziksel aktivite:** Yürüme, iş, ev işleri ve egzersiz. Kişiden kişiye en çok değişen bileşendir.
- **Besinlerin termik etkisi:** Yediklerinizi sindirmek ve işlemek için harcanan enerji (toplamın yaklaşık onda biri).

Bu hesaplayıcı önce BMR'yi bilimsel bir formülle tahmin eder, ardından aktivite katsayısıyla çarparak günlük ihtiyacı bulur.

## Mifflin-St Jeor formülü

1990 yılında Mifflin, St Jeor ve arkadaşlarının *American Journal of Clinical Nutrition*'da yayımladığı çalışmada, 19–78 yaş arası normal kilolu ve obez 498 sağlıklı yetişkinin dinlenme enerji harcaması dolaylı kalorimetriyle ölçülmüş ve şu denklemler geliştirilmiştir:

> **Erkek: BMR = 10 × kilo (kg) + 6,25 × boy (cm) − 5 × yaş + 5**
>
> **Kadın: BMR = 10 × kilo (kg) + 6,25 × boy (cm) − 5 × yaş − 161**

Çalışma, uzun yıllar kullanılan Harris-Benedict denkleminin ölçülen değerleri yaklaşık %5 fazla tahmin ettiğini göstermiştir. Sonraki karşılaştırmalı değerlendirmeler de Mifflin-St Jeor denklemini sağlıklı yetişkinlerde en tutarlı tahmin yöntemlerinden biri olarak öne çıkarmıştır.

## Aktivite katsayıları

BMR, aktivite düzeyinize karşılık gelen katsayıyla çarpılır:

| Aktivite düzeyi | Tanım | Katsayı |
| --- | --- | --- |
| Hareketsiz | Masa başı iş, egzersiz yok | 1,2 |
| Hafif aktif | Haftada 1–3 gün hafif egzersiz | 1,375 |
| Orta aktif | Haftada 3–5 gün orta egzersiz | 1,55 |
| Çok aktif | Haftada 6–7 gün yoğun egzersiz | 1,725 |
| Aşırı aktif | Ağır bedensel iş veya günde iki antrenman | 1,9 |

Bu katsayılar Mifflin çalışmasının parçası değildir; uygulamada yaygın kullanılan yaklaşık çarpanlardır. Çoğu kişi aktivitesini olduğundan yüksek tahmin eder; emin değilseniz bir alt düzeyi seçmek daha gerçekçi sonuç verir.

## Kilo vermek veya almak için hedef

Hesaplayıcı, kilo vermek için günlük ihtiyaçtan **500 kcal düşer**, kilo almak için **500 kcal ekler**. Haftada yaklaşık 3.500 kcal'lik fark, kabaca 0,5 kg'lık değişime karşılık gelir. Bu basit kural kısa vadede iyi bir başlangıç noktasıdır; ancak kilo değiştikçe vücut daha az enerji harcamaya başlar ve kayıp zamanla yavaşlar. NIH'in Body Weight Planner aracı bu uyumu hesaba katan daha ayrıntılı bir model sunar.

Hedef kaloriniz bazal metabolizma hızınızın altına düşerse hesaplayıcı uyarı verir: bu düzeyde uzun süreli diyet, uzman gözetimi olmadan önerilmez.

## Makro besin dağılımı önerisi

Sonuç kartının altında, hedef kalorinizin **%{{kl.protein}} protein, %{{kl.yag}} yağ ve %{{kl.karbonhidrat}} karbonhidrat** olarak paylaştırıldığı bir öneri görürsünüz. Bu oranlar, ABD Ulusal Akademileri'nin (IOM) yetişkinler için belirlediği kabul edilebilir makro besin dağılım aralıklarının (protein %10–35, yağ %20–35, karbonhidrat %45–65) orta değerleridir. Gram hesabında protein ve karbonhidrat için 4 kcal/g, yağ için 9 kcal/g kullanılır.

## Hesaplayıcı nasıl kullanılır?

Cinsiyetinizi, yaşınızı, boyunuzu ve kilonuzu girin; ardından aktivite düzeyinizi ve hedefinizi seçin. Sonuç kartında bazal metabolizma hızınız, koruma kaloriniz ve hedefinize göre günlük kalori miktarı görünür. Altındaki tablo, beş aktivite düzeyinin her biri için koruma, kilo verme ve kilo alma kalorilerini yan yana göstererek egzersiz alışkanlığınızı değiştirdiğinizde ihtiyacınızın nasıl değişeceğini karşılaştırmanızı sağlar.

## Örnek hesaplamalar

### Örnek 1: Orta aktif erkek

30 yaşında, 180 cm, 80 kg, haftada 3–5 gün egzersiz yapan bir erkek:

- BMR = 800 + 1.125 − 150 + 5 = **{{kl.a.bmr}}**
- Günlük ihtiyaç = BMR × 1,55 = **{{kl.a.tdee}}**

### Örnek 2: Kilo vermek isteyen kadın

35 yaşında, 165 cm, 75 kg, hafif aktif bir kadın:

- BMR = 750 + 1.031,25 − 175 − 161 ≈ **{{kl.b.bmr}}**
- Koruma kalorisi = BMR × 1,375 ≈ {{kl.b.tdee}}
- Kilo verme hedefi: **{{kl.b.hedefKcal}}** (protein {{kl.b.makro.protein}}, yağ {{kl.b.makro.yag}}, karbonhidrat {{kl.b.makro.karbonhidrat}})

### Örnek 3: Kilo almak isteyen kadın

22 yaşında, 160 cm, 48 kg, orta aktif bir kadının BMR'si {{kl.c.bmr}}, koruma kalorisi {{kl.c.tdee}}'dir. Kilo alma hedefiyle günlük ihtiyacı **{{kl.c.hedefKcal}}** olur.

## Formülün sınırlamaları

- **Tahmindir.** Aynı yaş, boy ve kilodaki iki kişinin gerçek harcaması, kas kütlesi ve genetik farklılıklar nedeniyle birkaç yüz kalori farklı olabilir.
- **Özel durumlarda geçersizdir.** Gebelik, emzirme, 18 yaş altı, ileri derecede obezite, tiroid hastalıkları ve diğer kronik hastalıklarda ihtiyaç farklıdır.
- **Takip gerektirir.** Belirlediğiniz kaloriyle 2–3 hafta boyunca kilonuzu izleyin; beklenen değişim yoksa 100–200 kcal'lik ayarlamalar yapın.

Kilonuzun boyunuza göre durumunu [vücut kitle indeksi hesaplama](/vucut-kitle-indeksi-hesaplama), günlük sıvı ihtiyacınızı [su ihtiyacı hesaplama](/su-ihtiyaci-hesaplama) araçlarıyla öğrenebilirsiniz.

## Bilimsel dayanak

- Mifflin MD, St Jeor ST ve ark. *A new predictive equation for resting energy expenditure in healthy individuals.* Am J Clin Nutr. 1990;51(2):241-247.
- Institute of Medicine (National Academies). *Dietary Reference Intakes for Energy, Carbohydrate, Fiber, Fat, Fatty Acids, Cholesterol, Protein, and Amino Acids* (makro besin aralıkları).
- T.C. Sağlık Bakanlığı, *Türkiye Beslenme Rehberi (TÜBER 2022)*.

<!-- sss -->

### Bazal metabolizma hızı (BMR) nedir?

Vücudun tam dinlenme hâlinde yaşamsal işlevlerini sürdürmek için harcadığı enerjidir. Günlük kalori ihtiyacının en büyük bölümünü oluşturur ve kas kütlesi arttıkça yükselir.

### Mifflin-St Jeor formülü ne kadar doğrudur?

Sağlıklı yetişkinlerin çoğunda ölçülen değere yakın sonuç verir ve Harris-Benedict denkleminden daha tutarlı bulunmuştur. Yine de bireysel sapmalar olabileceğinden sonucu başlangıç noktası olarak kullanın.

### Kilo vermek için günde kaç kalori almalıyım?

Genel bir başlangıç olarak koruma kalorinizden yaklaşık 500 kcal eksiği hedeflenir; bu haftada yaklaşık 0,5 kg kayba karşılık gelir. Bazal metabolizma hızınızın altına inen diyetler için uzmana danışın.

### Aktivite düzeyimi nasıl seçmeliyim?

İşinizin hareket düzeyini ve haftalık egzersiz sıklığınızı birlikte düşünün. Masa başı çalışıp haftada iki gün yürüyüş yapan biri için "hafif aktif" uygun bir seçimdir. Kararsızsanız düşük olanı seçin.

### Gebelikte bu hesaplayıcıyı kullanabilir miyim?

Hayır. Gebelik ve emzirme döneminde enerji ihtiyacı trimestere ve emzirme durumuna göre artar; ihtiyacınızı doktorunuz veya diyetisyeninizle belirleyin.

### Makro dağılımı herkes için aynı mı olmalı?

Hayır. Önerilen oranlar genel sağlıklı yetişkinler içindir. Sporcular, diyabet veya böbrek hastalığı olanlar gibi özel gruplarda dağılım uzman tarafından kişiye göre belirlenmelidir.

### Neden kilo vermem zamanla yavaşlıyor?

Kilo verdikçe vücudunuzun enerji harcaması azalır ve aynı kalori açığı daha küçük bir kayba yol açar. Bu nedenle birkaç haftada bir hesaplamayı güncel kilonuzla yenilemek önerilir.
