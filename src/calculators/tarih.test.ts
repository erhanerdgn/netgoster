import { describe, expect, it } from 'vitest';
import { tatilAt, tatillerYil } from '../config/tatiller.ts';
import { calculateTarih, gunAdi, tarihSchema, ymd, type AraResult, type EkleResult } from './tarih.ts';

const ara = (v: object) => calculateTarih(tarihSchema.parse({ mod: 'ara', ...v })) as AraResult;
const ekle = (v: object) => calculateTarih(tarihSchema.parse({ mod: 'ekle', ...v })) as EkleResult;

describe('resmi tatiller', () => {
  it('2026: 8 sabit + 2×arife + 7 bayram günü = 17 kayıt', () => {
    expect(tatillerYil(2026)).toHaveLength(17);
    expect(tatilAt('2026-03-19')).toMatchObject({ half: true, name: 'Ramazan Bayramı arifesi' });
    expect(tatilAt('2026-05-30')).toMatchObject({ half: false, name: 'Kurban Bayramı 4. gün' });
    expect(tatilAt('2026-10-28')?.half).toBe(true);
  });
  it('19 Mayıs 2027 Kurban 4. günüyle çakışır: adlar birleşir, tam gün', () => {
    const t = tatilAt('2027-05-19')!;
    expect(t.half).toBe(false);
    expect(t.name).toContain('Atatürk');
    expect(t.name).toContain('Kurban');
  });
  it('2027-01-01 Cuma (Diyanet listesiyle aynı)', () => expect(gunAdi('2027-01-01')).toBe('Cuma'));
});

describe('iki tarih arası', () => {
  it('artık yıl: 01.02.2024 → 01.03.2024 = 29 gün, 1 ay', () => {
    const r = ara({ baslangic: '2024-02-01', bitis: '2024-03-01' });
    expect(r.gun).toBe(29);
    expect(r.ymd).toEqual({ years: 0, months: 1, days: 0 });
    expect(r.hafta).toEqual({ weeks: 4, days: 1 });
  });

  it('yıl sonu: 31.12.2025 → 01.01.2026 = 1 gün, bitiş dahil 2 gün', () => {
    expect(ara({ baslangic: '2025-12-31', bitis: '2026-01-01' }).gun).toBe(1);
    const r = ara({ baslangic: '2025-12-31', bitis: '2026-01-01', bitisDahil: true });
    expect(r.gun).toBe(2);
    // 31.12.2025 Çarşamba iş günü, 01.01.2026 Perşembe Yılbaşı
    expect(r.isGunu).toBe(1);
    expect(r.tatilGunu).toBe(1);
  });

  it('Ocak 2026 (dahil): 31 gün − 9 hafta sonu − Yılbaşı = 21 iş günü', () => {
    const r = ara({ baslangic: '2026-01-01', bitis: '2026-01-31', bitisDahil: true });
    expect(r.haftaSonu).toBe(9);
    expect(r.isGunu).toBe(21);
  });

  it('Ramazan Bayramı 2026 haftası: 16–22 Mart → 4 iş günü, 19 Mart arife yarım gün', () => {
    const r = ara({ baslangic: '2026-03-16', bitis: '2026-03-22', bitisDahil: true });
    // Pzt 16, Sa 17, Ça 18, Pe 19 (arife) iş günü; Cu 20 bayram; Ct 21, Pa 22 hafta sonu (bayram)
    expect(r.isGunu).toBe(4);
    expect(r.tatilGunu).toBe(1);
    expect(r.haftaSonu).toBe(2);
    expect(r.yarimGunler.map((t) => t.date)).toEqual(['2026-03-19']);
    expect(r.tatiller).toHaveLength(3);
  });

  it('Kurban 2027 + 19 Mayıs: 10–21 Mayıs → 12 gün, 7 iş günü (arife Cumartesi)', () => {
    const r = ara({ baslangic: '2027-05-10', bitis: '2027-05-21', bitisDahil: true });
    expect(r.gun).toBe(12);
    expect(r.haftaSonu).toBe(2);
    expect(r.tatilGunu).toBe(3); // 17, 18, 19 Mayıs
    expect(r.isGunu).toBe(7);
    expect(r.yarimGunler).toHaveLength(0);
  });

  it('ay sonu: 31.01 → 01.03 tam 1 ay (yıl dönümü kuralı), 31.01 → 28.02 = 0 ay 28 gün', () => {
    expect(ymd('2026-01-31', '2026-03-01')).toMatchObject({ years: 0, months: 1, days: 0 });
    expect(ymd('2025-01-31', '2025-02-28')).toMatchObject({ years: 0, months: 0, days: 28 });
    expect(ymd('2000-02-29', '2001-02-28')).toMatchObject({ years: 0, months: 11, days: 30 });
    expect(ymd('2000-02-29', '2001-03-01')).toMatchObject({ years: 1, months: 0, days: 0 });
  });

  it('veri olmayan yıl uyarısı: 2028 (artık yıl) 28.02 → 01.03 = 2 gün', () => {
    const r = ara({ baslangic: '2028-02-28', bitis: '2028-03-01' });
    expect(r.gun).toBe(2);
    expect(r.eksikYillar).toEqual([2028]);
  });

  it('bitiş başlangıçtan önce olamaz', () => {
    expect(tarihSchema.safeParse({ mod: 'ara', baslangic: '2026-05-02', bitis: '2026-05-01' }).success).toBe(false);
  });
});

describe('gün ekle / çıkar', () => {
  it('04.11.2026 + 30 takvim günü = 04.12.2026 Cuma', () => {
    const r = ekle({ tarih: '2026-11-04', islem: 'ekle', gun: 30, birim: 'takvim' });
    expect(r.sonuc).toBe('2026-12-04');
    expect(r.gunAdi).toBe('Cuma');
  });

  it('26.10.2026 + 5 iş günü: 28 Ekim arife sayılır, 29 Ekim atlanır → 03.11.2026', () => {
    const r = ekle({ tarih: '2026-10-26', islem: 'ekle', gun: 5, birim: 'is' });
    expect(r.sonuc).toBe('2026-11-03');
    expect(r.atlananTatiller.map((t) => t.date)).toEqual(['2026-10-29']);
    expect(r.takvimGunu).toBe(8);
  });

  it('04.01.2027 − 3 iş günü: hafta sonu ve Yılbaşı atlanır → 29.12.2026', () => {
    const r = ekle({ tarih: '2027-01-04', islem: 'cikar', gun: 3, birim: 'is' });
    expect(r.sonuc).toBe('2026-12-29');
  });

  it('takvim günü sonucu tatile denk gelirse belirtilir', () => {
    const r = ekle({ tarih: '2026-05-20', islem: 'ekle', gun: 7, birim: 'takvim' });
    expect(r.sonuc).toBe('2026-05-27');
    expect(r.sonucTatil?.name).toBe('Kurban Bayramı 1. gün');
  });
});
