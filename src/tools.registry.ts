import type { LucideIcon } from 'lucide-react';
import {
  Apple,
  ArrowLeftRight,
  Award,
  BadgePercent,
  Baby,
  BookOpen,
  Briefcase,
  Building2,
  CalendarClock,
  CalendarDays,
  CalendarRange,
  Car,
  Clock,
  Coins,
  Droplets,
  FileText,
  Fuel,
  Gem,
  GraduationCap,
  HandCoins,
  HeartPulse,
  Home,
  House,
  Landmark,
  Languages,
  Percent,
  PiggyBank,
  Receipt,
  School,
  ShieldCheck,
  Sun,
  Tag,
  Timer,
  TrendingUp,
  UserRoundCheck,
  Users,
  Wallet,
  Weight,
} from 'lucide-react';

export type WarningType = 'finans' | 'saglik' | 'sinav' | 'yok';

export const warnings: Record<Exclude<WarningType, 'yok'>, string> = {
  finans: 'Sonuçlar bilgilendirme amaçlıdır; kesin tutar için işvereniniz, SGK veya mali müşavirinize danışın.',
  saglik: 'Bu araç tıbbi tavsiye değildir; doktorunuza danışın.',
  sinav: 'Tahmini sonuçtur; resmi sonuç ÖSYM/MEB tarafından açıklanır.',
};

export type CategorySlug = 'calisma' | 'sigorta' | 'finans' | 'konut' | 'egitim' | 'saglik' | 'gunluk';

