## Netten brüte hesaplama ne işe yarar?

İş görüşmelerinde çoğu zaman "elime kaç geçecek" sorusu konuşulur, ama iş sözleşmesine ve bordroya **brüt ücret** yazılır. Netten brüte hesaplama, hedeflediğiniz net maaşı sağlamak için işverenin sözleşmeye yazması gereken brüt tutarı bulur. Kıdem ve ihbar tazminatı, işsizlik maaşı ve işveren maliyeti de brüt ücretten hesaplandığı için netinizi bilip brütünüzü bilmiyorsanız bu araç ilk adımdır.

## Neden basit bir oranla bulunamaz?

Brütten nete giderken kesintiler tek tek hesaplanabilir; tersi ise doğrudan bir formülle çözülemez. Çünkü:

- Gelir vergisi **kümülatif matraha** göre dilimli artar ({{gv.oran1}}, {{gv.oran2}}, {{gv.oran3}}…). Aynı neti korumak için gereken brüt, yıl ilerledikçe yükselir.
- **Asgari ücret istisnası** her ay vergiden düşülür ve kendi içinde de Temmuz'dan itibaren artar.
- SGK ve işsizlik primi ({{sgk.isciToplam}}) prime esas kazancın üst sınırında ({{sgk.tavan}}) sabitlenir.
- Damga vergisi ({{damga.oran}}) asgari ücretin damga vergisi kadar istisnalıdır.

Bu yüzden "neti 1,4 ile çarp" gibi pratik kurallar yalnız belirli bir ücret düzeyi ve ay için kabaca doğru sonuç verir.

## Hesaplayıcı nasıl çalışır?

Araç her ay için **ikili arama (binary search)** yöntemiyle, o ayın bordrosu hedef netinizi verecek en küçük brütü kuruş hassasiyetinde bulur:

1. Ocak ayı için alt ve üst sınır arasında bir brüt denenir; bu brütün bordrosu (SGK, işsizlik, kümülatif gelir vergisi, istisnalar, damga vergisi) tam olarak hesaplanır.
2. Ortaya çıkan net hedefin altındaysa brüt artırılır, üstündeyse azaltılır; aralık her adımda yarıya iner.
3. Bulunan brütün GV matrahı kümülatife eklenir ve aynı işlem Şubat için tekrarlanır. Böylece 12 ayın her biri için ayrı brüt elde edilir.

Yuvarlama nedeniyle bazı aylarda net, hedeften 1 kuruş fazla çıkabilir; araç her zaman hedefi karşılayan en düşük brütü seçer.

### Tek ay için yaklaşık formül

Dilim değişmeyen bir ayda formül şu şekilde kurulabilir (B = brüt, r = vergi oranı, İ = o ayın GV istisnası, D = DV istisnası):

> **Net = B × (1 − {{sgk.isciToplam}}) − [B × (1 − {{sgk.isciToplam}}) × r − İ] − [B × {{damga.oran}} − D]**

Bu denklemden B çekilerek o ayın brütü bulunur. Hesaplayıcı aynı işlemi dilim geçişlerini de hesaba katarak sayısal olarak yapar.

## Örnek hesaplamalar

### Örnek 1: Her ay 40.000 TL net

- Ocak'ta gereken brüt: **{{nb.ornek1.ocak.brut}}** (gelir vergisi {{nb.ornek1.ocak.gv}}, damga vergisi {{nb.ornek1.ocak.dv}})
- Aralık'ta gereken brüt: **{{nb.ornek1.aralik.brut}}** (kümülatif matrah {{nb.ornek1.aralik.kumMatrah}}, gelir vergisi {{nb.ornek1.aralik.gv}})
- Yıllık toplam brüt {{nb.ornek1.yillik.brut}}, aylık ortalama {{nb.ornek1.ortalamaBrut}}

Görüldüğü gibi yılın sonunda aynı net için Ocak'a göre belirgin şekilde daha yüksek brüt gerekir. Sözleşmede tek bir brüt yazacaksanız, Ocak brütü yerine **ortalama brütü** konuşmak yıl sonunda netinizin düşmesini önler.

### Örnek 2: Asgari ücretin neti

Net {{asgari.net}} hedefi için gereken brüt her ay **{{nb.ornek2.ocak.brut}}**'dir, yani tam olarak brüt asgari ücret. Asgari ücrette gelir ve damga vergisi istisna ile sıfırlandığından tek kesinti {{nb.ornek2.ocak.sgkIsci}} SGK ve {{nb.ornek2.ocak.issizlikIsci}} işsizlik primidir.

### Örnek 3: Her ay 100.000 TL net

