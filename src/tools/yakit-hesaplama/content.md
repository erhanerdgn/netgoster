## Yakıt masrafı nasıl hesaplanır?

Bir yolculuğun yakıt maliyetini bulmak için üç bilgi yeterlidir: gidilecek **mesafe**, aracın **100 kilometrede tükettiği yakıt** ve yakıtın **litre fiyatı**. Hesaplayıcı bu üç değeri kullanarak toplam litreyi, toplam tutarı, kilometre başına maliyeti ve isterseniz kişi başına düşen payı tek adımda gösterir. Yöntem benzin, motorin ve LPG için aynıdır; yalnızca ilgili yakıtın tüketim değerini ve litre fiyatını girmeniz gerekir.

Türkiye'de araç tüketimi, Avrupa'daki uygulamaya uygun olarak **litre/100 km** cinsinden ifade edilir. "6,5 litre yakıyor" denildiğinde kastedilen, aracın 100 kilometrede ortalama 6,5 litre yakıt harcamasıdır.

## Formül

> **Toplam mesafe = Tek yön mesafe × (gidiş-dönüş ise 2, değilse 1)**
>
> **Harcanacak yakıt (L) = Toplam mesafe × 100 km'deki tüketim ÷ 100**
>
> **Toplam masraf = Harcanacak yakıt × Litre fiyatı**
>
> **Kilometre başı maliyet = Toplam masraf ÷ Toplam mesafe**
>
> **Kişi başı pay = Toplam masraf ÷ Kişi sayısı**

Hesaplayıcı, toplam tutarı yuvarlanmamış litre değerinden hesaplar ve sonucu kuruşa yuvarlar. Böylece ara adımlardaki yuvarlamalar sonucu bozmaz.

## Örnek hesaplamalar

Aşağıdaki örneklerde kullanılan yakıt fiyatları yalnızca hesaplamayı göstermek içindir; güncel pompa fiyatı ile kendi hesabınızı yapın.

### Örnek 1: Tatile gidiş-dönüş, masraf üç kişiye bölünüyor

Tek yön 450 km uzaklıktaki bir tatil yerine, 100 km'de 6,5 litre yakan bir otomobille gidip dönülecek. Yakıtın litresi 50 TL ve masraf üç arkadaş arasında paylaşılacak.

- Toplam mesafe: 450 × 2 = {{yakit.ornek1.km}} km
- Harcanacak yakıt: {{yakit.ornek1.km}} × 6,5 ÷ 100 = {{yakit.ornek1.l}} litre
- Toplam masraf: {{yakit.ornek1.l}} × 50 = **{{yakit.ornek1.tutar}}**
- Kilometre başı: **{{yakit.ornek1.kmBasi}}**
- Kişi başı: **{{yakit.ornek1.kisiBasi}}**

### Örnek 2 ve 3: Benzinli ile LPG'li aracı karşılaştırmak

1.000 km'lik bir yol için iki seçeneği karşılaştıralım. Benzinli araç 100 km'de 5 litre yakıyor ve benzinin litresi 52 TL. LPG'li araç 100 km'de 9 litre LPG yakıyor ve LPG'nin litresi 27 TL.

| | Benzinli | LPG'li |
| --- | --- | --- |
| Yakıt miktarı | {{yakit.ornek2.l}} L | {{yakit.ornek3.l}} L |
| Toplam masraf | {{yakit.ornek2.tutar}} | {{yakit.ornek3.tutar}} |
| Kilometre başı | {{yakit.ornek2.kmBasi}} | {{yakit.ornek3.kmBasi}} |

LPG'li araç litre olarak daha fazla yakıt harcasa da litre fiyatı düşük olduğu için kilometre başı maliyet farklı çıkar. Karşılaştırma yaparken mutlaka **kilometre başı maliyete** bakın; yalnızca litre tüketimine bakmak yanıltıcıdır.

## 100 km'deki tüketimi nasıl öğrenirim?

En güvenilir yöntem **depo doldurma yöntemidir**:

1. Depoyu tamamen doldurun ve kilometre sayacını sıfırlayın.
2. Her zamanki gibi en az birkaç yüz kilometre yol yapın.
3. Depoyu yeniden tamamen doldurun ve aldığınız litreyi not edin.
4. Aldığınız litreyi gidilen kilometreye bölüp 100 ile çarpın.

Örneğin 600 km sonra depoya 39 litre yakıt aldıysanız tüketiminiz 39 ÷ 600 × 100 = 6,5 litre/100 km'dir. Yol bilgisayarlarının gösterdiği ortalama da iyi bir yaklaşımdır, ancak çoğu zaman gerçeğinden biraz düşük gösterir.

