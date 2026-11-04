## İhbar tazminatı nedir?

İhbar tazminatı, belirsiz süreli iş sözleşmesini **önceden bildirim yapmadan** ya da kanuni bildirim süresine uymadan fesheden tarafın karşı tarafa ödediği tazminattır. Dayanağı **4857 sayılı İş Kanunu'nun 17. maddesidir**. Kanun, iş ilişkisinin aniden bitmesinin önüne geçmek için taraflara belirli bir "ihbar öneli" tanır: işçi bu sürede yeni iş arayabilir, işveren de yerine eleman bulabilir.

İşveren, bildirim süresini beklemek yerine bu süreye ait ücreti **peşin ödeyerek** sözleşmeyi hemen sona erdirebilir. Uygulamada "ihbar tazminatı" denince çoğunlukla bu ödeme kastedilir. Kural iki yönlüdür: bildirim süresine uymadan işi bırakan işçi de işverene ihbar tazminatı ödemekle yükümlüdür.

## İhbar süreleri

Bildirim süresi, işçinin **aynı işverendeki kesintisiz ya da toplam kıdemine** göre belirlenir:

| Çalışma süresi | İhbar süresi | Gün karşılığı |
| --- | --- | --- |
| 6 aydan az | {{ihbar.hafta1}} hafta | {{ihbar.gun1}} gün |
| 6 ay – 1,5 yıl | {{ihbar.hafta2}} hafta | {{ihbar.gun2}} gün |
| 1,5 yıl – 3 yıl | {{ihbar.hafta3}} hafta | {{ihbar.gun3}} gün |
| 3 yıldan fazla | {{ihbar.hafta4}} hafta | {{ihbar.gun4}} gün |

Bu süreler asgaridir; iş sözleşmesi veya toplu iş sözleşmesiyle **artırılabilir** ama azaltılamaz. Hesaplayıcımız kıdeminizi tam ay olarak bulur; tam 6 ay, 18 ay ve 36 ay dolduğunda bir üst süreye geçilir.

## Kimler ihbar tazminatı alabilir?

- **Belirsiz süreli** iş sözleşmesiyle çalışan ve işvereni tarafından bildirim süresi verilmeden işten çıkarılan işçi,
- Bildirim süresi verilmiş olsa bile bu süre kanuni süreden kısa tutulmuşsa, eksik kalan kısım için,
- Fesih bildiriminin yapıldığı tarih itibarıyla işyerinde çalışmaya devam ederken sözleşmesi derhal sona erdirilen işçi.

Buna karşılık **haklı nedenle derhal fesihte** (İş Kanunu md. 24 ve 25) ihbar süresi verilmez ve tazminat doğmaz. Örneğin işçi ahlak ve iyi niyet kurallarına aykırı davranış nedeniyle çıkarılmışsa ihbar tazminatı alamaz; işçi ücretinin ödenmemesi gibi haklı bir nedenle istifa ederse de ihbar tazminatı talep edemez, ama kıdem tazminatını alabilir. **Belirli süreli** sözleşmeler süre bitince kendiliğinden sona erdiğinden bu sözleşmelerde de ihbar tazminatı yoktur.

## İhbar tazminatı nasıl hesaplanır?

Hesaplama dört adımdır:

1. **Kıdem bulunur** ve yukarıdaki tablodan ihbar süresi (hafta) belirlenir.
2. **Giydirilmiş brüt ücret** hesaplanır: son brüt maaşa düzenli ödenen yemek, yol, ikramiye gibi yan hakların aylık brüt karşılığı eklenir.
3. **Brüt tazminat** = giydirilmiş ücret / 30 × ihbar süresi (gün).
4. **Kesintiler** düşülür: gelir vergisi ve {{damga.oran}} damga vergisi.

> **Brüt ihbar tazminatı = (Giydirilmiş aylık brüt / 30) × Hafta × 7**
>
> **Net ihbar tazminatı = Brüt − Gelir vergisi − Damga vergisi**

İhbar tazminatında kıdem tazminatındaki gibi bir **tavan yoktur**; ücretin tamamı esas alınır.

### Gelir vergisi neden değişkendir?

