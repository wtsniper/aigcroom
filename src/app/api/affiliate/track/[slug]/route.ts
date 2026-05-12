import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const { searchParams } = new URL(request.url)
    const referrer = request.headers.get('referer') || searchParams.get('ref') || ''
    const userAgent = request.headers.get('user-agent') || ''

    const link = await prisma.affiliateLink.findFirst({
      where: { slug },
    })

    if (!link) {
      return NextResponse.json({ error: 'Affiliate link not found' }, { status: 404 })
    }

    // 记录点击
    await prisma.affiliateLink.update({
      where: { id: link.id },
      data: { clicks: { increment: 1 } },
    })

    // 记录点击日志
    await prisma.affiliateClick.create({
      data: {
        linkId: link.id,
        ipAddress: '',
        userAgent,
        referralSource: referrer,
      },
    }).catch(() => {})

    // 302 重定向到联盟链接
    return NextResponse.redirect(link.url, 302)
  } catch (error) {
    console.error('Affiliate track error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
