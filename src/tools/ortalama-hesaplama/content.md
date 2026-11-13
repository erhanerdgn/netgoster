## Ortalama nedir?

Ortalama, bir sayı grubunu tek bir "tipik" değerle özetler. Günlük dilde ortalama denince çoğunlukla **aritmetik ortalama** kastedilir; ancak verinin yapısına göre medyan, mod, geometrik ya da harmonik ortalama daha doğru bir özet verebilir. Bu hesaplayıcı, girdiğiniz sayı listesi için bu ölçülerin hepsini aynı anda hesaplar; değerlerin ne kadar dağınık olduğunu da aralık ve standart sapmayla gösterir.

## Sayıları nasıl girmelisiniz?

Sayı kutusuna değerleri art arda yazabilir ya da Excel, Google E-Tablolar veya not defterinden yapıştırabilirsiniz. Kabul edilen biçimler:

- **Ayraçlar:** boşluk, alt satır (her satıra bir sayı), sekme, noktalı virgül (;) ve "virgül + boşluk" (1, 2, 3).
- **Ondalık:** Türkçe virgül (3,5) ya da nokta (3.5).
- **Binlik ayraç:** 1.250 veya 1.250,75. Noktadan sonra tam üç rakam varsa nokta binlik ayraç sayılır; 0.125 gibi sıfırla başlayan sayılar ondalıktır.
- **Virgüllü liste:** Boşluksuz "10,20,30" yazımı üç ayrı sayı olarak okunur. Bu yüzden ondalıklı sayıları ayırırken mutlaka boşluk ya da noktalı virgül kullanın.

Okunamayan bir değer varsa hesaplayıcı hangisi olduğunu gösterir; hatalı değer sessizce atlanmaz.

## Ortalama türleri ve formülleri

### Aritmetik ortalama

> **Ortalama = (x₁ + x₂ + … + xₙ) ÷ n**

Tüm değerler toplanır ve değer sayısına bölünür. Not ortalaması, aylık harcama ortalaması ve günlük sıcaklık ortalaması bu yöntemle hesaplanır. Aşırı uç değerlerden çok etkilenir.

### Ağırlıklı ortalama

> **Ağırlıklı ortalama = Σ(değer × ağırlık) ÷ Σ ağırlık**

Her değerin farklı önemde olduğu durumlarda kullanılır: vize %40 + final %60, ders kredileri, farklı fiyatlardan alınan hisse adetleri. Ağırlıkların toplamının 100 olması gerekmez; formül toplam ağırlığa böler. Lise ve üniversite not ortalamaları da ağırlıklı ortalamadır. Bunlar için hazır araçlar: [lise not ortalaması hesaplama](/lise-not-ortalamasi-hesaplama) ve [üniversite not ortalaması (GANO) hesaplama](/universite-not-ortalamasi-hesaplama).

### Medyan (ortanca)

Değerler küçükten büyüğe sıralanır; tek sayıda değer varsa ortadaki değer, çift sayıda varsa ortadaki iki değerin ortalaması medyandır. Uç değerlerden etkilenmediği için maaş, konut fiyatı ve gelir gibi çarpık dağılımlarda aritmetik ortalamadan daha gerçekçidir.

### Mod (tepe değer)

En sık tekrar eden değerdir. Hiçbir değer tekrar etmiyorsa mod yoktur; birden çok değer aynı en yüksek sıklıkta geçiyorsa veri çok modludur ve hesaplayıcı hepsini listeler.

### Geometrik ortalama

> **Geometrik ortalama = (x₁ × x₂ × … × xₙ)^(1/n)**

Büyüme oranları, faiz, enflasyon ve getiri gibi **çarpılarak birikebilen** değerlerin ortalamasıdır. Yalnız pozitif sayılarda tanımlıdır. Hesaplayıcı büyük çarpımlarda taşma olmaması için logaritmaların ortalamasını kullanır.

### Harmonik ortalama

> **Harmonik ortalama = n ÷ (1/x₁ + 1/x₂ + … + 1/xₙ)**

