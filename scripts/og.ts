/** Open Graph görseli (1200×630) ve logo/favicon üretimi — satori (SVG) + resvg (PNG). */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const fontDir = path.resolve(import.meta.dirname, '../node_modules/@fontsource/inter/files');
const font = (subset: string, weight: 400 | 700) => ({
  name: 'Inter',
  data: readFileSync(path.join(fontDir, `inter-${subset}-${weight}-normal.woff`)),
  weight,
  style: 'normal' as const,
});
const fonts = [font('latin', 400), font('latin', 700), font('latin-ext', 400), font('latin-ext', 700)];

const C = { primary: '#1663a3', result: '#0b7a55', bg: '#f4f7fb', ink: '#132a42', muted: '#556b82', white: '#ffffff' };

/** Logo ikonu (src/components/layout/Logo.tsx ile aynı geometri, sabit renkler) */
export function logoSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="9" fill="${C.primary}"/><rect x="8" y="10.5" width="16" height="3.2" rx="1.6" fill="#fff"/><rect x="8" y="18.3" width="10" height="3.2" rx="1.6" fill="#fff"/><circle cx="22.4" cy="19.9" r="2.2" fill="#4fd1a0"/></svg>`;
}

export function iconPng(size: number): Buffer {
  return new Resvg(logoSvg(), { fitTo: { mode: 'width', value: size } }).render().asPng();
}

type El = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, children?: unknown): El => ({
  type,
  props: { style, children },
});

export async function ogImage(title: string, subtitle: string): Promise<Buffer> {
  const logo = `data:image/svg+xml;base64,${Buffer.from(logoSvg()).toString('base64')}`;
  const tree = h(
    'div',
    {
      width: 1200,
      height: 630,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '72px 80px',
      background: `linear-gradient(135deg, ${C.bg} 0%, #e3eef9 100%)`,
      fontFamily: 'Inter',
    },
    [
      h('div', { display: 'flex', alignItems: 'center', gap: 20 }, [
        { type: 'img', props: { src: logo, width: 72, height: 72 } },
        h('div', { display: 'flex', fontSize: 44, color: C.ink }, [
          h('span', { fontWeight: 700 }, 'Net'),
          h('span', { fontWeight: 400, color: C.primary }, 'Göster'),
        ]),
      ]),
      h('div', { display: 'flex', flexDirection: 'column', gap: 18 }, [
        h(
          'div',
          { fontSize: title.length > 28 ? 68 : 80, fontWeight: 700, color: C.ink, lineHeight: 1.08, letterSpacing: -2 },
          title,
        ),
        h('div', { fontSize: 34, color: C.muted }, subtitle),
      ]),
      h('div', { display: 'flex', alignItems: 'center', gap: 14 }, [
        h('div', { width: 18, height: 18, borderRadius: 9, background: C.result }, ''),
        h('div', { fontSize: 28, color: C.primary, fontWeight: 700 }, 'netgoster.com'),
      ]),
    ],
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const svg = await satori(tree as any, { width: 1200, height: 630, fonts });
  return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
}
