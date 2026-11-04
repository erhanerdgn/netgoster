import { z } from 'zod';
import { mevduatStopaj } from '../config/parameters-2026.ts';
import { valueAt } from '../config/period.ts';
import { addDays, round2, zDate, zMoney, zNumber } from './common.ts';

export const mevduatSchema = z.object({
  anapara: zMoney('Anapara', { min: 1 }),
  /** Yıllık brüt faiz oranı, yüzde */
  oran: zNumber('Yıllık faiz oranı', { max: 200 }),
  gun: zNumber('Vade', { min: 1, max: 3650, int: true }),
  acilis: zDate('Hesap açılış tarihi'),
  yenile: z.boolean().default(false),
  donem: zNumber('Dönem sayısı', { min: 1, max: 60, int: true }).default(4),
});

export type MevduatInput = z.input<typeof mevduatSchema>;
export type MevduatValues = z.output<typeof mevduatSchema>;

export type StopajDilimi = 'alti6' | 'yil1' | 'uzun';

export interface MevduatDonem {
  donem: number;
  acilis: string;
  vadeSonu: string;
  anapara: number;
  brutFaiz: number;
  stopajOran: number;
  stopaj: number;
  netFaiz: number;
  bakiye: number;
}

export interface MevduatResult {
  vadeSonu: string;
  dilim: StopajDilimi;
  stopajOran: number;
  brutFaiz: number;
  stopaj: number;
  netFaiz: number;
  vadeSonuTutar: number;
  /** Net faizin yıllık basit karşılığı — ondalık */
  netYillik: number;
  /** "Vade sonunda yenile" seçiliyse dönem dönem bileşik getiri */
  donemler?: MevduatDonem[];
  toplamNetFaiz?: number;
  sonBakiye?: number;
  /** Bileşik dönemlerin yıllık efektif net getirisi — ondalık */
  efektifYillik?: number;
}

/** Ay ekler; hedef ayda o gün yoksa ayın son günü (31 Ağustos + 6 ay = 28/29 Şubat) */
export function addMonths(iso: string, months: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  const t = new Date(Date.UTC(y, m - 1 + months, 1));
  const last = new Date(Date.UTC(t.getUTCFullYear(), t.getUTCMonth() + 1, 0)).getUTCDate();
  t.setUTCDate(Math.min(d, last));
  return t.toISOString().slice(0, 10);
}

/**
 * Stopaj dilimi (2006/10731 BKK): "6 aya kadar" (6 ay dahil), "1 yıla kadar", "1 yıldan uzun".
 * Dilimler takvim ayıyla tanımlandığı için vade sonu, açılıştan 6 / 12 takvim ayı sonrasıyla karşılaştırılır
 * (gün sayısının 181–184 arasında değişmesi sorununu ortadan kaldırır).
 */
export function stopajDilimi(acilis: string, vadeSonu: string): StopajDilimi {
  if (vadeSonu <= addMonths(acilis, 6)) return 'alti6';
  if (vadeSonu <= addMonths(acilis, 12)) return 'yil1';
  return 'uzun';
}

function donemHesapla(anapara: number, oran: number, gun: number, acilis: string) {
  const vadeSonu = addDays(acilis, gun);
  const dilim = stopajDilimi(acilis, vadeSonu);
  const s = valueAt(mevduatStopaj, acilis);
  const stopajOran = dilim === 'alti6' ? s.alti6Ay : dilim === 'yil1' ? s.bir1Yil : s.uzun;
  const brutFaiz = round2((anapara * (oran / 100) * gun) / 365);
  const stopaj = round2(brutFaiz * stopajOran);
  const netFaiz = round2(brutFaiz - stopaj);
  return { vadeSonu, dilim, stopajOran, brutFaiz, stopaj, netFaiz };
}

/**
 * Vadeli TL mevduat: brüt faiz = anapara × yıllık oran × gün / 365 (TL mevduatta 365 gün esası).
 * Stopaj oranı, hesabın açılış/yenileme tarihinde geçerli Cumhurbaşkanı Kararından ve vade diliminden okunur.
 */
export function calculateMevduat(input: MevduatValues): MevduatResult {
  const d = donemHesapla(input.anapara, input.oran, input.gun, input.acilis);
  const result: MevduatResult = {
    ...d,
    vadeSonuTutar: round2(input.anapara + d.netFaiz),
    netYillik: (d.netFaiz / input.anapara) * (365 / input.gun),
  };
  if (!input.yenile) return result;

  const donemler: MevduatDonem[] = [];
  let bakiye = input.anapara;
  let acilis = input.acilis;
  for (let i = 1; i <= input.donem; i++) {
    const p = donemHesapla(bakiye, input.oran, input.gun, acilis);
    const yeni = round2(bakiye + p.netFaiz);
    donemler.push({ donem: i, acilis, anapara: bakiye, ...p, bakiye: yeni });
    bakiye = yeni;
    acilis = p.vadeSonu;
  }
  const toplamGun = input.gun * input.donem;
  return {
    ...result,
    donemler,
    toplamNetFaiz: round2(bakiye - input.anapara),
    sonBakiye: bakiye,
    efektifYillik: (bakiye / input.anapara) ** (365 / toplamGun) - 1,
  };
}
