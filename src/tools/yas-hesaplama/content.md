## Yaş nasıl hesaplanır?

Yaş, doğum tarihinizden hesap tarihine kadar **dolan tam yıl, ay ve gün** sayısıdır. Hesaplayıcı üç adımda çalışır:

1. **Tam yıl:** Hesap tarihine kadar kaç doğum günü geçtiği sayılır. Bu yılki doğum gününüz henüz gelmediyse o yıl sayılmaz.
2. **Tam ay:** Son doğum gününüzden sonra kaç "ay dönümü" (doğduğunuz günün her ayki karşılığı) geçtiği bulunur.
3. **Kalan gün:** Son ay dönümünden hesap tarihine kadar geçen gün sayısı eklenir.

Doğduğunuz gün 0 yaşındasınız; ilk doğum gününüzde 1 yaşını doldurursunuz. Türkiye'de nüfus kayıtları, okul kayıtları, ehliyet ve emeklilik gibi işlemlerde de bu "dolan yaş" esas alınır; "girilen yaş" (bu yıl kaç yaşına basacağınız) ise yalnızca yıl farkıdır ve doğum gününüz gelmeden bir fazla çıkabilir.

## Formül

Matematiksel olarak yaş, takvim temelli bir farktır; günleri 365'e bölmek doğru sonuç vermez, çünkü artık yıllar ve ayların farklı uzunlukları hesaba katılmalıdır.

> **Tam yıl** = Hesap yılı − Doğum yılı (doğum günü bu yıl henüz gelmediyse − 1)
>
> **Tam ay** = Son doğum gününden sonra dolan ay dönümleri
>
> **Gün** = Son ay dönümünden hesap tarihine kadar geçen gün

Toplam değerler ise doğrudan gün farkından türetilir:

- **Yaşanan gün** = Hesap tarihi − Doğum tarihi (takvim günü olarak)
- **Hafta** = Yaşanan gün ÷ 7 (kalan gün ayrıca gösterilir)
- **Toplam ay** = Tam yıl × 12 + Tam ay
- **Saat** = Yaşanan gün × 24 (doğum saati bilinmediği için yaklaşık)

Ay sonuna denk gelen doğum günlerinde (ör. 31 Ocak) bir sonraki ayda o gün yoksa ay dönümü **ertesi ayın 1'i** kabul edilir. Böylece sonuç hiçbir zaman negatif gün içermez ve her gün bir öncekinden büyük çıkar.

## Örnek hesaplamalar

### Örnek 1: 15 Mayıs 1990 doğumlu, bugün itibarıyla

{{yas.bugun}} tarihi itibarıyla 15.05.1990 doğumlu birinin yaşı:

- Tam yaş: **{{yas.ornek1.yil}} yıl {{yas.ornek1.ay}} ay {{yas.ornek1.gun}} gün**
- Toplam: {{yas.ornek1.toplamAy}} ay, {{yas.ornek1.hafta}} hafta, **{{yas.ornek1.toplamGun}} gün**, yaklaşık {{yas.ornek1.saat}} saat
- Doğduğu gün: {{yas.ornek1.dogumGunu}}
- Bir sonraki doğum günü: {{yas.ornek1.sonraki}} {{yas.ornek1.sonrakiGun}}, **{{yas.ornek1.kalan}} gün** sonra

### Örnek 2: 29 Şubat doğumlu, artık olmayan yılda

29.02.2000 doğumlu biri 2027'de (artık yıl değil) yaşını ne zaman doldurur?

- 28.02.2027 itibarıyla: **{{yas.ornek2.yil}} yıl {{yas.ornek2.ay}} ay {{yas.ornek2.gun}} gün** — yaş henüz dolmamıştır.
- 01.03.2027 itibarıyla: **{{yas.ornek3.yil}} yıl {{yas.ornek3.ay}} ay {{yas.ornek3.gun}} gün** — yeni yaş bu gün dolar.

Doğum günü artık yıllarda 29 Şubat'ta kutlanır; diğer yıllarda yaşın dolduğu gün **1 Mart**'tır.

## 29 Şubat doğumlular için kural

29 Şubat yalnızca dört yılda bir gelir. Artık olmayan yıllarda hangi günün "doğum günü" sayılacağı konusunda iki yaklaşım vardır:

- **1 Mart yaklaşımı (hesaplayıcımızın kullandığı):** Doğduğunuz günün karşılığı o yıl takvimde yoktur; 28 Şubat günü bittiğinde henüz 29 Şubat'a "ulaşmış" sayılmazsınız. Tam yıl ancak ertesi gün, 1 Mart'ta dolar. Matematiksel olarak tutarlı olan budur.
- **28 Şubat yaklaşımı:** Bazı ülkelerin mevzuatı, bazı kurumlar ve birçok sosyal medya uygulaması doğum gününü 28 Şubat'a çeker.

