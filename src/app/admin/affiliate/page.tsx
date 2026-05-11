'use client'

import { useState, useEffect } from 'react'

interface Tool {
  id: string
  name: string
}

interface AffiliateLink {
  id: string
  toolId: string | null
  url: string
  slug: string
  clicks: number
  conversions: number
  revenue: number
  createdAt: string
  tool: {
    id: string
    name: string
    slug: string
  } | null
}

export default function AdminAffiliate() {
  const [links, setLinks] = useState<AffiliateLink[]>([])
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingLink, setEditingLink] = useState<AffiliateLink | null>(null)
  const [formData, setFormData] = useState({
    toolId: '',
    url: '',
    slug: '',
  })

  useEffect(() => {
    fetchLinks()
    fetchTools()
  }, [])

  const fetchLinks = async () => {
    try {
      const res = await fetch('/api/affiliate')
      if (res.ok) {
        const data = await res.json()
        setLinks(data)
      }
    } catch (error) {
      console.error('Error fetching affiliate links:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTools = async () => {
    try {
      const res = await fetch('/api/tools')
      if (res.ok) {
        const data = await res.json()
        setTools(data)
      }
    } catch (error) {
      console.error('Error fetching tools:', error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleEdit = (link: AffiliateLink) => {
    setEditingLink(link)
    setFormData({
      toolId: link.toolId || '',
      url: link.url,
      slug: link.slug,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this affiliate link?')) return
    
    try {
      const res = await fetch(`/api/affiliate/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchLinks()
      }
    } catch (error) {
      console.error('Error deleting affiliate link:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingLink 
        ? `/api/affiliate/${editingLink.id}`
        : '/api/affiliate'
      
      const method = editingLink ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          toolId: formData.toolId || null,
        }),
      })
      
      if (res.ok) {
        setShowForm(false)
        setEditingLink(null)
        setFormData({
          toolId: '',
          url: '',
          slug: '',
        })
        fetchLinks()
      }
    } catch (error) {
      console.error('Error saving affiliate link:', error)
    }
  }

  const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0)
  const totalConversions = links.reduce((sum, link) => sum + link.conversions, 0)
  const totalRevenue = links.reduce((sum, link) => sum + link.revenue, 0)
  const conversionRate = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(2) : '0.00'

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">联盟链接管理</h1>
        <button
          onClick={() => {
            setShowForm(true)
            setEditingLink(null)
            setFormData({ toolId: '', url: '', slug: '' })
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + 新建链接
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-500 mb-1">链接总数</div>
          <div className="text-2xl font-bold">{links.length}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-500 mb-1">总点击数</div>
          <div className="text-2xl font-bold">{totalClicks.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-500 mb-1">转化数</div>
          <div className="text-2xl font-bold">{totalConversions.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-500 mb-1">收入</div>
          <div className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</div>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingLink ? '编辑链接' : '新建联盟链接'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">关联工具</label>
              <select
                name="toolId"
                value={formData.toolId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">无</option>
                {tools.map(tool => (
                  <option key={tool.id} value={tool.id}>{tool.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">别名 *</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="例如：chatgpt-promo"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">联盟链接 *</label>
              <input
                type="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="https://example.com/?ref=yourid"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              {editingLink ? '更新' : '创建'}链接
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false)
                setEditingLink(null)
              }}
              className="text-gray-600 hover:text-gray-800"
            >
              取消
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">工具</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">别名</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">点击</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">转化</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">收入</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">转化率</th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {links.map((link) => {
              const rate = link.clicks > 0 ? ((link.conversions / link.clicks) * 100).toFixed(2) : '0.00'
              return (
                <tr key={link.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium">{link.tool?.name || '通用'}</div>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono">{link.slug}</td>
                  <td className="px-6 py-4 text-sm">{link.clicks.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm">{link.conversions.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-green-600 font-medium">${link.revenue.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm">{rate}%</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleEdit(link)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(link.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      删除
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        
        {links.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            未找到联盟链接
          </div>
        )}
      </div>
    </div>
  )
}
