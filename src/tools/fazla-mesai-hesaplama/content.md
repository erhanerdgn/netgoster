## Fazla mesai nedir?

İş Kanunu'na göre haftalık çalışma süresi en fazla **{{fm.haftalik}} saattir**. Bu sürenin üzerinde yapılan çalışmalar **fazla çalışma**, halk arasındaki adıyla fazla mesaidir. Dayanağı 4857 sayılı İş Kanunu'nun 41. maddesidir. Fazla çalışmanın her saati için normal saatlik ücretin **{{fm.zam}} fazlası** ödenir. Haftalık süre sözleşmeyle {{fm.haftalik}} saatin altında belirlenmişse (ör. 40 saat), sözleşme süresini aşıp {{fm.haftalik}} saate kadar yapılan çalışma **fazla sürelerle çalışmadır** ve {{fm.zamFs}} zamlı ödenir.

Fazla çalışma için işçinin **yazılı onayı** gerekir ve bir yılda toplam **{{fm.yillik}} saati** geçemez. Onay iş sözleşmesi yapılırken ya da sonradan alınabilir; işçi onayını otuz gün önceden bildirerek geri alabilir.

## Fazla mesai ücreti nasıl hesaplanır?

### 1. Saatlik ücret

Aylık ücretli çalışanlarda ay 30 gün, günlük çalışma 7,5 saat kabul edilir; böylece aylık **{{fm.saat}} saat** bulunur:

> **Saatlik brüt ücret = Aylık brüt ücret / {{fm.saat}}**
>
> **Günlük brüt ücret = Aylık brüt ücret / 30**

### 2. Ödeme türleri

| Çalışma türü | Ödeme |
| --- | --- |
| Fazla çalışma ({{fm.haftalik}} saat üzeri) | Saatlik ücret × {{fm.carpan}} × saat |
| Fazla sürelerle çalışma | Saatlik ücret × {{fm.carpanFs}} × saat |
| Ulusal bayram / genel tatilde çalışma | Her gün için ayrıca 1 günlük ücret |
| Hafta tatilinde çalışma | Günlük ücret × {{fm.carpan}} (her gün için) |

**Ulusal bayram ve genel tatil (UBGT)** günlerinde (ör. 1 Ocak, 23 Nisan, 1 Mayıs, 19 Mayıs, 15 Temmuz, 30 Ağustos, 29 Ekim, Ramazan ve Kurban Bayramları) işçi çalışmasa da o günün ücretini alır; çalışırsa, İş Kanunu md. 47 gereği çalıştığı her gün için **ayrıca bir günlük ücret** ödenir. **Hafta tatili** (md. 46) ise yedi günlük dönemde en az 24 saat kesintisiz dinlenmedir; bu günde çalışan işçiye uygulamada çalıştığı gün için {{fm.zam}} zamlı günlük ücret ödenir.

### 3. Net hesaplama

Fazla mesai ücreti ücret niteliğindedir: SGK ve işsizlik primi ({{sgk.isciToplam}}), gelir vergisi ve damga vergisi ({{damga.oran}}) kesilir. Ek ödeme o ayın maaşına eklendiği için vergi, maaşınızla birlikte **kümülatif matrahınızın** ulaştığı dilimden hesaplanır. Hesaplayıcı, seçtiğiniz ödeme ayına kadar aynı brütü aldığınızı varsayarak kümülatif matrahı kendisi bulur ve mesaili maaşın neti ile mesaisiz maaşın neti arasındaki farkı **yaklaşık net** olarak gösterir. Asgari ücret istisnası maaşta zaten kullanıldığından ek ödemeye ayrıca uygulanmaz.

## Örnek hesaplamalar

### Örnek 1: 45.000 TL brüt, 10 saat fazla mesai

- Saatlik ücret: 45.000 / {{fm.saat}} = {{fm.ornek1.saatlik}}
- Fazla mesai ücreti: {{fm.ornek1.saatlik}} × {{fm.carpan}} × 10 = **{{fm.ornek1.fm}}**
- Kesintiler (Ocak): SGK + işsizlik {{fm.ornek1.sgk}}, gelir vergisi {{fm.ornek1.gv}}, damga vergisi {{fm.ornek1.dv}}
- **Yaklaşık net: {{fm.ornek1.netEk}}**; Ocak toplam neti {{fm.ornek1.maasNet}} yerine {{fm.ornek1.toplamNet}} olur.

### Örnek 2: Asgari ücretli, 2 gün bayram çalışması

Brüt asgari ücretli ({{asgari.brut}}) bir çalışan iki bayram gününde çalıştığında günlük ücreti {{fm.ornek2.gunluk}} olduğundan **{{fm.ornek2.bayram}}** ek ödeme alır. Kesintiler sonrası yaklaşık net {{fm.ornek2.netEk}}'dir. Asgari ücret istisnası yalnız asgari ücret kısmına uygulandığı için ek ödemeden gelir vergisi ({{fm.ornek2.gv}}) ve damga vergisi ({{fm.ornek2.dv}}) kesilir.

### Örnek 3: 60.000 TL brüt, 8 saat mesai ve 1 hafta tatili

