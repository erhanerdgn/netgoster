import { calculateFazlaMesai, fazlaMesaiSchema } from '../../calculators/fazlaMesai.ts';
import { asgariUcret, DATA_YEAR, isKanunu } from '../../config/parameters-2026.ts';
import { valueAt } from '../../config/period.ts';
import { exampleVars, pct } from '../../content/vars.ts';

/** content.md örnekleri: parametre yılının Ocak ayı bordrosu üzerinden. */
export default function vars() {
  const y = DATA_YEAR;
  const k = isKanunu;
  const c = (v: object) => calculateFazlaMesai(fazlaMesaiSchema.parse({ yil: y, ...v }));
  const au = valueAt(asgariUcret, `${y}-01-01`).brutAylik;
  return {
    'fm.saat': String(k.aylikSaat),
    'fm.haftalik': String(k.haftalikAzami),
    'fm.yillik': String(k.yillikFazlaMesaiSiniri),
    'fm.zam': pct(k.fazlaMesaiZam),
    'fm.zamFs': pct(k.fazlaSurelerZam),
    'fm.carpan': String(1 + k.fazlaMesaiZam).replace('.', ','),
    'fm.carpanFs': String(1 + k.fazlaSurelerZam).replace('.', ','),
    ...exampleVars('fm.ornek1', c({ brut: 45000, fmSaat: 10, ay: '1' })),
    ...exampleVars('fm.ornek2', c({ brut: au, bayramGun: 2, ay: '1' })),
    ...exampleVars('fm.ornek3', c({ brut: 60000, fmSaat: 8, haftaTatiliGun: 1, ay: '1' })),
  };
}
