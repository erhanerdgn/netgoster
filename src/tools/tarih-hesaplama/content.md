## Tarih hesaplama aracı ne yapar?

Bu araç iki farklı soruyu cevaplar:

- **İki tarih arası:** İki tarih arasında kaç gün, kaç hafta, kaç ay ve kaç yıl olduğunu; bu aralıkta kaç **iş günü** bulunduğunu hesaplar.
- **Gün ekle / çıkar:** Bir tarihe belirli sayıda takvim günü ya da iş günü ekleyerek veya çıkararak yeni tarihi bulur; ödeme vadesi, teslim tarihi, itiraz süresi gibi hesaplar için kullanılır.

İş günü hesabında hafta sonları ile Türkiye'deki **resmi tatiller** otomatik olarak düşülür; yarım gün olan arifeler ayrıca gösterilir.

## İki tarih arası nasıl hesaplanır?

Gün farkı, iki tarih arasındaki takvim günlerinin sayısıdır:

> **Gün** = Bitiş tarihi − Başlangıç tarihi (+1, bitiş günü dahilse)

Varsayılan sayımda başlangıç günü sayılır, bitiş günü sayılmaz; yani 1 Ocak ile 31 Ocak arası **30 gün**dür. İzin, rapor ve sözleşme sürelerinde genellikle her iki gün de sayılır; bu durumda "Bitiş günü dahil" anahtarını açın, sonuç **31 gün** olur.

Diğer gösterimler gün sayısından türetilir:

