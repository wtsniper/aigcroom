import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isSafeRedirectUrl } from '@/lib/auth'

function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return request.headers.get('x-real-ip') || 'unknown'
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const { searchParams } = new URL(request.url)
    const referrer = request.headers.get('referer') || searchParams.get('ref') || ''
    const userAgent = request.headers.get('user-agent') || ''
    const ip = clientIp(request)

    const link = await prisma.affiliateLink.findFirst({ where: { slug } })

    if (!link) {
      return NextResponse.json({ error: 'Affiliate link not found' }, { status: 404 })
    }

    if (!isSafeRedirectUrl(link.url)) {
      return NextResponse.json({ error: 'Invalid affiliate URL' }, { status: 400 })
    }

    await prisma.$transaction([
      prisma.affiliateLink.update({
        where: { id: link.id },
        data: { clicks: { increment: 1 } },
      }),
      prisma.affiliateClick.create({
        data: {
          linkId: link.id,
          ipAddress: ip.slice(0, 45),
          userAgent: userAgent.slice(0, 512),
          referralSource: referrer.slice(0, 512),
        },
      }),
    ])

    return NextResponse.redirect(link.url, 302)
  } catch (error) {
    console.error('Affiliate track error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
