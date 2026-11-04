# NetGöster — netgoster.com

Türkiye odaklı, SEO ve AdSense gelirine göre tasarlanmış **37 hesaplama aracı**: maaş, tazminat, SGK, kredi, vergi,
döviz/altın, konut/araç, sınav puanı, sağlık ve günlük hesaplamalar.

- **Yığın:** Vite 8 + React 19 + TypeScript, React Router, özel statik ön-render (SSG), Tailwind CSS v4 + shadcn/ui (Radix),
  react-hook-form + zod, Vitest, Cloudflare Workers + Static Assets. Paket yöneticisi **pnpm**.
- **Her sayfa derleme anında tam HTML** olarak üretilir (içerik, title, meta, canonical, OG, JSON-LD). İstemci yalnızca
  hydrate eder; hesaplamalar tarayıcıda çalışır.
- **Dinamik veri:** tüm oran/tutarlar tarih aralıklı zaman serisidir ve hesaplama tarihine göre doğru dönem otomatik seçilir;
  içerik metinlerindeki rakamlar da parametrelerden üretilir; döviz ve altın Worker'dan canlı gelir.

```bash
pnpm install
pnpm dev          # http://localhost:5173 (Vite, canlı yenileme)
pnpm test         # Vitest — tüm hesaplama testleri
pnpm lint         # ESLint + Prettier kontrolü
pnpm build        # tip kontrolü → istemci + SSR derlemesi → ön-render (dist/)
pnpm preview      # wrangler dev: Worker + dist (http://localhost:8787, /api/kurlar dahil)
pnpm deploy       # build + wrangler deploy
```

## Klasör yapısı

| Yol | İçerik |
| --- | --- |
| `.env` (şablon: `.env.example`) | **AdSense yayıncı kimliği, 6 reklam slotu, Search Console/Bing doğrulama kodu** |
| `src/config/site.ts` | Site adı, alan adı, e-posta; `.env` değerlerini okur |
| `src/config/parameters-2026.ts` | Tüm yasal/mali parametreler (tarih aralıklı seriler + kaynak + geçerlilik) |
| `src/config/period.ts` | `valueAt(seri, tarih)` / `periodAt` — dönem seçimi |
| `src/config/tufe.ts` | Aylık TÜFE verisi (kira artışı) |
| `src/config/sinavlar.ts` | Sınav soru sayıları, ağırlıklar, tahmini katsayılar |
| `src/config/emeklilik.ts` | Emeklilik geçiş hükümleri tabloları |
| `src/config/tatiller.ts` | Resmi tatiller (iş günü hesabı) |
| `src/tools.registry.ts` | 37 aracın kaydı → ana sayfa, kategori, arama, sitemap, iç linkler, OG |
| `src/calculators/*.ts` | Saf hesaplama fonksiyonları + zod şemaları + `*.test.ts` |
| `src/tools/<slug>/` | Araç sayfası (`index.tsx`), içerik (`content.md`), içerik değişkenleri (`vars.ts`) |
| `src/components/calc/` | `CalculatorLayout`, form alanları, sonuç kartı |
| `src/content/vars.ts` | İçerikteki `{{anahtar}}` yer tutucuları (güncel parametrelerden) |
| `src/worker/` | Cloudflare Worker: yönlendirme, başlıklar, `/api/kurlar`, `/api/altin` |
| `scripts/prerender.ts` | SSG + sitemap/robots/ads.txt/manifest/favicon/OG görselleri |

## Parametre güncelleme takvimi

Parametreler **eklenir, üzerine yazılmaz**: her değişiklikte ilgili seriye yeni bir `{ from, to, value, source }` kaydı ekleyin.
Eski dönemler geçmiş tarihli hesaplamalar için kalır. Resmi kaynak bağlantısını `source` alanına yazın; resmi metinde birebir
görmediğiniz değeri `verified: false` + `// TODO: DOĞRULA` ile işaretleyin.

