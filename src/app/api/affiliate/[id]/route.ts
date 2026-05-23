import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAdmin } from '@/lib/api-guard'
import { isSafeRedirectUrl } from '@/lib/auth'

export const PUT = withAdmin(async (request: Request, context: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await context.params
    const data = await request.json()
    if (data.url && !isSafeRedirectUrl(data.url)) {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
    }
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
})

export const DELETE = withAdmin(async (_request: Request, context: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await context.params
    await prisma.affiliateLink.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting affiliate link:', error)
    return NextResponse.json({ error: 'Failed to delete affiliate link' }, { status: 500 })
  }
})
