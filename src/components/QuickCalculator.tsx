import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowUpRight, Percent } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { calculateIndirim, indirimSchema } from '@/calculators/indirim';
import { tl } from '@/lib/format';

export function QuickCalculator() {
  const [price, setPrice] = useState('2500');
  const [rate, setRate] = useState('20');
  const parsed = indirimSchema.safeParse({
    mod: 'fiyat',
    fiyat: price === '' ? undefined : Number(price),
    oran: rate === '' ? undefined : Number(rate),
  });
  const result = parsed.success ? calculateIndirim(parsed.data) : null;
  const query = new URLSearchParams({ mod: 'fiyat', fiyat: price, oran: rate });
  return (
    <Card className="quick-calculator relative w-full max-w-md justify-self-end shadow-soft">
      <CardHeader>
        <CardDescription className="flex items-center gap-2">
          <Percent className="size-4" aria-hidden /> HEMEN DENE
        </CardDescription>
        <CardTitle>İndirim gerçekten ne kadar?</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="quick-price">Etiket fiyatı (₺)</Label>
            <Input
              id="quick-price"
              type="number"
              inputMode="decimal"
              min="0.01"
              step="any"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              aria-invalid={!result}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="quick-rate">İndirim (%)</Label>
            <Input
              id="quick-rate"
              type="number"
              inputMode="decimal"
              min="0"
              max="100"
              step="any"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              aria-invalid={!result}
            />
          </div>
        </div>
        <div className="mt-5 rounded-xl bg-result-soft p-5" aria-live="polite" aria-atomic="true">
          <p className="text-sm text-result">İndirimli fiyat</p>
          <p className="tabular mt-1 text-4xl font-bold tracking-tight">{result ? tl(result.indirimli) : '—'}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {result ? `${tl(result.indirim)} cebinizde kalır.` : 'Geçerli bir fiyat ve %0–100 arasında oran girin.'}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Link
          to={`/indirim-hesaplama${result ? `?${query}` : ''}`}
          className="flex min-h-11 w-full items-center justify-between gap-2 text-sm font-semibold text-primary"
        >
          Ardışık indirimleri de hesapla <ArrowUpRight className="size-4" aria-hidden />
        </Link>
      </CardFooter>
    </Card>
  );
}
