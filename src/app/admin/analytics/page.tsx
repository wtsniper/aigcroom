'use client'

import { useState, useEffect } from 'react'

interface AnalyticsData {
  totalUsers: number
  totalTools: number
  totalReviews: number
  totalSolutions: number
  totalAffiliateClicks: number
  totalAffiliateConversions: number
  totalAffiliateRevenue: number
  totalSubscriptions: number
  paidSubscriptions: number
  recentUsers: Array<{
    id: string
    name: string | null
    email: string
    createdAt: string
  }>
  recentReviews: Array<{
    id: string
    title: string
    status: string
    createdAt: string
  }>
  topTools: Array<{
    id: string
    name: string
    clicks: number
    revenue: number
  }>
  monthlyRevenue: Array<{
    month: string
    revenue: number
  }>
}

export default function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics')
      if (res.ok) {
        const analyticsData = await res.json()
        setData(analyticsData)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  if (!data) {
    return <div className="p-6">Failed to load</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-gray-500 mb-1">Total Users</div>
          <div className="text-3xl font-bold">{data.totalUsers.toLocaleString()}</div>
          <div className="text-xs text-gray-400 mt-2">Registered users</div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-gray-500 mb-1">Total Tools</div>
          <div className="text-3xl font-bold">{data.totalTools.toLocaleString()}</div>
          <div className="text-xs text-gray-400 mt-2">AI tools listed</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-gray-500 mb-1">Total Reviews</div>
          <div className="text-3xl font-bold">{data.totalReviews.toLocaleString()}</div>
          <div className="text-xs text-gray-400 mt-2">Published articles</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-gray-500 mb-1">Paid Subscribers</div>
          <div className="text-3xl font-bold text-green-600">{data.paidSubscriptions.toLocaleString()}</div>
          <div className="text-xs text-gray-400 mt-2">Active paying users</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-gray-500 mb-1">Affiliate Clicks</div>
          <div className="text-3xl font-bold">{data.totalAffiliateClicks.toLocaleString()}</div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-gray-500 mb-1">Conversions</div>
          <div className="text-3xl font-bold">{data.totalAffiliateConversions.toLocaleString()}</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-gray-500 mb-1">Affiliate Revenue</div>
          <div className="text-3xl font-bold text-green-600">${data.totalAffiliateRevenue.toFixed(2)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Top Performing Tools</h2>
          <div className="space-y-3">
            {data.topTools.length > 0 ? (
              data.topTools.map((tool, index) => (
                <div key={tool.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                    <span className="font-medium">{tool.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{tool.clicks} clicks</div>
                    <div className="text-xs text-green-600">${tool.revenue.toFixed(2)}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-center py-4">No data yet</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Users</h2>
          <div className="space-y-3">
            {data.recentUsers.length > 0 ? (
              data.recentUsers.slice(0, 5).map((user) => (
                <div key={user.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                    <div className="font-medium">{user.name || user.email}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-center py-4">No users yet</div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Reviews</h2>
        <div className="space-y-3">
          {data.recentReviews.length > 0 ? (
            data.recentReviews.slice(0, 5).map((review) => (
              <div key={review.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                <div>
                  <div className="font-medium">{review.title}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  review.status === 'PUBLISHED' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {review.status}
                </span>
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-center py-4">No reviews yet</div>
          )}
        </div>
      </div>
    </div>
  )
}
