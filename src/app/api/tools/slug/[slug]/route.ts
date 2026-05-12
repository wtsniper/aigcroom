import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    if (!slug) {
      return NextResponse.json({ error: 'Slug required' }, { status: 400 })
    }

    const tool = await prisma.tool.findUnique({
      where: { slug },
      include: {
        pricingPlans: true,
        affiliateLinks: true,
      },
    })

    if (!tool) {
      return NextResponse.json({ error: 'Tool not found' }, { status: 404 })
    }

    return NextResponse.json(tool)
  } catch (error) {
    console.error('Error fetching tool by slug:', error)
    return NextResponse.json({ error: 'Failed to fetch tool' }, { status: 500 })
  }
}
