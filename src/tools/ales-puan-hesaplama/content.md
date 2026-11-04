## ALES puanı nasıl hesaplanır?

Akademik Personel ve Lisansüstü Eğitimi Giriş Sınavı (ALES), yüksek lisans ve doktora programlarına başvuruda ve üniversitelerin araştırma görevlisi, öğretim görevlisi kadrolarına atamada kullanılan ÖSYM sınavıdır. Sınav **50 sayısal ve 50 sözel** olmak üzere 100 sorudan oluşur. ÖSYM puanı şu adımlarla hesaplar:

1. **Net bulunur.** Her testte doğru sayısından yanlış sayısının dörtte biri çıkarılır.
2. **Standart puana çevrilir.** Sayısal ve sözel netler, o oturuma giren adayların ortalaması ve standart sapmasıyla standart puana dönüştürülür.
3. **Puan türüne göre ağırlıklandırılır.** Standart puanlar aşağıdaki ağırlıklarla toplanıp 100 üzerinden puana çevrilir.

| Puan türü | Sayısal test | Sözel test | Tipik kullanım |
| --- | ---: | ---: | --- |
| ALES Sayısal | %75 | %25 | Mühendislik, fen bilimleri, sağlık |
| ALES Eşit Ağırlık | %50 | %50 | İktisat, işletme, eğitim bilimleri |
| ALES Sözel | %25 | %75 | Edebiyat, tarih, hukuk, iletişim |

Başvurduğunuz programın hangi puan türünü istediği ilanda yazar. Hesaplayıcı üç puan türünü birlikte gösterir.

## Net hesaplama

> **Net = Doğru − Yanlış ÷ 4**

Sayısal testte 35 doğru ve 8 yanlış yapan adayın neti 35 − 8/4 = **33** olur. Boş bırakılan soru neti etkilemez; bir testte doğru ile yanlış toplamı 50'yi aşamaz.

## Tahmini ALES puanı formülü

ÖSYM standart puan kullandığından sabit bir "net başına puan" açıklamaz. Hesaplayıcı son oturumların sonuçlarından türetilmiş tahmini doğrusal formüller kullanır:

| Puan türü | Sabit | Sayısal net katsayısı | Sözel net katsayısı |
| --- | ---: | ---: | ---: |
| Sayısal | {{ales.SAY.base}} | {{ales.SAY.say}} | {{ales.SAY.soz}} |
| Eşit Ağırlık | {{ales.EA.base}} | {{ales.EA.say}} | {{ales.EA.soz}} |
| Sözel | {{ales.SOZ.base}} | {{ales.SOZ.say}} | {{ales.SOZ.soz}} |

> **Tahmini puan ≈ Sabit + Sayısal katsayı × sayısal net + Sözel katsayı × sözel net**

Sonuç 100'ü aşarsa 100 kabul edilir. Katsayılar, ilgili puan türünde hangi testin daha ağır bastığını yansıtır: sayısal puanda bir sayısal net, bir sözel netin iki katından fazla değerlidir.

## ALES barajları: 55, 70 ve 80

ALES'te "geçme notu" yoktur; ancak mevzuat ve ilanlar belirli asgari puanlar arar. Yaygın eşikler şunlardır:

- **55 — tezli yüksek lisans ve yüksek lisans diplomasıyla doktora:** YÖK Lisansüstü Eğitim ve Öğretim Yönetmeliği, ilgili puan türünde en az 55 puanı alt sınır olarak belirler. Üniversite senatoları daha yüksek bir puan isteyebilir.
- **70 — araştırma görevlisi ve öğretim görevlisi kadroları:** Öğretim üyesi dışındaki öğretim elemanı kadrolarına atamada ALES'ten en az 70 puan aranır. Rekabetçi ilanlarda fiilî eşik çok daha yüksek olabilir, çünkü değerlendirme ALES, lisans notu ve yabancı dil puanının birlikte hesaplandığı sıralamayla yapılır.
- **80 — lisans diplomasıyla doktora (bütünleşik doktora):** Lisans mezuniyetiyle doğrudan doktoraya başvuranlarda daha yüksek puan aranır.

Tezsiz yüksek lisans programlarının çoğu ALES şartı aramaz. Hesaplayıcı her puan türünün yanında hangi eşiği geçtiğinizi yazar.

## ALES puanı kaç yıl geçerli?

ALES sonuçları, açıklandığı tarihten itibaren **5 yıl** geçerlidir. Başvuru tarihinde bu sürenin dolmamış olması gerekir. Birden fazla ALES'e girdiyseniz her başvuruda geçerli sonuçlarınızdan en yükseğini kullanabilirsiniz. Bazı programlar ALES yerine GRE veya GMAT puanlarını YÖK eşdeğerlik tablosuna göre kabul eder.

