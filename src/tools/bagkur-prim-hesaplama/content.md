## Bağkur primi nedir?

Bağkur primi, 5510 sayılı Kanun'un 4. maddesinin birinci fıkrasının (b) bendi kapsamındaki sigortalıların, yani **kendi adına bağımsız çalışanların** her ay ödediği sosyal güvenlik primidir. Esnaf ve sanatkârlar, şirket ortakları, serbest meslek mensupları (avukat, mali müşavir, doktor vb.) ve tarımda kendi hesabına çalışanlar bu gruptadır. Ücretli çalışanlarda primi işveren bordrodan keser ve öder; Bağkur'lu ise primini **kendisi öder**.

Prim; malullük, yaşlılık ve ölüm sigortası, genel sağlık sigortası ve kısa vadeli sigorta kollarının toplamından oluşur. {{yil}} yılında toplam oran **{{bagkur.oran}}**, borcu olmayanlar için uygulanan indirimli oran ise **{{bagkur.indirimli}}**'dir.

## Bağkur primi nasıl hesaplanır?

Hesaplama tek adımlıdır: beyan ettiğiniz **prime esas kazanç (PEK)** prim oranıyla çarpılır.

> **Aylık prim = Prime esas kazanç × Prim oranı**
>
> **Yıllık prim = Aylık prim × 12**

Prime esas kazancı siz seçersiniz; ancak seçtiğiniz tutar yasal sınırlar içinde kalmalıdır:

| {{yil}} | Prime esas kazanç | Aylık prim ({{bagkur.oran}}) | İndirimli prim ({{bagkur.indirimli}}) |
| --- | --- | --- | --- |
| Asgari (alt sınır) | {{sgk.taban}} | {{bk.alt.aylikIndirimsiz}} | {{bk.alt.aylikIndirimli}} |
| Azami (üst sınır) | {{sgk.tavan}} | {{bk.ust.aylikIndirimsiz}} | {{bk.ust.aylikIndirimli}} |

Alt sınır asgari ücretin brüt tutarına, üst sınır ise kanunla belirlenen katına eşittir ve her yıl başında güncellenir. Hesaplayıcımız girdiğiniz tutarın bu aralıkta olup olmadığını kontrol eder; dışındaysa uyarır.

## 5 puanlık prim indirimi

Hazine, vadesi geçmiş prim borcu bulunmayan 4/b sigortalılarının primindeki **5 puanı** karşılar (5510 sayılı Kanun md. 81/i). Bu nedenle borcu olmayan bir Bağkur'lu {{bagkur.oran}} yerine {{bagkur.indirimli}} öder. İndirimden yararlanmak için:

- Primlerin **yasal süresi içinde** ödenmesi,
- Geçmişe ait **vadesi geçmiş prim, gecikme cezası ve zammı borcunun** bulunmaması (ya da yapılandırılmış borçların taksitlerinin aksatılmaması) gerekir.

Bir ay bile geç ödendiğinde o ayın indirimi kaybedilebilir. Hesaplayıcıdaki "Vadesi geçmiş prim borcum yok" anahtarını kapatarak indirimsiz tutarı ve kaybedeceğiniz farkı görebilirsiniz.

## Örnek hesaplamalar

### Örnek 1: Alt sınırdan ödeme

En yaygın tercih, primi asgari kazanç üzerinden ödemektir. {{sgk.taban}} beyan eden bir esnaf için:

- İndirimsiz aylık prim: **{{bk.alt.aylikIndirimsiz}}**
- İndirimli aylık prim: **{{bk.alt.aylikIndirimli}}**
- Yıllık indirimli toplam: {{bk.alt.yillikIndirimli}} (indirimsiz: {{bk.alt.yillikIndirimsiz}})
- Yıllık indirim kazancı: {{bk.alt.yillikFark}}

### Örnek 2: Asgari kazancın iki katı

Emekli aylığını yükseltmek isteyen bir serbest meslek mensubu, prime esas kazancını {{bk.iki.kazanc}} olarak beyan etsin:

- İndirimli aylık prim: **{{bk.iki.aylikIndirimli}}**
- Yıllık indirimli toplam: **{{bk.iki.yillikIndirimli}}**
- Aylık indirim tutarı: {{bk.iki.aylikFark}}

### Örnek 3: Üst sınırdan ödeme

Azami kazanç ({{sgk.tavan}}) üzerinden prim ödenirse aylık indirimli prim **{{bk.ust.aylikIndirimli}}**, yıllık toplam ise **{{bk.ust.yillikIndirimli}}** olur. Üst sınırın üzerinde bir kazanç beyan edilemez.

## Hesaplayıcı nasıl kullanılır?

1. **Prime esas aylık kazancınızı** girin. Alan açılışta asgari kazançla doludur; daha yüksek bir basamak seçecekseniz tutarı yazmanız yeterlidir.
2. **Prim borcu durumunuzu** seçin. Vadesi geçmiş borcunuz yoksa anahtar açık kalsın; borç varsa kapatın.
3. Sonuç kartında seçtiğiniz duruma göre **aylık ve yıllık prim** görünür. Altındaki karşılaştırma tablosu, indirimli ve indirimsiz tutarları ve aradaki farkı aylık ile yıllık olarak gösterir.

