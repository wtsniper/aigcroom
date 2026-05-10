'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Tool {
  id: string
  name: string
  slug: string
  description: string
  logoUrl: string
  category: string
  rating: number
  pricingType: string
  priceMonthly: number | null
  tags: string | null
  isFeatured: boolean
}

export default function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [priceFilter, setPriceFilter] = useState('ALL')

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

  const categories = ['ALL', ...Array.from(new Set(tools.map(t => t.category)))]

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'ALL' || tool.category === categoryFilter
    const matchesPrice = priceFilter === 'ALL' || 
                        (priceFilter === 'FREE' && tool.pricingType === 'FREE') ||
                        (priceFilter === 'FREEMIUM' && tool.pricingType === 'FREEMIUM') ||
                        (priceFilter === 'PAID' && tool.pricingType === 'PAID')
    return matchesSearch && matchesCategory && matchesPrice
  })

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center py-12">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">Browse AI Tools</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search tools..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat === 'ALL' ? 'All Categories' : cat}</option>
          ))}
        </select>
        <select
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="ALL">All Pricing</option>
          <option value="FREE">Free</option>
          <option value="FREEMIUM">Freemium</option>
          <option value="PAID">Paid</option>
        </select>
      </div>

      {filteredTools.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No tools found matching your criteria
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <div key={tool.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  {tool.logoUrl ? (
                    <img src={tool.logoUrl} alt={tool.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl">🤖</span>
                  )}
                </div>
                <div>
                  <Link href={`/tools/${tool.slug}`} className="text-lg font-semibold hover:text-blue-600">{tool.name}</Link>
                  <p className="text-sm text-gray-500">{tool.description}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{tool.category}</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">{tool.pricingType}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-green-600 font-medium">⭐ {tool.rating.toFixed(1)}</span>
                <Link href={`/tools/${tool.slug}`} className="text-blue-600 text-sm font-medium hover:underline">View Details →</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
