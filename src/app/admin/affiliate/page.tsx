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
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    toolId: '',
    url: '',
    slug: '',
    platform: '',
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
      platform: (link as any).platform || '',
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个联盟链接吗？')) return
    
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
          platform: '',
        })
        fetchLinks()
      }
    } catch (error) {
      console.error('Error saving affiliate link:', error)
    }
  }

  const copyTrackingLink = (slug: string) => {
    const trackingUrl = `${window.location.origin}/api/affiliate/track/${slug}`
    navigator.clipboard.writeText(trackingUrl)
    setCopiedId(slug)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const copyAffiliateUrl = (url: string, slug: string) => {
    navigator.clipboard.writeText(url)
    setCopiedId(slug)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0)
  const totalConversions = links.reduce((sum, link) => sum + link.conversions, 0)
  const totalRevenue = links.reduce((sum, link) => sum + link.revenue, 0)
  const conversionRate = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(2) : '0.00'

  if (loading) {
    return <div className="p-6">加载中...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">联盟链接管理</h1>
        <button
          onClick={() => {
            setShowForm(true)
            setEditingLink(null)
            setFormData({ toolId: '', url: '', slug: '', platform: '' })
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + 新建链接
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
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
          <div className="text-sm text-gray-500 mb-1">总收入</div>
          <div className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-500 mb-1">转化率</div>
          <div className="text-2xl font-bold text-blue-600">{conversionRate}%</div>
        </div>
      </div>

      {/* 新手引导 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">如何使用联盟链接赚钱？</h3>
        <ol className="text-sm text-blue-800 space-y-1">
          <li>1. 注册联盟计划：访问 PartnerStack、Impact、ShareASale 等平台申请账号</li>
          <li>2. 获取推广链接：从联盟平台获取你的专属推广链接</li>
          <li>3. 添加到后台：在这里创建联盟链接，填入推广 URL</li>
          <li>4. 追踪链接会自动生成：格式为 <code className="bg-white px-1 rounded">/api/affiliate/track/[别名]</code></li>
          <li>5. 将追踪链接嵌入工具详情页，用户点击后自动跳转到推广链接并记录数据</li>
        </ol>
      </div>

      {/* 表单 */}
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
                <option value="">无（通用链接）</option>
                {tools.map(tool => (
                  <option key={tool.id} value={tool.id}>{tool.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">联盟平台</label>
              <input
                type="text"
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="例如：PartnerStack, Impact, Amazon"
              />
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
              <label className="block text-sm font-medium mb-2">联盟推广链接 *</label>
              <input
                type="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="https://partnerstack.com/xxx?ref=yourid"
              />
              <p className="text-xs text-gray-500 mt-1">从联盟平台获取的专属推广链接</p>
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

      {/* 链接列表 */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">工具</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">平台</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">别名</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">点击</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">转化</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">收入</th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {links.map((link) => {
              const rate = link.clicks > 0 ? ((link.conversions / link.clicks) * 100).toFixed(2) : '0.00'
              const trackingUrl = `/api/affiliate/track/${link.slug}`
              return (
                <tr key={link.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium">{link.tool?.name || '通用'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{(link as any).platform || '-'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{link.slug}</span>
                      <button
                        onClick={() => copyTrackingLink(link.slug)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        {copiedId === link.slug ? '已复制' : '复制追踪链接'}
                      </button>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{trackingUrl}</div>
                  </td>
                  <td className="px-6 py-4 text-sm">{link.clicks.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm">{link.conversions.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-green-600 font-medium">${link.revenue.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => copyAffiliateUrl(link.url, link.id + '-url')}
                      className="text-gray-500 hover:text-gray-700 mr-3 text-sm"
                    >
                      {copiedId === link.id + '-url' ? '已复制' : '复制原链接'}
                    </button>
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
            暂无联盟链接，点击上方按钮创建第一个
          </div>
        )}
      </div>
    </div>
  )
}
