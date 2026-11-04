## Aidat nasıl hesaplanır?

Apartman veya site aidatı, binanın ortak giderlerinin kat malikleri arasında paylaştırılmasıyla bulunur. Hesaplama iki adımdan oluşur: önce bir aylık **toplam ortak gider** belirlenir, ardından bu tutar seçilen **paylaştırma yöntemine** göre bağımsız bölümlere (dairelere, dükkânlara) dağıtılır.

Ortak giderler genellikle şu kalemlerden oluşur: kapıcı veya görevli ücreti ve SGK primi, ortak alan elektriği, ortak su, temizlik malzemesi, asansör bakımı ve periyodik kontrolü, bina sigortası, yönetici ücreti, bahçe bakımı, küçük onarımlar ve yedek akçe. Hesaplayıcıda bu kalemleri tek tek yazabilir ya da toplam tutarı doğrudan girebilirsiniz.

## Yasal dayanak: Kat Mülkiyeti Kanunu md. 20

Ortak giderlere katılım **634 sayılı Kat Mülkiyeti Kanunu'nun 20. maddesinde** düzenlenir. Kat malikleri aralarında başka türlü anlaşmadıkça:

- **Kapıcı, kaloriferci, bahçıvan ve bekçi giderlerine** ve bunlar için toplanacak avansa **eşit** olarak katılır,
- **Ana gayrimenkulün sigorta primlerine**, ortak yerlerin bakım, koruma, güçlendirme ve onarım giderlerine, yönetici aylığına ve ortak tesislerin işletme giderlerine **arsa payı oranında** katılır.

Kat maliki, ortak yerlerden veya tesislerden yararlanmadığını ya da bunlara ihtiyacı olmadığını ileri sürerek gider payını ödemekten kaçınamaz. Ödenmeyen aidat için kanun, **aylık %5 gecikme tazminatı** öngörür ve diğer malikler ya da yönetici dava açabilir veya icra takibi başlatabilir.

"Aksi kararlaştırılmadıkça" ifadesi önemlidir: **yönetim planı** veya kat malikleri kurulu kararıyla farklı bir paylaşım (ör. metrekareye göre ya da tüm giderlerin eşit bölünmesi) belirlenebilir. Bu nedenle hesaplamadan önce binanızın yönetim planını kontrol edin.

## Paylaştırma yöntemleri ve formüller

### Eşit paylaşım

> **Daire aidatı = Toplam gider ÷ Daire sayısı**

### Arsa payı oranında paylaşım

> **Daire aidatı = Toplam gider × (Dairenin arsa payı ÷ Tüm arsa paylarının toplamı)**

Arsa payı tapuda "120/2400" gibi kesirli yazılır. Hesaplayıcıya payı (120) girmeniz yeterlidir; oran, girdiğiniz tüm payların toplamına bölünerek bulunur. Doğru sonuç için **bütün bağımsız bölümleri** (dükkân, depo, çatı katı dahil) eklemelisiniz.

### Metrekare oranında paylaşım