Kıdem tazminatının aksine ihbar tazminatı **gelir vergisine tabidir**. Vergi, ödemenin yapıldığı yıl içinde biriken **kümülatif vergi matrahınızın** üzerine eklenerek hesaplanır. Yıl başında işten çıkarılan biri {{gv.oran1}} dilimindeyken, yıl sonunda çıkarılan aynı ücretli kişi {{gv.oran2}} veya {{gv.oran3}} dilimine girebilir. {{yil}} ücret tarifesinde ilk dilim {{gv.dilim1}}, ikinci dilim {{gv.dilim2}}, üçüncü dilim {{gv.dilim3}} tutarına kadardır. Bu yüzden hesaplayıcıda "bu yılki kümülatif vergi matrahı" alanı bulunur; son bordronuzda yazan rakamı girerseniz vergi doğru dilimden hesaplanır.

İhbar tazminatından **SGK primi kesilmez**; 5510 sayılı Kanun md. 80 bu ödemeyi prime esas kazanca dahil etmez. Asgari ücret vergi istisnası ise o ayın maaşında kullanıldığı için hesaplayıcı ihbar tutarına ayrıca istisna uygulamaz.

## Örnek hesaplamalar

### Örnek 1: 2 yıl 3 ay kıdem

Brüt maaşı 40.000 TL olan, yan hakkı bulunmayan ve 2 yıl 3 ay çalıştıktan sonra bildirimsiz çıkarılan bir çalışanın ihbar süresi {{ihbar.hafta3}} hafta ({{ihbar.gun3}} gün) olur. Kümülatif matrahı yok kabul edelim.

- Günlük brüt ücret: 40.000 / 30 = {{ihbar.ornek1.gunluk}}
- Brüt tazminat: **{{ihbar.ornek1.brut}}**
- Gelir vergisi: {{ihbar.ornek1.gv}}, damga vergisi: {{ihbar.ornek1.damga}}
- Net tazminat: **{{ihbar.ornek1.net}}**

### Örnek 2: Deneme süresini geçmiş, 4 aylık çalışan

Brüt 30.000 TL ücretle 4 ay çalışan işçinin süresi {{ihbar.hafta1}} haftadır. Brüt tazminat {{ihbar.ornek2.brut}}; vergiler ({{ihbar.ornek2.gv}} + {{ihbar.ornek2.damga}}) düşüldüğünde net **{{ihbar.ornek2.net}}** ödenir.

### Örnek 3: 8 yıl kıdem, yıl sonunda fesih

Brüt 70.000 TL maaş ve 5.000 TL düzenli yan hakla çalışan, kümülatif vergi matrahı 350.000 TL'ye ulaşmış bir çalışan için süre {{ihbar.hafta4}} haftadır. Günlük giydirilmiş ücret {{ihbar.ornek3.gunluk}}, brüt tazminat **{{ihbar.ornek3.brut}}**. Matrah {{gv.dilim2}} sınırını aştığından tazminatın bir kısmı {{gv.oran3}} oranıyla vergilenir: gelir vergisi {{ihbar.ornek3.gv}}, damga vergisi {{ihbar.ornek3.damga}}, net **{{ihbar.ornek3.net}}**.

## Sık yapılan hatalar

- **Net maaşla hesaplamak.** Tazminat brüt ücretle hesaplanır. Yalnız netinizi biliyorsanız önce [netten brüte maaş hesaplama](/netten-brute-maas-hesaplama) aracını kullanın.
- **Gelir vergisini unutmak.** Kıdem tazminatı gelir vergisinden istisnadır, ihbar tazminatı değildir. İki tazminatı aynı kesintiyle hesaplamak net tutarı yüksek gösterir.
- **Kümülatif matrahı yok saymak.** Yılın ikinci yarısında yapılan fesihlerde vergi dilimi genellikle yükselmiştir.
- **Kıdem tazminatı tavanını uygulamak.** İhbar tazminatında tavan yoktur. Kıdem tazminatı için [kıdem tazminatı hesaplama](/kidem-tazminati-hesaplama) aracına bakın.
- **Yan hakları eklememek.** Düzenli yemek ve yol yardımı gibi ödemeler giydirilmiş ücrete dahildir.

## İhbar süresinde çalışma ve iş arama izni

