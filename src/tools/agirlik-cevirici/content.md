## Ağırlık birimleri nasıl çevrilir?

Günlük dilde "ağırlık" dediğimiz büyüklük bilimsel olarak **kütledir** ve SI temel birimi **kilogramdır**. Kilogram 2019'dan beri Planck sabitine bağlı olarak tanımlanır ([BIPM SI Broşürü](https://www.bipm.org/en/publications/si-brochure)). Gram, miligram ve ton kilogramın ondalık katlarıdır; pound (libre), ons, stone, troy ons ve karat ise kilograma sabit katsayıyla bağlıdır. Çevirme formülü:

> **Hedef değer = Kaynak değer × (kaynak birimin kg karşılığı) ÷ (hedef birimin kg karşılığı)**

Çeviricide değeri ve birimini girdiğinizde tüm birimlerdeki karşılık listelenir; büyük sonuç en çok aranan karşılığı gösterir (pound → kg, ons → gram, troy ons → gram, kg → pound).

| Birim | Tanım | Karşılığı |
| --- | --- | --- |
| Pound / libre (lb) | 1959 uluslararası tanım | {{ag.lbKg}} kg (tam) |
| Ons, avoirdupois (oz) | 1/16 lb | {{ag.onsG}} g (tam) |
| Stone (st) | 14 lb | {{ag.stKg}} kg (tam) |
| Troy ons (ozt) | 480 grain | {{ag.oztG}} g (tam) |
| Metrik karat (ct) | 200 mg | {{ag.ctG}} g (tam) |
| Ton (metrik) | 1000 kg | 1.000.000 g |

