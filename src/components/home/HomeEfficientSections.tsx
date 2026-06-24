import Link from 'next/link'

export type SiteStats = {
  toolCount: number
  reviewCount: number
  comparisonCount: number
  shortCount: number
  categoryCount: number
}

export default function HomeTrustBar({ stats }: { stats: SiteStats }) {
  const items = [
    { label: 'AI tools reviewed', value: stats.toolCount },
    { label: 'Expert articles', value: stats.reviewCount },
    { label: 'Side-by-side comparisons', value: stats.comparisonCount },
    { label: 'Viral AI films curated', value: stats.shortCount },
  ]

  return (
    <section className="border-y border-white/[0.06] bg-gray-950/80">
      <div className="container mx-auto max-w-7xl px-4 py-8 md:py-10">
        <p className="text-center text-sm text-gray-400 mb-6 max-w-2xl mx-auto">
          Independent, hands-on testing — no vague listicles. Know in 30 seconds if a tool fits
          your stack.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {items.map((item) => (
            <div
              key={item.label}
              className="text-center rounded-xl border border-white/[0.06] bg-white/[0.02] py-5 px-3"
            >
              <div className="text-2xl md:text-3xl font-bold text-white tabular-nums">
                {item.value}+
              </div>
              <div className="text-xs md:text-sm text-gray-500 mt-1">{item.label}</div>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-gray-600 mt-6">
          {stats.categoryCount} categories · Updated weekly with new AI releases and comparisons
        </p>
      </div>
    </section>
  )
}

const HUB_CARDS = [
  {
    title: 'Comparisons',
    description: 'Side-by-side guides — Runway vs Kling, ChatGPT vs Claude, and more.',
    href: '/compare',
    cta: 'Compare tools',
    accent: 'violet',
  },
  {
    title: 'Best categories',
    description: 'Browse by what you need: video, writing, coding, image, voice.',
    href: '/category',
    cta: 'Browse categories',
    accent: 'blue',
  },
  {
    title: 'Deals & guides',
    description: 'Hosting, SEO, and monetization picks we actually use.',
    href: '/reviews/best-ai-tools-make-money-online-2026',
    cta: 'See top guides',
    accent: 'amber',
  },
  {
    title: 'AI Short Films',
    description: 'Watch viral 2026 shorts — then jump to the tools behind each film.',
    href: '/ai-shorts',
    cta: 'Watch films',
    accent: 'pink',
  },
]

const accentMap: Record<string, string> = {
  violet: 'border-violet-500/20 hover:border-violet-500/40 bg-violet-500/5',
  blue: 'border-blue-500/20 hover:border-blue-500/40 bg-blue-500/5',
  amber: 'border-amber-500/20 hover:border-amber-500/40 bg-amber-500/5',
  pink: 'border-pink-500/20 hover:border-pink-500/40 bg-pink-500/5',
}

export function HomeExploreHub() {
  return (
    <section className="py-14 md:py-16 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-10">
          <span className="text-violet-400 text-xs font-semibold uppercase tracking-widest">
            Smarter decisions
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-white mt-2">
            Everything organized — no noise
          </h2>
          <p className="text-gray-400 text-sm mt-2 max-w-xl mx-auto">
            Curated stacks, comparisons, and categories. Like Efficient App — but focused on the
            AIGC creator economy.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {HUB_CARDS.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className={`group rounded-2xl border p-5 transition-all duration-200 hover:scale-[1.02] ${accentMap[card.accent]}`}
            >
              <h3 className="font-semibold text-white group-hover:text-violet-200 transition-colors">
                {card.title}
              </h3>
              <p className="text-sm text-gray-400 mt-2 leading-relaxed line-clamp-3">
                {card.description}
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-violet-400 mt-4 group-hover:gap-2 transition-all">
                {card.cta}
                <span aria-hidden>→</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

const OTHER_SITES = [
  'Pay to feature whoever bids highest',
  'Enterprise bloat with filler charts',
  'User-generated reviews with no testing',
  'Lists hundreds of mediocre tools',
]

const AIGC_ROOM = [
  'We test tools hands-on for real workflows',
  'Short lists — only what creators actually use',
  'Every comparison written by our team',
  'Highlight new models (Seedance, Veo, Kling)',
  'Never sell your data — clear affiliate disclosure',
]

export function HomeMethodology() {
  return (
    <section className="py-14 md:py-16 px-4 border-t border-white/[0.05]">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          <div>
            <span className="text-violet-400 text-xs font-semibold uppercase tracking-widest">
              How we review
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white mt-2 mb-4">
              We test everything so you don&apos;t have to
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Every review covers pricing, limitations, and who it&apos;s actually for — not
              marketing copy. We structure articles like Efficient App: quick snapshot, deep
              features, honest drawbacks, and clear picks.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors"
            >
              Read our methodology & disclosure
              <span aria-hidden>→</span>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                Typical review sites
              </h3>
              <ul className="space-y-3">
                {OTHER_SITES.map((line) => (
                  <li key={line} className="text-sm text-gray-500 flex gap-2">
                    <span className="text-red-400/80 shrink-0">✕</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-violet-500/25 bg-violet-500/5 p-5 ring-1 ring-violet-500/10">
              <h3 className="text-sm font-semibold text-violet-300 uppercase tracking-wide mb-4">
                AIGC Room
              </h3>
              <ul className="space-y-3">
                {AIGC_ROOM.map((line) => (
                  <li key={line} className="text-sm text-gray-300 flex gap-2">
                    <span className="text-emerald-400 shrink-0">✓</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
