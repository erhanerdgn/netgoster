## Üniversite not ortalaması nasıl hesaplanır?

Türkiye'deki üniversitelerin büyük çoğunluğu **4'lük not sistemi** kullanır. Her dersin harf notu bir katsayıya karşılık gelir ve dersin ortalamaya etkisi, o dersin **AKTS** (Avrupa Kredi Transfer Sistemi) veya **ulusal kredisi** kadar ağırlık taşır. 6 AKTS'lik bir dersteki AA, 2 AKTS'lik bir dersteki AA'dan üç kat fazla etkilidir.

> **Dönem ortalaması = Σ (harf notu katsayısı × AKTS) ÷ Σ AKTS**

Hesap şöyle yapılır:

1. Her dersin harf notu katsayıya çevrilir (örneğin BA = 3,50).
2. Katsayı, dersin AKTS'si veya kredisiyle çarpılır; bu, dersin **ağırlıklı puanıdır**.
3. Ağırlıklı puanlar toplanır ve dönemdeki toplam AKTS'ye bölünür.
4. Sonuç genellikle virgülden sonra **iki basamağa yuvarlanır**.

Dönem ortalamasına çoğu üniversitede **DNO** veya **YNO**, tüm dönemleri kapsayan ortalamaya **GANO** (genel akademik not ortalaması) denir.

## Harf notları ve katsayıları

Aşağıdaki tablo en yaygın kullanılan karşılıkları ve her katsayının YÖK dönüşümüne göre 100'lük değerini gösterir:

{{uni.harfTablosu}}

**Harf notu karşılıkları üniversiteye göre değişir.** Bazı üniversitelerde FD notu yoktur ya da doğrudan başarısız sayılır; bazılarında "+/−" içeren farklı bir ölçek (A, A−, B+…) veya DZ (devamsız), G/K (geçti/kaldı) gibi ortalamaya katılmayan notlar kullanılır. Hesaplayıcıyı kullanmadan önce kendi üniversitenizin önlisans-lisans eğitim yönetmeliğini kontrol edin. Ortalamaya katılmayan dersleri listeye eklemeyin.

## Yeni GANO nasıl bulunur?

Yeni dönemin notlarıyla genel ortalamanızı güncellemek için önceki GANO'nuzu ve o ana kadar tamamladığınız toplam AKTS'yi bilmeniz yeterlidir:

