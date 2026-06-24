import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAdmin } from '@/lib/api-guard'
import { requireAdmin } from '@/lib/auth'
import { serializeAiShortInput, type AiShortInput } from '@/lib/ai-shorts-db'
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

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const short = await prisma.aiShort.findUnique({ where: { id } })
    if (!short) {
      return NextResponse.json({ error: 'AI short not found' }, { status: 404 })
    }

    const auth = await requireAdmin(_request)
    const isAdmin = !(auth instanceof NextResponse)
    if (!isAdmin && short.status !== 'PUBLISHED') {
      return NextResponse.json({ error: 'AI short not found' }, { status: 404 })
    }

    return NextResponse.json(short)
  } catch (error) {
    console.error('Error fetching AI short:', error)
    return NextResponse.json({ error: 'Failed to fetch AI short' }, { status: 500 })
  }
}

export const PUT = withAdmin(async (request: Request, context: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await context.params
    const existing = await prisma.aiShort.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'AI short not found' }, { status: 404 })
    }

    const data = await request.json()
    const input = normalizeInput(data)
    const error = validateInput(input)
    if (error) return NextResponse.json({ error }, { status: 400 })

    if (input.slug !== existing.slug) {
      const slugTaken = await prisma.aiShort.findUnique({ where: { slug: input.slug } })
      if (slugTaken) {
        return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })
      }
    }

    const serialized = serializeAiShortInput(input)
    const publishedAt =
      input.status === 'PUBLISHED' ? existing.publishedAt ?? new Date() : null

    const short = await prisma.aiShort.update({
      where: { id },
      data: { ...serialized, publishedAt },
    })
    return NextResponse.json(short)
  } catch (error) {
    console.error('Error updating AI short:', error)
    return NextResponse.json({ error: 'Failed to update AI short' }, { status: 500 })
  }
})

export const DELETE = withAdmin(async (_request: Request, context: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await context.params
    await prisma.aiShort.delete({ where: { id } })
    return NextResponse.json({ message: 'AI short deleted successfully' })
  } catch (error) {
    console.error('Error deleting AI short:', error)
    return NextResponse.json({ error: 'Failed to delete AI short' }, { status: 500 })
  }
})
