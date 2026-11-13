## Faiz nasıl hesaplanır?

Faiz, paranın belirli bir süre kullanımının bedelidir. Hesap için üç bilgi gerekir: **anapara** (başlangıç tutarı), **yıllık faiz oranı** ve **süre**. Faizin anaparaya nasıl işlediğine göre iki yöntem vardır.

### Basit faiz formülü

Basit faizde faiz yalnız anaparaya işler; kazanılan faiz yeniden faiz kazanmaz.

> **Faiz = Anapara × Yıllık oran × Süre (yıl)**
>
> **Vade sonu tutarı = Anapara × (1 + Yıllık oran × Süre)**

Süre gün olarak verilirse gün sayısı 365'e, ay olarak verilirse 12'ye bölünür. Türk lirası mevduat ve kredilerde bankalar yılı 365 gün sayar.

### Bileşik faiz formülü

Bileşik faizde her dönem sonunda faiz anaparaya eklenir; sonraki dönemde bu toplam faiz kazanır ("faizin faizi").

> **Vade sonu tutarı = Anapara × (1 + Yıllık oran / m)^(m × Süre)**

Burada **m** yıldaki bileşik dönem sayısıdır: yıllık bileşikte 1, aylık bileşikte 12, günlük bileşikte 365. Dönem kısaldıkça getiri artar. Hesaplayıcıda faiz türünü ve bileşik dönemini seçerek farkı anında görebilirsiniz; sonuç kartındaki tablo aynı oran ve süre için dört yöntemi yan yana gösterir.

### Efektif yıllık faiz

İlan edilen yıllık oran **nominal** orandır. Bileşik etkisiyle bir yılda gerçekte kazanılan oran ise **efektif yıllık faizdir**:

> **Efektif yıllık faiz = (1 + Yıllık oran / m)^m − 1**

Örneğin %40 nominal oranla aylık bileşikte efektif yıllık faiz {{faiz.o1.efektif}}, günlük bileşikte {{faiz.gunluk.efektif}} olur. Farklı vade ve dönemli teklifleri karşılaştırırken efektif oranlara bakın.

## Tersine hesaplar: gereken süre ve oran

Hesaplayıcı yalnız vade sonu tutarını değil, hedef bir tutara ulaşmak için gerekenleri de bulur:

> **Gereken süre (bileşik) = ln(Hedef / Anapara) / (m × ln(1 + Oran / m))**
>
> **Gereken oran (bileşik) = m × ((Hedef / Anapara)^(1 / (m × Süre)) − 1)**

Basit faizde süre (Hedef / Anapara − 1) / Oran, oran ise (Hedef / Anapara − 1) / Süre formülüyle bulunur.

## 72 kuralı: paranız kaç yılda ikiye katlanır?

**72 kuralı**, bileşik faizde paranın ikiye katlanma süresini zihinden tahmin etmenin kısa yoludur: **72 / yıllık faiz oranı (yüzde)**. %12 faizle para yaklaşık 72 / 12 = 6 yılda ikiye katlanır. Kural düşük oranlarda çok isabetlidir; oran yükseldikçe gerçek süre tahminden uzun çıkar. Tam süre **ln 2 / ln(1 + oran)** formülüyle bulunur.

| Yıllık oran | 72 kuralıyla | Gerçek süre (yıllık bileşik) |
| --- | --- | --- |
{{faiz.kural72}}

Basit faizde ise ikiye katlanma süresi **1 / oran** kadardır: %40 basit faizle para 2,5 yılda ikiye katlanır.

## Popüler değerler: 100.000 TL'nin faiz getirisi

100.000 TL'nin %30, %40 ve %50 yıllık faizle 1, 3 ve 5 yıl sonundaki vade sonu tutarı (vergi ve kesinti hariç):

| Yıllık oran | Süre | Basit faiz | Bileşik (yıllık) | Bileşik (aylık) |
| --- | --- | --- | --- | --- |
{{faiz.tablo}}

Bir yıllık vadede basit faiz ile yıllık bileşik faiz aynı sonucu verir; fark süre uzadıkça açılır. Beş yılda bileşik faiz, basit faizin iki katından fazlasını kazandırabilir.

## Örnek hesaplamalar

### Örnek 1: 100.000 TL, %40, 1 yıl

- Basit faiz: 100.000 × (1 + 0,40 × 1) = **{{faiz.o1.basit}}** (faiz {{faiz.o1.basitFaiz}})
- Aylık bileşik: 100.000 × (1 + 0,40 / 12)^12 = **{{faiz.o1.aylik}}** (faiz {{faiz.o1.aylikFaiz}})
- Aylık bileşiğin farkı: {{faiz.o1.fark}}; efektif yıllık faiz {{faiz.o1.efektif}}

