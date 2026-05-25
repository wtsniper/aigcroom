import Link from 'next/link'
import { MONETIZATION_PICKS } from '@/lib/monetization-picks'
import type { ComparisonReview } from '@/lib/comparison-reviews'

export default function ReviewSidebar({
  related,
  focusArticles = [],
  currentSlug,
}: {
  related: ComparisonReview[]
  focusArticles?: ComparisonReview[]
  currentSlug: string
}) {
  const comparisons = related.filter((r) => r.slug !== currentSlug).slice(0, 4)
  const focus = focusArticles.filter((r) => r.slug !== currentSlug).slice(0, 5)
  const picks = MONETIZATION_PICKS.filter((p) => !p.href.includes(currentSlug)).slice(0, 3)

  return (
    <aside className="space-y-8">
      {focus.length > 0 && (
        <div className="rounded-xl border border-violet-200 bg-violet-50/80 p-5 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-3">Priority Guides</h2>
          <p className="text-xs text-gray-600 mb-3">Our top monetization articles — start here.</p>
          <ul className="space-y-2.5">
            {focus.map((review) => (
              <li key={review.id}>
                <Link
                  href={`/reviews/${review.slug}`}
                  className={`text-sm leading-snug block hover:underline ${
                    review.slug === currentSlug ? 'text-violet-800 font-semibold' : 'text-violet-700 hover:text-violet-900'
                  }`}
                >
                  {review.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {comparisons.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-3">Related Comparisons</h2>
          <ul className="space-y-2.5">
            {comparisons.map((review) => (
              <li key={review.id}>
                <Link
                  href={`/reviews/${review.slug}`}
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline leading-snug block"
                >
                  {review.title}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/compare" className="inline-block mt-3 text-sm text-gray-500 hover:text-blue-600">
            All comparisons →
          </Link>
        </div>
      )}

      <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-700 mb-3">Guides & Deals</p>
        <ul className="space-y-3">
          {picks.map((pick) => (
            <li key={pick.href}>
              {'external' in pick && pick.external ? (
                <a
                  href={pick.href}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="block group"
                >
                  <span className="text-sm font-medium text-gray-900 group-hover:text-amber-800">{pick.title}</span>
                  <span className="text-xs text-gray-500 block mt-0.5 line-clamp-2">{pick.description}</span>
                </a>
              ) : (
                <Link href={pick.href} className="block group">
                  <span className="text-sm font-medium text-gray-900 group-hover:text-amber-800">{pick.title}</span>
                  <span className="text-xs text-gray-500 block mt-0.5 line-clamp-2">{pick.description}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
