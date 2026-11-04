## Döviz çevirici nasıl çalışır?

Döviz çevirici, Türkiye Cumhuriyet Merkez Bankası'nın (TCMB) her iş günü yayımladığı **gösterge niteliğindeki kurlarla** çalışır. Kurlar sunucumuz tarafından doğrudan TCMB'nin resmi kur dosyasından alınır ve kısa süreli önbelleğe kaydedilir. Formun üst kısmında kullanılan kurun **TCMB bülten tarihi** ve verinin alındığı saat her zaman görünür.

Tutarı, kaynak ve hedef para birimini ve kur türünü seçmeniz yeterlidir. Türk lirası dahil TCMB'nin kur yayımladığı tüm para birimleri (ABD doları, euro, sterlin, İsviçre frangı, Japon yeni, Suudi riyali, BAE dirhemi, Kanada ve Avustralya doları, İskandinav kronları, ruble, yuan, manat ve diğerleri) arasında çeviri yapılabilir.

## Döviz alış, döviz satış, efektif alış ve efektif satış

TCMB her para birimi için dört ayrı kur yayımlar:

| Kur türü | Ne için kullanılır? |
| --- | --- |
| Döviz alış | Hesaptaki dövizi bozdururken (banka sizden döviz alır) |
| Döviz satış | Hesaba döviz alırken, havale ve faturalarda |
| Efektif alış | Elinizdeki nakit dövizi (banknot) bozdururken |
| Efektif satış | Nakit döviz satın alırken |

**Alış** ve **satış**, bankanın bakış açısıyla adlandırılır: alış kuru, bankanın sizden dövizi aldığı; satış kuru, size dövizi sattığı fiyattır. Bu yüzden satış kuru her zaman alış kurundan yüksektir. **Efektif** kurlar nakit banknot işlemleri içindir ve taşıma, sigorta gibi maliyetler nedeniyle aradaki makas daha geniştir.

TCMB bazı para birimleri (ör. yuan, ruble, Katar riyali, BAE dirhemi) için efektif kur yayımlamaz. Bu durumda hesaplayıcı aynı yöndeki **döviz kurunu** kullanır ve sonuçta bunu ayrıca belirtir. Özel Çekme Hakkı (XDR) için yalnızca döviz alış kuru yayımlanır.

## Çeviri formülü

Her kur, o para biriminin TCMB'nin belirttiği **birim** miktarının TL karşılığıdır. Çoğu para birimi için birim 1'dir; ancak **Japon yeni 100 birim** üzerinden yayımlanır. Hesaplayıcı önce kuru birime bölerek 1 birimin TL karşılığını bulur:

> **1 birim TL karşılığı = TCMB kuru ÷ Birim**
>
> **Dövizden TL'ye: Sonuç = Tutar × 1 birim TL karşılığı**
>
> **TL'den dövize: Sonuç = Tutar ÷ 1 birim TL karşılığı**

İki yabancı para birimi arasındaki çeviri **TRY üzerinden çapraz kurla** yapılır:

> **Çapraz kur = Kaynak para biriminin TL karşılığı ÷ Hedef para biriminin TL karşılığı**

Çapraz kurda her iki para birimi için de seçtiğiniz kur türü kullanılır. Bankalar iki döviz arasında işlem yaparken kendi çapraz kurlarını uygulayabilir.

## Örnek hesaplamalar

Aşağıdaki örneklerde **varsayımsal kurlar** kullanılmıştır; güncel sonuç için hesaplayıcıyı kullanın.

### Örnek 1: Nakit dolar almak

Efektif satış kuru {{doviz.usd.efs}} TL iken 1.500 ABD doları nakit almak için ödenecek tutar:

- 1.500 × {{doviz.usd.efs}} = **{{doviz.ornek1}} TL**

### Örnek 2: Euro'dan dolara çapraz kur

Döviz satış kurları euro için {{doviz.eur.ds}} TL, dolar için {{doviz.usd.ds}} TL olsun. Çapraz kur {{doviz.eur.ds}} ÷ {{doviz.usd.ds}} ≈ {{doviz.ornek2.kur}} olur.

- 1.000 EUR × {{doviz.eur.ds}} ÷ {{doviz.usd.ds}} = **{{doviz.ornek2}} USD**

### Örnek 3: Japon yeni (100 birim)

TCMB'de 100 yen için döviz alış kuru {{doviz.jpy.da}} TL ise 1 yen {{doviz.ornek3.birim}} TL eder.

- 50.000 JPY × {{doviz.ornek3.birim}} = **{{doviz.ornek3}} TL**

Birimi hesaba katmadan 50.000 × {{doviz.jpy.da}} yapmak sonucu 100 kat büyütür; en sık yapılan hatalardan biridir.

