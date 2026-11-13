## Veri boyutu birimleri: bit, bayt ve ön ekler

Dijital verinin en küçük birimi **bit**'tir (0 ya da 1). 8 bit bir **bayt** (B) eder; bir harf, bir rakam ya da bir sembol genellikle 1 bayt yer tutar. Daha büyük miktarlar için ön ekler kullanılır ve kafa karışıklığı tam da burada başlar: aynı "kilo, mega, giga" ön ekleri iki farklı sistemde iki farklı değer anlatır.

- **SI (ondalık) sistem:** kilo = 1000, mega = 1000², giga = 1000³. Uluslararası Birimler Sistemi'nin ön ekleridir ([BIPM SI Broşürü](https://www.bipm.org/en/publications/si-brochure)). Disk, SSD ve USB bellek üreticileri, internet hızları ve macOS bu sistemi kullanır.
- **IEC (ikili) sistem:** kibi = 1024, mebi = 1024², gibi = 1024³. Uluslararası Elektroteknik Komisyonu 1998'de bu ayrı ön ekleri (KiB, MiB, GiB, TiB) onayladı ([NIST, ikili ön ekler](https://physics.nist.gov/cuu/Units/binary.html)). RAM ve işletim sistemlerinin dosya boyutları ikili katlarla hesaplanır.

{{veri.tablo.birim}}

Çeviricide değeri ve birimini girin, "Gösterilecek sistem" seçimiyle SI ya da IEC karşılıklarını listeleyin. Bit ve bayt her iki sistemde de gösterilir. Büyük sonuç, değeri 1'den büyük olan en büyük birimdir.

> **Hedef değer = Kaynak değer × (kaynak birimin bayt karşılığı) ÷ (hedef birimin bayt karşılığı)**

## 1 TB disk neden Windows'ta 931 GB görünür?

Yeni aldığınız 1 TB'lık diski bilgisayara taktığınızda Windows Gezgini yaklaşık **{{veri.tbGib}} GB** gösterir. Kaybolan bir alan yoktur; yalnız iki sistem farklı ölçer:

1. Üretici SI kullanır: 1 TB = 10¹² = 1.000.000.000.000 bayt.
2. Windows bu bayt sayısını 1024'ün kuvvetlerine böler: 10¹² ÷ 1024³ = **{{veri.tbGib}}**. Sonuç aslında gibibayttır (GiB), ama Windows bunu "GB" etiketiyle yazar.
3. Aynı disk TiB cinsinden {{veri.tbTib}} TiB eder; aradaki fark yaklaşık **%{{veri.tbKayip}}**'dur.

Fark birim büyüdükçe artar: GB düzeyinde yaklaşık %7, TB düzeyinde yaklaşık %9'dur. Buna ek olarak diskin biçimlendirilmesi, kurtarma bölümü ve sistem dosyaları da bir miktar yer kaplar; bu kısım birim farkından bağımsızdır. macOS ise 2009'dan bu yana SI kullandığı için 1 TB diski 1 TB olarak gösterir.

{{veri.tablo.disk}}

## İnternet hızı: Mbps ve MB/s farkı

İnternet paketleri hızı **megabit/saniye (Mbps)** ile, tarayıcılar ve oyun platformları indirme hızını çoğunlukla **megabayt/saniye (MB/s)** ile gösterir. 1 bayt 8 bit olduğundan:

> **MB/s = Mbps ÷ 8** · **İndirme süresi (sn) = Dosya boyutu (bit) ÷ Hız (bit/sn)**

100 Mbps'lik bir bağlantı en fazla **{{veri.100mbps}} MB/s** indirir. Çeviricinin "İndirme süresi" modu bu hesabı yapar: dosya boyutunu ve hızınızı girdiğinizde ideal süreyi ve %10 ağ payıyla gerçekçi bir tahmini gösterir.

### Örnek: 100 Mbps ile 5 GB kaç dakikada iner?

- 5 GB = 5 × 10⁹ bayt × 8 = **{{veri.5gbBit}} megabit**,
- 100 Mbps = 100 megabit/saniye,
- Süre = {{veri.5gbBit}} ÷ 100 = {{veri.5gb100sn}} saniye = **{{veri.5gb100}}**.

