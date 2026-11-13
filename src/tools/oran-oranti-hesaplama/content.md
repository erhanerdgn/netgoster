## Oran ve orantı nedir?

**Oran**, iki çokluğun bölme yoluyla karşılaştırılmasıdır: 3 kg elmanın fiyatı 150 TL ise fiyatın ağırlığa oranı 150 ÷ 3 = {{oo.o1k}} TL/kg'dır. a ÷ b oranı "a : b" şeklinde de yazılır ve "a'nın b'ye oranı" diye okunur.

**Orantı**, iki oranın birbirine eşitliğidir. Üç değeri bilinen bir orantıda dördüncü değer (x) içler-dışlar çarpımıyla bulunur. Okulda "üç bilinmeyenli kural" ya da "basit üçlü kural" diye de anılır. Bu araç doğru ve ters orantıyı adım adım çözer, ayrıca a : b oranını EBOB yardımıyla en sade hale getirir.

## Doğru orantı mı, ters orantı mı?

Hangi formülü kullanacağınızı belirlemek için kendinize şunu sorun: **Birinci çokluk artınca ikincisi ne yapıyor?**

| Durum | Orantı türü | Formül |
| --- | --- | --- |
| Biri 2 katına çıkınca diğeri de 2 katına çıkıyor | Doğru orantı | x = b × c ÷ a |
| Biri 2 katına çıkınca diğeri yarıya iniyor | Ters orantı | x = a × b ÷ c |

- **Doğru orantılı çokluklar:** miktar ile fiyat, kişi sayısı ile tarif malzemesi, yol ile yakıt, çalışma saati ile ücret, haritadaki uzunluk ile gerçek uzunluk.
- **Ters orantılı çokluklar:** işçi sayısı ile işin bitme süresi, hız ile varış süresi, musluk sayısı ile havuzun dolma süresi, kişi sayısı ile kişi başına düşen pay.

Her iki çokluk birlikte artıyor ama aynı oranda artmıyorsa (ör. taksi ücretinde açılış bedeli, kademeli tarifeler) durum orantılı değildir; bu araçla çözülmez.

## Doğru orantı formülü

> **a ÷ b = c ÷ x → x = b × c ÷ a**

Doğru orantıda iki çokluğun **oranı sabittir**. Bu sabite birim oran denir ve hesaplayıcı sonuçta ayrıca gösterir. 3 kg elma 150 TL ise 1 kg {{oo.o1k}} TL'dir; 5 kg elma 150 × 5 ÷ 3 = **{{oo.o1}} TL** eder.

## Ters orantı formülü

> **a × b = c × x → x = a × b ÷ c**

Ters orantıda iki çokluğun **çarpımı sabittir**. İşçi-gün probleminde bu çarpım toplam iş miktarını (işçi-gün) gösterir: 6 işçi bir işi 10 günde bitiriyorsa iş 6 × 10 = {{oo.isciGun}} işçi-gündür. Aynı işi 4 işçi {{oo.isciGun}} ÷ 4 = **{{oo.isci}} günde** bitirir.

Ters orantıda en sık yapılan hata doğru orantı formülünü uygulamaktır: 10 × 4 ÷ 6 ≈ {{oo.tersHata}} gün sonucu, daha az işçinin işi daha kısa sürede bitireceğini söyler ki bu mantıksızdır. Sonucu her zaman sağduyuyla kontrol edin.

## Günlük hayattan örnekler

### Örnek 1: Tarifi ölçeklendirme (doğru orantı)

4 kişilik kek tarifi 250 g un ve 200 ml süt istiyor. 6 kişilik kek için:

- Un: 250 × 6 ÷ 4 = **{{oo.tarif}} g**
- Süt: 200 × 6 ÷ 4 = **{{oo.tarifSut}} ml**

Tarifteki gram, su bardağı ve yemek kaşığı ölçülerini birbirine çevirmek için [mutfak ölçüleri çevirici](/mutfak-olculeri-cevirici) aracını kullanabilirsiniz.

### Örnek 2: Harita ölçeği (doğru orantı)

1 : 25.000 ölçekli haritada 1 cm, gerçekte 25.000 cm'dir. Haritada 8 cm olan iki nokta arası: 25.000 × 8 ÷ 1 = {{oo.haritaCm}} cm = **{{oo.harita}} km**. Ölçek hesabında birimi en sonda çevirmek (100.000 cm = 1 km) hatayı önler.

### Örnek 3: Yakıt tüketimi (doğru orantı)

Aracınız 100 km'de 6,5 litre yakıyorsa 420 km'lik yol için 6,5 × 420 ÷ 100 = **{{oo.yakit}} litre** yakıt gerekir. Yakıtın tutarını ve kişi başı maliyeti görmek için [yakıt hesaplama](/yakit-hesaplama) aracına geçebilirsiniz.

### Örnek 4: Hız ve süre (ters orantı)

Saatte 90 km hızla 4 saat süren yolculuk, saatte 120 km hızla 90 × 4 ÷ 120 = **{{oo.hiz}} saat** sürer. Yol ({{oo.yol}} km) sabit olduğu için hız ile süre ters orantılıdır.

