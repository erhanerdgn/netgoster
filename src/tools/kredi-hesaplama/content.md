## Kredi hesaplama nasıl yapılır?

Türkiye'de bankaların kullandırdığı ihtiyaç, taşıt ve konut kredilerinin büyük çoğunluğu **eşit taksitli** (annüite) yöntemle geri ödenir: vade boyunca her ay aynı tutarı ödersiniz, ancak bu tutarın içindeki faiz ve anapara payı her ay değişir. İlk aylarda taksidin büyük kısmı faize giderken son aylarda neredeyse tamamı anaparayı kapatır.

Hesaplayıcımız bankaların kullandığı yöntemi birebir uygular. Kredi türünü, tutarı, bankanın ilan ettiği **aylık akdi faiz oranını** ve vadeyi girdiğinizde aylık taksit, toplam geri ödeme ve ay ay ödeme planı oluşur.

## Faiz oranına eklenen vergiler: KKDF ve BSMV

Bankanın ilan ettiği oran, vergiler hariç **akdi faiz** oranıdır. Tüketici kredilerinde her ay tahakkuk eden faiz tutarı üzerinden iki ayrı vergi alınır:

- **KKDF (Kaynak Kullanımını Destekleme Fonu):** faiz tutarı üzerinden {{kredi.kkdf}} oranında,
- **BSMV (Banka ve Sigorta Muameleleri Vergisi):** faiz tutarı üzerinden {{kredi.bsmv}} oranında.

İki verginin toplam oranı {{kredi.vergiToplam}} olur. Bu nedenle %3 aylık faizli bir ihtiyaç kredisinde gerçek (vergili) aylık maliyet %3 değil, **{{kredi.o1.brutOran}}** olarak gerçekleşir. Konut kredileri ise KKDF ve BSMV'den **muaftır**; konutta vergili oran akdi orana eşittir.

| Kredi türü | KKDF | BSMV |
| --- | --- | --- |
| İhtiyaç (tüketici) kredisi | {{kredi.kkdf}} | {{kredi.bsmv}} |
| Taşıt kredisi | {{kredi.kkdf}} | {{kredi.bsmv}} |
| Konut kredisi | Yok | Yok |

## Taksit formülü

Önce vergili aylık oran bulunur, ardından annüite formülü uygulanır:

> **r = aylık faiz × (1 + KKDF + BSMV)**
>
> **Taksit = P × r × (1 + r)ⁿ / ((1 + r)ⁿ − 1)**

Burada P kredi tutarı, n vade (ay sayısı), r vergili aylık orandır. Faiz oranı sıfırsa (bazı kampanyalı kredilerde olduğu gibi) taksit doğrudan **P / n** olur.

Ödeme planının her satırı şöyle oluşur:

1. **Faiz** = kalan anapara × akdi aylık oran
2. **KKDF** = faiz × KKDF oranı, **BSMV** = faiz × BSMV oranı
3. **Anapara** = taksit − faiz − KKDF − BSMV
4. **Kalan anapara** = önceki kalan − bu ay ödenen anapara

Tutarlar kuruşa yuvarlandığı için oluşan birkaç kuruşluk fark son taksitte düzeltilir; böylece son ödemeyle kalan anapara tam olarak sıfırlanır.

## Örnek hesaplamalar

### Örnek 1: 100.000 TL ihtiyaç kredisi, aylık %3, 12 ay

- Vergili aylık oran: %3 × (1 + {{kredi.kkdf}} + {{kredi.bsmv}}) = **{{kredi.o1.brutOran}}**
- Aylık taksit: **{{kredi.o1.taksit}}**
- İlk ay: faiz {{kredi.o1.faiz1}}, KKDF ve BSMV her biri {{kredi.o1.kkdf1}}, anapara {{kredi.o1.anapara1}}, kalan anapara {{kredi.o1.kalan1}}
- Toplam geri ödeme: **{{kredi.o1.toplamOdeme}}** (faiz {{kredi.o1.toplamFaiz}}, KKDF {{kredi.o1.toplamKkdf}}, BSMV {{kredi.o1.toplamBsmv}})
- Yıllık efektif maliyet: {{kredi.o1.efektif}}

### Örnek 2: 2.000.000 TL konut kredisi, aylık %2,79, 120 ay

Konut kredisinde vergi olmadığı için oran doğrudan %2,79'dur.

- Aylık taksit: **{{kredi.o2.taksit}}**
- Toplam geri ödeme: **{{kredi.o2.toplamOdeme}}**
- Toplam faiz: {{kredi.o2.toplamFaiz}}

Uzun vadede faiz yükünün anaparayı katlayabildiğine dikkat edin; vadeyi kısaltmak toplam maliyeti ciddi ölçüde düşürür.

### Örnek 3: 500.000 TL taşıt kredisi, aylık %3,49, 36 ay

- Vergili aylık oran: **{{kredi.o3.brutOran}}**
- Aylık taksit: **{{kredi.o3.taksit}}**
- Toplam geri ödeme: **{{kredi.o3.toplamOdeme}}**; bunun {{kredi.o3.toplamMaliyet}} kadarı faiz ve vergidir.