Gerçekte TCP/IP protokol başlıkları, Wi-Fi kayıpları ve sunucu hızı nedeniyle süre biraz uzar; %90 verimle yaklaşık {{veri.5gb100ger}} sürer. Aynı dosya 1000 Mbps (gigabit) fiberde ideal koşulda {{veri.5gb1000}} sürede, 50 GB'lık bir oyun ise {{veri.50gb1000}} sürede iner.

{{veri.tablo.indirme}}

Tablodaki süreler ideal (tam hız) değerlerdir. Akşam saatlerinde yoğunluk, eski modemler ya da kablosuz bağlantı gerçek hızı düşürebilir; kendi hız testinizin sonucunu çeviriciye yazarak daha gerçekçi bir süre elde edebilirsiniz.

## Üç örnek hesap

1. **SSD:** 500 GB'lık SSD Windows'ta kaç GB görünür? 500 × 10⁹ ÷ 1024³ = **{{veri.500Gib}} GB** (GiB).
2. **Telefon depolaması:** 256 GB'lık telefon, ikili sistemde {{veri.256Gib}} GiB eder.
3. **Harici disk:** 2 TB = {{veri.2tbGib}} GiB = **{{veri.2tbTib}} TiB**; Windows bunu yaklaşık "{{veri.2tbTib}} TB" olarak gösterir.

## Sık yapılan hatalar

- **Mbps ile MB/s'yi karıştırmak:** 100 Mbps internet saniyede 100 MB değil, {{veri.100mbps}} MB indirir.
- **Küçük b ile büyük B'yi karıştırmak:** "Mb" megabit, "MB" megabayttır; arada 8 kat fark vardır.
- **Diskte eksik kapasite var sanmak:** 1 TB diskin 931 GB görünmesi arıza değil, birim farkıdır.
- **1 GB'ı her yerde 1024 MB saymak:** Disk etiketinde ve internet kotalarında 1 GB = 1000 MB'tır; 1024 yalnız GiB için doğrudur.
- **Mobil kotayı ikili hesaplamak:** Operatörler kotayı genellikle ondalık sistemle (1 GB = 1000 MB) hesaplar; ayrıntı için tarifenizin koşullarına bakın.

Yüzdelik farkları kendiniz hesaplamak için [yüzde hesaplama](/yuzde-hesaplama), diğer dönüşümler için [uzunluk çevirici](/uzunluk-cevirici) aracını kullanabilirsiniz.

<!-- sss -->

### 1 TB kaç GB?

SI sistemine göre 1 TB = **1000 GB**'tır (disk üreticileri bu değeri kullanır). İkili sistemde ise 1 TB = {{veri.tbGib}} GiB eder; Windows'un gösterdiği 931 GB budur.

### 1 GB kaç MB?

Ondalık sistemde 1 GB = 1000 MB'tır. İkili sistemde 1 GiB = 1024 MiB'tır. Windows ve RAM ikili, disk etiketleri ve internet kotaları ondalık sistemi kullanır.

### 1 TB disk neden 931 GB görünüyor?

Üretici 1 TB'ı 10¹² bayt olarak sayar; Windows bu bayt sayısını 1024³'e bölüp sonucu "GB" diye yazar: 10¹² ÷ 1.073.741.824 = {{veri.tbGib}}. Fark kayıp değil, birim farkıdır.

### 100 Mbps kaç MB/s?

100 ÷ 8 = **{{veri.100mbps}} MB/s**'dir. Bir bayt 8 bit olduğu için Mbps değeri 8'e bölünür.

### 100 Mbps ile 5 GB kaç dakikada iner?

İdeal koşulda **{{veri.5gb100}}** ({{veri.5gb100sn}} saniye). Protokol payı ve kablosuz kayıplarla bu süre {{veri.5gb100ger}} civarına çıkabilir.

### KB ile KiB arasındaki fark nedir?

1 kB (kilobayt) 1000 bayt, 1 KiB (kibibayt) 1024 bayttır. KiB, MiB, GiB gibi ikili ön ekler karışıklığı önlemek için IEC tarafından tanımlanmıştır.

### 1 GiB kaç bayt?

1 GiB = 2³⁰ = **{{veri.gibB}} bayt**'tır; yani {{veri.gibGb}} GB eder.

### 1 bayt kaç bit?

1 bayt **8 bit**'tir. Bit "b", bayt "B" ile kısaltılır: Mbps megabit, MB megabayttır.
