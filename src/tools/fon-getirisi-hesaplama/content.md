## Fon getirisi nasıl hesaplanır?

Yatırım fonuna yatırdığınız para, fonun **birim pay fiyatı** üzerinden pay adedine çevrilir. Fonun portföyündeki varlıklar değer kazandıkça pay fiyatı her iş günü yeniden hesaplanır. Sattığınızda elinize geçen tutar, pay adediniz ile satış günündeki fiyatın çarpımıdır.

> **Pay adedi = Yatırım tutarı / Alış fiyatı**
>
> **Brüt kazanç = Pay adedi × Satış fiyatı − Yatırım tutarı**
>
> **Net kazanç = Brüt kazanç − Stopaj (brüt kazanç × stopaj oranı)**

**Fonunuzu TEFAS'tan seçebilirsiniz.** Fon kodunu (ör. TTE) ya da adının bir kısmını yazdığınızda hesaplayıcı TEFAS'taki yatırım fonları arasından seçmenizi sağlar; seçtiğiniz fonun stopaj grubunu unvanından belirler, alış ve satış tarihlerindeki birim pay fiyatlarını son 5 yıllık TEFAS verisinden otomatik doldurur. Tatil ve hafta sonuna denk gelen tarihlerde bir önceki iş gününün fiyatı kullanılır. Fiyat alınamazsa değerleri elle girebilirsiniz.

Fon fiyatına yönetim ücreti, saklama ve diğer fon giderleri **zaten yansıtılmıştır**. TEFAS'ta gördüğünüz getiri bu giderler düşüldükten sonraki getiridir. Aracı kurumunuz alım-satımda ayrıca komisyon alıyorsa onu sonuçtan düşmeniz gerekir.

Henüz satmadığınız ya da ileriye dönük bir tahmin yapmak istediğiniz fonlarda hesaplayıcının **yıllık getiriyle** yöntemini kullanabilirsiniz. Bu yöntem fon fiyatının günlük bileşik büyüdüğünü varsayar:

> **Satış tutarı = Yatırım tutarı × (1 + yıllık getiri)^(gün / 365)**

Geçmiş getiri geleceği garanti etmez. Para piyasası fonları faiz oranlarına yakın, istikrarlı bir seyir izlerken hisse senedi ve altın fonlarının getirisi kısa sürede sert dalgalanabilir.

## {{yil}} fon stopaj oranları

Fon payı kazancı, Gelir Vergisi Kanunu geçici 67. madde kapsamında **kaynakta kesinti (stopaj)** yoluyla vergilendirilir. Kesintiyi satış sırasında portföy yönetim şirketi ya da bankanız yapar; bu vergi **nihai** vergidir, ayrıca beyanname vermeniz gerekmez.

Hangi oranın uygulanacağını iki şey belirler:

1. **Payı aldığınız tarih.** Oran, payları aldığınız günde yürürlükte olan Cumhurbaşkanı Kararından gelir. Sonradan oran değişse bile mevcut paylarınız alıştaki oranla vergilendirilir. Farklı tarihlerde aldığınız paylar "ilk giren ilk çıkar" usulüyle eşleştirilir; her parti kendi oranını taşır.
2. **Fonun unvanı.** Gruplar fonun türüne göre değil **adına** göre ayrılır. Unvanında *değişken, karma, serbest, eurobond, dış borçlanma, yabancı* ya da *döviz* kelimesi geçen fonlar 2025'e kadar indirimli orandan yararlanamadı.

Bugün alınan paylar için geçerli oranlar:

