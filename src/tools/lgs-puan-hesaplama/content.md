## LGS puanı nasıl hesaplanır?

Liselere Geçiş Sistemi (LGS) kapsamındaki merkezî sınav, 8. sınıf öğrencilerine iki oturumda uygulanır ve toplam **90 sorudan** oluşur. Millî Eğitim Bakanlığı (MEB) puanı şu adımlarla hesaplar:

1. **Her dersin neti bulunur.** Doğru sayısından yanlış sayısının üçte biri çıkarılır.
2. **Netler standart puana çevrilir.** Her dersin neti, o yıl sınava giren tüm öğrencilerin ortalaması ve standart sapması kullanılarak standart puana dönüştürülür.
3. **Ağırlık katsayıları uygulanır.** Türkçe, Matematik ve Fen Bilimleri standart puanları 4 ile; İnkılap Tarihi, Din Kültürü ve Yabancı Dil standart puanları 1 ile çarpılıp toplanır.
4. **{{lgs.min}}–{{lgs.max}} ölçeğine dönüştürülür.** Ağırlıklı toplam, en düşük {{lgs.min}}, en yüksek {{lgs.max}} olacak şekilde ölçeklenir. Bu puana **Merkezî Sınav Puanı (MSP)** denir.

İkinci adım her yılın sınav ortalamasına bağlı olduğundan MEB sabit bir "net başına puan" açıklamaz. Hesaplayıcımız önceki yılların sonuçlarına dayanan **tahmini katsayılarla** çalışır.

## Dersler, soru sayıları ve katsayılar

| Oturum | Ders | Soru | Ağırlık katsayısı |
| --- | --- | ---: | ---: |
| Sözel | Türkçe | 20 | 4 |
| Sözel | T.C. İnkılap Tarihi ve Atatürkçülük | 10 | 1 |
| Sözel | Din Kültürü ve Ahlak Bilgisi | 10 | 1 |
| Sözel | Yabancı Dil | 10 | 1 |
| Sayısal | Matematik | 20 | 4 |
| Sayısal | Fen Bilimleri | 20 | 4 |

Katsayısı 4 olan üç ders toplam 60 soru, katsayısı 1 olan üç ders toplam 30 sorudur. Bu yüzden Türkçe, Matematik ve Fen'deki her net, diğer derslerdeki bir netin yaklaşık {{lgs.oran}} katı puan getirir.

## Net hesaplama: 3 yanlış 1 doğruyu götürür

> **Net = Doğru − Yanlış ÷ 3**

LGS'de üç yanlış bir doğruyu götürür; YKS ve KPSS'deki dörtte bir kuralından daha serttir. Boş bırakılan soru neti etkilemez. Örneğin Türkçe'de 18 doğru ve 2 yanlış yapan öğrencinin neti 18 − 2/3 ≈ **17,33** olur.

## Tahmini LGS puanı formülü

Hesaplayıcı, MEB'in standart puan yöntemini önceki yılların ortalamasıyla doğrusal olarak yaklaşıklar:

> **Tahmini puan ≈ {{lgs.taban}} + (Türkçe + Matematik + Fen neti) × {{lgs.per4}} + (İnkılap + Din + Yabancı Dil neti) × {{lgs.per1}}**

Buradaki {{lgs.taban}} taban değeri, tam net yapan öğrencinin {{lgs.max}} alması için hesaplanmıştır: 60 soru × {{lgs.per4}} ile 30 soru × {{lgs.per1}} toplamı {{lgs.tamPay}} eder; {{lgs.max}} − {{lgs.tamPay}} = {{lgs.taban}}. Sonuç {{lgs.min}}'ün altına düşerse {{lgs.min}}, {{lgs.max}}'ü aşarsa {{lgs.max}} kabul edilir.

## Örnek hesaplamalar

### Örnek 1: Başarılı bir öğrenci

Türkçe 18 doğru 2 yanlış, Matematik 15 doğru 3 yanlış, Fen 17 doğru 3 yanlış, İnkılap 9 doğru 1 yanlış, Din 10 doğru ve Yabancı Dil 8 doğru 2 yanlış yapan öğrencinin toplam neti **{{lgs.o1.net}}**'tür. Tahmini puanı **{{lgs.o1.puan}}** olur.

### Örnek 2: Ortalama bir öğrenci

Türkçe 14/6, Matematik 8/9, Fen 12/6, İnkılap 7/3, Din 8/2 ve Yabancı Dil 6/3 (doğru/yanlış) yapan öğrencinin toplam neti **{{lgs.o2.net}}**, tahmini puanı **{{lgs.o2.puan}}** olur. Matematikteki 9 yanlış, 3 netlik kayıp demektir; bu da yaklaşık {{lgs.matKayip}} puan eder.

### Örnek 3: Tek bir yanlışın etkisi

Matematik dışında tüm soruları doğru yapıp matematikte 19 doğru 1 yanlış yapan öğrencinin tahmini puanı **{{lgs.o3.puan}}** olur. Katsayısı 4 olan bir derste tek yanlış (ve onun götürdüğü üçte bir doğru) yaklaşık **{{lgs.o3.kayip}} puan** kaybettirir. Üst dilimlerde sıralama yüzlerce kişi değişebilir.

