import { useNavigate } from 'react-router';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { categories, tools } from '@/tools.registry';
import { toolFilter } from '@/lib/search';

/** Ctrl/Cmd+K araç arama (shadcn Command). Tembel yüklenir — ana paketi büyütmez. */
export default function SearchDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const navigate = useNavigate();
  const go = (path: string) => {
    onOpenChange(false);
    navigate(path);
  };
  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      filter={toolFilter}
      title="Araç ara"
      description="Hesaplama aracı arayın"
    >
      <CommandInput placeholder="Hesaplama ara… (ör. kıdem, kredi, VKİ)" />
      <CommandList className="max-h-[60vh]">
        <CommandEmpty>Sonuç bulunamadı.</CommandEmpty>
        {categories.map((c) => (
          <CommandGroup key={c.id} heading={c.name}>
            {tools
              .filter((t) => t.category === c.id)
              .map((t) => (
                <CommandItem
                  key={t.slug}
                  value={`${t.title} ${t.keywords.join(' ')}`}
                  onSelect={() => go(`/${t.slug}`)}
                  className="min-h-11"
                >
                  <t.icon className="text-primary" aria-hidden />
                  {t.title}
                </CommandItem>
              ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
