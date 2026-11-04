import { describe, expect, it } from 'vitest';
import worker from './index.ts';
import { parseTcmb } from './rates.ts';

const env = { ASSETS: { fetch: async () => new Response('<html></html>', { headers: { 'Content-Type': 'text/html' } }) } };
const ctx = { waitUntil() {}, passThroughOnException() {} };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const call = (url: string) => worker.fetch(new Request(url), env as any, ctx as any);

describe('worker', () => {
  it('www → apex 301, yol ve sorgu korunur', async () => {
    const res = await call('https://www.netgoster.com/kdv-hesaplama?tutar=100');
    expect(res.status).toBe(301);
    expect(res.headers.get('location')).toBe('https://netgoster.com/kdv-hesaplama?tutar=100');
  });
  it('HTML yanıtına güvenlik ve kısa önbellek başlıkları', async () => {
    const res = await call('https://netgoster.com/kdv-hesaplama');
    expect(res.headers.get('x-content-type-options')).toBe('nosniff');
    expect(res.headers.get('cache-control')).toContain('max-age=0');
  });
  it('TCMB XML ayrıştırma (JPY Unit=100, boş efektif)', () => {
    const xml = `<Tarih_Date Tarih="03.11.2026" Date="11/03/2026" Bulten_No="2026/206">
<Currency CrossOrder="0" Kod="USD" CurrencyCode="USD"><Unit>1</Unit><Isim>ABD DOLARI</Isim><ForexBuying>49.9094</ForexBuying><ForexSelling>49.9993</ForexSelling><BanknoteBuying>49.8744</BanknoteBuying><BanknoteSelling>50.0743</BanknoteSelling></Currency>
<Currency CrossOrder="11" Kod="JPY" CurrencyCode="JPY"><Unit>100</Unit><Isim>JAPON YENİ</Isim><ForexBuying>32.1</ForexBuying><ForexSelling>32.3</ForexSelling><BanknoteBuying></BanknoteBuying><BanknoteSelling></BanknoteSelling></Currency></Tarih_Date>`;
    const r = parseTcmb(xml);
    expect(r.date).toBe('2026-11-03');
    expect(r.rates[1]).toMatchObject({ code: 'JPY', unit: 100, forexSelling: 32.3, banknoteBuying: null });
  });
});
