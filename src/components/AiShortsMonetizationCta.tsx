import Link from 'next/link'
import { AI_SHORTS_GUIDES } from '@/lib/ai-shorts-monetization'

type AiShortsMonetizationCtaProps = {
  variant?: 'full' | 'compact'
  toolLinks?: { name: string; href: string; external?: boolean }[]
}

export default function AiShortsMonetizationCta({
  variant = 'full',
  toolLinks = [],
}: AiShortsMonetizationCtaProps) {
  const guides = variant === 'compact' ? AI_SHORTS_GUIDES.slice(0, 3) : AI_SHORTS_GUIDES

  return (
    <div
      className={`rounded-2xl border border-amber-500/25 bg-gradient-to-br from-amber-950/30 via-gray-950/80 to-violet-950/30 ${
        variant === 'compact' ? 'p-5 md:p-6' : 'p-6 md:p-8'
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
        <div className="flex-1 min-w-0">
          <span className="text-amber-400 text-xs font-semibold uppercase tracking-widest">
            Make films like these
          </span>
          <h2
            className={`font-bold text-white mt-1 mb-2 ${
              variant === 'compact' ? 'text-lg' : 'text-xl md:text-2xl'
            }`}
          >
            Tools, comparisons &amp; buyer guides
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed max-w-xl">
            These viral shorts were built with Seedance, Runway, Midjourney, and more. We compare
            pricing, link to tool pages, and track affiliate deals where available — so you can
            start your own stack without guessing.
          </p>

          {toolLinks.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {toolLinks.map((tool) =>
                tool.external ? (
                  <a
                    key={tool.href}
                    href={tool.href}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="text-xs px-3 py-1.5 rounded-full bg-white/[0.06] text-violet-300 border border-violet-500/25 hover:border-violet-400/50 hover:bg-violet-500/10 transition-colors"
                  >
                    {tool.name} ↗
                  </a>
                ) : (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="text-xs px-3 py-1.5 rounded-full bg-white/[0.06] text-violet-300 border border-violet-500/25 hover:border-violet-400/50 hover:bg-violet-500/10 transition-colors"
                  >
                    {tool.name}
                  </Link>
                )
              )}
            </div>
          )}
        </div>

        <div
          className={`grid gap-3 shrink-0 ${
            variant === 'compact'
              ? 'w-full lg:w-[340px] grid-cols-1'
              : 'w-full lg:w-[420px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-1'
          }`}
        >
          {guides.map((guide) => {
            const inner = (
              <>
                <span className="text-xl shrink-0">{guide.icon}</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-white text-sm group-hover:text-amber-200 transition-colors">
                      {guide.title}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                      {guide.badge}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">{guide.description}</p>
                </div>
              </>
            )
            const className =
              'group flex gap-3 rounded-xl p-3 border border-white/[0.08] bg-white/[0.03] hover:border-amber-500/30 hover:bg-amber-500/[0.06] transition-all duration-200'

            if (guide.external) {
              return (
                <a
                  key={guide.href}
                  href={guide.href}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className={className}
                >
                  {inner}
                </a>
              )
            }
            return (
              <Link key={guide.href} href={guide.href} className={className}>
                {inner}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