Oranların ve hızların ortalamasıdır: aynı yolu farklı hızlarla gidildiğinde ortalama hız, aynı tutarla farklı fiyatlardan alım yapıldığında ortalama maliyet. Yalnız pozitif sayılarda tanımlıdır.

## Aralık ve standart sapma

**Aralık**, en büyük değerden en küçük değerin çıkarılmasıdır ve dağılımın genişliğini kabaca gösterir. **Standart sapma** ise değerlerin ortalama etrafında ne kadar yayıldığını ölçer:

1. Ortalama bulunur.
2. Her değerden ortalama çıkarılır ve farkın karesi alınır.
3. Kareler toplanır ve bölünür: **popülasyonda n'ye, örneklemde n − 1'e**. Bu sonuç varyanstır.
4. Varyansın karekökü standart sapmadır.

### Örneklem mi, popülasyon mu?

- **Popülasyon standart sapması (σ):** Verileriniz incelediğiniz grubun **tamamıysa** kullanılır. Örneğin bir sınıftaki tüm öğrencilerin notları.
- **Örneklem standart sapması (s):** Veriler daha büyük bir kitleden **seçilmiş bir örnekse** kullanılır. Örneğin 50 kişilik anketle Türkiye geneli hakkında tahmin yapmak. n − 1'e bölmek (Bessel düzeltmesi), örneklemin kitlenin yayılımını olduğundan küçük göstermesini telafi eder.

Excel'de STDEV.S (STDSAPMA.S) örneklem, STDEV.P (STDSAPMA.P) popülasyon standart sapmasını verir. Değer sayısı arttıkça iki sonuç birbirine yaklaşır.

## Örnek hesaplamalar

### Örnek 1: Sınav notları

72 · 85,5 · 90 · 64 · 85 · 78 · 85 · 91 notları için:

- Toplam: {{ort.o1.toplam}}, değer sayısı: {{ort.o1.n}}
- Aritmetik ortalama: {{ort.o1.toplam}} ÷ {{ort.o1.n}} = **{{ort.o1.aritmetik}}**
- Medyan: **{{ort.o1.medyan}}**, mod: **{{ort.o1.mod}}**, aralık: **{{ort.o1.aralik}}**

### Örnek 2: Standart sapma

2 · 4 · 4 · 4 · 5 · 5 · 7 · 9 verisinin ortalaması {{ort.o2.aritmetik}} olur. Ortalamadan farkların kareleri toplamı {{ort.o2.kareler}} olur.

- Popülasyon: varyans {{ort.o2.kareler}} ÷ 8 = {{ort.o2.varyansPop}}, standart sapma **{{ort.o2.ssPop}}**
- Örneklem: varyans {{ort.o2.kareler}} ÷ 7 ≈ {{ort.o2.varyansOrn}}, standart sapma **≈ {{ort.o2.ssOrn}}**

### Örnek 3: Ağırlıklı ortalama

Vizeden 55 (%40), finalden 80 (%60) alan öğrencinin ortalaması: (55 × 40 + 80 × 60) ÷ 100 = {{ort.o3.carpim}} ÷ 100 = **{{ort.o3.ortalama}}**. Basit ortalama ise {{ort.o3.basit}} olurdu; finalin ağırlığı yüksek olduğu için sonuç finale yaklaşır.

### Hangi ortalamayı seçmeli?

- **Büyüme oranları:** Bir yatırım üç yılda %10, %50 ve −%20 değişmişse aritmetik ortalama {{ort.buyume.aritmetik}} çıkar ama gerçek yıllık ortalama değişim geometrik ortalamayla bulunur: **{{ort.buyume.geometrik}}** (1,1 × 1,5 × 0,8 = {{ort.buyume.sonuc}}). Hesaplayıcıya büyüme çarpanlarını (1,1 1,5 0,8) girin. Fon ve mevduat getirileri için [fon getirisi hesaplama](/fon-getirisi-hesaplama) aracına da bakabilirsiniz.
- **Hızlar:** Yolun yarısını 60, yarısını 40 km/sa ile giden aracın ortalama hızı {{ort.hiz.aritmetik}} değil, harmonik ortalamayla **{{ort.hiz.harmonik}} km/sa**'tir.
- **Maaşlar:** 30.000, 32.000, 35.000, 38.000 ve 250.000 TL maaşların aritmetik ortalaması {{ort.maas.aritmetik}} TL, medyanı {{ort.maas.medyan}} TL'dir. Tek bir yüksek maaş ortalamayı çarpıtır; medyan çalışanların çoğunu daha iyi temsil eder.

