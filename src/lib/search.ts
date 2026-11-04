/** Türkçe duyarsız arama: "İşsizlik" ≈ "issizlik" */
export function norm(s: string): string {
  return s
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

/** cmdk filtresi: tüm sorgu kelimeleri değerde geçiyorsa eşleşir; başlıkta geçen daha üstte. */
export function toolFilter(value: string, search: string): number {
  const v = norm(value);
  const words = norm(search).split(/\s+/).filter(Boolean);
  if (words.length === 0) return 1;
  if (!words.every((w) => v.includes(w))) return 0;
  return v.startsWith(words[0]) ? 1 : 0.5;
}
