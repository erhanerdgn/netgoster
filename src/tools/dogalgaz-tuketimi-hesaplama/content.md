## Doğal gaz tüketimi nasıl hesaplanır?

Doğal gaz sayaçları metreküp (m³) ölçer, fatura ise kilovatsaat (kWh) üzerinden kesilir. Çünkü aynı hacimdeki gazın verdiği ısı, gazın bileşimine, sıcaklığına ve basıncına göre değişir. Hesap üç adımda yapılır:

> **Standart m³ (Sm³) = Sayaç m³ × Hacim düzeltme katsayısı (k)**
>
> **Enerji (kWh) = Sm³ × Üst ısıl değer (kWh/Sm³)**
>
> **Tutar (TL) = kWh × TL/kWh birim fiyatı**

BOTAŞ, m³ fiyatını kWh fiyatına **1 Sm³ = {{gaz.kwhM3}} kWh** ile çevirir. Hesaplayıcı da varsayılan olarak bu değeri kullanır; bu durumda tutar doğrudan **m³ × birim fiyat** olur. İstanbul'da İGDAŞ'ın {{yil}} yılında açıkladığı aylık üst ısıl değerler {{gaz.uidMin}}–{{gaz.uidMax}} kWh/Sm³ arasında değişti. k katsayısı da kışın 1'in üzerine, yazın altına iner. Bu yüzden aynı m³ farklı aylarda biraz farklı tutar çıkarır. Faturanızdaki k ve üst ısıl değeri çarpıp "1 m³ kaç kWh" alanına girerseniz sonuç faturanıza çok yaklaşır.

Hesaplayıcının üç bölümü vardır:

- **m³ → TL:** Aylık tüketiminizin tutarını kademe kontrolüyle hesaplar.
- **Bütçe → m³:** Ayırdığınız parayla kaç m³ gaz kullanabileceğinizi gösterir.
- **Kombi:** Kombi gücü, günlük çalışma süresi ve verimden günlük ve aylık gaz tüketimini tahmin eder.

## {{gaz.ay}} doğal gaz birim fiyatı (İstanbul)

Konut doğal gaz fiyatı dört kalemden oluşur. {{gaz.ay}} İstanbul (İGDAŞ) değerleri, Sm³ başına:

| Kalem | Kademe-1 | Kademe-2 |
| --- | --- | --- |
| Doğal gaz bedeli (BOTAŞ toptan satış) | {{gaz.botas1}} | {{gaz.botas2}} |
| Sistem kullanım bedeli (İGDAŞ dağıtım) | {{gaz.skb}} | {{gaz.skb}} |
| Özel tüketim vergisi (ÖTV) | {{gaz.otv}} | {{gaz.otv}} |
| KDV ({{gaz.kdv}}) dahil toplam | **{{gaz.k1}}** | **{{gaz.k2}}** |

KDV hariç Kademe-1 fiyatı {{gaz.k1Haric}}/Sm³, kWh karşılığı KDV dahil {{gaz.k1Kwh}}'dir. BOTAŞ fiyatı ülke genelinde aynıdır. Sistem kullanım bedeli ise dağıtım şirketine göre değişir ve her ay güncellenir. Bu yüzden Ankara, İzmir ya da Bursa'daki fiyat İstanbul'dan biraz farklıdır. Kendi ilinizin fiyatını dağıtım şirketinizin "satış tarifeleri" sayfasında bulup hesaplayıcıya girebilirsiniz. Kaynaklar: [BOTAŞ satış fiyat tarifesi](https://www.botas.gov.tr/Sayfa/satis-fiyat-tarifesi/439), [İGDAŞ perakende satış fiyatları](https://www.igdas.istanbul/musteri-hizmetleri/fiyat-tarifeleri/perakende-satis-fiyatlari).

## Kademeli doğal gaz tarifesi

BOTAŞ, 4 Nisan 2026'dan itibaren konutlarda **kademeli fiyat** uygular. Her il ve her ay için ayrı bir tüketim limiti vardır. Limit, EPDK'nın o ilde son 5 yılda hane başına hesapladığı aylık ortalama tüketimin %75 fazlasıdır. Kural sert işler: bir ayda limit aşılırsa **o ayın tüketiminin tamamı** Kademe-2 fiyatından faturalanır, yalnız aşan kısım değil.

Okuma dönemi iki aya yayılıyorsa her ayın limiti, ayın günlük limiti ile dönemde o aya düşen gün sayısı çarpılarak bulunur. Merkezi sistemlerde hane başına tüketim, toplam tüketimin daire sayısına bölünmesiyle hesaplanır. Şehit aileleri ile muharip ve malul gaziler kademeden muaftır.

İstanbul limitleri (BOTAŞ ve İGDAŞ):

| Ay | Aylık limit | Günlük limit |
| --- | --- | --- |
{{gaz.limitTablo}}

Bu ayın İstanbul limiti **{{gaz.limit}}**. Diğer illerin limitleri BOTAŞ'ın internet sitesinde yayımlanır; hesaplayıcıdaki limit alanına kendi ilinizin değerini yazabilirsiniz. Alanı boş bırakırsanız kademe uygulanmaz.

## Popüler değerler: kaç m³ kaç TL?

{{gaz.ay}} İstanbul konut fiyatıyla, KDV dahil:

| Tüketim | Enerji | Kademe-1 tutarı | Kademe-2 tutarı |
| --- | --- | --- | --- |
{{gaz.tablo}}

Kademe-2 sütunu, o ayın limitini aştığınızda aynı tüketim için ödeyeceğiniz tutardır.

## Örnek hesaplamalar

