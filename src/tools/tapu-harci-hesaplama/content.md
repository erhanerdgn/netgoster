## Tapu harcı nedir?

Tapu harcı, bir taşınmazın (ev, işyeri, arsa, tarla) mülkiyeti satış yoluyla devredilirken tapu müdürlüğünde ödenen bir vergidir. Dayanağı 492 sayılı Harçlar Kanunu'na bağlı (4) sayılı tarifedir. Harç alım ve satım için **ayrı ayrı** doğar: alıcı da satıcı da harca esas değer üzerinden **{{tapu.oran}}** oranında harç öder; toplam yük {{tapu.toplamOran}} olur.

Tapu harcına ek olarak Tapu ve Kadastro Genel Müdürlüğü işlem için bir **döner sermaye ücreti** alır. İkisi birlikte "tapu masrafı" olarak anılır.

## Tapu harcı nasıl hesaplanır?

> **Harca esas değer = max(beyan edilen satış bedeli, emlak vergisi değeri)**
>
> **Alıcı harcı = Harca esas değer × {{tapu.oran}}**
>
> **Satıcı harcı = Harca esas değer × {{tapu.oran}}**

Harç, tarafların beyan ettiği gerçek satış bedeli üzerinden alınır. Ancak Harçlar Kanunu md. 63 uyarınca beyan edilen bedel, taşınmazın **emlak vergisi değerinden az olamaz**; daha düşük bir bedel beyan edilirse harç emlak vergisi değerinden hesaplanır. Harç hesabında matrahın **10 TL'ye kadar olan kesirleri** dikkate alınmaz.

Gerçek bedelin altında beyan, sonradan tespit edildiğinde eksik ödenen harcın yanı sıra vergi ziyaı cezasına yol açar; 7566 sayılı Kanunla bu ceza, eksik harcın %25'inden **bir katına** yükseltildi. Ayrıca düşük beyan, satıcının değer artış kazancı vergisi ve alıcının ileride yapacağı satışlarda da sorun çıkarır.

## Döner sermaye ücreti

Döner sermaye ücreti, {{yil}} tarifesinde **{{tapu.doner}}** olan göstergenin taşınmazın bulunduğu yerin **yöresel katsayısıyla** çarpılmasıyla bulunur. Yöresel katsayı il ve ilçelere göre 0,30 ile 3,00 arasında belirlenir; kendi ilçenizin katsayısını tapu müdürlüğünden ya da Web Tapu ön başvuru ekranından öğrenebilirsiniz. Tarifedeki tutarlara KDV dahildir.

- **Kat mülkiyetli veya kat irtifaklı bağımsız bölümlerde** (daire, dükkân) aynı işlemde devredilen her bağımsız bölüm için tam ücret alınır.
- **Diğer taşınmazlarda** (arsa, tarla) ilk taşınmaz için tam ücret, ilave her taşınmaz için {{tapu.donerIlave}} × yöresel katsayı kadar ilave ücret alınır.

Döner sermaye ücreti uygulamada alıcı tarafından ödenir.

## Örnek hesaplamalar

### Örnek 1: 3.000.000 TL'lik daire, katsayı 1

- Alıcı harcı: 3.000.000 × {{tapu.oran}} = **{{tapu.o1.aliciHarc}}**
- Satıcı harcı: **{{tapu.o1.saticiHarc}}**
- Döner sermaye: {{tapu.o1.doner}}
- Alıcının toplam ödemesi: **{{tapu.o1.aliciToplam}}**; tüm masraf: {{tapu.o1.genelToplam}}

### Örnek 2: Beyan emlak vergisi değerinin altında, harcın tamamı alıcıda

Satış bedeli 2.000.000 TL beyan edilen, ancak emlak vergisi değeri 2.400.000 TL olan bir dairede harç, yüksek olan değerden alınır. Yöresel katsayı 2,5 olsun ve taraflar harcın tamamını alıcının ödemesinde anlaşsın.

- Toplam tapu harcı: **{{tapu.o2.toplamHarc}}**
- Döner sermaye: {{tapu.o2.doner}}
- Alıcının ödeyeceği: **{{tapu.o2.aliciToplam}}**, satıcı: {{tapu.o2.saticiToplam}}

### Örnek 3: Üç tarla tek işlemde, katsayı 0,5

Toplam bedel 1.200.000 TL. Tarla bağımsız bölüm olmadığından ilk taşınmaz tam, diğer ikisi ilave ücrete tabidir.

- Alıcı harcı: **{{tapu.o3.aliciHarc}}**
- Döner sermaye: {{tapu.o3.donerIlk}} + 2 × {{tapu.o3.donerIlave}} = **{{tapu.o3.doner}}**

## Tapu harcını kim öder?

