import type { CategorySlug } from '@/tools.registry';

/**
 * Kategori sayfalarının özgün giriş metinleri (SEO + kullanıcıya yön gösterme).
 * Rakam içermez; güncel değerler araç sayfalarında parametrelerden gelir.
 */
export const categoryIntro: Record<CategorySlug, { lead: string; paragraphs: string[] }> = {
  calisma: {
    lead: 'Bordronuzdan işten ayrılışa kadar çalışma hayatının bütün hesapları, güncel asgari ücret, vergi dilimleri ve SGK oranlarıyla.',
    paragraphs: [
      'Brüt maaşınızın neden her ay aynı nete dönüşmediğini merak ettiyseniz cevap kümülatif gelir vergisi matrahındadır: yıl içinde kazancınız birikip üst dilimlere geçtikçe kesinti artar. Brütten nete ve netten brüte araçlarımız 12 ayın tamamını tek tabloda gösterir; asgari ücret gelir ve damga vergisi istisnasını her ay ayrı ayrı uygular.',
      'İş sözleşmesi sona erdiğinde ise kıdem tazminatı, ihbar tazminatı, kullanılmayan yıllık izin ücreti ve işsizlik ödeneği gündeme gelir. Bu hakların her biri farklı bir kanun maddesine, farklı bir tavana ve farklı vergi kurallarına tabidir. Araçlarımız fesih tarihinize göre doğru dönemin tavanını ve oranını kendiliğinden seçer.',
      'İşverenler için işveren maliyeti ve fazla mesai hesaplayıcıları; SGK işveren payını, işsizlik primini, hazine teşvik indirimini ve zamlı çalışma ücretlerini kalem kalem gösterir.',
    ],
  },
  sigorta: {
    lead: 'Ne zaman emekli olabileceğinizi ve Bağkur prim borcunuzu, ilk sigorta giriş tarihinize ve güncel prime esas kazanç sınırlarına göre öğrenin.',
    paragraphs: [
      'Türkiye’de emeklilik şartları tek bir kurala bağlı değildir: ilk sigorta giriş tarihinizin 08.09.1999 öncesi, 1999–2008 arası veya 2008 sonrası olması; prim gün sayısı, sigortalılık süresi ve yaş şartını tamamen değiştirir. EYT düzenlemesiyle 1999 öncesi girişlerde yaş şartı kaldırılmış, ancak prim günü ve sigortalılık süresi şartları korunmuştur.',
      'Emeklilik hesaplayıcımız 4/a (SSK), 4/b (Bağkur) ve 4/c (memur) statülerinin her biri için ilgili geçiş hükmünü uygular, eksik prim gününüzü ve tahmini emeklilik tarihinizi gösterir.',
      'Bağkur prim hesaplayıcısı ise beyan ettiğiniz kazanca göre aylık ve yıllık prim tutarını, süresinde ödeme yapan ve borcu olmayan sigortalılara uygulanan 5 puanlık indirimle birlikte karşılaştırır.',
    ],
  },
  finans: {
    lead: 'Kredi taksitinden mevduat getirisine, KDV’den döviz ve altına: paranızla ilgili günlük kararlar için hızlı ve şeffaf hesaplamalar.',
    paragraphs: [
      'Bankaların ilan ettiği faiz oranı, ödeyeceğiniz gerçek maliyetin tamamı değildir. Tüketici kredilerinde faize KKDF ve BSMV eklenir; kredi hesaplayıcımız bu vergileri dahil ederek aylık taksiti ve her ayın faiz, vergi ve anapara dağılımını gösteren tam ödeme planını çıkarır.',
      'Vadeli mevduatta ise brüt faizden, hesabın açıldığı tarihe ve vadeye göre değişen stopaj kesilir. Mevduat aracımız net getirinizi ve net yıllık getiri oranınızı hesaplar.',
      'Döviz çevirici Türkiye Cumhuriyet Merkez Bankası’nın günlük kurlarını, altın hesaplayıcı ise uluslararası ons fiyatı ile TCMB kurundan türetilen has değeri kullanır; veri alınamadığında son başarılı değeri tarihiyle gösterir veya kendi fiyatınızı girmenize izin verir.',
    ],
  },
  konut: {
    lead: 'Ev ve araç sahipliğinin yasal giderleri: kira artışı, tapu harcı, emlak vergisi, aidat paylaşımı, MTV ve yol masrafı.',
    paragraphs: [
      'Kira sözleşmesi yenilenirken uygulanabilecek en yüksek artış oranı, Türk Borçlar Kanunu’na göre bir önceki ayın 12 aylık ortalama TÜFE değişimidir. Kira artış hesaplayıcımız TÜİK verisini ay ay tutar; yenileme ayınızı seçtiğinizde doğru oranı ve yeni kiranızı gösterir.',
      'Ev alıp satarken alıcı ve satıcıya düşen tapu harcı ile döner sermaye ücreti, sahip olduğunuz konut, işyeri, arsa ve arazi için de belediyeye ödenen emlak vergisi ayrı araçlarda hesaplanır. Apartman ve site yöneticileri için aidat aracı, giderleri eşit, arsa payı veya metrekare oranında paylaştırır ve kuruşu kuruşuna tutan daire tablosu çıkarır.',
      'Araç sahipleri motorlu taşıtlar vergisini motor hacmi, yaş ve taşıt değerine göre güncel tarifeden; yolculuk maliyetini ise tüketim ve yakıt fiyatına göre hesaplayabilir.',
    ],
  },
  egitim: {
    lead: 'YKS, LGS, KPSS, ALES ve YDS puanınızı netlerinizden tahmin edin; lise ve üniversite not ortalamanızı ağırlıklı olarak hesaplayın.',
    paragraphs: [
      'ÖSYM ve MEB puanları standart puan yöntemiyle, o yıl sınava giren adayların dağılımına göre hesaplanır; bu nedenle sınavdan önce kesin puan bilinemez. Sınav araçlarımız önceki yılların sonuçlarından türetilmiş katsayılarla tahmini puan üretir ve kullanılan katsayıların hangi yıla dayandığını açıkça belirtir.',
      'Netler her sınavın kendi kuralına göre bulunur: YKS, KPSS ve ALES’te dört yanlış bir doğruyu, LGS’de üç yanlış bir doğruyu götürür; YDS’de ise yanlışlar puanı etkilemez.',
      'Not ortalaması araçları lise için ders saati ağırlıklı yıl sonu başarı puanını ve takdir-teşekkür durumunu, üniversite için AKTS veya kredi ağırlıklı dönem ortalamasını, GANO’yu ve YÖK’ün 4’lük–100’lük dönüşümünü verir.',
    ],
  },
  saglik: {
    lead: 'Gebelik haftası, vücut kitle indeksi, günlük kalori ve su ihtiyacı — bilimsel formüllerle, kaynaklarıyla birlikte.',
    paragraphs: [
      'Sağlık hesaplayıcılarımız Dünya Sağlık Örgütü, Avrupa Gıda Güvenliği Otoritesi ve hakemli bilimsel yayınlardaki yöntemleri kullanır; her sayfanın sonunda başvurulan kaynakların bağlantıları yer alır.',
      'Gebelik haftası aracı son adet tarihinizden haftanızı, trimesterinizi ve tahmini doğum tarihinizi hesaplar; önemli tarama haftalarını takvim tarihleriyle listeler. Vücut kitle indeksi aracı DSÖ sınıflandırmasındaki yerinizi ve boyunuza göre sağlıklı kilo aralığını gösterir.',
      'Kalori aracı Mifflin-St Jeor denklemiyle bazal metabolizma hızınızı ve aktivite düzeyinize göre günlük enerji ihtiyacınızı, su aracı ise kilonuz ve hareket düzeyinize göre günlük sıvı ihtiyacınızı hesaplar. Bu araçlar tıbbi tavsiye yerine geçmez; kişisel durumunuz için doktorunuza danışın.',
    ],
  },
  gunluk: {
    lead: 'Günlük hayatın pratik hesapları: tam yaşınız, iki tarih arası gün ve iş günü sayısı, yüzde ve indirim hesaplamaları.',
    paragraphs: [
      'Yaş hesaplayıcı doğum tarihinizden yıl, ay ve gün olarak tam yaşınızı, yaşadığınız toplam gün sayısını ve bir sonraki doğum gününüze kalan süreyi verir. Tarih hesaplayıcı iki tarih arasındaki farkı bulur, bir tarihe gün ekler veya çıkarır; isterseniz hafta sonlarını ve Türkiye’deki resmi tatilleri (dini bayramlar ve arifeler dahil) hariç tutarak yalnızca iş günlerini sayar.',
      'Yüzde aracı bir sayının yüzdesini, iki değer arasındaki yüzde değişimi ve bir sayının diğerinin yüzde kaçı olduğunu formülüyle birlikte adım adım gösterir. İndirim aracı ise indirimli fiyatı, iki fiyat arasındaki indirim oranını ve ardışık indirimlerin gerçek toplam etkisini hesaplar — yüzde 30 ve ardından yüzde 20 indirimin neden yüzde 50 etmediğini görürsünüz.',
    ],
  },
};
