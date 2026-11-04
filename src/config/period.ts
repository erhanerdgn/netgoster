/**
 * Dönemsel (tarih aralıklı) parametre altyapısı.
 * Her değer bir zaman serisidir; hesaplamalar işlem tarihine göre doğru dönemi otomatik seçer.
 * Yeni dönem geldiğinde (ör. Temmuz zammı) diziye bir kayıt eklemek yeterlidir — kod değişmez.
 */
export interface Period<T> {
  /** Başlangıç (dahil), YYYY-MM-DD */
  from: string;
  /** Bitiş (dahil), YYYY-MM-DD. Yoksa bir sonraki kayda / süresiz geçerli. */
  to?: string;
  value: T;
  /** Resmi kaynak (Resmî Gazete sayısı, kurum sayfası URL'si) */
  source: string;
  /** false ise değer doğrulanamamıştır (// TODO: DOĞRULA) */
  verified?: boolean;
}

export type Series<T> = Period<T>[];

/** Yerel saatle bugünün YYYY-MM-DD karşılığı */
export function todayISO(d = new Date()): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** Verilen tarihte geçerli kaydı döndürür; tarih serinin dışındaysa en yakın uçtaki kaydı kullanır. */
export function periodAt<T>(series: Series<T>, date: string = todayISO()): Period<T> {
  if (series.length === 0) throw new Error('Boş parametre serisi');
  const sorted = [...series].sort((a, b) => a.from.localeCompare(b.from));
  let hit = sorted[0];
  for (const p of sorted) {
    if (p.from <= date) hit = p;
  }
  return hit;
}

export function valueAt<T>(series: Series<T>, date?: string): T {
  return periodAt(series, date).value;
}

/** Serideki en güncel kaydın yılı — sayfa başlıklarındaki yıl buradan gelir. */
export function latestYear(series: Series<unknown>): number {
  return Math.max(...series.map((p) => Number(p.from.slice(0, 4))));
}
