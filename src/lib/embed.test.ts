import { describe, expect, it } from 'vitest';
import { gommeKodu, isEmbedPath } from './embed';

describe('gömme kodu', () => {
  const kod = gommeKodu('kredi-hesaplama', 'Kredi Hesaplama');

  // Projenin varlık sebebi: iframe içindeki bağlantılar ev sahibi siteden backlink SAYILMAZ.
  // Bağlantı iframe kapandıktan SONRA, ev sahibinin kendi HTML'inde olmalı.
  it('backlink iframe dışında, ev sahibinin HTML’inde', () => {
    const iframeSonu = kod.indexOf('</iframe>');
    const link = kod.indexOf('<a href="https://netgoster.com/kredi-hesaplama">');
    expect(iframeSonu).toBeGreaterThan(-1);
    expect(link).toBeGreaterThan(iframeSonu);
  });

  it('iframe gömülü rotayı açar', () => {
    expect(kod).toContain('src="https://netgoster.com/gom/kredi-hesaplama"');
  });

  it('yükseklik betiği mesajın kaynağını denetler', () => {
    expect(kod).toContain('e.origin!=="https://netgoster.com"');
  });

  it('gömülü yol tanıma', () => {
    expect(isEmbedPath('/gom/kredi-hesaplama')).toBe(true);
    expect(isEmbedPath('/kredi-hesaplama')).toBe(false);
    expect(isEmbedPath('/gomlek')).toBe(false);
  });
});
