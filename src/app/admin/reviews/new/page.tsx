'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Tool {
  id: string
  name: string
}

export default function NewReview() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [tools, setTools] = useState<Tool[]>([])
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    toolId: '',
    status: 'DRAFT',
  })

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
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    if (name === 'title') {
      const slug = value.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setFormData(prev => ({ ...prev, slug }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          toolId: formData.toolId || null,
          authorId: '1',
        }),
      })

      if (res.ok) {
        router.push('/admin/reviews')
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to create review')
      }
    } catch (error) {
      console.error('Error creating review:', error)
      alert('Failed to create review')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Publish New Review</h1>
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-800"
        >
          ← Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g. ChatGPT vs Claude: Which is Better?"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Slug *</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="chatgpt-vs-claude"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Excerpt *</label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              required
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Brief summary of the review"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Related Tool</label>
            <select
              name="toolId"
              value={formData.toolId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">None</option>
              {tools.map(tool => (
                <option key={tool.id} value={tool.id}>{tool.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Content * (Markdown)</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={15}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono"
              placeholder="# Introduction&#10;&#10;Write your review content here using Markdown...&#10;&#10;## Features&#10;&#10;- Feature 1&#10;- Feature 2&#10;&#10;## Conclusion&#10;&#10;Your conclusion here..."
            />
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Review'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