- Saatlik ücret {{fm.ornek3.saatlik}}, günlük ücret {{fm.ornek3.gunluk}}
- Fazla mesai: {{fm.ornek3.fm}}; hafta tatili çalışması: {{fm.ornek3.haftaTatili}}
- Toplam brüt ek ödeme: **{{fm.ornek3.ek}}**, yaklaşık net **{{fm.ornek3.netEk}}**

## Serbest zaman kullanımı

İşçi isterse fazla çalışma ücreti yerine **serbest zaman** kullanabilir: fazla çalıştığı her saat için 1 saat 30 dakika, fazla sürelerle çalıştığı her saat için 1 saat 15 dakika (md. 41/4). Serbest zaman altı ay içinde, çalışma süreleri içinde ve ücretten kesinti yapılmadan kullandırılır.

## Fazla mesai yapılamayacak durumlar

- 18 yaşından küçük işçiler,
- Gebe, yeni doğum yapmış ve çocuk emziren işçiler,
- Sağlık kuralları bakımından günde 7,5 saat veya daha az çalışılması gereken işlerde çalışanlar,
- Gece çalışmasında (gece çalışması 7,5 saati aşamaz),
- Kısmi süreli iş sözleşmesiyle çalışanlar.

## Sık yapılan hatalar

- **Saatlik ücreti 240 veya 180 saate bölerek bulmak.** İş Kanunu'na göre aylık ücret {{fm.saat}} saate bölünür.
- **Net maaş üzerinden zam hesaplamak.** Zam brüt saatlik ücrete uygulanır; net sonradan bulunur.
- **Bayram çalışmasını tek yevmiye sanmak.** Bayram günü ücreti zaten maaşa dahildir; çalışılan her gün için ayrıca bir günlük ücret ödenir.
- **Vergiyi sabit {{gv.oran1}} kabul etmek.** Yılın ilerleyen aylarında ek ödeme {{gv.oran2}} veya {{gv.oran3}} dilimine girebilir.
- **"Ücrete dahil" maddesini sınırsız saymak.** Sözleşmede fazla mesainin ücrete dahil olduğu yazsa bile bu, yargı kararlarına göre yıllık {{fm.yillik}} saatle sınırlıdır; aşan kısım ayrıca ödenmelidir.

Aylık maaşınızın dökümü için [brütten nete maaş hesaplama](/brutten-nete-maas-hesaplama), izin haklarınız için [yıllık izin hesaplama](/yillik-izin-hesaplama), saatlik asgari ücret için [asgari ücret hesaplama](/asgari-ucret-hesaplama) araçlarını kullanabilirsiniz.

## Yasal dayanak

- 4857 sayılı İş Kanunu md. 41 (fazla çalışma), md. 46 (hafta tatili), md. 47 (genel tatil), md. 63 (çalışma süresi)
- İş Kanununa İlişkin Fazla Çalışma ve Fazla Sürelerle Çalışma Yönetmeliği
- 2429 sayılı Ulusal Bayram ve Genel Tatiller Hakkında Kanun
- 193 sayılı Gelir Vergisi Kanunu md. 103; 5510 sayılı Kanun md. 80–82

<!-- sss -->

### Fazla mesai ücreti yüzde kaç zamlıdır?

Haftalık {{fm.haftalik}} saati aşan her saat için saatlik ücretin {{fm.zam}} fazlası ödenir. Sözleşmede haftalık süre {{fm.haftalik}} saatin altındaysa, {{fm.haftalik}} saate kadar olan kısım {{fm.zamFs}} zamlıdır.

### Saatlik ücret nasıl bulunur?

Aylık brüt ücret {{fm.saat}} saate bölünür. Örneğin brüt asgari ücretin ({{asgari.brut}}) saatlik karşılığı bu yolla bulunur.

### Yılda en fazla kaç saat fazla mesai yapılabilir?

Bir yılda en fazla {{fm.yillik}} saat fazla çalışma yapılabilir. Bu sınır, işçinin onayı olsa bile aşılamaz.

### Bayramda çalışınca ne kadar ücret alınır?

Ulusal bayram ve genel tatil günlerinde çalışan işçiye, o günün normal ücretine ek olarak çalıştığı her gün için bir günlük ücret daha ödenir. Yani o gün için toplamda iki yevmiye alınır.

### Fazla mesai ücretinden vergi kesilir mi?

Evet. Fazla mesai ücreti normal ücret gibi SGK ve işsizlik primine, gelir vergisine ve damga vergisine tabidir. Vergi oranı yıl içinde biriken matrahınıza bağlıdır.

### Fazla mesai yerine izin kullanabilir miyim?

Evet. İsterseniz her fazla çalışma saati için 1 saat 30 dakika serbest zaman kullanabilirsiniz. Serbest zaman altı ay içinde ve ücretinizden kesinti yapılmadan verilmelidir.

### Fazla mesai yapmayı reddedebilir miyim?

Fazla çalışma için yazılı onayınız gerekir. Onay vermediyseniz fazla mesaiyi reddetmeniz fesih sebebi sayılamaz. Zorunlu nedenler veya olağanüstü hâllerde ise işçinin onayı aranmayabilir.