Kanuna göre harcın yarısı alıcıya, yarısı satıcıya aittir ve tapu müdürlüğüne karşı her iki taraf da müteselsilen sorumludur. Taraflar aralarında farklı bir paylaşım kararlaştırabilir; özellikle konut satışlarında harcın tamamının alıcıya bırakılması yaygındır. Hesaplayıcıdaki "Tamamını alıcı öder" seçeneği bu durumu gösterir. Pazarlığa başlamadan önce masrafın kime ait olacağını yazılı olarak netleştirmek anlaşmazlıkları önler.

## Satış işlemi adım adım

1. **Başvuru:** Web Tapu veya e-Devlet üzerinden satış başvurusu yapılır; beyan edilen bedel bu aşamada girilir.
2. **Masrafların tahakkuku:** Tapu müdürlüğü harç ve döner sermaye tutarını hesaplayıp başvuruya ekler.
3. **Ödeme:** Tutarlar randevu gününden önce anlaşmalı bankalar veya internet üzerinden ödenir.
4. **İmza:** Alıcı ve satıcı (veya vekilleri) randevu saatinde tapu müdürlüğünde resmî senedi imzalar; satış bedelinin güvenli ödeme sistemi veya banka havalesiyle aktarılması önerilir.

## Tapu masrafı dışında nelere dikkat edilmeli?

- **Zorunlu deprem sigortası (DASK):** Tapu işleminden önce geçerli bir DASK poliçesi bulunmalıdır.
- **Emlak vergisi borcu:** Satıcının içinde bulunulan yıla kadar emlak vergisi borcu olmamalıdır; yıllık tutarı [emlak vergisi hesaplama](/emlak-vergisi-hesaplama) aracıyla görebilirsiniz.
- **Konut kredisi:** Kredili alımda ipotek tesisi için ayrıca döner sermaye ücreti ödenir; ipotek işlemi harçtan muaftır. Taksitleri [kredi hesaplama](/kredi-hesaplama) aracıyla planlayabilirsiniz.
- **Değer artış kazancı vergisi:** Satıcı, taşınmazı 5 yıl dolmadan satıyorsa kazancı gelir vergisine tabi olabilir.

## Sık yapılan hatalar

- **Harcı yalnız alıcının ödediğini sanmak.** Kanunen iki taraf da {{tapu.oran}} öder; tamamını alıcının ödemesi bir anlaşmadır.
- **Emlak vergisi değerinin altında beyan etmek.** Harç yine emlak vergisi değerinden alınır, gerçek bedel tespit edilirse ceza doğar.
- **Döner sermayeyi unutmak.** Tapu harcı dışında, yöreye göre değişen döner sermaye ücreti de ödenir.
- **Katsayıyı her yerde 1 kabul etmek.** Büyükşehirlerin merkez ilçelerinde katsayı genellikle 1'in üzerindedir.

## Yasal dayanak

- 492 sayılı Harçlar Kanunu md. 57, 63 ve (4) sayılı tarife I/20-a
- 7566 sayılı Kanun (eksik beyanda vergi ziyaı cezası)
- Tapu ve Kadastro Genel Müdürlüğü Döner Sermaye İşletmesi {{yil}} ücret tarifesi

<!-- sss -->

### {{yil}} yılında tapu harcı oranı nedir?

Satışlarda alıcı ve satıcı ayrı ayrı harca esas değer üzerinden {{tapu.oran}} oranında tapu harcı öder; iki tarafın toplamı {{tapu.toplamOran}} eder.

### Tapu harcı hangi bedel üzerinden hesaplanır?

Beyan edilen gerçek satış bedeli üzerinden hesaplanır; ancak bu bedel emlak vergisi değerinden düşük olamaz. Düşükse harç emlak vergisi değeri üzerinden alınır.

### Döner sermaye ücreti ne kadar?

{{yil}} için gösterge tutarı {{tapu.doner}} olup taşınmazın bulunduğu yerin yöresel katsayısıyla çarpılır. Katsayı 1 ise ücret {{tapu.doner}} olur.

### Tapu harcını alıcı mı satıcı mı öder?

Kanuna göre ikisi de öder. Ancak taraflar harcın tamamını alıcının veya satıcının ödemesini kararlaştırabilir; uygulamada alıcının tamamını üstlenmesi sık görülür.

### Tapu harcı ne zaman ve nasıl ödenir?

Harç ve döner sermaye ücreti, randevu günü işlem öncesinde anlaşmalı bankalar, Web Tapu veya e-Devlet üzerinden ödenir. Ödeme yapılmadan tapu imzası atılmaz.

### Hibe ve miras yoluyla devirde tapu harcı alınır mı?

Bağışta da tapu harcı alınır; mirasta ise intikal işlemi için harç oranı farklıdır ve ayrıca veraset ve intikal vergisi söz konusu olabilir. Bu hesaplayıcı satış işlemleri içindir.

### Yöresel katsayımı nasıl öğrenirim?

İl ve ilçeye göre belirlenen katsayıyı ilgili tapu müdürlüğünden, Alo 181 hattından veya Web Tapu ön başvuru sırasında gösterilen ücret bilgisinden öğrenebilirsiniz.
