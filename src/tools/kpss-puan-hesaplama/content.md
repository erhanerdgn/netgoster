## KPSS puanı nasıl hesaplanır?

Kamu Personel Seçme Sınavı (KPSS), kamu kurumlarına memur alımında kullanılan ve ÖSYM tarafından uygulanan sınavdır. Genel Yetenek (GY) ve Genel Kültür (GK) oturumu her mezuniyet düzeyi için ayrı yapılır ve şu puan türleri hesaplanır:

| Puan türü | Kimler için? | Testler ve ağırlık |
| --- | --- | --- |
| P3 | Lisans mezunları | GY %50 + GK %50 |
| P93 | Önlisans mezunları | GY %50 + GK %50 |
| P94 | Ortaöğretim (lise) mezunları | GY %50 + GK %50 |

ÖSYM puanı üç adımda hesaplar:

1. **Net bulunur.** Her testte doğru sayısından yanlış sayısının dörtte biri çıkarılır.
2. **Standart puana çevrilir.** Netler, aynı oturuma giren tüm adayların ortalaması ve standart sapmasıyla standart puana dönüştürülür.
3. **Ağırlıklı toplam alınır.** GY ve GK standart puanları %50'şer ağırlıkla toplanıp 100 üzerinden puana çevrilir.

Standart puan her sınavın sonuçlarına bağlı olduğu için ÖSYM net başına sabit bir puan açıklamaz. Hesaplayıcı, önceki sınav istatistiklerine kalibre edilmiş **tahmini bir doğrusal formül** kullanır.

## Testler ve soru sayıları

Genel Yetenek testi 60 sorudan oluşur: Türkçe (sözel yetenek) ve matematik-geometri (sayısal yetenek). Genel Kültür testi de 60 sorudur: tarih, coğrafya, vatandaşlık ve güncel bilgiler. Toplam 120 soru, tek oturumda çözülür. Lisans, önlisans ve ortaöğretim sınavlarında test yapısı benzer olsa da soruların zorluk düzeyi mezuniyet seviyesine göre değişir; bu nedenle her puan türü yalnız kendi oturumuna giren adaylar arasında hesaplanır. Hesaplayıcıda her iki testin doğru ve yanlış sayısını ayrı ayrı girersiniz; netiniz anında görünür.

## Net hesaplama: 4 yanlış 1 doğruyu götürür

> **Net = Doğru − Yanlış ÷ 4**

GY'de 45 doğru ve 12 yanlış yapan adayın neti 45 − 12/4 = **42**'dir. Boş bırakılan soru neti etkilemez. Bir testte doğru ile yanlışın toplamı 60'ı aşamaz.

## Tahmini KPSS puanı formülü

> **Tahmini puan ≈ Sabit + Katsayı × (GY neti + GK neti)**

| Puan türü | Sabit | Net başına puan | 10 net farkı |
| --- | ---: | ---: | ---: |
| P3 (lisans) | {{kpss.P3.base}} | {{kpss.P3.per}} | {{kpss.P3.per10}} puan |
| P93 (önlisans) | {{kpss.P93.base}} | {{kpss.P93.per}} | {{kpss.P93.per10}} puan |
| P94 (ortaöğretim) | {{kpss.P94.base}} | {{kpss.P94.per}} | {{kpss.P94.per10}} puan |

P3 katsayıları {{kpss.kYil}} sınav istatistiklerine kalibre edilmiş bir tablodan türetilmiştir ve gerçek puana genellikle ±3 puan yakındır. P93 ve P94 için resmî veya yaygın kabul görmüş katsayı bulunmadığından, bu sınavlara giren adayların ortalamasının daha düşük olması dikkate alınarak tahmin yapılmıştır; bu türlerde sapma daha büyük olabilir. GY ve GK puana eşit ağırlıkla etki ettiği için formülde toplam net kullanılır. Hesaplanan değer 100'ü aşarsa 100 kabul edilir (P3'te tam net formülde {{kpss.p3.tam}} verir).

## Puan hesaplanma şartı

Hesaplayıcı, Genel Yetenek veya Genel Kültür testlerinden birinde **1 netin altında** kalan aday için puan hesaplamaz ve uyarı gösterir. Testlerden birini tamamen boş bırakmak ya da çok sayıda yanlışla neti sıfıra indirmek, diğer testteki başarıdan bağımsız olarak puanın oluşmasını engelleyebilir. Kesin koşul için ilgili yılın ÖSYM kılavuzuna bakın.

## Örnek hesaplamalar

### Örnek 1: Lisans mezunu aday (P3)

