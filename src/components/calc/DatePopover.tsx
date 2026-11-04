import { tr } from 'react-day-picker/locale';
import { Calendar } from '@/components/ui/calendar';

function toDate(iso?: string) {
  if (!iso) return undefined;
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}
function toISO(d: Date) {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export default function DatePopover({
  value,
  onSelect,
  fromYear,
  toYear,
}: {
  value?: string;
  onSelect: (iso: string) => void;
  fromYear: number;
  toYear: number;
}) {
  const selected = toDate(value);
  return (
    <Calendar
      mode="single"
      locale={tr}
      captionLayout="dropdown"
      startMonth={new Date(fromYear, 0)}
      endMonth={new Date(toYear, 11)}
      defaultMonth={selected}
      selected={selected}
      onSelect={(d) => d && onSelect(toISO(d))}
      formatters={{ formatMonthDropdown: (d) => d.toLocaleString('tr-TR', { month: 'short' }) }}
    />
  );
}
