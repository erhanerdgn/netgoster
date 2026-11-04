## YDS puanı nasıl hesaplanır?

Yabancı Dil Bilgisi Seviye Tespit Sınavı (YDS), ÖSYM tarafından İngilizce başta olmak üzere birçok dilde yapılan ve kamu kurumlarında, üniversitelerde ve lisansüstü başvurularda kullanılan dil sınavıdır. YDS, puan hesabı en basit ÖSYM sınavıdır, çünkü **standart puan kullanılmaz** ve **yanlışlar doğruyu götürmez**:

> **YDS puanı = Doğru sayısı × {{yds.katsayi}}**

Sınav {{yds.soru}} sorudan oluşur ve 100 üzerinden puanlanır: 100 ÷ {{yds.soru}} = {{yds.katsayi}}. Her doğru cevap {{yds.katsayi}} puan değerindedir; yanlış ve boş cevapların puana etkisi yoktur. Bu nedenle YDS, YKS, KPSS ve ALES'in aksine sınavdan çıkar çıkmaz cevap anahtarıyla **kesine çok yakın** hesaplanabilir. Tek istisna iptal edilen sorulardır: ÖSYM bir soruyu iptal ederse puanlama kalan sorulara göre yeniden yapılır.

## YDS seviyeleri

YDS sonuç belgesinde puanın yanında bir seviye harfi yer alır. Seviyeler puan aralığına göre belirlenir:

{{yds.seviyeTablosu}}

50 puanın altındaki sonuçlara seviye verilmez. Tablodaki "en az doğru" sütunu, o seviyeye ulaşmak için gereken asgari doğru sayısını gösterir: örneğin **B** seviyesi için en az {{yds.min.B}}, **C** seviyesi için en az {{yds.min.C}} doğru gerekir.

## YDS puanı nerelerde kullanılır?

Kurumlar genellikle belirli bir asgari puan veya seviye ister. Aradığınız şartı her zaman başvuracağınız ilanın veya yönetmeliğin güncel metninden doğrulayın:

- **Yabancı dil tazminatı:** Kamu görevlileri, belirli dillerde **C seviyesi ve üzerindeki** (70 puan ve üstü) sonuçlarla seviyesine göre yabancı dil tazminatı alabilir.
- **Lisansüstü eğitim:** Doktora programlarına başvuruda YÖK Lisansüstü Eğitim ve Öğretim Yönetmeliği'ne göre en az 55 puan veya eşdeğeri aranır; yüksek lisans için şartı üniversite senatosu belirler.
- **Akademik kadrolar:** Araştırma görevlisi ve öğretim görevlisi ilanlarında genellikle 50 ve üzeri, doçentlik başvurusunda 55 ve üzeri puan aranır; okutman kadroları daha yüksek puan isteyebilir.
- **Kurum sınavları:** Dışişleri, ekonomi ve uzmanlık kadroları gibi bazı kamu sınavları, başvuru şartı olarak belirli bir YDS puanı ister.

YDS sonuçları genellikle **5 yıl** geçerlidir. Bazı kurumlar YÖKDİL, e-YDS veya ÖSYM eşdeğerlik tablosundaki uluslararası sınavları da (TOEFL iBT, PTE vb.) kabul eder.

## Sınavın yapısı

YDS'deki {{yds.soru}} sorunun tamamı çoktan seçmelidir ve dinleme ya da konuşma bölümü yoktur. Sorular genel olarak şu gruplardan oluşur: kelime ve dilbilgisi, boşluk doldurma (cloze test), cümle tamamlama, Türkçeden yabancı dile ve yabancı dilden Türkçeye çeviri, okuma parçaları, diyalog tamamlama, anlamca en yakın cümleyi bulma, paragraf tamamlama ve anlamı bozan cümleyi bulma. Okuma parçaları soruların önemli bir kısmını oluşturduğundan süreyi iyi yönetmek, doğru sayısını doğrudan artırır.

YDS kâğıt-kalem sınavı olarak yılda birkaç kez yapılır; ÖSYM ayrıca elektronik ortamda **e-YDS** oturumları da düzenler. e-YDS sonuçları da aynı puanlama ve seviye sistemini kullanır; sonuçlar daha kısa sürede açıklandığı için başvuru tarihi yaklaşan adaylar tarafından sıkça tercih edilir.

## Örnek hesaplamalar

### Örnek 1: B seviyesi

64 doğru yapan aday: 64 × {{yds.katsayi}} = **{{yds.o64.puan}}** puan, seviye **{{yds.o64.seviye}}**. A seviyesine ulaşmak için {{yds.o64.eksik}} doğru daha gerekirdi.

