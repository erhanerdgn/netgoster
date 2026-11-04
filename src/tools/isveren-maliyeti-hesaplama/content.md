## İşveren maliyeti nedir?

Bir çalışanın işverene maliyeti, sözleşmede yazan brüt maaştan **daha yüksektir**. İşveren brüt ücretin yanında, kendi payına düşen sosyal güvenlik ve işsizlik sigortası primlerini de SGK'ya öder. Çalışana ödenen net ücret, işçiden kesilen primler ve vergiler ise brüt ücretin içindedir; işveren bunları çalışan adına keser ve devlete yatırır. Bu nedenle bütçe yaparken üç rakamı ayırt etmek gerekir:

- **Net ücret:** Çalışanın banka hesabına yatan tutar,
- **Brüt ücret:** Net ücret + işçi primleri + vergiler,
- **Toplam işveren maliyeti:** Brüt ücret + işveren primleri − varsa teşvik indirimleri.

## Hesaplama formülü

> **Toplam maliyet = Brüt ücret + SGK işveren payı + İşsizlik işveren payı − Hazine indirimi**

{{yil}} yılında oranlar şöyledir:

| Prim | Oran |
| --- | --- |
| SGK işveren payı (MYÖ, GSS, kısa vadeli sigorta kolları) | {{sgk.isveren}} |
| İşsizlik sigortası işveren payı | {{sgk.isverenIssizlik}} |
| **Toplam işveren primi** | **{{sgk.isverenToplam}}** |
| Hazine indirimi (imalat dışı) | − {{sgk.hazine}} |
| Hazine indirimi (imalat sektörü) | − {{sgk.hazineImalat}} |

Primler, **prime esas kazanç** üzerinden hesaplanır. Prime esas kazancın alt sınırı brüt asgari ücret ({{sgk.taban}}), üst sınırı {{sgk.tavan}}'dir. Brüt ücreti bu tavanı aşan çalışanlar için işveren primi tavanda sabitlenir; tavanı aşan ücret kısmı için yalnız brüt ücret ödenir.

## Hazine indirimi (teşvik) nedir?

5510 sayılı Kanun md. 81/ı uyarınca özel sektör işverenleri, SGK işveren payının bir kısmının Hazine tarafından karşılanmasından yararlanabilir. Hesaplayıcıdaki teşvik seçenekleri:

- **Yok:** Teşvikten yararlanmayan veya şartları taşımayan işverenler (kamu işverenleri dahil).
- **Genel hazine indirimi:** İmalat dışı sektörlerde prime esas kazancın {{sgk.hazine}}'si kadar indirim.
- **İmalat:** NACE kodu imalat (C) sektöründe olan işyerlerinde {{sgk.hazineImalat}} indirim.

İndirimden yararlanmak için işverenin aylık prim ve hizmet belgelerini yasal süresinde vermesi, vadesi geçmiş prim borcunun bulunmaması ve kayıt dışı sigortalı çalıştırmaması gerekir. Ayrıca şartları sağlayan işverenler asgari ücretli çalışan başına aylık **{{destek.asgari}}** asgari ücret desteğinden de yararlanır; destek prim borcundan mahsup edildiği ve kişiye göre değişen şartlara bağlı olduğu için hesaplayıcı toplam maliyete otomatik eklemez.

## Örnek hesaplamalar

### Örnek 1: 50.000 TL brüt, teşviksiz

- SGK işveren payı: {{im.ornek1.sgkIsveren}}
- İşsizlik işveren payı: {{im.ornek1.issizlikIsveren}}
- **Aylık maliyet: {{im.ornek1.maliyet}}**, yıllık {{im.ornek1.yillik}}

Brüt maaşın üzerine {{im.ornek1.ekOran}} ek maliyet biner. Çalışanın Ocak net maaşı {{im.ornek1.net}}, yıllık toplam neti {{im.ornek1.yillikNet}}'dir. Yani Ocak ayında işverenin harcadığı her 100 liranın yaklaşık {{im.ornek1.netOran}}'i çalışanın cebine girer.

### Örnek 2: Aynı ücret, {{sgk.hazine}} hazine indirimi

Hazine indirimi {{im.ornek2.hazineIndirimi}} olur ve aylık maliyet **{{im.ornek2.maliyet}}**'ye iner. Yıllık maliyet {{im.ornek2.yillik}}; işverenin yıllık tasarrufu {{im.ornek2.tasarruf}}'dir. Çalışanın net maaşı teşvikten etkilenmez.

### Örnek 3: Aynı ücret, imalat sektörü

{{sgk.hazineImalat}} indirimle indirim tutarı {{im.ornek3.hazineIndirimi}}, aylık maliyet **{{im.ornek3.maliyet}}**, yıllık {{im.ornek3.yillik}} olur.

### Örnek 4: Tavanı aşan 400.000 TL brüt

Primler brüt yerine {{im.ornek4.sgkMatrah}} tavan üzerinden hesaplanır: SGK işveren payı {{im.ornek4.sgkIsveren}}, işsizlik payı {{im.ornek4.issizlikIsveren}}, aylık maliyet **{{im.ornek4.maliyet}}**. Bu çalışanın Ocak neti {{im.ornek4.net}}'dir.

