import { describe, expect, it } from 'vitest';
import { calculateTapuHarci, tapuHarciSchema } from './tapuHarci.ts';

const run = (v: object) => calculateTapuHarci(tapuHarciSchema.parse(v), '2026-11-04');

describe('tapu harcı', () => {
  it('3.000.000 TL daire, katsayı 1: alıcı 60.000 + satıcı 60.000, döner 2.227', () => {
    const r = run({ bedel: 3000000 });
    expect(r.aliciHarc).toBe(60000);
    expect(r.saticiHarc).toBe(60000);
    expect(r.doner).toBe(2227);
    expect(r.aliciToplam).toBe(62227);
    expect(r.saticiToplam).toBe(60000);
    expect(r.genelToplam).toBe(122227);
  });

  it('emlak vergisi değeri beyandan yüksekse matrah odur; tamamını alıcı öder', () => {
    // matrah 2.500.000; harç 2 × 50.000 = 100.000; döner 2.227 × 2,5 = 5.567,50
    const r = run({ bedel: 2000000, emlakDegeri: 2500000, odeme: 'alici', katsayi: 2.5 });
    expect(r.matrahEmlakDegeri).toBe(true);
    expect(r.matrah).toBe(2500000);
    expect(r.toplamHarc).toBe(100000);
    expect(r.doner).toBe(5567.5);
    expect(r.aliciToplam).toBe(105567.5);
    expect(r.saticiToplam).toBe(0);
  });

  it('10 TL’ye kadar matrah kesirleri atılır: 4.500.007 → 4.500.000', () => {
    const r = run({ bedel: 4500007 });
    expect(r.harcMatrahi).toBe(4500000);
    expect(r.aliciHarc).toBe(90000);
  });

  it('3 bağımsız bölüm (kat mülkiyeti), katsayı 3: döner = 3 × 6.681 = 20.043', () => {
    const r = run({ bedel: 9000000, katsayi: 3, adet: 3, bagimsizBolum: true });
    expect(r.donerIlk).toBe(6681);
    expect(r.doner).toBe(20043);
  });

  it('3 tarla (bağımsız bölüm değil), katsayı 0,3: 668,10 + 2 × 92,10 = 852,30', () => {
    const r = run({ bedel: 800000, katsayi: 0.3, adet: 3, bagimsizBolum: false });
    expect(r.donerIlk).toBe(668.1);
    expect(r.donerIlave).toBe(92.1);
    expect(r.doner).toBe(852.3);
    expect(r.aliciHarc).toBe(16000);
  });

  it('satış bedeli 0 olamaz', () => {
    expect(tapuHarciSchema.safeParse({ bedel: 0 }).success).toBe(false);
  });
});
