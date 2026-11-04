import { Search } from 'lucide-react';
import { openSearch } from '@/components/layout/Header';
import { ToolCard } from '@/components/ToolCard';
import { popularTools } from '@/tools.registry';

export default function NotFoundPage() {
  return (
    <div className="container-page py-16">
      <p className="text-sm font-semibold text-primary">404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Aradığınız sayfa bulunamadı</h1>
      <p className="mt-3 max-w-xl text-lg text-muted-foreground">
        Bağlantı değişmiş ya da yanlış yazılmış olabilir. Aradığınız hesaplamayı aşağıdan bulabilirsiniz.
      </p>
      <button
        type="button"
        onClick={openSearch}
        className="mt-6 flex h-14 w-full max-w-xl items-center gap-3 rounded-2xl border-2 bg-card px-5 text-left text-muted-foreground hover:border-primary/50"
      >
        <Search className="size-5 text-primary" aria-hidden /> Hesaplama ara…
      </button>
      <h2 className="mt-12 text-xl font-semibold">Popüler araçlar</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {popularTools.slice(0, 9).map((t) => (
          <ToolCard key={t.slug} tool={t} compact />
        ))}
      </div>
    </div>
  );
}
