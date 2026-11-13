/*
 * Üst piyasa şeridi — gram altın, dolar, euro ve kripto, canlı.
 * Veri: src/lib/piyasa.ts (Binance; kaynak seçiminin gerekçesi orada yazılı).
 *
 * Prerender'da hiçbir şey çizmez (veri istemcide gelir, SSG çıktısı sabit kalır).
 * Binance'e ulaşılamazsa bar görünmez — sayfanın düzeni bundan etkilenmez.
 */

import { useEffect, useRef, useState } from 'react';

import { num } from '@/lib/format';
import { degerBul, gecmisGetir, GOSTERGELER, piyasayaBaglan, type Fiyat, type Gosterge } from '@/lib/piyasa';
import { PiyasaDetay } from './PiyasaDetay';

/** Son 24 saatin seyri — 62×24 alan grafiği. */
function MiniGrafik({ noktalar, yukseliyor }: { noktalar: number[]; yukseliyor: boolean }) {
  if (noktalar.length < 2) return <span className="w-[52px]" aria-hidden />;

  const [W, H, P] = [52, 24, 3];
  const enAz = Math.min(...noktalar);
  const aralik = Math.max(...noktalar) - enAz || 1;
  const d = noktalar
    .map((v, i) => `${(i / (noktalar.length - 1)) * W},${H - P - ((v - enAz) / aralik) * (H - 2 * P)}`)
    .join(' L');
  const renk = yukseliyor ? 'var(--piyasa-artis)' : 'var(--piyasa-azalis)';
  const id = `pg-${noktalar.length}-${yukseliyor ? 'a' : 'd'}-${Math.round(enAz)}`;

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none" aria-hidden className="shrink-0">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={renk} stopOpacity="0.32" />
          <stop offset="1" stopColor={renk} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`M${d} L${W},${H} L0,${H} Z`} fill={`url(#${id})`} />
      <path d={`M${d}`} stroke={renk} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/*
 * Değer değişince YÖNE göre yanıp söner: fiyat yükseldiyse yeşil, düştüyse kırmızı.
 * Karşılaştırma ham sayı üzerinden yapılır — yuvarlanmış metin aynı kalsa bile
 * (ör. 50,3400 → 50,3400) boşuna vurgu yapılmaz.
 */
function Deger({ deger, metin, birim }: { deger: number; metin: string; birim: string }) {
  const [tik, setTik] = useState<'artis' | 'azalis' | null>(null);
  const onceki = useRef(deger);

  useEffect(() => {
    const fark = deger - onceki.current;
    onceki.current = deger;
    if (fark === 0) return;

    setTik(fark > 0 ? 'artis' : 'azalis');
    const t = setTimeout(() => setTik(null), 900);
    return () => clearTimeout(t);
  }, [deger]);

  return (
    <span className={`piyasa-deger text-[19px] font-bold tracking-[-0.015em] ${tik ? `piyasa-tik-${tik}` : ''}`}>
      <span className="piyasa-birim">{birim}</span>
      {metin}
    </span>
  );
}

export function PiyasaBar() {
  const [fiyatlar, setFiyatlar] = useState<Record<string, Fiyat>>({});
  const [gecmis, setGecmis] = useState<Record<string, number[]>>({});
  const [secili, setSecili] = useState<Gosterge | null>(null);

  useEffect(() => piyasayaBaglan(setFiyatlar), []);

  useEffect(() => {
    let iptal = false;
    void Promise.all(GOSTERGELER.map(async (g) => [g.sembol, await gecmisGetir(g.sembol)] as const)).then(
      (ciftler) => !iptal && setGecmis(Object.fromEntries(ciftler)),
    );
    return () => {
      iptal = true;
    };
  }, []);

  const satirlar = GOSTERGELER.map((g) => ({ g, deger: degerBul(g, fiyatlar) })).filter(
    (s): s is { g: (typeof GOSTERGELER)[number]; deger: number } => s.deger !== undefined,
  );

  if (satirlar.length === 0) return null;

  return (
    <section className="piyasa-bar" aria-label="Canlı piyasa verileri">
      <div className="mx-auto flex max-w-6xl overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {satirlar.map(({ g, deger }) => {
          const degisim = fiyatlar[g.sembol]?.degisim ?? 0;
          const artis = degisim >= 0;
          return (
            <button
              key={g.sembol}
              type="button"
              onClick={() => setSecili(g)}
              aria-label={`${g.ad} detayları`}
              className="piyasa-oge flex shrink-0 cursor-pointer items-center gap-2 px-4 py-2.5 text-left first:pl-0 last:pr-0"
            >
              <span className="block">
                <span className="piyasa-etiket block text-[10px] font-semibold tracking-[0.09em] uppercase">{g.ad}</span>
                <span className="mt-0.5 flex items-baseline gap-2">
                  <Deger deger={deger} metin={num(deger, g.basamak, g.basamak)} birim={g.birim} />
                  <span className={`text-[11.5px] font-semibold ${artis ? 'piyasa-artis' : 'piyasa-azalis'}`}>
                    {artis ? '▲' : '▼'} {num(Math.abs(degisim), 2, 2)}%
                  </span>
                </span>
              </span>
              <MiniGrafik noktalar={gecmis[g.sembol] ?? []} yukseliyor={artis} />
            </button>
          );
        })}
      </div>

      <PiyasaDetay gosterge={secili} fiyatlar={fiyatlar} onClose={() => setSecili(null)} />
    </section>
  );
}