Pound'un değeri, 1 Temmuz 1959'da yürürlüğe giren ABD, İngiltere, Kanada, Avustralya, Yeni Zelanda ve Güney Afrika arasındaki uluslararası yarda ve libre anlaşmasıyla **tam olarak 0,45359237 kg** olarak sabitlendi ([Federal Register, 1959](https://www.ngs.noaa.gov/PUBS_LIB/FedRegister/FRdoc59-5442.pdf)). Aynı belge tahıl (grain) birimini 0,06479891 g olarak verir; troy ons 480 grain olduğundan {{ag.oztG}} g çıkar. Ons, troy ons ve karat katsayıları [NIST SP 811, Ek B.8](https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b8) tablosunda da yer alır.

## Pound kaç kg?

1 pound = **{{ag.lbKg}} kg**, tersine 1 kg = **{{ag.kgLb}} lb**'dir. Kafadan hesap için pound değerini 2,2'ye bölmek ya da kg değerini 2,2 ile çarpmak yeterince yakındır.

{{ag.tablo.lb}}

Kilogramdan pound'a hızlı tablo (spor salonu, bagaj ve vücut ağırlığı için):

{{ag.tablo.kg}}

## Ons ve troy ons: iki farklı birim

"Ons" adı iki ayrı birim için kullanılır ve en sık yapılan hata bunları karıştırmaktır:

- **Avoirdupois ons (oz):** Mutfak tarifleri, kahve, posta ve gıda ambalajlarındaki ons. 1 oz = {{ag.onsG}} g; 16 oz = 1 lb.
- **Troy ons (ozt):** Altın, gümüş, platin gibi değerli metallerin uluslararası fiyat birimi. 1 ozt = {{ag.oztG}} g.

Troy ons, avoirdupois onstan yaklaşık **%{{ag.oztFark}}** ağırdır (1 ozt = {{ag.oztOns}} oz). Haberlerde "altının onsu" dendiğinde her zaman troy ons kastedilir. Ons fiyatından gram altın fiyatına geçmek için ons fiyatı {{ag.oztG}}'e bölünür ve dolar kuru ile çarpılır; bunu güncel verilerle [altın hesaplama](/altin-hesaplama) aracı yapar. Kur dönüşümü için [döviz çevirici](/doviz-cevirici) kullanılabilir.

{{ag.tablo.ons}}

## Karat (ct) ve ayar farkı

Pırlanta ve değerli taşlar **metrik karat** ile tartılır: 1 ct = 200 mg = {{ag.ctG}} g. Bu bir kütle birimidir. Altında kullanılan **ayar** (14, 18, 22 ayar) ise saflık derecesidir: 22 ayar altın, 24 parçanın 22'si saf altın demektir. İngilizcede ikisi de "carat/karat" diye yazıldığı için karıştırılır; Türkçede taş için karat, altın için ayar denir. Çeviricideki karat yalnız kütle birimidir.

## Beş örnek hesap

1. **Vücut ağırlığı:** 150 lb kaç kg? 150 × {{ag.lbKg}} = **{{ag.o1}} kg**.
2. **Tarif:** 8 oz tereyağı kaç gram? 8 × {{ag.onsG}} = **{{ag.o2}} g**.
3. **Külçe altın:** 100 gramlık külçe kaç troy ons? 100 ÷ {{ag.oztG}} = **{{ag.o3}} ozt**.
4. **Pırlanta:** 1,5 karatlık taş = 1,5 × 200 = **{{ag.o4}} mg**.
5. **Stone:** İngiltere'de vücut ağırlığı stone ile söylenir; 11 stone = 11 × {{ag.stKg}} = **{{ag.o5}} kg**.

## Sık yapılan hatalar

- **Troy onsu mutfak onsu sanmak:** Altın hesabında 28,35 g kullanmak her onsta yaklaşık 2,75 g eksik hesap demektir.
- **Pound'u 0,5 kg almak:** 100 lb gerçekte 45,36 kg'dır; 0,5 ile çarpmak 4,6 kg fazla sonuç verir.
- **Karat ile ayarı karıştırmak:** "18 karat altın" saflık (ayar) bildirir, ağırlık değildir.
- **Kısa ton ve uzun tonu metrik tonla karıştırmak:** ABD'nin kısa tonu (2000 lb ≈ 907 kg) ve İngiliz uzun tonu (2240 lb ≈ 1016 kg) metrik tondan (1000 kg) farklıdır; çeviricideki ton metrik tondur.
- **Kütle ile ağırlık kuvvetini karıştırmak:** Teknik hesaplarda ağırlık kuvveti newton ile ölçülür; tartıda okunan kg kütledir.

Boy ve uzunluk için [uzunluk çevirici](/uzunluk-cevirici), günlük enerji ihtiyacı için [kalori ihtiyacı hesaplama](/kalori-ihtiyaci-hesaplama) aracına göz atabilirsiniz.

<!-- sss -->

### 1 pound kaç kg eder?

1 pound (libre) tam olarak **{{ag.lbKg}} kg**'dır; yaklaşık 453,6 gram. Bu değer 1959 uluslararası anlaşmasıyla tanımlanmıştır.

### 1 kg kaç pound?

1 kg ≈ **{{ag.kgLb}} lb**'dir. Pratikte kg değerini 2,2 ile çarparak pound'u bulabilirsiniz.

### 1 ons kaç gram?

Gıda ve posta onsu (avoirdupois) **{{ag.onsG}} g**'dır. Altın ve gümüşte kullanılan troy ons ise {{ag.oztG}} g'dır.

### 1 troy ons altın kaç gram?

1 troy ons **{{ag.oztG}} g**'dır. Uluslararası altın fiyatı (ons fiyatı) bu ağırlık içindir; 1 kg altın {{ag.kgOzt}} troy ons eder.

### 100 lb kaç kg?

100 × {{ag.lbKg}} = **{{ag.100lb}} kg**'dır (yaklaşık 45,4 kg).

### 1 karat kaç gram?

Metrik karat **{{ag.ctG}} g**'dır (200 mg). 5 karat 1 gram eder. Bu ölçü pırlanta ve değerli taşlar içindir; altının saflığı ise ayar ile ifade edilir.

### 1 stone kaç kg?

1 stone 14 pound = **{{ag.stKg}} kg**'dır. Çoğunlukla İngiltere ve İrlanda'da vücut ağırlığı için kullanılır.

### Ton kaç kilogramdır?

Metrik ton 1000 kg'dır. ABD'deki kısa ton yaklaşık 907 kg, İngiliz uzun tonu yaklaşık 1016 kg'dır; Türkiye'de ton her zaman metrik tondur.
