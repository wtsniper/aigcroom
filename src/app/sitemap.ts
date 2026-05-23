import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { TOOL_CATEGORIES } from '@/lib/categories'

// Always render at request time so DATABASE_URL is available and content stays fresh
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://aigcroom.shop').replace(/\/$/, '')

  const staticEntries: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/tools`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/category`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/reviews`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/solutions`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/register`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
  ]

  try {
    const [tools, reviews, solutions] = await Promise.all([
      prisma.tool.findMany({ select: { slug: true, updatedAt: true } }),
      prisma.review.findMany({
        where: { status: 'PUBLISHED' },
        select: { slug: true, updatedAt: true },
      }),
      prisma.solution.findMany({ select: { slug: true, updatedAt: true } }),
    ])

    const toolUrls: MetadataRoute.Sitemap = tools.map((t) => ({
      url: `${baseUrl}/tools/${t.slug}`,
      lastModified: t.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    }))

    const reviewUrls: MetadataRoute.Sitemap = reviews.map((r) => ({
      url: `${baseUrl}/reviews/${r.slug}`,
      lastModified: r.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    const solutionUrls: MetadataRoute.Sitemap = solutions.map((s) => ({
      url: `${baseUrl}/solutions/${s.slug}`,
      lastModified: s.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.65,
    }))

    const categoryUrls: MetadataRoute.Sitemap = TOOL_CATEGORIES.map((c) => ({
      url: `${baseUrl}/category/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    return [...staticEntries, ...categoryUrls, ...toolUrls, ...reviewUrls, ...solutionUrls]
  } catch (e) {
    console.warn('[sitemap] Dynamic URLs skipped (database unavailable):', e)
    return staticEntries
  }
}
