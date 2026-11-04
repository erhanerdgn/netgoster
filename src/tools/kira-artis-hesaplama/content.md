## Kira artışı nasıl hesaplanır?

Konut ve çatılı işyeri kiralarında yenilenen kira dönemi için yapılabilecek **en yüksek artış**, Türk Borçlar Kanunu'nun 344. maddesiyle sınırlanmıştır: artış oranı, bir önceki kira yılında **tüketici fiyat endeksindeki (TÜFE) on iki aylık ortalamalara göre değişim oranını** geçemez. Bu oran her ay TÜİK tarafından enflasyon verisiyle birlikte açıklanır ve kamuoyunda "kira artış oranı" olarak bilinir.

Hesaplama basittir:

> **Artış tutarı = Mevcut kira × 12 aylık ortalama TÜFE değişimi / 100**
>
> **Yeni kira = Mevcut kira + Artış tutarı**

Sözleşmede daha yüksek bir oran (ör. "her yıl %50 artış") yazsa bile bu sınır aşılamaz; sınırın üzerindeki kısım geçersizdir. Taraflar elbette daha düşük bir artışta anlaşabilir.

## Hangi ayın TÜFE verisi esas alınır?

Uygulamada kira yılının başladığı, yani **yenilemenin yapıldığı aydan bir önceki ayın** 12 aylık ortalama TÜFE değişimi kullanılır. TÜİK bir ayın enflasyonunu izleyen ayın 3'ünde açıkladığı için, yenileme ayına girildiğinde bilinen en güncel veri bir önceki aya aittir.

