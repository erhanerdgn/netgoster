import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getFavorites, getRecent, getSaved, pushRecent, removeSaved, saveCalculation, toggleFavorite } from './storage';

const values = new Map<string, string>();
const sample = { slug: 'kredi-hesaplama', title: 'Kredi', label: 'Aylık taksit', value: '10.000 ₺', query: 'tutar=100000' };

beforeEach(() => {
  values.clear();
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  });
  vi.stubGlobal('window', new EventTarget());
});
afterEach(() => vi.unstubAllGlobals());

describe('kişisel hesap köşesi', () => {
  it('favoriye ekler ve kaldırır', () => {
    toggleFavorite('kredi');
    expect(getFavorites()).toEqual(['kredi']);
    toggleFavorite('kredi');
    expect(getFavorites()).toEqual([]);
  });
  it('aynı hesabı çoğaltmaz, en fazla 8 kayıt tutar ve tek kaydı siler', () => {
    expect(saveCalculation(sample)).toBe(true);
    saveCalculation(sample);
    expect(getSaved()).toHaveLength(1);
    for (let i = 0; i < 10; i++) saveCalculation({ ...sample, query: `tutar=${i}` });
    expect(getSaved()).toHaveLength(8);
    expect(getSaved()[0].query).toBe('tutar=9');
    removeSaved(getSaved()[0].id);
    expect(getSaved()).toHaveLength(7);
    expect(getSaved()[0].query).toBe('tutar=8');
  });
  it('bozuk veya eski yerel kayıtlarla sayfayı bozmaz', () => {
    values.set('ng-favorites', '{}');
    values.set('ng-recent', 'null');
    values.set('ng-saved', '[null, {}, {"slug":5}]');
    expect(getFavorites()).toEqual([]);
    expect(getRecent()).toEqual([]);
    expect(getSaved()).toEqual([]);
    pushRecent('kredi');
    expect(getRecent()).toEqual(['kredi']);
  });
  it('tarayıcı kaydı engellediğinde başarı bildirmez', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => null,
      setItem: () => {
        throw new Error('blocked');
      },
    });
    expect(saveCalculation(sample)).toBe(false);
    expect(getSaved()).toEqual([]);
  });
});
