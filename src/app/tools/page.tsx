'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'

const PAGE_SIZE = 9

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
  createdAt?: string
}

type SortBy = 'rating' | 'name' | 'newest'

export default function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [priceFilter, setPriceFilter] = useState('ALL')
  const [sortBy, setSortBy] = useState<SortBy>('rating')
  const [page, setPage] = useState(1)

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

  const categories = useMemo(
    () => ['ALL', ...Array.from(new Set(tools.map((t) => t.category)))],
    [tools]
  )

  const filteredTools = useMemo(() => {
    const q = searchTerm.toLowerCase()
    let list = tools.filter((tool) => {
      const matchesSearch =
        tool.name.toLowerCase().includes(q) || tool.description.toLowerCase().includes(q)
      const matchesCategory = categoryFilter === 'ALL' || tool.category === categoryFilter
      const matchesPrice =
        priceFilter === 'ALL' ||
        (priceFilter === 'FREE' && tool.pricingType === 'FREE') ||
        (priceFilter === 'FREEMIUM' && tool.pricingType === 'FREEMIUM') ||
        (priceFilter === 'PAID' && tool.pricingType === 'PAID')
      return matchesSearch && matchesCategory && matchesPrice
    })

    list = [...list].sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return tb - ta
    })

    return list
  }, [tools, searchTerm, categoryFilter, priceFilter, sortBy])

  const totalPages = Math.max(1, Math.ceil(filteredTools.length / PAGE_SIZE))

  // Clamp page inline to avoid race conditions between two competing useEffects
  const effectivePage = Math.min(page, totalPages)

  const pagedTools = useMemo(() => {
    const start = (effectivePage - 1) * PAGE_SIZE
    return filteredTools.slice(start, start + PAGE_SIZE)
  }, [filteredTools, effectivePage])

  useEffect(() => {
    setPage(1)
  }, [searchTerm, categoryFilter, priceFilter, sortBy])

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

      <div className="flex flex-col lg:flex-row flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search tools..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'ALL' ? 'All Categories' : cat}
            </option>
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
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortBy)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        >
          <option value="rating">Sort: Highest rating</option>
          <option value="name">Sort: Name (A–Z)</option>
          <option value="newest">Sort: Newest</option>
        </select>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        Showing {filteredTools.length === 0 ? 0 : (effectivePage - 1) * PAGE_SIZE + 1}–
        {Math.min(effectivePage * PAGE_SIZE, filteredTools.length)} of {filteredTools.length} tools
      </p>

      {filteredTools.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No tools found matching your criteria
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pagedTools.map((tool) => (
              <div
                key={tool.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {tool.logoUrl ? (
                      <img src={tool.logoUrl} alt={tool.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl">🤖</span>
                    )}
                  </div>
                  <div>
                    <Link href={`/tools/${tool.slug}`} className="text-lg font-semibold hover:text-blue-600">
                      {tool.name}
                    </Link>
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
                  <Link href={`/tools/${tool.slug}`} className="text-blue-600 text-sm font-medium hover:underline">
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10">
              <button
                type="button"
                disabled={effectivePage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {effectivePage} / {totalPages}
              </span>
              <button
                type="button"
                disabled={effectivePage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
