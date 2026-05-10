'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewTool() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
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
    setLoading(true)

    try {
      const res = await fetch('/api/tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          priceMonthly: formData.priceMonthly ? parseFloat(formData.priceMonthly) : null,
          priceYearly: formData.priceYearly ? parseFloat(formData.priceYearly) : null,
          rating: parseFloat(formData.rating as any) || 0,
          ratingFeatures: parseFloat(formData.ratingFeatures as any) || 0,
          ratingEase: parseFloat(formData.ratingEase as any) || 0,
          ratingValue: parseFloat(formData.ratingValue as any) || 0,
          ratingSupport: parseFloat(formData.ratingSupport as any) || 0,
          tags: formData.tags.split('\n').filter(t => t.trim()),
          pros: formData.pros.split('\n').filter(p => p.trim()),
          cons: formData.cons.split('\n').filter(c => c.trim()),
        }),
      })

      if (res.ok) {
        router.push('/admin/tools')
      } else {
        const data = await res.json()
        alert(data.error || '创建失败')
      }
    } catch (error) {
      console.error('Error creating tool:', error)
      alert('创建失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">添加工具</h1>
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
              placeholder="例如：ChatGPT"
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
              placeholder="例如：chatgpt"
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
              placeholder="工具的简要描述"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Logo URL</label>
            <input
              type="url"
              name="logoUrl"
              value={formData.logoUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="https://example.com/logo.png"
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
              placeholder="https://example.com"
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
              placeholder="你的联盟推广链接"
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
              placeholder="19.99"
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
              placeholder="199.99"
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
              placeholder="AI&#10;聊天机器人&#10;写作"
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
              placeholder="易于使用&#10;功能强大&#10;支持优秀"
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
              placeholder="价格昂贵&#10;免费版功能有限"
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
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? '创建中...' : '创建工具'}
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