> **Daire aidatı = Toplam gider × (Dairenin m²'si ÷ Toplam m²)**

Yönetim planında metrekare esası öngörülmüşse bu yöntemi seçin. Hangi alanın (brüt veya net) kullanılacağı da yönetim planına göre belirlenir.

### Kuruş farkı nasıl kapatılır?

Paylar kuruşa yuvarlandığında daire aidatlarının toplamı, gerçek giderden birkaç kuruş sapabilir. Hesaplayıcı her payı kuruşa yuvarlar, aradaki farkı **en büyük paya sahip daireye**, paylar eşitse **listedeki son daireye** ekler veya ondan düşer. Böylece tablodaki aidatların toplamı gidere birebir eşit olur ve kasada açık kalmaz.

## Örnek hesaplamalar

### Örnek 1: Altı daireli apartman, eşit paylaşım

Aylık gideri 15.000 TL olan altı daireli bir apartmanda giderler eşit paylaşılıyorsa her daire **{{aidat.ornek1.aylik}}** öder. Yıllık aidat daire başı **{{aidat.ornek1.yillik}}** olur.

### Örnek 2: Arsa payına göre paylaşım

Sekiz bağımsız bölümlü bir binada arsa payları 80, 80, 100, 100, 100, 100, 120 ve 120 (toplam {{aidat.ornek2.payToplam}}) olsun. Aylık 24.000 TL'lik gider arsa payı oranında paylaştırılırsa:

| Arsa payı | Aylık aidat |
| --- | --- |
| 80 | {{aidat.ornek2.d80}} |
| 100 | {{aidat.ornek2.d100}} |
| 120 | {{aidat.ornek2.d120}} |

En büyük paya sahip dairenin yıllık aidatı {{aidat.ornek2.d120yillik}} olur.

### Örnek 3: Tam bölünmeyen tutar

Üç daireli bir binada 10.000 TL'lik gider eşit bölünürse ilk iki daire **{{aidat.ornek3.ilk}}**, son daire **{{aidat.ornek3.son}}** öder. Bir kuruşluk fark son daireye eklenerek toplam tam 10.000 TL'ye tamamlanır.

## Karma paylaşım: farklı giderler farklı yönteme tabiyse

Kanundaki varsayılan kurala göre kapıcı gideri eşit, sigorta ve bakım-onarım giderleri arsa payı oranında paylaşılır. Bu durumda giderleri iki gruba ayırın: kapıcı, kaloriferci, bahçıvan ve bekçi giderlerini **eşit** yöntemle, diğer giderleri **arsa payı** yöntemiyle ayrı ayrı hesaplayın ve her dairenin iki tutarını toplayın. Kalorifer yakıtı gibi tüketime bağlı giderler için yönetim planındaki veya pay ölçer sistemindeki esaslar uygulanır.

## İşletme projesi ve aidatın kesinleşmesi

Aidat tutarı genellikle yöneticinin hazırladığı yıllık **işletme projesiyle** belirlenir. Kat Mülkiyeti Kanunu md. 37'ye göre işletme projesi, gelecek yılın tahmini giderlerini ve her kat malikinin ödeyeceği avans payını gösterir. Kat malikleri kurulunda kabul edilen veya maliklere tebliğinden sonra süresinde itiraz edilmeyen proje kesinleşir ve icra takibinde belge olarak kullanılabilir. Hesaplayıcıyla oluşturduğunuz daire bazlı tablo, işletme projesinin dağıtım cetvelini hazırlarken pratik bir başlangıç noktasıdır.

## Sık yapılan hatalar

- **Tüm giderleri eşit bölmek.** Yönetim planında aksi yazmıyorsa kapıcı dışındaki genel giderler arsa payına göre bölünmelidir; büyük dairelerin daha fazla ödemesi bu yüzdendir.
- **Bazı bağımsız bölümleri unutmak.** Dükkân veya boş daireler de gidere katılır. Eksik bölüm, diğerlerinin payını haksız biçimde artırır.
- **Boş daireyi muaf tutmak.** Kullanılmayan dairenin maliki de ortak giderlerden sorumludur; kullanmadığını ileri sürerek ödemeden kaçınamaz.
- **Yuvarlama farkını gözden kaçırmak.** Kuruş farkları aylar içinde birikerek kasada açık oluşturabilir; farkı bir daireye ekleyin.
- **Kiracı-malik ayrımını karıştırmak.** Kira sözleşmesinde aidatı kiracı üstlenmiş olsa bile kat maliki, ödenmeyen gider payından yönetime karşı sorumlu olmaya devam eder. Kira artışlarını hesaplamak için [kira artış hesaplama](/kira-artis-hesaplama) aracını kullanabilirsiniz.

<!-- sss -->

### Aidat arsa payına göre mi, eşit mi ödenir?

Kat Mülkiyeti Kanunu md. 20'ye göre aksi kararlaştırılmadıkça kapıcı, kaloriferci, bahçıvan ve bekçi giderleri eşit; sigorta, ortak yerlerin bakım-onarımı, yönetici aylığı ve ortak tesislerin işletme giderleri arsa payı oranında ödenir. Yönetim planı farklı bir kural koyabilir.

### Arsa payımı nereden öğrenebilirim?

Arsa payı, tapu senedinde "arsa payı" bölümünde kesir olarak yazar (ör. 120/2400). Tapu senedinize ulaşamıyorsanız e-Devlet'teki Tapu Bilgileri Sorgulama hizmetinden de görebilirsiniz.

### Boş daire aidat öder mi?

Evet. Kat maliki, bağımsız bölümünü kullanmadığını veya ortak yerlerden yararlanmadığını ileri sürerek gider payını ödemekten kaçınamaz.

### Aidat ödenmezse ne olur?

Kanuna göre ödenmeyen gider payı için aylık %5 gecikme tazminatı işler. Yönetici veya diğer kat malikleri, borçlu hakkında dava açabilir veya icra takibi başlatabilir.

### Zemin kattaki daire asansör giderine katılır mı?

Kanunun genel kuralına göre ortak tesislerin işletme giderlerine arsa payı oranında katılınır ve kullanılmama gerekçesiyle ödemeden kaçınılamaz. Ancak yönetim planında zemin kat için ayrı bir düzenleme bulunabilir; yönetim planınızı kontrol edin.

### Yuvarlama nedeniyle oluşan kuruş farkı kime yansıtılır?

Hesaplayıcı farkı en büyük paya sahip daireye, paylar eşitse son daireye ekler veya ondan düşer. Böylece daire aidatlarının toplamı aylık gidere tam olarak eşit olur.
