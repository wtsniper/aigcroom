import { prisma } from '@/lib/prisma'
import HomeClient from './HomeClient'
import { getHomeFeaturedTools } from '@/lib/featured-tools'
import { buildCategoriesWithCounts } from '@/lib/categories'
import { getHomePinnedReview, getHomeRecentReviews } from '@/lib/featured-reviews'
import { getPublishedViralShorts } from '@/lib/ai-shorts-db'

export const revalidate = 300

export default async function HomePage() {
  const pinnedReview = await getHomePinnedReview()
  const excludeSlugs = pinnedReview ? [pinnedReview.slug] : []

  const [featuredTools, recentReviews, featuredSolutions, categoryTools, aiShorts] =
    await Promise.all([
    getHomeFeaturedTools(4),
    getHomeRecentReviews(3, excludeSlugs),
    prisma.solution.findMany({
      orderBy: { createdAt: 'desc' },
      take: 4,
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        industry: true,
        isFeatured: true,
      },
    }),
    prisma.tool.findMany({ select: { category: true } }),
    getPublishedViralShorts(),
  ])

  const categories = buildCategoriesWithCounts(categoryTools)

  return (
    <HomeClient
      initialTools={featuredTools}
      initialCategories={categories}
      pinnedReview={
        pinnedReview
          ? {
              ...pinnedReview,
              createdAt: pinnedReview.createdAt.toISOString(),
              publishedAt: pinnedReview.publishedAt?.toISOString() ?? null,
            }
          : null
      }
      initialReviews={recentReviews.map((r) => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
        publishedAt: r.publishedAt?.toISOString() ?? null,
      }))}
      initialSolutions={featuredSolutions}
      initialAiShorts={aiShorts}
    />
  )
}
