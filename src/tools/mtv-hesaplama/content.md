## MTV nedir?

Motorlu taşıtlar vergisi (MTV), trafiğe kayıtlı otomobil, motosiklet, minibüs, panelvan, otobüs, kamyonet ve kamyon gibi taşıtlar için sahiplerinin her yıl ödediği bir vergidir. Dayanağı 197 sayılı Motorlu Taşıtlar Vergisi Kanunu'dur. Vergi, aracın kullanılıp kullanılmamasına bakılmaksızın trafik siciline kayıtlı olduğu sürece doğar ve **ocak ayının başındaki** sahibi adına tahakkuk eder.

Tutarlar her yıl yeniden değerleme oranına göre güncellenir ve Gelir İdaresi'nin MTV Genel Tebliği ile ilan edilir. Hesaplayıcımız {{yil}} tarifesini kullanır.

## MTV nasıl hesaplanır?

MTV bir oran değil, **tarifeden okunan maktu tutardır**. Hangi satırın uygulanacağı araç tipine göre şu ölçülerle belirlenir:

| Araç tipi | Belirleyici ölçüler |
| --- | --- |
| Otomobil, arazi taşıtı (01.01.2018 ve sonrası tescil) | Silindir hacmi + taşıt değeri + yaş |
| Otomobil (31.12.2017 ve öncesi tescil) | Silindir hacmi + yaş |
| Elektrikli otomobil | Motor gücü (kW) + taşıt değeri + yaş; tutarın {{mtv.elektrikOran}} kadarı |
| Motosiklet | Silindir hacmi + yaş (100 cm³ altı vergi dışı) |
| Minibüs, panelvan, otobüs, kamyonet, kamyon | Oturma yeri, silindir hacmi veya azami ağırlık + yaş |

Yıllık tutar **iki eşit taksitte** ödenir: birinci taksit **Ocak**, ikinci taksit **Temmuz** ayı sonuna kadar.

### Araç yaşı nasıl bulunur?

Yaş, ruhsattaki **model yılı** esas alınarak takvim yılı üzerinden hesaplanır ve araç, model yılında **1 yaşında** kabul edilir:

> **Yaş = İçinde bulunulan yıl − Model yılı + 1**

Örneğin {{yil}} yılında {{yil}} model bir araç 1, {{mtv.o1.model}} model bir araç {{mtv.o1.yasN}} yaşındadır. Otomobil ve motosiklet tarifesinde yaş grupları 1–3, 4–6, 7–11, 12–15 ve 16 ve üzeri; minibüs, kamyon gibi (II) sayılı tarifedeki taşıtlarda 1–6, 7–15 ve 16 ve üzeridir. Araç bir üst yaş grubuna geçtiği yıl vergi belirgin biçimde düşer.

### Taşıt değeri dilimi

01.01.2018 ve sonrasında ilk kez tescil edilen otomobillerde, aynı silindir hacmindeki araçlar **taşıt değerine** göre iki veya üç dilime ayrılır. Kanuna göre taşıt değeri, aracın ilk iktisabındaki **KDV matrahını oluşturan unsurlardan** oluşur: yani ÖTV dahil, KDV hariç satış bedelidir (vade farkı nedeniyle hesaplanan ÖTV hariç).

Önemli bir ayrıntı: dilim, aracın **ilk tescil edildiği yılın** tarifesindeki sınırlara göre bir kez belirlenir ve sonraki yıllarda aynı sıradaki güncel tutar uygulanır. Bu nedenle ikinci el bir aracın bugünkü fiyatına veya ilk alım bedelini bu yılın sınırlarıyla karşılaştırmaya göre hesap yapmak yanıltıcı olabilir. Bu yıl tescil edilen araçlar için taşıt değerini girmeniz yeterlidir; önceki yıllarda tescil edilmiş araçlarda hesaplayıcıdaki "Taşıt değeri dilimi" alanından aracınızın sırasını seçin. Sırayı geçmiş yıl MTV makbuzundaki tutarı tarifeyle karşılaştırarak bulabilirsiniz.

### Elektrikli otomobiller

