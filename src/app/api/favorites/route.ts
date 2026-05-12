import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/** MVP: userId from client (same trust model as subscription APIs). Prefer JWT in a later hardening pass. */

export async function GET(request: Request) {
  try {
    const userId = new URL(request.url).searchParams.get('userId')
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        tool: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            category: true,
            rating: true,
            pricingType: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(favorites)
  } catch (error) {
    console.error('Favorites GET error:', error)
    return NextResponse.json({ error: 'Failed to load favorites' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId, toolId } = await request.json()
    if (!userId || !toolId) {
      return NextResponse.json({ error: 'userId and toolId are required' }, { status: 400 })
    }

    const [user, tool] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.tool.findUnique({ where: { id: toolId } }),
    ])
    if (!user || !tool) {
      return NextResponse.json({ error: 'User or tool not found' }, { status: 404 })
    }

    const fav = await prisma.favorite.upsert({
      where: { userId_toolId: { userId, toolId } },
      create: { userId, toolId },
      update: {},
      include: {
        tool: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            category: true,
            rating: true,
            pricingType: true,
          },
        },
      },
    })

    return NextResponse.json(fav, { status: 201 })
  } catch (error) {
    console.error('Favorites POST error:', error)
    return NextResponse.json({ error: 'Failed to add favorite' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const toolId = searchParams.get('toolId')
    if (!userId || !toolId) {
      return NextResponse.json({ error: 'userId and toolId are required' }, { status: 400 })
    }

    await prisma.favorite.deleteMany({ where: { userId, toolId } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Favorites DELETE error:', error)
    return NextResponse.json({ error: 'Failed to remove favorite' }, { status: 500 })
  }
}
