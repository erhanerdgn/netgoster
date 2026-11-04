import { existsSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { Marked, Renderer } from 'marked';
import { contentVars } from '../src/content/vars.ts';
import { todayISO } from '../src/config/period.ts';

/**
 * Araç içerik dosyası (content.md) derleyicisi.
 * - {{anahtar}} yer tutucuları src/content/vars.ts'deki GÜNCEL parametrelerle doldurulur (rakamlar elle yazılmaz).
 * - "<!-- sss -->" satırından sonrası SSS'dir: her "### Soru" başlığı + altındaki paragraf(lar) cevap.
 * - H2 başlıkları içindekiler listesine girer; gövde ortadaki H2'den ikiye bölünür (içerik ortası reklam).
 */
export function slugify(text: string): string {
  return text
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Değişkenler: genel (src/content/vars.ts) + varsa aracın kendi klasöründeki vars.ts
 * (`export default function vars(today: string): Record<string, string>`). Araç vars.ts dosyası Node ile
 * doğrudan yüklenir: yalnız göreli ve uzantılı ('.ts') import kullanmalıdır.
 */
async function loadVars(file: string): Promise<Record<string, string>> {
  const today = todayISO();
  const local = path.join(path.dirname(file), 'vars.ts');
  const own = existsSync(local) ? (await import(pathToFileURL(local).href + `?t=${Date.now()}`)).default(today) : {};
  return { ...contentVars(today), ...own };
}

function fill(md: string, file: string, vars: Record<string, string>): string {
  return md.replace(/\{\{\s*([\p{L}\p{N}_.]+)\s*\}\}/gu, (_, key: string) => {
    if (!(key in vars)) throw new Error(`${file}: bilinmeyen içerik değişkeni {{${key}}}`);
    return vars[key];
  });
}

export async function compileMarkdown(source: string, file = 'content.md') {
  const md = fill(source, file, await loadVars(file));
  const [bodyMd, faqMd = ''] = md.split(/^<!--\s*sss\s*-->\s*$/m);
  const toc: { id: string; text: string }[] = [];
  const marked = new Marked({ gfm: true });
  marked.use({
    renderer: {
      heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens);
        const id = slugify(text);
        if (depth === 2) toc.push({ id, text: text.replace(/<[^>]+>/g, '') });
        return `<h${depth} id="${id}">${text}</h${depth}>\n`;
      },
      table(token) {
        // Mobilde yatay kaydırma için sarmala
        const html = Renderer.prototype.table.call(this, token);
        return `<div class="overflow-x-auto" role="region" tabindex="0" aria-label="Tablo">${html}</div>`;
      },
    },
  });
  const bodyHtml = await marked.parse(bodyMd);
  // H2 sınırlarından böl: 3+ H2 → 2 parça (1 reklam), 7+ H2 → 3 parça (2 reklam). Reklamlar arası en az 2 bölüm.
  const h2s = [...bodyHtml.matchAll(/<h2 /g)].map((m) => m.index!);
  const parts = h2s.length >= 7 ? 3 : h2s.length >= 3 ? 2 : 1;
  const cuts = Array.from({ length: parts - 1 }, (_, i) => h2s[Math.round(((i + 1) * h2s.length) / parts)]);
  const body = [0, ...cuts].map((start, i) => bodyHtml.slice(start, cuts[i] ?? bodyHtml.length));
  const faqs: { q: string; a: string }[] = [];
  for (const block of faqMd.split(/^###\s+/m).slice(1)) {
    const nl = block.indexOf('\n');
    const q = block.slice(0, nl).trim();
    const a = (await new Marked({ gfm: true }).parse(block.slice(nl + 1).trim())).trim();
    if (q && a) faqs.push({ q, a });
  }
  const words = bodyMd
    .replace(/[#*|`>-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return { body, toc, faqs, words };
}
