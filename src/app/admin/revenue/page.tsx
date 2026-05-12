'use client'

import { useState, useEffect } from 'react'

interface AffiliateLink {
  id: string
  slug: string
  url: string
  toolId: string | null
  platform?: string
  clicks: number
  conversions: number
  revenue: number
  createdAt: string
  tool?: { name: string; slug: string } | null
}

interface DailyStat {
  date: string
  clicks: number
  conversions: number
  revenue: number
}

export default function AdminRevenue() {
  const [links, setLinks] = useState<AffiliateLink[]>([])
  const [dailyStats, setDailyStats] = useState<DailyStat[]>([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | 'all'>('30d')

  useEffect(() => {
    fetchData()
  }, [period])

  const fetchData = async () => {
    try {
      const [linksRes, statsRes] = await Promise.all([
        fetch('/api/affiliate'),
        fetch(`/api/analytics/revenue?period=${period}`),
      ])

      if (linksRes.ok) {
        const data = await linksRes.json()
        setLinks(data)
      }

      if (statsRes.ok) {
        const data = await statsRes.json()
        setDailyStats(data.dailyStats || [])
      }
    } catch (error) {
      console.error('Error fetching revenue data:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalClicks = links.reduce((sum, l) => sum + l.clicks, 0)
  const totalConversions = links.reduce((sum, l) => sum + l.conversions, 0)
  const totalRevenue = links.reduce((sum, l) => sum + l.revenue, 0)
  const avgConversionRate = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(2) : '0.00'
  const avgRevenuePerClick = totalClicks > 0 ? (totalRevenue / totalClicks).toFixed(4) : '0.0000'

  if (loading) {
    return <div className="p-6">加载中...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">收入报表</h1>
        <div className="flex gap-2">
          {(['7d', '30d', '90d', 'all'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                period === p
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {p === '7d' ? '7天' : p === '30d' ? '30天' : p === '90d' ? '90天' : '全部'}
            </button>
          ))}
        </div>
      </div>

      {/* 总览卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-500 mb-1">总收入</div>
          <div className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-500 mb-1">总点击</div>
          <div className="text-2xl font-bold">{totalClicks.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-500 mb-1">总转化</div>
          <div className="text-2xl font-bold">{totalConversions.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-500 mb-1">转化率</div>
          <div className="text-2xl font-bold text-blue-600">{avgConversionRate}%</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-500 mb-1">每点击收入</div>
          <div className="text-2xl font-bold text-purple-600">${avgRevenuePerClick}</div>
        </div>
      </div>

      {/* 各平台收入分布 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">各平台收入分布</h2>
        <div className="space-y-3">
          {Object.entries(
            links.reduce((acc, link) => {
              const platform = (link as any).platform || '其他'
              if (!acc[platform]) acc[platform] = { clicks: 0, conversions: 0, revenue: 0, count: 0 }
              acc[platform].clicks += link.clicks
              acc[platform].conversions += link.conversions
              acc[platform].revenue += link.revenue
              acc[platform].count += 1
              return acc
            }, {} as Record<string, { clicks: number; conversions: number; revenue: number; count: number }>)
          ).map(([platform, data]) => {
            const percentage = totalRevenue > 0 ? ((data.revenue / totalRevenue) * 100).toFixed(1) : '0'
            return (
              <div key={platform} className="flex items-center gap-4">
                <div className="w-32 text-sm font-medium">{platform}</div>
                <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                  <div
                    className="bg-green-500 h-full rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${Math.max(parseFloat(percentage), 5)}%` }}
                  >
                    <span className="text-xs text-white font-medium">{percentage}%</span>
                  </div>
                </div>
                <div className="w-24 text-sm text-right text-green-600 font-medium">
                  ${data.revenue.toFixed(2)}
                </div>
                <div className="w-16 text-sm text-right text-gray-500">
                  {data.clicks} 点击
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 收入排名 */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-8">
        <h2 className="text-lg font-semibold p-6 pb-0">联盟链接收入排名</h2>
        <table className="w-full mt-4">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">排名</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">工具</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">平台</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">别名</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">点击</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">转化</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">收入</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">转化率</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {[...links]
              .sort((a, b) => b.revenue - a.revenue)
              .map((link, index) => {
                const rate = link.clicks > 0 ? ((link.conversions / link.clicks) * 100).toFixed(2) : '0.00'
                return (
                  <tr key={link.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                        index === 0 ? 'bg-yellow-100 text-yellow-700' :
                        index === 1 ? 'bg-gray-100 text-gray-600' :
                        index === 2 ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-50 text-gray-400'
                      }`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">{link.tool?.name || '通用'}</td>
                    <td className="px-6 py-4 text-sm">{(link as any).platform || '-'}</td>
                    <td className="px-6 py-4 text-sm font-mono bg-gray-50 rounded">{link.slug}</td>
                    <td className="px-6 py-4 text-sm">{link.clicks.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm">{link.conversions.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-green-600 font-bold">${link.revenue.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm">{rate}%</td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>

      {/* 收入趋势（简化版） */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">收入趋势</h2>
        {dailyStats.length > 0 ? (
          <div className="flex items-end gap-1 h-32">
            {dailyStats.map((stat, i) => {
              const maxRevenue = Math.max(...dailyStats.map(s => s.revenue), 1)
              const height = Math.max((stat.revenue / maxRevenue) * 100, 2)
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-green-500 rounded-t hover:bg-green-600 transition-colors relative group"
                    style={{ height: `${height}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                      ${stat.revenue.toFixed(2)}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">{stat.date.slice(5)}</span>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-8">暂无数据，添加联盟链接后会自动统计</p>
        )}
      </div>
    </div>
  )
}
