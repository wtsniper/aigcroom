import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAdmin } from '@/lib/api-guard'

export const GET = withAdmin(async () => {
  try {
    const totalUsers = await prisma.user.count()
    const totalTools = await prisma.tool.count()
    const totalReviews = await prisma.review.count()
    const totalSolutions = await prisma.solution.count()

    const affiliateLinks = await prisma.affiliateLink.findMany()
    const totalAffiliateClicks = affiliateLinks.reduce((sum, link) => sum + link.clicks, 0)
    const totalAffiliateConversions = affiliateLinks.reduce((sum, link) => sum + link.conversions, 0)
    const totalAffiliateRevenue = affiliateLinks.reduce((sum, link) => sum + link.revenue, 0)

    const totalSubscriptions = await prisma.subscription.count()
    const paidSubscriptions = await prisma.subscription.count({
      where: { status: 'ACTIVE', planType: { not: 'FREE' } },
    })

    const recentUsers = await prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, createdAt: true },
    })

    const recentReviews = await prisma.review.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, status: true, createdAt: true },
    })

    const topTools = affiliateLinks
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 5)
      .map((link) => ({
        id: link.toolId || link.id,
        name: link.platform || link.slug,
        clicks: link.clicks,
        revenue: link.revenue,
      }))

    return NextResponse.json({
      totalUsers,
      totalTools,
      totalReviews,
      totalSolutions,
      totalAffiliateClicks,
      totalAffiliateConversions,
      totalAffiliateRevenue,
      totalSubscriptions,
      paidSubscriptions,
      recentUsers,
      recentReviews,
      topTools,
      monthlyRevenue: [],
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
})