## Netinizi en verimli nerede artırırsınız?

Hesaplayıcının döküm bölümünde her dersin netini ve katsayısını ayrı ayrı görürsünüz. Hazırlık planı yaparken şu iki kuralı akılda tutun:

- **Katsayısı 4 olan derslerde bir net, katsayısı 1 olan derslerdeki bir netten yaklaşık {{lgs.oran}} kat değerlidir.** Matematik ve Fen'de kazanılan birkaç net, sözel bölümün küçük derslerindeki tam başarıdan daha fazla puan getirebilir.
- **Yanlış sayısını azaltmak da net kazandırır.** Üç yanlışı boşa çevirmek, bir doğru eklemekle aynı etkiyi yapar. Deneme sınavlarında hangi derslerde tahminle işaretleme yaptığınızı not edin.

Deneme sonuçlarınızı hesaplayıcıya girerek hangi dersteki artışın puanınızı en çok yükselttiğini kolayca karşılaştırabilirsiniz.

## Sık yapılan hatalar

- **YKS kuralını uygulamak.** LGS'de 4 değil, **3 yanlış** bir doğruyu götürür.
- **Toplam neti puan sanmak.** Aynı toplam nette, netlerin hangi derste olduğu sonucu değiştirir: Matematikte bir net, Din Kültürü'ndeki bir netten çok daha değerlidir.
- **Tahmini puanı kesin kabul etmek.** Sınavın zor geçtiği yıllarda aynı net daha yüksek, kolay geçtiği yıllarda daha düşük puan getirir.
- **Yüzdelik dilimi puandan tahmin etmeye çalışmak.** Yerleştirmede puanla birlikte yüzdelik dilim de kullanılır ve her yıl yeniden oluşur; hesaplayıcı dilim tahmini yapmaz.
- **Boş bırakmanın zararlı olduğunu düşünmek.** Emin olmadığınız soruda rastgele işaretleme, ortalamada net kazandırmaz; üç yanlış bir doğruyu götürür.

Lisedeki ortalamanızı hesaplamak için [lise not ortalaması hesaplama](/lise-not-ortalamasi-hesaplama), üniversite sınavı için [YKS puan hesaplama](/yks-puan-hesaplama) sayfasına göz atabilirsiniz.

## Resmî dayanak

- MEB {{lgs.yil}} LGS Başvuru ve Uygulama Kılavuzu: [MEB ÖDSGM kılavuzu (PDF)]({{lgs.kaynak}}). Soru sayıları ve ağırlık katsayıları Tablo-1/2'de, puan hesaplama yöntemi 11. maddededir.
- Ortaöğretim kurumlarına yerleştirme, MSP ve yüzdelik dilimlere göre e-tercih ile yapılır.
- Net başına puan katsayıları ({{lgs.per4}} ve {{lgs.per1}}) resmî değildir; önceki yılların sonuçlarından türetilmiş tahminlerdir.

<!-- sss -->

### LGS'de kaç yanlış bir doğruyu götürür?

LGS'de üç yanlış bir doğruyu götürür. Net, doğru sayısından yanlış sayısının üçte birinin çıkarılmasıyla bulunur. Boş bırakılan sorular neti etkilemez.

### LGS'de hangi derslerin katsayısı yüksek?

Türkçe, Matematik ve Fen Bilimleri derslerinin ağırlık katsayısı 4; İnkılap Tarihi, Din Kültürü ve Yabancı Dil derslerinin katsayısı 1'dir. Bu yüzden yüksek katsayılı derslerdeki her net puanı çok daha fazla etkiler.

### LGS puanı en fazla ve en az kaç olabilir?

Merkezî sınav puanı {{lgs.min}} ile {{lgs.max}} arasında hesaplanır. Tüm soruları doğru yanıtlayan öğrenci {{lgs.max}} puan alır.

### Hesaplanan puan neden kesin değil?

MEB, netleri o yılki tüm öğrencilerin ortalaması ve standart sapmasıyla standart puana çevirir. Bu değerler sınav sonrasında belli olduğu için hesaplayıcı önceki yılların ortalamasına dayanan tahmini katsayılar kullanır.

### Din Kültürü dersinden muaf öğrencilerin puanı nasıl hesaplanır?

Muaf öğrenciler bu testi cevaplamaz; puanları kılavuzda belirtilen yöntemle diğer testlerdeki başarılarına göre hesaplanır. Bu durumda hesaplayıcıdaki Din Kültürü satırını boş bırakmak puanı olduğundan düşük gösterebilir.

### Yüzdelik dilim nasıl belirlenir?

Yüzdelik dilim, öğrencinin puanının sınava giren tüm öğrenciler içindeki yerini gösterir ve sonuçlarla birlikte açıklanır. Puanı aynı olan öğrencilerin dilimi de aynıdır; hesaplayıcı dilim tahmini yapmaz.
