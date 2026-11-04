## {{yil}} asgari ücret ne kadar?

Asgari ücret, işçinin gıda, konut, giyim, sağlık, ulaşım ve kültür gibi zorunlu ihtiyaçlarını karşılamaya yetecek, kanunla güvenceye alınmış en düşük ücrettir. İş Kanunu md. 39 uyarınca **Asgari Ücret Tespit Komisyonu** tarafından belirlenir ve Resmî Gazete'de yayımlanır. {{yil}} yılı için:

| Kalem | Tutar |
| --- | --- |
| Aylık brüt asgari ücret | {{asgari.brut}} |
| Aylık net asgari ücret | {{asgari.net}} |
| Günlük brüt asgari ücret | {{asgari.gunluk}} |
| Saatlik brüt (225 saat) | {{au.brutSaatlik}} |
| Yıllık brüt / net | {{au.yillikBrut}} / {{au.yillikNet}} |

{{au.onceki.yil}} yılında brüt asgari ücret {{au.onceki.brut}}, net asgari ücret {{au.onceki.net}} idi; brütteki artış **{{au.artis}}** oldu. Asgari ücret, işçinin bekâr ya da evli olmasından, çocuk sayısından ve sektöründen bağımsız olarak tüm ülkede tek tutardır.

## Brüt asgari ücretten nete döküm

Asgari ücretten yalnız sigorta primleri kesilir. Gelir vergisi ve damga vergisi hesaplanır ama tamamı istisna olduğu için sıfırlanır:

| Kalem | Tutar |
| --- | --- |
| Brüt asgari ücret | {{au.brut}} |
| SGK işçi payı ({{sgk.isci}}) | − {{au.sgkIsci}} |
| İşsizlik sigortası işçi payı ({{sgk.isciIssizlik}}) | − {{au.issizlikIsci}} |
| Gelir vergisi matrahı | {{au.gvMatrah}} |
| Hesaplanan gelir vergisi (Ocak) | {{au.gvHesaplanan}} |
| Asgari ücret GV istisnası | − {{au.gvIstisna}} |
| Damga vergisi ({{damga.oran}}) | {{au.dvHesaplanan}} |
| Damga vergisi istisnası | − {{au.dvIstisna}} |
| **Net asgari ücret** | **{{au.net}}** |

Asgari ücretlinin kümülatif matrahı da yıl içinde büyür: Ocak'ta {{au.istisnaOcak}} olan hesaplanan vergi Aralık'ta {{au.istisnaAralik}}'e çıkar. Ancak istisna tutarı aynı yöntemle hesaplandığı için her ay hesaplanan vergiye eşittir ve **net asgari ücret yıl boyunca değişmez**.

### Asgari ücret istisnası herkese uygulanır

2022'den bu yana Gelir Vergisi Kanunu md. 23/18 ile **asgari ücretin üzerinde kazananların** ücretinin de asgari ücrete isabet eden kısmı vergiden istisnadır. Yani yüksek ücretli bir çalışanın bordrosunda da her ay {{au.istisnaOcak}} ile {{au.istisnaAralik}} arasında gelir vergisi ve {{au.dvIstisna}} damga vergisi indirimi görülür. Ayrıntılı hesap için [brütten nete maaş hesaplama](/brutten-nete-maas-hesaplama) aracını kullanabilirsiniz.

## Asgari ücretin işverene maliyeti

İşveren, brüt ücrete ek olarak SGK işveren payı ({{sgk.isveren}}) ve işsizlik sigortası işveren payı ({{sgk.isverenIssizlik}}) öder:

| Kalem | Tutar |
| --- | --- |
| Brüt asgari ücret | {{au.brut}} |
| SGK işveren payı | + {{au.sgkIsveren}} |
| İşsizlik işveren payı | + {{au.issizlikIsveren}} |
| **Toplam maliyet (teşviksiz)** | **{{au.maliyet}}** |
| {{sgk.hazine}} hazine indirimi ile | {{au.genel.maliyet}} |
| İmalat sektöründe {{sgk.hazineImalat}} indirim ile | {{au.imalat.maliyet}} |

Teşviksiz yıllık maliyet {{au.yillikMaliyet}}'dir. Hazine indirimi, SGK'ya prim borcu bulunmayan ve bildirgelerini süresinde veren özel sektör işverenlerine uygulanır; imalat sektöründe (NACE C) indirim oranı daha yüksektir.

### Asgari ücret desteği

{{yil}} yılında şartları sağlayan özel sektör işverenlerine, asgari ücretli çalışan başına aylık **{{destek.asgari}}** asgari ücret desteği verilir. Destek nakit ödenmez; işverenin SGK prim borcundan mahsup edilir. Teşviksiz maliyetten destek düşüldüğünde aylık maliyet {{au.destekliMaliyet}} olur. Destekten yararlanmak için işyerinin vadesi geçmiş prim borcunun olmaması, kayıt dışı işçi çalıştırılmaması ve bildirgelerin yasal süresinde verilmesi gibi şartlar aranır; kamu işverenleri yararlanamaz.

## Günlük, saatlik ve yıllık asgari ücret

