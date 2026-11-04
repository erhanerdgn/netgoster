import { calculateMevduat, mevduatSchema } from '../../calculators/mevduat.ts';
import { exampleVars, pct } from '../../content/vars.ts';

/** content.md örnekleri: açılış tarihi derleme günüdür, stopaj o günün oranıyla hesaplanır. */
export default function vars(today: string) {
  const m = (v: object) => calculateMevduat(mevduatSchema.parse({ acilis: today, ...v }));
  const o1 = m({ anapara: 100000, oran: 40, gun: 32 });
  const o2 = m({ anapara: 500000, oran: 38, gun: 365 });
  const o3 = m({ anapara: 100000, oran: 40, gun: 92, yenile: true, donem: 4 });
  const o4 = m({ anapara: 100000, oran: 40, gun: 365 });
  return {
    ...exampleVars('mevduat.o1', o1),
    'mevduat.o1.stopajOran': pct(o1.stopajOran),
    'mevduat.o1.netYillik': pct(o1.netYillik),
    ...exampleVars('mevduat.o2', o2),
    'mevduat.o2.stopajOran': pct(o2.stopajOran),
    'mevduat.o2.netYillik': pct(o2.netYillik),
    ...exampleVars('mevduat.o3', o3),
    'mevduat.o3.efektif': pct(o3.efektifYillik!),
    ...exampleVars('mevduat.o4', o4),
    'mevduat.o4.netYillik': pct(o4.netYillik),
  };
}
