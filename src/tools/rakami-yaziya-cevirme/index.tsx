import { useId } from 'react';
import { useFormContext } from 'react-hook-form';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { CalculatorLayout } from '@/components/calc/CalculatorLayout';
import { ChoiceField, FieldShell, SelectField } from '@/components/calc/fields';
import type { ResultView } from '@/components/calc/ResultCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { calculateRakamYazi, rakamYaziSchema, type RakamYaziInput, type RakamYaziValues } from '@/calculators/rakamYazi';
import { num } from '@/lib/format';
import content from './content.md';

const defaults: Partial<RakamYaziInput> = { sayi: '12.450,50', yazim: 'ayri', birim: 'TL', harf: 'cumle' };
const example: RakamYaziInput = { sayi: '2.750.000,75', yazim: 'cek', birim: 'TL', harf: 'cumle' };

function Kopyalanabilir({ satirlar }: { satirlar: { label: string; text: string }[] }) {
  const kopyala = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Kopyalandı', { description: text });
    } catch {
      toast.error('Kopyalanamadı');
    }
  };
  return (
    <section aria-label="Kopyalanabilir yazımlar" className="rounded-2xl border bg-card p-5 shadow-soft" data-no-print>
      <p className="text-sm font-semibold">Kopyalanabilir yazımlar</p>
      <ul className="mt-3 divide-y">
        {satirlar.map((s) => (
          <li key={s.label} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
              <p className="mt-0.5 text-[0.9375rem] break-words">{s.text}</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-10 shrink-0"
              aria-label={`${s.label}: kopyala`}
              onClick={() => kopyala(s.text)}
            >
              <Copy aria-hidden /> Kopyala
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function present(v: RakamYaziValues): ResultView {
  const r = calculateRakamYazi(v);
  const buyuk = calculateRakamYazi({ ...v, harf: 'buyuk' });
  const para = v.birim !== 'sayi';
  const basamak = r.tam.toString().length;
  return {
    main: { label: 'Yazıyla', value: r.metin, caption: r.rakam },
    status: r.yuvarlandi
      ? {
          tone: 'warn',
          text: `Girdiğiniz tutar iki ondalığa yuvarlandı (${r.rakam}): üçüncü ondalık 5 veya üzeriyse kuruş bir artar.`,
        }
      : undefined,
    rows: [
      { label: 'Rakamla', value: r.rakam },
      { label: 'Yazım biçimi', value: v.yazim === 'ayri' ? 'TDK: ayrı' : 'Çek/senet: bitişik' },
      { label: 'Tam kısmın basamak sayısı', value: num(basamak, 0), tone: 'muted' },
      ...(para && r.alt !== undefined
        ? [{ label: v.birim === 'TL' ? 'Kuruş' : 'Sent', value: String(r.alt).padStart(2, '0'), tone: 'muted' as const }]
        : []),
    ],
    notes: [
      'TDK kuralına göre sayılar ayrı yazılır (on iki bin); çek, senet ve fatura gibi para belgelerinde değiştirilmeyi önlemek için bitişik yazılır.',
    ],
    extra: (
      <Kopyalanabilir
        satirlar={[
          { label: 'TDK yazımı (ayrı)', text: r.ayri },
          { label: 'Çek / senet yazımı (bitişik)', text: r.cek },
          { label: 'Büyük harfle', text: v.yazim === 'ayri' ? buyuk.ayri : buyuk.cek },
        ]}
      />
    ),
  };
}

function SayiAlani() {
  const id = useId();
  const { register, getFieldState, formState } = useFormContext<RakamYaziInput>();
  const error = getFieldState('sayi', formState).error?.message;
  return (
    <FieldShell
      id={id}
      label="Sayı veya tutar"
      className="sm:col-span-2"
      error={error}
      hint="12.450,50 · 12450,50 · 12450.50 · 1 250 000 biçimleri kabul edilir. Tek nokta ve arkasından üç rakam (1.500) binlik ayraç sayılır."
      help="Yazıya çevirmek istediğiniz sayı. Binlik ayraç olarak nokta ya da boşluk, ondalık için virgül kullanın. 999 kentilyona (21 basamak) kadar sayılar kesin olarak çevrilir."
    >
      <Input
        id={id}
        {...register('sayi')}
        inputMode="decimal"
        autoComplete="off"
        placeholder="Örn. 12.450,50"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : `${id}-hint`}
        className="tabular text-base"
      />
    </FieldShell>
  );
}

export default function RakamiYaziyaCevirmePage() {
  return (
    <CalculatorLayout
      slug="rakami-yaziya-cevirme"
      schema={rakamYaziSchema}
      defaults={defaults}
      example={example}
      compute={present}
      content={content}
      emptyHint="Sayıyı ya da tutarı yazdığınız anda Türkçe okunuşu, çek/senet yazımıyla birlikte görünür."
      sources={[
        {
          label: 'TDK Yazım Kuralları: Sayıların Yazılışı',
          url: 'https://tdk.gov.tr/icerik/yazim-kurallari/sayilarin-yazilisi/',
        },
      ]}
    >
      <SayiAlani />
      <ChoiceField<RakamYaziInput>
        name="birim"
        label="Para birimi"
        className="sm:col-span-2"
        options={[
          { value: 'TL', label: 'TL' },
          { value: 'sayi', label: 'Sadece sayı' },
          { value: 'USD', label: 'Dolar' },
          { value: 'EUR', label: 'Avro' },
        ]}
        help="TL: Türk lirası ve kuruş. Dolar ve avroda küsurat “sent” olarak yazılır. Sadece sayı: para birimi eklenmez, ondalık kısım “virgül” ile okunur (3,05 → üç virgül sıfır beş)."
      />
      <ChoiceField<RakamYaziInput>
        name="yazim"
        label="Yazım biçimi"
        options={[
          { value: 'ayri', label: 'TDK (ayrı)' },
          { value: 'cek', label: 'Çek / senet' },
        ]}
        help="TDK (ayrı): on iki bin dört yüz elli. Çek / senet: rakamların arasına ekleme yapılamasın diye bitişik ve “Yalnız … TL … Kr.” kalıbıyla yazılır."
      />
      <SelectField<RakamYaziInput>
        name="harf"
        label="Harf biçimi"
        options={[
          { value: 'cumle', label: 'İlk harf büyük' },
          { value: 'kucuk', label: 'tümü küçük' },
          { value: 'buyuk', label: 'TÜMÜ BÜYÜK' },
          { value: 'kelime', label: 'Her Kelime Büyük' },
        ]}
        help="Çek ve senetlerde tümü büyük ya da her kelimenin baş harfi büyük yazım (OnİkiBin) okunurluğu artırır. Büyük harfe çevirmede Türkçe kuralı uygulanır: i → İ."
      />
    </CalculatorLayout>
  );
}
