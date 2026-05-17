import Link from 'next/link'
import { prisma } from '@/lib/prisma'

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
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">AI Tool Reviews</h1>

      {reviews.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No reviews published yet. Check back soon!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <Link href={`/reviews/${review.slug}`}>
                <h2 className="text-lg font-semibold text-gray-900 hover:text-blue-600 mb-2">
                  {review.title}
                </h2>
              </Link>
              <p className="text-gray-600 text-sm mb-4">{review.excerpt}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {new Date(review.publishedAt ?? review.createdAt).toLocaleDateString()}
                </span>
                <Link
                  href={`/reviews/${review.slug}`}
                  className="text-blue-600 text-sm font-medium hover:underline"
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
