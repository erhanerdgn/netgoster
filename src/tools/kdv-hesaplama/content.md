## KDV nedir?

Katma değer vergisi (KDV), mal ve hizmet tesliminin her aşamasında, satış bedeline eklenerek alıcıdan tahsil edilen bir tüketim vergisidir. Satıcı, faturada gösterdiği KDV'yi devlete öder; kendi alışlarında ödediği KDV'yi ise bundan indirir. Böylece vergi yalnızca her aşamada eklenen değer üzerinden alınmış olur ve yükü nihai tüketiciye geçer.

Dayanağı **3065 sayılı Katma Değer Vergisi Kanunu**'dur. Kanunun 28. maddesi, oranları belirleme yetkisini Cumhurbaşkanına verir. Bugün uygulanan oranlar, **7346 sayılı Cumhurbaşkanı Kararı** ile {{kdv.yururluk}} tarihinden itibaren belirlenmiştir.

## Güncel KDV oranları

| Oran | Kapsam |
| --- | --- |
| {{kdv.oran1}} | Karara ekli (I) sayılı listedeki mal ve hizmetler (ör. ekmek, un gibi temel gıda maddelerinin önemli bölümü, gazete ve dergiler) |
| {{kdv.oran2}} | (II) sayılı listedeki mal ve hizmetler (ör. lokanta ve yemek hizmetleri) |
| {{kdv.genel}} | Listelerde yer almayan tüm teslim ve hizmetler (genel oran) |

Bir ürünün hangi orana tabi olduğu, karara ekli listelerdeki tanıma göre belirlenir. Aynı ürün grubunda bile ambalaj, işlenmişlik veya teslim şekli oranı değiştirebilir; emin değilseniz faturayı kesen işletmenin mali müşavirine danışın. Hesaplayıcıda listede olmayan bir oran gerekiyorsa (ör. eski tarihli bir fatura) **Diğer** seçeneğiyle oranı elle girebilirsiniz.

## KDV nasıl hesaplanır?

Hesaplamanın yönü, elinizdeki tutarın vergili mi vergisiz mi olduğuna bağlıdır.

### KDV hariç tutardan dahil tutara

Vergisiz tutara (matrah) oran uygulanır ve sonuç eklenir:

> **KDV = KDV hariç tutar × oran**
>
> **KDV dahil tutar = KDV hariç tutar + KDV**

### KDV dahil tutardan hariç tutara

Burada en sık yapılan hata, dahil tutarı doğrudan oranla çarpmaktır. Doğrusu, dahil tutarı **(1 + oran)** ile bölmektir:

> **KDV hariç tutar = KDV dahil tutar ÷ (1 + oran)**
>
> **KDV = KDV dahil tutar − KDV hariç tutar**

Genel oranda bölen {{kdv.carpan.genel}}, (II) sayılı listede {{kdv.carpan.oran2}} olur.

### Kuruş yuvarlaması

Ters hesapta bölme işlemi çoğunlukla küsuratlı çıkar. Hesaplayıcı önce KDV hariç tutarı kuruşa yuvarlar, KDV'yi ise **dahil tutar ile hariç tutar arasındaki fark** olarak bulur. Bu sayede "hariç + KDV" toplamı, girdiğiniz dahil tutara kuruşu kuruşuna eşit olur; faturada da aynı tutarlılık aranır. Hariçten dahile hesapta ise KDV tutarı kuruşa yuvarlanır ve matraha eklenir.

## Örnek hesaplamalar

### Örnek 1: Hizmet faturası, genel oran

Bir serbest meslek erbabı, KDV hariç 15.000 TL'lik hizmet bedeli için fatura kesecek. Genel oran {{kdv.genel}}'dir.

- KDV: 15.000 × {{kdv.genel}} = **{{kdv.ornek1.kdv}}**
- KDV dahil fatura toplamı: **{{kdv.ornek1.dahil}}**

### Örnek 2: Etiket fiyatından KDV'yi ayırmak

Mağazada KDV dahil 2.499,90 TL'ye satılan bir ürünün vergisiz fiyatını bulalım:

- KDV hariç tutar: 2.499,90 ÷ {{kdv.carpan.genel}} = **{{kdv.ornek2.haric}}**
- İçindeki KDV: 2.499,90 − {{kdv.ornek2.haric}} = **{{kdv.ornek2.kdv}}**

### Örnek 3: Restoran hesabı

KDV dahil 850 TL'lik bir lokanta hesabında oran {{kdv.oran2}} ise:

- KDV hariç tutar: 850 ÷ {{kdv.carpan.oran2}} = **{{kdv.ornek3.haric}}**
- KDV: **{{kdv.ornek3.kdv}}**

Aynı hesabı yanlış yöntemle, yani 850 TL'nin {{kdv.oran2}}'unu alarak yapsaydık KDV {{kdv.hata.kdv}}, hariç tutar {{kdv.hata.haric}} çıkardı. Fark küçük görünse de yüksek tutarlarda ve muhasebe kayıtlarında ciddi tutarsızlığa yol açar.

## Sık yapılan hatalar

