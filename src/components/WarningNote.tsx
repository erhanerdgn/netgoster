import { Info } from 'lucide-react';
import { warnings, type WarningType } from '@/tools.registry';

export function WarningNote({ type }: { type: WarningType }) {
  if (type === 'yok') return null;
  return (
    <p
      role="note"
      className="flex items-start gap-2.5 rounded-xl border border-warning/30 bg-warning-soft px-4 py-3 text-sm text-foreground"
    >
      <Info className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
      <span>
        <strong className="font-semibold">Uyarı: </strong>
        {warnings[type]}
      </span>
    </p>
  );
}
