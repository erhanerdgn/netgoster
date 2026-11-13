import { cevir, indirmeSuresi, mdTablo, sayiTR, sureTR } from '../../calculators/birim.ts';

const v = (x: number, k: string, h: string, a = 7) => sayiTR(cevir('veri', x, k, h), a);
const sure = (x: number, k: string, mbps: number) => sureTR(indirmeSuresi(cevir('veri', x, k, 'B'), mbps));

export default function vars() {
  const hizlar = [16, 50, 100, 1000];
  return {
    'veri.tbGib': v(1, 'TB', 'GiB', 5),
    'veri.tbTib': v(1, 'TB', 'TiB', 4),
    'veri.tbKayip': sayiTR((1 - cevir('veri', 1, 'TB', 'TiB')) * 100, 3),
    'veri.gibGb': v(1, 'GiB', 'GB', 10),
    'veri.gibB': v(1, 'GiB', 'B', 12),
    'veri.500Gib': v(500, 'GB', 'GiB', 5),
    'veri.256Gib': v(256, 'GB', 'GiB', 5),
    'veri.2tbGib': v(2, 'TB', 'GiB', 6),
    'veri.2tbTib': v(2, 'TB', 'TiB', 3),
    'veri.100mbps': sayiTR(100 / 8),
    'veri.5gb100': sure(5, 'GB', 100),
    'veri.5gb100sn': sayiTR(indirmeSuresi(5e9, 100)),
    'veri.5gbBit': sayiTR(cevir('veri', 5, 'GB', 'bit') / 1e6),
    'veri.5gb100ger': sureTR(indirmeSuresi(5e9, 100) / 0.9),
    'veri.5gb1000': sure(5, 'GB', 1000),
    'veri.50gb1000': sure(50, 'GB', 1000),
    'veri.tablo.disk': mdTablo(
      ['Etiketteki kapasite', 'Windows’ta görünen', 'Fark'],
      (
        [
          [128, 'GB', 'GiB'],
          [256, 'GB', 'GiB'],
          [512, 'GB', 'GiB'],
          [1, 'TB', 'GiB'],
          [2, 'TB', 'TiB'],
          [4, 'TB', 'TiB'],
        ] as const
      ).map(([x, k, h]) => [
        `${x} ${k}`,
        `${new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 2 }).format(cevir('veri', x, k, h))} ${h.replace('i', '')}`,
        // Etiketteki birimle aynı basamaktaki ikili birime göre "kayıp" oranı: 1 − 1000ⁿ ÷ 1024ⁿ
        `%${sayiTR((1 - cevir('veri', 1, k, `${k[0]}iB`)) * 100, 3)}`,
      ]),
    ),
    'veri.tablo.birim': mdTablo(
      ['SI (ondalık)', 'Bayt', 'IEC (ikili)', 'Bayt'],
      ['k', 'M', 'G', 'T', 'P'].map((p, i) => [
        `1 ${p}B`,
        (1000n ** BigInt(i + 1)).toLocaleString('tr-TR'),
        `1 ${p.toUpperCase()}iB`,
        (1024n ** BigInt(i + 1)).toLocaleString('tr-TR'),
      ]),
    ),
    'veri.tablo.indirme': mdTablo(
      ['Dosya', ...hizlar.map((h) => `${h.toLocaleString('tr-TR')} Mbps`)],
      (
        [
          [700, 'MB', '700 MB (film, düşük kalite)'],
          [5, 'GB', '5 GB (HD film)'],
          [50, 'GB', '50 GB (oyun)'],
          [100, 'GB', '100 GB (büyük oyun)'],
        ] as const
      ).map(([x, k, ad]) => [ad, ...hizlar.map((h) => sure(x, k, h))]),
    ),
  };
}
