## Rakamı yazıya çevirme nasıl yapılır?

Bir sayıyı yazıya çevirirken rakamlar sağdan sola **üçerli gruplara** ayrılır. Her grup 0–999 arasında bir sayı olarak okunur, ardından grubun basamak adı eklenir: bin, milyon, milyar, trilyon, katrilyon, kentilyon. Sıfır olan gruplar okunmaz.

Örneğin 12.450,50 TL şu şekilde okunur:

- **12** → on iki + **bin**
- **450** → dört yüz elli
- **,50** → elli kuruş

Sonuç: **{{ry.o1.ayri}}**.

Hesaplayıcı bu işlemi kayan noktalı sayı kullanmadan, rakamları metin olarak işleyerek yapar. Bu sayede 21 basamaklı (999 kentilyona kadar) tutarlar da kuruşu kuruşuna doğru çevrilir.

### Basamak adları

| Basamak grubu | Sıfır sayısı | Adı |
| --- | --- | --- |
| 1.000 | 3 | bin |
| 1.000.000 | 6 | milyon |
| 1.000.000.000 | 9 | milyar |
| 1.000.000.000.000 | 12 | trilyon |
| 1.000.000.000.000.000 | 15 | katrilyon |
| 1.000.000.000.000.000.000 | 18 | kentilyon |

## "Bin" mi, "bir bin" mi?

Türkçede **bin** ve **yüz** sözcüklerinin önüne "bir" getirilmez: 1.000 "{{ry.bin}}", 1.001 "{{ry.binbir}}", 101 "{{ry.yuzbir}}" diye okunur. Milyon ve daha büyük basamaklarda ise "bir" söylenir ve yazılır: 1.000.000 "{{ry.milyon}}", 1.001.000 "{{ry.milyonbin}}", 10^15 ise "{{ry.katrilyon}}" olur.

"Bir bin" yazımı yanlıştır; çek ya da senette "birbin" görmek, belgeyi dolduranın kuralı bilmediğini gösterir. Benzer şekilde 11.000 "on bir bin" olarak yazılır, buradaki "bir" on birin parçasıdır.

## TDK'ya göre sayıların yazımı

