## Lise not ortalaması nasıl hesaplanır?

Lisede karnenizdeki genel ortalama, resmî adıyla **yıl sonu başarı puanı**, basit bir aritmetik ortalama değildir. MEB Ortaöğretim Kurumları Yönetmeliği'ne göre her dersin puanı, o dersin **haftalık ders saati** kadar ağırlık taşır. Haftada 6 saat okunan matematik, haftada 2 saat okunan coğrafyadan üç kat fazla etkilidir.

Hesap üç adımda yapılır:

1. **Her dersin yıl sonu puanı bulunur.** Bu puan, birinci ve ikinci dönem puanlarının aritmetik ortalamasıdır.
2. **Ağırlıklı puan hesaplanır.** Her dersin yıl sonu puanı, haftalık ders saatiyle çarpılır (md. 54).
3. **Toplam, ders saatlerine bölünür.** Ağırlıklı puanların toplamı, haftalık ders saatlerinin toplamına bölünür (md. 55).

> **Yıl sonu başarı puanı = Σ (dersin yıl sonu puanı × haftalık ders saati) ÷ Σ haftalık ders saati**

Yönetmeliğe göre bölme işlemi **virgülden sonra dört basamak** yürütülür. Hesaplayıcı da sonucu yuvarlamadan dört basamakta keser; örneğin 81,81818… sonucu 81,8181 olarak gösterilir.

## Puan ölçeği

{{lise.olcek}}

Bir dersten başarılı sayılmak için yıl sonu puanının en az **{{lise.gecme}}** olması gerekir. Ayrıca birinci dönem puanı ne olursa olsun **ikinci dönem puanı en az {{lise.ikinciDonem}}** olan öğrenci o dersten başarılı sayılır (md. 56). Hesaplayıcı, yıl sonu puanı {{lise.gecme}}'nin altındaki dersleri başarısız kabul eder; ikinci dönem kuralı sizin için geçerliyse o dersin puanını {{lise.gecme}} veya üzeri girin.

## Sınıf geçme kuralları (md. 57–58)

Ortaöğretim Kurumları Yönetmeliği 2023'te değiştirilmiş ve yeni kurallar 2023-2024 öğretim yılında 9. sınıftan başlayarak kademeli olarak uygulanmıştır. Güncel hâliyle:

- **Doğrudan geçme:** Tüm derslerden başarılı olan öğrenci doğrudan sınıf geçer. En fazla **{{lise.dogrudanMax}}** dersten başarısız olup yıl sonu başarı puanı en az {{lise.gecme}} olan öğrenci de doğrudan geçer; bu ders yıl sonu başarı puanıyla başarılı sayılır (bazı dersler bu kapsam dışındadır).
- **Sorumlu geçme:** Doğrudan geçemeyen ve yıl sonu başarı puanı en az {{lise.gecme}} olan öğrenci, başarısız olduğu en fazla **{{lise.sorumluMax}}** dersten sorumlu olarak sınıfını geçer. Sorumluluk sınavından en az {{lise.gecme}} alındığında sorumluluk kalkar.
- **Sınıf tekrarı:** Bu şartları sağlayamayan veya alt sınıflar dahil toplam **{{lise.toplamMax}}** dersten fazla başarısız dersi bulunan öğrenci sınıf tekrar eder. Devamsızlık sınırını aşan öğrenci de başarısız sayılır. Sınıf tekrarı (hazırlık hariç) ortaöğretim boyunca bir kez yapılabilir.

Hesaplayıcı, girdiğiniz notlara göre bu dört durumdan hangisinin geçerli olduğunu gösterir. Alt sınıflardan sorumlu dersleriniz varsa toplam sınırı ({{lise.toplamMax}}) ayrıca kontrol edin.

## Takdir ve teşekkür belgesi şartları

Belgeler, yönetmeliğin 160. maddesine göre **dönem sonunda** o dönemin puanlarıyla verilir. Üç şartın birlikte sağlanması gerekir:

1. **Tüm derslerden başarılı olmak** (zayıf dersi olmamak),
2. **Dönem puanlarının ağırlıklı ortalamasının en az {{lise.tesekkur}} olması,**
3. **Davranış puanının 100 olması** (disiplin cezası almamış olmak).

Ortalama **{{lise.tesekkur}} – {{lise.takdirAlt}}** arasındaysa **teşekkür belgesi**, **{{lise.takdir}} ve üzerindeyse takdir belgesi** verilir. Ortaöğrenim boyunca en az üç öğretim yılının bütün dönemlerinde takdir alan öğrenciye ayrıca **üstün başarı belgesi** verilir. Bir dönemin belgesini hesaplamak için hesaplayıcıya o dönemin ders puanlarını girmeniz yeterlidir.

## Örnek hesaplamalar

### Örnek 1: 9. sınıf öğrencisi

