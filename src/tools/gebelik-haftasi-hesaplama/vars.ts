import { addDays } from '../../calculators/common.ts';
import { calculateGebelik } from '../../calculators/gebelik.ts';
import { date } from '../../content/vars.ts';

/** content.md örnekleri: sabit SAT’ler, "bugün" = SAT + N gün olarak hesaplanır. */
export default function vars(today: string) {
  const y = today.slice(0, 4);
  const ex = (p: string, sat: string, dongu: number, gun: number) => {
    const r = calculateGebelik({ sat, dongu }, addDays(sat, gun));
    return {
      [`${p}.sat`]: date(sat),
      [`${p}.bugun`]: date(addDays(sat, gun)),
      [`${p}.hafta`]: `${r.hafta} hafta ${r.gunArti} gün`,
      [`${p}.trimester`]: String(r.trimester),
      [`${p}.tdt`]: date(r.tdt),
      [`${p}.kalan`]: String(r.kalanGun),
    };
  };
  return {
    ...ex('gb.a', `${y}-03-01`, 28, 100),
    ...ex('gb.b', `${y}-03-01`, 32, 100),
    ...ex('gb.c', `${y}-01-15`, 28, 200),
  };
}
