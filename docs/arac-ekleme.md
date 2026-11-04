# Yeni araç ekleme rehberi (şablon: kıdem tazminatı)

Referans uygulama: `src/tools/kidem-tazminati-hesaplama/` + `src/calculators/kidem.ts` + `src/calculators/kidem.test.ts`.
Her araç aynı kaliteyi izler. Aşağıdaki dosyalar dışında paylaşılan dosyalara dokunmayın.

## 1. Kayıt
Araç `src/tools.registry.ts` içinde zaten tanımlı (slug, başlık, açıklama, kategori, ikon, ilgili araçlar, uyarı türü).
Rota, ana sayfa, kategori, arama, sitemap ve OG görseli buradan otomatik üretilir.

## 2. Hesaplama fonksiyonu — `src/calculators/<ad>.ts`
- Saf TypeScript, UI yok. **Yalnız göreli ve `.ts` uzantılı import** (`'../config/parameters-2026.ts'`, `'./common.ts'`) —
  dosya Node ile doğrudan da yüklenir (içerik örnekleri). `@/` takma adı KULLANMAYIN.
- Zod şeması (`<ad>Schema`) aynı dosyada; form doğrulaması ve fonksiyon bunu paylaşır. Ortak yardımcılar: `zMoney`, `zNumber`,
  `zDate`, `dayNumber`, `addDays`, `ymdDiff`, `round2` (`src/calculators/common.ts`). Türkçe, anlaşılır hata mesajları.
- Parametreler: `src/config/parameters-2026.ts` serilerinden `valueAt(seri, tarih)` / `periodAt` ile **işlem tarihine göre**
  okunur. Rakam gömmeyin. Sınavlar: `src/config/sinavlar.ts`; emeklilik: `src/config/emeklilik.ts`.
- Para tutarlarını `round2` ile kuruşa yuvarlayın.

## 3. Testler — `src/calculators/<ad>.test.ts`
Vitest, **elle doğrulanmış en az 5 senaryo** (sınır durumları dahil). Beklenen değeri yorumda kısaca hesaplayın.
`pnpm vitest run src/calculators/<ad>.test.ts`

## 4. Sayfa — `src/tools/<slug>/index.tsx`
`CalculatorLayout` kullanın (başlık, breadcrumb, form/sonuç düzeni, canlı hesap, URL paylaşımı, örnek/sıfırla, reklam slotları,
içerik, SSS, JSON-LD, ilgili araçlar hepsi hazır). Sağlayacaklarınız:
- `defaults` (akıllı varsayılanlar; ör. bugünün tarihi), `example` (tüm alanlar dolu), `compute` → `ResultView`
  (`main` büyük rakam, `rows` döküm, `status` ok/warn/info, `table` uzun tablo, `notes`, `extra`).
- Alanlar `@/components/calc/fields`: `NumberField` (unit: ₺ / % / gün…, decimals), `DateField`, `SelectField`, `ChoiceField`
  (2–4 seçenekli segment), `SwitchField`. Her alana `help` (tooltip metni: "X nedir?") ve gerekiyorsa `hint`.
  Tam genişlik için `className="sm:col-span-2"`. Liste girişleri için RHF `useFieldArray` + aynı alanlar (`name="dersler.0.not"`).
- Biçimlendirme `@/lib/format`: `tl` (1.234,56 ₺), `tl0`, `num`, `pct`, `pctValue`, `dateTR`, `dateLong`.
- Sağlık araçlarında `sources` (DSÖ vb. bilimsel kaynak bağlantıları) zorunlu.
- Canlı veri gereken araçlar (döviz/altın) `formTop` ile veri durumunu (tarih, yükleniyor, hata, elle giriş) gösterir.

## 5. İçerik — `src/tools/<slug>/content.md`
- 700–1200 kelime, gerçekten faydalı: nasıl hesaplanır, formül, 2–3 sayısal örnek, sık hatalar, yasal/bilimsel dayanak.
  Dolgu yok. `##` ara başlıklar (içindekiler buradan), `###` alt başlık, tablolar serbest. H1 YAZMAYIN (sayfada var).
- **Rakamları elle yazmayın:** `{{anahtar}}` yer tutucuları. Genel anahtarlar `src/content/vars.ts` (ör. `{{asgari.brut}}`,
  `{{yil}}`, `{{sgk.tavan}}`, `{{kidem.tavan}}`, `{{gv.dilim1}}`…). Araca özel/örnek hesaplar için aynı klasörde `vars.ts`
  (`export default function vars(today: string): Record<string,string>`; `exampleVars(önek, sonuç)` yardımcısı) — yalnız
  göreli `.ts` importlar. Bilinmeyen anahtar derlemeyi durdurur.
- Diğer araçlara iç link verin: `[brütten nete maaş hesaplama](/brutten-nete-maas-hesaplama)`.
- `<!-- sss -->` satırından sonra SSS: en az 6 adet `### Soru?` + cevap paragrafı. (FAQPage JSON-LD otomatik.)

## 6. Kontrol
`pnpm vitest run`, `npx tsc -p tsconfig.json`, `npx eslint src/tools/<slug> src/calculators`, `pnpm build`
(ön-render tek H1/başlık uzunluğu denetimi yapar). PROGRESS.md'de aracı [x] işaretleyin.
