## Kıdem tazminatı nedir?

Kıdem tazminatı, iş sözleşmesi kanunda sayılan sebeplerle sona eren ve aynı işverene bağlı olarak **en az bir yıl** çalışmış işçiye, her tam hizmet yılı için ödenen toplu paradır. Dayanağı, 4857 sayılı İş Kanunu'nun geçici 6. maddesi uyarınca hâlâ yürürlükte olan **1475 sayılı İş Kanunu'nun 14. maddesidir**. Tazminatın amacı, işçinin yıllar içinde işyerine kattığı emeğin karşılığını iş ilişkisi bittiğinde güvence altına almaktır.

Kıdem tazminatı bir "ikramiye" değil, kanuni bir haktır: şartları oluştuğunda işveren ödemek zorundadır ve işçi bu haktan önceden feragat edemez.

## Kimler kıdem tazminatı alabilir?

Aynı işverende en az bir yıl çalışmış olmak tek başına yetmez; sözleşmenin aşağıdaki yollardan biriyle sona ermesi gerekir:

- İşverenin, ahlak ve iyi niyet kurallarına aykırılık (İş Kanunu md. 25/II) dışındaki bir sebeple işçiyi **işten çıkarması**,
- İşçinin **haklı nedenle** (md. 24: ücretin ödenmemesi, mobbing, sağlık sebepleri vb.) sözleşmeyi feshetmesi,
- Erkek işçinin **askerlik** nedeniyle ayrılması,
- **Emeklilik** (yaşlılık aylığı) veya emeklilik için yaş dışındaki şartları (prim günü ve sigortalılık süresi) tamamlayıp SGK'dan alınan **"kıdem tazminatı alabilir" yazısıyla** ayrılma,
- Kadın işçinin **evlendiği tarihten itibaren bir yıl içinde** kendi isteğiyle ayrılması,
- İşçinin **ölümü** (tazminat yasal mirasçılarına ödenir).

Kendi isteğiyle, haklı bir sebep olmadan istifa eden işçi kural olarak kıdem tazminatı alamaz. Çalışma süresi bir yılın altındaysa hesaplayıcımız bunu ayrıca uyarır.

## Kıdem tazminatı nasıl hesaplanır?

Hesaplama üç adımda yapılır:

1. **Hizmet süresi bulunur.** İşe giriş tarihinden, çalışılan son gün dahil olmak üzere çıkış tarihine kadar geçen süre yıl, ay ve gün olarak hesaplanır. Aynı işverenin farklı işyerlerindeki çalışmalar birleştirilir.
2. **Giydirilmiş brüt ücret bulunur.** Son brüt maaşa; yemek, yol, yakacak, düzenli prim ve ikramiye gibi süreklilik arz eden ödemelerin aylık brüt karşılığı eklenir. Örneğin yılda iki maaş ikramiye alan biri için aylık ikramiye payı = brüt maaş × 2 / 12'dir.
3. **Tavan kontrolü yapılır.** Giydirilmiş ücret, fesih tarihinde geçerli **kıdem tazminatı tavanını** aşıyorsa tavan esas alınır.

Formül:

> **Brüt kıdem tazminatı = Esas ücret × (Yıl + Ay / 12 + Gün / 365)**
>
> **Net kıdem tazminatı = Brüt tazminat − Damga vergisi ({{damga.oran}})**

Kıdem tazminatı, Gelir Vergisi Kanunu'nun 25/7. maddesi gereği **gelir vergisinden istisnadır** ve SGK primi kesilmez. Kesilen tek vergi damga vergisidir.

## {{yil}} kıdem tazminatı tavanı

Tavan, en yüksek devlet memuruna bir hizmet yılı için ödenen emeklilik ikramiyesine bağlıdır ve memur maaş katsayılarıyla birlikte **yılda iki kez (Ocak ve Temmuz)** güncellenir. Hangi tavanın uygulanacağını **işten çıkış (fesih) tarihi** belirler.

| Dönem | Kıdem tazminatı tavanı |
| --- | --- |
| 01.01.{{yil}} – 30.06.{{yil}} | {{kidem.tavan1}} |
| 01.07.{{yil}} – 31.12.{{yil}} | {{kidem.tavan2}} |

Bugün itibarıyla geçerli tavan **{{kidem.tavan}}**'dir. Hesaplayıcı, girdiğiniz çıkış tarihine göre doğru dönemin tavanını otomatik seçer; geçmiş bir tarih girerseniz o dönemin tavanı kullanılır.

## Örnek hesaplamalar

### Örnek 1: Tavanın altında, tam 5 yıl

01.03 tarihinde işe başlayıp beş yıl sonra 28.02'de işten çıkarılan, brüt maaşı 40.000 TL olan ve yan hakkı bulunmayan bir çalışan düşünelim. Süre tam 5 yıldır.

- Brüt tazminat: 40.000 × 5 = **{{kidem.ornek1.brut}}**
- Damga vergisi: {{kidem.ornek1.damga}}
- Net tazminat: **{{kidem.ornek1.net}}**

### Örnek 2: Tavanı aşan maaş, 10 yıl

Brüt maaşı 100.000 TL olan ve bugün itibarıyla 10 yılını dolduran bir yönetici için ücret tavanı aştığından hesap **{{kidem.tavan}}** üzerinden yapılır.

- Brüt tazminat: **{{kidem.ornek2.brut}}**
- Damga vergisi: {{kidem.ornek2.damga}}
- Net tazminat: **{{kidem.ornek2.net}}**

