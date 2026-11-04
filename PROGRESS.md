# NetGöster — İlerleme

Oturum kesilirse: önce bu dosyayı, sonra `docs/arac-ekleme.md`'yi okuyun.

## Altyapı

- [x] İskelet: Vite + React 19 + TS, React Router, özel SSG (scripts/prerender.ts), Tailwind v4 + shadcn (Radix), pnpm
- [x] Tema token'ları (BluConnect görsel dili), açık/koyu + sistem, Inter self-host
- [x] Layout: header (Ctrl/Cmd+K arama, mobil Sheet), footer, breadcrumb, CalculatorLayout, alanlar, sonuç kartı
- [x] Registry (37 araç, 7 kategori), sitemap, robots, ads.txt, manifest, favicon, OG görselleri
- [x] Worker: www→apex, güvenlik/cache başlıkları, /api/kurlar (TCMB), /api/altin
- [x] Parametreler: çalışma/SGK/vergi (parameters-2026.ts), sınavlar (sinavlar.ts), emeklilik (emeklilik.ts)
- [x] Parametreler: finans/konut/araç (KKDF/BSMV, stopaj, tapu, emlak, MTV), TÜFE (tufe.ts); tatiller → günlük ajanı
- [x] Yasal sayfalar, kategori sayfaları, CMP/Consent Mode, reklam yerleşimi (6 slot türü)
- [x] Son doğrulama: build (tsc dahil), 264 test, lint, wrangler dry-run, README, 37 sayfa SEO denetimi, Lighthouse mobil

## Araçlar


### Çalışma ve maaş

- [x] /kidem-tazminati-hesaplama — Kıdem Tazminatı Hesaplama
- [x] /ihbar-tazminati-hesaplama — İhbar Tazminatı Hesaplama
- [x] /brutten-nete-maas-hesaplama — Brütten Nete Maaş Hesaplama
- [x] /netten-brute-maas-hesaplama — Netten Brüte Maaş Hesaplama
- [x] /asgari-ucret-hesaplama — Asgari Ücret Hesaplama
- [x] /isveren-maliyeti-hesaplama — İşveren Maliyeti Hesaplama
- [x] /issizlik-maasi-hesaplama — İşsizlik Maaşı Hesaplama
- [x] /yillik-izin-hesaplama — Yıllık İzin Hesaplama
- [x] /fazla-mesai-hesaplama — Fazla Mesai Hesaplama

### Sigorta ve emeklilik

- [x] /bagkur-prim-hesaplama — Bağkur Prim Hesaplama
- [x] /emeklilik-hesaplama — Emeklilik Hesaplama

### Finans

- [x] /kredi-hesaplama — Kredi Hesaplama
- [x] /mevduat-faizi-hesaplama — Mevduat Faizi Hesaplama
- [x] /kdv-hesaplama — KDV Hesaplama
- [x] /doviz-cevirici — Döviz Çevirici
- [x] /altin-hesaplama — Altın Hesaplama

### Konut ve araç

- [x] /kira-artis-hesaplama — Kira Artış Hesaplama
- [x] /tapu-harci-hesaplama — Tapu Harcı Hesaplama
- [x] /emlak-vergisi-hesaplama — Emlak Vergisi Hesaplama
- [x] /aidat-hesaplama — Aidat Hesaplama
- [x] /mtv-hesaplama — MTV Hesaplama
- [x] /yakit-hesaplama — Yakıt Hesaplama

### Eğitim ve sınav

- [x] /yks-puan-hesaplama — YKS Puan Hesaplama
- [x] /lgs-puan-hesaplama — LGS Puan Hesaplama
- [x] /kpss-puan-hesaplama — KPSS Puan Hesaplama
- [x] /ales-puan-hesaplama — ALES Puan Hesaplama
- [x] /yds-puan-hesaplama — YDS Puan Hesaplama
- [x] /lise-not-ortalamasi-hesaplama — Lise Not Ortalaması Hesaplama
- [x] /universite-not-ortalamasi-hesaplama — Üniversite Not Ortalaması Hesaplama

### Sağlık

- [x] /gebelik-haftasi-hesaplama — Gebelik Haftası Hesaplama
- [x] /vucut-kitle-indeksi-hesaplama — Vücut Kitle İndeksi Hesaplama
- [x] /kalori-ihtiyaci-hesaplama — Kalori İhtiyacı Hesaplama
- [x] /su-ihtiyaci-hesaplama — Su İhtiyacı Hesaplama

### Tarih ve günlük

- [x] /yas-hesaplama — Yaş Hesaplama
- [x] /tarih-hesaplama — Tarih Hesaplama
- [x] /yuzde-hesaplama — Yüzde Hesaplama
- [x] /indirim-hesaplama — İndirim Hesaplama

## Son yapılan iş

37/37 araç tamamlandı; her aracın hesaplaması ana oturumda bağımsız olarak doğrulandı (bordro motoru referans hesapla
8 maaş × 12 ay birebir). SSG'de Suspense dışa alma (progressiveChunkSize) kapatıldı → içerik HTML'de yerinde, CLS 0.
Türkçe alt kümeli tek font (42 KB). `.env` reklam/doğrulama sistemi, `?reklam-onizleme`, Organization/ItemList JSON-LD,
kategori giriş metinleri, llms.txt eklendi.

## Sıradaki adım

Kullanıcı tarafı: .env doldurma, Cloudflare'e alan adı bağlama, AdSense/Search Console başvurusu (README).
Bakım: README > Parametre güncelleme takvimi; TODO: DOĞRULA listesi (grep -rn "TODO: DOĞRULA" src).
