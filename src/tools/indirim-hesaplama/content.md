## İndirim hesaplama nasıl yapılır?

İndirim, bir ürünün etiket fiyatından belirli bir oranın ya da tutarın düşülmesidir. Mağaza kampanyalarında, e-ticaret sepetlerinde, kupon ve kart indirimlerinde aynı temel formül geçerlidir. Bu araç üç soruyu cevaplar:

- **İndirimli fiyat:** Etiket fiyatı ve indirim oranı biliniyorsa ödeyeceğiniz tutar.
- **İndirim oranı:** Eski ve yeni fiyat biliniyorsa gerçek indirim yüzdesi.
- **Ardışık indirim:** Art arda uygulanan 2–3 indirimin (ör. "%30 + sepette %20") gerçek toplam etkisi.

## Formüller

### İndirimli fiyat

> **İndirim tutarı = Fiyat × Oran ÷ 100**
>
> **İndirimli fiyat = Fiyat × (1 − Oran ÷ 100)**

%15 indirimde etiket fiyatının %85'ini ödersiniz. Çarpanı akılda tutmak işi hızlandırır: %10 indirim için 0,90, %25 için 0,75, %40 için 0,60 ile çarpın.

### İndirim oranı

> **İndirim oranı = (Eski fiyat − Yeni fiyat) ÷ Eski fiyat × 100**

Bölme her zaman **eski** (indirimsiz) fiyata yapılır. Yeni fiyat eskisinden yüksekse sonuç bir indirim değil zamdır; hesaplayıcı bu durumda zam oranını gösterir ve uyarır.

### Ardışık indirim

Art arda gelen indirimler toplanmaz, **çarpılır**; çünkü her indirim bir öncekinin indirimli fiyatına uygulanır:

> **Etkin indirim = 1 − (1 − r₁) × (1 − r₂) × (1 − r₃)**

## Örnek hesaplamalar

### Örnek 1: %15 indirimli fiyat

Etiket fiyatı {{indirim.o1.fiyat}} olan bir ürüne %15 indirim uygulanırsa:

- İndirim tutarı: 1.250 × 0,15 = **{{indirim.o1.indirim}}**
- İndirimli fiyat: 1.250 × 0,85 = **{{indirim.o1.indirimli}}**

### Örnek 2: Gerçek indirim oranı

Bir ürünün fiyatı 1.500 TL'den 1.199 TL'ye düşmüş. İndirim tutarı {{indirim.o2.indirim}}, indirim oranı 301 ÷ 1.500 × 100 = **{{indirim.o2.oran}}**'dir. "%20 indirim" yazan bir etiketin doğru olup olmadığını bu şekilde kontrol edebilirsiniz.

### Örnek 3: %30 + %20 ≠ %50

1.000 TL'lik ürüne önce %30, ardından sepette %20 indirim uygulanıyor:

1. 1.000 × 0,70 = {{indirim.o3.ara}}
2. 700 × 0,80 = **{{indirim.o3.son}}**

Toplam indirim {{indirim.o3.indirim}}, yani etkin oran **{{indirim.o3.etkin}}**'tür; %50 olsaydı ürün 500 TL'ye düşerdi. Formülle: 1 − 0,70 × 0,80 = 0,44.

### Örnek 4: Üç kademeli indirim

2.000 TL'lik ürüne %50 + %20 + %10 uygulanırsa fiyat {{indirim.o4.ara1}} → {{indirim.o4.ara2}} → **{{indirim.o4.son}}** olur. Basit toplam %80 gibi görünse de gerçek indirim **{{indirim.o4.etkin}}**'tür.

## İndirimli fiyattan etiket fiyatını bulmak

Elinizde yalnızca indirimli fiyat ve oran varsa indirimsiz fiyatı bulmak için indirimli fiyat, ödenen orana bölünür:

> **Etiket fiyatı = İndirimli fiyat ÷ (1 − Oran ÷ 100)**

Örneğin %20 indirimle 640 TL'ye satılan ürünün etiket fiyatı 640 ÷ 0,80 = 800 TL'dir. İndirimli fiyata %20 eklemek (640 × 1,20 = 768 TL) yanlış sonuç verir, çünkü indirim 800 TL üzerinden yapılmıştır. Bulduğunuz değeri "İndirimli fiyat" moduyla kontrol edebilirsiniz.

## İndirimlerin sırası önemli mi?

Hayır. Çarpma işlemi sırayla değişmediğinden %30 + %20 ile %20 + %30 aynı son fiyatı verir. Ancak indirimlerden biri **tutar** olarak verilmişse (ör. "%20 + 100 TL kupon") sıra sonucu değiştirir: önce yüzde, sonra tutar uygulamak genellikle daha az indirim demektir. Kampanya koşullarında hangi indirimin önce uygulandığını kontrol edin.

