import { Link } from 'react-router';
import { ArrowUpRight, BriefcaseBusiness, House, Landmark, GraduationCap } from 'lucide-react';

const paths = [
  {
    title: 'Maaşım ve haklarım',
    description: 'Net maaş, kıdem ve işsizlik ödeneği.',
    icon: BriefcaseBusiness,
    slug: 'brutten-nete-maas-hesaplama',
    links: [
      ['Kıdem tazminatı', 'kidem-tazminati-hesaplama'],
      ['İşsizlik maaşı', 'issizlik-maasi-hesaplama'],
    ],
    tone: 'work',
  },
  {
    title: 'Paramı planlıyorum',
    description: 'Kredi maliyetini ve birikimini karşılaştır.',
    icon: Landmark,
    slug: 'kredi-hesaplama',
    links: [
      ['Mevduat getirisi', 'mevduat-faizi-hesaplama'],
      ['Altın hesabı', 'altin-hesaplama'],
    ],
    tone: 'money',
  },
  {
    title: 'Evim ve giderlerim',
    description: 'Kira artışı, tapu ve ortak giderler.',
    icon: House,
    slug: 'kira-artis-hesaplama',
    links: [
      ['Tapu harcı', 'tapu-harci-hesaplama'],
      ['Aidat paylaşımı', 'aidat-hesaplama'],
    ],
    tone: 'home',
  },
  {
    title: 'Sınavım ve hedefim',
    description: 'Netlerini puana, notlarını ortalamaya çevir.',
    icon: GraduationCap,
    slug: 'yks-puan-hesaplama',
    links: [
      ['LGS puanı', 'lgs-puan-hesaplama'],
      ['Not ortalaması', 'universite-not-ortalamasi-hesaplama'],
    ],
    tone: 'study',
  },
];

export function IntentPaths() {
  return (
    <section aria-labelledby="ihtiyac">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">SİZİN İÇİN BİR BAŞLANGIÇ</p>
          <h2 id="ihtiyac" className="section-title mt-2">
            Bugün neyi netleştirelim?
          </h2>
        </div>
        <p className="text-sm text-muted-foreground">İhtiyacını seç, hesaplamaya geç.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {paths.map((p) => (
          <div key={p.slug} className={`intent-card intent-${p.tone} flex flex-col rounded-2xl border p-5`}>
            <Link to={`/${p.slug}`} className="group flex flex-1 flex-col items-start">
              <span className="intent-icon mb-6 flex size-12 items-center justify-center rounded-2xl">
                <p.icon className="size-6" aria-hidden />
              </span>
              <h3 className="flex w-full items-center justify-between gap-2 text-lg font-semibold">
                {p.title}
                <ArrowUpRight
                  className="size-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden
                />
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
            </Link>
            <div className="mt-5 flex flex-col gap-1 border-t pt-3">
              {p.links.map(([label, slug]) => (
                <Link
                  key={slug}
                  to={`/${slug}`}
                  className="flex min-h-10 items-center justify-between text-sm hover:text-primary"
                >
                  {label}
                  <ArrowUpRight className="size-3.5" aria-hidden />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