GY'de 45 doğru 12 yanlış (42 net), GK'da 40 doğru 16 yanlış (36 net) yapan adayın toplam neti 78'dir. Tahmini P3 puanı: {{kpss.P3.base}} + {{kpss.P3.per}} × 78 = **{{kpss.o1.puan}}**.

### Örnek 2: Lise mezunu aday (P94)

GY'de 38 doğru 14 yanlış (34,5 net), GK'da 30 doğru 18 yanlış (25,5 net) yapan adayın toplam neti **{{kpss.o2.net}}**, tahmini P94 puanı **{{kpss.o2.puan}}** olur.

### Örnek 3: Yüksek netli aday

GY'de 52 doğru 6 yanlış, GK'da 48 doğru 10 yanlış yapan lisans mezununun toplam neti {{kpss.o3.net}}, tahmini P3 puanı **{{kpss.o3.puan}}**'dir. Bu düzeyde her net yaklaşık {{kpss.P3.per}} puan değerindedir; ancak üst sıralarda yarım puan bile yüzlerce kişi fark yaratabilir.

## Sık yapılan hatalar

- **Farklı türleri karşılaştırmak.** P3, P93 ve P94 ayrı sınavlarla ve farklı aday gruplarıyla hesaplanır; aynı net üç türde farklı puan verir.
- **Toplam neti puan sanmak.** 78 net, 78 puan demek değildir; standart puan dönüşümü uygulanır.
- **ÖABT veya alan bilgisi testlerini karıştırmak.** Öğretmenlik (P121 vb.) ve A grubu kadrolar (P48 vb.) için başka testler ve puan türleri kullanılır; bu hesaplayıcı yalnız GY-GK puanını tahmin eder.
- **Geçerlilik süresini unutmak.** KPSS sonuçları genellikle iki yıl geçerlidir; başvuracağınız ilanın hangi sınav yılını kabul ettiğini kontrol edin.
- **Tahmini puanla tercih yapmak.** Kesin puanınız ÖSYM sonuç belgesinde yazar; atama tercihlerini resmî puanınızla yapın.

Lisansüstü başvurular için [ALES puan hesaplama](/ales-puan-hesaplama), yabancı dil puanı isteyen kadrolar için [YDS puan hesaplama](/yds-puan-hesaplama) aracına bakabilirsiniz.

## Resmî dayanak

- ÖSYM {{kpss.yil}} KPSS Lisans kılavuzu: [KPSS kılavuzu (ÖSYM, PDF)]({{kpss.kaynak}}). Puan türleri ve ağırlıklar (GY 0,50 / GK 0,50) kılavuzdaki Tablo-2'dedir.
- Önlisans ve ortaöğretim düzeyindeki KPSS için ayrı kılavuzlar yayımlanır.
- Net başına puan katsayıları resmî değildir; geçmiş sınav istatistiklerinden türetilmiş tahminlerdir.

<!-- sss -->

### KPSS'de kaç yanlış bir doğruyu götürür?

KPSS'de dört yanlış bir doğruyu götürür. Net, doğru sayısından yanlış sayısının dörtte biri çıkarılarak bulunur; boş bırakılan sorular neti etkilemez.

### P3, P93 ve P94 arasındaki fark nedir?

P3 lisans, P93 önlisans, P94 ortaöğretim mezunlarının puan türüdür. Üçü de Genel Yetenek ve Genel Kültür testlerinden %50'şer ağırlıkla hesaplanır, ancak her biri ayrı bir oturumda farklı aday grubuyla yapılır.

### KPSS'de kaç net kaç puan eder?

Sabit bir karşılık yoktur. Tahmini formüle göre P3'te her net yaklaşık {{kpss.P3.per}} puan eder; örneğin 78 toplam net yaklaşık {{kpss.o1.puan}} P3 puanına denk gelir. Gerçek değer sınavın zorluğuna göre değişir.

### Genel Yetenek mi Genel Kültür mü daha önemli?

P3, P93 ve P94 puanlarında iki testin ağırlığı eşittir. Ancak adayların ortalaması genellikle Genel Kültür'de daha düşük olduğundan, standart puanda GK'daki bir net biraz daha değerli olabilir.

### KPSS sonucu kaç yıl geçerli?

KPSS sonuçları genellikle iki yıl geçerlidir ve bu süre içinde yapılan merkezî atamalarda ve kurum ilanlarında kullanılır. Kesin süre ilgili yılın kılavuzunda belirtilir.

### Bu hesaplayıcı atama sıralaması tahmin ediyor mu?

Hayır. Atama taban puanları kadro sayısına, tercih yapan aday sayısına ve kurumların ihtiyacına göre her dönem değişir. Hesaplayıcı yalnız tahmini puanı verir.
