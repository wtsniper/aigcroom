import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAdmin } from '@/lib/api-guard'
import { requireAdmin } from '@/lib/auth'
import {
  getAllAiShortsForAdmin,
  getPublishedViralShorts,
  serializeAiShortInput,
  type AiShortInput,
} from '@/lib/ai-shorts-db'
import { extractBilibiliBvid, extractYoutubeVideoId } from '@/lib/video-url-parse'

function normalizeInput(data: Record<string, unknown>): AiShortInput {
  const youtubeRaw = String(data.youtubeVideoId ?? data.youtubeUrl ?? '').trim()
  const bilibiliRaw = String(data.bilibiliBvid ?? data.bilibiliUrl ?? '').trim()

  let youtubeVideoId = data.youtubeVideoId ? String(data.youtubeVideoId).trim() : null
  if (youtubeRaw) {
    youtubeVideoId = extractYoutubeVideoId(youtubeRaw) ?? youtubeVideoId
  }

  let bilibiliBvid = data.bilibiliBvid ? String(data.bilibiliBvid).trim() : null
  if (bilibiliRaw) {
    bilibiliBvid = extractBilibiliBvid(bilibiliRaw) ?? bilibiliBvid
  }

  const tags = Array.isArray(data.tags)
    ? (data.tags as string[])
    : String(data.tags ?? '')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

  let tools = data.tools
  if (typeof tools === 'string' && tools.trim()) {
    try {
      tools = JSON.parse(tools)
    } catch {
      tools = []
    }
  }

  return {
    slug: String(data.slug ?? '').trim(),
    title: String(data.title ?? '').trim(),
    originalTitle: data.originalTitle ? String(data.originalTitle) : null,
    creator: String(data.creator ?? '').trim(),
    creatorHandle: data.creatorHandle ? String(data.creatorHandle) : null,
    description: String(data.description ?? '').trim(),
    tools: Array.isArray(tools) ? tools : [],
    youtubeVideoId,
    youtubeNote: data.youtubeNote ? String(data.youtubeNote) : null,
    bilibiliBvid,
    galleryUrl: data.galleryUrl ? String(data.galleryUrl) : null,
    duration: data.duration ? String(data.duration) : null,
    tags,
    viralNote: data.viralNote ? String(data.viralNote) : null,
    featured: Boolean(data.featured),
    preferredPlatform: data.preferredPlatform ? String(data.preferredPlatform) : null,
    sortOrder: Number(data.sortOrder ?? 0),
    status: String(data.status ?? 'DRAFT'),
  }
}

function validateInput(input: AiShortInput): string | null {
  if (!input.slug) return 'Slug is required'
  if (!input.title) return 'Title is required'
  if (!input.creator) return 'Creator is required'
  if (!input.description) return 'Description is required'
  if (!input.youtubeVideoId && !input.bilibiliBvid) {
    return 'YouTube video ID/URL or Bilibili BV id is required'
  }
  return null
}

export async function GET(request: Request) {
  try {
    const auth = await requireAdmin(request)
    const isAdmin = !(auth instanceof NextResponse)

    if (isAdmin) {
      const rows = await getAllAiShortsForAdmin()
      return NextResponse.json(rows)
    }

    const shorts = await getPublishedViralShorts()
    return NextResponse.json(shorts)
  } catch (error) {
    console.error('Error fetching AI shorts:', error)
    return NextResponse.json({ error: 'Failed to fetch AI shorts' }, { status: 500 })
  }
}

export const POST = withAdmin(async (request: Request) => {
  try {
    const data = await request.json()
    const input = normalizeInput(data)
    const error = validateInput(input)
    if (error) return NextResponse.json({ error }, { status: 400 })

    const existing = await prisma.aiShort.findUnique({ where: { slug: input.slug } })
    if (existing) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })
    }

    const short = await prisma.aiShort.create({
      data: serializeAiShortInput(input),
    })
    return NextResponse.json(short, { status: 201 })
  } catch (error) {
    console.error('Error creating AI short:', error)
    return NextResponse.json({ error: 'Failed to create AI short' }, { status: 500 })
  }
})