### Örnek 1: 100 m³ doğal gaz

100 m³ × {{gaz.k1}} = **{{gaz.o1.tl}}**. Bunun {{gaz.o1.kdvHaric}}'si gaz, dağıtım ve ÖTV, {{gaz.o1.kdv}}'si KDV'dir. Enerji karşılığı 100 × {{gaz.kwhM3}} = {{gaz.yuzKwh}}'dir.

### Örnek 2: Limiti aşan tüketim

{{gaz.ay}} limitini biraz aşan {{gaz.o2.m3}} tüketim, tamamı Kademe-2'den **{{gaz.o2.tl}}** tutar. Aynı tüketim limitin altında kalsaydı {{gaz.o2.k1}} olacaktı. Fark {{gaz.o2.fark}}. Limite yaklaştığınızda termostatı bir iki derece düşürmek faturayı ciddi biçimde etkiler.

### Örnek 3: 24 kW kombi, günde 4 saat tam güç

Günlük ısı ihtiyacı 24 × 4 = 96 kWh'dir. %90 verimle {{gaz.o3.gazKwh}} gaz enerjisi gerekir. Bu da günde {{gaz.o3.m3Gun}} gaz eder. 30 günde {{gaz.o3.m3}} tüketilir ve Kademe-{{gaz.o3.kademe}} fiyatıyla **{{gaz.o3.tl}}** tutar. Kombi gün boyu kısık çalıştığından "tam güçte saat" gerçek yanma süresinden kısadır. Yalıtımlı bir dairede kışın 3–5 saat tipik bir değerdir.

Bütçe tarafından bakarsanız aylık 2.000 TL ile bu ay İstanbul'da yaklaşık {{gaz.o4.m3}} gaz kullanılabilir.

## Son 12 ayın fiyatları (İstanbul, Kademe-1)

| Ay | BOTAŞ | Sistem kullanım | ÖTV | KDV dahil |
| --- | --- | --- | --- | --- |
{{gaz.gecmis}}

## Sık yapılan hatalar

- **Kombi gücünü sürekli tüketim sanmak:** 24 kW kombi saatte 24 kWh yakmaz. Bu, en yüksek güçtür; çoğu zaman çok daha kısık çalışır.
- **Kademe sınırını yalnız aşan kısma uygulamak:** Limit aşılınca ayın tamamı Kademe-2'den faturalanır.
- **Faturadaki kWh'yi m³ sanmak:** 100 m³ yaklaşık {{gaz.yuzKwh}}'dir. Faturadaki büyük sayı kWh'dir.
- **Başka ilin fiyatını kullanmak:** Dağıtım bedeli ilden ile değişir.

Elektrikli ısıtıcıyla karşılaştırmak için [elektrik tüketimi hesaplama](/elektrik-tuketimi-hesaplama) aracını kullanabilirsiniz. Ev bütçenizi bütün olarak görmek için [aidat hesaplama](/aidat-hesaplama) ve [kira artış hesaplama](/kira-artis-hesaplama) araçlarına bakın.

<!-- sss -->

### 1 m³ doğal gaz kaç TL?

{{gaz.ay}} itibarıyla İstanbul'da konut için KDV dahil 1 m³ doğal gaz Kademe-1'de {{gaz.k1}}, limit aşılırsa Kademe-2'de {{gaz.k2}}'dir. Diğer illerde dağıtım bedeli nedeniyle küçük farklar vardır.

### 100 m³ doğal gaz kaç TL eder?

İstanbul'da Kademe-1 fiyatıyla 100 m³ doğal gaz {{gaz.o1.tl}} eder.

### 1 m³ doğal gaz kaç kWh?

BOTAŞ tarifesi 1 Sm³ = {{gaz.kwhM3}} kWh kabul eder. Faturada ise o ayın üst ısıl değeri ve k katsayısı kullanılır. İstanbul'da üst ısıl değer {{yil}} yılında {{gaz.uidMin}}–{{gaz.uidMax}} kWh/Sm³ arasındaydı.

### Doğal gazda kademe limiti nedir?

BOTAŞ'ın il ve ay bazında belirlediği konut tüketim limitidir. Aşılırsa o ayın tüm tüketimi daha pahalı Kademe-2 fiyatından faturalanır. Bu ay İstanbul limiti {{gaz.limit}}.

### Kombi günde kaç m³ doğal gaz yakar?

24 kW bir kombi günde 4 saat tam güçte çalışırsa %90 verimle günde yaklaşık {{gaz.o3.m3Gun}} gaz yakar. Yalıtım, dış sıcaklık ve termostat ayarı bu değeri çok değiştirir.

### Doğal gaz faturasında hangi vergiler var?

Sm³ başına {{gaz.otv}} ÖTV ve tüm tutar üzerinden {{gaz.kdv}} KDV. Doğal gazda elektrikteki gibi belediye tüketim vergisi yoktur.

### Doğal gaz fiyatı neden her ay değişiyor?

BOTAŞ fiyatı aylarca sabit kalabilir. Dağıtım şirketinin sistem kullanım bedeli ise enflasyona göre her ay güncellenir. Üst ısıl değer de aylık değiştiği için aynı m³ her ay biraz farklı tutar.

### Bütçemle ayda kaç m³ doğal gaz kullanabilirim?

Hesaplayıcının "Bütçe → m³" bölümüne aylık tutarı girin. Örneğin 2.000 TL ile İstanbul'da bu ay yaklaşık {{gaz.o4.m3}} kullanılabilir. Bütçe limiti aşmaya yetecek kadar büyükse hesaplayıcı, limitte kalmanın daha ucuz olduğunu da gösterir.