### Örnek 5: Musluk ve havuz (ters orantı)

3 musluk bir havuzu 8 saatte dolduruyorsa 2 musluk 3 × 8 ÷ 2 = **{{oo.musluk}} saatte** doldurur.

## a : b oranını sadeleştirme (EBOB ile)

Bir oranı sadeleştirmek için iki sayı da **en büyük ortak bölenlerine (EBOB)** bölünür. Sonuçta kalan sayılar aralarında asaldır ve oran artık sadeleşmez.

1. Sayılar ondalıklıysa ikisini de 10, 100, 1000… ile çarparak tam sayı yapın.
2. İki tam sayının EBOB'unu bulun (Öklid algoritması: büyük sayıyı küçüğe bölüp kalanla devam edin).
3. Her iki sayıyı EBOB'a bölün.

Örnek: 1,5 : 2,25 → ×100 → 150 : 225. EBOB(150, 225) = {{oo.s1.ebob}}, sade oran **{{oo.s1.p}} : {{oo.s1.q}}** olur.

Hesaplayıcı sadeleştirmenin yanında oranın ondalık değerini ve toplam paylaştırıldığında her terimin yüzde payını da verir. Yüzde ile ilgili diğer hesaplar için [yüzde hesaplama](/yuzde-hesaplama) aracını kullanabilirsiniz.

## Sık sorulan oranların sade hali

| Oran | Nerede karşılaşılır? | EBOB | Sade hali |
| --- | --- | --- | --- |
{{oo.sadeTablo}}

Ondalıklı oranlarda EBOB, sayılar tam sayıya çevrildikten sonraki değerdir.

## Sık yapılan hatalar

- **Orantı türünü yanlış seçmek:** "Biri artınca diğeri artıyor mu, azalıyor mu?" sorusunu sormadan formül uygulamak en yaygın hatadır.
- **Değerleri yanlış eşleştirmek:** a ile c aynı türden (ikisi de kg, ikisi de işçi), b ile x aynı türden (ikisi de TL, ikisi de gün) olmalıdır.
- **Birimleri karıştırmak:** Bir değer gram, diğeri kilogram ise önce aynı birime çevirin.
- **Orantılı olmayan durumlara uygulamak:** Sabit ücret, indirim kademesi ya da başlangıç bedeli içeren hesaplar orantılı değildir.
- **Ters orantıda sonucu kontrol etmemek:** Daha çok işçi, daha az gün demektir; sonuç bunun tersini söylüyorsa formül yanlıştır.

<!-- sss -->

### Doğru orantı nasıl hesaplanır?

a ÷ b = c ÷ x eşitliğinde x = b × c ÷ a formülüyle hesaplanır. Örneğin 3 kg 150 TL ise 5 kg 150 × 5 ÷ 3 = {{oo.o1}} TL'dir. İçler çarpımı dışlar çarpımına eşittir kuralı da aynı sonucu verir.

### Ters orantı nasıl hesaplanır?

a × b = c × x eşitliğinde x = a × b ÷ c formülüyle hesaplanır. 6 işçi bir işi 10 günde bitiriyorsa 4 işçi 6 × 10 ÷ 4 = {{oo.isci}} günde bitirir.

### Doğru orantı ile ters orantı nasıl ayırt edilir?

Bir çokluk iki katına çıktığında diğeri de iki katına çıkıyorsa doğru orantı, yarıya iniyorsa ters orantı vardır. Miktar–fiyat doğru, işçi–gün ve hız–süre ters orantılıdır.

### İçler dışlar çarpımı nedir?

a ÷ b = c ÷ d orantısında b ve c "içler", a ve d "dışlar" olarak adlandırılır. İçlerin çarpımı dışların çarpımına eşittir: b × c = a × d. Doğru orantıda x bu eşitlikten bulunur.

### Bir oran nasıl sadeleştirilir?

İki sayı da en büyük ortak bölenlerine bölünür. 24 : 36 oranında EBOB 12 olduğundan oran 2 : 3 olur. Ondalıklı sayılar önce 10'un kuvvetleriyle çarpılarak tam sayıya çevrilir.

### 1920x1080 hangi orana karşılık gelir?

1920 : 1080 oranının EBOB'u 120'dir; sade hali 16 : 9'dur. 2560x1440 ve 3840x2160 çözünürlükleri de 16 : 9 oranındadır.

### Harita ölçeği orantıyla nasıl hesaplanır?

Ölçek doğru orantıdır. 1 : 25.000 ölçekte haritadaki her 1 cm gerçekte 25.000 cm'dir; haritadaki uzunluk 25.000 ile çarpılır, sonuç 100.000'e bölünerek km'ye çevrilir. 8 cm, {{oo.harita}} km eder.

### Oran ile yüzde arasındaki fark nedir?

Oran iki sayının birbirine bölümüdür ve herhangi bir sayı olabilir (3 : 4 = 0,75). Yüzde ise oranın 100 üzerinden ifadesidir: 0,75 = %75. Toplam içindeki payları görmek için hesaplayıcının sadeleştirme modu yüzde dağılımı da verir.
