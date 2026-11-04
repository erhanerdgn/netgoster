## Mevduat faizi nasıl hesaplanır?

Vadeli Türk lirası mevduatta bankanın ilan ettiği oran **yıllık brüt** faiz oranıdır. Paranız bir yıldan kısa süre hesapta kalsa da faiz, yıllık oranın gün sayısına oranlanmasıyla bulunur. Türk lirası mevduatta bankalar yılı **365 gün** kabul eder.

> **Brüt faiz = Anapara × Yıllık faiz oranı × Vade (gün) / 365**
>
> **Net faiz = Brüt faiz − Stopaj (brüt faiz × stopaj oranı)**
>
> **Vade sonu tutar = Anapara + Net faiz**

Faiz geliri üzerinden banka, kaynakta kesinti yoluyla gelir vergisi (stopaj) keser ve kalan net tutarı hesabınıza yatırır. Bu vergi nihai vergidir; ayrıca beyanname vermeniz gerekmez.

## {{yil}} mevduat stopaj oranları

Stopaj oranı Gelir Vergisi Kanunu geçici 67. maddeye dayanan Cumhurbaşkanı Kararlarıyla belirlenir ve **vadeye göre** değişir. Hangi oranın uygulanacağını, hesabın **açıldığı veya vadesinin yenilendiği tarih** belirler: oran sonradan değişse bile mevcut vade sonuna kadar açılıştaki oran geçerlidir.

| Vade | TL mevduat stopajı |
| --- | --- |
| Vadesiz ve 6 aya kadar vadeli (6 ay dahil) | {{stopaj.alti6}} |
| 1 yıla kadar vadeli (1 yıl dahil) | {{stopaj.yil1}} |
| 1 yıldan uzun vadeli | {{stopaj.uzun}} |
| Döviz tevdiat hesapları (bilgi için) | {{stopaj.doviz}} |

Kararname dilimleri gün değil **ay** cinsinden tanımlar. Hesaplayıcımız bu yüzden vade sonu tarihini açılış tarihinden 6 ve 12 takvim ayı sonrasıyla karşılaştırır. Örneğin 4 Kasım'da açılan 181 günlük hesap 4 Mayıs'ta, yani tam 6 ayda biter ve "6 aya kadar" dilimine girer; 182 günlük hesap ise "1 yıla kadar" dilimine geçer. Ayların gün sayısı farklı olduğundan bu sınır 181 ile 184 gün arasında değişebilir. Kesin dilimi bankanızın hesap cüzdanından teyit edin.

Geçmiş bir açılış tarihi girerseniz hesaplayıcı o dönemde geçerli oranı otomatik kullanır.

## Örnek hesaplamalar

### Örnek 1: 100.000 TL, yıllık %40, 32 gün

- Brüt faiz: 100.000 × 0,40 × 32 / 365 = **{{mevduat.o1.brutFaiz}}**
- Stopaj ({{mevduat.o1.stopajOran}}): {{mevduat.o1.stopaj}}
- Net faiz: **{{mevduat.o1.netFaiz}}**
- Vade sonu tutar: {{mevduat.o1.vadeSonuTutar}}
- Net yıllık getiri: {{mevduat.o1.netYillik}}

### Örnek 2: 500.000 TL, yıllık %38, 365 gün

Bir yıllık vade "1 yıla kadar" dilimindedir.

- Brüt faiz: 500.000 × 0,38 = **{{mevduat.o2.brutFaiz}}**
- Stopaj ({{mevduat.o2.stopajOran}}): {{mevduat.o2.stopaj}}
- Net faiz: **{{mevduat.o2.netFaiz}}** (net yıllık getiri {{mevduat.o2.netYillik}})

### Örnek 3: Yenilemeli kısa vade mi, tek seferde 1 yıl mı?

100.000 TL'yi yıllık %40 ile 92 günlük vadeye bağlayıp her vade sonunda faiziyle birlikte 4 kez yenilerseniz:

- İlk dönem net faizi: {{mevduat.o3.netFaiz}}
- 4 dönem sonunda bakiye: **{{mevduat.o3.sonBakiye}}** (toplam net faiz {{mevduat.o3.toplamNetFaiz}})
- Bileşik net yıllık getiri: {{mevduat.o3.efektif}}

Aynı oranla 365 günlük tek vadede ise net faiz {{mevduat.o4.netFaiz}} olur. Kısa vadede stopaj daha yüksek olsa da faizin faiz kazanması (bileşik etki) çoğu zaman bu farkı kapatır. Ancak yenilemede bankanın o günkü oranı uygulanır; oranlar düşerse avantaj kaybolabilir.

## Faiz oranını neler belirler?

Bankaların mevduata verdiği faiz, büyük ölçüde Türkiye Cumhuriyet Merkez Bankası'nın politika faizine ve bankanın kaynak ihtiyacına bağlıdır. Aynı bankada bile oran; tutar kademesine, vadeye, hesabın yeni müşteriye özel ("hoş geldin faizi") olup olmadığına ve kanala (şube veya mobil) göre değişebilir. Bu nedenle teklifleri karşılaştırırken yalnızca ilan edilen en yüksek orana değil, oranın hangi tutar ve vade için geçerli olduğuna ve kaç gün sürdüğüne bakın.

