import { describe, expect, it } from 'vitest';
import {
  calculateRakamYazi,
  rakamYaziSchema,
  sayiCoz,
  sayiyaCevir,
  tamSayiKelimeleri,
  type RakamYaziInput,
} from './rakamYazi.ts';

const yaz = (sayi: string, v: Partial<RakamYaziInput> = {}) =>
  calculateRakamYazi(rakamYaziSchema.parse({ sayi, yazim: 'ayri', birim: 'TL', harf: 'kucuk', ...v }));
const kelime = (n: bigint) => tamSayiKelimeleri(n).join(' ');

describe('tam sayı okunuşu', () => {
  it.each([
    [0n, 'sıfır'],
    [1n, 'bir'],
    [10n, 'on'],
    [11n, 'on bir'],
    [100n, 'yüz'], // "bir yüz" değil
    [101n, 'yüz bir'],
    [1000n, 'bin'], // "bir bin" değil
    [1001n, 'bin bir'],
    [1100n, 'bin yüz'],
    [2026n, 'iki bin yirmi altı'],
    [11000n, 'on bir bin'], // 11 binde "bir" kalır
    [101000n, 'yüz bir bin'],
    [1000000n, 'bir milyon'], // milyonda "bir" yazılır
    [1001000n, 'bir milyon bin'],
    [2000001n, 'iki milyon bir'],
    [1000000000n, 'bir milyar'],
    [12000000000000n, 'on iki trilyon'],
    [1000000000000000n, 'bir katrilyon'],
    [
      999999999999999999999n,
      'dokuz yüz doksan dokuz kentilyon dokuz yüz doksan dokuz katrilyon dokuz yüz doksan dokuz trilyon dokuz yüz doksan dokuz milyar dokuz yüz doksan dokuz milyon dokuz yüz doksan dokuz bin dokuz yüz doksan dokuz',
    ],
  ])('%s → %s', (n, beklenen) => expect(kelime(n)).toBe(beklenen));
});

describe('girdi ayrıştırma', () => {
  it('Türkçe, İngilizce ve düz biçimler', () => {
    expect(sayiCoz('12.450,50')).toEqual({ negatif: false, tam: '12450', kesir: '50' });
    expect(sayiCoz('12450,5')).toEqual({ negatif: false, tam: '12450', kesir: '5' });
    expect(sayiCoz('12,450.50')).toEqual({ negatif: false, tam: '12450', kesir: '50' });
    expect(sayiCoz('12450.5')).toEqual({ negatif: false, tam: '12450', kesir: '5' });
    expect(sayiCoz(' 1 250 000 TL ')).toEqual({ negatif: false, tam: '1250000', kesir: '' });
    expect(sayiCoz('₺0,75')).toEqual({ negatif: false, tam: '0', kesir: '75' });
    expect(sayiCoz('-007')).toEqual({ negatif: true, tam: '7', kesir: '' });
  });
  it('tek nokta + üç rakam binlik ayraçtır; "0.125" ondalıktır', () => {
    expect(sayiCoz('1.500')).toEqual({ negatif: false, tam: '1500', kesir: '' });
    expect(sayiCoz('0.125')).toEqual({ negatif: false, tam: '0', kesir: '125' });
    expect(sayiCoz('1.5')).toEqual({ negatif: false, tam: '1', kesir: '5' });
  });
  it('hatalı girişler', () => {
    expect(sayiCoz('abc')).toHaveProperty('hata');
    expect(sayiCoz('')).toHaveProperty('hata');
    expect(sayiCoz('1.2.3')).toHaveProperty('hata'); // gruplar üçerli değil
    expect(sayiCoz('1,5,0.2')).toHaveProperty('hata'); // ondalık ayraç tamda da var
    expect(sayiCoz('1'.repeat(22))).toHaveProperty('hata'); // 22 basamak
    expect(rakamYaziSchema.safeParse({ sayi: '12a', yazim: 'ayri', birim: 'TL', harf: 'kucuk' }).success).toBe(false);
  });
  it('sayıya çevirme', () => {
    expect(sayiyaCevir('3,5')).toBe(3.5);
    expect(sayiyaCevir('-1.234,25')).toBe(-1234.25);
    expect(sayiyaCevir('x')).toBeUndefined();
  });
});

