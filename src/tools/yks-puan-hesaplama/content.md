## YKS puanı nasıl hesaplanır?

Yükseköğretim Kurumları Sınavı (YKS) üç oturumdan oluşur: **Temel Yeterlilik Testi (TYT)**, **Alan Yeterlilik Testleri (AYT)** ve **Yabancı Dil Testi (YDT)**. ÖSYM puanınızı dört adımda hesaplar:

1. **Ham puan (net) bulunur.** Her testte doğru sayısından yanlış sayısının dörtte biri çıkarılır.
2. **Standart puana çevrilir.** Her testin neti, o yıl sınava giren tüm adayların ortalaması ve standart sapmasıyla standart puana dönüştürülür.
3. **Ağırlıklı toplam alınır.** Puan türüne göre testlerin standart puanları belirli ağırlıklarla toplanır ve 100–500 arasına ölçeklenir. Bu, **ham YKS puanınızdır**.
4. **OBP eklenir.** Ortaöğretim başarı puanınızın (OBP) katsayılı değeri eklenerek **yerleştirme puanı** bulunur. Tercihlerde bu puan kullanılır.

İkinci adım her yıl değiştiği için ÖSYM sabit bir "net başına puan" yayımlamaz. Bu hesaplayıcı, {{yks.kYil}} YKS sonuçlarından türetilmiş **tahmini katsayılar** kullanır; sonuç gerçek puanınıza genellikle birkaç puan yakın çıkar ama resmî puan değildir.

## Net hesaplama: 4 yanlış 1 doğruyu götürür

> **Net = Doğru − Yanlış ÷ 4**

Boş bırakılan sorular neti etkilemez. Örneğin TYT Türkçe testinde 30 doğru ve 8 yanlış yapan adayın neti 30 − 8/4 = **28**'dir. Bir testte doğru ile yanlışın toplamı soru sayısını aşamaz; hesaplayıcı bu durumda uyarı verir. Yanlışlar fazlaysa net eksiye düşebilir ve diğer testlerden kazandığınız puanı azaltır.

## Puan türleri ve testlerin ağırlığı

| Puan türü | Hangi testler? | Kullanıldığı programlar |
| --- | --- | --- |
| TYT | Yalnız TYT (Türkçe, Sosyal, Temel Matematik, Fen) | Önlisans programları |
| SAY | TYT %40 + AYT Matematik ve Fen Bilimleri %60 | Tıp, mühendislik, fen bilimleri |
| EA | TYT %40 + AYT Matematik ile TDE–Sosyal Bilimler-1 %60 | Hukuk, işletme, iktisat, psikoloji |
| SÖZ | TYT %40 + AYT TDE–Sosyal-1 ve Sosyal Bilimler-2 %60 | Tarih, edebiyat, ilahiyat, gazetecilik |
| DİL | TYT %40 + YDT %60 | Yabancı dil öğretmenliği, mütercim-tercümanlık |

Aşağıdaki tablo, hesaplayıcının kullandığı **tahmini net başına puan** katsayılarını gösterir. Her puan türü {{yks.base}} taban puanla başlar; tam netle her tür yaklaşık 500'e ulaşır.

{{yks.katsayiTablosu}}

## OBP ve yerleştirme puanı

Ortaöğretim başarı puanı, diploma notunuzun 5 ile çarpılmasıyla bulunur: 85 diploma notu = 425 OBP. Diploma notu 50'nin altında olsa bile 50 kabul edilir.

> **Yerleştirme puanı = Ham puan + OBP × {{yks.obp}}**

Böylece OBP, puanınıza en fazla **{{yks.obpMax}} puan** ekler. Bir önceki yıl ({{yks.kYil}}) merkezî yerleştirmeyle bir yükseköğretim programına yerleşen adaylarda katsayı **{{yks.obpYerlesen}}**'ya düşer; katkı en fazla {{yks.obpMaxYerlesen}} puan olur. Formdaki "{{yks.kYil}}'te bir programa yerleştim" anahtarı bu kuralı uygular. Diploma notunuzu henüz bilmiyorsanız alanı boş bırakın; hesaplayıcı yalnız ham puanları gösterir. Lise ortalamanızı tahmin etmek için [lise not ortalaması hesaplama](/lise-not-ortalamasi-hesaplama) aracını kullanabilirsiniz.

## Puan hesaplanma şartı (0,5 net kuralı)

ÖSYM, bir puan türünün hesaplanabilmesi için ilgili testlerin en az birinden **0,5 ham puan** (net) şartı arar:

- **TYT:** Türkçe veya Temel Matematik testinden en az 0,5 net.
- **SAY:** AYT Matematik veya Fen Bilimleri testinden en az 0,5 net.
- **EA:** Türk Dili ve Edebiyatı–Sosyal Bilimler-1 veya Matematik testinden en az 0,5 net.
- **SÖZ:** Türk Dili ve Edebiyatı–Sosyal Bilimler-1 veya Sosyal Bilimler-2 testinden en az 0,5 net.
- **DİL:** YDT'den en az 0,5 net.

AYT ve YDT puanlarının içinde TYT payı bulunduğundan, TYT puanı hesaplanmayan adayın diğer puanları da hesaplanmaz. Hesaplayıcı şartı sağlamayan puan türünü "Hesaplanmadı" olarak gösterir.

## Örnek hesaplamalar

### Örnek 1: Sayısal aday

