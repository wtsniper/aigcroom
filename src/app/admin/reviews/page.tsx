'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Review {
  id: string
  title: string
  slug: string
  excerpt: string
  status: string
  createdAt: string
  publishedAt: string | null
  author: {
    name: string | null
    email: string
  }
  tool: {
    name: string
  } | null
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews')
      if (res.ok) {
        const data = await res.json()
        setReviews(data)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这篇评测吗？')) return
    
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchReviews()
      } else {
        const data = await res.json()
        alert(data.error || '删除失败')
      }
    } catch (error) {
      console.error('Error deleting review:', error)
      alert('删除失败')
    }
  }

  const handlePublish = async (id: string) => {
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PUBLISHED' }),
      })
      if (res.ok) {
        fetchReviews()
      }
    } catch (error) {
      console.error('Error publishing review:', error)
    }
  }

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || review.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return <div className="p-6">加载中...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">评测管理</h1>
        <Link
          href="/admin/reviews/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          新建评测
        </Link>
      </div>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="搜索评测..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="ALL">全部状态</option>
          <option value="DRAFT">草稿</option>
          <option value="PUBLISHED">已发布</option>
          <option value="ARCHIVED">已归档</option>
        </select>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">标题</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">工具</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">作者</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">日期</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredReviews.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  没有找到评测。点击"新建评测"创建。
                </td>
              </tr>
            ) : (
              filteredReviews.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{review.title}</div>
                    <div className="text-sm text-gray-500">{review.excerpt?.substring(0, 50)}...</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {review.tool?.name || '-'}
                  </td>
                  <td className="px-6 py-4">
                    {review.status === 'PUBLISHED' ? (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">已发布</span>
                    ) : review.status === 'DRAFT' ? (
                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">草稿</span>
                    ) : (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">已归档</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {review.author?.name || review.author?.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      {review.status === 'DRAFT' && (
                        <button
                          onClick={() => handlePublish(review.id)}
                          className="text-green-600 hover:text-green-800"
                        >
                          发布
                        </button>
                      )}
                      <Link
                        href={`/admin/reviews/edit/${review.id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        编辑
                      </Link>
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
