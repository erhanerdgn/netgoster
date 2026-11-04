/** TCMB kurları ve altın fiyatı — Cache API ile önbellekli, hata durumunda son başarılı veri. */

export interface Rate {
  code: string;
  name: string;
  unit: number;
  forexBuying: number | null;
  forexSelling: number | null;
  banknoteBuying: number | null;
  banknoteSelling: number | null;
}

export interface RatesPayload {
  source: 'TCMB';
  /** TCMB bülten tarihi (YYYY-MM-DD) */
  date: string;
  bulletin: string;
  fetchedAt: string;
  stale: boolean;
  rates: Rate[];
}

const TCMB = 'https://www.tcmb.gov.tr/kurlar/today.xml';
const CACHE_KEY = 'https://cache.netgoster.internal/kurlar';
const LAST_KEY = 'https://cache.netgoster.internal/kurlar-last';

const tag = (xml: string, name: string) => {
  const m = new RegExp(`<${name}>([^<]*)</${name}>`).exec(xml);
  const v = m?.[1]?.trim();
  return v ? Number(v) : null;
};

export function parseTcmb(xml: string): Omit<RatesPayload, 'fetchedAt' | 'stale'> {
  const head = /<Tarih_Date[^>]*Tarih="(\d{2})\.(\d{2})\.(\d{4})"[^>]*Bulten_No="([^"]*)"/.exec(xml);
  if (!head) throw new Error('TCMB XML biçimi tanınmadı');
  const [, d, m, y, bulletin] = head;
  const rates: Rate[] = [];
  for (const block of xml.matchAll(/<Currency[^>]*CurrencyCode="([A-Z]{3})"[^>]*>([\s\S]*?)<\/Currency>/g)) {
    const [, code, body] = block;
    rates.push({
      code,
      name: /<Isim>([^<]*)<\/Isim>/.exec(body)?.[1]?.trim() ?? code,
      unit: tag(body, 'Unit') ?? 1,
      forexBuying: tag(body, 'ForexBuying'),
      forexSelling: tag(body, 'ForexSelling'),
      banknoteBuying: tag(body, 'BanknoteBuying'),
      banknoteSelling: tag(body, 'BanknoteSelling'),
    });
  }
  if (rates.length === 0) throw new Error('TCMB XML içinde kur yok');
  return { source: 'TCMB', date: `${y}-${m}-${d}`, bulletin, rates };
}

const json = (data: unknown, maxAge: number, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': `public, max-age=${maxAge}`,
      'Access-Control-Allow-Origin': '*',
    },
  });

/** Önbellek → kaynak → son başarılı veri sırası. `load` başarısız olursa son veri `stale: true` döner. */
async function cached<T extends object>(
  ctx: ExecutionContext,
  key: string,
  lastKey: string,
  ttl: number,
  load: () => Promise<T>,
): Promise<Response> {
  const cache = caches.default;
  const hit = await cache.match(key);
  if (hit) return hit;
  try {
    const data = { ...(await load()), fetchedAt: new Date().toISOString(), stale: false };
    const res = json(data, ttl);
    ctx.waitUntil(Promise.all([cache.put(key, res.clone()), cache.put(lastKey, json(data, 60 * 60 * 24 * 30))]));
    return res;
  } catch (e) {
    const last = await cache.match(lastKey);
    if (last) {
      const data = (await last.json()) as object;
      return json({ ...data, stale: true }, 300);
    }
    return json({ error: 'Veri şu an alınamıyor', detail: String(e) }, 60, 503);
  }
}

async function loadRates() {
  const res = await fetch(TCMB, { headers: { 'User-Agent': 'NetGoster/1.0 (+https://netgoster.com)' }, cf: { cacheTtl: 600 } });
  if (!res.ok) throw new Error(`TCMB HTTP ${res.status}`);
  return parseTcmb(await res.text());
}

export function getRates(ctx: ExecutionContext) {
  return cached(ctx, CACHE_KEY, LAST_KEY, 3600, loadRates);
}

// ─── Altın ───
// Kaynak seçimi ve kullanım şartları: README > "Canlı veri" (gold-api.com, ücretsiz, anahtarsız).
const GOLD = 'https://api.gold-api.com/price/XAU';
const OUNCE_GRAMS = 31.1034768;

export async function loadGold() {
  const [g, r] = await Promise.all([
    fetch(GOLD, { headers: { Accept: 'application/json' } }).then((x) => {
      if (!x.ok) throw new Error(`Altın HTTP ${x.status}`);
      return x.json() as Promise<{ price: number; updatedAt?: string }>;
    }),
    loadRates(),
  ]);
  const usd = r.rates.find((x) => x.code === 'USD')?.forexSelling;
  if (!g.price || !usd) throw new Error('Altın/USD verisi eksik');
  return {
    source: 'gold-api.com + TCMB',
    ounceUsd: g.price,
    usdTry: usd,
    gram24: Math.round(((g.price * usd) / OUNCE_GRAMS) * 100) / 100,
    priceAt: g.updatedAt ?? null,
    usdDate: r.date,
  };
}

export function getGold(ctx: ExecutionContext) {
  return cached(ctx, 'https://cache.netgoster.internal/altin', 'https://cache.netgoster.internal/altin-last', 900, loadGold);
}