## TCMB kuru ile banka kuru neden farklı?

TCMB kurları, Merkez Bankası'nın piyasadaki işlemleri izleyerek günde bir kez belirlediği **gösterge** kurlardır. Bankalar ve döviz büroları ise piyasa gün içinde dalgalandıkça kurlarını anlık günceller ve alış ile satış arasına kendi makaslarını ekler. Ayrıca döviz alımlarında kambiyo işlemlerine ilişkin vergi ve banka komisyonu uygulanabilir. Bu nedenle bankada ödeyeceğiniz veya alacağınız tutar, buradaki sonuçtan bir miktar farklı olabilir. Resmî işlemlerde (ör. faturaların TL'ye çevrilmesi, vergi beyanları) genellikle TCMB döviz alış kuru esas alınır; hangi kurun kullanılacağını ilgili mevzuat veya sözleşme belirler.

## Hafta sonu ve resmî tatillerde hangi kur geçerli?

TCMB gösterge kurlarını yalnızca **iş günlerinde, saat 15.30'da** belirler ve yayımlar. Cumartesi, pazar ve resmî tatil günlerinde yeni kur yayımlanmaz; bu günlerde geçerli kur, **son iş gününün kurudur**. Örneğin pazar günü yaptığınız çeviride cuma günü yayımlanan kurlar kullanılır. Aynı şekilde hafta içi 15.30'dan önce görünen kur, bir önceki iş gününe aittir. Hesaplayıcı, kullanılan bültenin tarihini formun üstünde gösterir.

## Canlı kur alınamazsa

TCMB'ye geçici olarak ulaşılamazsa hesaplayıcı en son başarıyla alınan kurları, alındığı zamanla birlikte ve uyarı göstererek kullanır. Hiç veri yoksa bankanızın veya TCMB'nin kurunu **elle girerek** çeviriye devam edebilir, **Yeniden dene** düğmesiyle kurları tekrar yükleyebilirsiniz.

## Sık yapılan hatalar

- **Banka kuru ile TCMB kurunu karıştırmak.** TCMB kurları gösterge niteliğindedir; bankalar ve döviz büroları kendi alış-satış kurlarını uygular.
- **Yanlış kur türünü seçmek.** Nakit dolar alırken efektif satış, hesaptaki dövizi bozdururken döviz alış kuru daha gerçekçi sonuç verir.
- **Birim farkını gözden kaçırmak.** Japon yeni gibi 100 birim üzerinden yayımlanan kurları doğrudan çarpmak sonucu bozar.
- **Hafta sonu kurunu "güncel" sanmak.** Hafta sonu görünen kur, cuma günü belirlenmiştir.

Yabancı para cinsinden faturalarda vergiyi hesaplamak için [KDV hesaplama](/kdv-hesaplama), altının TL değeri için [altın hesaplama](/altin-hesaplama) aracını kullanabilirsiniz.

<!-- sss -->

### Döviz çevirici hangi kurları kullanıyor?

Türkiye Cumhuriyet Merkez Bankası'nın her iş günü 15.30'da yayımladığı gösterge niteliğindeki kurları kullanır. Kullanılan bültenin tarihi formun üstünde yazar.

### Döviz alış ile döviz satış arasındaki fark nedir?

Alış kuru, bankanın sizden döviz satın aldığı; satış kuru, size döviz sattığı kurdur. Döviz bozdururken alış, döviz alırken satış kuru esas alınır.

### Efektif kur nedir?

Efektif kur, nakit banknot alım satımında uygulanan kurdur. Hesap üzerinden yapılan işlemlerde ise döviz kurları kullanılır. Efektif kurlar arasındaki makas genellikle daha geniştir.

### Hafta sonu döviz kuru değişir mi?

TCMB hafta sonu ve resmî tatillerde kur yayımlamaz; bu günlerde son iş gününün kurları geçerlidir. Bankalar ise hafta sonu da kendi kurlarını değiştirebilir.

### Japon yeni neden 100 birim üzerinden gösteriliyor?

1 yenin TL karşılığı çok küçük olduğu için TCMB kuru 100 yen için yayımlar. Hesaplayıcı bu kuru otomatik olarak 100'e bölerek kullanır.

### İki yabancı para birimi arasında nasıl çeviri yapılır?

Çeviri Türk lirası üzerinden çapraz kurla yapılır: kaynak para biriminin TL kuru hedef para biriminin TL kuruna bölünür ve tutarla çarpılır.

### Kurlar alınamazsa ne yapabilirim?

Hesaplayıcı son başarılı veriyi uyarıyla gösterir. Hiç veri yoksa kuru elle girebilir veya "Yeniden dene" düğmesiyle kurları yeniden yükleyebilirsiniz.
