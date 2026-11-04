import { calculateYuzde, yuzdeSchema } from '../../calculators/yuzde.ts';

const n = (v: number) => new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 2 }).format(v);

export default function vars() {
  const y = (v: object) => calculateYuzde(yuzdeSchema.parse({ yon: 'artir', ...v }));
  const artis = y({ mod: 'artir', x: 200, y: 20, yon: 'artir' });
  return {
    'yuzde.o1': n(y({ mod: 'yuzdesi', x: 250, y: 18 }).sonuc),
    'yuzde.o2a': n(y({ mod: 'degisim', x: 80, y: 100 }).sonuc),
    'yuzde.o2b': n(Math.abs(y({ mod: 'degisim', x: 100, y: 80 }).sonuc)),
    'yuzde.o3': n(y({ mod: 'kac', x: 45, y: 180 }).sonuc),
    'yuzde.o4': n(artis.sonuc),
    'yuzde.o4ters': n(Math.abs(artis.tersYuzde!)),
    'yuzde.o4geri': n(y({ mod: 'artir', x: artis.sonuc, y: 20, yon: 'azalt' }).sonuc),
    'yuzde.o5': n(y({ mod: 'degisim', x: -50, y: -25 }).sonuc),
  };
}
