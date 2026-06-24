import { prisma } from '@/lib/prisma'
import HomeClient from './HomeClient'
import { getHomeFeaturedTools } from '@/lib/featured-tools'
import { buildCategoriesWithCounts } from '@/lib/categories'
import { getHomePinnedReview, getHomeRecentReviews } from '@/lib/featured-reviews'
import { getPublishedViralShorts } from '@/lib/ai-shorts-db'
import { pageMetadata, buildWebSiteJsonLd, JsonLd } from '@/lib/seo'

export const revalidate = 300

export const metadata = pageMetadata(
  '/',
  'AIGC Room — Your shortcut to the best AI software',
  'Independent AI tool reviews and comparisons. Hands-on testing of video, writing, and coding AI — plus viral AI short films and monetization guides.'
)

export default async function HomePage() {
  const pinnedReview = await getHomePinnedReview()
  const excludeSlugs = pinnedReview ? [pinnedReview.slug] : []

  const [
    featuredTools,
    recentReviews,
    featuredSolutions,
    categoryTools,
    aiShorts,
    toolCount,
    reviewCount,
    comparisonCount,
    shortCount,
  ] = await Promise.all([
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
    prisma.tool.count(),
    prisma.review.count({ where: { status: 'PUBLISHED' } }),
    prisma.review.count({
      where: { status: 'PUBLISHED', slug: { contains: '-vs-' } },
    }),
    prisma.aiShort.count({ where: { status: 'PUBLISHED' } }),
  ])

  const categories = buildCategoriesWithCounts(categoryTools)

  return (
    <>
      <JsonLd data={buildWebSiteJsonLd()} />
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
        siteStats={{
          toolCount,
          reviewCount,
          comparisonCount,
          shortCount,
          categoryCount: categories.length,
        }}
      />
    </>
  )
}