Türk Dil Kurumunun [sayıların yazılışı](https://tdk.gov.tr/icerik/yazim-kurallari/sayilarin-yazilisi/) kuralına göre birden çok kelimeden oluşan sayılar **ayrı** yazılır: on iki, dört yüz elli, iki bin yirmi altı. Hesaplayıcının "TDK (ayrı)" seçeneği bu kurala göre sonuç üretir.

Aynı kural, **para ile ilgili işlemlerde ve senet, çek gibi ticari belgelerde** sayıların bitişik yazılmasını ister. TDK bu kural için "altıyüzelliTL,otuzbeşkr." biçiminde bir örnek verir. Amaç, tutarın sonradan "bin" ya da "yüz" eklenerek değiştirilmesini önlemektir. Bitişik yazılan bir tutarın arasına kelime sıkıştırmak mümkün olmadığından sahteciliğe karşı basit ama etkili bir önlemdir.

TDK kurallarından diğer önemli noktalar:

- Ondalık kısım virgülle ayrılır: 15,2. Okurken "on beş virgül iki" denir.
- Dört ve daha çok basamaklı sayılarda üçerli gruplar nokta ile ayrılır (1.250.000). Yıl, telefon ve hesap numaralarında nokta kullanılmaz: 2026.
- Metin içinde büyük sayılar rakam ve yazı karışık verilebilir: 3 milyon, 12,5 milyar.

## Çek ve senette tutar nasıl yazılır?

Çek, senet, fatura ve makbuzlarda yaygın kalıp, tutarın başına **"Yalnız"** yazıp tutarı bitişik yazmak ve sonuna para birimini kısaltmayla eklemektir:

> **{{ry.o1.cek}}**

Bazı firmalar ve bankalar okunurluğu artırmak için her kelimenin baş harfini büyük ya da tamamını büyük harfle yazar:

- {{ry.o1.kelime}}
- {{ry.o1.buyuk}}

Elle doldurulan belgelerde tutarın başına ve sonuna "#" ya da "=" işareti koymak da yaygındır (#Yalnız…#). Böylece başa veya sona ekleme yapılması zorlaşır. Türk Ticaret Kanunu'na göre çek ve senette yazıyla ve rakamla yazılan tutarlar arasında fark varsa **yazıyla yazılan tutar** geçerli sayılır; bu yüzden yazıyla yazımda hata yapmamak önemlidir.

## Kuruş nasıl yazılır ve yuvarlanır?

Türk lirasının alt birimi kuruştur ve 1 TL = 100 kuruştur. Hesaplayıcı TL, dolar ve avro seçildiğinde ondalık kısmı **iki haneye** yuvarlar: üçüncü ondalık 5 ya da daha büyükse kuruş bir artar, küçükse atılır. Örneğin 1.249,995 TL, {{ry.o3.rakam}} olarak kabul edilir ve "{{ry.o3.ayri}}" diye yazılır. Yuvarlama yapıldığında sonuçta ayrıca uyarı gösterilir.

Kuruşu olmayan tutarlarda yalnız lira yazılır, tutar 1 TL'nin altındaysa yalnız kuruş yazılır ("elli kuruş"). Dolar ve avroda küsurat **sent** olarak okunur: 1.250,40 dolar için "{{ry.o4.ayri}}", çek biçiminde "{{ry.o4.cek}}".

"Sadece sayı" seçeneğinde para birimi eklenmez ve ondalık kısım yuvarlanmadan "virgül" ile okunur: 3,05 → "{{ry.ondalik}}". Negatif sayılar "eksi" ile başlar: −15 → "{{ry.eksi}}".

## Örnek hesaplamalar

### Örnek 1: Fatura tutarı

12.450,50 TL'lik bir faturada "yalnız" satırı:

- TDK yazımı: {{ry.o1.ayri}}
- Fatura/çek yazımı: **{{ry.o1.cek}}**

### Örnek 2: Konut satış bedeli

2.750.000,75 TL'lik tapu ya da sözleşme bedeli:

- TDK yazımı: {{ry.o2.ayri}}
- Çek/senet yazımı: **{{ry.o2.cek}}**

Tapu harcı gibi bedel üzerinden hesaplanan masraflar için [tapu harcı hesaplama](/tapu-harci-hesaplama) aracını kullanabilirsiniz.

### Örnek 3: Yıl

2026 yılı yazıyla "{{ry.yil}}" olarak yazılır. Yıllarda binlik ayraç kullanılmaz, okunuşu ise diğer sayılarla aynıdır.

## En çok aranan sayıların yazılışı

| Rakam | Yazıyla (TDK) | Çek / senet (TL) |
| --- | --- | --- |
{{ry.tablo}}

## Sık yapılan hatalar

- **"Bir bin" yazmak:** 1.000 yalnız "bin" diye yazılır; "bir" yalnız milyon ve sonrasında kullanılır.
- **Birleşik sayıları bitişik yazmak (metin içinde):** Dilekçe, mektup ya da sözleşme metninde "onikibin" değil "on iki bin" yazılır. Bitişik yazım yalnız para belgelerine özgüdür.
- **Binlik ayraç ile ondalık ayracı karıştırmak:** Türkçede binlik ayraç nokta, ondalık ayraç virgüldür. "1.500" bin beş yüz, "1,500" ise bir virgül beş yüz demektir. Hesaplayıcı İngilizce biçimi (1,500.25) de tanır; ikisi birden yazıldığında sonda olan işaret ondalık sayılır.
- **Kuruşu yanlış okumak:** 12,5 TL "on iki lira beş kuruş" değil, **elli kuruştur**; virgülden sonraki tek rakam onlar basamağıdır.
- **Rakam ve yazının uyuşmaması:** Çek ve senette iki tutar farklıysa yazıyla yazılan esas alınır. Düzenlemeden önce ikisini karşılaştırın.

Tutarın KDV dahil ve hariç karşılığını bulmak için [KDV hesaplama](/kdv-hesaplama), döviz tutarını TL'ye çevirmek için [döviz çevirici](/doviz-cevirici) aracına göz atabilirsiniz.

<!-- sss -->

### 1000 TL yazıyla nasıl yazılır?

TDK'ya göre "bin Türk lirası" diye yazılır, "bir bin" denmez. Çek ve senette bitişik olarak "Yalnız bin TL" şeklinde yazılır.

### 1.500 TL yazıyla nasıl yazılır?

"Bin beş yüz Türk lirası" olarak yazılır. Çek ve senette "Yalnız binbeşyüz TL" kalıbı kullanılır.

### Çek ve senette tutar neden bitişik yazılır?

Bitişik yazılan tutarın arasına "bin", "yüz" gibi kelimeler eklenemez; bu da tutarın sonradan değiştirilmesini zorlaştırır. TDK yazım kuralları da para işlemlerinde ve ticari belgelerde sayıların bitişik yazılmasını öngörür.

### 1.000.000 nasıl okunur?

"Bir milyon" diye okunur ve yazılır. Bin ve yüzden farklı olarak milyon, milyar ve trilyon gibi basamak adlarının önüne "bir" getirilir.

### Kuruş yazıyla nasıl yazılır?

Virgülden sonraki iki rakam kuruşu gösterir ve ayrı bir sayı olarak okunur: 0,75 TL "yetmiş beş kuruş", 12,05 TL "on iki Türk lirası beş kuruş" olur. Çek ve senette kuruş "Kr." kısaltmasıyla yazılır: "Yalnız oniki TL beş Kr."

### Katrilyondan sonra hangi basamak gelir?

Katrilyon (15 sıfır) basamağından sonra kentilyon (18 sıfır), seksilyon (21 sıfır) ve septilyon (24 sıfır) gelir. Hesaplayıcı 999 kentilyona kadar olan, yani 21 basamaklı sayıları çevirir.

### 2026 yazıyla nasıl yazılır?

"İki bin yirmi altı" olarak ayrı yazılır. Yıllar rakamla yazılırken binlik ayraç (nokta) kullanılmaz.

### Ondalıklı sayılar nasıl okunur?

Tam kısım okunur, ardından "virgül" denir ve ondalık kısım okunur: 15,2 "on beş virgül iki", 3,05 "üç virgül sıfır beş" olur. Para tutarlarında ise ondalık kısım kuruş olarak okunur.

### Hesaplayıcı hangi biçimde yazılan sayıları kabul eder?

12.450,50 · 12450,50 · 12450.50 · 12,450.50 ve 1 250 000 gibi biçimlerin hepsi tanınır. Tek nokta ve arkasında tam üç rakam varsa (1.500) nokta binlik ayraç sayılır. ₺, TL, $ ve € işaretleri yok sayılır.
