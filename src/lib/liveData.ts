import { useEffect, useState } from 'react';
import { readJSON, writeJSON } from './storage';

export type LiveStatus = 'loading' | 'ok' | 'stale' | 'error';

export interface Live<T> {
  status: LiveStatus;
  data: T | null;
  /** Verinin alındığı an (ISO) — sunucu `fetchedAt` ya da tarayıcıdaki son başarılı kayıt */
  fetchedAt: string | null;
  retry: () => void;
}

/**
 * Worker uç noktasından canlı veri (/api/kurlar, /api/altin).
 * - Başarılı yanıt localStorage'a yazılır; ağ/kaynak hatasında son başarılı değer `stale` olarak döner.
 * - Hiç veri yoksa `error` — araç elle giriş istemelidir.
 * SSR sırasında her zaman `loading` döner (veri tarayıcıda çekilir).
 */
export function useLive<T extends { fetchedAt?: string; stale?: boolean }>(url: string): Live<T> {
  const key = `ng-live:${url}`;
  const [state, setState] = useState<Omit<Live<T>, 'retry'>>({ status: 'loading', data: null, fetchedAt: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let alive = true;
    const cached = readJSON<T | null>(key, null);
    if (cached) setState({ status: 'stale', data: cached, fetchedAt: cached.fetchedAt ?? null });
    fetch(url, { headers: { Accept: 'application/json' } })
      .then(async (res) => {
        if (!res.ok) throw new Error(String(res.status));
        const data = (await res.json()) as T;
        if (!alive) return;
        if (!data.stale) writeJSON(key, data);
        setState({ status: data.stale ? 'stale' : 'ok', data, fetchedAt: data.fetchedAt ?? null });
      })
      .catch(() => {
        if (!alive) return;
        setState(
          cached
            ? { status: 'stale', data: cached, fetchedAt: cached.fetchedAt ?? null }
            : { status: 'error', data: null, fetchedAt: null },
        );
      });
    return () => {
      alive = false;
    };
  }, [url, key, attempt]);

  return { ...state, retry: () => setAttempt((a) => a + 1) };
}
