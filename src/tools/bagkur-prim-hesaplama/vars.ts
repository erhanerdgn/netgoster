import { calculateBagkur } from '../../calculators/bagkur.ts';
import { sgkTabanTavan } from '../../config/parameters-2026.ts';
import { valueAt } from '../../config/period.ts';
import { exampleVars } from '../../content/vars.ts';

/** content.md örnekleri: derleme günündeki PEK sınırları ve prim oranlarıyla hesaplanır. */
export default function vars(today: string) {
  const { taban, tavan } = valueAt(sgkTabanTavan, today);
  const b = (kazanc: number) => calculateBagkur({ kazanc, indirim: true }, today);
  return {
    ...exampleVars('bk.alt', b(taban)),
    ...exampleVars('bk.ust', b(tavan)),
    ...exampleVars('bk.iki', b(taban * 2)),
  };
}
