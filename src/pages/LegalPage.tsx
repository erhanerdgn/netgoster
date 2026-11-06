import type { ReactNode } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { site } from '@/config/site';
import { staticPages } from '@/lib/seo';

const updated = '6 Kasım 2026';
const mail = <a href={`mailto:${site.email}`}>{site.email}</a>;

const pages: Record<string, ReactNode> = {
  '/hakkimizda': (
    <>
      <p>
        {site.name}, Türkiye’de en çok ihtiyaç duyulan hesaplamaları — maaş ve tazminattan krediye, sınav puanından sağlık
        göstergelerine kadar — hızlı, doğru ve anlaşılır biçimde sunmak için kurulmuş bağımsız bir hesaplama platformudur.
      </p>
      <h2>Nasıl çalışıyoruz?</h2>
      <ul>
        <li>
          <strong>Resmi kaynaklar:</strong> Asgari ücret, gelir vergisi dilimleri, SGK oranları, kıdem tazminatı tavanı,
          KKDF/BSMV, stopaj, MTV tarifesi gibi parametreleri Resmî Gazete, GİB, SGK, İŞKUR, TÜİK, TCMB, ÖSYM ve MEB yayınlarından
          alırız. Her değerin kaynağını ve geçerlilik tarihini kayıt altında tutarız.
        </li>
        <li>
          <strong>Dönemsel güncelleme:</strong> Parametreler tarih aralıklarıyla saklanır; hesaplama yaptığınız tarihe göre doğru
          dönem otomatik seçilir. Maaş ve vergi değerleri Ocak/Temmuz, TÜFE her ay, sınav katsayıları ve MTV her yıl güncellenir.
        </li>
        <li>
          <strong>Gizlilik:</strong> Hesaplamalar tarayıcınızda yapılır. Girdiğiniz maaş, tarih veya sağlık bilgileri
          sunucularımıza gönderilmez, saklanmaz.
        </li>
        <li>
          <strong>Şeffaflık:</strong> Her aracın altında formülü, örnek hesaplamaları, sık yapılan hataları ve yasal/bilimsel
          dayanağı açıklarız.
        </li>
      </ul>
      <h2>Sorumluluk</h2>
      <p>
        Sonuçlar bilgilendirme amaçlıdır. Kesin tutarlar işvereninizin bordrosu, SGK, vergi dairesi veya ilgili kurumun
        kayıtlarıyla farklılık gösterebilir. Resmi işlemlerde ilgili kuruma veya bir mali müşavire danışmanızı öneririz.
      </p>
      <h2>Bize ulaşın</h2>
      <p>Bir hata fark ettiyseniz ya da yeni bir araç önermek istiyorsanız {mail} adresine yazabilirsiniz.</p>
    </>
  ),
  '/iletisim': (
    <>
      <p>Hata bildirimi, öneri, iş birliği ve reklam talepleriniz için bize e-postayla ulaşabilirsiniz:</p>
      <p>
        <a href={`mailto:${site.email}`} className="text-xl">
          {site.email}
        </a>
      </p>
      <h2>Hata bildirirken</h2>
      <ul>
        <li>Aracın adını veya sayfa bağlantısını (sonuç linkini kopyalayarak) ekleyin.</li>
        <li>Beklediğiniz sonucu ve dayanağını (bordro, resmi yazı vb.) belirtin.</li>
        <li>Kişisel verilerinizi (T.C. kimlik no, tam ad, adres) paylaşmayın; hesaplama için gerekli değildir.</li>
      </ul>
      <p>Mesajlarınıza genellikle 2–3 iş günü içinde dönüş yapıyoruz.</p>
    </>
  ),
  '/gizlilik-politikasi': (
    <>
      <p>
        Bu politika, {site.domain} alan adlı web sitesini ({site.name}) ziyaret ettiğinizde hangi bilgilerin işlendiğini açıklar.
      </p>
      <h2>Hesaplamalara girdiğiniz bilgiler</h2>
      <p>
        Formlara girdiğiniz tüm değerler yalnızca tarayıcınızda işlenir; sunucularımıza gönderilmez. Paylaşım linki
        oluşturduğunuzda değerler bağlantının sorgu kısmına eklenir; bu linki kiminle paylaşacağınız sizin kontrolünüzdedir.
      </p>
      <h2>Tarayıcıda saklanan bilgiler</h2>
      <p>
        Tema tercihiniz, çerez tercihiniz, favori araçlarınız ve “Son kullandıkların” listesi tarayıcınızın yerel depolamasında
        (localStorage) tutulur. “Sonucu kaydet” seçeneğini kullanırsanız hesaplamanın girdileri, sonucu ve tarihi de yalnızca bu
        tarayıcıda saklanır (en fazla 8 kayıt). Kaydettiğiniz hesaplamaları ana sayfadaki hesap köşesinden tek tek silebilirsiniz.
        Karşılaştırma için sabitlenen sonuçlar yalnızca açık sayfanın belleğinde tutulur. Tarayıcı ayarlarından tüm yerel verileri
        silebilirsiniz.
      </p>
      <h2>Sunucu kayıtları</h2>
      <p>
        Barındırma hizmet sağlayıcımız (Cloudflare) güvenlik ve performans amacıyla IP adresi, tarayıcı türü ve istek zamanı gibi
        teknik kayıtları kısa süreliğine işleyebilir.
      </p>
      <h2>Ziyaret istatistikleri</h2>
      <p>
        Sitenin nasıl kullanıldığını anlamak için Google Analytics 4 kullanırız: ziyaret edilen sayfa, yönlendiren site, cihaz
        türü ve yaklaşık konum gibi bilgiler toplu ve anonim olarak raporlanır; IP adresi kısaltılır. Analitik çerezleri yalnızca
        çerez tercihinde “Kabul et” derseniz yazılır; aksi halde Google’a çerezsiz, kimliksiz sayım bilgisi gider.
      </p>
      <h2>Reklamlar ve üçüncü taraflar</h2>
      <p>
        Sitemizde Google AdSense reklamları gösterilebilir. Google ve iş ortakları, onay vermeniz halinde, ilgi alanına dayalı
        reklam göstermek için çerez ve benzeri teknolojiler kullanabilir. Onay vermezseniz yalnızca kişiselleştirilmemiş/sınırlı
        reklamlar gösterilir. Ayrıntılar için{' '}
        <a href="https://policies.google.com/technologies/ads?hl=tr" target="_blank" rel="noopener noreferrer">
          Google’ın reklam politikası
        </a>
        ’na bakabilirsiniz. Kişiselleştirilmiş reklamları{' '}
        <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
          Google Reklam Ayarları
        </a>
        ’ndan kapatabilirsiniz.
      </p>
      <h2>Döviz ve altın verileri</h2>
      <p>
        Kur ve altın fiyatları sunucumuz aracılığıyla TCMB ve üçüncü taraf veri sağlayıcılarından alınır; bu isteklerde sizinle
        ilgili bir bilgi iletilmez.
      </p>
      <h2>Haklarınız</h2>
      <p>
        6698 sayılı KVKK kapsamındaki haklarınız için <a href="/kvkk-aydinlatma-metni">KVKK Aydınlatma Metni</a>’ni inceleyebilir,
        talepleriniz için {mail} adresine yazabilirsiniz.
      </p>
    </>
  ),
  '/cerez-politikasi': (
    <>
      <p>Çerezler, ziyaret ettiğiniz sitenin tarayıcınıza kaydettiği küçük metin dosyalarıdır.</p>
      <h2>Kullandığımız çerez ve benzeri teknolojiler</h2>
      <ul>
        <li>
          <strong>Zorunlu (yerel depolama):</strong> tema ve çerez tercihiniz, son kullandığınız araçlar. Sitenin çalışması için
          gereklidir, onay gerektirmez.
        </li>
        <li>
          <strong>Reklam çerezleri (onaya bağlı):</strong> Google AdSense ve iş ortaklarının reklamları ölçmek ve kişiselleştirmek
          için kullandığı çerezler. Yalnızca “Kabul et” seçeneğini işaretlerseniz etkinleşir.
        </li>
        <li>
          <strong>Analitik çerezleri (onaya bağlı):</strong> Google Analytics 4’ün ziyaretleri anonim olarak ölçmek için
          kullandığı çerezler (_ga, _ga_*). Onay vermezseniz yazılmaz; yalnızca çerezsiz sayım gönderilir.
        </li>
      </ul>
      <h2>Tercihlerinizi yönetme</h2>
      <p>
        Sayfanın altındaki “Çerez tercihleri” bağlantısından seçiminizi istediğiniz zaman değiştirebilirsiniz. Tarayıcınızın
        ayarlarından da çerezleri silebilir veya engelleyebilirsiniz. Avrupa Ekonomik Alanı, Birleşik Krallık ve İsviçre’den gelen
        ziyaretçilere Google’ın sertifikalı onay yönetim platformu (CMP) üzerinden ayrı bir onay penceresi gösterilir.
      </p>
      <h2>Google’ın çerez kullanımı</h2>
      <p>
        Google’ın topladığı veriler hakkında bilgi için{' '}
        <a href="https://policies.google.com/technologies/partner-sites?hl=tr" target="_blank" rel="noopener noreferrer">
          “Google, iş ortaklarının sitelerini kullandığınızda verileri nasıl kullanır?”
        </a>{' '}
        sayfasını inceleyebilirsiniz.
      </p>
    </>
  ),
  '/kullanim-sartlari': (
    <>
      <p>{site.domain} sitesini kullanarak aşağıdaki şartları kabul etmiş sayılırsınız.</p>
      <h2>Hizmetin niteliği</h2>
      <p>
        {site.name} araçları genel bilgilendirme amaçlıdır; hukuki, mali, tıbbi veya yatırım tavsiyesi değildir. Sonuçlar
        kullanılan parametrelere, varsayımlara ve girdiğiniz bilgilere bağlıdır. Sınav puanları tahminidir; resmi sonuçlar
        ÖSYM/MEB tarafından açıklanır. Sağlık araçları doktor muayenesinin yerini tutmaz.
      </p>
      <h2>Sorumluluğun sınırlandırılması</h2>
      <p>
        Parametreleri resmi kaynaklardan güncel tutmaya özen gösteririz; ancak mevzuat değişikliklerinin yansıtılmasında gecikme
        veya hata olabilir. Sonuçlara dayanarak alınan kararlardan doğabilecek zararlardan {site.name} sorumlu tutulamaz.
      </p>
      <h2>Fikri mülkiyet</h2>
      <p>
        Sitedeki metinler, tasarım ve yazılım {site.name}’e aittir. Kaynak göstermek ve bağlantı vermek kaydıyla kısa alıntı
        yapılabilir; içeriğin toplu kopyalanması yasaktır.
      </p>
      <h2>Değişiklikler</h2>
      <p>Bu şartlar gerektiğinde güncellenebilir; güncel metin her zaman bu sayfada yayımlanır.</p>
    </>
  ),
  '/kvkk-aydinlatma-metni': (
    <>
      <p>
        6698 sayılı Kişisel Verilerin Korunması Kanunu’nun (KVKK) 10. maddesi uyarınca, {site.name} olarak veri sorumlusu
        sıfatıyla kişisel verilerinizin işlenmesine ilişkin sizi bilgilendiririz.
      </p>
      <h2>İşlenen veriler</h2>
      <ul>
        <li>Hesaplama formlarına girilen değerler kişisel veri olarak sunucularımızda işlenmez; yalnızca cihazınızda işlenir.</li>
        <li>E-postayla bize ulaşırsanız: ad, e-posta adresi ve mesaj içeriği.</li>
        <li>İşlem güvenliği: IP adresi, tarayıcı bilgisi ve erişim zamanı (barındırma sağlayıcısı kayıtları).</li>
        <li>Onay vermeniz halinde: reklam ve analitik çerezleri aracılığıyla çevrim içi tanımlayıcılar.</li>
      </ul>
      <h2>İşleme amaçları ve hukuki sebepler</h2>
      <ul>
        <li>Taleplerinizin yanıtlanması — KVKK m. 5/2-c ve f (sözleşme/meşru menfaat).</li>
        <li>Bilgi güvenliğinin sağlanması — KVKK m. 5/2-ç ve f (hukuki yükümlülük/meşru menfaat).</li>
        <li>Kişiselleştirilmiş reklam ve çerezli ziyaret istatistikleri — KVKK m. 5/1 (açık rıza).</li>
      </ul>
      <h2>Aktarım</h2>
      <p>
        Veriler; barındırma (Cloudflare, Inc.), ziyaret istatistikleri ve onay vermeniz halinde reklam (Google Ireland Ltd./Google
        LLC) hizmet sağlayıcılarına, KVKK m. 9’daki usullere uygun olarak yurt dışına aktarılabilir.
      </p>
      <h2>Haklarınız (KVKK m. 11)</h2>
      <p>
        Verilerinizin işlenip işlenmediğini öğrenme, bilgi talep etme, düzeltilmesini veya silinmesini isteme, itiraz etme ve
        zararın giderilmesini talep etme haklarına sahipsiniz. Başvurularınızı {mail} adresine iletebilirsiniz; en geç 30 gün
        içinde yanıtlanır.
      </p>
    </>
  ),
};

export default function LegalPage({ path }: { path: string }) {
  const meta = staticPages[path];
  return (
    <div className="container-page pb-12">
      <Breadcrumbs items={[{ name: meta.title, path }]} />
      <article className="mx-auto max-w-3xl rounded-2xl border bg-card p-6 shadow-soft sm:p-10">
        <h1 className="text-3xl font-bold tracking-tight">{meta.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">Son güncelleme: {updated}</p>
        <div className="prose-ng mt-6">{pages[path]}</div>
      </article>
    </div>
  );
}