## Yıllık maliyet oranı ve masraflar

Bankalar faizi aylık ilan eder, ancak kredinin yıllık maliyetini karşılaştırmak için aylık oranı 12 ile çarpmak yanıltıcıdır. Faiz her ay kalan borç üzerinden işlediği için doğru gösterge bileşik orandır: **(1 + r)¹² − 1**. Hesaplayıcı bu oranı vergili aylık orana göre gösterir.

Faiz ve vergiler dışında bankalar şu masrafları da alabilir:

- **Kredi tahsis ücreti:** mevzuata göre kredi anaparasının **binde 5'ini** geçemez (100.000 TL için en fazla 500 TL) ve üzerine BSMV eklenir.
- **Konut kredisinde** ekspertiz (değerleme) ücreti, ipotek tesis masrafı ve zorunlu DASK.
- İsteğe bağlı hayat sigortası ve kasko gibi ürünler.

Bu tutarları "Masraflar" alanına girerseniz toplam maliyetinize eklenir. Bankanın size vermesi gereken **sözleşme öncesi bilgi formu**, tüm masraflar dahil "yıllık maliyet oranını" gösterir; teklifleri bu oran üzerinden karşılaştırmak en sağlıklısıdır.

## Sık yapılan hatalar

- **Vergileri unutmak.** İhtiyaç ve taşıt kredisinde ilan edilen faizle hesap yapmak taksidi olduğundan düşük gösterir. Vergiler faiz yükünü {{kredi.vergiToplam}} oranında artırır.
- **Basit faiz hesabı yapmak.** "100.000 TL × %3 × 12 ay = 36.000 TL faiz" hesabı yanlıştır; anapara her ay azaldığı için faiz de azalır.
- **Aylık oranı 12 ile çarpıp yıllık sanmak.** Bileşik etki nedeniyle gerçek yıllık maliyet daha yüksektir.
- **Masrafları ihmal etmek.** Özellikle küçük tutarlı ve kısa vadeli kredilerde tahsis ücreti ve sigorta, efektif maliyeti belirgin artırır.

Birikiminizi değerlendirmeyi düşünüyorsanız [mevduat faizi hesaplama](/mevduat-faizi-hesaplama) aracıyla kredi maliyetini mevduat getirisiyle karşılaştırabilirsiniz.

## Yasal dayanak

- 6802 sayılı Gider Vergileri Kanunu (BSMV) ve 7.7.2023 tarihli Cumhurbaşkanı Kararı (tüketici kredilerinde {{kredi.bsmv}})
- 88/12944 sayılı Kaynak Kullanımını Destekleme Fonu Kararı (KKDF)
- 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Tüketici Kredisi Sözleşmeleri Yönetmeliği (erken ödeme, bilgi formu)
- Finansal Tüketicilerden Alınacak Ücretlere İlişkin Usul ve Esaslar Hakkında Tebliğ (tahsis ücreti sınırı)

<!-- sss -->

### Kredi faizine hangi vergiler eklenir?

İhtiyaç ve taşıt kredilerinde her ayın faiz tutarı üzerinden {{kredi.kkdf}} KKDF ve {{kredi.bsmv}} BSMV alınır. Konut kredileri bu iki vergiden muaftır.

### Aylık %3 faizli kredinin gerçek oranı nedir?

Vergiler eklendiğinde ihtiyaç kredisinde aylık maliyet {{kredi.o1.brutOran}} olur. Bileşik olarak yıllık efektif maliyet {{kredi.o1.efektif}} seviyesindedir.

### Taksitler neden hep aynı ama faiz payı değişiyor?

Eşit taksitli kredide faiz her ay kalan anapara üzerinden hesaplanır. Kalan borç azaldıkça faiz payı küçülür, aynı taksidin daha büyük kısmı anaparaya gider.

### Krediyi erken kapatırsam faiz öder miyim?

Tüketici kredilerinde erken ödemede ödenmemiş dönemlerin faizi alınmaz; yalnızca kapatma tarihine kadar işlemiş faiz ve vergiler ödenir. Sabit faizli konut kredilerinde banka, kalan anaparanın %2'sine kadar erken ödeme ücreti talep edebilir.

### Kredi tahsis ücreti en fazla ne kadar olabilir?

Tahsis ücreti, kullandırılan kredi anaparasının binde 5'ini aşamaz. Örneğin 200.000 TL'lik kredide en fazla 1.000 TL tahsis ücreti (ve buna eklenen BSMV) alınabilir.

### Faizsiz (sıfır faizli) kredide taksit nasıl hesaplanır?

Faiz oranı sıfır olduğunda vergi de oluşmaz; taksit, kredi tutarının vade sayısına bölünmesiyle bulunur. Varsa tahsis ücreti gibi masraflar ayrıca ödenir.

### Taşıt kredisinde vergi oranı ihtiyaç kredisiyle aynı mı?

Evet. Taşıt kredisi de tüketici kredisi sayıldığı için faizine ihtiyaç kredisiyle aynı oranlarda KKDF ve BSMV uygulanır.
