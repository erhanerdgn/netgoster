## Enflasyon hesaplama nasıl yapılır?

Enflasyon, fiyatların genel düzeyindeki artıştır; paranın değeri ise aynı tutarla alınabilen mal ve hizmet miktarıdır. Geçmişteki bir tutarın bugün kaç lira ettiğini bulmak için iki ayın **Tüketici Fiyat Endeksi (TÜFE)** değerleri oranlanır. TÜFE'yi Türkiye İstatistik Kurumu (TÜİK) her ayın 3'ünde, bir önceki ay için açıklar.

> **Bugünkü karşılık = Eski tutar × TÜFE (hedef ay) / TÜFE (paranın ayı)**
>
> **Dönem enflasyonu = TÜFE (yeni ay) / TÜFE (eski ay) − 1**
>
> **Yıllık ortalama enflasyon = (1 + dönem enflasyonu)^(12 / ay sayısı) − 1**
>
> **Satın alma gücü kaybı = 1 − TÜFE (eski ay) / TÜFE (yeni ay)**

Hesaplayıcı Ocak 2003'ten {{enf.sonAy}} ayına kadar her ayın TÜFE genel endeksini içerir. Tutarı, paranın ait olduğu ayı ve karşılığını görmek istediğiniz ayı seçmeniz yeterlidir. Hedef ay olarak daha eski bir tarih seçerseniz hesap ters yönde yapılır: bugünkü bir tutarın geçmişte kaç liraya karşılık geldiği bulunur.

Aylık endeks, o ayın **ortalama** fiyat düzeyini gösterir. Bu nedenle "Ocak 2020'deki 1.000 TL" ifadesi, Ocak 2020 ortalama fiyatlarıyla 1.000 TL anlamına gelir. Bugünkü değer için en son açıklanan ayı ({{enf.sonAy}}) seçin; TÜİK yeni ayı açıkladığında veriler güncellenir.

## Yıllara göre 1.000 TL bugün kaç TL eder?

Aşağıdaki tabloda her yılın Ocak ayındaki 1.000 TL'nin {{enf.sonAy}} fiyatlarıyla karşılığı, aradaki toplam (kümülatif) enflasyon ve bu dönemin yıllık ortalama enflasyonu yer alıyor.

| Paranın ayı | {{enf.sonAy}} karşılığı | Kümülatif enflasyon | Yıllık ortalama |
| --- | --- | --- | --- |
{{enf.tablo}}

Başka bir tutar için oranı çarpmanız yeterli: Ocak 2020'deki 1.000 TL bugün {{enf.o1.karsilik}} ettiğine göre, aynı tarihteki 5.000 TL bunun beş katı eder.

## Yıl sonu enflasyon oranları

TÜİK'in Aralık ayı itibarıyla açıkladığı yıllık TÜFE değişimleri (bir önceki yılın Aralık ayına göre):

| Yıl | Yıllık enflasyon (Aralık) |
| --- | --- |
{{enf.yilSonu}}

Son açıklanan veriye göre yıllık enflasyon {{tufe.yillik}}, aylık enflasyon {{tufe.aylik}} ({{tufe.sonAy}}).

## Örnek hesaplamalar

### Örnek 1: 2020'deki 1.000 TL bugün kaç TL?

- TÜFE, Ocak 2020: {{enf.o1.endeksBas}}; {{enf.sonAy}}: {{enf.o1.endeksSon}} (2003=100 ölçeği)
- Ocak 2020 – {{enf.sonAy}} arası {{enf.o1.aySayisi}} ay, fiyatlar {{enf.o1.carpan}} katına çıktı.
- Bugünkü karşılık: **{{enf.o1.karsilik}}**
- Kümülatif enflasyon: {{enf.o1.donemEnflasyonu}}, yıllık ortalama: {{enf.o1.yillikOrtalama}}
- Satın alma gücü kaybı: {{enf.o1.alimGucuKaybi}}. Yani Ocak 2020'de cebinizde duran 1.000 TL, bugün o günkü alışverişin ancak küçük bir kısmını karşılar.

### Örnek 2: Ocak 2023'teki 20.000 TL maaşın bugünkü karşılığı

Ocak 2023'te 20.000 TL alan bir çalışanın aynı alım gücünü koruması için {{enf.sonAy}} itibarıyla **{{enf.o2.karsilik}}** kazanması gerekir. Aradaki {{enf.o2.aySayisi}} ayda fiyatlar {{enf.o2.donemEnflasyonu}} arttı; yıllık ortalama enflasyon {{enf.o2.yillikOrtalama}}. Maaşınız bu tutarın altındaysa reel olarak geriye gittiniz demektir.

### Örnek 3: Bugünkü 100.000 TL 2015'te kaç TL'ydi? (ters hesap)

Paranın ayı olarak {{enf.sonAy}}, hedef ay olarak Ocak 2015 seçildiğinde sonuç **{{enf.o3.karsilik}}** çıkar. Bugün 100.000 TL'ye alınan bir sepet, Ocak 2015 fiyatlarıyla bu kadar tutuyordu. Aradaki {{enf.o3.aySayisi}} ayın kümülatif enflasyonu {{enf.o3.donemEnflasyonu}}, yıllık ortalaması {{enf.o3.yillikOrtalama}}.

## Baz yılı değişikliği: 2003=100'den 2025=100'e

