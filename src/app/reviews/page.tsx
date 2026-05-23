import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import MonetizationPicks from '@/components/MonetizationPicks'

export const metadata = {
  title: 'AI Tool Reviews | AIGC Room',
  description: 'In-depth reviews and analysis of the best AI tools',
}

export default async function ReviewsPage() {
  let reviews: {
    id: string
    title: string
    slug: string
    excerpt: string
    publishedAt: Date | null
    createdAt: Date
    tool: { name: string } | null
  }[] = []

  try {
    reviews = await prisma.review.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        publishedAt: true,
        createdAt: true,
        tool: { select: { name: true } },
      },
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-7xl">
      <h1 className="text-3xl font-extrabold text-white mb-3">AI Tool Reviews</h1>
      <p className="text-gray-400 mb-8">In-depth analysis and expert reviews of the best AI tools</p>

      <MonetizationPicks />

      {reviews.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No reviews published yet. Check back soon!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="glass rounded-2xl p-6 hover:border-violet-500/30 transition-all flex flex-col"
            >
              <Link href={`/reviews/${review.slug}`}>
                <h2 className="text-base font-semibold text-white hover:text-violet-400 transition-colors mb-2 leading-snug">
                  {review.title}
                </h2>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed flex-1">{review.excerpt}</p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.06]">
                <span className="text-xs text-gray-500">
                  {new Date(review.publishedAt ?? review.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'short', day: 'numeric'
                  })}
                </span>
                <Link
                  href={`/reviews/${review.slug}`}
                  className="text-violet-400 text-sm font-medium hover:text-violet-300 transition-colors"
                >
                  Read more →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
