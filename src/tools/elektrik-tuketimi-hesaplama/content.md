## Elektrik tüketimi nasıl hesaplanır?

Bir cihazın harcadığı elektrik, gücü ile çalıştığı sürenin çarpımıdır. Güç watt (W), tüketim kilovatsaat (kWh) ile ölçülür. 1 kWh, 1.000 watt'lık bir cihazın bir saat boyunca harcadığı enerjidir.

> **Tüketim (kWh) = Güç (W) ÷ 1.000 × Günlük kullanım (saat) × Gün**
>
> **Maliyet (TL) = Tüketim (kWh) × 1 kWh'nin vergiler dahil fiyatı**

Hesaplayıcının **cihaz tüketimi** bölümünde listeden bir cihaz seçtiğinizde tipik gücü ve günlük kullanım süresi kendiliğinden dolar. Bu değerleri kendi cihazınızın etiketine göre değiştirebilirsiniz. **Fatura tahmini** bölümü ise aylık kWh tüketiminizden faturanızı EPDK tarifesine göre kalem kalem çıkarır.

## {{yil}} mesken elektrik birim fiyatı

Elektrik fiyatlarını Enerji Piyasası Düzenleme Kurumu (EPDK) belirler. {{elk.baslangic}} tarihinden beri geçerli mesken (alçak gerilim, tek zamanlı) tarifesi:

