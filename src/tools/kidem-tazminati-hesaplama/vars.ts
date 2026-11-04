import { calculateKidem, kidemSchema } from '../../calculators/kidem.ts';
import { addDays } from '../../calculators/common.ts';
import { exampleVars } from '../../content/vars.ts';

/** content.md örnekleri: tarihler derleme gününe göre kayar, her zaman güncel tavanla hesaplanır. */
export default function vars(today: string) {
  const y = Number(today.slice(0, 4));
  const k = (v: object) => calculateKidem(kidemSchema.parse(v));
  return {
    ...exampleVars('kidem.ornek1', k({ giris: `${y - 5}-03-01`, cikis: `${y}-02-28`, brut: 40000 })),
    ...exampleVars('kidem.ornek2', k({ giris: addDays(`${y - 10}-${today.slice(5)}`, 1), cikis: today, brut: 100000 })),
    ...exampleVars('kidem.ornek3', k({ giris: `${y - 2}-01-10`, cikis: `${y}-05-24`, brut: 30000, yanHaklar: 3000 })),
  };
}