> **Yeni GANO = (Önceki GANO × önceki toplam AKTS + bu dönemin ağırlıklı puanı) ÷ (önceki AKTS + bu dönemin AKTS'si)**

Hesaplayıcıdaki "Önceki GANO" ve "Önceki toplam AKTS/kredi" alanlarını doldurduğunuzda yeni GANO otomatik hesaplanır. Bu yöntem, bu dönem tekrar ettiğiniz bir ders yoksa doğrudur. Tekrar edilen derslerde yeni not eskisinin yerine geçtiği için transkriptteki GANO biraz farklı çıkabilir.

## 4'lük sistemden 100'lük sisteme YÖK dönüşümü

KPSS ilanları, lisansüstü başvurular ve akademik kadro ilanları çoğu zaman mezuniyet notunu 100'lük sistemde ister. YÖK'ün 4'lük → 100'lük çevirim tablosu şu formüle dayanır:

> **100'lük not = (70 ÷ 3) × GNO + 20 ÷ 3**

Sonuç **iki ondalığa kesilir** (yuvarlanmaz). Örneğin 3,00 için 70 + 6,666… = 76,666… bulunur ve {{uni.y300}} olarak yazılır. Tablo yalnızca **1,00 ile 4,00** arasını kapsar; 1,00'ın altındaki ortalamaların resmî 100'lük karşılığı yoktur. Hesaplayıcı bu durumda "tabloda yok" uyarısı gösterir. Bazı üniversiteler kendi senato kararıyla farklı bir dönüşüm tablosu kullanabilir; diplomanızda veya transkriptinizde 100'lük not yazıyorsa resmî başvurularda o değeri kullanın.

## Örnek hesaplamalar

### Örnek 1: Dönem ortalaması

Matematik BA (6 AKTS), Fizik CB (6), Programlama AA (5), Teknik Resim BB (4), İngilizce CC (3) ve Türk Dili BA (2) alan öğrencinin ağırlıklı puan toplamı **{{uni.o1.agirlikli}}**, toplam AKTS **{{uni.o1.kredi}}**'dır. Dönem ortalaması {{uni.o1.agirlikli}} ÷ {{uni.o1.kredi}} = **{{uni.o1.ort}}**, 100'lük karşılığı **{{uni.o1.yuzluk}}** olur.

### Örnek 2: Yeni GANO

Aynı öğrencinin bu dönemden önce 90 AKTS'de 2,85 GANO'su varsa önceki ağırlıklı puanı {{uni.o2.oncekiAgirlikli}}'dir. Yeni GANO = ({{uni.o2.oncekiAgirlikli}} + {{uni.o1.agirlikli}}) ÷ {{uni.o2.toplamKredi}} = **{{uni.o2.gano}}**; 100'lük karşılığı **{{uni.o2.yuzluk}}**.

### Örnek 3: Düşük ortalama

DD (6 AKTS), FD (5), FF (4) ve DC (5) notlarıyla dönem ortalaması **{{uni.o3.ort}}** olur. Bu değer 1,00'ın altında olduğundan YÖK tablosunda 100'lük karşılığı **{{uni.o3.yuzluk}}**. Bu öğrenci çoğu üniversitede akademik uyarı veya sınamalı statüye girer.

## Onur belgesi ve akademik durum

Dönem ortalaması yalnız transkript için değil, akademik durumunuz için de önemlidir. Pek çok üniversitede dönem sonunda belirli bir ortalamanın üzerinde olan ve başarısız dersi bulunmayan öğrenciler **onur öğrencisi** (genellikle 3,00–3,49) veya **yüksek onur öğrencisi** (genellikle 3,50–4,00) olarak ilan edilir. Ortalaması 2,00'ın altına düşen öğrenciler ise akademik uyarı alabilir, üst dönemden ders seçmeleri kısıtlanabilir. Bu eşikler de üniversiteden üniversiteye değişir.

## Sık yapılan hatalar

- **Basit ortalama almak.** Harf notlarının katsayılarını toplayıp ders sayısına bölmek AKTS'yi yok sayar ve yanlış sonuç verir.
- **AKTS ile ulusal krediyi karıştırmak.** Üniversiteniz GANO'yu hangisiyle hesaplıyorsa onu kullanın; ikisini aynı listede karıştırmayın.
- **100'lük notu yuvarlamak.** YÖK tablosunda değer kesilir: 76,666 → 76,66; 76,67 değildir.
- **Ortalamaya katılmayan dersleri eklemek.** Muaf, G/K veya kredisiz dersler (staj, seminer vb.) ortalamaya girmez.
- **Koşullu geçmeyi unutmak.** Pek çok üniversitede DC ve DD notları ancak GANO 2,00 ve üzerindeyse başarılı sayılır.

ALES ve KPSS başvurularında 100'lük notunuzu kullanmadan önce [ALES puan hesaplama](/ales-puan-hesaplama) ve [KPSS puan hesaplama](/kpss-puan-hesaplama) araçlarıyla diğer şartları da kontrol edebilirsiniz. Lise ortalaması için [lise not ortalaması hesaplama](/lise-not-ortalamasi-hesaplama) sayfasına bakın.

## Resmî dayanak

- YÖK 4'lük not sisteminden 100'lük not sistemine çevirim tablosu: [YÖK çevirim tablosu (PDF)]({{uni.kaynak}}).
- Harf notları, katsayılar ve başarı şartları her üniversitenin senato onaylı önlisans ve lisans eğitim-öğretim yönetmeliğinde düzenlenir.

<!-- sss -->

### GANO nasıl hesaplanır?

Tüm dönemlerde alınan derslerin harf notu katsayıları AKTS veya kredileriyle çarpılır, bu çarpımlar toplanır ve toplam AKTS'ye bölünür. Tekrar edilen derslerde genellikle son alınan not hesaba katılır.

### 4'lük not 100'lük sisteme nasıl çevrilir?

YÖK tablosuna göre 100'lük not = (70/3) × GNO + 20/3 formülüyle bulunur ve sonuç iki ondalığa kesilir. Örneğin 3,00 GNO, {{uni.y300}} puana karşılık gelir.

### 3,00 ortalama 100'lük sistemde kaç eder?

YÖK dönüşüm tablosuna göre 3,00 ortalama 100'lük sistemde {{uni.y300}}, 3,50 ortalama {{uni.y350}}, 2,00 ortalama {{uni.y200}} puana karşılık gelir.

### FD notu geçer mi?

Üniversiteye göre değişir. Birçok üniversitede FD (0,50) başarısız not sayılır ve ders tekrar edilmelidir; bazı üniversitelerde FD notu hiç kullanılmaz. Kendi yönetmeliğinize bakın.

### Mezuniyet için GANO kaç olmalı?

Çoğu üniversitede mezun olabilmek için tüm derslerden başarılı olmak ve GANO'nun en az 2,00 olması gerekir. Bazı programlar daha yüksek bir ortalama isteyebilir.

### AKTS ile kredi arasındaki fark nedir?

AKTS, öğrencinin ders için harcadığı toplam iş yüküne göre belirlenir ve bir dönem genellikle 30 AKTS'dir. Ulusal kredi ise haftalık teorik ve uygulama saatine dayanır. Ortalama, üniversitenizin esas aldığı birime göre hesaplanmalıdır.