Katalogda yer alan **WLTP karma tüketim** değeri, standart test koşullarında ölçülür. Gerçek hayatta tüketim; hız, trafik yoğunluğu, araçtaki yük, klima kullanımı, lastik basıncı, rüzgâr ve yol eğimine göre bu değerin üzerine çıkabilir. Uzun bir otoyol yolculuğunda karma değer, şehir içinde ise şehir içi değer daha gerçekçidir.

## Kilometre başı maliyet ne işe yarar?

Kilometre başı maliyet, farklı yolculukları ve araçları aynı ölçüyle karşılaştırmanızı sağlar. İş seyahatlerinde şirketten yakıt bedeli talep ederken, ortak kullanılan bir aracın masrafını kullanım mesafesine göre bölüştürürken veya toplu taşıma, uçak ve otobüs bileti ile kendi aracınızla gitmenin maliyetini kıyaslarken bu değeri kullanabilirsiniz. Örneğin kilometre başı maliyeti bildiğiniz bir araçla 300 km'lik bir yolun yakıt bedelini, bu değeri 300 ile çarparak hızlıca tahmin edebilirsiniz.

## Sık yapılan hatalar

- **Dönüş yolunu unutmak.** Masraf paylaşımında en sık hata, yalnızca gidiş mesafesinin hesaplanmasıdır. Gidiş-dönüş anahtarını açmayı unutmayın.
- **Litre/100 km ile km/litreyi karıştırmak.** "Litreyle 15 km gidiyor" diyorsanız tüketiminiz 100 ÷ 15 ≈ 6,67 litre/100 km'dir. Hesaplayıcıya bu değeri girin.
- **Eski yakıt fiyatını kullanmak.** Akaryakıt fiyatları sık değişir ve illere göre farklılık gösterir. Hesaplamadan önce güzergâhınızdaki istasyonun pompa fiyatını kontrol edin.
- **Yalnızca yakıtı hesaba katmak.** Otoyol ve köprü geçiş ücretleri, otopark ve araç yıpranması bu hesaba dahil değildir. Aracın yıllık sabit giderleri için [MTV hesaplama](/mtv-hesaplama) aracına bakabilirsiniz.
- **Kişi başı payı yuvarlamadan bölmek.** Toplam tutar kişi sayısına tam bölünmüyorsa kişi başı pay kuruşa yuvarlanır; birkaç kuruşluk farkı aranızda tamamlamanız gerekebilir.

## Yakıt tasarrufu için ipuçları

Sabit ve makul hızda gitmek, ani hızlanma ve frenlemeden kaçınmak tüketimi belirgin şekilde azaltır. Lastik basıncını üreticinin önerdiği değerde tutmak, gereksiz yükü araçtan çıkarmak ve tavan bagajını kullanılmadığında sökmek de tasarruf sağlar. Yüksek hızda hava direnci hızla arttığı için, aynı yolu biraz daha düşük hızla gitmek çoğu zaman kayda değer bir fark yaratır. Farklı senaryolardaki maliyet değişimini yüzde olarak görmek için [yüzde hesaplama](/yuzde-hesaplama) aracını kullanabilirsiniz.

<!-- sss -->

### 100 km'de 7 litre yakan araç 1 km'de ne kadar yakar?

1 km'de 7 ÷ 100 = 0,07 litre yakar. Bu değeri litre fiyatıyla çarparak kilometre başı maliyeti bulabilirsiniz.

### Gidiş-dönüş yakıt masrafı nasıl hesaplanır?

Tek yön mesafe iki ile çarpılır, ardından toplam mesafe tüketimle çarpılıp 100'e bölünür ve litre fiyatıyla çarpılır. Hesaplayıcıda gidiş-dönüş anahtarını açmanız yeterlidir.

### Km/litre değerini litre/100 km'ye nasıl çeviririm?

100'ü km/litre değerine bölün. Örneğin litreyle 20 km giden bir araç 100 ÷ 20 = 5 litre/100 km yakar.

### Yol masrafı kişi başı nasıl paylaştırılır?

Toplam yakıt masrafı, sürücü dahil yolculuktaki kişi sayısına bölünür. Otoyol ve köprü ücretleri varsa bunları da toplama ekleyip aynı şekilde bölebilirsiniz.

### Hesaplayıcı yakıt fiyatını otomatik getiriyor mu?

Hayır. Akaryakıt fiyatları il, ilçe ve dağıtım şirketine göre değiştiği ve gün içinde güncellenebildiği için fiyatı sizin girmeniz daha doğru sonuç verir.

### Elektrikli araçlar için bu hesaplayıcı kullanılabilir mi?

Mantık aynıdır: tüketim alanına 100 km'deki kWh değerini, fiyat alanına kWh başına şarj ücretini girerseniz toplam şarj maliyetini bulursunuz. Litre birimleri bu durumda kWh olarak okunmalıdır.