Yaşın bir gün farkla önem taşıdığı işlemlerde (ehliyet, seçme hakkı, okul kaydı, sigorta) ilgili kurumun uygulamasını teyit etmenizi öneririz. Hesaplayıcı 29 Şubat doğumlularda bu kuralı sonuç kartında ayrıca hatırlatır.

## Sık yapılan hatalar

- **Yalnızca yılları çıkarmak:** 2026 − 1990 = 36 hesabı, doğum günü henüz gelmediyse bir fazla sonuç verir. Doğum gününün geçip geçmediğine bakılmalıdır.
- **Günleri 365'e bölmek:** Artık yıllar nedeniyle uzun sürelerde birkaç günlük kayma oluşur ve doğum gününden önceki günlerde yaş bir fazla görünebilir.
- **Ayları 30 gün kabul etmek:** Aylar 28–31 gün arasında değişir; ay ve gün kısmı takvime göre bulunmalıdır.
- **Hesap tarihini kontrol etmemek:** Geçmiş veya gelecekteki bir tarihteki yaşı soruyorsanız hesap tarihini değiştirin; varsayılan değer bugündür.

## Yaşı ay ve gün olarak bilmek neden önemli?

Bazı işlemlerde yıl yetmez, yaşın ay ya da gün olarak bilinmesi gerekir:

- **Okul kaydı:** İlkokula ve okul öncesine kayıtta çocuğun yaşı ay olarak, kayıt yılının belirli bir tarihine (genellikle eylül sonu) göre hesaplanır. Sonuçtaki "Toplam ay" satırı bu amaçla kullanılabilir; hesap tarihi olarak ilgili kesim tarihini girin.
- **Bebek gelişimi ve aşı takvimi:** İlk iki yılda yaş genellikle ay ve hafta olarak takip edilir.
- **Yaş sınırı olan başvurular:** Sınav, burs, ehliyet veya iş ilanlarındaki "başvuru tarihinde 18 yaşını doldurmuş olmak" gibi şartlarda sınırın tam olarak hangi gün dolduğu önem taşır. Hesap tarihine son başvuru gününü yazarak kontrol edebilirsiniz.

## Yaş hesabı nerelerde kullanılır?

Okula başlama yaşı (ay olarak), askerlik ve seçme-seçilme yaşı, ehliyet sınıfları, [emeklilik yaşı](/emeklilik-hesaplama) ve sigorta başlangıcı gibi işlemlerde dolan yaş belirleyicidir. Hamilelikte ise doğum tarihi yerine son adet tarihi esas alınır; bunun için [gebelik haftası hesaplama](/gebelik-haftasi-hesaplama) aracını kullanın. İki tarih arasındaki herhangi bir süreyi, iş günlerini veya bir tarihe gün eklemeyi [tarih hesaplama](/tarih-hesaplama) aracıyla yapabilirsiniz.

<!-- sss -->

### Kaç yaşında olduğumu nasıl hesaplarım?

Doğum tarihinizi girmeniz yeterlidir; hesap tarihi varsayılan olarak bugündür. Sonuçta tam yaşınız yıl, ay ve gün olarak, ayrıca yaşadığınız toplam gün, hafta, ay ve saat gösterilir.

### Doğum günüm bu yıl henüz gelmediyse yaşım kaç?

Bir önceki doğum gününüzde doldurduğunuz yaş geçerlidir. Örneğin doğum gününüz Aralık'taysa Kasım ayında hâlâ geçen yılki yaşınızdasınız; yıl farkı bir eksiktir.

### 29 Şubat doğumluların yaşı ne zaman dolar?

Artık yıllarda 29 Şubat'ta, diğer yıllarda 1 Mart'ta. Hesaplayıcımız 1 Mart kuralını kullanır. Bazı kurum ve uygulamalar 28 Şubat'ı esas alabildiğinden resmi işlemlerde kurumun kuralını teyit edin.

### Yaşadığım toplam gün sayısı doğru mu?

Evet; doğum tarihinizle hesap tarihi arasındaki takvim günü, artık yıllardaki 29 Şubat'lar dahil olmak üzere birebir sayılır. Saat değeri ise doğum saatiniz bilinmediği için gün sayısının 24 ile çarpımıdır ve yaklaşıktır.

### Hangi gün doğduğumu nasıl öğrenirim?

Doğum tarihinizi girdiğinizde sonuçta "Doğduğunuz gün" satırında haftanın günü (Pazartesi, Salı…) gösterilir. Bir sonraki doğum gününüzün hangi güne denk geldiği de ayrıca yazılır.

### Gelecekteki bir tarihte kaç yaşında olacağımı görebilir miyim?

Evet. "Hesap tarihi" alanına istediğiniz geçmiş ya da gelecek tarihi girin; yaşınız o güne göre hesaplanır. Örneğin bir sınav veya başvuru tarihinde yaş sınırını sağlayıp sağlamadığınızı bu şekilde kontrol edebilirsiniz.

### Burcumu da gösteriyor mu?

Hayır. Araç yalnızca takvime dayalı yaş ve süre hesabı yapar; burç gibi astrolojik bilgiler sunmaz.
