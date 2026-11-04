## Brüt maaş ve net maaş farkı

**Brüt maaş**, iş sözleşmesinde yazan ve hiçbir kesinti yapılmamış ücrettir. **Net maaş** ise sigorta primleri ve vergiler düşüldükten sonra banka hesabınıza yatan tutardır. Türkiye'de bordroda dört kesinti yapılır: SGK primi, işsizlik sigortası primi, gelir vergisi ve damga vergisi. Gelir vergisi yıl içinde biriken matraha göre hesaplandığından, brüt maaşınız hiç değişmese bile **net maaşınız aylara göre farklılaşabilir**. Hesaplayıcımız bu yüzden tek bir rakam yerine 12 aylık tablo verir.

## Brütten nete hesaplama adımları

### 1. SGK ve işsizlik primi

Brüt ücretten {{sgk.isci}} SGK işçi payı (malullük-yaşlılık-ölüm ve genel sağlık sigortası) ve {{sgk.isciIssizlik}} işsizlik sigortası işçi payı, toplam **{{sgk.isciToplam}}** kesilir. Primler, prime esas kazancın üst sınırıyla ({{sgk.tavan}}) sınırlıdır; bu tutarı aşan kısım için prim kesilmez. Alt sınır ise brüt asgari ücrettir ({{sgk.taban}}).

### 2. Gelir vergisi matrahı ve kümülatif matrah

> **GV matrahı = Brüt ücret − SGK işçi payı − İşsizlik işçi payı**

Gelir vergisi tek bir ayın matrahına değil, **Ocak'tan o aya kadar biriken toplam matraha** (kümülatif matrah) tarifenin uygulanmasıyla bulunur. Her ayın vergisi, kümülatif matrahın vergisinden bir önceki ayın kümülatif vergisi çıkarılarak hesaplanır. {{yil}} ücret tarifesi:

| Kümülatif matrah | Oran |
| --- | --- |
| {{gv.dilim1}}'ye kadar | {{gv.oran1}} |
| {{gv.dilim2}}'ye kadar | {{gv.oran2}} |
| {{gv.dilim3}}'ye kadar | {{gv.oran3}} |
| {{gv.dilim4}}'ye kadar | {{gv.oran4}} |
| {{gv.dilim4}} üzeri | {{gv.oran5}} |

### 3. Asgari ücret vergi istisnası

2022'den beri **her çalışanın** ücretinin asgari ücrete isabet eden kısmı gelir ve damga vergisinden istisnadır (GVK md. 23/18). İstisna tutarı şöyle bulunur: asgari ücretin GV matrahı ({{bn.asgariMatrah}}) aynı şekilde kümülatif olarak tarifeye uygulanır ve o aya düşen vergi, sizin hesaplanan verginizden düşülür. Asgari ücretin matrahı da yıl içinde dilim atladığı için istisna sabit değildir:

| Dönem | Aylık GV istisnası |
| --- | --- |
| Ocak – Haziran | {{bn.istisnaOcak}} |
| Temmuz | {{bn.istisnaTemmuz}} |
| Ağustos – Aralık | {{bn.istisnaAralik}} |

Damga vergisinde de asgari ücretin damga vergisi kadar, yani aylık **{{bn.dvIstisna}}** istisna uygulanır.

### 4. Damga vergisi ve net maaş

Damga vergisi brüt ücretin **{{damga.oran}}**'idir; istisna düşüldükten sonra kalan kısım kesilir.

> **Net maaş = Brüt − SGK − İşsizlik − (Hesaplanan GV − GV istisnası) − (Damga vergisi − DV istisnası)**

## Örnek hesaplamalar

### Örnek 1: Aylık 50.000 TL brüt

Ocak ayı bordrosu:

- SGK işçi payı: {{bn.ornek1.ocak.sgkIsci}}, işsizlik: {{bn.ornek1.ocak.issizlikIsci}}
- GV matrahı: {{bn.ornek1.ocak.gvMatrah}} → hesaplanan vergi {{bn.ornek1.ocak.gvHesaplanan}}
- Asgari ücret istisnası: {{bn.ornek1.ocak.gvIstisna}} → ödenecek gelir vergisi **{{bn.ornek1.ocak.gv}}**
- Damga vergisi: {{bn.ornek1.ocak.dvHesaplanan}} − {{bn.ornek1.ocak.dvIstisna}} = {{bn.ornek1.ocak.dv}}
- **Ocak net maaşı: {{bn.ornek1.ocak.net}}**

Kümülatif matrah {{bn.ornek1.gecisAy}} ayında {{gv.dilim1}} sınırını geçer ve vergi oranı {{gv.oran2}}'ye çıkar. Aralık'ta kümülatif matrah {{bn.ornek1.aralik.kumMatrah}} olur, gelir vergisi {{bn.ornek1.aralik.gv}}'ye yükselir ve net maaş **{{bn.ornek1.aralik.net}}**'ye düşer. Yıllık toplam net {{bn.ornek1.yillik.net}}, aylık ortalama {{bn.ornek1.ortalamaNet}}'dir.

### Örnek 2: Aylık 100.000 TL brüt

Ocak'ta SGK ve işsizlik kesintisi {{bn.ornek2.ocak.sgkIsci}} + {{bn.ornek2.ocak.issizlikIsci}}, gelir vergisi {{bn.ornek2.ocak.gv}}, damga vergisi {{bn.ornek2.ocak.dv}}; net **{{bn.ornek2.ocak.net}}**. Yüksek ücretlerde dilim geçişi erken gelir ({{bn.ornek2.gecisAy}}), Aralık neti {{bn.ornek2.aralik.net}}'ye iner. Yıllık net {{bn.ornek2.yillik.net}}.

