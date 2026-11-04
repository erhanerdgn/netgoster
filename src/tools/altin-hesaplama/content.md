## Altın değeri nasıl hesaplanır?

Bir altının değeri iki bilgiye dayanır: içerdiği **saf (has) altın miktarı** ve **has altının gram fiyatı**. Has altın miktarı, altının brüt ağırlığının **milyem** (saflık) değeriyle çarpılmasıyla bulunur. Milyem, binde kaç birimin saf altın olduğunu gösterir: 22 ayar altın {{altin.ayar22.milyem}}, yani ağırlığının yaklaşık %91,6'sı saf altındır.

> **Has altın miktarı (g) = Brüt ağırlık (g) × Milyem**
>
> **Altın değeri = Has altın miktarı × Has altın gram fiyatı**
>
> Adetli altınlarda: **Brüt ağırlık = Adet × Bir adetin ağırlığı**

Hesaplayıcı bu işlemi seçtiğiniz altın türüne göre otomatik yapar ve sonucu kuruşa yuvarlar.

## Canlı has değer nedir?

Hesaplayıcıdaki "canlı has değer", uluslararası piyasada işlem gören **ons altın fiyatının (USD)**, Türkiye Cumhuriyet Merkez Bankası'nın **USD/TRY döviz satış kuruyla** çarpılıp bir onsun gram karşılığına (31,1034768 g) bölünmesiyle hesaplanır:

> **Has altın gram fiyatı (₺) = Ons fiyatı (USD) × USD/TRY ÷ 31,1034768**

Bu değer, işçilik, vergi ve alım-satım makası içermeyen **saf altının teorik karşılığıdır**. Kuyumcuların alış ve satış fiyatları işçilik ve makas nedeniyle bu değerden farklıdır: altın satın alırken genellikle daha yüksek, bozdururken daha düşük bir fiyat görürsünüz. **Kesin fiyat için kuyumcunuza danışın.** Kuyumcunuzun fiyatını biliyorsanız "Kendi gram fiyatım" seçeneğiyle 24 ayar gram fiyatını girerek hesaplama yapabilirsiniz.

Canlı fiyat geçici olarak alınamazsa hesaplayıcı son başarılı değeri, alındığı zamanla birlikte uyarı göstererek kullanır; hiç veri yoksa gram fiyatını elle girmeniz istenir.

## Altın türleri, ağırlıklar ve milyemler

Cumhuriyet altınlarının ağırlıkları **Darphane ve Damga Matbaası Genel Müdürlüğü** verilerine, ayar milyemleri ise kıymetli maden ayarlarına ilişkin Hazine tebliğine dayanır. Tüm Cumhuriyet altınları 22 ayardır.

| Altın türü | Brüt ağırlık | Milyem | Has altın |
| --- | --- | --- | --- |
| Gram altın (24 ayar) | 1 g | {{altin.gram24.milyem}} | {{altin.gram24.has}} g |
| 22 ayar altın | 1 g | {{altin.ayar22.milyem}} | {{altin.ayar22.has}} g |
| 18 ayar altın | 1 g | {{altin.ayar18.milyem}} | {{altin.ayar18.has}} g |
| 14 ayar altın | 1 g | {{altin.ayar14.milyem}} | {{altin.ayar14.has}} g |
| Çeyrek altın (ziynet) | {{altin.ceyrek.gram}} g | {{altin.ceyrek.milyem}} | {{altin.ceyrek.has}} g |
| Yarım altın (ziynet) | {{altin.yarim.gram}} g | {{altin.yarim.milyem}} | {{altin.yarim.has}} g |
| Tam altın (ziynet) | {{altin.tam.gram}} g | {{altin.tam.milyem}} | {{altin.tam.has}} g |
| Cumhuriyet / Ata lira | {{altin.cumhuriyet.gram}} g | {{altin.cumhuriyet.milyem}} | {{altin.cumhuriyet.has}} g |

Kuyumcuda satılan çeyrek, yarım ve tam altınlar **ziynet** tipidir. Darphane aynı değerlerin **sikke** tipini de basar; sikke tipi biraz daha ağırdır (ör. sikke çeyrek 1,804 g). Ata lira veya "Cumhuriyet altını" olarak bilinen birlik sikke {{altin.cumhuriyet.gram}} g'dır ve ziynet tam altından daha fazla altın içerir.

**24 ayar gram altın** piyasada 995/1000 saflıkta üretilir. Bu nedenle hesaplayıcı 1 gram 24 ayar altını has değerin {{altin.gram24.milyem}} katı olarak değerlendirir; girdiğiniz "kendi gram fiyatınızı" da aynı oranla has değere çevirir. 14 ayar için piyasada "585" damgası görülse de resmi milyem {{altin.ayar14.milyem}}'tür.

## Örnek hesaplamalar

Aşağıdaki örneklerde has altın gram fiyatı **varsayımsal olarak {{altin.ornekHas}}** alınmıştır.

### Örnek 1: Beş çeyrek altın

Bir çeyrek altın {{altin.ceyrek.gram}} g × {{altin.ceyrek.milyem}} = {{altin.ceyrek.hasTam}} g has altın içerir.

