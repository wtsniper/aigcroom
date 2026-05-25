import Link from 'next/link'
import { MONETIZATION_PICKS } from '@/lib/monetization-picks'

export default function MonetizationPicks({
  title = 'Start Earning with AI',
  limit,
}: {
  title?: string
  limit?: number
}) {
  const picks = limit ? MONETIZATION_PICKS.slice(0, limit) : MONETIZATION_PICKS
  return (
    <section className="mb-10">
      <div className="flex items-end justify-between mb-5">
        <div>
          <span className="text-amber-400 text-xs font-semibold uppercase tracking-widest">Monetization</span>
          <h2 className="text-xl md:text-2xl font-bold text-white mt-1">{title}</h2>
          <p className="text-gray-500 text-sm mt-1">Hand-picked resources we use to grow AIGC Room</p>
        </div>
        {!limit && (
          <Link
            href="/compare"
            className="hidden sm:block text-sm text-violet-400 hover:text-violet-300 font-medium transition-colors"
          >
            All comparisons →
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {picks.map((pick) => {
          const className =
            'group glass glass-hover rounded-xl p-4 flex gap-3 hover:scale-[1.01] transition-all duration-200'
          const inner = (
            <>
              <span className="text-2xl shrink-0 group-hover:scale-110 transition-transform">{pick.icon}</span>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-semibold text-white text-sm group-hover:text-amber-200 transition-colors truncate">
                    {pick.title}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                    {pick.badge}
                  </span>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2">{pick.description}</p>
              </div>
            </>
          )
          if ('external' in pick && pick.external) {
            return (
              <a key={pick.href} href={pick.href} target="_blank" rel="noopener noreferrer sponsored" className={className}>
                {inner}
              </a>
            )
          }
          return (
            <Link key={pick.href} href={pick.href} className={className}>
              {inner}
            </Link>
          )
        })}
      </div>
    </section>
  )
}