Tavan uygulanmasaydı brüt tazminat 1.000.000 TL olacaktı; tavan, yüksek ücretlilerde tazminatı önemli ölçüde sınırlar.

### Örnek 3: Küsuratlı süre ve yan haklar

10.01'de başlayıp iki yıl sonra 24.05'te ayrılan, brüt maaşı 30.000 TL ve aylık 3.000 TL yemek-yol yardımı alan çalışanın süresi 2 yıl 4 ay 15 gündür. Giydirilmiş ücret 33.000 TL'dir.

- Brüt tazminat: 33.000 × (2 + 4/12 + 15/365) = **{{kidem.ornek3.brut}}**
- Damga vergisi: {{kidem.ornek3.damga}}
- Net tazminat: **{{kidem.ornek3.net}}**

Görüldüğü gibi bir yılı aşan küsuratlar da (ay ve gün) orantılı olarak hesaba katılır.

## Sık yapılan hatalar

- **Net maaş üzerinden hesaplamak.** Kıdem tazminatı her zaman **brüt** ücret üzerinden hesaplanır. Net maaşınızı biliyorsanız önce [netten brüte maaş hesaplama](/netten-brute-maas-hesaplama) aracıyla brüt karşılığını bulun.
- **Yan hakları unutmak.** Düzenli ödenen yemek, yol ve ikramiye gibi ödemeler ücrete eklenmezse tazminat olduğundan düşük çıkar. Fazla mesai gibi düzensiz ödemeler ise kural olarak eklenmez.
- **Yanlış tavanı kullanmak.** Tavan, işe giriş tarihine veya ödemenin yapıldığı güne göre değil, **fesih tarihine** göre belirlenir.
- **Gelir vergisi kesmek.** Kıdem tazminatından gelir vergisi kesilmez; yalnızca damga vergisi kesilir.
- **İhbar tazminatıyla karıştırmak.** İhbar tazminatı ayrı bir haktır ve gelir vergisine tabidir; [ihbar tazminatı hesaplama](/ihbar-tazminati-hesaplama) sayfasında ayrıntılarını bulabilirsiniz.

## Ödeme süresi, faiz ve zamanaşımı

Kıdem tazminatı, sözleşmenin sona erdiği tarihte **peşin** ödenmelidir. Geç ödenen tazminat için, 1475 sayılı Kanun md. 14/11 uyarınca **mevduata uygulanan en yüksek faiz** işletilir. Kıdem tazminatı alacağında zamanaşımı süresi, fesih tarihinden itibaren **5 yıldır**. Anlaşmazlık durumunda dava açmadan önce arabulucuya başvurmak zorunludur.

## Yasal dayanak

- 1475 sayılı İş Kanunu md. 14 (4857 sayılı Kanun geçici md. 6 ile yürürlükte)
- 193 sayılı Gelir Vergisi Kanunu md. 25/7 (vergi istisnası)
- 488 sayılı Damga Vergisi Kanunu, (1) sayılı tablo IV-1-b ({{damga.oran}})
- Hazine ve Maliye Bakanlığı Mali ve Sosyal Haklar Genelgeleri (tavan tutarları)

<!-- sss -->

### Kıdem tazminatı tavanı {{yil}} yılında ne kadar?

01.01.{{yil}} – 30.06.{{yil}} döneminde {{kidem.tavan1}}, 01.07.{{yil}} – 31.12.{{yil}} döneminde {{kidem.tavan2}} olarak uygulanır. Hangi tavanın geçerli olduğunu işten çıkış tarihiniz belirler.

### İstifa eden işçi kıdem tazminatı alabilir mi?

Haklı bir neden olmadan istifa eden işçi kıdem tazminatı alamaz. Ancak ücretin ödenmemesi, mobbing veya sağlık sebebi gibi haklı nedenlerle istifa, askerlik, emekliliğe hak kazanma (SGK yazısıyla) ve kadın işçinin evlilikten sonraki bir yıl içinde ayrılması hâllerinde tazminat ödenir.

### Kıdem tazminatından hangi kesintiler yapılır?

Yalnızca {{damga.oran}} oranında damga vergisi kesilir. Kıdem tazminatı gelir vergisinden istisnadır ve SGK primine tabi değildir.

### 1 yıldan az çalışana kıdem tazminatı ödenir mi?

Hayır. Kıdem tazminatına hak kazanmak için aynı işverene bağlı olarak en az bir tam yıl çalışmış olmak gerekir. Bir yılı aşan sürelerde ise ay ve gün küsuratları da orantılı olarak hesaba katılır.

### Giydirilmiş brüt ücret nedir?

Son brüt maaşa; yemek, yol, yakacak yardımı, düzenli prim ve ikramiye gibi süreklilik gösteren para ve parayla ölçülebilen menfaatlerin aylık brüt karşılığının eklenmesiyle bulunan ücrettir. Kıdem tazminatı bu ücret üzerinden hesaplanır.

### Kıdem tazminatı ne zaman ödenmelidir?

İş sözleşmesinin sona erdiği tarihte peşin ödenmelidir. Geç ödenmesi hâlinde mevduata uygulanan en yüksek faiz işletilir. Alacak için zamanaşımı süresi fesih tarihinden itibaren 5 yıldır.

### Emeklilik için yaşı bekleyen kişi kıdem tazminatı alabilir mi?

Evet. Yaş dışındaki prim günü ve sigortalılık süresi şartlarını tamamladıysanız SGK'dan "kıdem tazminatı alabilir" yazısı alarak işten ayrılabilir ve tazminatınızı talep edebilirsiniz.