## Sonuç tablosu nasıl okunur?

Hesaplayıcı, girdiğiniz brüt ücret için 12 aylık bir tablo üretir. "İşveren primleri" sütunu SGK ve işsizlik işveren paylarının toplamından hazine indirimi düşülmüş tutardır; "Toplam maliyet" bu tutara brüt ücretin eklenmesiyle bulunur. Brüt ücret sabit olduğu sürece maliyet sütunu her ay aynıdır. "Çalışanın neti" sütunu ise yıl ilerledikçe azalabilir: çalışanın kümülatif gelir vergisi matrahı büyüdükçe üst vergi dilimine geçilir. Bu düşüş işverenin maliyetini değiştirmez, ancak "net ücret" sözü verilmiş çalışanlarda işveren farkı brüte ekleyerek kapatmak zorunda kalır ve maliyet yıl içinde yükselir. Böyle bir anlaşmada her ayın brütünü [netten brüte maaş hesaplama](/netten-brute-maas-hesaplama) ile bulup maliyeti o brütlerle hesaplamanız gerekir.

## Maliyete dahil olmayan kalemler

Hesaplayıcı yasal bordro maliyetini gösterir. Gerçek personel bütçesinde ayrıca şunlar yer alabilir:

- Yemek kartı, servis, yol ve özel sağlık sigortası gibi yan haklar,
- İş sağlığı ve güvenliği hizmetleri, eğitim ve ekipman giderleri,
- İleride doğabilecek kıdem ve ihbar tazminatı karşılıkları ([kıdem tazminatı hesaplama](/kidem-tazminati-hesaplama)),
- Fazla mesai, prim ve ikramiye ödemeleri ([fazla mesai hesaplama](/fazla-mesai-hesaplama)),
- Yıllık izin ücretleri ve rapor günleri.

## Sık yapılan hatalar

- **Net maaşı maliyet sanmak.** İşveren için asıl rakam toplam maliyettir; net ücret maliyetin ancak bir kısmıdır.
- **Teşviki herkese uygulamak.** Prim borcu olan veya bildirgesini geç veren işveren indirimden yararlanamaz; indirim yalnız uygun aylar için geçerlidir.
- **Tavanı unutmak.** {{sgk.tavan}} üzerindeki ücretlerde primler artmaz, maliyet brüte yaklaşır.
- **Vergileri işveren maliyeti saymak.** Gelir ve damga vergisi çalışanın brütünden kesilir; işverene ek yük getirmez.
- **Netten maliyet hesaplamak.** Önce [netten brüte maaş hesaplama](/netten-brute-maas-hesaplama) ile brütü bulun, sonra bu aracı kullanın. Asgari ücretli için hazır döküm [asgari ücret hesaplama](/asgari-ucret-hesaplama) sayfasındadır.

## Yasal dayanak

- 5510 sayılı Kanun md. 81 (prim oranları ve hazine indirimi), md. 82 (prime esas kazanç sınırları), geçici md. 112 (asgari ücret desteği)
- 4447 sayılı İşsizlik Sigortası Kanunu md. 49
- 193 sayılı Gelir Vergisi Kanunu md. 103; 488 sayılı Damga Vergisi Kanunu

<!-- sss -->

### 50.000 TL brüt maaşın işverene maliyeti ne kadar?

{{yil}} yılında teşviksiz aylık maliyet {{im.ornek1.maliyet}}, yıllık {{im.ornek1.yillik}}'dir. {{sgk.hazine}} hazine indirimiyle aylık {{im.ornek2.maliyet}}'ye düşer.

### İşveren SGK payı yüzde kaç?

{{yil}} yılında SGK işveren payı {{sgk.isveren}}, işsizlik sigortası işveren payı {{sgk.isverenIssizlik}}, toplam {{sgk.isverenToplam}}'tir. Teşvikle bu oran {{sgk.hazine}} (imalatta {{sgk.hazineImalat}}) azalır.

### Hazine indirimi çalışanın maaşını etkiler mi?

Hayır. İndirim yalnız işverenin ödediği primi azaltır; çalışanın brüt ve net ücreti aynı kalır.

### Asgari ücret desteği maliyetten düşülür mü?

Destek, şartları sağlayan işverenin SGK prim borcundan mahsup edilir. Hesaplayıcı bunu otomatik düşmez; asgari ücretliler için desteğin etkisini [asgari ücret hesaplama](/asgari-ucret-hesaplama) sayfasında görebilirsiniz.

### Yüksek maaşlarda işveren primi neden sabitleniyor?

Primler prime esas kazancın üst sınırı olan {{sgk.tavan}} üzerinden hesaplanır. Bu tutarı aşan brüt ücretlerde işveren primi artmaz.

### İşveren maliyeti her ay aynı mı?

Brüt ücret sabitse evet. Çalışanın neti, kümülatif gelir vergisi nedeniyle yıl içinde azalabilir; ancak gelir vergisi brütten kesildiği için işverenin maliyetini değiştirmez.