Vadesiz hesaplarda genellikle faiz ödenmez veya çok düşük oran uygulanır; vadesiz hesaba faiz işlerse stopaj oranı "6 aya kadar" dilimiyle aynıdır. Günlük faizli (getirili) hesaplarda faiz her gün işler ancak oranlar vadeli hesaba göre daha düşüktür; hesaplayıcıya vadeyi 1 gün girerek günlük getiriyi de görebilirsiniz.

## Net getiri ve enflasyon

Net yıllık getiri oranı, farklı vadeleri karşılaştırmanın en pratik yoludur: net faizin anaparaya oranının yıla çevrilmiş hâlidir. Paranızın alım gücünü koruyup korumadığını görmek için bu oranı yıllık enflasyonla karşılaştırın; son açıklanan yıllık TÜFE {{tufe.yillik}} ({{tufe.sonAy}}). Net getiri enflasyonun altındaysa reel olarak kayıp yaşarsınız.

## Sık yapılan hatalar

- **Brüt faizi kazanç sanmak.** Bankanın ilan ettiği oran stopaj öncesidir; elinize geçen getiri {{stopaj.alti6}} veya {{stopaj.yil1}} oranında daha düşüktür.
- **Yıllık oranı vadeye oranlamamak.** 32 günlük hesapta %40 faiz, paranızın %40 artacağı anlamına gelmez; yalnızca 32/365'i kadar faiz işler.
- **360 gün esasıyla hesaplamak.** Döviz hesaplarında bazı bankalar 360 gün kullanır; TL mevduatta esas 365 gündür.
- **Vade bozmayı hesaba katmamak.** Vade dolmadan para çekilirse faiz genellikle kaybedilir veya çok düşük orandan ödenir.
- **Stopajın sonraki değişikliklerden etkileneceğini düşünmek.** Oran, açılış/yenileme anında sabitlenir.

Kredi kullanmayı düşünüyorsanız maliyeti [kredi hesaplama](/kredi-hesaplama) aracıyla karşılaştırabilirsiniz.

## Yasal dayanak

- 193 sayılı Gelir Vergisi Kanunu geçici 67. madde (mevduat faizlerinde tevkifat)
- 2006/10731 sayılı Bakanlar Kurulu Kararı ve değişiklikleri (vadeye göre oranlar)
- 10041 sayılı Cumhurbaşkanı Kararı (09.07.2025'ten itibaren açılan/yenilenen TL hesaplar) ve süre uzatan 11444 sayılı Karar
- Tasarruf Mevduatı Sigorta Fonu: kişi başına bankada belirli tutara kadar mevduat güvence altındadır

<!-- sss -->

### Mevduat faizinden ne kadar stopaj kesilir?

Bugün açılan TL vadeli hesaplarda 6 aya kadar vadede {{stopaj.alti6}}, 1 yıla kadar vadede {{stopaj.yil1}}, 1 yıldan uzun vadede {{stopaj.uzun}} stopaj uygulanır. Oran, hesabın açılış veya yenileme tarihine göre belirlenir.

### 32 günlük mevduatta faiz nasıl hesaplanır?

Anapara yıllık brüt oranla ve 32/365 ile çarpılır, çıkan brüt faizden stopaj düşülür. Örneğin 100.000 TL, %40 oranla 32 günde {{mevduat.o1.netFaiz}} net faiz getirir.

### Stopaj oranı değişirse mevcut hesabım etkilenir mi?

Hayır. Stopaj, hesabın açıldığı veya son yenilendiği tarihte geçerli orandan kesilir. Yeni oran, vadenizin bir sonraki yenilenmesinden itibaren uygulanır.

### Mevduat faizi için beyanname vermem gerekir mi?

TL mevduat faizinde banka tarafından yapılan stopaj nihai vergidir; tutar ne olursa olsun ayrıca beyanname verilmez.

### 181 gün mü 182 gün mü 6 aya kadar sayılır?

Kararname "6 aya kadar" ifadesini kullanır; dilim takvim ayıyla belirlenir. Vade sonu açılıştan tam 6 ay sonrasını geçmiyorsa hesap {{stopaj.alti6}} oranlı "6 aya kadar" dilimindedir; bir gün bile geçerse {{stopaj.yil1}} oranlı "1 yıla kadar" dilimine girer. Ayların uzunluğuna göre bu sınır 181–184 gün arasında değişir; bankanızdan teyit edin.

### Vade sonunda yenilemek mi, uzun vade mi daha kazançlı?

Kısa vadeyi yenilemek bileşik getiri sağlar, ancak daha yüksek stopaj ödenir ve yenilemede faiz oranı değişebilir. Oranların düşmesi beklenen dönemlerde uzun vade getiriyi sabitler. Hesaplayıcıdaki "vade sonunda yenile" seçeneğiyle iki yolu karşılaştırabilirsiniz.

### Net yıllık getiri oranı ne işe yarar?

Farklı vade ve oranlardaki teklifleri aynı ölçüye getirir: stopaj sonrası kazancınızın yıllık yüzdesini gösterir. Bu oranı enflasyonla karşılaştırarak reel getirinizi değerlendirebilirsiniz.
