import { prisma } from '@/lib/prisma'

/** Review pinned to the top of the homepage (Amazon Associates article). */
export const HOME_PINNED_REVIEW_SLUG = 'best-ai-books-2026'

const reviewSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  status: true,
  createdAt: true,
} as const

export type HomeReview = {
  id: string
  title: string
  slug: string
  excerpt: string
  status: string
  createdAt: Date
}

export async function getHomePinnedReview(): Promise<HomeReview | null> {
  const review = await prisma.review.findFirst({
    where: { slug: HOME_PINNED_REVIEW_SLUG, status: 'PUBLISHED' },
    select: reviewSelect,
  })
  return review
}

export async function getHomeRecentReviews(
  limit = 3,
  excludeSlugs: string[] = []
): Promise<HomeReview[]> {
  return prisma.review.findMany({
    where: {
      status: 'PUBLISHED',
      slug: { notIn: excludeSlugs },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: reviewSelect,
  })
}
