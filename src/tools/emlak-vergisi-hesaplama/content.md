## Emlak vergisi nedir?

Emlak vergisi, Türkiye sınırları içindeki bina, arsa ve araziler için malik (veya intifa hakkı sahibi) tarafından her yıl belediyeye ödenen bir servet vergisidir. Dayanağı 1319 sayılı Emlak Vergisi Kanunu'dur: binalar **bina vergisine**, arsa ve araziler **arazi vergisine** tabidir; ikisi birlikte emlak vergisi olarak anılır. Vergiyi taşınmazın bulunduğu yerin belediyesi tahakkuk ettirir ve tahsil eder.

## Emlak vergisi nasıl hesaplanır?

> **Yıllık emlak vergisi = Vergi değeri × Vergi oranı × Hisse oranı**

- **Vergi değeri:** Piyasa değeri değil, belediyenin kanundaki usule göre hesapladığı değerdir. Binalarda arsa payının emsal m² değeri ile bina inşaat maliyeti (yıpranma payı düşülerek) toplanır; arsa ve arazilerde takdir komisyonlarının belirlediği m² birim değeri esas alınır. Değer, genel beyan dönemleri arasındaki yıllarda her yıl yeniden değerleme oranıyla artırılır.
- **Vergi oranı:** Taşınmaz türüne ve büyükşehir belediyesi sınırları ya da mücavir alan içinde olup olmamasına göre değişir.
- **Hisse oranı:** Hisseli mülkiyette her malik yalnızca kendi payına düşen vergiyi öder.

## {{yil}} emlak vergisi oranları

| Taşınmaz türü | Büyükşehir dışı | Büyükşehir / mücavir alan |
| --- | --- | --- |
| Konut (mesken) | {{emlak.konut}} | {{emlak.konutBs}} |
| İşyeri ve diğer binalar | {{emlak.isyeri}} | {{emlak.isyeriBs}} |
| Arsa | {{emlak.arsa}} | {{emlak.arsaBs}} |
| Arazi (tarla, bağ, bahçe) | {{emlak.arazi}} | {{emlak.araziBs}} |

Büyükşehir belediye sınırları ve mücavir alanlardaki oranlar, kanun gereği %100 artırımlı (iki katı) uygulanır.

## Ödeme zamanı: iki eşit taksit

Yıllık emlak vergisi **iki eşit taksitte** ödenir: birinci taksit **Mart, Nisan ve Mayıs** aylarında (son gün 31 Mayıs), ikinci taksit **Kasım** ayında (son gün 30 Kasım). Vergi tamamen birinci taksitte de ödenebilir. Süresinde ödenmeyen taksitlere gecikme zammı işler. Ödeme belediyenin vezneleri, internet sitesi, anlaşmalı bankalar ve e-Devlet üzerinden yapılabilir.

## Örnek hesaplamalar

### Örnek 1: Büyükşehirde konut

Vergi değeri 1.500.000 TL olan, tek malikli bir daire:

- Yıllık vergi: 1.500.000 × {{emlak.konutBs}} = **{{emlak.o1.yillik}}**
- Mayıs taksiti: {{emlak.o1.taksit1}}, Kasım taksiti: {{emlak.o1.taksit2}}

### Örnek 2: Büyükşehir dışında yarı hisseli arsa

Vergi değeri 800.000 TL olan arsanın yarısına sahip bir kişi için:

- Hisseye düşen değer: {{emlak.o2.hisseMatrah}}
- Yıllık vergi: {{emlak.o2.hisseMatrah}} × {{emlak.arsa}} = **{{emlak.o2.yillik}}**

### Örnek 3: {{emlak.sinirYil}} artış sınırına takılan işyeri

{{emlak.sinirOncekiYil}} vergi değeri 700.000 TL olan bir işyerinin {{emlak.sinirYil}} değeri yeni m² birim değerleriyle 3.000.000 TL hesaplanmış olsun. Değer, önceki yılın en fazla {{emlak.sinirKat}} katına sınırlandığından matrah **{{emlak.o3.matrah}}** olur.

- Yıllık vergi: {{emlak.o3.matrah}} × {{emlak.isyeriBs}} = **{{emlak.o3.yillik}}**

## {{emlak.sinirYil}} yılına özgü artış sınırı

{{emlak.sinirYil}}, arsa ve arazi m² birim değerlerinin yeniden takdir edildiği yeni bir genel değer dönemidir. Bazı bölgelerde değerlerin aşırı yükselmesi üzerine 7566 sayılı Kanunla Emlak Vergisi Kanunu'nun geçici 23. maddesi düzenlendi: {{emlak.sinirYil}} yılı için hesaplanan bina, arsa ve arazi vergi değeri, {{emlak.sinirOncekiYil}} vergi değerinin iki kat fazlasını, yani Gelir İdaresi'nin 89 Seri No.lu Tebliğ'deki uygulamasıyla **en fazla {{emlak.sinirKat}} katını** geçemez. Aynı kanunla sonraki yıllarda vergi değeri, yeniden değerleme oranının yarısı yerine **tamamı** kadar artırılacak.