| Fon grubu | Stopaj |
| --- | --- |
| Hisse senedi yoğun fonlar (portföyün en az %80'i BIST hissesi) | {{fon.oran.hisse}} |
| Para piyasası, borçlanma araçları, altın, katılım, fon sepeti, endeks fonları | {{fon.oran.indirimli}} |
| Değişken, karma, serbest, eurobond, yabancı ve döviz fonları | {{fon.oran.diger}} |
| Girişim sermayesi ve gayrimenkul yatırım fonları (2 yıla kadar) | {{fon.oran.gsyf}} |

Girişim sermayesi (GSYF) ve gayrimenkul yatırım fonu (GYF) paylarını **2 yıldan fazla** elde tutarsanız stopaj uygulanmaz. Hesaplayıcı bu süreyi takvim ayıyla ölçer: alıştan tam 24 ay sonra yapılan satış hâlâ stopaja tabidir, ertesi gün yapılan satış değildir.

### Alış tarihine göre oran geçmişi

| Payın alış tarihi | Para piyasası, borçlanma, altın, katılım… | Değişken, karma, serbest, eurobond, döviz | Hisse senedi yoğun |
| --- | --- | --- | --- |
{{fon.tablo}}

Geçmiş bir alış tarihi girdiğinizde hesaplayıcı o tarihteki oranı kendiliğinden kullanır. Kaynak: Gelir İdaresi Başkanlığı "GVK Geçici 67. Madde Gerçek Kişilere Yönelik Vergi Rehberi" ve ilgili Cumhurbaşkanı Kararları (3321, 8434, 9075, 9487, 10041).

## Örnek hesaplamalar

### Örnek 1: Para piyasası fonu, 100.000 TL, 1 yıl

Payları 1,25 TL'den alıp bir yıl sonra 1,60 TL'den sattığınızı düşünelim.

- Pay adedi: 100.000 / 1,25 = 80.000 pay
- Satış tutarı: 80.000 × 1,60 = {{fon.o1.satisTutari}}
- Brüt kazanç: **{{fon.o1.brutKazanc}}**
- Stopaj ({{fon.o1.stopajOran}}): {{fon.o1.stopaj}}
- Net kazanç: **{{fon.o1.netKazanc}}** (net getiri {{fon.o1.netDonemsel}})

### Örnek 2: Aynı fiyatlarla hisse senedi yoğun fon

Fiyatlar aynı olsaydı ve fon hisse senedi yoğun olsaydı stopaj kesilmezdi: brüt kazanç da net kazanç da **{{fon.o2.netKazanc}}** olurdu. Hisse senedi yoğun fonların vergi avantajı, uzun vadede ciddi bir fark yaratır; ancak bu fonların riski de belirgin biçimde yüksektir.

### Örnek 3: Değişken fon, 250.000 TL, yıllık %35 beklentiyle 182 gün

- Satış tutarı: 250.000 × 1,35^(182/365) = {{fon.o3.satisTutari}}
- Brüt kazanç: {{fon.o3.brutKazanc}}
- Stopaj ({{fon.o3.stopajOran}}): {{fon.o3.stopaj}}
- Net kazanç: **{{fon.o3.netKazanc}}**, net yıllık karşılığı {{fon.o3.netYillik}}

## Reel getiri: enflasyonu geçtiniz mi?

Nominal kazanç tek başına yanıltıcıdır. Hesaplayıcı, alış ayından sonraki aydan satış ayına kadar TÜİK'in aylık TÜFE değişimlerini birleştirerek dönem enflasyonunu bulur ve reel getiriyi gösterir:

> **Reel getiri = (1 + net getiri) / (1 + dönem enflasyonu) − 1**

Fon kazancında enflasyon düzeltmesi yapılmaz; stopaj nominal kazanç üzerinden kesilir. Bu yüzden net getiriniz enflasyonun altında kalırsa, fon size kazanç gösterse bile alım gücünüz azalmış demektir. Satış ayının TÜFE verisi henüz açıklanmadıysa hesaplayıcı son açıklanan aya kadarki enflasyonu kullanır ve bunu sonuçta belirtir. Mevduatla karşılaştırmak için [mevduat faizi hesaplama](/mevduat-faizi-hesaplama) aracını, altın fonlarını fiziki altınla kıyaslamak için [altın hesaplama](/altin-hesaplama) aracını kullanabilirsiniz.

## Sık yapılan hatalar

- **Satış tarihindeki oranı kullanmak.** Oran satışta değil, alışta belirlenir. 2024 başında aldığınız para piyasası fonunu bugün satsanız da %0 stopajla vergilendirilir.
- **Fon türüne bakıp unvanı atlamak.** Katılım ya da altın fonu olsa bile unvanında "değişken" geçen bir fon farklı gruptadır.
- **Yıllık getiriyi basit faizle uzatmak.** Fon getirisi bileşiktir; %40 yıllık getirinin 6 aylık karşılığı %20 değil, yaklaşık %18,3'tür.
- **Zararda stopaj beklemek.** Kazanç yoksa stopaj kesilmez. Aynı çeyrekteki diğer fon kazançlarından zarar mahsup edilebilir.

<!-- sss -->

### Fon getirisinden ne kadar vergi kesilir?

Bugün alınan paylarda para piyasası, borçlanma araçları, altın ve katılım fonları için {{fon.oran.indirimli}}; değişken, karma, serbest ve döviz fonları için {{fon.oran.diger}} stopaj kesilir. Hisse senedi yoğun fonlarda oran {{fon.oran.hisse}}'dır. Daha önce aldığınız paylar, alış tarihindeki oranla vergilendirilir.

### Fon kazancı için beyanname vermem gerekir mi?

Hayır. Fon kazancındaki stopaj nihai vergidir; tutarı ne olursa olsun yıllık beyanname vermeniz gerekmez. Yıl içindeki zararlarınızı kazançlarınızdan mahsup edip iade almak isterseniz, ertesi yılın 1–31 Mart döneminde isteğe bağlı beyanname verebilirsiniz.

### Stopaj oranı alış tarihine mi satış tarihine mi göre belirlenir?

Alış tarihine göre. Payları aldığınız gün yürürlükte olan Cumhurbaşkanı Kararındaki oran, sattığınız güne kadar geçerli kalır. Farklı tarihlerde aldığınız paylar ilk giren ilk çıkar usulüyle eşleştirilir.

### Hisse senedi fonlarında neden stopaj yok?

Portföyünün en az %80'ini sürekli olarak Borsa İstanbul hisselerine yatıran hisse senedi yoğun fonlar, borsaya uzun vadeli yatırımı teşvik amacıyla %0 stopaja tabidir. Bu fonların unvanında genellikle "hisse senedi yoğun" ifadesi yer alır. TEFAS dışındaki hisse yoğun serbest fonlar 27 Mart 2026'dan itibaren bu avantajdan çıkarılmıştır.

### Para piyasası fonu mu mevduat mı daha kârlı?

İkisinin brüt getirisi genellikle yakındır; fark çoğu zaman stopaj ve vadededir. Para piyasası fonunu dilediğiniz gün bozabilirsiniz, mevduatta vade bozulursa faiz yanar. Aynı tutar ve süre için bu aracın sonucunu [mevduat faizi hesaplama](/mevduat-faizi-hesaplama) sonucuyla karşılaştırın.

### Fon getirisi enflasyona göre düzeltilir mi?

Vergi açısından hayır: stopaj nominal kazanç üzerinden kesilir. Hesaplayıcımız yine de TÜFE verisiyle reel getirinizi ayrıca gösterir; böylece fonun alım gücünüzü koruyup korumadığını görebilirsiniz.

### Fonda zarar edersem ne olur?

Kazanç yoksa stopaj kesilmez. Aynı üç aylık dönemde başka fon satışlarınızdan kazanç varsa zarar bunlardan mahsup edilir; mahsup edilemeyen zarar aynı yıl içinde sonraki çeyreklere aktarılabilir.
