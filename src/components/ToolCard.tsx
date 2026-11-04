import { Link } from 'react-router';
import { ArrowUpRight, Bookmark } from 'lucide-react';
import { cn } from 'cn';
import type { Tool } from '@/tools.registry';
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

export function ToolCard({ tool, compact }: { tool: Tool; compact?: boolean }) {
  const Icon = tool.icon;
  return (
    <div className="tool-card group relative flex rounded-2xl border bg-card">
      <Link to={`/${tool.slug}`} className="flex min-w-0 flex-1 items-start gap-3 p-5 pr-12">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
          <Icon className="size-5" aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold leading-snug text-foreground group-hover:text-primary">{tool.title}</span>
          {!compact && <span className="mt-2 line-clamp-2 block text-sm leading-relaxed text-muted-foreground">{tool.lead}</span>}
          {!compact && (
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary">
              Hesaplamaya başla <ArrowUpRight className="size-3.5" aria-hidden />
            </span>
          )}
        </span>
      </Link>
      <div className="absolute top-2 right-2">
        <FavoriteButton slug={tool.slug} name={tool.name} />
      </div>
    </div>
  );
}
