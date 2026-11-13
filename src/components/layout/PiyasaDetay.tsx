/*
 * Piyasa detay penceresi — bardaki bir göstergeye tıklayınca açılır.
 * Grafik (1 gün / 1 hafta / 1 ay / 1 yıl) + gün içi değerler.
 *
 * Veri Binance'in genel API'sinden; alanların tamamı src/lib/piyasa.ts'te açıklı.
 * Bu pencere arama motorlarınca indekslenmez — kalıcı içerik için araç sayfaları var.
 */

import { useEffect, useMemo, useState } from 'react';

import { num, tl0 } from '@/lib/format';
import { ARALIKLAR, detayGetir, serisiGetir, type Aralik, type Detay, type Fiyat, type Gosterge, type Mum } from '@/lib/piyasa';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

/** Grafik tuvali — viewBox ölçüleri (genişlik, yükseklik, kenar boşluğu). */
const [W, H, P] = [760, 240, 12];

/** Kapanış serisini alan grafiğine çevirir; imleç takip eden fiyat ipucu gösterir. */
function Grafik({
  mumlar,
  basamak,
  birim,
  aralikAdi,
}: {
  /** Seri zaten ekrandaki birimde (bkz. piyasa.ts > serisiGetir) */
  mumlar: Mum[];
  basamak: number;
  birim: string;
  aralikAdi: Aralik;
}) {
  const [secili, setSecili] = useState<number | null>(null);

  const { xy, cizgi, alan, enAz, enCok, yukseliyor } = useMemo(() => {
    const d = mumlar.map((m) => m.kapanis);
    if (d.length < 2) return { xy: [], cizgi: '', alan: '', enAz: 0, enCok: 0, yukseliyor: true };
    const mn = Math.min(...d);
    const aralik = Math.max(...d) - mn || 1;
    const xy = d.map((v, i) => ({
      x: P + (i / (d.length - 1)) * (W - 2 * P),
      y: H - P - ((v - mn) / aralik) * (H - 2 * P),
      v,
    }));
    return {
      xy,
      cizgi: `M${xy.map((n) => `${n.x},${n.y}`).join(' L')}`,
      alan: `M${xy.map((n) => `${n.x},${n.y}`).join(' L')} L${W - P},${H} L${P},${H} Z`,
      enAz: mn,
      enCok: Math.max(...d),
      yukseliyor: d[d.length - 1] >= d[0],
    };
  }, [mumlar]);

  if (!cizgi) {
    return (
      <div className="flex h-[240px] items-center justify-center text-sm text-muted-foreground">Grafik verisi alınamadı.</div>
    );
  }

  const renk = yukseliyor ? 'var(--result)' : 'var(--destructive)';
  const sec = secili !== null ? xy[secili] : undefined;
  const secZaman = secili !== null ? mumlar[secili]?.zaman : undefined;

  /** İmlecin/parmağın yatay konumunu en yakın veri noktasına eşler. */
  const takip = (e: React.PointerEvent<SVGSVGElement>) => {
    const kutu = e.currentTarget.getBoundingClientRect();
    const oran = (e.clientX - kutu.left) / kutu.width; // 0–1
    const i = Math.round(oran * (xy.length - 1));
    setSecili(Math.min(Math.max(i, 0), xy.length - 1));
  };

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full touch-none"
        role="img"
        aria-label="Fiyat grafiği"
        onPointerMove={takip}
        onPointerDown={takip}
        onPointerLeave={() => setSecili(null)}
      >
        <defs>
          <linearGradient id="piyasa-detay-dolgu" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={renk} stopOpacity="0.22" />
            <stop offset="1" stopColor={renk} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={alan} fill="url(#piyasa-detay-dolgu)" />
        <path d={cizgi} stroke={renk} strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />

        {sec && (
          <>
            <line x1={sec.x} y1={0} x2={sec.x} y2={H} stroke="var(--border)" strokeWidth="1" />
            <circle cx={sec.x} cy={sec.y} r="4.5" fill={renk} stroke="var(--card)" strokeWidth="2" />
          </>
        )}
      </svg>

      {/* İpucu kutusu: SVG dışında, yüzde konumlandırma ile — metin ölçeklenmesin diye */}
      {sec && (
        <div
          className="pointer-events-none absolute top-1 z-10 -translate-x-1/2 rounded-lg border border-border bg-popover px-2.5 py-1.5 text-xs whitespace-nowrap shadow-md"
          style={{ left: `${(sec.x / W) * 100}%` }}
        >
          <div className="text-muted-foreground">{zamanYaz(secZaman, aralikAdi)}</div>
          <div className="font-semibold tabular-nums">
            {birim}
            {num(sec.v, basamak, basamak)}
          </div>
        </div>
      )}

      <div className="mt-1 flex justify-between text-xs text-muted-foreground tabular-nums">
        <span>
          en düşük {birim}
          {num(enAz, basamak, basamak)}
        </span>
        <span>
          en yüksek {birim}
          {num(enCok, basamak, basamak)}
        </span>
      </div>
    </div>
  );
}

const AYLAR = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