## Kafadan indirim hesaplamanın pratik yolları

- **%10 indirim:** Fiyatın virgülünü bir basamak sola kaydırın ve fiyattan çıkarın: 340 TL → 34 TL indirim → 306 TL.
- **%25 indirim:** Fiyatın dörtte birini düşün; ödenecek tutar fiyatın dörtte üçüdür.
- **%50 indirim:** Fiyatın yarısı ödenir.
- **%20 indirim:** %10'un iki katını düşün ya da fiyatı 0,8 ile çarpın.
- **"2 al 1 öde" ve "3 al 2 öde":** Birim başına sırasıyla %50 ve yaklaşık %33,33 indirime denktir; "ikincisi %50" kampanyası ise iki üründe toplam %25 indirimdir.

Taksitli ve vade farklı satışlarda indirimi değerlendirirken peşin fiyatla toplam ödenecek tutarı karşılaştırın; "indirimli" taksitli fiyat, vade farkı eklendiğinde peşin fiyatın üzerine çıkabilir.

## Sık yapılan hatalar

- **İndirimleri toplamak:** "%40 + %10" kampanyası %50 değil, 1 − 0,60 × 0,90 = %46 indirimdir.
- **Yanlış fiyata bölmek:** İndirim oranı bulunurken fark, indirimli fiyata değil eski fiyata bölünür. 100 TL'den 80 TL'ye düşüş %20'dir; %25 değil.
- **Zam sonrası indirimi gerçek indirim sanmak:** Kampanyadan önce fiyatı artırılan bir üründe etiket indirimi yanıltıcı olabilir. Ürünün önceki dönemdeki fiyatını not alıp "İndirim oranı" moduyla gerçek indirimi hesaplayın.
- **Aynı oranla geri dönüleceğini sanmak:** %20 indirimli ürün %20 zamla eski fiyatına dönmez; bunun için %25 zam gerekir. Ayrıntısı için [yüzde hesaplama](/yuzde-hesaplama) aracına bakabilirsiniz.

## Etiket fiyatı ve tüketici hakları

Etikette veya rafta gösterilen fiyat ile kasada istenen fiyat farklıysa tüketici lehine olan fiyat uygulanır. İndirimli satışlarda ürünün indirimden önceki fiyatı da gösterilmelidir; yanıltıcı indirim reklamlarına karşı Ticaret Bakanlığı'na şikâyette bulunabilirsiniz. Fiyatın KDV dahil olup olmadığını ve KDV tutarını görmek için [KDV hesaplama](/kdv-hesaplama) aracını kullanabilirsiniz.

<!-- sss -->

### İndirimli fiyat nasıl hesaplanır?

Etiket fiyatı (1 − indirim oranı ÷ 100) ile çarpılır. Örneğin 1.250 TL'lik ürüne %15 indirim uygulanırsa 1.250 × 0,85 = 1.062,50 TL ödenir.

### İki fiyat arasındaki indirim oranı nasıl bulunur?

Eski fiyattan yeni fiyat çıkarılır, sonuç eski fiyata bölünür ve 100 ile çarpılır. 1.500 TL'den 1.199 TL'ye düşüş yaklaşık %20,07 indirimdir.

### %30 + %20 indirim toplam yüzde kaç eder?

%44 eder. İkinci indirim ilk indirimden sonra kalan fiyata uygulandığı için oranlar toplanmaz: 1 − 0,70 × 0,80 = 0,44. 1.000 TL'lik ürün 500 TL'ye değil 560 TL'ye düşer.

### Ardışık indirimlerde sıra fark eder mi?

Yalnızca yüzde indirimlerde fark etmez; %30 + %20 ile %20 + %30 aynı sonucu verir. Biri sabit tutar (ör. 100 TL kupon) ise uygulama sırası son fiyatı değiştirir.

### İndirim oranı %100'ü geçebilir mi?

Hayır. %100 indirim ürünün ücretsiz olması demektir; hesaplayıcı %100'ün üzerindeki oranları kabul etmez.

### Yeni fiyat eskisinden yüksek çıkarsa ne olur?

"İndirim oranı" modunda yeni fiyat eski fiyattan yüksekse sonuç zam olarak gösterilir ve uyarı verilir. Örneğin 100 TL'den 120 TL'ye geçiş %20'lik bir zamdır.

### Hesaplayıcı KDV'yi dikkate alıyor mu?

Hayır. İndirim, girdiğiniz fiyat üzerinden hesaplanır; Türkiye'de raf ve etiket fiyatları KDV dahil olduğundan sonuç da KDV dahil fiyattır. KDV tutarını ayırmak için KDV hesaplama aracını kullanın.
