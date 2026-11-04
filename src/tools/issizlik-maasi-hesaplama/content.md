## İşsizlik maaşı nedir?

İşsizlik maaşının resmî adı **işsizlik ödeneğidir**. 4447 sayılı İşsizlik Sigortası Kanunu kapsamında, kendi istek ve kusuru dışında işini kaybeden sigortalılara, yeni bir iş bulana kadar belirli bir süre boyunca **İŞKUR** tarafından ödenir. Kaynağı, çalışırken her ay brüt ücretinizden kesilen {{sgk.isciIssizlik}} işçi payı, işverenin ödediği {{sgk.isverenIssizlik}} işveren payı ve devlet katkısıyla oluşan İşsizlik Sigortası Fonu'dur.

## İşsizlik maaşı alma şartları

Ödenek için aşağıdaki şartların **hepsinin** birlikte sağlanması gerekir:

1. **Kendi istek ve kusuru dışında işsiz kalmak.** İşveren tarafından ahlak ve iyi niyet kurallarına aykırılık (İş Kanunu md. 25/II) dışındaki bir nedenle çıkarılmak, işçinin haklı nedenle (md. 24) feshi, işyerinin kapanması, belirli süreli sözleşmenin bitmesi gibi hâller kapsamdadır. Haklı bir sebep olmadan istifa edenler ve emeklilik için ayrılanlar ödenek alamaz.
2. **Son {{iss.sonGun}} gün kesintisiz prim.** İş sözleşmesinin sona ermesinden önceki son {{iss.sonGun}} günün tamamında hizmet akdine tabi olarak çalışmış ve prim ödenmiş olmalıdır.
3. **Son 3 yılda en az {{iss.prim1}} gün prim.** Ayrılış tarihinden geriye doğru 3 yıl içinde en az {{iss.prim1}} gün işsizlik sigortası primi ödenmiş olmalıdır.
4. **30 gün içinde başvuru.** Ayrılıştan itibaren 30 gün içinde e-Devlet üzerinden ya da İŞKUR'a bizzat başvurulmalıdır. Geç başvuruda geciken süre toplam ödeme süresinden düşülür.

## Ödeme süresi

Ödenek süresi, son 3 yıldaki prim gün sayısına göre belirlenir:

| Son 3 yıldaki prim günü | Ödeme süresi |
| --- | --- |
| {{iss.prim1}} – {{iss.prim2}} gün arası | {{iss.gun1}} gün ({{iss.ay1}} ay) |
| {{iss.prim2}} – {{iss.prim3}} gün arası | {{iss.gun2}} gün ({{iss.ay2}} ay) |
| {{iss.prim3}} gün ve üzeri | {{iss.gun3}} gün ({{iss.ay3}} ay) |

## İşsizlik maaşı nasıl hesaplanır?

> **Aylık brüt ödenek = Son 4 aylık brüt kazanç ortalaması × {{issizlik.oran}}**
>
> **Üst sınır = Brüt asgari ücret × {{iss.tavanOrani}} = {{issizlik.tavan}}**
>
> **Net ödenek = Brüt ödenek − Damga vergisi ({{damga.oran}})**

Kanun ödeneği günlük olarak tanımlar: son 4 aydaki prime esas kazançlara göre bulunan günlük ortalama brüt kazancın {{issizlik.oran}}'ı. Aylık tutar, günlük ödeneğin 30 ile çarpılmasıyla bulunur; bu da aylık ortalamanın {{issizlik.oran}}'ına eşittir. Hesaplanan tutar, brüt asgari ücretin {{iss.tavanOrani}}'ini geçemez. Ödenekten **gelir vergisi ve SGK primi kesilmez**, yalnız damga vergisi kesilir. Bu nedenle bugün alınabilecek en yüksek net işsizlik maaşı **{{issizlik.tavanNet}}**'dir.

Ödenek her ay, ayın sonunda alıcının bankadaki hesabına yatırılır. Ödenek alınan süre boyunca **genel sağlık sigortası primi** İŞKUR tarafından ödenir; bu dönemde siz ve bakmakla yükümlü olduğunuz aile bireyleri sağlık hizmetinden yararlanmaya devam edersiniz.

## Örnek hesaplamalar

### Örnek 1: 40.000 TL ortalama, {{iss.gun1}} gün hak

Son 4 ayın brüt kazanç ortalaması 40.000 TL, son 3 yılda 700 gün primi olan bir çalışan:

- Hesaplanan ödenek: 40.000 × {{issizlik.oran}} = {{iss.ornek1.hesaplanan}} (üst sınırın altında)
- Damga vergisi: {{iss.ornek1.damga}}
- **Aylık net: {{iss.ornek1.net}}**, {{iss.ay1}} ayda toplam {{iss.ornek1.toplamNet}}

### Örnek 2: Yüksek ücret, üst sınır