Elektrik motorlu otomobillerde silindir hacmi yerine **motor gücü** esas alınır. Motor gücü kanundaki eşdeğer silindir satırına çevrilir (ör. 70 kW'a kadar 1.300 cm³, 151–180 kW arası 3.000 cm³ satırı) ve bulunan tutarın **{{mtv.elektrikOran}}** kadarı ödenir.

## Örnek hesaplamalar

### Örnek 1: {{mtv.o1.model}} model 1.6 benzinli otomobil

1.598 cm³, ilk tescilde 2. taşıt değeri dilimine giren bir otomobil {{yil}} yılında {{mtv.o1.yasN}} yaşındadır (4–6 yaş grubu).

- Yıllık MTV: **{{mtv.o1.yillik}}**
- Ocak taksiti: {{mtv.o1.taksit1}}, Temmuz taksiti: {{mtv.o1.taksit2}}

### Örnek 2: {{mtv.o2.model}} model 160 kW elektrikli otomobil

160 kW motor gücü 3.000 cm³ satırına karşılık gelir. Taşıt değeri 2.000.000 TL olduğu için üst dilim uygulanır.

- Tarife tutarı: {{mtv.o2.tarifeTutari}}
- Elektrikli araçta ödenecek yıllık MTV: **{{mtv.o2.yillik}}** (taksit {{mtv.o2.taksit1}})

### Örnek 3: 2017 öncesi tescilli {{mtv.o3.model}} model 1.4 dizel

1.461 cm³ silindir hacimli, {{mtv.o3.yasN}} yaşındaki (12–15 yaş grubu) bir otomobilde taşıt değerine bakılmaz.

- Yıllık MTV: **{{mtv.o3.yillik}}**, taksitler {{mtv.o3.taksit1}}

## MTV nasıl ödenir, ödenmezse ne olur?

MTV; GİB İnteraktif Vergi Dairesi, e-Devlet, banka mobil uygulamaları ve vergi dairesi vezneleri üzerinden **plaka veya T.C. kimlik numarasıyla** ödenebilir. Ödeme süresi geçtiğinde her ay için gecikme zammı işler. MTV borcu bulunan aracın satışı noterde yapılamaz ve araç muayeneden geçmeden önce de borç sorgulanır. Engelliler, diplomatik temsilcilikler ve bazı kamu taşıtları belirli şartlarla vergiden muaftır.

## Sık yapılan hatalar

- **Taşıt değerine KDV'yi eklemek.** Dilim için esas alınan değer KDV hariç, ÖTV dahil tutardır.
- **İkinci el fiyatına göre dilim seçmek.** Dilim ilk tescildeki değere göre belirlenir ve değişmez.
- **Yaşı yanlış hesaplamak.** Model yılı 1. yaştır; {{yil}} yılında {{mtv.o1.model}} model araç 4 değil {{mtv.o1.yasN}} yaşındadır.
- **Elektrikli araçta kW yerine beygir kullanmak.** Ruhsattaki kW değeri esas alınır.

Aracın yakıt giderini [yakıt hesaplama](/yakit-hesaplama), kredili alımda taksitleri [kredi hesaplama](/kredi-hesaplama) araçlarıyla hesaplayabilirsiniz.

## Yasal dayanak

- 197 sayılı Motorlu Taşıtlar Vergisi Kanunu md. 5 ((I) tarife, taşıt değeri, elektrikli taşıtlar), md. 6 ((II) tarife), md. 10 (yeniden değerleme), geçici md. 8 ((I/A) tarife)
- MTV Genel Tebliği (Seri No: 58), RG 31.12.2025 — {{yil}} tutarları

<!-- sss -->

### {{yil}} MTV ne zaman ödenir?

Birinci taksit 1–31 Ocak, ikinci taksit 1–31 Temmuz tarihleri arasında ödenir. İki taksit eşittir; isterseniz yıllık tutarın tamamını Ocak'ta ödeyebilirsiniz.

### MTV hesaplanırken araç yaşı nasıl bulunur?

Yaş, içinde bulunulan yıldan model yılı çıkarılıp 1 eklenerek bulunur. {{yil}} yılında {{mtv.o1.model}} model bir araç {{mtv.o1.yasN}} yaşındadır.

### Elektrikli araçlar ne kadar MTV öder?

Motor gücü eşdeğer silindir hacmine çevrilir ve benzinli muadili için tarifede yazan tutarın {{mtv.elektrikOran}} kadarı ödenir. Örneğin {{yil}} model, 160 kW ve 2.000.000 TL değerli bir elektrikli otomobilin yıllık MTV'si {{mtv.o2.yillik}} olur.

### Taşıt değerine KDV ve ÖTV dahil mi?

Kanundaki tanıma göre taşıt değeri, ilk iktisaptaki KDV matrahıdır: ÖTV dahildir, KDV dahil değildir. Vade farkı nedeniyle hesaplanan ÖTV de dikkate alınmaz.

### İkinci el araç aldım, MTV'yi kim öder?

MTV, ocak ayı başındaki sahibi adına tahakkuk eder ve yıl içinde satılsa bile o yılın vergisinden bu kişi sorumludur. Noter satışında aracın vergi borcunun bulunmaması gerekir; taraflar ödemeyi kendi aralarında farklı paylaşabilir.

### 100 cm³ altı motosiklet MTV öder mi?

Hayır. Silindir hacmi 100 cm³'ün altındaki motosikletler motorlu taşıtlar vergisinin konusuna girmez.

### 2017 öncesi tescilli araçta taşıt değeri önemli mi?

Hayır. 31.12.2017 ve öncesinde tescil edilmiş otomobiller (I/A) sayılı tarifeye tabidir; vergi yalnız silindir hacmi ve yaşa göre belirlenir.
