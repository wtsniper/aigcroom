import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import MonetizationPicks from '@/components/MonetizationPicks'
import { getFeaturedComparisons, getFeaturedGuides } from '@/lib/comparison-reviews'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata(
  '/compare',
  'AI Tool Comparisons & Guides | AIGC Room',
  'Side-by-side comparisons of the best AI tools — ChatGPT vs Claude, coding assistants, voice AI, hosting, SEO, and more.'
)

export default async function ComparePage() {
  const [featuredComparisons, featuredGuides, allComparisons] = await Promise.all([
    getFeaturedComparisons(8),
    getFeaturedGuides(),
    prisma.review.findMany({
      where: { status: 'PUBLISHED', slug: { contains: '-vs-' } },
      orderBy: { publishedAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        publishedAt: true,
        createdAt: true,
      },
    }),
  ])

  const featuredSlugs = new Set([
    ...featuredComparisons.map((r) => r.slug),
    ...featuredGuides.map((r) => r.slug),
  ])
  const moreComparisons = allComparisons.filter((r) => !featuredSlugs.has(r.slug))

  return (
    <div className="container mx-auto px-4 py-10 max-w-7xl">
      <div className="mb-10">
        <span className="text-violet-400 text-xs font-semibold uppercase tracking-widest">Compare</span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-2 mb-3">
          AI Tool Comparisons & Buyer Guides
        </h1>
        <p className="text-gray-400 max-w-2xl">
          Honest head-to-head reviews to help you pick the right subscription, SaaS tool, or stack —
          without paying for three overlapping plans.
        </p>
      </div>

      <MonetizationPicks title="30-Day Priority Articles" limit={5} />

      {featuredGuides.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4">Buyer Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredGuides.map((review) => (
              <CompareCard key={review.id} review={review} badge="Guide" />
            ))}
          </div>
        </section>
      )}

      {featuredComparisons.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4">Featured Comparisons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredComparisons.map((review) => (
              <CompareCard key={review.id} review={review} badge="Compare" />
            ))}
          </div>
        </section>
      )}

      {moreComparisons.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-white mb-4">All Comparisons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {moreComparisons.map((review) => (
              <CompareCard key={review.id} review={review} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function CompareCard({
  review,
  badge,
}: {
  review: {
    id: string
    title: string
    slug: string
    excerpt: string
    publishedAt: Date | null
    createdAt: Date
  }
  badge?: string
}) {
  const date = review.publishedAt ?? review.createdAt
  return (
    <Link
      href={`/reviews/${review.slug}`}
      className="group glass glass-hover rounded-2xl p-5 flex flex-col hover:scale-[1.01] transition-all duration-200"
    >
      <div className="flex items-center gap-2 mb-3">
        {badge && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 font-semibold uppercase">
            {badge}
          </span>
        )}
        <span className="text-xs text-gray-500">
          {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>
      <h3 className="font-semibold text-white text-sm leading-snug mb-2 group-hover:text-violet-300 transition-colors line-clamp-2">
        {review.title}
      </h3>
      <p className="text-gray-500 text-xs leading-relaxed line-clamp-3 flex-1">{review.excerpt}</p>
      <span className="text-violet-400 text-xs font-medium mt-4 group-hover:gap-1 inline-flex items-center gap-0.5">
        Read comparison →
      </span>
    </Link>
  )
}