describe('TL yazımı', () => {
  it('12.450,50 → TDK ayrı ve çek/senet bitişik yazım', () => {
    const r = yaz('12.450,50', { harf: 'cumle' });
    expect(r.ayri).toBe('On iki bin dört yüz elli Türk lirası elli kuruş');
    expect(r.cek).toBe('Yalnız onikibindörtyüzelli TL elli Kr.');
    expect(r.rakam).toBe('12.450,50 TL');
    expect(r.metin).toBe(r.ayri);
    expect(yaz('12.450,50', { yazim: 'cek' }).metin).toBe(r.cek);
  });
  it('sıfır ve yalnız kuruş', () => {
    expect(yaz('0').metin).toBe('sıfır Türk lirası');
    expect(yaz('0,01').metin).toBe('bir kuruş');
    expect(yaz('0,99').metin).toBe('doksan dokuz kuruş');
    expect(yaz('0,99', { yazim: 'cek' }).metin).toBe('Yalnız doksandokuz Kr.');
  });
  it('kuruş yuvarlama: üçüncü ondalık 5 ve üzeri yukarı', () => {
    // 0,995 → 99 kuruş + 1 = 100 kuruş = 1 TL
    const r = yaz('0,995');
    expect(r.metin).toBe('bir Türk lirası');
    expect(r.yuvarlandi).toBe(true);
    // 1,005 kayan noktada 1,00499… olur; metinle yuvarlandığı için 1,01
    expect(yaz('1,005').rakam).toBe('1,01 TL');
    expect(yaz('1,004').rakam).toBe('1,00 TL');
    expect(yaz('2,50').yuvarlandi).toBe(false);
    expect(yaz('2,500').yuvarlandi).toBe(false); // sondaki sıfır değeri değiştirmez
  });
  it('negatif → eksi; eksi sıfır yazılmaz', () => {
    expect(yaz('-10').metin).toBe('eksi on Türk lirası');
    expect(yaz('-10').rakam).toBe('−10,00 TL');
    expect(yaz('-0,001').metin).toBe('sıfır Türk lirası');
  });
  it('harf biçimleri', () => {
    expect(yaz('1100', { harf: 'buyuk' }).metin).toBe('BİN YÜZ TÜRK LİRASI');
    expect(yaz('12450,5', { harf: 'kelime', yazim: 'cek' }).metin).toBe('Yalnız OnİkiBinDörtYüzElli TL Elli Kr.');
    expect(yaz('11', { harf: 'cumle' }).metin).toBe('On bir Türk lirası');
  });
  it('dolar ve avro', () => {
    expect(yaz('100,25', { birim: 'USD' }).metin).toBe('yüz dolar yirmi beş sent');
    expect(yaz('1.000.000', { birim: 'EUR', yazim: 'cek' }).metin).toBe('Yalnız birmilyon EUR');
  });
});

describe('sadece sayı', () => {
  it('ondalık "virgül" ile yazıldığı gibi okunur', () => {
    expect(yaz('3,05', { birim: 'sayi' }).metin).toBe('üç virgül sıfır beş');
    expect(yaz('12,50', { birim: 'sayi' }).metin).toBe('on iki virgül elli');
    expect(yaz('7,000', { birim: 'sayi' }).metin).toBe('yedi'); // yalnız sıfırlı kesir atılır
    expect(yaz('2026', { birim: 'sayi', harf: 'cumle' }).metin).toBe('İki bin yirmi altı');
    expect(yaz('-0,5', { birim: 'sayi' }).metin).toBe('eksi sıfır virgül beş');
    expect(yaz('1.000.000.000.000.000', { birim: 'sayi' }).rakam).toBe('1.000.000.000.000.000');
  });
});
