import { calculateIssizlik, issizlikSchema } from '../../calculators/issizlik.ts';
import { issizlikOdenegi } from '../../config/parameters-2026.ts';
import { valueAt } from '../../config/period.ts';
import { exampleVars, pct } from '../../content/vars.ts';

/** content.md örnekleri: derleme günündeki asgari ücret tavanıyla. */
export default function vars(today: string) {
  const c = (v: object) => calculateIssizlik(issizlikSchema.parse({ tarih: today, ...v }));
  const p = valueAt(issizlikOdenegi, today);
  const out: Record<string, string> = {
    ...exampleVars('iss.ornek1', c({ yontem: 'ortalama', ortalama: 40000, primGun: 700 })),
    ...exampleVars('iss.ornek2', c({ k1: 95000, k2: 95000, k3: 100000, k4: 110000, primGun: 1080 })),
    ...exampleVars('iss.ornek3', c({ yontem: 'ortalama', ortalama: 60000, primGun: 950 })),
    'iss.sonGun': String(p.sonGunSarti),
    'iss.tavanOrani': pct(p.tavanOrani),
  };
  p.sureler.forEach(([prim, gun], i) => {
    out[`iss.prim${i + 1}`] = String(prim);
    out[`iss.gun${i + 1}`] = String(gun);
    out[`iss.ay${i + 1}`] = String(gun / 30);
  });
  return out;
}