- **Günlük:** Brüt {{asgari.gunluk}}, net {{au.netGunluk}}. Günlük ücret, aylık ücretin 30'a bölünmesiyle bulunur ve eksik gün, rapor ve izin hesaplarında kullanılır.
- **Saatlik:** Aylık 225 saat (30 gün × 7,5 saat) esas alınır: brüt {{au.brutSaatlik}}, net {{au.netSaatlik}}. Fazla mesai ücretleri bu saatlik ücretin %50 fazlasıyla ödenir; ayrıntı için [fazla mesai hesaplama](/fazla-mesai-hesaplama).
- **Yıllık:** Brüt {{au.yillikBrut}}, net {{au.yillikNet}}.

## Asgari ücretle ilgili bilinmesi gerekenler

- **Kapsam:** Asgari ücret, iş sözleşmesiyle çalışan herkesi kapsar; İş Kanunu'na tabi olmayan tarım, ev hizmetleri ve gemi adamları gibi çalışanlar da Asgari Ücret Yönetmeliği uyarınca bu ücretin altında çalıştırılamaz.
- **Daha düşük ücret yazılamaz:** Sözleşmeye asgari ücretin altında bir tutar yazılsa bile işçi farkı talep edebilir. Ücret alacaklarında zamanaşımı 5 yıldır.
- **Ödeme zamanı:** Ücret en geç ayda bir ödenir. Ödeme günü geçtiği hâlde 20 gün içinde ödenmeyen ücret için işçi iş görmekten kaçınabilir (İş Kanunu md. 34).
- **Haciz ve kesinti sınırı:** İş Kanunu md. 35'e göre ücretin dörtte birinden fazlası haczedilemez ve başkasına devredilemez; nafaka borçları bu sınırın dışındadır.
- **Prime esas kazancın alt sınırı:** Tam ay çalışan bir işçi için SGK'ya bildirilen kazanç brüt asgari ücretten ({{sgk.taban}}) düşük olamaz.

## Sık yapılan hatalar

- **Net asgari ücreti vergi kesilmiş sanmak.** Asgari ücretten gelir ve damga vergisi kesilmez; tek kesinti {{sgk.isciToplam}} sigorta primidir.
- **Asgari ücreti "tam zamanlı" dışında da zorunlu saymak.** Kısmi süreli çalışanlara asgari ücret, çalıştıkları süreyle orantılı ödenebilir.
- **Asgari geçim indirimiyle karıştırmak.** AGİ 2022'de kaldırıldı; yerini asgari ücret istisnası aldı.
- **İşveren maliyetini brüt sanmak.** İşverene maliyet brütün yaklaşık {{sgk.isverenToplam}} fazlasıdır.

İşten ayrılan asgari ücretlinin İŞKUR ödeneğini [işsizlik maaşı hesaplama](/issizlik-maasi-hesaplama) aracıyla görebilirsiniz; en yüksek brüt ödenek {{issizlik.tavan}}'dir.

## Yasal dayanak

- 4857 sayılı İş Kanunu md. 39 ve Asgari Ücret Yönetmeliği
- Asgari Ücret Tespit Komisyonu kararı ({{yil}})
- 193 sayılı Gelir Vergisi Kanunu md. 23/18; 488 sayılı Damga Vergisi Kanunu (2) sayılı tablo
- 5510 sayılı Kanun md. 81 (prim oranları ve hazine indirimi), geçici md. 112 (asgari ücret desteği)

<!-- sss -->

### {{yil}} net asgari ücret ne kadar?

{{yil}} yılı net asgari ücret aylık {{asgari.net}}'dir. Brüt asgari ücret {{asgari.brut}}'dir.

### Asgari ücretten hangi kesintiler yapılır?

Yalnız {{sgk.isci}} SGK işçi payı ve {{sgk.isciIssizlik}} işsizlik sigortası primi kesilir. Gelir vergisi ve damga vergisi istisna nedeniyle sıfırdır.

### Asgari ücretin işverene maliyeti ne kadar?

Teşviksiz aylık maliyet {{au.maliyet}}'dir. {{sgk.hazine}} hazine indirimiyle {{au.genel.maliyet}}'ye, imalat sektöründe {{au.imalat.maliyet}}'ye düşer. Şartları sağlayan işveren ayrıca {{destek.asgari}} asgari ücret desteğinden yararlanır.

### Saatlik asgari ücret ne kadar?

Aylık brüt asgari ücret 225 saate bölünür: saatlik brüt {{au.brutSaatlik}}, saatlik net {{au.netSaatlik}}'dir.

### Asgari ücret yılda kaç kez belirlenir?

Kanunda belirli bir sıklık yoktur; komisyon en az iki yılda bir toplanır. Son yıllarda genellikle yılda bir kez, bazı yıllarda Temmuz'da ara zamla iki kez belirlenmiştir. Hesaplayıcı dönem seçtiğinizde o tarihte geçerli tutarı kullanır.

### Asgari ücret desteği çalışana mı ödenir?

Hayır. Destek işverene verilir ve SGK prim borcundan düşülür; çalışanın net maaşını etkilemez.

### Asgari ücretli yıl ortasında farklı net alır mı?

Hayır. Kümülatif matrah artsa da asgari ücret istisnası hesaplanan vergiye eşit olduğu için net asgari ücret yıl boyunca {{asgari.net}} olarak kalır (asgari ücret değişmediği sürece).