/** 1 Gün'de saat, daha uzun aralıklarda tarih gösterilir. */
function zamanYaz(ms: number | undefined, aralik: Aralik): string {
  if (!ms) return '';
  const t = new Date(ms);
  const gun = `${t.getDate()} ${AYLAR[t.getMonth()]}`;
  if (aralik === '1 Gün') return `${gun} ${String(t.getHours()).padStart(2, '0')}:00`;
  if (aralik === '1 Yıl') return `${gun} ${t.getFullYear()}`;
  return gun;
}

/** Hacim milyarlara çıktığı için kısaltılır — tam rakam satıra sığmıyor ve okunmuyor. */
function hacimYaz(n: number): string {
  if (n >= 1e9) return `${num(n / 1e9, 2, 2)} milyar ₺`;
  if (n >= 1e6) return `${num(n / 1e6, 1, 1)} milyon ₺`;
  return tl0(n);
}

function Satir({ ad, deger }: { ad: string; deger: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-border py-3 last:border-b-0">
      <span className="text-sm text-muted-foreground">{ad}</span>
      <span className="text-sm font-semibold tabular-nums">{deger}</span>
    </div>
  );
}

export function PiyasaDetay({
  gosterge,
  fiyatlar,
  onClose,
}: {
  gosterge: Gosterge | null;
  /** Canlı tablo — çapraz kurlu göstergelerin (Euro) çevrimi için gerekli */
  fiyatlar: Record<string, Fiyat>;
  onClose: () => void;
}) {
  const [aralik, setAralik] = useState<Aralik>('1 Gün');
  const [mumlar, setMumlar] = useState<Mum[]>([]);
  const [detay, setDetay] = useState<Detay>();
  const [yukleniyor, setYukleniyor] = useState(false);

  const sembol = gosterge?.sembol;

  // Grafik serisi — gösterge ya da aralık değişince yenilenir.
  useEffect(() => {
    if (!gosterge) return;
    let iptal = false;
    setYukleniyor(true);
    void serisiGetir(gosterge, aralik).then((m) => {
      if (iptal) return;
      setMumlar(m);
      setYukleniyor(false);
    });
    return () => {
      iptal = true;
    };
  }, [gosterge, aralik]);

  // Gün içi değerler — yalnız gösterge değişince.
  useEffect(() => {
    if (!sembol) return;
    let iptal = false;
    setDetay(undefined);
    void detayGetir(sembol).then((d) => !iptal && setDetay(d));
    return () => {
      iptal = true;
    };
  }, [sembol]);

  // Pencere her açıldığında 1 güne döner.
  useEffect(() => {
    if (gosterge) setAralik('1 Gün');
  }, [gosterge]);

  if (!gosterge) return null;

  /*
   * Ham fiyatı gösterilecek değere çevirir. Çapraz kurlu göstergede (Euro = EUR/USD × USD/TRY)
   * dolar kuru canlı tablodan gelir; tablo henüz boşsa çarpan 0 olacağı için ham değere düşeriz.
   */
  const cevir = (h: number) => (gosterge.cevir ? gosterge.cevir(h, fiyatlar) || h : h);
  const b = gosterge.basamak;
  const birim = gosterge.birim;

  return (
    <Dialog open onOpenChange={(acik) => !acik && onClose()}>
      {/* sm:max-w-3xl — dialog.tsx'teki sm:max-w-lg'yi ezmek için kırılım önekiyle yazılmalı */}
      <DialogContent className="gap-5 sm:max-w-3xl sm:p-7">
        <DialogHeader>
          <DialogTitle>{gosterge.ad}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-wrap gap-1.5">
          {ARALIKLAR.map((a) => (
            <button
              key={a.ad}
              type="button"
              onClick={() => setAralik(a.ad)}
              aria-pressed={aralik === a.ad}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                aralik === a.ad ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-accent'
              }`}
            >
              {a.ad}
            </button>
          ))}
        </div>

        <div className={yukleniyor ? 'opacity-50 transition-opacity' : 'transition-opacity'}>
          <Grafik mumlar={mumlar} basamak={b} birim={birim} aralikAdi={aralik} />
        </div>

        {detay ? (
          <div className="grid gap-x-12 sm:grid-cols-2">
            <Satir ad="Açılış" deger={`${birim}${num(cevir(detay.acilis), b, b)}`} />
            <Satir ad="Günün en yükseği" deger={`${birim}${num(cevir(detay.enYuksek), b, b)}`} />
            <Satir ad="Günün en düşüğü" deger={`${birim}${num(cevir(detay.enDusuk), b, b)}`} />
            <Satir ad="Alış" deger={`${birim}${num(cevir(detay.alis), b, b)}`} />
            <Satir ad="Satış" deger={`${birim}${num(cevir(detay.satis), b, b)}`} />
            <Satir ad="Makas" deger={`${birim}${num(cevir(detay.satis) - cevir(detay.alis), b, b)}`} />
            <Satir ad="24s hacim" deger={hacimYaz(detay.hacimTl)} />
            <Satir ad="24s işlem" deger={num(detay.islemSayisi, 0, 0)} />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Gün içi değerler alınıyor…</p>
        )}

        <p className="text-xs text-muted-foreground">
          Kaynak: Binance genel piyasa verisi — gerçekleşmiş işlem fiyatları. Yatırım tavsiyesi değildir.
        </p>
      </DialogContent>
    </Dialog>
  );
}
