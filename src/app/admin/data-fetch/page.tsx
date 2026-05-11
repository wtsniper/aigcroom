'use client'

import { useState } from 'react'

interface FetchResult {
  success: boolean;
  message: string;
  reviews?: any[];
}

export default function DataFetchPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<FetchResult | null>(null)
  const [fetchType, setFetchType] = useState<'blogger' | 'scheduled'>('blogger')

  const handleFetch = async () => {
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch('/api/admin/fetch-reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: fetchType }),
      })

      const data = await res.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        message: `抓取失败: ${error}`,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">数据抓取管理</h1>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">手动抓取评测文章</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">抓取类型</label>
          <select
            value={fetchType}
            onChange={(e) => setFetchType(e.target.value as 'blogger' | 'scheduled')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="blogger">知名博主最新文章</option>
            <option value="scheduled">执行定时任务</option>
          </select>
        </div>

        <button
          onClick={handleFetch}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '抓取中...' : '开始抓取'}
        </button>
      </div>

      {result && (
        <div className={`rounded-lg border p-6 ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <h3 className="font-semibold mb-2">{result.success ? '✅ 抓取成功' : '❌ 抓取失败'}</h3>
          <p className="text-sm">{result.message}</p>
          
          {result.reviews && result.reviews.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">找到 {result.reviews.length} 篇文章</h4>
              <div className="space-y-2">
                {result.reviews.map((review, index) => (
                  <div key={index} className="bg-white p-3 rounded border">
                    <div className="font-medium">{review.title}</div>
                    <div className="text-sm text-gray-500">作者: {review.author}</div>
                    <div className="text-sm text-gray-500">工具: {review.toolName}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
        <h2 className="text-lg font-semibold mb-4">定时任务状态</h2>
        
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">博主文章抓取</h3>
                <p className="text-sm text-gray-500">每6小时自动执行一次</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">已启用</span>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              上次执行: 暂未执行
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">工具数据更新</h3>
                <p className="text-sm text-gray-500">每天午夜自动执行</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">已启用</span>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              上次执行: 暂未执行
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>提示：</strong>定时任务需要部署到支持Cron的平台（如Vercel、Railway）才能自动执行。
            本地开发时可以手动触发测试。
          </p>
        </div>
      </div>
    </div>
  )
}