- Ocak brütü: **{{nb.ornek3.ocak.brut}}**
- Aralık brütü: **{{nb.ornek3.aralik.brut}}**
- Yıllık toplam brüt: {{nb.ornek3.yillik.brut}}, ortalama {{nb.ornek3.ortalamaBrut}}

Yüksek ücretlerde kümülatif matrah {{gv.dilim3}} sınırını da aşabildiği için yıl sonuna doğru {{gv.oran4}} dilimine girilir ve brüt farkı daha da açılır.

## Maaş pazarlığında dikkat edilecekler

- **"Net" anlaşmanın sözleşmeye nasıl yazılacağını netleştirin.** Bazı işverenler "her ay sabit net" öder ve vergi artışını kendisi üstlenir; bazıları sabit brüt yazar ve yıl sonunda netiniz azalır.
- **Yan hakları ayrı konuşun.** Yemek kartı, yol yardımı ve prim gibi ödemelerin vergilendirilmesi farklıdır; sabit maaşa eklenirse brüt hesabı değişir.
- **İşverenin maliyetini bilin.** Bulunan brüt üzerine SGK işveren payı ({{sgk.isveren}}) ve işsizlik işveren payı ({{sgk.isverenIssizlik}}) eklenir. Toplam maliyeti [işveren maliyeti hesaplama](/isveren-maliyeti-hesaplama) aracıyla görebilirsiniz.
- **Yıl ortası işe girişte matrah devrini unutmayın.** Aynı yıl içinde önceki işverenden gelen matrah yeni bordroya eklenirse ilk aylardan itibaren daha yüksek dilim uygulanır.

## Sık yapılan hatalar

- **Ocak brütünü tüm yıl için kullanmak.** Yılın ikinci yarısında net hedefin altına düşer.
- **Brütten nete oranını tersine çevirmek.** %75 net oran varsayıp 1/0,75 ile çarpmak dilim ve istisna etkisini yok sayar.
- **Tavanı hesaba katmamak.** {{sgk.tavan}} üzerindeki brütlerde SGK kesintisi artmaz; basit oran bu durumda brütü olduğundan yüksek gösterir.
- **Asgari ücretin altındaki netler.** Tam zamanlı çalışanın brütü asgari ücretten ({{asgari.brut}}) düşük olamaz; daha düşük netler yalnız kısmi süreli çalışmada anlamlıdır.

Sonucu doğrulamak için bulduğunuz brütü [brütten nete maaş hesaplama](/brutten-nete-maas-hesaplama) aracına girebilirsiniz; aynı aylık netleri görmeniz gerekir. Güncel asgari ücret dökümü [asgari ücret hesaplama](/asgari-ucret-hesaplama) sayfasındadır.

## Yasal dayanak

- 193 sayılı Gelir Vergisi Kanunu md. 23/18, 63 ve 103
- 5510 sayılı Kanun md. 81–82; 4447 sayılı Kanun md. 49
- 488 sayılı Damga Vergisi Kanunu, (1) sayılı tablo IV-1-b

<!-- sss -->

### Net 40.000 TL maaşın brütü ne kadar?

{{yil}} yılı için Ocak ayında {{nb.ornek1.ocak.brut}}, Aralık ayında {{nb.ornek1.aralik.brut}} brüt gerekir. Yıl boyunca her ay aynı neti almak için ortalama brüt {{nb.ornek1.ortalamaBrut}}'dir.

### Net asgari ücretin brütü nedir?

Net {{asgari.net}} için gereken brüt {{asgari.brut}}'dir. Asgari ücret gelir ve damga vergisinden istisna olduğu için her ay aynıdır.

### Neden her ay farklı brüt çıkıyor?

Gelir vergisi yıl içinde biriken kümülatif matraha göre hesaplanır. Matrah üst dilime geçtikçe kesinti artar ve aynı neti korumak için daha yüksek brüt gerekir.

### Hesaplama ne kadar hassas?

Brüt, kuruş hassasiyetinde ikili aramayla bulunur. Bulunan brütle yapılan bordro hesabında net, hedefe eşit ya da en fazla 1 kuruş fazladır.

### İşveren "net maaş" ödüyorsa vergiyi kim öder?

Net ücret anlaşmasında vergi artışlarının farkını işveren üstlenir; bordroda her ay brüt yeniden hesaplanır. Bu durumda işverenin toplam maliyeti yıl içinde artar.

### Engellilik indirimi veya özel sigorta hesaba katılıyor mu?

Hayır. Hesaplayıcı yalnız yasal kesintileri (SGK, işsizlik, gelir ve damga vergisi) dikkate alır. Engellilik indirimi, BES veya sigorta primi indirimi varsa gereken brüt daha düşük çıkar.