Son 4 ayda 95.000, 95.000, 100.000 ve 110.000 TL brüt kazanan ve 1080 gün primi olan çalışanın ortalaması {{iss.ornek2.ortalama}}, hesaplanan ödeneği {{iss.ornek2.hesaplanan}}'dir. Bu tutar üst sınırı aştığı için ödenek **{{iss.ornek2.brut}}** brüt olarak uygulanır; damga vergisi {{iss.ornek2.damga}} düşülünce aylık net **{{iss.ornek2.net}}**, {{iss.ay3}} ayda toplam {{iss.ornek2.toplamNet}} ödenir.

### Örnek 3: 60.000 TL ortalama, 950 gün

Hesaplanan ödenek {{iss.ornek3.brut}}, aylık net **{{iss.ornek3.net}}**. 950 gün prim {{iss.prim2}} gün sınırını geçtiği için süre {{iss.gun2}} gündür; toplam ödeme {{iss.ornek3.toplamNet}}.

## İşsizlik ödeneği ne zaman kesilir?

Ödenek, aşağıdaki durumlarda kesilir (4447 md. 51):

- Yeni bir işe girmek veya yaşlılık aylığı almaya başlamak,
- İŞKUR'un önerdiği, mesleğine uygun ve son ücretine yakın bir işi haklı bir neden olmadan reddetmek,
- İŞKUR'un yönlendirdiği eğitim ve meslek kurslarını haklı bir neden olmadan reddetmek ya da bırakmak,
- Kısa vadeli sigorta kollarından geçici iş göremezlik ödeneği almaya başlamak (rapor bitince ödenek devam eder),
- Gerçeğe aykırı beyanla ödenek almak (bu durumda alınan tutar faiziyle geri istenir).

## Sık yapılan hatalar

- **Net maaş ortalaması girmek.** Hesap, SGK hizmet dökümünüzdeki **prime esas brüt kazançla** yapılır.
- **Son 120 gün şartını gözden kaçırmak.** Son 120 günde bir gün bile boşluk varsa ödenek alınamaz.
- **İstifa ederek başvurmak.** Haklı neden olmadan istifada ödenek bağlanmaz; ayrılış kodunuz (SGK çıkış kodu) belirleyicidir.
- **Başvuruyu geciktirmek.** 30 günlük süre aşılırsa geciken gün sayısı kadar hak kaybedilir.

Kıdem ve ihbar tazminatı alacaklarınızı da [kıdem tazminatı hesaplama](/kidem-tazminati-hesaplama) ve [ihbar tazminatı hesaplama](/ihbar-tazminati-hesaplama) araçlarıyla kontrol edebilirsiniz; bu ödemeler işsizlik ödeneğini etkilemez.

## Yasal dayanak

- 4447 sayılı İşsizlik Sigortası Kanunu md. 48 (sigortalılık), md. 50 (ödenek şartları, tutar ve süre), md. 51 (başvuru ve kesilme)
- 488 sayılı Damga Vergisi Kanunu, (1) sayılı tablo IV-1-b
- Brüt asgari ücret: {{asgari.brut}} ({{yil}})

<!-- sss -->

### {{yil}} yılında en yüksek işsizlik maaşı ne kadar?

Üst sınır brüt asgari ücretin {{iss.tavanOrani}}'i olan {{issizlik.tavan}}'dir. Damga vergisi düşüldükten sonra en yüksek aylık net ödenek {{issizlik.tavanNet}}'dir.

### İşsizlik maaşı kaç ay ödenir?

Son 3 yılda {{iss.prim1}} gün primi olanlara {{iss.ay1}} ay, {{iss.prim2}} gün olanlara {{iss.ay2}} ay, {{iss.prim3}} gün olanlara {{iss.ay3}} ay ödenir.

### İstifa eden işsizlik maaşı alabilir mi?

Haklı bir neden olmadan istifa eden alamaz. Ücretin ödenmemesi, mobbing veya sağlık nedeni gibi İş Kanunu md. 24'teki haklı nedenlerle sözleşmeyi fesheden işçi ise şartları sağlıyorsa ödenek alabilir.

### İşsizlik maaşından hangi kesintiler yapılır?

Yalnız {{damga.oran}} damga vergisi kesilir. Gelir vergisi ve SGK primi kesilmez; genel sağlık sigortası primini İŞKUR öder.

### İşsizlik maaşı başvurusu nasıl yapılır?

İşten ayrıldıktan sonraki 30 gün içinde e-Devlet'te "İşsizlik Ödeneği Başvurusu" hizmetinden ya da en yakın İŞKUR hizmet merkezine giderek başvurabilirsiniz.

### Kıdem tazminatı alan işsizlik maaşı alabilir mi?

Evet. Kıdem ve ihbar tazminatı almak işsizlik ödeneğine engel değildir; şartları sağlıyorsanız her ikisini de alırsınız.

### Prim günümü nereden öğrenebilirim?

e-Devlet'teki "SGK Tescil ve Hizmet Dökümü" ekranında ay ay prim günlerinizi ve kazançlarınızı görebilirsiniz. Son 3 yılın toplamını bu dökümden çıkarabilirsiniz.
