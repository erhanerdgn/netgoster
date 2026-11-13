import { Link } from 'react-router';
import { ArrowUpRight, Bookmark } from 'lucide-react';
import { cn } from 'cn';
import { categoryById, type Tool } from '@/tools.registry';
import { kpiFor } from '@/lib/toolKpi';
import { toggleFavorite } from '@/lib/storage';
import { useLibrary } from '@/hooks/useLibrary';
import { Button } from '@/components/ui/button';

export function FavoriteButton({ slug, name }: { slug: string; name: string }) {
  const { favorites } = useLibrary();
  const active = favorites.includes(slug);
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-pressed={active}
      aria-label={`${name}: ${active ? 'favorilerden çıkar' : 'favorilere ekle'}`}
      title={active ? 'Favorilerden çıkar' : 'Favorilere ekle'}
      onClick={() => toggleFavorite(slug)}
    >
      <Bookmark className={cn(active && 'fill-primary text-primary')} />
    </Button>
  );
}

/** `inCategory`: kategori sayfasında kategori adı yerine aracın ikonu gösterilir (tekrarı önler). */
export function ToolCard({ tool, compact, inCategory }: { tool: Tool; compact?: boolean; inCategory?: boolean }) {
  const Icon = tool.icon;
  if (compact) {
    return (
      <div className={cn('tool-card group relative flex rounded-2xl border', `tone-${tool.category}`)}>
        <Link to={`/${tool.slug}`} className="flex min-w-0 flex-1 items-center gap-3 p-4 pr-12">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--tone-soft)] text-[var(--tone)]">
            <Icon className="size-5" aria-hidden />
          </span>
          <span className="font-semibold leading-snug text-foreground">{tool.title}</span>
        </Link>
        <div className="absolute top-1/2 right-2 -translate-y-1/2">
          <FavoriteButton slug={tool.slug} name={tool.name} />
        </div>
      </div>
    );
  }
  const kpi = kpiFor(tool.slug);
  const category = categoryById.get(tool.category);
  return (
    <div className={cn('tool-card group relative flex overflow-hidden rounded-[1.375rem] border', `tone-${tool.category}`)}>
      <Link to={`/${tool.slug}`} className="flex min-h-52 min-w-0 flex-1 flex-col p-5">
        <span className="flex items-center gap-2 pr-10">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--tone-soft)] text-[var(--tone)]">
            <Icon className="size-5" aria-hidden />
          </span>
          {tool.isNew && (
            <span className="rounded-full bg-[var(--tone)] px-2 py-0.5 text-[10px] font-bold text-[var(--tone-ink)]">YENİ</span>
          )}
        </span>
        <span className="mt-4 block text-lg leading-snug font-bold tracking-tight text-foreground">{tool.title}</span>
        {kpi ? (
          <span className="mt-2 block">
            <span className="tabular block text-2xl leading-tight font-extrabold tracking-tight text-[var(--tone)]">
              {kpi.value}
            </span>
            <span className="mt-0.5 block text-xs text-muted-foreground">{kpi.caption}</span>
          </span>
        ) : (
          <span className="mt-2 line-clamp-2 block text-sm leading-relaxed text-muted-foreground">{tool.lead}</span>
        )}
        <span className="mt-auto flex items-center justify-between gap-3 pt-4">
          <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
            {!inCategory && category?.name}
          </span>
          <span
            className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[var(--tone)] text-[var(--tone-ink)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden
          >
            <ArrowUpRight className="size-[1.1rem]" />
          </span>
        </span>
      </Link>
      <div className="absolute top-2.5 right-2.5">
        <FavoriteButton slug={tool.slug} name={tool.name} />
      </div>
    </div>
  );
}