### Örnek 2: Seviyenin hemen altı

39 doğru yapan adayın puanı **{{yds.o39.puan}}**'tir ve {{yds.o39.seviye}}. Yalnızca {{yds.o39.eksik}} doğru daha, yani {{yds.min.E}} doğru, adayı E seviyesine (50 puan) taşırdı.

### Örnek 3: Yabancı dil tazminatı sınırı

57 doğru yapan adayın puanı **{{yds.o57.puan}}**, seviyesi **{{yds.o57.seviye}}**'dir. C seviyesi tazminat için yeterli kabul edilir; B seviyesi için {{yds.o57.eksik}} doğru daha gerekir.

## Boş bırakmak mı, işaretlemek mi?

YDS'de yanlış cevap puan düşürmediği için **hiçbir soruyu boş bırakmamak** matematiksel olarak her zaman avantajlıdır. Beş seçenekli bir soruda rastgele işaretleme bile ortalamada 0,2 doğru, yani 0,25 puan getirir. Süre bitmeden önce boş kalan tüm soruları işaretlemek, özellikle seviye sınırına yakın adaylar için sonucu değiştirebilir.

## Sık yapılan hatalar

- **Yanlışları düşmek.** YDS'de yanlış doğruyu götürmez; puanı yalnızca doğru sayısı belirler.
- **Seviyeyi yuvarlamak.** 79,99 puan C seviyesidir; B için tam 80 gerekir. Puanlar {{yds.katsayi}}'in katları olduğu için 63 doğru {{yds.o63.puan}} puan eder ve B'ye yetmez.
- **YÖKDİL ile karıştırmak.** YÖKDİL de 80 soruludur ancak alan bazlı (fen, sağlık, sosyal) bir sınavdır ve her kurum kabul etmeyebilir.
- **Geçerlilik süresini kontrol etmemek.** Sonucun geçerliliği, başvuru veya tazminat tarihinde dolmuş olabilir.

Akademik başvurular için [ALES puan hesaplama](/ales-puan-hesaplama), kamu kadroları için [KPSS puan hesaplama](/kpss-puan-hesaplama) aracını da kullanabilirsiniz.

## Resmî dayanak

- ÖSYM YDS kılavuzu: [YDS kılavuzu (ÖSYM, PDF)]({{yds.kaynak}}). Soru sayısı, yanlışın doğruyu götürmemesi, 100 üzerinden puanlama ve A–E seviyeleri kılavuzda yer alır.
- Sonucun nerede ve hangi puanla kullanılacağı ilgili kurumun yönetmeliği veya ilanında belirtilir.

<!-- sss -->

### YDS'de yanlışlar doğruyu götürür mü?

Hayır. YDS'de yanlış ve boş cevapların puana etkisi yoktur; puan yalnızca doğru sayısının {{yds.katsayi}} ile çarpılmasıyla bulunur. Bu yüzden tüm soruları işaretlemek avantajlıdır.

### YDS'de kaç doğru kaç puan eder?

Her doğru {{yds.katsayi}} puandır. {{yds.min.E}} doğru {{yds.puan.E}} puan, {{yds.min.C}} doğru {{yds.puan.C}} puan, {{yds.min.B}} doğru {{yds.puan.B}} puan, {{yds.min.A}} doğru {{yds.puan.A}} puan ve {{yds.soru}} doğru 100 puan eder.

### YDS seviyeleri nelerdir?

Seviye aralıkları şöyledir: {{yds.seviyeMetni}}. {{yds.puan.E}} puanın altındaki sonuçlara seviye verilmez.

### Yabancı dil tazminatı için kaç YDS puanı gerekir?

Kamu görevlilerinde yabancı dil tazminatı genellikle C seviyesi ve üzerinde, yani en az 70 puanla ödenir. Tutar seviyeye göre artar; güncel şartları kurumunuzun insan kaynakları biriminden teyit edin.

### YDS sonucu kaç yıl geçerli?

YDS sonuçları genellikle beş yıl geçerlidir. Bazı kurumlar başvuru ilanında farklı bir süre belirtebilir; ilan metnini kontrol edin.

### Bu hesaplayıcının sonucu kesin mi?

Formül ÖSYM kılavuzundaki kuraldır; cevap anahtarına göre doğru sayınızı doğru girdiyseniz sonuç kesine çok yakındır. İptal edilen soru olursa ÖSYM puanlamayı yeniden yapar ve resmî puanınız sonuç belgesinde yazandır.
