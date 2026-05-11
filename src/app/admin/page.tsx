'use client'

import { useState, useEffect } from 'react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalTools: 0,
    totalReviews: 0,
    totalUsers: 0,
    monthlyRevenue: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/analytics')
      if (res.ok) {
        const data = await res.json()
        setStats({
          totalTools: data.totalTools,
          totalReviews: data.totalReviews,
          totalUsers: data.totalUsers,
          monthlyRevenue: data.totalAffiliateRevenue || 0,
        })
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">仪表盘</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{stats.totalTools}</div>
          <div className="text-sm text-gray-500">AI工具总数</div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{stats.totalReviews}</div>
          <div className="text-sm text-gray-500">评测文章总数</div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{stats.totalUsers}</div>
          <div className="text-sm text-gray-500">用户总数</div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600">${stats.monthlyRevenue.toFixed(2)}</div>
          <div className="text-sm text-gray-500">本月收入</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">快捷操作</h2>
          <div className="space-y-3">
            <a
              href="/admin/tools/new"
              className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ➕ 添加新工具
            </a>
            <a
              href="/admin/reviews/new"
              className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ✍️ 发布新评测
            </a>
            <a
              href="/admin/solutions"
              className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              💼 管理解决方案
            </a>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">最近动态</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <span className="text-gray-400">📝</span>
              <div>
                <span className="text-gray-900">系统就绪</span>
                <span className="text-gray-400 ml-2">等待内容发布</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