- Kasım ayında yenilenen sözleşme → Ekim ayı verisi (3 Kasım'da açıklanır)
- Ocak ayında yenilenen sözleşme → bir önceki yılın Aralık verisi

Şu anda açıklanmış en güncel veri **{{tufe.sonAy}}** ayına aittir: 12 aylık ortalama değişim **{{tufe.ortalama12}}**. Bu oran **{{kira.yenilemeAy}}** ayında yenilenen kira sözleşmelerine uygulanır. Henüz verisi açıklanmamış bir ay seçerseniz hesaplayıcı sizi uyarır ve en son açıklanan oranı tahmini olarak gösterir.

Dikkat: 12 aylık ortalama, **yıllık enflasyonla** (bir önceki yılın aynı ayına göre değişim, şu anda {{tufe.yillik}}) ve **aylık enflasyonla** aynı şey değildir. Kira sınırı için yalnızca "12 aylık ortalamalara göre değişim" satırı kullanılır.

## Örnek hesaplamalar

### Örnek 1: Konut, 20.000 TL, {{kira.yenilemeAy}} yenilemesi

- Azami artış oranı: {{tufe.ortalama12}}
- Aylık artış: **{{kira.o1.artis}}**
- Yeni kira: **{{kira.o1.yeniKira}}**
- Bir yıllık ek ödeme: {{kira.o1.yillikFark}}

### Örnek 2: İşyeri, 45.000 TL, {{kira.yenilemeAy}} yenilemesi

İşyeri kiralarında da aynı sınır geçerlidir.

- Aylık artış: **{{kira.o2.artis}}**
- Yeni kira: **{{kira.o2.yeniKira}}**

### Örnek 3: Konut, 15.000 TL, Mart 2024 yenilemesi (%25 sınırı)

Şubat 2024'te 12 aylık ortalama TÜFE {{kira.o3.tufe}} idi; ancak o dönem konutlarda geçici %25 sınırı vardı.

- Uygulanan oran: %25
- Yeni kira: **{{kira.o3.yeniKira}}** (artış {{kira.o3.artis}})

## Konut kiralarında %25 sınırı (2022–2024)

Yüksek enflasyon döneminde 7409 sayılı Kanunla TBK'ya eklenen geçici madde, **11.06.2022 – 01.07.2024** arasında yenilenen **konut** kiralarında artışı %25 ile sınırlamıştı (süre 7456 sayılı Kanunla uzatıldı). Bu sınır 01.07.2024'te sona erdi; 2 Temmuz 2024'ten itibaren yenilenen sözleşmelerde yeniden TÜFE 12 aylık ortalaması geçerlidir. İşyeri kiralarında %25 sınırı hiç uygulanmadı. Hesaplayıcıda geçmiş bir yenileme tarihi seçerseniz bu kural otomatik uygulanır.

## İşyeri kiraları ve 5 yıllık hakkaniyet artışı

TBK 344, çatılı işyerleri için de aynı TÜFE sınırını öngörür. Ayrıca beş yıldan uzun süreli veya beş yıldan sonra yenilenen kira sözleşmelerinde, her beş yıllık dönemin sonunda kira bedeli **hâkim tarafından hakkaniyete göre** yeniden belirlenebilir. Bu "kira tespit davasında" mahkeme TÜFE değişimini, taşınmazın durumunu ve emsal kiraları birlikte değerlendirir; bu nedenle beşinci yıldan sonra artış TÜFE sınırının üzerinde olabilir. Tespit davası, yeni kira döneminin başlangıcından en geç 30 gün önce açılırsa veya ev sahibi bu süre içinde yazılı olarak artış talebinde bulunursa, kararın yeni dönemden itibaren geçerli olmasını sağlar.

## Artış nasıl bildirilir ve ne zaman ödenir?

Sözleşmede yıllık artış kaydı varsa (ör. "her yıl TÜFE oranında artırılır") yeni kira, kira yılının başladığı aydan itibaren kendiliğinden geçerli olur; ayrıca bildirim gerekmez. Sözleşmede artış hükmü yoksa ev sahibinin artışı kiracıya yazılı olarak bildirmesi, anlaşma sağlanamazsa tespit davası açması gerekir. Yeni kira, yenileme ayına ait kira ödemesinden itibaren ödenir; geriye dönük olarak önceki aylara yansıtılmaz.

Uyuşmazlıkları önlemek için artış oranını ve dayandığı TÜİK verisini (ay ve oran) yazılı bildirime eklemek, ödemeyi de banka üzerinden açıklamalı yapmak en güvenli yoldur.

## Sık yapılan hatalar

- **Yıllık enflasyonu kullanmak.** Kira sınırı yıllık TÜFE değil, 12 aylık ortalamaya göre değişimdir.
- **Yenileme ayının verisini beklemek.** Kasım yenilemesi için Kasım değil, Ekim verisi kullanılır.
- **Sınırı zorunlu artış sanmak.** Oran üst sınırdır; ev sahibi daha az artış yapabilir, kiracı daha fazlasını kabul etmek zorunda değildir.
- **Sözleşmedeki yüksek oranı geçerli saymak.** TBK 344 emredicidir; yasal sınırı aşan artış kaydı sınır oranına çekilir.
- **Aidatı kiraya eklemek.** Aidat ve ortak giderler kira bedeline dahil değildir; artış yalnız kira üzerinden hesaplanır.

Taşınmaz alım satımında maliyetleri öğrenmek için [tapu harcı hesaplama](/tapu-harci-hesaplama), yıllık vergiyi görmek için [emlak vergisi hesaplama](/emlak-vergisi-hesaplama) araçlarımıza bakabilirsiniz.

## Yasal dayanak

- 6098 sayılı Türk Borçlar Kanunu md. 344 (kira bedelinin belirlenmesi)
- 7409 ve 7456 sayılı Kanunlar, TBK geçici madde (konutta %25 sınırı, 11.06.2022–01.07.2024)
- TÜİK Tüketici Fiyat Endeksi bültenleri (12 aylık ortalamalara göre değişim)

<!-- sss -->

### {{kira.yenilemeAy}} kira artış oranı ne kadar?

{{kira.yenilemeAy}} ayında yenilenen konut ve işyeri kiralarında azami artış, {{tufe.sonAy}} itibarıyla TÜFE'nin 12 aylık ortalama değişimi olan {{tufe.ortalama12}} oranındadır.

### Kira artışında hangi ayın enflasyonu geçerlidir?

Yenilemenin yapıldığı aydan bir önceki ayın 12 aylık ortalama TÜFE değişimi esas alınır. Örneğin Mart'ta yenilenen sözleşmede Şubat verisi kullanılır.

### Ev sahibi TÜFE oranından fazla zam yapabilir mi?

Hayır. Konut ve çatılı işyeri kiralarında yenilenen dönem için artış, TÜFE 12 aylık ortalama değişimini aşamaz. Sözleşmede daha yüksek oran yazsa bile bu kısım geçersizdir. Tek istisna, beş yıldan uzun kiralarda mahkemenin hakkaniyete göre yeni kira belirlemesidir.

### %25 kira artış sınırı hâlâ geçerli mi?

Hayır. Konut kiralarındaki %25 sınırı 01.07.2024 tarihinde sona erdi. 2 Temmuz 2024 ve sonrasında yenilenen sözleşmelerde TÜFE 12 aylık ortalaması uygulanır.

### İşyeri kira artışı nasıl hesaplanır?

İşyerinde de mevcut kira, TÜFE 12 aylık ortalama değişimiyle çarpılarak artış tutarı bulunur. Beş yıllık dönemlerin sonunda ise kira, açılacak tespit davasıyla piyasa koşullarına göre yeniden belirlenebilir.

### TÜİK kira artış oranını ne zaman açıklar?

TÜİK, bir ayın enflasyon verisini izleyen ayın 3'ünde saat 10.00'da açıklar. Bu bültendeki "12 aylık ortalamalara göre değişim" oranı, o ay yenilenen kiralar için geçerli artış sınırıdır.

### Kira artışını kiracı kabul etmezse ne olur?

Kiracı yasal sınır içindeki artışı ödemezse ev sahibi kira farkını talep edebilir. Sınırı aşan bir talebi kiracı ödemek zorunda değildir; anlaşmazlıkta önce arabulucuya başvurmak zorunludur, ardından sulh hukuk mahkemesinde dava açılabilir.
