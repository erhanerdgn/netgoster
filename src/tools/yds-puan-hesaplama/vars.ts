import { calculateYds } from '../../calculators/yds.ts';
import { yds } from '../../config/sinavlar.ts';

const f = (n: number, d = 2) => new Intl.NumberFormat('tr-TR', { maximumFractionDigits: d }).format(n);

export default function vars(): Record<string, string> {
  const out: Record<string, string> = {
    'yds.soru': String(yds.questions),
    'yds.katsayi': f(yds.perCorrect),
    'yds.kaynak': yds.source,
  };
  // Seviye tablosu: puan aralığı ve gereken en az doğru
  const rows = yds.levels.map((l, i) => {
    const ust = i === 0 ? 100 : yds.levels[i - 1].min;
    const minDogru = Math.ceil(l.min / yds.perCorrect - 1e-9);
    return `| ${l.level} | ${f(l.min)} – ${i === 0 ? '100' : f(ust - 0.01)} | ${minDogru} |`;
  });
  out['yds.seviyeTablosu'] = ['| Seviye | Puan aralığı | En az doğru |', '| --- | --- | ---: |', ...rows].join('\n');
  out['yds.seviyeMetni'] = yds.levels
    .map((l, i) => `${f(l.min)}–${i === 0 ? '100' : f(yds.levels[i - 1].min - 0.01)} puan ${l.level}`)
    .join(', ');
  out['yds.o63.puan'] = f(calculateYds({ dogru: 63 }).puan);
  for (const l of yds.levels) out[`yds.puan.${l.level}`] = f(l.min);
  for (const l of yds.levels) out[`yds.min.${l.level}`] = String(Math.ceil(l.min / yds.perCorrect - 1e-9));
  for (const d of [64, 39, 57]) {
    const r = calculateYds({ dogru: d });
    out[`yds.o${d}.puan`] = f(r.puan);
    out[`yds.o${d}.seviye`] = r.seviye ?? 'seviye yok';
    if (r.sonrakiIcin) out[`yds.o${d}.eksik`] = String(r.sonrakiIcin.dogru);
  }
  return out;
}
