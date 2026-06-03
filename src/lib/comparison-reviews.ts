import { prisma } from '@/lib/prisma'
import { FOCUS_ARTICLE_SLUGS } from '@/lib/focus-articles'

/** Curated comparison articles — order matters for /compare hub. */
export const FEATURED_COMPARISON_SLUGS = [
  'ai-video-generators-compared-2026-complete-guide',
  'luma-vs-runway-vs-kling-2024',
  'chatgpt-plus-vs-claude-pro-2026',
  'perplexity-vs-chatgpt-research-2026',
  'gamma-vs-beautiful-ai-vs-tome-2026',
  'heygen-vs-synthesia-vs-did-2026',
  'robofy-vs-intercom-vs-tidio-2026',
  'suno-vs-udio-2026',
  'chatgpt-vs-claude-2026',
  'claude-code-vs-cursor-vs-copilot-2026',
  'elevenlabs-vs-murf-ai-2026',
  'speak-ai-vs-otter-ai-vs-fireflies-2026',
  'jasper-vs-copyai-vs-writesonic-2026',
  'runway-vs-pika-vs-kling-2026',
  'seedance-vs-runway-vs-kling-2026',
  'higgsfield-vs-runway-ai-video-2026',
  'pika-labs-vs-kling-ai-2026',
  'notion-ai-vs-obsidian-vs-roam-2026',
  'semrush-vs-ahrefs-seo-tools-2026',
] as const

/** Monetization / buyer guides (not always *-vs-* slugs). Focus slugs first. */
export const FEATURED_GUIDE_SLUGS = [
  ...FOCUS_ARTICLE_SLUGS,
  'best-vpn-for-ai-developers-2026',
  'best-ai-tools-for-students-2026',
  'best-ai-video-tools-for-shorts-2026',
  'best-ai-tools-for-youtube-creators-2026',
  'zombie-scavenger-hell-grind-ai-workflow-2026',
  'capcut-seedance-ai-shorts-workflow-2026',
  'openai-sora-shutdown-ai-video-alternatives-2026',
  'youtube-ai-video-labels-2026-creator-guide',
  'google-gemini-managed-agents-2026-developer-guide',
  'ai-video-generators-compared-2026-complete-guide',
  'luma-vs-runway-vs-kling-2024',
  'best-ai-coding-tools-for-beginners-2026',
  'cursor-ide-beginners-guide-2026',
  'github-copilot-beginners-guide-2026',
] as const

const reviewCardSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  publishedAt: true,
  createdAt: true,
} as const

export type ComparisonReview = {
  id: string
  title: string
  slug: string
  excerpt: string
  publishedAt: Date | null
  createdAt: Date
}

export async function getFeaturedComparisons(limit?: number): Promise<ComparisonReview[]> {
  const slugs = limit ? FEATURED_COMPARISON_SLUGS.slice(0, limit) : [...FEATURED_COMPARISON_SLUGS]

  const reviews = await prisma.review.findMany({
    where: { slug: { in: [...slugs] }, status: 'PUBLISHED' },
    select: reviewCardSelect,
  })

  const bySlug = new Map(reviews.map((r) => [r.slug, r]))
  return slugs.map((slug) => bySlug.get(slug)).filter(Boolean) as ComparisonReview[]
}

export async function getFeaturedGuides(): Promise<ComparisonReview[]> {
  const reviews = await prisma.review.findMany({
    where: { slug: { in: [...FEATURED_GUIDE_SLUGS] }, status: 'PUBLISHED' },
    select: reviewCardSelect,
  })

  const bySlug = new Map(reviews.map((r) => [r.slug, r]))
  return FEATURED_GUIDE_SLUGS.map((slug) => bySlug.get(slug)).filter(Boolean) as ComparisonReview[]
}

export async function getAllComparisonReviews(): Promise<ComparisonReview[]> {
  return prisma.review.findMany({
    where: {
      status: 'PUBLISHED',
      OR: [
        { slug: { contains: '-vs-' } },
        { slug: { in: [...FEATURED_GUIDE_SLUGS] } },
      ],
    },
    orderBy: { publishedAt: 'desc' },
    select: reviewCardSelect,
  })
}

export async function getFocusArticles(excludeSlug?: string): Promise<ComparisonReview[]> {
  const slugs = FOCUS_ARTICLE_SLUGS.filter((s) => s !== excludeSlug)
  const reviews = await prisma.review.findMany({
    where: { slug: { in: [...slugs] }, status: 'PUBLISHED' },
    select: reviewCardSelect,
  })
  const bySlug = new Map(reviews.map((r) => [r.slug, r]))
  return slugs.map((slug) => bySlug.get(slug)).filter(Boolean) as ComparisonReview[]
}

export async function getRelatedComparisons(
  currentSlug: string,
  limit = 4
): Promise<ComparisonReview[]> {
  const candidates = FEATURED_COMPARISON_SLUGS.filter((s) => s !== currentSlug)
  const reviews = await prisma.review.findMany({
    where: { slug: { in: [...candidates] }, status: 'PUBLISHED' },
    select: reviewCardSelect,
    take: limit + 4,
  })

  const bySlug = new Map(reviews.map((r) => [r.slug, r]))
  const ordered: ComparisonReview[] = []
  for (const slug of candidates) {
    const r = bySlug.get(slug)
    if (r) ordered.push(r)
    if (ordered.length >= limit) break
  }
  return ordered
}
