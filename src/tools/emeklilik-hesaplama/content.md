## Emeklilik nasıl hesaplanır?

Türkiye'de yaşlılık aylığına (emekli maaşına) hak kazanmak için gereken şartları üç bilgi belirler:

1. **İlk sigorta giriş tarihi:** Hangi statüde olursa olsun ilk kez sigortalı olduğunuz gün. Kurallar bu tarihe göre üç döneme ayrılır.
2. **Sigorta türü (statü):** 4/a (SSK, işçi), 4/b (Bağkur, kendi adına çalışan) veya 4/c (Emekli Sandığı, memur).
3. **Cinsiyet:** Kadın ve erkek için gün, süre ve yaş şartları farklıdır.

Bu üç bilgiyle gerekli şartlar bulunur; ardından **prim gününüz** ve **doğum tarihiniz** ile hangi şartları sağladığınız, hangilerinde eksiğiniz olduğu hesaplanır. Hesaplayıcı, eksik prim gününü bugünden itibaren yılda kaç gün prim ödeyeceğiniz varsayımıyla (varsayılan 360 gün) tamamlar ve tüm şartların sağlandığı en erken tarihi gösterir.

## Üç dönem: hangi kural size uygulanır?

| İlk giriş tarihi | Uygulanan hüküm | Yaş şartı |
| --- | --- | --- |
| 08.09.1999 öncesi | EYT (7438 s. Kanun) ve eski kanunların geçiş hükümleri | Yok |
| 08.09.1999 – 30.04.2008 | 5510 s. Kanun geçici 9. madde | Kadın {{em.gecisYasK}}, erkek {{em.gecisYasE}} |
| 01.05.2008 ve sonrası | 5510 s. Kanun 28. madde | Kademeli, {{em.yeniIlkYasK}}/{{em.yeniIlkYasE}}'tan {{em.yeniSonYas}}'e |

### 08.09.1999 öncesi girişliler (EYT)

2023'te yürürlüğe giren düzenlemeyle bu gruptan **yaş şartı kaldırıldı**. Geriye prim günü ve (4/a için) sigortalılık süresi kalır:

- **4/a:** Kadınlarda {{em.eytKadinSure}} yıl, erkeklerde {{em.eytErkekSure}} yıl sigortalılık süresi ve giriş tarihine göre kademeli prim günü. Gerekli gün kadınlarda {{em.eytKadinMin}}–{{em.eytKadinMax}}, erkeklerde {{em.eytErkekMin}}–{{em.eytErkekMax}} arasındadır; kademe tarihleri cinsiyete göre farklıdır ve giriş tarihi 08.09.1999'a yaklaştıkça gerekli gün artar. Sizin kademeniz sonuç tablosunda işaretlenir.
- **4/b ve 4/c:** Kadınlarda {{em.eytBKKadin}}, erkeklerde {{em.eytBKErkek}} gün (tam yıl hizmet).

### 08.09.1999 – 30.04.2008 arası girişliler

4/a sigortalıları iki yoldan biriyle emekli olabilir: kadın {{em.gecisYasK}}, erkek {{em.gecisYasE}} yaşını doldurup **{{em.gecis4aGun}} gün** prim ödemek ya da aynı yaşla birlikte **{{em.gecisAltSure}} yıl sigortalılık süresi ve {{em.gecisAltGun}} gün** prim ödemek. Hesaplayıcı iki yolu da hesaplar ve daha erken olanı seçer. 4/b ve 4/c için aynı yaşla birlikte {{em.gecis4bGun}} gün gerekir.

### 01.05.2008 ve sonrası girişliler

Prim günü şartı 4/a için {{em.yeni4aGun}}, 4/b ve 4/c için {{em.yeni4bGun}} gündür. Yaş şartı ise **prim günü şartını tamamladığınız yıla** göre kademeli olarak yükselir:

{{em.yasTablosu}}

Bu nedenle bu grupta emeklilik yaşı, prim gününüzü ne kadar hızlı doldurduğunuza bağlıdır. Hesaplayıcıdaki "yıllık prim günü" alanını düşürdüğünüzde tamamlanma yılı ileri kayar ve gerekli yaş artabilir.

## Örnek hesaplamalar

### Örnek 1: EYT kapsamında 4/a erkek

15.01.1998'de işe girmiş, bugün itibarıyla 5.000 prim günü olan bir erkek sigortalı için gerekli prim günü **{{em.a.gerekliGun}}**'dür. {{em.eytErkekSure}} yıllık sigortalılık süresi 2023'te dolmuştur; yaş şartı yoktur. Eksik **{{em.a.eksikGun}} gün**, yılda 360 gün çalışmayla yaklaşık **{{em.a.tarih}}** tarihinde tamamlanır.

### Örnek 2: 2000 girişli 4/a erkek, alternatif yol

10.01.2000'de sigortalı olan, 20.03.1968 doğumlu ve 5.000 prim günü olan erkek için {{em.gecis4aGun}} günlük yolda {{em.b.gunTarih}} tarihine kadar beklemek gerekirken {{em.gecisAltSure}} yıl + {{em.gecisAltGun}} gün yolunda gün ve süre şartları zaten tamamdır. Bu yolda yalnız {{em.gecisYasE}} yaş beklenir: tahmini emeklilik tarihi **{{em.b.tarih}}**.

### Örnek 3: 2020 girişli 4/b kadın

01.01.2020'de Bağkur'lu olan, 07.07.1995 doğumlu ve 1.800 prim günü olan bir kadın, yılda 360 gün prim öderse {{em.yeni4bGun}} günü {{em.c.yil}} yılında tamamlar. Tablodaki karşılığı **{{em.c.yas}} yaş**tır; tahmini emeklilik tarihi **{{em.c.tarih}}** olur.