export interface Category {
  id: CategorySlug;
  slug: string;
  name: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export const categories: Category[] = [
  {
    id: 'calisma',
    slug: 'calisma-hesaplamalari',
    name: 'Çalışma ve Maaş',
    title: 'Çalışma ve Maaş Hesaplamaları',
    description: 'Kıdem ve ihbar tazminatı, brütten nete maaş, işveren maliyeti, işsizlik maaşı, izin ve fazla mesai.',
    icon: Briefcase,
  },
  {
    id: 'sigorta',
    slug: 'sigorta-emeklilik-hesaplamalari',
    name: 'Sigorta ve Emeklilik',
    title: 'Sigorta ve Emeklilik Hesaplamaları',
    description: 'Bağkur prim tutarı ve 4/a, 4/b, 4/c emeklilik yaşı, prim günü ve EYT durumu.',
    icon: ShieldCheck,
  },
  {
    id: 'finans',
    slug: 'finans-hesaplamalari',
    name: 'Finans',
    title: 'Finans Hesaplamaları',
    description: 'Kredi ödeme planı, mevduat getirisi, KDV, döviz çevirici ve altın hesaplama.',
    icon: Landmark,
  },
  {
    id: 'konut',
    slug: 'konut-arac-hesaplamalari',
    name: 'Konut ve Araç',
    title: 'Konut ve Araç Hesaplamaları',
    description: 'Kira artışı, tapu harcı, emlak vergisi, aidat paylaşımı, MTV ve yakıt maliyeti.',
    icon: Home,
  },
  {
    id: 'egitim',
    slug: 'egitim-sinav-hesaplamalari',
    name: 'Eğitim ve Sınav',
    title: 'Eğitim ve Sınav Hesaplamaları',
    description: 'YKS, LGS, KPSS, ALES, YDS puanı ile lise ve üniversite not ortalaması.',
    icon: GraduationCap,
  },
  {
    id: 'saglik',
    slug: 'saglik-hesaplamalari',
    name: 'Sağlık',
    title: 'Sağlık Hesaplamaları',
    description: 'Gebelik haftası, vücut kitle indeksi, günlük kalori ve su ihtiyacı.',
    icon: HeartPulse,
  },
  {
    id: 'gunluk',
    slug: 'gunluk-hesaplamalar',
    name: 'Tarih ve Günlük',
    title: 'Tarih ve Günlük Hesaplamalar',
    description: 'Yaş, iki tarih arası gün, yüzde ve indirim hesaplama.',
    icon: CalendarDays,
  },
];

export interface Tool {
  slug: string;
  /** H1 ve başlıkta kullanılan tam ad: "Kıdem Tazminatı Hesaplama" */
  title: string;
  /** Kısa ad (kart, menü): "Kıdem Tazminatı" */
  name: string;
  /** Meta description (~155 karakter) */
  description: string;
  /** H1 altındaki kısa giriş */
  lead: string;
  category: CategorySlug;
  icon: LucideIcon;
  related: string[];
  warning: WarningType;
  /** Arama için ek anahtar kelimeler */
  keywords: string[];
  /** Başlığa yıl eklenmesin (yıl anlamsızsa) */
  noYear?: boolean;
  popular?: boolean;
  /** İçerik/parametre son güncelleme, YYYY-MM-DD */
  updated: string;
}

const U = '2026-11-04';

export const tools: Tool[] = [
  // ─── Çalışma ve maaş ───
  {
    slug: 'kidem-tazminati-hesaplama',
    title: 'Kıdem Tazminatı Hesaplama',
    name: 'Kıdem Tazminatı',
    description:
      'Kıdem tazminatı hesaplama: giriş-çıkış tarihi ve giydirilmiş brüt ücretle tavan kontrollü, damga vergisi kesintili net kıdem tazminatınızı anında öğrenin.',
    lead: 'İşe giriş ve çıkış tarihinizle giydirilmiş brüt ücretinizi girin; tavan kontrolü ve damga vergisi dahil net tazminatınız anında hesaplansın.',
    category: 'calisma',
    icon: HandCoins,
    related: ['ihbar-tazminati-hesaplama', 'yillik-izin-hesaplama', 'issizlik-maasi-hesaplama', 'brutten-nete-maas-hesaplama'],
    warning: 'finans',
    keywords: ['kıdem', 'tazminat', 'işten çıkış', 'tavan', 'kidem'],
    popular: true,
    updated: U,
  },
  {
    slug: 'ihbar-tazminati-hesaplama',
    title: 'İhbar Tazminatı Hesaplama',
    name: 'İhbar Tazminatı',
    description:
      'İhbar tazminatı hesaplama: çalışma sürenize göre ihbar süresini (2-8 hafta) bulun, gelir vergisi ve damga vergisi kesintisiyle net ihbar tazminatınızı görün.',
    lead: 'Çalışma sürenize göre ihbar süresi belirlenir; brüt tutar, gelir vergisi ve damga vergisi kesintisiyle net ihbar tazminatı hesaplanır.',
    category: 'calisma',
    icon: Clock,
    related: ['kidem-tazminati-hesaplama', 'issizlik-maasi-hesaplama', 'brutten-nete-maas-hesaplama', 'yillik-izin-hesaplama'],
    warning: 'finans',
    keywords: ['ihbar', 'bildirim süresi', 'tazminat', 'işten çıkarılma'],
    popular: true,
    updated: U,
  },
  {
    slug: 'brutten-nete-maas-hesaplama',
    title: 'Brütten Nete Maaş Hesaplama',
    name: 'Brütten Nete Maaş',
    description:
      'Brütten nete maaş hesaplama: SGK, işsizlik, kümülatif gelir vergisi ve damga vergisi kesintileri, asgari ücret istisnasıyla 12 aylık net maaş tablonuz.',
    lead: 'Brüt maaşınızı girin; SGK ve işsizlik primi, kümülatif matraha göre gelir vergisi ve damga vergisi düşülerek 12 ayın net maaşı tablo halinde hesaplansın.',
    category: 'calisma',
    icon: Wallet,
    related: ['netten-brute-maas-hesaplama', 'isveren-maliyeti-hesaplama', 'asgari-ucret-hesaplama', 'fazla-mesai-hesaplama'],
    warning: 'finans',
    keywords: ['maaş', 'net maaş', 'brüt', 'bordro', 'gelir vergisi', 'sgk kesintisi'],
    popular: true,
    updated: U,
  },
  {
    slug: 'netten-brute-maas-hesaplama',
    title: 'Netten Brüte Maaş Hesaplama',
    name: 'Netten Brüte Maaş',
    description:
      'Netten brüte maaş hesaplama: elinize geçmesini istediğiniz net maaş için gereken brüt ücreti, tüm kesintileri ve 12 aylık dökümü ters hesaplamayla bulun.',
    lead: 'Hedeflediğiniz net maaşı girin; kümülatif vergi dilimleri dikkate alınarak her ay için gereken brüt ücret ters hesaplamayla bulunsun.',
    category: 'calisma',
    icon: ArrowLeftRight,
    related: ['brutten-nete-maas-hesaplama', 'isveren-maliyeti-hesaplama', 'asgari-ucret-hesaplama', 'kidem-tazminati-hesaplama'],
    warning: 'finans',
    keywords: ['netten brüte', 'brüt maaş', 'maaş pazarlığı', 'bordro'],
    popular: true,
    updated: U,
  },
  {
    slug: 'asgari-ucret-hesaplama',
    title: 'Asgari Ücret Hesaplama',
    name: 'Asgari Ücret',
    description:
      'Asgari ücret hesaplama: güncel brüt ve net asgari ücret, SGK ve vergi kesintileri ile işverene toplam maliyeti kalem kalem gösteren döküm.',
    lead: 'Güncel asgari ücretin brütten nete dökümü ve işverene toplam maliyeti; günlük, saatlik ve yıllık karşılıklarıyla birlikte.',
    category: 'calisma',
    icon: Receipt,
    related: [
      'brutten-nete-maas-hesaplama',
      'isveren-maliyeti-hesaplama',
      'netten-brute-maas-hesaplama',
      'issizlik-maasi-hesaplama',
    ],
    warning: 'finans',
    keywords: ['asgari ücret', 'asgari maaş', 'minimum ücret', 'asgari ücret net'],
    popular: true,
    updated: U,
  },
  {
    slug: 'isveren-maliyeti-hesaplama',
    title: 'İşveren Maliyeti Hesaplama',
    name: 'İşveren Maliyeti',
    description:
      'İşveren maliyeti hesaplama: brüt maaştan SGK işveren payı, işsizlik primi ve hazine teşvik indirimiyle bir çalışanın işverene aylık ve yıllık toplam maliyeti.',
    lead: 'Brüt maaşı girin; SGK işveren payı ve işsizlik primi eklenerek, isteğe bağlı teşvik indirimiyle çalışanın işverene toplam maliyeti hesaplansın.',
    category: 'calisma',
    icon: Building2,
    related: [
      'brutten-nete-maas-hesaplama',
      'asgari-ucret-hesaplama',
      'netten-brute-maas-hesaplama',
      'kidem-tazminati-hesaplama',
    ],
    warning: 'finans',
    keywords: ['işveren maliyeti', 'sgk işveren payı', 'personel maliyeti', 'teşvik'],
    updated: U,
  },
  {
    slug: 'issizlik-maasi-hesaplama',
    title: 'İşsizlik Maaşı Hesaplama',
    name: 'İşsizlik Maaşı',
    description:
      'İşsizlik maaşı hesaplama: son 4 ayın brüt ortalaması ve prim gününüze göre aylık işsizlik ödeneği, ödeme süresi, tavan ve damga vergisi kesintisi.',
    lead: 'Son 4 aylık brüt kazancınızı ve prim gün sayınızı girin; İŞKUR işsizlik ödeneği tutarı, tavanı ve kaç ay ödeneceği hesaplansın.',
    category: 'calisma',
    icon: Users,
    related: ['kidem-tazminati-hesaplama', 'ihbar-tazminati-hesaplama', 'asgari-ucret-hesaplama', 'emeklilik-hesaplama'],
    warning: 'finans',
    keywords: ['işsizlik maaşı', 'işsizlik ödeneği', 'işkur', 'issizlik'],
    popular: true,
    updated: U,
  },
  {
    slug: 'yillik-izin-hesaplama',
    title: 'Yıllık İzin Hesaplama',
    name: 'Yıllık İzin',
    description:
      'Yıllık izin hesaplama: İş Kanunu md. 53’e göre kıdeminize ve yaşınıza göre yıllık ücretli izin gün sayınızı ve hak ediş tarihinizi öğrenin.',
    lead: 'İşe giriş tarihinizi ve doğum tarihinizi girin; kıdem ve yaş kuralına göre yıllık ücretli izin hakkınız hesaplansın.',
    category: 'calisma',
    icon: Sun,
    related: ['kidem-tazminati-hesaplama', 'fazla-mesai-hesaplama', 'tarih-hesaplama', 'ihbar-tazminati-hesaplama'],
    warning: 'finans',
    keywords: ['yıllık izin', 'ücretli izin', 'izin hakkı', 'izin günü'],
    updated: U,
  },
  {
    slug: 'fazla-mesai-hesaplama',
    title: 'Fazla Mesai Hesaplama',
    name: 'Fazla Mesai',
    description:
      'Fazla mesai hesaplama: brüt maaştan saatlik ücret, %50 zamlı fazla çalışma, hafta tatili ve bayram çalışması ücreti ile yaklaşık net karşılığı.',
    lead: 'Brüt maaşınızı ve fazla çalışma saatlerinizi girin; saatlik ücret, %50 zamlı mesai ve tatil günü çalışması ücreti hesaplansın.',
    category: 'calisma',
    icon: Timer,
    related: ['brutten-nete-maas-hesaplama', 'yillik-izin-hesaplama', 'asgari-ucret-hesaplama', 'isveren-maliyeti-hesaplama'],
    warning: 'finans',
    keywords: ['fazla mesai', 'mesai ücreti', 'saatlik ücret', 'bayram mesaisi'],
    updated: U,
  },
  // ─── Sigorta ve emeklilik ───
  {
    slug: 'bagkur-prim-hesaplama',
    title: 'Bağkur Prim Hesaplama',
    name: 'Bağkur Prim',
    description:
      'Bağkur prim hesaplama: beyan ettiğiniz kazanca göre 4/b aylık ve yıllık prim tutarı, 5 puanlık indirimli ve indirimsiz prim karşılaştırması.',
    lead: 'Prime esas aylık kazancınızı seçin; 4/b (Bağkur) aylık ve yıllık prim borcunuz indirimli ve indirimsiz olarak hesaplansın.',
    category: 'sigorta',
    icon: PiggyBank,
    related: ['emeklilik-hesaplama', 'asgari-ucret-hesaplama', 'brutten-nete-maas-hesaplama', 'isveren-maliyeti-hesaplama'],
    warning: 'finans',
    keywords: ['bağkur', 'bagkur', '4b', 'esnaf primi', 'sgk prim'],
    updated: U,
  },
  {
    slug: 'emeklilik-hesaplama',
    title: 'Emeklilik Hesaplama',
    name: 'Emeklilik',
    description:
      'Emeklilik hesaplama: 4/a, 4/b, 4/c için ilk sigorta giriş tarihi, prim günü, cinsiyet ve doğum tarihine göre emeklilik yaşı, eksik prim günü ve EYT durumu.',
    lead: 'Sigorta türünüzü, ilk giriş tarihinizi, prim gününüzü ve doğum tarihinizi girin; kademeli yaş tablosuna göre ne zaman emekli olabileceğiniz hesaplansın.',
    category: 'sigorta',
    icon: UserRoundCheck,
    related: ['bagkur-prim-hesaplama', 'kidem-tazminati-hesaplama', 'yas-hesaplama', 'issizlik-maasi-hesaplama'],
    warning: 'finans',
    keywords: ['emeklilik', 'emekli', 'eyt', 'prim günü', 'emeklilik yaşı', 'ne zaman emekli olurum'],
    popular: true,
    updated: U,
  },
  // ─── Finans ───
  {
    slug: 'kredi-hesaplama',
    title: 'Kredi Hesaplama',
    name: 'Kredi',
    description:
      'Kredi hesaplama: ihtiyaç, konut ve taşıt kredisinde faiz, vade, KKDF ve BSMV dahil aylık taksit, toplam geri ödeme ve ayrıntılı ödeme planı tablosu.',
    lead: 'Kredi türünü, tutarı, aylık faiz oranını ve vadeyi girin; KKDF ve BSMV dahil taksit ve ödeme planı anında oluşsun.',
    category: 'finans',
    icon: Landmark,
    related: ['mevduat-faizi-hesaplama', 'kdv-hesaplama', 'yuzde-hesaplama', 'kira-artis-hesaplama'],
    warning: 'finans',
    keywords: ['kredi', 'ihtiyaç kredisi', 'konut kredisi', 'taşıt kredisi', 'taksit', 'ödeme planı'],
    popular: true,
    updated: U,
  },
  {
    slug: 'mevduat-faizi-hesaplama',
    title: 'Mevduat Faizi Hesaplama',
    name: 'Mevduat Faizi',
    description:
      'Mevduat faizi hesaplama: vadeli TL mevduatta faiz oranı ve gün sayısına göre brüt faiz, vadeye göre stopaj kesintisi ve net getiri.',
    lead: 'Anaparayı, yıllık faiz oranını ve vadeyi girin; vadeye göre stopaj düşülerek net faiz getiriniz hesaplansın.',
    category: 'finans',
    icon: TrendingUp,
    related: ['kredi-hesaplama', 'doviz-cevirici', 'altin-hesaplama', 'yuzde-hesaplama'],
    warning: 'finans',
    keywords: ['mevduat', 'faiz', 'vadeli hesap', 'stopaj', 'faiz getirisi'],
    popular: true,
    updated: U,
  },
  {
    slug: 'kdv-hesaplama',
    title: 'KDV Hesaplama',
    name: 'KDV',
    description:
      'KDV hesaplama: %1, %10 ve %20 oranlarıyla KDV dahil fiyattan KDV hariç tutarı veya KDV hariç fiyattan KDV dahil tutarı anında bulun.',
    lead: 'Tutarı ve KDV oranını seçin; KDV dahil veya hariç hesaplama yönüne göre KDV tutarı ve toplam anında görünsün.',
    category: 'finans',
    icon: Percent,
    related: ['indirim-hesaplama', 'yuzde-hesaplama', 'kredi-hesaplama', 'doviz-cevirici'],
    warning: 'finans',
    keywords: ['kdv', 'katma değer vergisi', 'kdv dahil', 'kdv hariç', 'fatura'],
    popular: true,
    updated: U,
  },
  {
    slug: 'doviz-cevirici',
    title: 'Döviz Çevirici',
    name: 'Döviz Çevirici',
    description:
      'Döviz çevirici: TCMB günlük kurlarıyla dolar, euro, sterlin ve diğer para birimlerini Türk lirasına veya birbirine çevirin; kur tarihi görünür.',
    lead: 'Tutarı ve para birimlerini seçin; Merkez Bankası günlük kurlarıyla çeviri anında yapılsın.',
    category: 'finans',
    icon: Coins,
    related: ['altin-hesaplama', 'mevduat-faizi-hesaplama', 'kdv-hesaplama', 'yuzde-hesaplama'],
    warning: 'finans',
    keywords: ['döviz', 'dolar', 'euro', 'kur', 'tcmb', 'çevirici', 'sterlin'],
    popular: true,
    updated: U,
  },
  {
    slug: 'altin-hesaplama',
    title: 'Altın Hesaplama',
    name: 'Altın',
    description:
      'Altın hesaplama: gram, çeyrek, yarım, tam, cumhuriyet altını ve 22/14 ayar altının değerini güncel gram fiyatı üzerinden Türk lirası olarak hesaplayın.',
    lead: 'Altın türünü ve adedini seçin; güncel ya da kendi girdiğiniz gram fiyatı üzerinden toplam değer hesaplansın.',
    category: 'finans',
    icon: Gem,
    related: ['doviz-cevirici', 'mevduat-faizi-hesaplama', 'yuzde-hesaplama', 'kredi-hesaplama'],
    warning: 'finans',
    keywords: ['altın', 'gram altın', 'çeyrek altın', 'cumhuriyet altını', '22 ayar', 'bilezik'],
    popular: true,
    updated: U,
  },
  // ─── Konut ve araç ───
  {
    slug: 'kira-artis-hesaplama',
    title: 'Kira Artış Hesaplama',
    name: 'Kira Artışı',
    description:
      'Kira artış hesaplama: konut ve işyeri kiralarında TÜİK 12 aylık TÜFE ortalamasına göre yasal azami kira artış oranı ve yeni kira tutarı.',
    lead: 'Mevcut kiranızı ve kira yenileme ayını seçin; TÜFE 12 aylık ortalamasına göre yasal azami artış ve yeni kira hesaplansın.',
    category: 'konut',
    icon: House,
    related: ['tapu-harci-hesaplama', 'emlak-vergisi-hesaplama', 'aidat-hesaplama', 'yuzde-hesaplama'],
    warning: 'finans',
    keywords: ['kira artışı', 'kira zammı', 'tüfe', 'kira artış oranı', 'enflasyon'],
    popular: true,
    updated: U,
  },
  {
    slug: 'tapu-harci-hesaplama',
    title: 'Tapu Harcı Hesaplama',
    name: 'Tapu Harcı',
    description:
      'Tapu harcı hesaplama: satış bedeline göre alıcı ve satıcı payı tapu harcı, döner sermaye ücreti ve toplam tapu masrafı.',
    lead: 'Satış bedelini girin; alıcı ve satıcıya düşen tapu harcı ile döner sermaye ücreti hesaplansın.',
    category: 'konut',
    icon: FileText,
    related: ['emlak-vergisi-hesaplama', 'kira-artis-hesaplama', 'kredi-hesaplama', 'aidat-hesaplama'],
    warning: 'finans',
    keywords: ['tapu harcı', 'tapu masrafı', 'döner sermaye', 'ev alım satım'],
    updated: U,
  },
  {
    slug: 'emlak-vergisi-hesaplama',
    title: 'Emlak Vergisi Hesaplama',
    name: 'Emlak Vergisi',
    description:
      'Emlak vergisi hesaplama: konut, işyeri, arsa ve arazi için vergi değerine göre yıllık emlak vergisi, büyükşehir oranı ve iki taksit tutarı.',
    lead: 'Taşınmaz türünü, vergi değerini ve büyükşehir durumunu seçin; yıllık emlak vergisi ve taksitleri hesaplansın.',
    category: 'konut',
    icon: Building2,
    related: ['tapu-harci-hesaplama', 'kira-artis-hesaplama', 'aidat-hesaplama', 'mtv-hesaplama'],
    warning: 'finans',
    keywords: ['emlak vergisi', 'belediye vergisi', 'arsa vergisi', 'konut vergisi'],
    updated: U,
  },
  {
    slug: 'aidat-hesaplama',
    title: 'Aidat Hesaplama',
    name: 'Aidat',
    description:
      'Aidat hesaplama: apartman ve site giderlerini eşit, arsa payına veya metrekareye göre dairelere paylaştırın; daire bazlı aidat tablosu oluşturun.',
    lead: 'Toplam gideri ve daireleri girin; giderler eşit, arsa payı veya m² oranında paylaştırılıp daire bazlı tablo oluşsun.',
    category: 'konut',
    icon: Building2,
    related: ['kira-artis-hesaplama', 'emlak-vergisi-hesaplama', 'yuzde-hesaplama', 'tapu-harci-hesaplama'],
    warning: 'yok',
    keywords: ['aidat', 'apartman gideri', 'site aidatı', 'arsa payı', 'yönetim'],
    noYear: true,
    updated: U,
  },
  {
    slug: 'mtv-hesaplama',
    title: 'MTV Hesaplama',
    name: 'MTV',
    description:
      'MTV hesaplama: araç tipi, motor hacmi, yaş ve taşıt değerine göre yıllık motorlu taşıtlar vergisi ile Ocak ve Temmuz taksit tutarları.',
    lead: 'Araç tipini, motor hacmini, model yılını ve taşıt değerini seçin; yıllık MTV ve taksitleri güncel tarifeden hesaplansın.',
    category: 'konut',
    icon: Car,
    related: ['yakit-hesaplama', 'kredi-hesaplama', 'emlak-vergisi-hesaplama', 'kdv-hesaplama'],
    warning: 'finans',
    keywords: ['mtv', 'motorlu taşıtlar vergisi', 'araç vergisi', 'trafik vergisi'],
    popular: true,
    updated: U,
  },
  {
    slug: 'yakit-hesaplama',
    title: 'Yakıt Hesaplama',
    name: 'Yakıt',
    description:
      'Yakıt hesaplama: 100 km’deki tüketim, mesafe ve yakıt fiyatıyla yol masrafını, gidiş-dönüş maliyetini ve kişi başı paylaşımı hesaplayın.',
    lead: 'Mesafeyi, aracınızın 100 km’de yaktığı litreyi ve yakıt fiyatını girin; yol masrafı ve kişi başı pay hesaplansın.',
    category: 'konut',
    icon: Fuel,
    related: ['mtv-hesaplama', 'yuzde-hesaplama', 'kredi-hesaplama', 'indirim-hesaplama'],
    warning: 'yok',
    keywords: ['yakıt', 'benzin', 'mazot', 'yol masrafı', 'yakıt tüketimi'],
    noYear: true,
    updated: U,
  },
  // ─── Eğitim ve sınav ───
  {
    slug: 'yks-puan-hesaplama',
    title: 'YKS Puan Hesaplama',
    name: 'YKS Puan',
    description:
      'YKS puan hesaplama: TYT ve AYT netlerinizle SAY, EA, SÖZ ve DİL puanlarınızı OBP eklenmiş ve eklenmemiş olarak tahmini katsayılarla hesaplayın.',
    lead: 'TYT ve AYT doğru-yanlış sayılarınızı ve diploma notunuzu girin; ham ve yerleştirme puanlarınız tahmini olarak hesaplansın.',
    category: 'egitim',
    icon: GraduationCap,
    related: [
      'lgs-puan-hesaplama',
      'universite-not-ortalamasi-hesaplama',
      'lise-not-ortalamasi-hesaplama',
      'kpss-puan-hesaplama',
    ],
    warning: 'sinav',
    keywords: ['yks', 'tyt', 'ayt', 'üniversite sınavı', 'obp', 'puan hesaplama'],
    popular: true,
    updated: U,
  },
  {
    slug: 'lgs-puan-hesaplama',
    title: 'LGS Puan Hesaplama',
    name: 'LGS Puan',
    description:
      'LGS puan hesaplama: Türkçe, matematik, fen, inkılap, din ve yabancı dil doğru-yanlış sayılarınızla net ve tahmini LGS puanınızı hesaplayın.',
    lead: 'Her dersin doğru ve yanlış sayısını girin; 3 yanlış 1 doğruyu götürür kuralıyla netler ve tahmini LGS puanı hesaplansın.',
    category: 'egitim',
    icon: School,
    related: ['yks-puan-hesaplama', 'lise-not-ortalamasi-hesaplama', 'kpss-puan-hesaplama', 'yuzde-hesaplama'],
    warning: 'sinav',
    keywords: ['lgs', 'liseye geçiş', '8. sınıf', 'lgs puanı', 'meb'],
    popular: true,
    updated: U,
  },
  {
    slug: 'kpss-puan-hesaplama',
    title: 'KPSS Puan Hesaplama',
    name: 'KPSS Puan',
    description:
      'KPSS puan hesaplama: Genel Yetenek ve Genel Kültür netlerinizle lisans (P3), önlisans (P93) ve ortaöğretim (P94) puanınızı tahmini olarak hesaplayın.',
    lead: 'KPSS türünü seçip GY ve GK doğru-yanlış sayılarınızı girin; P3, P93 veya P94 puanınız tahmini olarak hesaplansın.',
    category: 'egitim',
    icon: Briefcase,
    related: ['ales-puan-hesaplama', 'yds-puan-hesaplama', 'yks-puan-hesaplama', 'universite-not-ortalamasi-hesaplama'],
    warning: 'sinav',
    keywords: ['kpss', 'p3', 'p93', 'p94', 'memurluk sınavı', 'genel yetenek'],
    popular: true,
    updated: U,
  },
  {
    slug: 'ales-puan-hesaplama',
    title: 'ALES Puan Hesaplama',
    name: 'ALES Puan',
    description:
      'ALES puan hesaplama: sayısal ve sözel doğru-yanlış sayılarınızla ALES sayısal, sözel ve eşit ağırlık puanınızı tahmini katsayılarla hesaplayın.',
    lead: 'Sayısal ve sözel testlerdeki doğru-yanlış sayılarınızı girin; üç puan türü tahmini olarak hesaplansın.',
    category: 'egitim',
    icon: Award,
    related: ['yds-puan-hesaplama', 'kpss-puan-hesaplama', 'universite-not-ortalamasi-hesaplama', 'yks-puan-hesaplama'],
    warning: 'sinav',
    keywords: ['ales', 'yüksek lisans', 'akademik personel', 'ales puanı'],
    updated: U,
  },
  {
    slug: 'yds-puan-hesaplama',
    title: 'YDS Puan Hesaplama',
    name: 'YDS Puan',
    description:
      'YDS puan hesaplama: 80 soruluk yabancı dil sınavında doğru sayınızdan YDS puanınızı ve A-E dil seviyenizi anında öğrenin.',
    lead: 'Doğru cevap sayınızı girin; YDS puanınız ve karşılık gelen dil seviyeniz hesaplansın.',
    category: 'egitim',
    icon: Languages,
    related: ['ales-puan-hesaplama', 'kpss-puan-hesaplama', 'yks-puan-hesaplama', 'yuzde-hesaplama'],
    warning: 'sinav',
    keywords: ['yds', 'yökdil', 'yabancı dil sınavı', 'ingilizce', 'dil puanı'],
    updated: U,
  },
  {
    slug: 'lise-not-ortalamasi-hesaplama',
    title: 'Lise Not Ortalaması Hesaplama',
    name: 'Lise Not Ortalaması',
    description:
      'Lise not ortalaması hesaplama: ders notları ve haftalık ders saatleriyle ağırlıklı yıl sonu başarı puanı, takdir ve teşekkür belgesi durumu.',
    lead: 'Derslerinizi, notlarınızı ve haftalık ders saatlerini girin; ağırlıklı ortalamanız ve belge durumunuz hesaplansın.',
    category: 'egitim',
    icon: BookOpen,
    related: ['universite-not-ortalamasi-hesaplama', 'lgs-puan-hesaplama', 'yks-puan-hesaplama', 'yuzde-hesaplama'],
    warning: 'sinav',
    keywords: ['lise ortalama', 'takdir', 'teşekkür', 'karne', 'yıl sonu puanı'],
    noYear: true,
    updated: U,
  },
  {
    slug: 'universite-not-ortalamasi-hesaplama',
    title: 'Üniversite Not Ortalaması Hesaplama',
    name: 'Üniversite Not Ortalaması',
    description:
      'Üniversite not ortalaması hesaplama: AKTS veya kredi ağırlıklı dönem ortalaması ve GANO, 4’lük sistemden 100’lük sisteme YÖK dönüşümü.',
    lead: 'Derslerinizi, harf notlarınızı ve AKTS/kredilerini girin; ağırlıklı ortalamanız ve 100’lük karşılığı hesaplansın.',
    category: 'egitim',
    icon: GraduationCap,
    related: ['lise-not-ortalamasi-hesaplama', 'ales-puan-hesaplama', 'yks-puan-hesaplama', 'kpss-puan-hesaplama'],
    warning: 'sinav',
    keywords: ['gano', 'ortalama', 'akts', 'not ortalaması', 'dönüşüm', '4lük 100lük'],
    noYear: true,
    updated: U,
  },
  // ─── Sağlık ───
  {
    slug: 'gebelik-haftasi-hesaplama',
    title: 'Gebelik Haftası Hesaplama',
    name: 'Gebelik Haftası',
    description:
      'Gebelik haftası hesaplama: son adet tarihinizden kaç haftalık hamile olduğunuzu, trimesteri ve tahmini doğum tarihinizi (Naegele kuralı) öğrenin.',
    lead: 'Son adet döneminizin ilk gününü girin; gebelik haftanız, trimesteriniz ve tahmini doğum tarihiniz hesaplansın.',
    category: 'saglik',
    icon: Baby,
    related: ['vucut-kitle-indeksi-hesaplama', 'kalori-ihtiyaci-hesaplama', 'su-ihtiyaci-hesaplama', 'tarih-hesaplama'],
    warning: 'saglik',
    keywords: ['gebelik', 'hamilelik', 'doğum tarihi', 'kaç haftalık', 'son adet'],
    noYear: true,
    popular: true,
    updated: U,
  },
  {
    slug: 'vucut-kitle-indeksi-hesaplama',
    title: 'Vücut Kitle İndeksi Hesaplama',
    name: 'Vücut Kitle İndeksi',
    description:
      'Vücut kitle indeksi (VKİ/BMI) hesaplama: boy ve kilonuzla VKİ değerinizi, DSÖ sınıflandırmasını ve boyunuza göre sağlıklı kilo aralığını öğrenin.',
    lead: 'Boyunuzu ve kilonuzu girin; VKİ değeriniz ve Dünya Sağlık Örgütü sınıflandırmasındaki yeriniz hesaplansın.',
    category: 'saglik',
    icon: Weight,
    related: ['kalori-ihtiyaci-hesaplama', 'su-ihtiyaci-hesaplama', 'gebelik-haftasi-hesaplama', 'yas-hesaplama'],
    warning: 'saglik',
    keywords: ['vki', 'bmi', 'kilo', 'ideal kilo', 'obezite', 'beden kitle'],
    noYear: true,
    popular: true,
    updated: U,
  },
  {
    slug: 'kalori-ihtiyaci-hesaplama',
    title: 'Kalori İhtiyacı Hesaplama',
    name: 'Kalori İhtiyacı',
    description:
      'Günlük kalori ihtiyacı hesaplama: Mifflin-St Jeor formülüyle bazal metabolizma hızınızı ve aktivite seviyenize göre günlük enerji ihtiyacınızı bulun.',
    lead: 'Yaş, cinsiyet, boy, kilo ve aktivite düzeyinizi girin; bazal metabolizma ve günlük kalori ihtiyacınız hesaplansın.',
    category: 'saglik',
    icon: Apple,
    related: ['vucut-kitle-indeksi-hesaplama', 'su-ihtiyaci-hesaplama', 'gebelik-haftasi-hesaplama', 'yas-hesaplama'],
    warning: 'saglik',
    keywords: ['kalori', 'bmr', 'bazal metabolizma', 'diyet', 'günlük kalori'],
    noYear: true,
    updated: U,
  },
  {
    slug: 'su-ihtiyaci-hesaplama',
    title: 'Su İhtiyacı Hesaplama',
    name: 'Su İhtiyacı',
    description:
      'Günlük su ihtiyacı hesaplama: kilonuza ve fiziksel aktivitenize göre günde kaç litre ve kaç bardak su içmeniz gerektiğini öğrenin.',
    lead: 'Kilonuzu ve günlük egzersiz sürenizi girin; günlük önerilen su miktarı litre ve bardak olarak hesaplansın.',
    category: 'saglik',
    icon: Droplets,
    related: ['kalori-ihtiyaci-hesaplama', 'vucut-kitle-indeksi-hesaplama', 'gebelik-haftasi-hesaplama', 'yas-hesaplama'],
    warning: 'saglik',
    keywords: ['su ihtiyacı', 'günlük su', 'kaç litre su', 'hidrasyon'],
    noYear: true,
    updated: U,
  },
  // ─── Tarih ve günlük ───
  {
    slug: 'yas-hesaplama',
    title: 'Yaş Hesaplama',
    name: 'Yaş',
    description:
      'Yaş hesaplama: doğum tarihinizden yıl, ay ve gün olarak tam yaşınızı, yaşadığınız toplam günü ve bir sonraki doğum gününüze kalan süreyi öğrenin.',
    lead: 'Doğum tarihinizi girin; tam yaşınız ve bir sonraki doğum gününüze kalan süre anında hesaplansın.',
    category: 'gunluk',
    icon: CalendarClock,
    related: ['tarih-hesaplama', 'emeklilik-hesaplama', 'gebelik-haftasi-hesaplama', 'yuzde-hesaplama'],
    warning: 'yok',
    keywords: ['yaş', 'kaç yaşındayım', 'doğum günü', 'yaş hesapla'],
    noYear: true,
    updated: U,
  },
  {
    slug: 'tarih-hesaplama',
    title: 'Tarih Hesaplama',
    name: 'Tarih',
    description:
      'Tarih hesaplama: iki tarih arasındaki gün, hafta ve ay farkını, iş günü sayısını bulun; bir tarihe gün ekleyin veya çıkarın (resmi tatiller dahil).',
    lead: 'İki tarih arasındaki farkı bulun veya bir tarihe gün ekleyip çıkarın; isterseniz yalnızca iş günlerini sayın.',
    category: 'gunluk',
    icon: CalendarRange,
    related: ['yas-hesaplama', 'yillik-izin-hesaplama', 'gebelik-haftasi-hesaplama', 'yuzde-hesaplama'],
    warning: 'yok',
    keywords: ['tarih', 'gün hesaplama', 'iki tarih arası', 'iş günü', 'gün ekle'],
    noYear: true,
    updated: U,
  },
  {
    slug: 'yuzde-hesaplama',
    title: 'Yüzde Hesaplama',
    name: 'Yüzde',
    description:
      'Yüzde hesaplama: bir sayının yüzdesini, iki sayı arasındaki yüzde değişimi ve bir sayının diğerinin yüzde kaçı olduğunu adım adım hesaplayın.',
    lead: 'X’in %Y’si, yüzde artış/azalış ve oran hesaplamalarını tek sayfada yapın.',
    category: 'gunluk',
    icon: BadgePercent,
    related: ['indirim-hesaplama', 'kdv-hesaplama', 'kira-artis-hesaplama', 'kredi-hesaplama'],
    warning: 'yok',
    keywords: ['yüzde', 'yüzde hesapla', 'yüzde artış', 'oran', 'yüzde kaç'],
    noYear: true,
    popular: true,
    updated: U,
  },
  {
    slug: 'indirim-hesaplama',
    title: 'İndirim Hesaplama',
    name: 'İndirim',
    description:
      'İndirim hesaplama: etiket fiyatı ve indirim oranıyla indirimli fiyatı, iki fiyattan indirim oranını ve ardışık indirimlerin gerçek toplam oranını bulun.',
    lead: 'İndirimli fiyatı, indirim oranını veya ardışık indirimlerin toplam etkisini hesaplayın.',
    category: 'gunluk',
    icon: Tag,
    related: ['yuzde-hesaplama', 'kdv-hesaplama', 'kredi-hesaplama', 'doviz-cevirici'],
    warning: 'yok',
    keywords: ['indirim', 'indirimli fiyat', 'kampanya', 'yüzde indirim', 'iskonto'],
    noYear: true,
    updated: U,
  },
];

export const toolBySlug = new Map(tools.map((t) => [t.slug, t]));
export const categoryById = new Map(categories.map((c) => [c.id, c]));

export function getTool(slug: string): Tool {
  const t = toolBySlug.get(slug);
  if (!t) throw new Error(`Araç bulunamadı: ${slug}`);
  return t;
}

export function toolsIn(category: CategorySlug) {
  return tools.filter((t) => t.category === category);
}

export const popularTools = tools.filter((t) => t.popular);