## Örnek hesaplamalar

### Örnek 1: Dengeli aday

Sayısal 35 doğru 8 yanlış (33 net), sözel 40 doğru 8 yanlış (38 net) yapan aday için tahmini puanlar: Sayısal **{{ales.o1.SAY}}**, Eşit Ağırlık **{{ales.o1.EA}}**, Sözel **{{ales.o1.SOZ}}**. Üç puan türünde de 70 eşiğinin üzerindedir.

### Örnek 2: Sözeli güçlü aday

Sayısal 20 doğru 12 yanlış (17 net), sözel 38 doğru 6 yanlış (36,5 net) yapan adayın tahmini puanları: Sayısal **{{ales.o2.SAY}}**, Eşit Ağırlık **{{ales.o2.EA}}**, Sözel **{{ales.o2.SOZ}}**.

### Örnek 3: Sayısalı güçlü aday

Sayısal 42 doğru 4 yanlış (41 net), sözel 22 doğru 12 yanlış (19 net) yapan aday için: Sayısal **{{ales.o3.SAY}}**, Eşit Ağırlık **{{ales.o3.EA}}**, Sözel **{{ales.o3.SOZ}}**. Görüldüğü gibi aynı sınav, başvurulan puan türüne göre çok farklı sonuç verebilir.

## Sık yapılan hatalar

- **Yanlış puan türüne bakmak.** İlan "ALES EA 70" diyorsa sayısal puanınızın 80 olması yetmez; istenen türdeki puan esas alınır.
- **Geçerlilik süresini kaçırmak.** Beş yılı dolan sonuç, puanı yüksek olsa bile kabul edilmez.
- **Eşiği garantili kabul sanmak.** 55 veya 70, başvuru hakkı verir; yerleştirme çoğunlukla ALES, mezuniyet notu ve dil puanının ağırlıklı ortalamasıyla yapılır.
- **Tahmini puanla başvuru planı yapmak.** Kesin puanınız ÖSYM sonuç belgesinde yazar.

Mezuniyet notunuzu 100'lük sisteme çevirmek için [üniversite not ortalaması hesaplama](/universite-not-ortalamasi-hesaplama), dil şartı için [YDS puan hesaplama](/yds-puan-hesaplama) aracını kullanabilirsiniz.

## Resmî dayanak

- ÖSYM {{ales.yil}}-ALES kılavuzu: [ALES başvuru kılavuzu (ÖSYM, PDF)]({{ales.kaynak}}). Test yapısı, net hesabı ve puan türü ağırlıkları kılavuzdadır.
- YÖK Lisansüstü Eğitim ve Öğretim Yönetmeliği (yüksek lisans ve doktora başvuru şartları).
- Öğretim Üyesi Dışındaki Öğretim Elemanı Kadrolarına Yapılacak Atamalarda Uygulanacak Merkezi Sınav ve Giriş Sınavlarına İlişkin Usul ve Esaslar Hakkında Yönetmelik.
- Net başına puan katsayıları resmî değildir; geçmiş sonuçlardan türetilmiş tahminlerdir.

<!-- sss -->

### ALES'te kaç yanlış bir doğruyu götürür?

ALES'te dört yanlış bir doğruyu götürür. Net, doğru sayısından yanlış sayısının dörtte biri çıkarılarak bulunur; boş bırakılan sorular neti etkilemez.

### Yüksek lisans için kaç ALES puanı gerekir?

Tezli yüksek lisans programlarında yönetmelikteki alt sınır, programın istediği puan türünde 55'tir. Üniversiteler senato kararıyla daha yüksek puan isteyebilir; tezsiz programların çoğu ALES şartı aramaz.

### Araştırma görevlisi olmak için ALES puanı kaç olmalı?

Araştırma görevlisi ve öğretim görevlisi kadrolarına başvuru için ilgili puan türünde en az 70 ALES puanı gerekir. Değerlendirmede ALES, lisans notu ve yabancı dil puanı birlikte dikkate alınır.

### ALES sonucu kaç yıl geçerli?

ALES sonuçları açıklandığı tarihten itibaren beş yıl geçerlidir. Başvuru tarihinde sürenin dolmamış olması gerekir.

### Hangi ALES puan türüne bakmalıyım?

Başvurduğunuz programın veya kadronun ilanında belirtilen puan türüne bakmalısınız. Mühendislik ve fen alanları genellikle sayısal, sosyal bilimler eşit ağırlık veya sözel puan ister.

### Hesaplanan ALES puanı neden kesin değil?

ÖSYM, netleri o oturuma giren tüm adayların ortalaması ve standart sapmasıyla standart puana çevirir. Bu değerler sınavdan sonra belli olduğu için hesaplayıcı geçmiş oturumlardan türetilmiş tahmini katsayılar kullanır.