## Sık kullanılan veri setleri için hazır sonuçlar

| Veri | Ortalama | Medyan | Mod | Std. sapma (s) |
| --- | --- | --- | --- | --- |
{{ort.tablo}}

## Sık yapılan hatalar

- **Yüzdelerin basit ortalamasını almak:** Farklı büyüklükteki grupların yüzdeleri ağırlıklı ortalamayla birleştirilir. Yüzde hesapları için [yüzde hesaplama](/yuzde-hesaplama) aracını kullanabilirsiniz.
- **Büyüme oranlarında aritmetik ortalama:** Ardışık oranlar çarpılarak birikir; geometrik ortalama kullanılmalıdır.
- **Uç değerleri gözden kaçırmak:** Ortalama ile medyan arasında büyük fark varsa veride uç değer vardır.
- **Örneklem/popülasyon karışıklığı:** Küçük veri setlerinde n ile n − 1'e bölmek arasındaki fark büyüktür.
- **Ondalık ayracı karıştırmak:** "3,5" bir sayıdır; "3, 5" ise iki ayrı sayıdır.

<!-- sss -->

### Ortalama nasıl hesaplanır?

Tüm değerler toplanır ve değer sayısına bölünür. Örneğin 70, 80 ve 90'ın ortalaması (70 + 80 + 90) ÷ 3 = 80'dir. Bu, aritmetik ortalamadır.

### Ağırlıklı ortalama nasıl hesaplanır?

Her değer kendi ağırlığıyla çarpılır, çarpımlar toplanır ve ağırlıkların toplamına bölünür. Vize %40 ile 55, final %60 ile 80 ise ortalama {{ort.o3.ortalama}} olur.

### Medyan nasıl bulunur?

Değerler küçükten büyüğe sıralanır. Tek sayıda değer varsa ortadaki sayı, çift sayıda değer varsa ortadaki iki sayının ortalaması medyandır.

### Mod nedir, mod yoksa ne olur?

Mod, veri setinde en sık tekrar eden değerdir. Her değer yalnız bir kez geçiyorsa mod yoktur. Birden fazla değer aynı sıklıkta en çok tekrar ediyorsa hepsi moddur.

### Standart sapma nasıl hesaplanır?

Her değerin ortalamadan farkının karesi alınır ve toplanır. Toplam, popülasyonda n'ye, örneklemde n − 1'e bölünür; sonucun karekökü standart sapmadır.

### Örneklem ve popülasyon standart sapması arasındaki fark nedir?

Popülasyon standart sapması, grubun tamamı elinizdeyken kullanılır ve n'ye bölünür. Örneklem standart sapması, büyük bir kitleden alınmış veriyle tahmin yapılırken kullanılır ve n − 1'e bölünür; bu yüzden biraz daha büyüktür.

### Geometrik ortalama ne zaman kullanılır?

Faiz, enflasyon, nüfus artışı ve yatırım getirisi gibi birbiri ardına çarpılarak biriken oranların ortalamasında kullanılır. Negatif veya sıfır değer varsa tanımsızdır.

### Harmonik ortalama ne işe yarar?

Hız, verim ve birim fiyat gibi oranların ortalamasında kullanılır. Aynı mesafeyi 60 ve 40 km/sa ile giden aracın ortalama hızı {{ort.hiz.harmonik}} km/sa'tir.

### Excel'den kopyaladığım sayıları yapıştırabilir miyim?

Evet. Excel'den kopyalanan sütun her satıra bir sayı olarak gelir ve doğrudan okunur. Türkçe Excel'deki virgüllü ondalıklar (3,5) da İngilizce Excel'deki noktalı ondalıklar (3.5) da tanınır.
