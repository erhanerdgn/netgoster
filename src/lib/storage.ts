/** localStorage erişimi gizli sekme/engelli depolamada patlamasın diye hep try/catch içinde. */
export function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* depolama yok — sessizce geç */
  }
}

const RECENT = 'ng-recent';

export function pushRecent(slug: string) {
  const list = readJSON<string[]>(RECENT, []).filter((s) => s !== slug);
  writeJSON(RECENT, [slug, ...list].slice(0, 6));
}

export function getRecent(): string[] {
  return readJSON<string[]>(RECENT, []);
}