- Bir çeyreğin has değeri: {{altin.ceyrek.hasTam}} × 4.500 = **{{altin.ornek1.birim}}**
- Beş çeyreğin toplam has değeri: **{{altin.ornek1.toplam}}**

### Örnek 2: 30 gram 22 ayar bilezik

- Has altın: 30 × {{altin.ayar22.milyem}} = {{altin.ornek2.has}} g
- Has değer: {{altin.ornek2.has}} × 4.500 = **{{altin.ornek2.toplam}}**

Bileziğin kuyumcudaki satış fiyatı işçilik nedeniyle bundan yüksek, bozdururken alınacak tutar ise genellikle bundan düşüktür.

### Örnek 3: Kuyumcu gram fiyatıyla hesap

Kuyumcunuz 24 ayar gram altını 4.600 TL'den veriyorsa has gram karşılığı 4.600 ÷ {{altin.gram24.milyem}} = {{altin.ornek3.has}} olur. Bu fiyatla bir Cumhuriyet altınının has karşılığı **{{altin.ornek3.cumhuriyet}}** eder.

## Altın alırken ve satarken nelere dikkat edilmeli?

Altın alırken mutlaka **fatura** isteyin; faturada altının türü, ayarı, ağırlığı ve birim fiyatı yazmalıdır. Takı ve bileziklerde ayar damgasını kontrol edin ve ağırlığı kuyumcunun hassas terazisinde birlikte tartın. Gram altınlarda üreticinin ambalajı ve seri numarası, ürünün saflığını ve ağırlığını belgeleyen önemli bir göstergedir. Satış yapmadan önce birkaç kuyumcudan **alış fiyatı** alarak karşılaştırmak, makas farkını azaltmanın en kolay yoludur. Bu hesaplayıcıdaki has değer, teklifleri karşılaştırırken tarafsız bir referans noktası olarak kullanılabilir.

## Sık yapılan hatalar

- **Has değeri kuyumcu fiyatı sanmak.** Canlı has değer işçilik ve makas içermez; alım-satımda kuyumcunun fiyatı esas alınır.
- **Çeyrek altını 1,75 g saymak.** Darphane'nin resmi ziynet çeyrek ağırlığı {{altin.ceyrek.gram}} g'dır; yuvarlanmış değerler çok adetli hesaplarda fark yaratır.
- **Tam altın ile Cumhuriyet altınını karıştırmak.** Ziynet tam altın {{altin.tam.gram}} g, Ata lira {{altin.cumhuriyet.gram}} g'dır.
- **Takının tamamını altın saymak.** Taşlı takılarda taşın ağırlığı altın değildir; yalnızca altın kısmının ağırlığını girin.
- **Ayarı yanlış seçmek.** Damgadaki 916, 750 ve 585 rakamları sırasıyla 22, 18 ve 14 ayarı gösterir.

Dolar ve diğer kurların TL karşılığı için [döviz çevirici](/doviz-cevirici), birikimlerinizin getirisini karşılaştırmak için [mevduat faizi hesaplama](/mevduat-faizi-hesaplama) aracını kullanabilirsiniz.

<!-- sss -->

### Çeyrek altın kaç gram?

Darphane verilerine göre kuyumcuda satılan ziynet çeyrek altın {{altin.ceyrek.gram}} gramdır ve 22 ayardır. İçerdiği has altın yaklaşık {{altin.ceyrek.has}} gramdır.

### Cumhuriyet altını ile tam altın arasındaki fark nedir?

Cumhuriyet altını (Ata lira) {{altin.cumhuriyet.gram}} g ağırlığında birlik sikkedir; ziynet tam altın ise {{altin.tam.gram}} g'dır. İkisi de 22 ayardır, bu nedenle Cumhuriyet altını daha fazla saf altın içerir.

### Canlı has değer neden kuyumcu fiyatından farklı?

Canlı değer, ons fiyatı ve TCMB dolar kurundan hesaplanan saf altının teorik karşılığıdır. Kuyumcu fiyatlarına işçilik, alım-satım makası ve işletme maliyetleri eklenir. Kesin fiyat için kuyumcunuza danışın.

### 22 ayar altının milyemi nedir?

22 ayar altının milyemi {{altin.ayar22.milyem}}'dır; yani ağırlığının binde 916'sı saf altındır. 18 ayar {{altin.ayar18.milyem}}, 14 ayar {{altin.ayar14.milyem}} milyemdir.

### Bilezik değeri nasıl hesaplanır?

Bileziğin gram cinsinden ağırlığı ayarının milyemiyle çarpılarak has altın miktarı bulunur, bu miktar has gram fiyatıyla çarpılır. Satış fiyatında ayrıca işçilik bedeli bulunur.

### Canlı fiyat alınamazsa ne olur?

Hesaplayıcı son başarılı fiyatı, alındığı zamanla birlikte uyarı göstererek kullanır. Hiç veri yoksa kuyumcunuzun 24 ayar gram fiyatını girerek hesaplamaya devam edebilirsiniz.
