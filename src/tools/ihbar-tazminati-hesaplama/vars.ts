import { calculateIhbar, ihbarSchema } from '../../calculators/ihbar.ts';
import { isKanunu } from '../../config/parameters-2026.ts';
import { exampleVars } from '../../content/vars.ts';

/** content.md örnekleri: derleme yılına göre kayar, güncel vergi tarifesiyle hesaplanır. */
export default function vars(today: string) {
  const y = Number(today.slice(0, 4));
  const k = (v: object) => calculateIhbar(ihbarSchema.parse(v));
  const out: Record<string, string> = {
    ...exampleVars('ihbar.ornek1', k({ giris: `${y - 2}-02-01`, cikis: `${y}-04-30`, brut: 40000 })),
    ...exampleVars('ihbar.ornek2', k({ giris: `${y}-01-05`, cikis: `${y}-05-04`, brut: 30000 })),
    ...exampleVars(
      'ihbar.ornek3',
      k({ giris: `${y - 8}-03-01`, cikis: `${y}-09-30`, brut: 70000, yanHaklar: 5000, kumMatrah: 350000 }),
    ),
  };
  isKanunu.ihbarSureleri.forEach((s, i) => {
    out[`ihbar.hafta${i + 1}`] = String(s.hafta);
    out[`ihbar.gun${i + 1}`] = String(s.hafta * 7);
  });
  return out;
}
