import { calculateVki } from '../../calculators/vki.ts';

const n1 = (x: number) => new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(x);

/** content.md örnekleri (tarihten bağımsız) */
export default function vars() {
  const ex = (p: string, boy: number, kilo: number) => {
    const r = calculateVki({ boy, kilo, cocuk: false });
    return {
      [`${p}.vki`]: n1(r.vki),
      [`${p}.sinif`]: r.sinif.ad.toLowerCase(),
      [`${p}.min`]: n1(r.saglikliMin),
      [`${p}.max`]: n1(r.saglikliMax),
      [`${p}.fark`]: n1(Math.abs(r.fark)),
    };
  };
  return { ...ex('vk.a', 165, 60), ...ex('vk.b', 180, 95), ...ex('vk.c', 155, 42) };
}
