import { NextResponse } from 'next/server'
import { db } from '@/lib/db-simple'

export async function GET() {
  try {
    const users = await db.user.findMany()
    const tools = await db.tool.findMany()
    const reviews = await db.review.findMany()
    const solutions = await db.solution.findMany()
    const affiliateLinks = await db.affiliateLink.findMany()
    const subscriptions = await db.subscription.findMany({})

    const totalUsers = users.length
    const totalTools = tools.length
    const totalReviews = reviews.length
    const totalSolutions = solutions.length
    
    const totalAffiliateClicks = affiliateLinks.reduce((sum: number, link: any) => sum + (link.clicks || 0), 0)
    const totalAffiliateConversions = affiliateLinks.reduce((sum: number, link: any) => sum + (link.conversions || 0), 0)
    const totalAffiliateRevenue = affiliateLinks.reduce((sum: number, link: any) => sum + (link.revenue || 0), 0)
    
    const totalSubscriptions = subscriptions.length
    const paidSubscriptions = subscriptions.filter((s: any) => s.status === 'ACTIVE' && s.planType !== 'FREE').length
    
    const recentUsers = [...users]
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
      .map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        createdAt: u.createdAt,
      }))
    
    const recentReviewsList = [...reviews]
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
      .map((r: any) => ({
        id: r.id,
        title: r.title,
        status: r.status,
        createdAt: r.createdAt,
      }))
    
    const topTools = [...affiliateLinks]
      .sort((a: any, b: any) => (b.clicks || 0) - (a.clicks || 0))
      .slice(0, 5)
      .map((link: any) => ({
        id: link.toolId || link.id,
        name: 'General',
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
      recentUsers: recentUsers,
      recentReviews: recentReviewsList,
      topTools,
      monthlyRevenue: [],
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
