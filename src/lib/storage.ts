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
    window.dispatchEvent(new Event('ng:library'));
    return true;
  } catch {
    return false;
  }
}

const RECENT = 'ng-recent';

export function pushRecent(slug: string) {
  const list = getRecent().filter((s) => s !== slug);
  writeJSON(RECENT, [slug, ...list].slice(0, 6));
}

export function getRecent(): string[] {
  const value = readJSON<unknown>(RECENT, []);
  return Array.isArray(value) ? value.filter((s): s is string => typeof s === 'string').slice(0, 6) : [];
}

export interface SavedCalculation {
  id: string;
  slug: string;
  title: string;
  label: string;
  value: string;
  query: string;
  created: string;
}

export function getFavorites(): string[] {
  const value = readJSON<unknown>('ng-favorites', []);
  return Array.isArray(value) ? value.filter((s): s is string => typeof s === 'string') : [];
}

export function toggleFavorite(slug: string) {
  const list = getFavorites();
  writeJSON('ng-favorites', list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug]);
}

export function getSaved(): SavedCalculation[] {
  const value = readJSON<unknown>('ng-saved', []);
  if (!Array.isArray(value)) return [];
  return value
    .filter(
      (v): v is SavedCalculation =>
        !!v &&
        typeof v === 'object' &&
        ['id', 'slug', 'title', 'label', 'value', 'query', 'created'].every((k) => typeof v[k] === 'string'),
    )
    .slice(0, 8);
}

export function saveCalculation(value: Omit<SavedCalculation, 'id' | 'created'>) {
  const entry = { ...value, id: crypto.randomUUID(), created: new Date().toISOString() };
  const list = getSaved().filter((s) => s.slug !== value.slug || s.query !== value.query);
  return writeJSON('ng-saved', [entry, ...list].slice(0, 8));
}

export function removeSaved(id: string) {
  writeJSON(
    'ng-saved',
    getSaved().filter((s) => s.id !== id),
  );
}
