import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const toolId = searchParams.get('toolId')
    const reviewId = searchParams.get('reviewId')

    if (!toolId && !reviewId) {
      return NextResponse.json({ error: 'toolId or reviewId is required' }, { status: 400 })
    }

    const where: { parentId: null; toolId?: string; reviewId?: string } = { parentId: null }
    if (toolId) where.toolId = toolId
    if (reviewId) where.reviewId = reviewId

    const comments = await prisma.comment.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, image: true } },
        replies: {
          include: {
            user: { select: { id: true, name: true, image: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ comments })
  } catch (error) {
    console.error('Get comments error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const auth = await requireAuth(request)
  if (auth instanceof NextResponse) return auth

  try {
    const body = await request.json()
    const { content, toolId, reviewId, parentId } = body

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    if (content.length > 2000) {
      return NextResponse.json({ error: 'Comment must be under 2000 characters' }, { status: 400 })
    }

    if (!toolId && !reviewId) {
      return NextResponse.json({ error: 'toolId or reviewId is required' }, { status: 400 })
    }

    if (parentId) {
      const parent = await prisma.comment.findUnique({ where: { id: parentId } })
      if (!parent) {
        return NextResponse.json({ error: 'Parent comment not found' }, { status: 404 })
      }
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        userId: auth.id,
        toolId: toolId || null,
        reviewId: reviewId || null,
        parentId: parentId || null,
      },
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
    })

    return NextResponse.json({ comment }, { status: 201 })
  } catch (error) {
    console.error('Create comment error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