- **Dahil tutardan KDV'yi yüzde alarak çıkarmak.** Dahil tutarın {{kdv.genel}}'si KDV değildir; KDV, dahil tutarın yaklaşık altıda biridir. Mutlaka (1 + oran) ile bölün.
- **Yanlış oranı seçmek.** Ürün veya hizmetin listelerdeki yerine bakmadan "her şey {{kdv.genel}}" demek, özellikle gıda ve yeme-içme işletmelerinde hatalı fatura doğurur.
- **İndirimi KDV'den sonra uygulamak.** İskonto, KDV matrahından düşülür; önce indirimi uygulayıp sonra KDV hesaplayın. İndirim oranı için [indirim hesaplama](/indirim-hesaplama) aracını kullanabilirsiniz.
- **Yuvarlamayı her iki tutarda ayrı ayrı yapmak.** Hem hariç tutarı hem KDV'yi bağımsız yuvarlamak, toplamda bir kuruşluk fark yaratabilir. KDV'yi farktan bulmak bu sorunu ortadan kaldırır.
- **Eski oranları kullanmak.** {{kdv.yururluk}} öncesinde genel oran %18, indirimli oran %8 idi. Eski tarihli belgeler için **Diğer** seçeneğini kullanın.

## Matraha neler dahildir?

KDV yalnızca ürünün etiket bedeline değil, işlem karşılığında alınan her türlü değere uygulanır. KDV Kanunu md. 24'e göre ambalaj, nakliye ve sigorta gibi giderler, vade farkı, fiyat farkı ve kur farkı da matraha dahildir. Buna karşılık md. 25 uyarınca teslim anında yapılan ve faturada gösterilen iskontolar ile KDV'nin kendisi matraha girmez. Hesaplayıcıya girdiğiniz tutarın bu kalemleri kapsadığından emin olun.

## KDV ve fiyat etiketleri

Perakende satışlarda tüketiciye gösterilen etiket fiyatları KDV dahildir. Faturada ise matrah, oran ve KDV tutarı ayrı ayrı gösterilir. İşletmeden işletmeye satışlarda fiyatların "+KDV" olarak konuşulması yaygındır; bu durumda hariçten dahile hesap yapılır. Yüzde hesaplarının genel mantığı için [yüzde hesaplama](/yuzde-hesaplama), yabancı para cinsinden faturaları Türk lirasına çevirmek için [döviz çevirici](/doviz-cevirici) aracına göz atabilirsiniz.

Hesaplayıcı, oransal KDV tevkifatı (kısmi tevkifat) uygulamaz; tevkifatlı faturalarda alıcının beyan edeceği kısım ayrıca hesaplanmalıdır.

## Yasal dayanak

- 3065 sayılı Katma Değer Vergisi Kanunu, md. 1 (verginin konusu), md. 20–24 (matrah), md. 28 (oranlar)
- 7346 sayılı Cumhurbaşkanı Kararı, Resmî Gazete 07.07.2023 / 32241 (yürürlük {{kdv.yururluk}})
- Katma Değer Vergisi Genel Uygulama Tebliği

<!-- sss -->

### Güncel KDV oranları nedir?

Genel oran {{kdv.genel}}, indirimli oranlar ise (I) sayılı listedeki mal ve hizmetler için {{kdv.oran1}}, (II) sayılı listedekiler için {{kdv.oran2}}'dur. Bu oranlar {{kdv.yururluk}} tarihinden beri uygulanmaktadır.

### KDV dahil fiyattan KDV nasıl çıkarılır?

KDV dahil tutar (1 + oran) ile bölünür; sonuç KDV hariç tutardır. Örneğin genel oranda dahil tutarı {{kdv.carpan.genel}}'ye bölersiniz. KDV ise dahil tutar ile hariç tutar arasındaki farktır.

### KDV dahil tutarın %20'si neden KDV'yi vermez?

Çünkü KDV, dahil tutar üzerinden değil, vergisiz tutar üzerinden hesaplanır. 120 TL'lik dahil fiyatın %20'si 24 TL eder; oysa gerçek KDV 20 TL'dir (100 TL × %20).

### KDV hariç tutara KDV nasıl eklenir?

Hariç tutar oranla çarpılarak KDV bulunur ve hariç tutara eklenir. Kısaca hariç tutarı (1 + oran) ile çarpmak da aynı sonucu verir.

### Eski bir faturayı %18 ile hesaplayabilir miyim?

Evet. Oran seçiminde **Diğer**'i seçip %18 veya %8 gibi oranı elle girebilirsiniz. Hesaplama yöntemi oran ne olursa olsun aynıdır.

### Hesaplayıcı KDV tevkifatını da hesaplıyor mu?

Hayır. Bu araç tam KDV hesaplar. Tevkifatlı işlemlerde (ör. 5/10, 9/10) hesaplanan KDV'nin bir kısmını alıcı beyan eder; bu oranlar işlem türüne göre değiştiği için mali müşavirinizle birlikte ayrıca hesaplanmalıdır.

### Kuruş farkı neden oluşur, nasıl önlenir?

Ters hesapta bölme sonucu çoğunlukla küsuratlıdır. Hariç tutar kuruşa yuvarlanıp KDV aradaki fark olarak bulunursa hariç tutar ile KDV'nin toplamı dahil tutarı birebir verir. Hesaplayıcı bu yöntemi kullanır.