| Ne zaman | Ne | Dosya / seri | Kaynak |
| --- | --- | --- | --- |
| **Aralık sonu / Ocak** | Asgari ücret | `asgariUcret` | Resmî Gazete (Asgari Ücret Tespit Komisyonu) |
| Aralık sonu | Gelir vergisi dilimleri | `gelirVergisiUcret`, `gelirVergisiUcretDisi` | GV Genel Tebliği (RG) |
| Ocak | SGK PEK alt/üst sınırı, prim oranları, hazine indirimi | `sgkTabanTavan`, `sgkOranlari` | SGK genelgeleri |
| Ocak | Bağkur oranı | `bagkur` | 5510 md. 81, SGK genelgesi |
| Ocak | Asgari ücret desteği | `asgariUcretDestegi` | SGK genelgesi |
| **Ocak ve Temmuz** | Kıdem tazminatı tavanı | `kidemTavani` | HMB Mali ve Sosyal Haklar Genelgesi |
| Temmuz (varsa) | Asgari ücret ara zammı | `asgariUcret` | Resmî Gazete |
| **Her ay (3'ü civarı)** | TÜFE | `src/config/tufe.ts` | TÜİK Tüketici Fiyat Endeksi bülteni |
| Değiştikçe | KKDF/BSMV, mevduat stopajı, KDV | ilgili seriler | Resmî Gazete (Cumhurbaşkanı Kararı) |
| Aralık sonu / Ocak | MTV tarifesi | `mtvTarife` | GİB MTV genel tebliği |
| Ocak | Tapu döner sermaye ücreti, emlak vergisi | ilgili seriler | Tapu Kadastro / 1319 s. K. |
| **Her yıl sonuçlardan sonra** | YKS, LGS, KPSS, ALES katsayıları | `src/config/sinavlar.ts` | ÖSYM/MEB sayısal bilgiler |
| Her yıl | Resmi tatiller (dini bayramlar) | `src/config/tatiller.ts` | Diyanet / Resmî Gazete |

Güncelledikten sonra: `pnpm test` (beklenen değerleri değişen testleri güncelleyin) → `pnpm build` → deploy.
GitHub Actions iş akışı (`.github/workflows/site-deploy.yml`, BluConnect ile aynı düzen) her gün yeniden derleyip yayınlar; böylece 1 Ocak / 1 Temmuz
gibi dönem geçişleri, kod değişikliği olmadan ön-render metinlere de yansır.

## Yeni araç ekleme

Ayrıntılı rehber: [`docs/arac-ekleme.md`](docs/arac-ekleme.md). Kısaca:

1. `src/tools.registry.ts` → `tools` dizisine kayıt (slug, başlık, açıklama ~155 karakter, kategori, ikon, ilgili araçlar, uyarı türü).
2. `src/calculators/<ad>.ts` → zod şeması + saf fonksiyon (göreli `.ts` importlar); `<ad>.test.ts` → ≥5 senaryo.
3. `src/tools/<slug>/index.tsx` → `CalculatorLayout` + alanlar + `compute` (sonucu `ResultView`'a çevirir).
4. `src/tools/<slug>/content.md` → 700–1200 kelime, `{{değişken}}`ler, `<!-- sss -->` sonrası ≥6 soru.
5. `pnpm build` — rota, sitemap, OG görseli, arama ve kategori listesi otomatik oluşur.

## Tema özelleştirme

Renkler `src/styles.css` içinde CSS değişkenleridir (`:root` açık, `.dark` koyu): `--primary` (eylem, derin mavi),
`--result` (sonuç vurgusu, zümrüt), `--background`, `--card`, `--border`, `--radius` (0,75rem). Tailwind sınıfları
(`bg-primary`, `text-result`…) bu değişkenlere bağlıdır. Font: Inter Variable (self-host, `font-display: swap`).
Tema; sistem tercihine göre otomatik, header/footer'dan elle değiştirilebilir (`src/lib/theme.ts`). Logo:
`src/components/layout/Logo.tsx` ve favicon/OG için `scripts/og.ts` (aynı geometri).

## Cloudflare'e deploy ve netgoster.com'u bağlama

1. Cloudflare hesabında **netgoster.com** alanını ekleyin (Websites → Add a site) ve alan adı kayıt firmanızda ad sunucularını
   Cloudflare'in verdiği NS kayıtlarıyla değiştirin. Alan "Active" olana kadar bekleyin.
2. Yerelde oturum açın: `pnpm exec wrangler login`.
3. `pnpm deploy`. `wrangler.jsonc` içindeki `routes` (custom_domain) **netgoster.com** ve **www.netgoster.com** için DNS
   kaydını ve SSL sertifikasını otomatik oluşturur. www istekleri Worker'da kök alana 301 ile yönlendirilir.
4. Deneme: `pnpm exec wrangler deploy --dry-run` (yüklemeden paketler). Önizleme: `*.workers.dev` adresi.
5. Otomatik yayın için GitHub deposunda **Settings → Secrets** altına `CLOUDFLARE_API_TOKEN` ("Edit Cloudflare Workers"
   şablonu) ve `CLOUDFLARE_ACCOUNT_ID` ekleyin.

Önbellek: hash'li `/assets/*` 1 yıl `immutable`, HTML `max-age=0, s-maxage=600`, `/api/kurlar` 1 saat (Cache API),
`/api/altin` 15 dk. Kaynak alınamazsa son başarılı veri `stale: true` ile döner.

## Canlı veri

- **Döviz:** `/api/kurlar` — TCMB `today.xml` (kamuya açık günlük gösterge kurlar), JSON'a çevrilir. Hafta sonu ve tatilde
  TCMB son iş gününün bültenini yayımlar; sayfada kur tarihi gösterilir.
- **Altın:** `/api/altin` — gold-api.com ons altın (USD) × TCMB USD satış kuru ÷ 31,1035 = 24 ayar gram (has) değer.
  Kuyumcu fiyatları işçilik ve makas içerdiği için farklıdır; araç kullanıcının kendi gram fiyatını girmesine de izin verir.
  Kaynak alınamazsa son başarılı değer (tarihiyle) veya elle giriş kullanılır.

## AdSense ve Search Console kurulumu (.env)

Tüm kimlikler **`.env`** dosyasından derleme anında okunur — kod değiştirmeniz gerekmez:

```bash
cp .env.example .env   # sonra değerleri doldurun ve pnpm deploy
```

GitHub Actions ile yayınlıyorsanız aynı adları repo **Settings → Secrets and variables → Actions → Variables** altına
ekleyin (`site-deploy.yml` bunları derlemeye aktarır).

1. **Search Console:** https://search.google.com/search-console → URL ön eki `https://netgoster.com` → "HTML etiketi"
   yöntemi → `content="..."` değerini `VITE_GSC_VERIFICATION`'a yazın, deploy edin, "Doğrula"ya basın. Ardından
   `https://netgoster.com/sitemap.xml` adresini gönderin. (Alternatif: Cloudflare DNS'e TXT kaydı.) Bing için `VITE_BING_VERIFICATION`.
2. **AdSense:** Siteyi ekleyin; yayıncı kimliğini (`ca-pub-…`) `VITE_ADSENSE_CLIENT`'a yazın. Bu değer doluyken `ads.txt`
   otomatik üretilir, `google-adsense-account` meta etiketi, Consent Mode varsayılanı ve çerez banner'ı devreye girer.
   Onay sonrası AdSense → Reklamlar → **Reklam birimine göre** → "Görüntülü reklam" (duyarlı) ile **6 birim** oluşturup
   kimliklerini `VITE_AD_SLOT_RESULT`, `…_CONTENT`, `…_CONTENT2`, `…_SIDEBAR` (dikey birim seçin), `…_FOOTER`, `…_LIST`
   değişkenlerine yazın. Boş bırakılan slot çizilmez.
3. **Gizlilik ve mesajlaşma (CMP):** AB/AEA, Birleşik Krallık ve İsviçre trafiği için Google sertifikalı bir CMP zorunludur.
   AdSense → Gizlilik ve mesajlaşma → **Avrupa düzenlemeleri** mesajını oluşturup yayınlayın; bu mesaj AdSense betiğiyle
   otomatik yüklenir. Türkiye ziyaretçileri için sitenin kendi banner'ı (KVKK) Consent Mode v2 sinyallerini gönderir:
   reklam betiği **ancak seçim yapıldıktan sonra** yüklenir; "Yalnızca zorunlu" seçilirse sinyaller `denied` kalır
   (sınırlı/kişiselleştirilmemiş reklam).
4. AdSense ID boşken hiçbir reklam kodu yüklenmez; geliştirmede (`pnpm dev`) gri yer tutucular görünür.

### Reklam yerleşimi (gösterimi artır, kullanıcıyı boğma)

**Yerleri görmek için** herhangi bir sayfanın adresine `?reklam-onizleme` ekleyin (ör. `https://netgoster.com/kredi-hesaplama?reklam-onizleme`):
her reklam alanı, slot adı ve `.env` değişkeniyle turuncu kesikli kutu olarak görünür. Ekran görüntüleri: `docs/reklam-yerlesimi/`.
Geliştirmede (`pnpm dev`) kutular her zaman görünür.

| Sayfa | Birimler (`site.adSlots`) |
| --- | --- |
| Araç sayfası | `result` sonucun/ödeme tablosunun altı · `content` içerik arası · `content2` uzun içerikte (7+ bölüm) ikinci içerik arası · `sidebar` masaüstünde içindekilerin altında yapışkan 300×600 · `footer` SSS'den sonra, ilgili araçlardan önce |
| Ana sayfa | `list` kategoriler ile popüler araçlar arası + popüler araçlardan sonra |
| Kategori | `list` araç listesinin altı |

Kurallar: formun üstünde ve form ile sonuç arasında reklam **yok**; her birim sabit yükseklikli (CLS 0), "Reklam" etiketli,
kart görünümünde ve ekrana yaklaşınca yüklenir; kenar çubuğu reklamı mobilde hiç çizilmez (gizli reklam değil).
Önerilen AdSense **Otomatik reklam** ayarları: *Sabit (anchor) reklamlar: AÇIK* (mobilde alt şerit, kapatılabilir),
*Vignette (tam ekran geçiş): KAPALI* (kullanıcıyı rahatsız eder), *Sayfa içi otomatik reklamlar: KAPALI veya "az"*
(manuel birimler zaten yerleştirildi), *Arama/çoklu yerleşim: isteğe bağlı*. Yasal sayfalarda ve 404'te reklam yoktur.
