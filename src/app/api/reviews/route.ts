import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/auth'
import { withAdmin } from '@/lib/api-guard'

export async function GET(request: Request) {
  try {
    const session = getSessionFromRequest(request)
    const isAdmin = session?.role === 'ADMIN'

    const reviews = await prisma.review.findMany({
      where: isAdmin ? undefined : { status: 'PUBLISHED' },
      include: {
        author: { select: { id: true, name: true, ...(isAdmin ? { email: true } : {}) } },
        tool: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(reviews)
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}

export const POST = withAdmin(async (request: Request) => {
  try {
    const data = await request.json()

    const review = await prisma.review.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        toolId: data.toolId || null,
        authorId: data.authorId,
        status: data.status || 'DRAFT',
        publishedAt: data.status === 'PUBLISHED' ? new Date() : null,
      },
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 })
  }
})
