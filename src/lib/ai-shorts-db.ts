import { prisma } from '@/lib/prisma'
import type { AiShort } from '@prisma/client'
import type { ViralAiShort, ViralShortTool } from '@/lib/viral-ai-shorts'
import { getSortedViralShorts, type ViralAiShort as StaticShort } from '@/lib/viral-ai-shorts'

function parseJsonArray<T>(raw: string, fallback: T[]): T[] {
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : fallback
  } catch {
    return fallback
  }
}

export function mapAiShortToViral(record: AiShort): ViralAiShort {
  return {
    id: record.slug,
    title: record.title,
    originalTitle: record.originalTitle ?? undefined,
    creator: record.creator,
    creatorHandle: record.creatorHandle ?? undefined,
    description: record.description,
    tools: parseJsonArray<ViralShortTool>(record.tools, []),
    youtubeVideoId: record.youtubeVideoId ?? undefined,
    youtubeNote: record.youtubeNote ?? undefined,
    bilibiliBvid: record.bilibiliBvid ?? undefined,
    galleryUrl: record.galleryUrl ?? undefined,
    duration: record.duration ?? undefined,
    tags: parseJsonArray<string>(record.tags, []),
    viralNote: record.viralNote ?? undefined,
    featured: record.featured,
    preferredPlatform:
      record.preferredPlatform === 'youtube' || record.preferredPlatform === 'bilibili'
        ? record.preferredPlatform
        : undefined,
    sortOrder: record.sortOrder,
  }
}

export async function getPublishedViralShorts(): Promise<ViralAiShort[]> {
  const publishedCount = await prisma.aiShort.count({ where: { status: 'PUBLISHED' } })
  if (publishedCount === 0) {
    return getSortedViralShorts()
  }

  const rows = await prisma.aiShort.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  })
  return rows.map(mapAiShortToViral)
}

export async function getAllAiShortsForAdmin(): Promise<AiShort[]> {
  return prisma.aiShort.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  })
}

export type AiShortInput = {
  slug: string
  title: string
  originalTitle?: string | null
  creator: string
  creatorHandle?: string | null
  description: string
  tools?: ViralShortTool[]
  youtubeVideoId?: string | null
  youtubeNote?: string | null
  bilibiliBvid?: string | null
  galleryUrl?: string | null
  duration?: string | null
  tags?: string[]
  viralNote?: string | null
  featured?: boolean
  preferredPlatform?: string | null
  sortOrder?: number
  status?: string
}

export function serializeAiShortInput(data: AiShortInput) {
  const status = data.status ?? 'DRAFT'
  return {
    slug: data.slug,
    title: data.title,
    originalTitle: data.originalTitle ?? null,
    creator: data.creator,
    creatorHandle: data.creatorHandle ?? null,
    description: data.description,
    tools: JSON.stringify(data.tools ?? []),
    youtubeVideoId: data.youtubeVideoId ?? null,
    youtubeNote: data.youtubeNote ?? null,
    bilibiliBvid: data.bilibiliBvid ?? null,
    galleryUrl: data.galleryUrl ?? null,
    duration: data.duration ?? null,
    tags: JSON.stringify(data.tags ?? []),
    viralNote: data.viralNote ?? null,
    featured: data.featured ?? false,
    preferredPlatform: data.preferredPlatform ?? null,
    sortOrder: data.sortOrder ?? 0,
    status,
    publishedAt: status === 'PUBLISHED' ? new Date() : null,
  }
}

export type StaticSeedShort = StaticShort
