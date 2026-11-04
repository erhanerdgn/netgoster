import { describe, expect, it } from 'vitest';
import { calculateYillikIzin, yillikIzinSchema } from './yillikIzin.ts';

const run = (v: object) => calculateYillikIzin(yillikIzinSchema.parse(v));
const T = '2026-11-04';

describe('yıllık izin', () => {
  it('3 yıl kıdem, 36 yaş: 14 gün; toplam 3 × 14 = 42; sonraki 15.03.2027', () => {
    const r = run({ giris: '2023-03-15', dogum: '1990-01-01', tarih: T });
    expect(r.kidemYil).toBe(3);
    expect(r.gun).toBe(14);
    expect(r.toplamHak).toBe(42);
    expect(r.sonHakEdis).toBe('2026-03-15');
    expect(r.sonrakiHakEdis).toBe('2027-03-15');
    expect(r.sonrakiGun).toBe(14);
  });

  it('5 yıl dolunca hâlâ 14, 6. yılda 20 gün ("beş yıldan fazla")', () => {
    const r = run({ giris: '2021-11-05', dogum: '1990-01-01', tarih: T });
    expect(r.kidemYil).toBe(4);
    expect(r.sonrakiGun).toBe(14); // 5. yıl
    expect(r.kalanGun).toBe(1);
    expect(run({ giris: '2020-11-04', dogum: '1990-01-01', tarih: T }).gun).toBe(20);
  });

  it('15 yıl: 26 gün; toplam 5×14 + 9×20 + 26 = 276', () => {
    const r = run({ giris: '2011-06-01', dogum: '1985-06-01', tarih: T });
    expect(r.kidemYil).toBe(15);
    expect(r.gun).toBe(26);
    expect(r.toplamHak).toBe(276);
  });

  it('50 yaş: hak ediş günü 50 yaşında → en az 20 (önceki yıllar 14+14) = 48', () => {
    const r = run({ giris: '2023-01-10', dogum: '1975-05-01', tarih: T });
    expect(r.gun).toBe(20); // 10.01.2026'da 50 yaşında
    expect(r.toplamHak).toBe(48);
  });

  it('17 yaşında hak eden genç işçi 20 gün; yer altında +4 = 24', () => {
    const r = run({ giris: '2025-01-01', dogum: '2008-03-01', tarih: T, yerAlti: true });
    expect(r.gun).toBe(24);
  });

  it('1 yıl dolmadan izin hakkı yok; ilk hak 01.03.2027', () => {
    const r = run({ giris: '2026-03-01', dogum: '1995-01-01', tarih: T });
    expect(r.gun).toBe(0);
    expect(r.sonHakEdis).toBeNull();
    expect(r.sonrakiHakEdis).toBe('2027-03-01');
    expect(r.sonrakiGun).toBe(14);
    expect(r.kalanGun).toBe(117); // 04.11.2026 → 01.03.2027
  });

  it('29 Şubat girişi: hak artık olmayan yılda 1 Mart’ta doğar; 31.01 girişi 31.01’de', () => {
    const a = run({ giris: '2024-02-29', dogum: '1990-01-01', tarih: '2025-02-28' });
    expect(a.gun).toBe(0);
    expect(a.sonrakiHakEdis).toBe('2025-03-01');
    expect(a.kalanGun).toBe(1);
    expect(run({ giris: '2024-02-29', dogum: '1990-01-01', tarih: '2025-03-01' }).gun).toBe(14);
    const b = run({ giris: '2023-01-31', dogum: '1990-01-01', tarih: '2026-01-31' });
    expect(b.kidemYil).toBe(3);
    expect(b.sonHakEdis).toBe('2026-01-31');
  });
});
