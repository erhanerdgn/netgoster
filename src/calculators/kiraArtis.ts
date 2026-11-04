import { z } from 'zod';
import { kira25Siniri, tufe, type TufeAy } from '../config/tufe.ts';
import { round2, zMoney } from './common.ts';

export const kiraArtisSchema = z
  .object({
    tur: z.enum(['konut', 'isyeri']),
    kira: zMoney('Mevcut aylık kira', { min: 1 }),
    /** Kira yenileme (yeni kira yılının başladığı) ayı "1"–"12" — seçim kutusu değeri olduğu için metin */
    ay: z.string({ error: 'Yenileme ayını seçin' }).regex(/^(1[0-2]|[1-9])$/, 'Yenileme ayını seçin'),
    yil: z.string({ error: 'Yenileme yılını seçin' }).regex(/^\d{4}$/, 'Yenileme yılını seçin'),
  })
  .refine((v) => `${v.yil}-${v.ay.padStart(2, '0')}` > tufe[0].ay, {
    path: ['yil'],
    message: `TÜFE verisi ${tufe[0].ay.slice(5)}.${tufe[0].ay.slice(0, 4)} sonrası için mevcut; daha yeni bir tarih seçin`,
  });

export type KiraArtisInput = z.input<typeof kiraArtisSchema>;
export type KiraArtisValues = z.output<typeof kiraArtisSchema>;

export interface KiraArtisResult {
  /** Yenileme ayı YYYY-MM */
  yenileme: string;
  /** Kuralın gerektirdiği veri ayı (yenilemeden önceki ay) */
  gerekenAy: string;
  /** Hesapta kullanılan veri ayı (gerekenAy yayımlanmadıysa en son açıklanan ay) */
  kullanilanAy: string;
  yayimlanmadi: boolean;
  /** TÜFE 12 aylık ortalama değişimi (yüzde) */
  tufeOrani: number;
  /** Uygulanan azami artış oranı (yüzde) */
  oran: number;
  sinir25: boolean;
  /** Yenileme ayı %25 sınırının son günü olan ayda (yalnız 1. gün yenilemeleri sınırlı) */
  sinir25SonGun: boolean;
  artis: number;
  yeniKira: number;
  yillikFark: number;
  /** Kullanılan aya kadar son 12 ayın TÜFE verisi */
  son12: TufeAy[];
}

const prevMonth = (y: number, m: number) => (m === 1 ? `${y - 1}-12` : `${y}-${String(m - 1).padStart(2, '0')}`);

/**
 * TBK md. 344: yenilenen kira dönemindeki artış, bir önceki kira yılında TÜFE'nin 12 aylık ortalamalara göre
 * değişimini geçemez. Uygulamada yenilemenin yapıldığı aydan ÖNCEKİ ayın verisi (ayın 3'ünde TÜİK açıklar) esas alınır.
 * Konutta 11.06.2022–01.07.2024 arasında yenilenen sözleşmelere %25 üst sınırı uygulanmıştır (7409/7456 s. K.).
 */
export function calculateKiraArtis(input: KiraArtisValues): KiraArtisResult {
  const yenileme = `${input.yil}-${input.ay.padStart(2, '0')}`;
  const gerekenAy = prevMonth(Number(input.yil), Number(input.ay));
  const idx = tufe.findIndex((t) => t.ay === gerekenAy);
  const i = idx === -1 ? tufe.length - 1 : idx;
  const veri = tufe[i];
  // %25 sınırı gün bazlıdır (01.07.2024 dahil). Ay seçiminde ayın tamamı aralıktaysa uygulanır;
  // yalnız ilk günü kapsanan son ay (Temmuz 2024) için ayrı uyarı verilir.
  const ayBasi = `${yenileme}-01`;
  const konut = input.tur === 'konut';
  const sinir25 = konut && ayBasi >= kira25Siniri.from && ayBasi < kira25Siniri.to && veri.ortalama12 > kira25Siniri.oran;
  const sinir25SonGun = konut && yenileme === kira25Siniri.to.slice(0, 7) && veri.ortalama12 > kira25Siniri.oran;
  const oran = sinir25 ? kira25Siniri.oran : veri.ortalama12;
  const artis = round2((input.kira * oran) / 100);
  return {
    yenileme,
    gerekenAy,
    kullanilanAy: veri.ay,
    yayimlanmadi: idx === -1,
    tufeOrani: veri.ortalama12,
    oran,
    sinir25,
    sinir25SonGun,
    artis,
    yeniKira: round2(input.kira + artis),
    yillikFark: round2(artis * 12),
    son12: tufe.slice(Math.max(0, i - 11), i + 1),
  };
}