TÜİK, Ocak 2026'dan itibaren TÜFE'yi **2025=100** bazıyla yayımlıyor; 2003=100 bazlı endeks Aralık 2025 verisiyle sona erdi. TÜİK'e göre yeni endeks eski serinin 2025 yılı ortalamasına normalize edildi ve aylık, yıllık değişim oranları aynı kaldı.

Hesaplayıcı tek ve kesintisiz bir seri kullanır: 2025 sonuna kadar resmi 2003=100 değerleri, 2026'dan itibaren ise resmi 2025=100 değerleri 2025 ortalamasıyla ({{enf.baglama}} katsayısıyla) 2003=100 ölçeğine taşınır. Böylece 2020'den 2026'ya uzanan bir hesapta da sonuç, TÜİK'in açıkladığı aylık oranların zincirlenmesiyle (yalnız yuvarlama farkıyla) aynı çıkar. Tüm aylık ve yıllık oranlar TÜİK bültenleriyle karşılaştırılarak doğrulanmıştır.

## Sık yapılan hatalar

- **Yıllık oranları toplamak.** Üç yıl üst üste %40 enflasyon %120 değil, 1,4 × 1,4 × 1,4 − 1 = %174,4 eder. Enflasyon bileşik işler; doğru yol endeksleri oranlamaktır.
- **Kümülatif oranı yıl sayısına bölmek.** Kümülatif %900'lük artış 6 yılda "yılda %150" demek değildir; yıllık ortalama bileşik formülle bulunur.
- **Fiyat artışı ile alım gücü kaybını karıştırmak.** Fiyatlar %100 arttığında paranız yarı değerine iner: alım gücü kaybı %100 değil %50'dir.
- **Kira artışında yıllık TÜFE'yi kullanmak.** Konut ve işyeri kira artış sınırı, yıllık değil **12 aylık ortalama** TÜFE değişimidir. Bunun için [kira artış hesaplama](/kira-artis-hesaplama) aracını kullanın.
- **Nominal getiriyi kazanç sanmak.** Faiz ya da fon getiriniz dönem enflasyonunun altındaysa reel olarak kaybetmişsinizdir.

## Birikiminiz enflasyonu yendi mi?

Reel getiri, nominal getirinin enflasyondan arındırılmış hâlidir: **(1 + nominal getiri) / (1 + enflasyon) − 1**. Vadeli hesabınızın net getirisini [mevduat faizi hesaplama](/mevduat-faizi-hesaplama), yatırım fonunuzunkini [fon getirisi hesaplama](/fon-getirisi-hesaplama) aracıyla bulup aynı dönemin enflasyonuyla karşılaştırabilirsiniz. Basit ve bileşik faizin uzun vadede nasıl ayrıştığını görmek için [faiz hesaplama](/faiz-hesaplama) aracına bakın.

Kaynak: TÜİK Tüketici Fiyat Endeksi bültenleri ve [TÜİK veri portalı](https://veriportali.tuik.gov.tr) (2003=100 ve 2025=100 genel endeks).

<!-- sss -->

### 2020'deki 1.000 TL bugün kaç TL eder?

TÜFE'ye göre Ocak 2020'deki 1.000 TL, {{enf.sonAy}} fiyatlarıyla {{enf.o1.karsilik}} eder. Aradaki kümülatif enflasyon: {{enf.o1.donemEnflasyonu}}. Farklı bir ay ya da tutar için hesaplayıcıyı kullanın.

### Paranın bugünkü değeri nasıl hesaplanır?

Eski tutar, bugünkü (son açıklanan) TÜFE endeksiyle çarpılıp paranın ait olduğu ayın endeksine bölünür. Endeksler TÜİK tarafından aylık olarak yayımlanır.

### Kümülatif enflasyon nedir?

İki tarih arasında fiyatların toplam ne kadar arttığıdır. Yıllık oranlar toplanarak değil, çarpılarak (ya da iki ayın endeksi oranlanarak) bulunur.

### Yıllık ortalama enflasyon nasıl bulunur?

Kümülatif enflasyona 1 eklenir, (12 / ay sayısı) üssü alınır ve 1 çıkarılır. Bu, dönem boyunca her yıl aynı oranda fiyat artışı olsaydı gereken yıllık orandır.

### Satın alma gücü kaybı ile enflasyon aynı şey mi?

Hayır. Fiyatlar %100 arttığında aynı para ancak yarısı kadar mal alır; satın alma gücü kaybı %50'dir. Kayıp, 1 − eski endeks / yeni endeks formülüyle hesaplanır.

### Bu ayın enflasyonu neden hesaplamada yok?

TÜİK bir ayın enflasyonunu izleyen ayın 3'ünde açıklar. Bu nedenle en güncel veri {{enf.sonAy}} ayına aittir; yeni veri açıklandığında hesaplayıcı güncellenir.

### TÜFE'nin baz yılı değişikliği hesabı etkiler mi?

Etkilemez. 2025=100 bazlı yeni endeks eski seriye 2025 ortalamasıyla bağlandığından iki ay arasındaki oran, TÜİK'in açıkladığı aylık değişimlerle aynı sonucu verir.

### Enflasyon farkı kira veya maaş zammında nasıl kullanılır?

Maaş için, zam öncesi maaşınızın son zam ayından bugüne enflasyonla güncellenmiş karşılığını bulup yeni maaşla karşılaştırın. Kira artışında ise yasal sınır 12 aylık ortalama TÜFE'dir; [kira artış hesaplama](/kira-artis-hesaplama) aracı bunu otomatik uygular.
