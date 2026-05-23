import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAdmin } from '@/lib/api-guard'
import { isSafeRedirectUrl } from '@/lib/auth'

export const GET = withAdmin(async () => {
  try {
    const links = await prisma.affiliateLink.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(links)
  } catch (error) {
    console.error('Error fetching affiliate links:', error)
    return NextResponse.json({ error: 'Failed to fetch affiliate links' }, { status: 500 })
  }
})

export const POST = withAdmin(async (request: Request) => {
  try {
    const data = await request.json()
    if (!data.url || !data.slug || !isSafeRedirectUrl(data.url)) {
      return NextResponse.json({ error: 'Valid url and slug are required' }, { status: 400 })
    }
    const link = await prisma.affiliateLink.create({
      data: {
        toolId: data.toolId || null,
        url: data.url,
        slug: data.slug,
        platform: data.platform || null,
      },
    })
    return NextResponse.json(link, { status: 201 })
  } catch (error) {
    console.error('Error creating affiliate link:', error)
    return NextResponse.json({ error: 'Failed to create affiliate link' }, { status: 500 })
  }
})