Belediyenin size bildirdiği değerin sınırı aşıp aşmadığını kontrol etmek için hesaplayıcıya {{emlak.sinirOncekiYil}} vergi değerini de girebilirsiniz.

## Emekli, engelli ve gazilere sıfır oran

Kanunun 8/2. maddesi ve buna dayanan Bakanlar Kurulu Kararı uyarınca aşağıdaki kişilerin, Türkiye genelinde **brüt 200 m²'yi geçmeyen tek konutu** için bina vergisi oranı **sıfırdır**:

- Sosyal güvenlik kurumlarından aylık alan emekliler (aylık dışında geliri olmayanlar),
- Hiçbir geliri olmayanlar,
- Engelliler, gaziler, şehitlerin dul ve yetimleri.

Konuta hisseli sahip olmak tek konut şartını bozmaz; ancak ikinci bir konut, işyeri kira geliri veya emekli aylığı dışında düzenli bir gelir varsa sıfır oran uygulanmaz. Muafiyet kendiliğinden işlemez: belediyeye dilekçe ve aylık belgesiyle başvurmak gerekir. Sıfır oran yalnızca konut için geçerlidir; arsa, arazi ve işyerinde vergi ödenir.

## Değerli konut vergisi

Belirli bir değerin üzerindeki konutlar için ayrıca **değerli konut vergisi** vardır. Bu vergi Gelir İdaresi'ne beyanla ödenir ve oranları farklıdır; bu hesaplayıcının kapsamında değildir.

## Sık yapılan hatalar

- **Piyasa değeriyle hesaplamak.** Vergi, satış fiyatı üzerinden değil belediyenin hesapladığı vergi değeri üzerinden alınır.
- **Büyükşehir oranını unutmak.** Büyükşehir ve mücavir alanlarda oranlar iki katıdır.
- **Muafiyet için başvurmamak.** Şartları taşısanız bile belediyeye başvurmadıkça vergi tahakkuk eder.
- **Hisse oranını hesaba katmamak.** Hisseli taşınmazda her malik yalnız kendi payı kadar vergi öder.

Taşınmaz alırken ödenecek harçları [tapu harcı hesaplama](/tapu-harci-hesaplama), kiradaki yasal artışı [kira artış hesaplama](/kira-artis-hesaplama) araçlarıyla hesaplayabilirsiniz.

## Yasal dayanak

- 1319 sayılı Emlak Vergisi Kanunu md. 8 (bina vergisi oranları ve sıfır oran), md. 18 (arazi vergisi), md. 30 (taksitler), geçici md. 23
- 7566 sayılı Kanun ve Emlak Vergisi Kanunu Genel Tebliği (Seri No: 89)
- 2006/11450 sayılı Bakanlar Kurulu Kararı (tek konutta sıfır oran)

<!-- sss -->

### {{yil}} emlak vergisi ne zaman ödenir?

Birinci taksit 1 Mart – 31 Mayıs, ikinci taksit 1 – 30 Kasım arasında ödenir. İki taksit eşittir; isterseniz tamamını Mayıs sonuna kadar ödeyebilirsiniz.

### Büyükşehirde konut emlak vergisi oranı nedir?

Büyükşehir belediyesi ve mücavir alan sınırları içindeki konutlarda oran {{emlak.konutBs}}, büyükşehir dışında {{emlak.konut}} olarak uygulanır.

### Emekliler emlak vergisi öder mi?

Emekli aylığı dışında geliri olmayan ve Türkiye genelinde brüt 200 m²'yi geçmeyen tek konutu bulunan emekliler bu konut için emlak vergisi ödemez. Belediyeye başvurarak sıfır orandan yararlanılır.

### Emlak vergisi değerimi nasıl öğrenirim?

Taşınmazın bulunduğu belediyenin internet sitesinden, e-Devlet'teki belediye hizmetlerinden ya da belediyenin emlak servisinden öğrenebilirsiniz. Değer, tahakkuk belgesinde de yazar.

### Hisseli taşınmazda emlak vergisini kim öder?

Her malik kendi hissesine düşen vergiyi öder. Örneğin yarı hisseli bir dairede her eş, vergi değerinin yarısı üzerinden vergilendirilir.

### {{emlak.sinirYil}} emlak vergisi artışı en fazla ne kadar olabilir?

{{emlak.sinirYil}} vergi değeri, {{emlak.sinirOncekiYil}} vergi değerinin en fazla {{emlak.sinirKat}} katı olabilir. Belediyenin hesapladığı değer bunu aşıyorsa vergi sınırlanmış değer üzerinden alınır.

### Emlak vergisi ödenmezse ne olur?

Süresinde ödenmeyen vergiye gecikme zammı uygulanır ve belediye 6183 sayılı Kanun uyarınca takip başlatır. Emlak vergisi borcu bulunan taşınmazın tapuda satışı da yapılamaz.