Sonuç bağlantısını kopyalayarak mali müşavirinizle paylaşabilir veya yazdırabilirsiniz. Hesaplama, bugünün tarihinde geçerli asgari-azami kazanç ve prim oranlarıyla yapılır; yeni yıl parametreleri yayımlandığında tutarlar kendiliğinden güncellenir.

## Hangi kazancı beyan etmeliyim?

Yüksek kazanç beyanı bugünkü prim yükünü artırır ama **emekli aylığını** da yükseltir; çünkü aylık bağlama oranı, sigortalılık süresince prime esas kazançların güncellenmiş ortalamasına uygulanır. Kısa vadede nakit akışı önemliyse alt sınır, uzun vadede daha yüksek aylık hedefleniyorsa daha yüksek bir basamak tercih edilebilir. Ne zaman emekli olabileceğinizi [emeklilik hesaplama](/emeklilik-hesaplama) aracıyla öğrenebilirsiniz.

Beyan değişikliği için SGK'ya (e-Devlet veya il/ilçe müdürlüğü) başvurmanız gerekir; yeni tutar başvurudan sonraki dönemlere uygulanır, geçmiş aylar için değişiklik yapılamaz.

## Ödeme zamanı

4/b primleri aylık olarak tahakkuk eder ve **ilgili ayın son gününe kadar** ödenir. Ödemeler banka, e-Devlet veya kredi kartıyla yapılabilir. Süresinde ödenmeyen prime gecikme cezası ve gecikme zammı eklenir; ayrıca prim borcu birikmiş sigortalının genel sağlık sigortası hizmetlerinden yararlanması kısıtlanabilir.

## Sık yapılan hatalar

- **İndirimli oranı her durumda varsaymak.** Vadesi geçmiş tek bir borç bile 5 puanlık indirimin kaybına yol açabilir; bütçeyi indirimsiz tutara göre yapmak daha güvenlidir.
- **Eski yılın sınırlarını kullanmak.** Alt ve üst sınır her Ocak'ta değişir; geçen yılın tutarıyla yapılan ödeme eksik kalır.
- **4/a primiyle karıştırmak.** İşçi ve işveren paylarının ayrı hesaplandığı ücretli çalışan primleri farklıdır; bunun için [işveren maliyeti hesaplama](/isveren-maliyeti-hesaplama) aracını kullanın.
- **Yıllık tutarı sabit sanmak.** Yıl ortasında beyan değişirse yıllık toplam da değişir; hesaplayıcı yıl boyunca aynı kazanç varsayar.

## Yasal dayanak

- 5510 sayılı Sosyal Sigortalar ve Genel Sağlık Sigortası Kanunu md. 4/1-b (kapsam), md. 80 ve 82 (prime esas kazanç sınırları), md. 81 (prim oranları ve 5 puanlık indirim)
- SGK genelgeleri (yıllık asgari/azami kazanç tutarları)

<!-- sss -->

### {{yil}} Bağkur primi en az ne kadar?

Asgari prime esas kazanç olan {{sgk.taban}} üzerinden indirimsiz aylık prim {{bk.alt.aylikIndirimsiz}}, prim borcu olmayanlar için indirimli aylık prim {{bk.alt.aylikIndirimli}}'dir.

### Bağkur prim oranı yüzde kaç?

{{yil}} yılında toplam 4/b prim oranı {{bagkur.oran}}'dir. Vadesi geçmiş borcu olmayan sigortalılar için Hazine 5 puanı karşıladığından ödenen oran {{bagkur.indirimli}}'e düşer.

### Bağkur primini üst sınırdan ödemek mantıklı mı?

Yüksek kazanç beyanı emekli aylığını artırır ancak aylık prim yükü de yükselir. Karar; bütçenize, emekliliğe kalan sürenize ve beklentinize bağlıdır. Üst sınırda indirimli aylık prim {{bk.ust.aylikIndirimli}}'dir.

### 5 puanlık indirimden nasıl yararlanırım?

Primlerinizi her ay süresinde ödemeniz ve vadesi geçmiş prim borcunuzun bulunmaması yeterlidir. İndirim ayrıca başvuru gerektirmeden tahakkuka yansır.

### Bağkur primi ne zaman ödenir?

Her ayın primi o ayın son gününe kadar ödenir. Geç ödemede gecikme cezası ve zammı uygulanır, ayrıca o ay için 5 puanlık indirim kaybedilir.

### Prime esas kazancımı nasıl değiştiririm?

e-Devlet üzerinden veya SGK il/ilçe müdürlüğüne dilekçeyle başvurarak asgari ile azami sınır arasında yeni bir kazanç beyan edebilirsiniz. Yeni tutar başvurudan sonraki dönemler için geçerli olur.

### Bağkur primine genel sağlık sigortası dahil mi?

Evet. 4/b prim oranı malullük, yaşlılık ve ölüm sigortası ile kısa vadeli sigorta kollarının yanında genel sağlık sigortası primini de içerir; ayrıca GSS primi ödenmez.
