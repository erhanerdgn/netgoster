## Saat hesaplama aracı ne yapar?

Bu araç saatlerle yapılan üç günlük hesabı tek sayfada toplar:

- **İki saat arası:** Başlangıç ve bitiş saati arasındaki süreyi bulur. Gece yarısını geçen vardiyaları da doğru hesaplar; isterseniz mola süresini düşer.
- **Süre ekle / çıkar:** Bir saate saat ve dakika ekleyerek ya da çıkararak yeni saati bulur, günün değişip değişmediğini söyler.
- **Süre topla:** Birden çok süreyi (ör. haftalık çalışma saatlerinizi) toplar; sonucu saat:dakika, ondalık saat ve dakika olarak verir. Toplam {{sh.haftalik}} saati aşarsa aşan kısmı fazla çalışma olarak gösterir.

Saatler 24 saat biçiminde (SS:DD) girilir: öğleden sonra 3 için 15:00, gece yarısı için 00:00 yazılır.

## İki saat arası süre nasıl hesaplanır?

Saatler önce gece yarısından itibaren dakikaya çevrilir (SS × 60 + DD), sonra farkları alınır:

> **Süre (dk)** = Bitiş − Başlangıç; sonuç negatifse + 1.440 (bir gün)

Bitiş saati başlangıçtan erkense iş gece yarısını geçmiştir ve bitiş ertesi gün sayılır. Başlangıç ve bitiş aynıysa süre 24 saat kabul edilir. Mola girildiyse sonuçtan düşülür.

### Örnek 1: Gece vardiyası

22:30'da başlayan, 06:15'te biten vardiya: 06:15 = 375 dk, 22:30 = 1.350 dk. 375 − 1.350 = −975; bir gün eklenince {{sh.gece.dk}} dk, yani **{{sh.gece}}**. 30 dakikalık mola düşülürse **{{sh.geceMola}}** ({{sh.geceMola.ondalik}} saat) kalır.

### Örnek 2: Gündüz mesaisi

08:30 – 17:45 arası {{sh.gunduz.brut}} eder. 1 saatlik öğle arası düşülünce çalışılan süre **{{sh.gunduz}}**, ondalık olarak **{{sh.gunduz.ondalik}} saattir**.

## Saate süre eklemek veya çıkarmak

Saat dakikaya çevrilir, süre eklenir ya da çıkarılır, sonuç 1.440'a (24 saat) göre yeniden saate çevrilir. 1.440'ı her aşışta bir gün ileri, sıfırın altına her inişte bir gün geri gidilir.

### Örnek 3: Gece yarısını geçen ekleme

23:30'a 2 saat 15 dakika eklenirse sonuç **{{sh.ekle.sonuc}}**, {{sh.ekle.gun}} olur. Uçuş ve yolculuk varış saati, ilaç saatleri ya da bir işin kaçta biteceği bu yolla bulunur. Tarihi de değiştiren uzun süreler (ör. 50 saat) için de sonuç saati ve kaç gün sonrası gösterilir; gün sayısı eklemek için [tarih hesaplama](/tarih-hesaplama) aracını kullanabilirsiniz.

## Süreleri toplamak ve ondalık saat

Her satırdaki süre dakikaya çevrilip toplanır; sonuç tekrar saat ve dakikaya bölünür. Ondalık saat, dakikaların 60'a bölünmesiyle bulunur:

> **Ondalık saat** = Saat + Dakika ÷ 60

Puantaj, serbest çalışma faturası ve fazla mesai ücreti ondalık saatle hesaplanır. Burada sık yapılan hata 7 saat 30 dakikayı "7,30 saat" yazmaktır; doğrusu **7,5 saattir**. Satırlara saati ondalık girebilir (7,5) ya da 60'tan büyük dakika yazabilirsiniz (90 dk = 1 saat 30 dakika).

### Örnek 4: Haftalık çalışma ve fazla mesai

Bir haftada 8:30, 9:15, 9:00, 9:45, 8:00 ve 5:30 çalışan birinin toplamı **{{sh.hafta.toplam}}** ({{sh.hafta.ssdd}}) eder. 4857 sayılı İş Kanunu'nun 63. maddesine göre haftalık çalışma süresi en çok {{sh.haftalik}} saattir; 41. maddeye göre bu süreyi aşan çalışma **fazla çalışmadır** ([mevzuat metni](https://www.mevzuat.gov.tr/mevzuatmetin/1.5.4857.pdf)). Bu örnekte **{{sh.hafta.fazla}}** fazla çalışma vardır ve her saati normal saatlik ücretin {{sh.zam}} fazlasıyla ödenir. Tutarı [fazla mesai hesaplama](/fazla-mesai-hesaplama) aracıyla bulabilirsiniz.