Türk Dili ve Edebiyatı 78,5 (5 saat), Matematik 72 (6), Fizik 81 (2), Kimya 65 (2), Biyoloji 88 (2), Tarih 90 (2), Coğrafya 84 (2), Din Kültürü 95 (2), Yabancı Dil 76 (4) ve Beden Eğitimi 100 (2) alan öğrencinin ağırlıklı puan toplamı **{{lise.o1.toplam}}**, toplam ders saati **{{lise.o1.saat}}**'dur. Yıl sonu başarı puanı {{lise.o1.toplam}} ÷ {{lise.o1.saat}} = **{{lise.o1.ort}}** olur. Tüm dersler başarılı ve davranış puanı 100 ise öğrenci **teşekkür belgesi** alır.

### Örnek 2: Takdir belgesi

92 (5 saat), 88 (6), 85 (4) ve 80 (3) puanları için ağırlıklı toplam {{lise.o2.toplam}}, saat toplamı {{lise.o2.saat}}'dir. Ortalama **{{lise.o2.ort}}** olduğundan öğrenci **takdir belgesi** almaya hak kazanır. Dikkat: basit aritmetik ortalama {{lise.o2.basit}} olurdu; ağırlıklandırma sonucu değiştirir.

### Örnek 3: Sorumlu geçme

45 (6 saat), 48 (2), 70 (5), 75 (4) ve 80 (3) puanları için ortalama {{lise.o3.toplam}} ÷ {{lise.o3.saat}} = **{{lise.o3.ort}}**'dir. İki dersten başarısız olan öğrencinin yıl sonu başarı puanı {{lise.gecme}}'nin üzerinde olduğundan bu iki dersten **sorumlu olarak** sınıf geçer; belge alamaz.

## Sık yapılan hatalar

- **Basit ortalama almak.** Tüm dersleri toplayıp ders sayısına bölmek, ders saatlerini yok saydığı için yanlış sonuç verir.
- **Ders saatini yanlış girmek.** Haftalık ders saatleri okul türüne, sınıfa ve seçmeli derslere göre değişir; karnenizdeki veya e-Okul'daki saatleri kullanın.
- **Yuvarlamak.** Yıl sonu başarı puanı dört basamakta kesilir; 84,99 takdir değil teşekkür belgesidir.
- **Belgeyi yıl sonu ortalamasıyla karıştırmak.** Takdir ve teşekkür dönem bazında verilir; birinci dönem belge alıp ikinci dönem alamamak mümkündür.

Liseden sonra üniversite sınavında diploma notunuz OBP olarak puanınıza eklenir; etkisini [YKS puan hesaplama](/yks-puan-hesaplama) aracında görebilirsiniz. Üniversitedeki ortalamanız için [üniversite not ortalaması hesaplama](/universite-not-ortalamasi-hesaplama) sayfasını kullanın.

## Resmî dayanak

- MEB Ortaöğretim Kurumları Yönetmeliği: [mevzuat.gov.tr (PDF)]({{lise.kaynak}}) — md. 54 (ders ağırlığı), md. 55 (yıl sonu başarı puanı), md. 56 (dersten başarılı sayılma), md. 57 (doğrudan sınıf geçme), md. 58 (sorumlu geçme), md. 59 (sınıf tekrarı), md. 160 (teşekkür, takdir ve üstün başarı belgesi).

<!-- sss -->

### Lise ortalaması nasıl hesaplanır?

Her dersin yıl sonu puanı haftalık ders saatiyle çarpılır, bu çarpımlar toplanır ve toplam haftalık ders saatine bölünür. Sonuç virgülden sonra dört basamak olarak hesaplanır.

### Takdir belgesi için ortalama kaç olmalı?

Dönem puanlarının ağırlıklı ortalaması {{lise.takdir}} ve üzerinde olmalıdır. Ayrıca tüm derslerden başarılı olmak ve davranış puanının 100 olması gerekir.

### Teşekkür belgesi kaç ortalamayla alınır?

Ağırlıklı ortalama {{lise.tesekkur}} ile {{lise.takdirAlt}} arasındaysa, tüm derslerden başarılıysanız ve davranış puanınız 100 ise teşekkür belgesi alırsınız.

### Zayıf dersim varsa takdir alabilir miyim?

Hayır. Yönetmeliğe göre teşekkür ve takdir belgesi için tüm derslerden başarılı olmak gerekir. Ortalamanız {{lise.takdir}}'in üzerinde olsa bile bir zayıf ders belgeyi engeller.

### Kaç zayıfla sınıfta kalınır?

Yıl sonu başarı puanı en az {{lise.gecme}} olan öğrenci en fazla {{lise.sorumluMax}} dersten sorumlu geçebilir. Yıl sonu başarı puanı {{lise.gecme}}'nin altındaysa ya da alt sınıflar dahil başarısız ders sayısı {{lise.toplamMax}}'yı aşarsa sınıf tekrarı söz konusu olur.

### İkinci dönem notum {{lise.ikinciDonem}} ise dersi geçer miyim?

Evet. Birinci dönem puanı ne olursa olsun ikinci dönem puanı en az {{lise.ikinciDonem}} olan öğrenci o dersten başarılı sayılır.

### Diploma notu nasıl hesaplanır?

Diploma notu, ortaöğretimdeki her sınıfın yıl sonu başarı puanlarının ortalamasıdır. YKS'de bu not 5 ile çarpılarak OBP'ye dönüştürülür.