İşveren tazminatı peşin ödemek yerine işçiyi ihbar süresi boyunca çalıştırmayı da seçebilir. Bu durumda işçiye, İş Kanunu md. 27 gereği **günde en az 2 saat ücretli iş arama izni** verilmelidir. İzin toplu kullanılmak istenirse işverene önceden bildirilir. İş arama izni verilmezse ya da eksik verilirse, kullandırılmayan sürenin ücreti ödenir; izin süresinde işçi çalıştırılırsa bu sürenin ücreti %100 zamlı ödenir.

Kendi isteğiyle ayrılan işçi de bildirim süresine uymalıdır. Süreyi beklemeden işi bırakırsa işveren, ihbar tazminatını işçinin alacaklarından (ör. son maaş) mahsup edebilir. İhbar tazminatı alacakları için zamanaşımı **5 yıldır** ve dava açmadan önce arabulucuya başvurmak zorunludur. İşten çıkarıldıysanız [işsizlik maaşı hesaplama](/issizlik-maasi-hesaplama) aracıyla İŞKUR ödeneğinizi de görebilirsiniz.

## Yasal dayanak

- 4857 sayılı İş Kanunu md. 17 (süreli fesih ve ihbar tazminatı), md. 27 (iş arama izni)
- 193 sayılı Gelir Vergisi Kanunu md. 61 ve 103 (ücret ve tarife)
- 5510 sayılı Sosyal Sigortalar ve Genel Sağlık Sigortası Kanunu md. 80 (prime esas kazanç dışı ödemeler)
- 488 sayılı Damga Vergisi Kanunu, (1) sayılı tablo IV-1-b ({{damga.oran}})

<!-- sss -->

### İhbar tazminatı kaç haftalık ücret tutarındadır?

Kıdeminiz 6 aydan azsa {{ihbar.hafta1}}, 6 ay ile 1,5 yıl arasındaysa {{ihbar.hafta2}}, 1,5 ile 3 yıl arasındaysa {{ihbar.hafta3}}, 3 yıldan fazlaysa {{ihbar.hafta4}} haftalık brüt ücret tutarındadır. Sözleşmeyle bu süreler uzatılabilir.

### İhbar tazminatından hangi kesintiler yapılır?

Gelir vergisi ve {{damga.oran}} damga vergisi kesilir. SGK ve işsizlik sigortası primi kesilmez. Gelir vergisi, yıl içindeki kümülatif matrahınıza göre {{gv.oran1}} ile {{gv.oran5}} arasında değişebilir.

### İstifa eden işçi ihbar tazminatı alır mı?

Hayır. İstifa eden işçi ihbar tazminatı alamaz; aksine bildirim süresine uymadan ayrılırsa işverene ihbar tazminatı ödemesi gerekebilir. Haklı nedenle (md. 24) istifa edenler de ihbar tazminatı alamaz ama şartları varsa kıdem tazminatı alır.

### İhbar tazminatında tavan var mı?

Hayır. Kıdem tazminatındaki tavan ({{kidem.tavan}}) ihbar tazminatında uygulanmaz; giydirilmiş brüt ücretin tamamı esas alınır.

### Deneme süresinde işten çıkarılan işçiye ihbar tazminatı ödenir mi?

Hayır. İş Kanunu md. 15 gereği deneme süresi içinde taraflar sözleşmeyi bildirim süresine gerek olmadan ve tazminatsız feshedebilir. Deneme süresi en fazla iki ay, toplu sözleşmeyle dört aydır.

### Kümülatif vergi matrahımı nereden öğrenirim?

Son aylık bordronuzda "kümülatif vergi matrahı" ya da "KGVM" satırında yazar. Bilmiyorsanız alanı 0 bırakabilirsiniz; bu durumda vergi en düşük dilimden hesaplanır ve net tutar olduğundan biraz yüksek görünebilir.

### İhbar tazminatı ne zaman ödenir?

İşveren bildirim süresine uymadan fesih yapıyorsa ihbar tazminatını fesih anında peşin ödemelidir. Ödenmeyen tazminat için fesihten itibaren 5 yıl içinde, önce arabulucuya başvurarak talepte bulunabilirsiniz.
