import { prisma } from '@/lib/prisma'
import HomeClient from './HomeClient'
import { getHomeFeaturedTools } from '@/lib/featured-tools'
import { buildCategoriesWithCounts } from '@/lib/categories'

export const revalidate = 300

export default async function HomePage() {
  const [featuredTools, recentReviews, featuredSolutions, categoryTools] = await Promise.all([
    getHomeFeaturedTools(4),
    prisma.review.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        status: true,
        createdAt: true,
      },
    }),
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
  ])

  const categories = buildCategoriesWithCounts(categoryTools)

  return (
    <HomeClient
      initialTools={featuredTools}
      initialCategories={categories}
      initialReviews={recentReviews.map((r) => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
      }))}
      initialSolutions={featuredSolutions}
    />
  )
}
