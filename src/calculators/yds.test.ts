import { describe, expect, it } from 'vitest';
import { calculateYds, ydsSchema } from './yds.ts';

const run = (dogru: number) => calculateYds(ydsSchema.parse({ dogru }));

describe('YDS puan', () => {
  it('64 doğru × 1,25 = 80 → B; A (90) için 72 doğru → 8 eksik', () => {
    const r = run(64);
    expect(r.puan).toBe(80);
    expect(r.seviye).toBe('B');
    expect(r.sonrakiIcin).toEqual({ seviye: 'A', dogru: 8 });
    expect(r.yanlisBos).toBe(16);
  });

  it('56 doğru = 70 → C (sınır)', () => {
    expect(run(56).seviye).toBe('C');
  });

  it('39 doğru = 48,75 → seviye yok; E için 40 doğru → 1 eksik', () => {
    const r = run(39);
    expect(r.puan).toBe(48.75);
    expect(r.seviye).toBeNull();
    expect(r.sonrakiIcin).toEqual({ seviye: 'E', dogru: 1 });
  });

  it('80 doğru = 100 → A, üst seviye yok', () => {
    const r = run(80);
    expect(r.puan).toBe(100);
    expect(r.seviye).toBe('A');
    expect(r.sonrakiIcin).toBeNull();
  });

  it('0 doğru = 0; 49 doğru = 61,25 → D', () => {
    expect(run(0).puan).toBe(0);
    expect(run(49).seviye).toBe('D');
  });

  it('doğrulama: 0–80 tam sayı', () => {
    expect(ydsSchema.safeParse({ dogru: 81 }).success).toBe(false);
    expect(ydsSchema.safeParse({ dogru: 40.5 }).success).toBe(false);
  });
});
