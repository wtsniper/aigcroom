'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function EditTool() {
  const router = useRouter()
  const params = useParams()
  const toolId = params?.id as string
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    logoUrl: '',
    websiteUrl: '',
    affiliateUrl: '',
    category: 'Writing',
    rating: 0,
    ratingFeatures: 0,
    ratingEase: 0,
    ratingValue: 0,
    ratingSupport: 0,
    pricingType: 'FREE',
    priceMonthly: '',
    priceYearly: '',
    tags: '',
    pros: '',
    cons: '',
    isFeatured: false,
  })

  useEffect(() => {
    fetchTool()
  }, [toolId])

  const fetchTool = async () => {
    try {
      const res = await fetch(`/api/tools/${toolId}`)
      if (res.ok) {
        const data = await res.json()
        setFormData({
          name: data.name || '',
          slug: data.slug || '',
          description: data.description || '',
          logoUrl: data.logoUrl || '',
          websiteUrl: data.websiteUrl || '',
          affiliateUrl: data.affiliateUrl || '',
          category: data.category || 'Writing',
          rating: data.rating || 0,
          ratingFeatures: data.ratingFeatures || 0,
          ratingEase: data.ratingEase || 0,
          ratingValue: data.ratingValue || 0,
          ratingSupport: data.ratingSupport || 0,
          pricingType: data.pricingType || 'FREE',
          priceMonthly: data.priceMonthly || '',
          priceYearly: data.priceYearly || '',
          tags: Array.isArray(data.tags) ? data.tags.join('\n') : data.tags || '',
          pros: Array.isArray(data.pros) ? data.pros.join('\n') : data.pros || '',
          cons: Array.isArray(data.cons) ? data.cons.join('\n') : data.cons || '',
          isFeatured: data.isFeatured || false,
        })
      }
    } catch (error) {
      console.error('Error fetching tool:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch(`/api/tools/${toolId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          priceMonthly: formData.priceMonthly ? parseFloat(formData.priceMonthly as any) : null,
          priceYearly: formData.priceYearly ? parseFloat(formData.priceYearly as any) : null,
          tags: formData.tags.split('\n').filter((t: string) => t.trim()),
          pros: formData.pros.split('\n').filter((p: string) => p.trim()),
          cons: formData.cons.split('\n').filter((c: string) => c.trim()),
        }),
      })

      if (res.ok) {
        router.push('/admin/tools')
      } else {
        alert('Failed to update tool')
      }
    } catch (error) {
      console.error('Error updating tool:', error)
      alert('Failed to update tool')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-6">加载中...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">编辑工具</h1>
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-800"
        >
          ← 返回
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">工具名称 *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">URL别名 *</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">描述 *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Logo 路径</label>
            <input
              type="text"
              name="logoUrl"
              value={formData.logoUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="/logos/tool-slug.png"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">官网URL *</label>
            <input
              type="url"
              name="websiteUrl"
              value={formData.websiteUrl}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">联盟链接URL</label>
            <input
              type="url"
              name="affiliateUrl"
              value={formData.affiliateUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">分类 *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="Writing">写作</option>
              <option value="Design">设计</option>
              <option value="Coding">编程</option>
              <option value="Video">视频</option>
              <option value="Audio">音频</option>
              <option value="Marketing">营销</option>
              <option value="Business">商业</option>
              <option value="Other">其他</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">定价类型 *</label>
            <select
              name="pricingType"
              value={formData.pricingType}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="FREE">免费</option>
              <option value="FREEMIUM">免费增值</option>
              <option value="PAID">付费</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">月费价格 ($)</label>
            <input
              type="number"
              name="priceMonthly"
              value={formData.priceMonthly}
              onChange={handleChange}
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">年费价格 ($)</label>
            <input
              type="number"
              name="priceYearly"
              value={formData.priceYearly}
              onChange={handleChange}
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">标签（每行一个）</label>
            <textarea
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">优点（每行一个）</label>
            <textarea
              name="pros"
              value={formData.pros}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">缺点（每行一个）</label>
            <textarea
              name="cons"
              value={formData.cons}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium">推荐工具</span>
            </label>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? '保存中...' : '保存修改'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-800"
          >
            取消
          </button>
        </div>
      </form>
    </div>
  )
}
