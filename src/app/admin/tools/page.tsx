'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatRating } from '@/lib/ratings'

interface Tool {
  id: string
  name: string
  slug: string
  description: string
  category: string
  rating: number
  pricingType: string
  priceMonthly: number | null
  isFeatured: boolean
  createdAt: string
}

export default function AdminTools() {
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingTool, setEditingTool] = useState<Tool | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchTools()
  }, [])

  const fetchTools = async () => {
    try {
      const res = await fetch('/api/tools')
      if (res.ok) {
        const data = await res.json()
        setTools(data)
      }
    } catch (error) {
      console.error('Error fetching tools:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个工具吗？')) return
    
    try {
      const res = await fetch(`/api/tools/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchTools()
      } else {
        const data = await res.json()
        alert(data.error || '删除失败')
      }
    } catch (error) {
      console.error('Error deleting tool:', error)
      alert('删除失败')
    }
  }

  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <div className="p-6">加载中...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">工具管理</h1>
        <Link
          href="/admin/tools/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          添加工具
        </Link>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="搜索工具..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">名称</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">分类</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">评分</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">定价</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">推荐</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredTools.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  没有找到工具。点击"添加工具"创建。
                </td>
              </tr>
            ) : (
              filteredTools.map((tool) => (
                <tr key={tool.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{tool.name}</div>
                    <div className="text-sm text-gray-500">{tool.description?.substring(0, 50)}...</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{tool.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatRating(tool.rating)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {tool.pricingType}{tool.priceMonthly ? ` - $${tool.priceMonthly}/月` : ''}
                  </td>
                  <td className="px-6 py-4">
                    {tool.isFeatured ? (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">推荐</span>
                    ) : (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">否</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/tools/edit/${tool.id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        编辑
                      </Link>
                      <button
                        onClick={() => handleDelete(tool.id)}
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
