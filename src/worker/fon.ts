/**
 * TEFAS fon verisi (tefas.gov.tr'nin kendi sitesinin kullandığı /api/funds uçları; resmi/belgeli API değildir,
 * değişirse araç elle fiyat girişine düşer).
 * - /api/fonlar      → yatırım fonu listesi [kod, unvan] (emeklilik fonları hariç), 24 saat önbellek
 * - /api/fon/<KOD>   → son 5 yılın günlük birim pay fiyatları [tarih, fiyat], 6 saat önbellek
 * Kaynak hatasında son başarılı veri `stale: true` ile döner (rates.ts → cached).
 */
import { cached } from './rates.ts';

const API = 'https://www.tefas.gov.tr/api/funds/';

interface TefasFiyat {
  fonKodu: string;
  fonUnvan: string;
  tarih: string;
  fiyat: number;
}

async function tefas<T>(path: string, body: object): Promise<T[]> {
  const res = await fetch(API + path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Origin: 'https://www.tefas.gov.tr',
      Referer: 'https://www.tefas.gov.tr/tr',
      'User-Agent': 'Mozilla/5.0 (compatible; NetGoster/1.0; +https://netgoster.com)',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`TEFAS HTTP ${res.status}`);
  const data = (await res.json()) as { errorMessage?: string | null; resultList?: T[] | null };
  if (data.errorMessage || !data.resultList) throw new Error(`TEFAS: ${data.errorMessage ?? 'boş yanıt'}`);
  return data.resultList;
}

export function getFonListesi(ctx: ExecutionContext) {
  return cached(
    ctx,
    'https://cache.netgoster.internal/fonlar',
    'https://cache.netgoster.internal/fonlar-last',
    86400,
    async () => {
      const list = await tefas<{ fonKodu: string; fonUnvan: string }>('fonUnvanAra', { fonUnvan: '', dil: 'TR' });
      const fonlar = list
        .filter((f) => !/EMEKLİLİK/.test(f.fonUnvan))
        .map((f) => [f.fonKodu, f.fonUnvan] as const)
        .sort((a, b) => a[0].localeCompare(b[0]));
      if (fonlar.length < 100) throw new Error(`TEFAS fon listesi eksik (${fonlar.length})`);
      return { source: 'TEFAS', fonlar };
    },
  );
}

export const FON_KODU = /^[A-Z0-9]{2,5}$/;

export function getFonFiyat(ctx: ExecutionContext, kod: string) {
  return cached(
    ctx,
    `https://cache.netgoster.internal/fon/${kod}`,
    `https://cache.netgoster.internal/fon-last/${kod}`,
    6 * 3600,
    async () => {
      // 5 yıllık geçmiş; fon 5 yıldan yeniyse TEFAS hata verir → 1 yıla düş
      let rows: TefasFiyat[];
      try {
        rows = await tefas<TefasFiyat>('fonFiyatBilgiGetir', { fonKodu: kod, dil: 'TR', periyod: 60 });
      } catch {
        rows = await tefas<TefasFiyat>('fonFiyatBilgiGetir', { fonKodu: kod, dil: 'TR', periyod: 12 });
      }
      if (!rows.length) throw new Error('Fiyat bulunamadı');
      return {
        source: 'TEFAS',
        kod,
        unvan: rows[0].fonUnvan,
        // Henüz açıklanmamış günün fiyatı 0 gelir → atla
        fiyatlar: rows.filter((r) => r.fiyat > 0).map((r) => [r.tarih.slice(0, 10), r.fiyat] as [string, number]),
      };
    },
  );
}