- **Hafta + gün:** Gün ÷ 7, kalan gün ayrıca yazılır.
- **Yıl / ay / gün:** Takvim temellidir; başlangıç gününün her ayki karşılığı (ay dönümü) sayılır. O gün hedef ayda yoksa (ör. 31 Ocak'ın Şubat karşılığı) ertesi ayın 1'i esas alınır.
- **Ay + gün:** Tam ay sayısı ile kalan gün.

## İş günü nasıl sayılır?

Aralıktaki her gün tek tek kontrol edilir:

1. **Cumartesi ve pazar** iş günü sayılmaz.
2. **Hafta içine denk gelen tam gün resmi tatiller** düşülür.
3. **Yarım gün tatiller** (Ramazan ve Kurban Bayramı arifeleri ile 28 Ekim), kamu ve özel sektörde öğleden önce çalışıldığı için **iş günü sayılır**; sonuçta ayrıca listelenir ve yarım günler düşülmüş değer de gösterilir.

Örneğin {{tarih.yilNo}} yılının tamamında (01.01–31.12, iki gün dahil) **{{tarih.yil.gun}} gün** vardır. Bunların {{tarih.yil.haftaSonu}} günü hafta sonu, {{tarih.yil.tatil}} günü hafta içine denk gelen resmi tatildir. Böylece yıl **{{tarih.yil.isGunu}} iş günü** içerir; bu günlerin {{tarih.yil.yarim}} tanesi yarım gündür, yarım günler düşülürse {{tarih.yil.net}} iş günü kalır.

## Türkiye'de resmi tatiller

Resmi tatillerin dayanağı **2429 sayılı Ulusal Bayram ve Genel Tatiller Hakkında Kanun**'dur. Kanuna göre:

| Tatil | Tarih | Süre |
| --- | --- | --- |
| Yılbaşı | 1 Ocak | 1 gün |
| Ulusal Egemenlik ve Çocuk Bayramı | 23 Nisan | 1 gün |
| Emek ve Dayanışma Günü | 1 Mayıs | 1 gün |
| Atatürk'ü Anma, Gençlik ve Spor Bayramı | 19 Mayıs | 1 gün |
| Demokrasi ve Millî Birlik Günü | 15 Temmuz | 1 gün |
| Zafer Bayramı | 30 Ağustos | 1 gün |
| Cumhuriyet Bayramı | 28 Ekim öğleden sonra + 29 Ekim | 1,5 gün |
| Ramazan Bayramı | Arife öğleden sonra + 3 gün | 3,5 gün |
| Kurban Bayramı | Arife öğleden sonra + 4 gün | 4,5 gün |

Dini bayramlar hicri takvime bağlı olduğundan her yıl yaklaşık 11 gün öne kayar. Hesaplayıcı bayram tarihlerini Diyanet İşleri Başkanlığı'nın yayımladığı dini günler takviminden alır; 2024–2027 yılları tanımlıdır. Bu aralığın dışındaki yıllarda yalnızca sabit tarihli tatiller düşülür ve sonuçta uyarı gösterilir.

**Önemli:** Bayramları uzatmak için zaman zaman verilen **idari izin (köprü günü)** kararları resmi tatil değildir; yalnızca kamu kurumlarını kapsar ve sonradan telafi çalışması yapılabilir. Bu nedenle iş günü sayımına dahil edilmez.

## Bir tarihe gün eklemek veya çıkarmak

**Takvim günü** seçildiğinde tüm günler sayılır: {{tarih.bugun}} + 10 gün = **{{tarih.takvim.sonuc}}** ({{tarih.takvim.gunAdi}}). Sonuç hafta sonuna veya tatile denk gelirse araç sizi uyarır.

**İş günü** seçildiğinde başlangıç gününden sonraki günler tek tek ilerlenir; hafta sonları ve tam gün resmi tatiller atlanır, arifeler iş günü olarak sayılır. {{tarih.bugun}} + 10 iş günü = **{{tarih.is.sonuc}}** ({{tarih.is.gunAdi}}); bu, {{tarih.is.takvim}} takvim gününe karşılık gelir.

### Örnek: Bayram haftasında iş günü

16–22 Mart 2026 haftasını (iki gün dahil) düşünelim. 19 Mart Perşembe Ramazan Bayramı arifesidir (yarım gün), bayram 20–22 Mart'tır. Sonuç: **{{tarih.bayram.isGunu}} iş günü** (arife dahil), {{tarih.bayram.tatil}} gün hafta içi bayram tatili ve {{tarih.bayram.haftaSonu}} gün hafta sonu.

## Hafta sonu ve vardiya düzeni

Hesaplayıcı cumartesi ve pazarı hafta sonu kabul eder. Cumartesi de çalışılan işyerlerinde veya vardiyalı düzende gerçek çalışma günü sayısı farklı olabilir; böyle durumlarda takvim günü sonucunu ve aralıktaki tatil listesini kullanarak kendi düzeninize göre düzeltme yapabilirsiniz.

## Sık yapılan hatalar

- **Bitiş gününü yanlış saymak:** "1 ile 10 arası kaç gün" sorusunun cevabı, bitiş günü dahilse 10, değilse 9'dur. Hesaplamanın amacına göre anahtarı ayarlayın.
- **Ayı 30 gün kabul etmek:** Takvim ayları 28–31 gün arasında değişir; "3 ay" ile "90 gün" aynı değildir.
- **Arifeleri tatil saymak:** Arifelerin yalnızca öğleden sonrası tatildir; iş günü sayımında sabah çalışıldığı için gün düşülmez.
- **Köprü günlerini resmi tatil sanmak:** İdari izinler kanuni tatil değildir.
- **Yasal süreleri kendi başına hesaplamak:** Dava, itiraz ve tebligat sürelerinde son gün tatile denk gelirse süre ilk iş gününe uzar; usul kurallarını ayrıca kontrol edin.

İşçinin izin süresini hesaplamak için [yıllık izin hesaplama](/yillik-izin-hesaplama), doğum tarihinden yaş bulmak için [yaş hesaplama](/yas-hesaplama) aracını kullanabilirsiniz.

<!-- sss -->

### İki tarih arası kaç gün nasıl hesaplanır?

Bitiş tarihinden başlangıç tarihi çıkarılır. Varsayılan sayımda başlangıç günü dahil, bitiş günü hariçtir. Her iki günü de saymak istiyorsanız "Bitiş günü dahil" anahtarını açın; sonuç bir gün artar.

### İş günü sayısına hangi günler dahil değildir?

Cumartesi, pazar ve hafta içine denk gelen resmi tatiller (Yılbaşı, 23 Nisan, 1 Mayıs, 19 Mayıs, 15 Temmuz, 30 Ağustos, 29 Ekim, Ramazan ve Kurban Bayramı günleri) iş günü sayılmaz.

### Arife günü iş günü sayılır mı?

Evet. Ramazan ve Kurban Bayramı arifeleri ile 28 Ekim yalnızca 13.00'ten sonra tatildir. Hesaplayıcı bu günleri iş günü sayar, yarım gün olarak ayrıca listeler ve yarım günler düşülmüş iş günü sayısını da gösterir.

### İdari izin (köprü günü) hesaba katılıyor mu?

Hayır. İdari izin kararları 2429 sayılı Kanun'daki resmi tatillerden değildir, çoğunlukla yalnızca kamu personelini kapsar ve telafi çalışmasıyla karşılanabilir. Bu yüzden iş günü sayımında düşülmez.

### Bir tarihe 30 iş günü eklerken başlangıç günü sayılır mı?

Hayır. Sayım başlangıç gününün ertesi gününden başlar. Örneğin bir pazartesiye 1 iş günü eklendiğinde sonuç salıdır.

### Hangi yılların bayram tarihleri tanımlı?

Ramazan ve Kurban Bayramı tarihleri 2024, 2025, 2026 ve 2027 için Diyanet takvimine göre tanımlıdır. Diğer yıllarda yalnızca sabit tarihli tatiller düşülür ve sonuç kartında uyarı gösterilir.

### 3 ay ile 90 gün aynı şey mi?

Hayır. Ay hesabı takvime göre yapılır: 3 ay, başlangıç ayına göre 89 ile 92 gün arasında değişebilir. Kanun veya sözleşmede "ay" yazıyorsa yıl/ay/gün sonucunu, "gün" yazıyorsa gün sayısını esas alın.
