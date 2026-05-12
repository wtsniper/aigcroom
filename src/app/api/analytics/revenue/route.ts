import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30d'

    let startDate = new Date()
    if (period === '7d') startDate.setDate(startDate.getDate() - 7)
    else if (period === '30d') startDate.setDate(startDate.getDate() - 30)
    else if (period === '90d') startDate.setDate(startDate.getDate() - 90)
    // 'all' uses default

    const clicks = await prisma.affiliateClick.findMany({
      where: { clickedAt: { gte: startDate } },
      include: { link: true },
    })

    // 按天统计
    const dailyMap = new Map<string, { clicks: number; conversions: number; revenue: number }>()
    
    for (const click of clicks) {
      const date = click.clickedAt.toISOString().split('T')[0]
      if (!dailyMap.has(date)) {
        dailyMap.set(date, { clicks: 0, conversions: 0, revenue: 0 })
      }
      const day = dailyMap.get(date)!
      day.clicks += 1
      // 模拟：每 100 次点击有 1 次转化，每次转化 $5
      if (day.clicks % 100 === 0) {
        day.conversions += 1
        day.revenue += 5
      }
    }

    const dailyStats = Array.from(dailyMap.entries())
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date))

    return NextResponse.json({ dailyStats })
  } catch (error) {
    console.error('Revenue analytics error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