### Örnek 2: 100.000 TL kaç yılda 250.000 TL olur?

%45 yıllık oran ve aylık bileşik faizle: ln(2,5) / (12 × ln(1 + 0,45 / 12)) = **{{faiz.o2.yil}} yıl**, yani yaklaşık {{faiz.o2.ay}} ay.

### Örnek 3: 3 yılda paramı üçe katlamak için kaç faiz gerekir?

Yıllık bileşik faizle: 3^(1/3) − 1 = **{{faiz.o3.oran}}** yıllık faiz gerekir. Basit faizle aynı hedef için (3 − 1) / 3 = %66,67 gerekirdi.

## Sık yapılan hatalar

- **Aylık oranı yıllık sanmak.** Kredi ve kart faizleri çoğu zaman aylık ilan edilir. Aylık %4, yıllık nominal %48 demektir; aylık bileşikte efektif oran daha yüksektir.
- **Gün sayısını 360 almak.** Türk lirası işlemlerde yıl 365 gün sayılır; 360 kullanmak faizi olduğundan yüksek gösterir.
- **Brüt ile neti karıştırmak.** Bu araç brüt faizi hesaplar. Vadeli mevduatta faizden stopaj kesilir; net getiri için [mevduat faizi hesaplama](/mevduat-faizi-hesaplama) aracını kullanın. Kredide faize ek olarak KKDF ve BSMV ödenir; taksit tutarı için [kredi hesaplama](/kredi-hesaplama) aracına bakın.
- **Enflasyonu unutmak.** %40 faiz, aynı dönemde enflasyon %35 ise reel olarak yalnızca yaklaşık %3,7 kazandırır: (1,40 / 1,35) − 1. Paranızın alım gücünü [enflasyon hesaplama](/enflasyon-hesaplama) aracıyla ölçebilirsiniz.

Yatırım fonlarında getiri faiz gibi sabit değildir; geçmiş performansla hesap için [fon getirisi hesaplama](/fon-getirisi-hesaplama), oran ve yüzde işlemleri için [yüzde hesaplama](/yuzde-hesaplama) aracını kullanabilirsiniz.

<!-- sss -->

### Basit faiz ile bileşik faiz arasındaki fark nedir?

Basit faizde faiz yalnız anaparaya işler. Bileşik faizde ise her dönemin faizi anaparaya eklenir ve sonraki dönemlerde o da faiz kazanır. Süre uzadıkça bileşik faiz çok daha yüksek getiri sağlar.

### 100.000 TL'nin yıllık %40 faizi ne kadar?

Basit faizle bir yılda {{faiz.o1.basitFaiz}} faiz işler ve vade sonunda {{faiz.o1.basit}} olur. Faiz aylık bileşik işlerse vade sonu tutarı {{faiz.o1.aylik}} olur. Mevduatta bu tutardan stopaj kesilir.

### Bileşik faiz nasıl hesaplanır?

Anapara × (1 + yıllık oran / dönem sayısı)^(dönem sayısı × yıl) formülüyle. Aylık bileşikte dönem sayısı 12, günlük bileşikte 365'tir.

### Efektif faiz nedir?

Bileşik etkisi dahil, bir yılda gerçekte kazanılan faiz oranıdır. Nominal oran aynı olsa bile faiz ne kadar sık eklenirse efektif oran o kadar yüksek olur.

### 72 kuralı nedir?

Paranın bileşik faizle kaç yılda ikiye katlanacağını tahmin etme yöntemidir: 72, yüzde cinsinden yıllık faiz oranına bölünür. %24 faizle para yaklaşık 3 yılda ikiye katlanır.

### Para kaç yılda ikiye katlanır?

Yıllık bileşik faizde tam süre ln 2 / ln(1 + oran) kadardır; %40 faizle bu yaklaşık 2,06 yıldır. Basit faizde süre 1 / oran, yani %40 için 2,5 yıldır.

### Aylık faiz yıllık faize nasıl çevrilir?

Nominal yıllık oran için aylık oran 12 ile çarpılır. Efektif yıllık oran için (1 + aylık oran)^12 − 1 hesaplanır: aylık %3, yıllık nominal %36, efektif yaklaşık %42,58'dir.

### Bu hesaplamaya vergi dahil mi?

Hayır. Sonuçlar brüttür; mevduat stopajı, kredi vergileri (KKDF, BSMV) ve masraflar hesaba katılmaz. Bunlar için mevduat faizi ve kredi hesaplama araçlarını kullanın.