| Kalem | Fiyat (vergiler hariç) |
| --- | --- |
| Enerji bedeli, düşük kademe (günlük ortalama {{elk.kademe}} kWh'ye kadar) | {{elk.enerjiDusuk}}/kWh |
| Enerji bedeli, yüksek kademe (aşan kısım) | {{elk.enerjiYuksek}}/kWh |
| Dağıtım bedeli (her kWh) | {{elk.dagitim}}/kWh |

Vergiler eklendiğinde **1 kWh elektrik düşük kademede {{elk.dusuk}}, yüksek kademede {{elk.yuksek}}** olur. 30 günlük bir faturada {{elk.kademeAy}} kWh'ye kadar olan tüketim düşük kademeden, aşan kısım yüksek kademeden faturalanır. Kademe aylık değil, fatura dönemindeki gün sayısına göre işler: 31 günlük dönemde sınır {{elk.kademe}} × 31 kWh olur.

Fatura kalemleri şöyle hesaplanır:

1. **Enerji bedeli:** kWh × kademe fiyatı.
2. **Dağıtım bedeli:** kWh × {{elk.dagitim}}. Kademeden bağımsızdır.
3. **Elektrik tüketim vergisi:** enerji bedelinin {{elk.btv}}'i. Belediyeye giden bu vergi dağıtım bedeline uygulanmaz.
4. **KDV:** ilk üç kalemin toplamının {{elk.kdv}}'u. Meskenlerde KDV indirimli orandadır.

TRT payı ve enerji fonu, 7346 sayılı Kanun ile 2022'den itibaren faturalardan kaldırıldı. Kaynak ve güncel tablolar: [EPDK elektrik tarifeleri](https://www.epdk.gov.tr/Detay/Icerik/3-1327/elektrik-tarifeleri). Hesaplayıcı, EPDK'nın tarife duyurularındaki örnek fatura hesabıyla aynı yöntemi kullanır: ayda 100 kWh tüketen bir mesken {{elk.yuz}} öder.

### Üç zamanlı tarife

Üç zamanlı sayaçta kademe yoktur; her saat diliminin kendi enerji bedeli vardır. Vergiler dahil 1 kWh: gündüz (06–17) {{elk.gunduzTop}}, puant (17–22) {{elk.puantTop}}, gece (22–06) {{elk.geceTop}}. Dikkat: düşük kademe enerji bedeli çok düşük tutulduğu için tek zamanlı tarifenin düşük kademe fiyatı ({{elk.dusuk}}) gece fiyatından bile ucuzdur. Üç zamanlı tarife ancak tüketimi günlük {{elk.kademe}} kWh sınırını belirgin biçimde aşan ve bu tüketimin çoğunu (elektrikli araç şarjı, termosifon, ısıtma) geceye kaydırabilen evlerde avantaj sağlayabilir.

## Cihazların elektrik tüketimi tablosu

Aşağıdaki değerler tipik güç ve kullanım sürelerine göre, düşük kademe fiyatıyla ({{elk.dusuk}}/kWh) hesaplanmıştır.

| Cihaz | Güç | Günlük kullanım | Aylık tüketim | Saatlik maliyet | Aylık maliyet |
| --- | --- | --- | --- | --- | --- |
{{elk.cihazTablo}}

### Klima saatte kaç TL yakar?

Klimanın BTU değeri soğutma kapasitesidir, çektiği elektrik değildir. Yaklaşık elektrik gücü **BTU × 0,293 ÷ 3,2** ile bulunur (3,2 tipik enerji verimlilik oranıdır). Günde 8 saat çalışan bir klima için:

| Klima | Elektrik gücü | Saatlik | Günlük (8 saat) | Aylık (30 gün) |
| --- | --- | --- | --- | --- |
{{elk.klimaTablo}}

İnverter klimalar odayı soğuttuktan sonra düşük devirde çalıştığı için gerçek tüketim bu değerlerin altında kalabilir. Enerji etiketindeki yıllık kWh değeri en güvenilir göstergedir.

### Buzdolabı ayda kaç kWh harcar?

Buzdolabının kompresörü sürekli değil, aralıklarla çalışır. Ortalama {{elk.buzW}}'lık bir buzdolabı ayda yaklaşık **{{elk.buzKwh}}**, yılda **{{elk.buzYil}}** harcar; aylık maliyeti **{{elk.buzTl}}** civarındadır. Enerji etiketinde yazan yıllık kWh'yi 12'ye bölmek en doğru aylık tüketimi verir.

## Aylık fatura tablosu

30 günlük dönem, tek zamanlı mesken tarifesi:

| Tüketim | Enerji bedeli | Dağıtım bedeli | Vergi + KDV | Toplam fatura |
| --- | --- | --- | --- | --- |
{{elk.faturaTablo}}

## Örnek hesaplamalar

### Örnek 1: 12.000 BTU klima, günde 8 saat

{{elk.o1.watt}} klima saatte {{elk.o1.kwhSaat}} harcar. Saatlik maliyet {{elk.o1.tlSaat}}, günlük {{elk.o1.tlGun}}. Bir ayda {{elk.o1.kwh}} tüketir ve **{{elk.o1.tl}}** tutar.

### Örnek 2: 300 kWh'lik fatura

30 günde düşük kademe sınırı {{elk.kademeAy}} kWh'dir; {{elk.o2.yuksekKwh}} kWh yüksek kademeye düşer.

- Enerji bedeli: {{elk.o2.enerji}}
- Dağıtım bedeli: {{elk.o2.dagitim}}
- Tüketim vergisi: {{elk.o2.tuketimVergisi}}
- KDV: {{elk.o2.kdv}}
- **Toplam: {{elk.o2.toplam}}**

Aynı tüketim bir yıl önceki tarifeyle {{elk.gecenYil}} tutuyordu.

### Örnek 3: Aynı 300 kWh üç zamanlı tarifede

Tüketimin 150 kWh'si gündüz, 80 kWh'si puant, 70 kWh'si gece olsun. Fatura **{{elk.o3.toplam}}** olur; tek zamanlı faturadan {{elk.o3.fark}} {{elk.o3.durum}}. Üç zamanlıda düşük kademe olmadığı ve puant pahalı olduğu için sıradan bir evde tek zamanlı tarife genellikle daha ucuzdur.

## Yıllık limit ve son kaynak tarifesi

EPDK, yıllık tüketimi belirli bir sınırı aşan meskenleri "yüksek tüketimli" sayar. {{yil}} için sınır **{{elk.sktt}} kWh/yıl**dır (ayda ortalama yaklaşık {{elk.skttAylik}} kWh). Önceki yıl bu sınırı aşan meskenlerin enerji bedeli düzenlenmiş tarifeden değil, piyasa fiyatına dayanan son kaynak tedarik tarifesinden hesaplanır. Dağıtım bedeli ve vergiler değişmez. {{elk.skttSonrakiYil}} yılı için sınır {{elk.skttSonraki}} kWh'dir. Bu durumdaki aboneler bir tedarik şirketiyle ikili anlaşma yaparak daha uygun fiyat bulabilir. Hesaplayıcı, girdiğiniz tüketimin yıllık karşılığı sınırı aşıyorsa uyarır.

## Tarife geçmişi

| Geçerlilik | Enerji (düşük) | Enerji (yüksek) | Dağıtım | 100 kWh fatura |
| --- | --- | --- | --- | --- |
{{elk.gecmis}}

Geçmiş bir faturayı kontrol ederken hesaplayıcıdaki okuma tarihini o döneme çekmeniz yeterlidir.

## Sık yapılan hatalar

- **BTU'yu watt sanmak:** 12.000 BTU klima 12 kW değil, yaklaşık {{elk.o1.watt}} elektrik çeker.
- **Cihazın tam güçte sürekli çalıştığını varsaymak:** Buzdolabı, fırın, ısıtıcı ve klima termostatla açılıp kapanır.
- **Yalnız enerji bedeline bakmak:** Faturanın en büyük kalemi çoğu zaman dağıtım bedelidir.
- **Bekleme modunu unutmak:** Televizyon, modem ve şarj aletleri prizde kaldıkça az da olsa tüketir.

Isınma maliyetini karşılaştırmak için [doğal gaz tüketimi hesaplama](/dogalgaz-tuketimi-hesaplama), ev giderlerinizin tamamı için [aidat hesaplama](/aidat-hesaplama) ve [kira artış hesaplama](/kira-artis-hesaplama) araçlarına bakabilirsiniz. Faturadaki KDV'yi ayrı görmek isterseniz [KDV hesaplama](/kdv-hesaplama) aracını kullanın.

<!-- sss -->

### 1 kWh elektrik kaç TL?

Mesken tek zamanlı tarifede vergiler dahil 1 kWh düşük kademede {{elk.dusuk}}, günlük ortalama {{elk.kademe}} kWh'yi aşan kısım için {{elk.yuksek}}'dir.

### Klima saatte kaç TL yakar?

12.000 BTU bir klima saatte yaklaşık {{elk.o1.kwhSaat}} harcar; bu {{elk.o1.tlSaat}} eder. 9.000 BTU klimada maliyet daha düşük, 18.000 ve 24.000 BTU klimalarda daha yüksektir. Hesaplayıcının klima tablosu tüm boyutları gösterir.

### Buzdolabı ayda kaç kWh harcar?

Ortalama bir buzdolabı ayda yaklaşık {{elk.buzKwh}} harcar ve aylık {{elk.buzTl}} civarında maliyet çıkarır. Eski modeller bunun iki katını harcayabilir.

### Elektrik faturasında kademe nedir?

Tek zamanlı mesken tarifesinde fatura dönemindeki günlük ortalama {{elk.kademe}} kWh'ye kadar olan tüketim düşük, aşan kısmı yüksek enerji bedeliyle faturalanır. 30 günlük faturada sınır {{elk.kademeAy}} kWh'dir.

### Elektrik faturasında hangi vergiler var?

Enerji bedeli üzerinden {{elk.btv}} elektrik tüketim vergisi ve tüm tutar üzerinden {{elk.kdv}} KDV. TRT payı ve enerji fonu artık alınmıyor.

### Yıllık elektrik limiti kaç kWh?

{{yil}} için mesken limiti {{elk.sktt}} kWh/yıl, {{elk.skttSonrakiYil}} için {{elk.skttSonraki}} kWh/yıl. Limiti aşan meskenlere enerji bedeli piyasa fiyatına dayalı son kaynak tarifesinden uygulanır.

### 100 kWh elektrik faturası ne kadar?

Güncel tarifeyle 30 günde 100 kWh tüketen bir mesken {{elk.yuz}} öder.

### Elektrikli araç evde şarj etmek kaç TL?

7,4 kW ev şarj cihazı saatte 7,4 kWh çeker. 40 kWh'lik bir şarj düşük kademe fiyatıyla yaklaşık {{elk.sarj40}} eder; ancak bu tüketim çoğu evde günlük {{elk.kademe}} kWh sınırını aştırır ve aşan kısım {{elk.yuksek}}'den faturalanır. Şarjı gece yapıyor ve sınırı her ay aşıyorsanız üç zamanlı tarifenin gece fiyatı ({{elk.geceTop}}) yüksek kademeden ucuzdur.
