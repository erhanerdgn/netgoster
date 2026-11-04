import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import type { Tool } from '@/tools.registry';

export function ToolCard({ tool, compact }: { tool: Tool; compact?: boolean }) {
  const Icon = tool.icon;
  return (
    <Link
      to={`/${tool.slug}`}
      className="group flex min-h-11 items-start gap-3 rounded-2xl border bg-card p-4 shadow-soft transition-colors hover:border-primary/40 hover:bg-accent/40"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
        <Icon className="size-5" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2 font-semibold text-foreground">
          {tool.title}
          <ArrowRight
            className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
            aria-hidden
          />
        </span>
        {!compact && <span className="mt-1 line-clamp-2 block text-sm text-muted-foreground">{tool.lead}</span>}
      </span>
    </Link>
  );
}