### Örnek 3: Yarı zamanlı, 20.000 TL brüt

Asgari ücretin altında kalan ücretlerde hesaplanan vergi ({{bn.ornek3.gvHesaplanan}}) istisna tutarından küçük olduğundan istisna, vergiyle sınırlı uygulanır ve gelir vergisi sıfırlanır. Damga vergisi de istisna kapsamında kalır. Net maaş yalnız prim kesintisiyle **{{bn.ornek3.net}}** olur.

## Net maaşı neden her ay farklı?

Yıl başında herkes en düşük dilimden başlar. Kümülatif matrah büyüdükçe aynı brüt ücretin daha büyük kısmı üst dilimden vergilendirilir. Asgari ücret istisnası da Temmuz'dan itibaren artsa bile bu artış, ortalama ve üstü ücretlerde dilim artışını tam karşılamaz. Sonuç olarak net maaş genellikle yılın ilk aylarında en yüksek, son aylarında en düşüktür. Ocak'ta yeniden sıfırdan başlanır.

## Sık yapılan hatalar

- **Tek ayın netini yıl boyu geçerli saymak.** Ocak neti yıl sonuna kadar korunmaz; bütçe yaparken yıllık ortalamaya bakın.
- **İstisnayı yalnız asgari ücretlilere ait sanmak.** İstisna herkese uygulanır; yüksek ücretlilerde de her ay asgari ücretin vergisi kadar indirim vardır.
- **PEK tavanını unutmak.** {{sgk.tavan}} üzerindeki ücretlerde SGK kesintisi sabitlenir; bu nedenle çok yüksek ücretlerde net oran beklenenden yüksektir.
- **İşe yıl ortasında başlamayı hesaba katmamak.** Aynı yıl başka bir işverenden gelen matrah yeni işverene bildirilmezse dilim hesabı farklılaşır.
- **Netten başlayıp oransal tahmin yapmak.** Elinize geçecek tutarı biliyorsanız [netten brüte maaş hesaplama](/netten-brute-maas-hesaplama) aracı tam brütü bulur.

İşverenin bu maaş için ödediği toplam tutarı [işveren maliyeti hesaplama](/isveren-maliyeti-hesaplama), fazla çalışmanın maaşınıza etkisini [fazla mesai hesaplama](/fazla-mesai-hesaplama) ile görebilirsiniz. Asgari ücretin güncel dökümü için [asgari ücret hesaplama](/asgari-ucret-hesaplama) sayfasına bakın.

## Yasal dayanak

- 193 sayılı Gelir Vergisi Kanunu md. 23/18 (asgari ücret istisnası), md. 63 (ücret matrahı), md. 103 (tarife)
- 5510 sayılı Kanun md. 81–82 (prim oranları, prime esas kazanç alt ve üst sınırı)
- 4447 sayılı İşsizlik Sigortası Kanunu md. 49 (işsizlik primi)
- 488 sayılı Damga Vergisi Kanunu, (1) sayılı tablo IV-1-b ve (2) sayılı tablo asgari ücret istisnası

<!-- sss -->

### {{yil}} yılında asgari ücretin neti ne kadar?

Brüt asgari ücret {{asgari.brut}}, net asgari ücret {{asgari.net}}'dir. Asgari ücretten yalnız {{sgk.isciToplam}} SGK ve işsizlik primi kesilir; gelir ve damga vergisi istisna nedeniyle sıfırdır.

### Brütten nete kesinti oranı yüzde kaç?

Sabit bir oran yoktur. Prim kesintisi {{sgk.isciToplam}}'tir; gelir vergisi kümülatif matrahınıza göre {{gv.oran1}} ile {{gv.oran5}} arasında değişir, üstelik asgari ücret istisnası düşülür. Bu nedenle kesinti oranı hem ücret düzeyine hem de yılın hangi ayında olduğunuza bağlıdır.

### Kümülatif vergi matrahı nedir?

Ocak ayından itibaren her ay oluşan gelir vergisi matrahlarınızın toplamıdır. Vergi dilimi bu toplam üzerinden belirlenir ve her yılın başında sıfırlanır.

### Asgari ücret istisnası her ay aynı mı?

Hayır. Asgari ücretin matrahı da kümülatif olarak dilim atladığı için {{yil}} yılında istisna Ocak–Haziran {{bn.istisnaOcak}}, Temmuz {{bn.istisnaTemmuz}}, Ağustos–Aralık {{bn.istisnaAralik}} olarak uygulanır.

### SGK kesintisi için üst sınır var mı?

Evet. Prime esas kazancın üst sınırı aylık {{sgk.tavan}}'dir. Bu tutarı aşan brüt ücretlerde SGK ve işsizlik primi tavan üzerinden kesilir.

### Bordromdaki net, hesaplayıcıdan farklı çıkıyor; neden?

Bordronuzda özel sağlık sigortası, BES katkısı, sendika aidatı, avans veya icra kesintisi olabilir; engellilik indirimi uygulanıyor ya da önceki işverenden devreden matrah bulunuyor olabilir. Hesaplayıcı yalnız yasal kesintileri, Ocak'tan itibaren aynı işverende ve aynı brütle çalışıldığı varsayımıyla gösterir.

### Yıl ortasında zam alırsam ne değişir?

Zamdan sonraki aylarda kümülatif matrah daha hızlı büyür ve üst dilime daha erken geçersiniz. Yeni brütünüzü girerek zam sonrası aylık netlerin yaklaşık düzeyini görebilirsiniz.