TYT'de Türkçe 28, Sosyal 14, Temel Matematik 23 ve Fen 9 net; AYT'de Matematik 18, Fizik 7, Kimya 6 ve Biyoloji 8 net yapan, diploma notu 85 olan bir aday:

- TYT ham puanı: **{{yks.o1.tytHam}}**, yerleştirme puanı: **{{yks.o1.tytYer}}**
- SAY ham puanı: **{{yks.o1.sayHam}}**, yerleştirme puanı: **{{yks.o1.sayYer}}**
- OBP katkısı: 425 × {{yks.obp}} = {{yks.o1.obpKatki}}

### Örnek 2: Eşit ağırlık adayı

TYT'de 33 / 15 / 20 / 5 net; AYT'de Edebiyat 17, Tarih-1 6,5, Coğrafya-1 5 ve Matematik 14 net yapan, diploma notu 78 olan aday için TYT ham puanı **{{yks.o2.tytHam}}**, EA ham puanı **{{yks.o2.eaHam}}** olur. OBP katkısı {{yks.o2.obpKatki}} eklenince EA yerleştirme puanı **{{yks.o2.eaYer}}** çıkar.

### Örnek 3: Önceki yıl yerleşmiş aday

Aynı netlere sahip aday {{yks.kYil}}'te bir programa yerleştiyse OBP katkısı {{yks.o3.obpKatki}}'e düşer ve EA yerleştirme puanı **{{yks.o3.eaYer}}** olur. Aradaki fark sıralamada binlerce kişi edebilir.

## Sık yapılan hatalar

- **Yanlışları düşmeyi unutmak.** Doğru sayısını net sanmak puanı olduğundan yüksek gösterir.
- **Ham puanla yerleştirme puanını karıştırmak.** Taban puan listeleri yerleştirme (OBP eklenmiş) puanına göre yayımlanır; karşılaştırmayı aynı türle yapın.
- **OBP'yi yanlış girmek.** Formdaki alan diploma notudur (100'lük); 5 ile çarpılmış OBP'yi girmeyin.
- **Önceki yıl yerleşmeyi unutmak.** Geçen yıl bir programa yerleştiyseniz (kayıt yaptırmasanız bile) OBP katsayınız yarıya iner (açıköğretim gibi istisnalar için kılavuza bakın).
- **Tahmini puanı kesin sanmak.** Aynı net, sınavın zorluğuna göre yıldan yıla 10–20 puan farklı sonuç verebilir.

Puan hesaplamayı LGS için yapmak isterseniz [LGS puan hesaplama](/lgs-puan-hesaplama), üniversitedeki ortalamanız için [üniversite not ortalaması hesaplama](/universite-not-ortalamasi-hesaplama) sayfasını kullanabilirsiniz.

## Resmî dayanak

- ÖSYM {{yks.yil}}-YKS Kılavuzu ve sık sorulan sorular: [{{yks.yil}} YKS SSS (ÖSYM)]({{yks.kaynak}})
- Net hesabı (yanlışın dörtte biri), TYT'nin %40 katkısı, OBP katsayıları ({{yks.obp}} / {{yks.obpYerlesen}}) ve 0,5 ham puan şartı ÖSYM kılavuzundadır.
- Net başına puan katsayıları resmî değildir; {{yks.kYil}} sonuçlarından türetilmiş tahminlerdir ve yeni sonuçlar açıklandıkça güncellenir.

<!-- sss -->

### YKS'de kaç yanlış bir doğruyu götürür?

TYT, AYT ve YDT'de dört yanlış bir doğruyu götürür. Net, doğru sayısından yanlış sayısının dörtte birinin çıkarılmasıyla bulunur; boş bırakılan sorular neti etkilemez.

### OBP puana ne kadar etki eder?

OBP, diploma notunun 5 katıdır ve {{yks.obp}} katsayısıyla çarpılarak puana eklenir. 100 diploma notu en fazla {{yks.obpMax}} puan katkı sağlar. Bir önceki yıl bir programa yerleşenlerde katsayı {{yks.obpYerlesen}} olur.

### Sadece TYT'ye girersem hangi programlara başvurabilirim?

Yalnız TYT puanıyla önlisans programlarını ve özel yetenek sınavıyla öğrenci alan bazı programları tercih edebilirsiniz. Lisans programları için ilgili AYT puan türü gerekir.

### Hesaplayıcı neden "puan hesaplanmadı" diyor?

ÖSYM, her puan türü için ilgili testlerin en az birinden 0,5 net şartı arar. TYT'de Türkçe veya Temel Matematik'ten 0,5 net yapılmazsa TYT ile birlikte AYT puanları da hesaplanmaz.

### Bu hesaplayıcı sıralama tahmini yapıyor mu?

Hayır. Sıralama, o yılki tüm adayların puan dağılımına bağlıdır ve sonuçlar açıklanmadan güvenilir biçimde tahmin edilemez. Hesaplayıcı yalnızca tahmini ham ve yerleştirme puanını verir.

### Tahmini puan ile gerçek puan arasında ne kadar fark olur?

ÖSYM standart puan kullandığı için fark sınavın zorluğuna bağlıdır. Ortalama bir yılda fark birkaç puandır; sınavın çok kolay ya da çok zor geçtiği yıllarda 10–20 puana çıkabilir.

### Diploma notum 50'nin altındaysa ne olur?

ÖSYM, 50'nin altındaki diploma notlarını 50 kabul eder; bu durumda OBP 250 olarak hesaplanır.
