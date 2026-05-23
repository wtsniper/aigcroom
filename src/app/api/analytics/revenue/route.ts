import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAdmin } from '@/lib/api-guard'

export const GET = withAdmin(async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30d'

    const startDate = new Date()
    if (period === '7d') startDate.setDate(startDate.getDate() - 7)
    else if (period === '30d') startDate.setDate(startDate.getDate() - 30)
    else if (period === '90d') startDate.setDate(startDate.getDate() - 90)
    else startDate.setFullYear(2000)

    const clicks = await prisma.affiliateClick.findMany({
      where: { clickedAt: { gte: startDate } },
      include: { link: true },
    })

    const dailyMap = new Map<string, { clicks: number; conversions: number; revenue: number }>()

    for (const click of clicks) {
      const date = click.clickedAt.toISOString().split('T')[0]
      if (!dailyMap.has(date)) {
        dailyMap.set(date, { clicks: 0, conversions: 0, revenue: 0 })
      }
      dailyMap.get(date)!.clicks += 1
    }

    const dailyStats = Array.from(dailyMap.entries())
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date))

    return NextResponse.json({ dailyStats })
  } catch (error) {
    console.error('Revenue analytics error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
})
