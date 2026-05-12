import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const link = await prisma.affiliateLink.findUnique({ where: { id } })
    if (!link) {
      return NextResponse.json({ error: 'Affiliate link not found' }, { status: 404 })
    }
    return NextResponse.json(link)
  } catch (error) {
    console.error('Error fetching affiliate link:', error)
    return NextResponse.json({ error: 'Failed to fetch affiliate link' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()
    const link = await prisma.affiliateLink.update({
      where: { id },
      data: {
        toolId: data.toolId || null,
        url: data.url,
        slug: data.slug,
        platform: data.platform || null,
      },
    })
    return NextResponse.json(link)
  } catch (error) {
    console.error('Error updating affiliate link:', error)
    return NextResponse.json({ error: 'Failed to update affiliate link' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.affiliateLink.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting affiliate link:', error)
    return NextResponse.json({ error: 'Failed to delete affiliate link' }, { status: 500 })
  }
}