## Hesaplamaya dahil olmayanlar

Hesaplayıcı en yaygın durum olan normal yaşlılık aylığını hesaplar. Aşağıdakiler **kapsam dışıdır** ve sonucu değiştirebilir:

- **Borçlanmalar** (askerlik, doğum, yurt dışı, avukatlık stajı vb.): Prim gününü artırır; ilk girişten önceki askerlik ve yurt dışı süreleri borçlanıldığında sigortalılık başlangıcı da geriye çekilir.
- **Fiili hizmet süresi zammı** (madenciler, emniyet mensupları, gazeteciler vb.) ve buna bağlı yaş indirimi.
- **Malullük aylığı**, engellilik nedeniyle erken emeklilik ve engelli çocuğu olan annelere tanınan ek gün.
- **Kısmi emeklilik** (ör. 15 yıl + 3600 gün ya da 25 yıl + 5400 gün yolları).
- **2925 sayılı Tarım İşçileri Kanunu** kapsamındaki hizmetler.

Birden çok statüde çalışanlarda hangi statünün esas alınacağı, son 7 yıldaki hizmetlere göre belirlenir; bu durumda SGK'dan teyit almanız önerilir.

## Sık yapılan hatalar

- **İlk işe giriş tarihini yanlış almak.** Esas alınan, herhangi bir statüdeki **ilk** sigorta girişidir; son iş yerinize giriş tarihi değil.
- **Prim gününü takvim günüyle karıştırmak.** Bir yılda en fazla 360 prim günü yazılır; yarı zamanlı ya da aralıklı çalışmalarda bu sayı düşer.
- **EYT'yi herkes için yaşsız emeklilik sanmak.** EYT yalnız 08.09.1999 öncesi girişlileri kapsar; sonrasında yaş şartı devam eder.
- **Yaş tablosunu doğum yılına göre okumak.** 2008 sonrası girişlilerde tablo, doğum yılına değil prim günü şartının tamamlandığı yıla göre uygulanır.

Kıdem tazminatı hakkınızı öğrenmek için [kıdem tazminatı hesaplama](/kidem-tazminati-hesaplama), Bağkur prim tutarınız için [Bağkur prim hesaplama](/bagkur-prim-hesaplama) araçlarını kullanabilirsiniz.

## Yasal dayanak

- 5510 sayılı Sosyal Sigortalar ve Genel Sağlık Sigortası Kanunu md. 28 ve geçici 9. madde
- 506 sayılı Sosyal Sigortalar Kanunu geçici 81. madde (4/a kademeleri)
- 1479 sayılı Bağ-Kur Kanunu geçici 10. madde, 5434 sayılı T.C. Emekli Sandığı Kanunu geçici 205. madde
- 7438 sayılı Kanun (EYT düzenlemesi, Resmî Gazete 03.03.2023)

<!-- sss -->

### EYT'den kimler yararlanabilir?

İlk sigorta giriş tarihi 08.09.1999'dan önce olan ve prim günü ile (4/a için) sigortalılık süresi şartlarını tamamlayan herkes yaş şartı aranmadan emekli olabilir. Giriş tarihi bu günden sonra olanlar EYT kapsamında değildir.

### Emeklilik için kaç gün prim gerekir?

İlk girişiniz 01.05.2008 ve sonrasıysa 4/a için {{em.yeni4aGun}}, 4/b ve 4/c için {{em.yeni4bGun}} gün gerekir. 1999–2008 arası 4/a girişlilerde {{em.gecis4aGun}} gün, 1999 öncesi girişlilerde ise kademeli gün tablosu uygulanır.

### Prim günümü nereden öğrenirim?

e-Devlet'te "SGK Tescil ve Hizmet Dökümü" hizmetinden toplam prim gününüzü ve ilk giriş tarihinizi görebilirsiniz. Hesaplayıcıya bu belgedeki toplam gün sayısını girin.

### Yıllık prim günü alanı ne işe yarar?

Eksik prim gününüzü hangi hızla tamamlayacağınızı belirler. Kesintisiz tam zamanlı çalışmada yılda 360 gün yazılır; ara vermeyi veya yarı zamanlı çalışmayı düşünüyorsanız değeri düşürerek tahmini tarihin nasıl değiştiğini görebilirsiniz.

### Askerlik borçlanması emeklilik tarihimi değiştirir mi?

Borçlanılan süre prim gününüze eklenir. İlk girişten önceki askerlik süresi borçlanıldığında sigortalılık başlangıcı da borçlanılan gün kadar geriye çekilir. Bu araç borçlanmaları hesaba katmaz; borçlanma sonrası güncel gün ve giriş tarihinizi girerek yeniden hesaplayın.

### 2008 sonrası girişlilerde emeklilik yaşı neden değişiyor?

5510 sayılı Kanun'un 28. maddesine göre yaş şartı, prim günü şartının tamamlandığı yıla göre kademeli olarak yükselir. Gün şartını ne kadar erken tamamlarsanız o kadar düşük yaş şartı uygulanır; en yüksek sınır {{em.yeniSonYas}} yaştır.

### Hem SSK hem Bağkur hizmetim var, hangisine göre emekli olurum?

Kural olarak son 7 yıllık hizmet süresinde en fazla prim ödediğiniz statüye göre aylık bağlanır. Eşitlik veya özel durumlarda farklı kurallar uygulanabileceğinden SGK'dan teyit almanız önerilir.
