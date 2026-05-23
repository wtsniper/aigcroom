import { prisma } from '@/lib/prisma'

/** Affiliate tools pinned to the homepage Featured section (in order). */
export const HOME_AFFILIATE_TOOL_SLUGS = ['speak-ai', 'robofy'] as const

const homeToolSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  logoUrl: true,
  category: true,
  rating: true,
  pricingType: true,
  isFeatured: true,
} as const

export type HomeFeaturedTool = {
  id: string
  name: string
  slug: string
  description: string
  logoUrl: string
  category: string
  rating: number
  pricingType: string
  isFeatured: boolean
}

export async function getHomeFeaturedTools(limit = 4): Promise<HomeFeaturedTool[]> {
  const prioritySlugs = [...HOME_AFFILIATE_TOOL_SLUGS]

  const [priorityTools, featuredTools] = await Promise.all([
    prisma.tool.findMany({
      where: { slug: { in: prioritySlugs } },
      select: homeToolSelect,
    }),
    prisma.tool.findMany({
      where: {
        isFeatured: true,
        slug: { notIn: prioritySlugs },
      },
      orderBy: { rating: 'desc' },
      take: limit,
      select: homeToolSelect,
    }),
  ])

  const priorityBySlug = new Map(priorityTools.map((t) => [t.slug, t]))
  const ordered: HomeFeaturedTool[] = []

  for (const slug of prioritySlugs) {
    const tool = priorityBySlug.get(slug)
    if (tool) ordered.push(tool)
  }

  const seen = new Set(ordered.map((t) => t.id))
  for (const tool of featuredTools) {
    if (ordered.length >= limit) break
    if (!seen.has(tool.id)) {
      ordered.push(tool)
      seen.add(tool.id)
    }
  }

  if (ordered.length < limit) {
    const fillers = await prisma.tool.findMany({
      where: { id: { notIn: [...seen] } },
      orderBy: { rating: 'desc' },
      take: limit - ordered.length,
      select: homeToolSelect,
    })
    ordered.push(...fillers)
  }

  return ordered.slice(0, limit)
}