## Mola süreleri

İş Kanunu md. 68'e göre ara dinlenmeleri çalışma süresinden sayılmaz. Günlük çalışmanın ortasında verilecek en kısa ara dinlenme işin süresine göre değişir:

| Günlük iş süresi | En az ara dinlenme |
| --- | --- |
| 4 saat veya daha kısa | 15 dakika |
| 4 saatten fazla, 7,5 saate kadar | 30 dakika |
| 7,5 saatten fazla | 1 saat |

## Popüler değerler: vardiya ve mesai süreleri

Sık kullanılan çalışma saatlerinde molalı ve molasız süreler:

| Saat aralığı | Toplam süre | Mola | Çalışılan süre | Ondalık saat |
| --- | --- | --- | --- | --- |
{{sh.tablo.vardiya}}

## Popüler değerler: dakika kaç saat (ondalık)?

| Dakika | Ondalık saat |
| --- | --- |
{{sh.tablo.dakika}}

## Sık yapılan hatalar

- **Gece yarısını unutmak:** 22:00 – 06:00 arası "−16 saat" değil, 8 saattir.
- **Dakikayı ondalık sanmak:** 1 saat 45 dakika 1,45 değil, 1,75 saattir.
- **12 saat biçimiyle karıştırmak:** Öğleden sonraki saatleri 13:00–23:59 olarak girin; 08:00 ile 05:00 arası "21 saat" çıkıyorsa bitişi 17:00 yazmayı unutmuşsunuzdur.
- **Molayı iki kez düşmek:** Puantajda mola zaten düşülmüşse araçtaki mola alanını boş bırakın.

Süreleri gün, hafta, ay veya yıla çevirmek için [gün hafta ay yıl çevirici](/gun-hafta-ay-yil-cevirici) aracını kullanabilirsiniz.

<!-- sss -->

### İki saat arası nasıl hesaplanır?

Her iki saati de dakikaya çevirin (saat × 60 + dakika) ve bitişten başlangıcı çıkarın. Sonuç negatifse gece yarısı geçilmiştir; 1.440 dakika ekleyin. Çıkan dakikayı 60'a bölerek saat ve dakikayı bulun.

### 22:00 ile 06:00 arası kaç saat?

22:00 – 06:00 arası 8 saattir. Gece yarısına kadar 2 saat, gece yarısından sonra 6 saat çalışılır. 30 dakika mola düşülürse 7 saat 30 dakika kalır.

### 7 saat 30 dakika kaç saat eder?

7 saat 30 dakika ondalık olarak 7,5 saattir, çünkü 30 dakika 30 ÷ 60 = 0,5 saattir. 7 saat 15 dakika 7,25, 7 saat 45 dakika 7,75 saattir.

### Haftalık çalışma saatimi nasıl toplarım?

"Süre topla" sekmesine her günün çalışma süresini ayrı satıra yazın. Araç toplamı saat:dakika ve ondalık saat olarak verir. Toplam {{sh.haftalik}} saati aşarsa aşan kısmı fazla çalışma olarak gösterir.

### Haftalık kaç saatten sonra fazla mesai başlar?

İş Kanunu'na göre haftalık normal çalışma süresi en çok {{sh.haftalik}} saattir. Bu süreyi aşan her saat fazla çalışmadır ve {{sh.zam}} zamlı ödenir. Sözleşmenizde haftalık süre daha düşükse, o süreyi aşıp {{sh.haftalik}} saate kadar yapılan çalışma fazla sürelerle çalışmadır ve {{sh.zamFs}} zamlı ödenir.

### Bir saate süre nasıl eklenir?

Saati dakikaya çevirip süreyi ekleyin. Sonuç 1.440 dakikayı aşarsa ertesi güne geçilmiştir: 1.440 çıkarıp kalan dakikayı yeniden saate çevirin. Örneğin 23:30 + 2 saat 15 dakika = {{sh.ekle.sonuc}} ({{sh.ekle.gun}}).

### Öğle arası çalışma süresine dahil mi?

Hayır. İş Kanunu md. 68'e göre ara dinlenmeleri çalışma süresinden sayılmaz. 08:00 – 17:00 arası çalışıp 1 saat öğle arası veren biri günde 8 saat çalışmış sayılır.

### 1 saat kaç dakika, 1 gün kaç saat?

1 saat 60 dakika, 1 gün 24 saat ve 1.440 dakikadır. 1 hafta 168 saat eder.
