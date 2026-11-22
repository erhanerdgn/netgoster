import { useState } from 'react';
import { Check, Code2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GOM_ONEK, gommeKodu } from '@/lib/embed';

/**
 * "Bu hesaplayıcıyı sitenize ekleyin" — gömme kodu. Kapalı başlar, sayfanın akışını bozmaz.
 * Kodun içindeki bağlantı ev sahibi sitede kalır ve netgoster'e bağımsız backlink olur
 * (ayrıntı: lib/embed.ts).
 */
export function EmbedCode({ slug, name }: { slug: string; name: string }) {
  const [kopyalandi, setKopyalandi] = useState(false);
  const kod = gommeKodu(slug, name);

  const kopyala = async () => {
    try {
      await navigator.clipboard.writeText(kod);
      setKopyalandi(true);
      setTimeout(() => setKopyalandi(false), 2000);
    } catch {
      /* pano izni yoksa kullanıcı metin kutusundan kendisi kopyalar */
    }
  };

  return (
    <details className="group rounded-2xl border bg-card px-5 py-4" data-no-print>
      <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold [&::-webkit-details-marker]:hidden">
        <Code2 className="size-4 text-primary" aria-hidden />
        Bu hesaplayıcıyı sitenize ekleyin
        <span className="ml-auto text-xs font-normal text-muted-foreground group-open:hidden">Ücretsiz · kod göster</span>
      </summary>
      <div className="mt-3 space-y-3">
        <p className="text-sm text-muted-foreground">
          Blogunuza, kurumsal sitenize ya da müşteri bilgilendirme sayfanıza ücretsiz ekleyebilirsiniz. Kodu kopyalayıp sayfanızın
          HTML bölümüne yapıştırın. Reklam içermez, ziyaretçi bilgisi toplamaz; hesaplama tarayıcıda yapılır ve oranlar biz
          güncelledikçe sizin sayfanızda da güncellenir.
        </p>
        <label htmlFor={`gom-${slug}`} className="sr-only">
          {name} gömme kodu
        </label>
        <textarea
          id={`gom-${slug}`}
          readOnly
          value={kod}
          rows={5}
          onFocus={(e) => e.currentTarget.select()}
          className="w-full resize-none rounded-lg border bg-muted/40 p-3 font-mono text-xs leading-relaxed"
        />
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" size="sm" onClick={kopyala}>
            {kopyalandi ? <Check aria-hidden /> : <Copy aria-hidden />}
            {kopyalandi ? 'Kopyalandı' : 'Kodu kopyala'}
          </Button>
          <a
            href={`${GOM_ONEK}${slug}`}
            target="_blank"
            rel="noopener"
            className="text-sm text-primary underline underline-offset-4"
          >
            Önizle
          </a>
          <span className="text-xs text-muted-foreground">
            Yükseklik içeriğe göre ayarlanır; betik silinirse sabit kalır, <code>height</code> değerini değiştirebilirsiniz.
          </span>
        </div>
      </div>
    </details>
  );
}
