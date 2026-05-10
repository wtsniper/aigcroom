'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Tool {
  id: string
  name: string
  slug: string
  description: string
  logoUrl: string
  websiteUrl?: string
  website?: string
  affiliateUrl?: string | null
  category: string
  rating?: number
  ratingFeatures?: number
  ratingEase?: number
  ratingValue?: number
  ratingSupport?: number
  pricingType?: string
  pricing?: string
  priceMonthly?: number | null
  priceYearly?: number | null
  tags?: string | string[] | null
  pros?: string | string[] | null
  cons?: string | string[] | null
  features?: string[]
}

export default function ToolDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [tool, setTool] = useState<Tool | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTool()
  }, [slug])

  const fetchTool = async () => {
    try {
      const res = await fetch(`/api/tools`)
      if (res.ok) {
        const tools = await res.json()
        const foundTool = tools.find((t: Tool) => t.slug === slug)
        if (foundTool) {
          setTool(foundTool)
        }
      }
    } catch (error) {
      console.error('Error fetching tool:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center py-12">Loading...</div>
      </div>
    )
  }

  if (!tool) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Tool Not Found</h1>
          <Link href="/tools" className="text-blue-600 hover:underline">Back to Tools</Link>
        </div>
      </div>
    )
  }

  const tags = tool.tags ? (Array.isArray(tool.tags) ? tool.tags : (() => { try { return JSON.parse(tool.tags) } catch { return [] } })()) : []
  const pros = tool.pros ? (Array.isArray(tool.pros) ? tool.pros : (() => { try { return JSON.parse(tool.pros) } catch { return [] } })()) : []
  const cons = tool.cons ? (Array.isArray(tool.cons) ? tool.cons : (() => { try { return JSON.parse(tool.cons) } catch { return [] } })()) : []
  const features = tool.features || []
  const websiteUrl = tool.websiteUrl || tool.website || '#'
  const pricingType = tool.pricingType || tool.pricing || 'Unknown'
  const rating = tool.rating || 0
  const ratingFeatures = tool.ratingFeatures || rating
  const ratingEase = tool.ratingEase || rating
  const ratingValue = tool.ratingValue || rating
  const ratingSupport = tool.ratingSupport || rating

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-4 text-sm text-gray-500">
        <Link href="/" className="hover:text-blue-600">Home</Link> &gt; 
        <Link href="/tools" className="hover:text-blue-600"> Tools</Link> &gt; 
        <span> {tool.name}</span>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
            {tool.logoUrl ? (
              <img src={tool.logoUrl} alt={tool.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden') }} />
            ) : null}
            <span className={`text-3xl ${tool.logoUrl ? 'hidden' : ''}`}>🤖</span>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{tool.name}</h1>
            <p className="text-gray-600 mt-2">{tool.description}</p>
            <div className="mt-2 text-sm text-gray-500">
              <span className="bg-gray-100 px-2 py-1 rounded">{tool.category}</span>
              <span className="ml-2 bg-gray-100 px-2 py-1 rounded">{pricingType}</span>
            </div>
            <div className="mt-4 flex gap-2 flex-wrap">
              {tags.map((tag: string, index: number) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">{tag}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 flex gap-4">
          <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
            🌐 Visit Website
          </a>
          {tool.affiliateUrl && (
            <a href={tool.affiliateUrl} target="_blank" rel="noopener noreferrer" className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700">
              💰 Try for Free
            </a>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">📊 Ratings</h2>
        <div className="text-4xl font-bold text-blue-600 mb-4">{rating.toFixed(1)} / 10</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-2xl font-bold text-blue-600">{ratingFeatures.toFixed(1)}</div>
            <div className="text-sm text-gray-500">Features</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{ratingEase.toFixed(1)}</div>
            <div className="text-sm text-gray-500">Ease of Use</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">{ratingValue.toFixed(1)}</div>
            <div className="text-sm text-gray-500">Value</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">{ratingSupport.toFixed(1)}</div>
            <div className="text-sm text-gray-500">Support</div>
          </div>
        </div>
      </div>

      {features.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">✨ Key Features</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {features.map((feature: string, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-blue-600">✓</span>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-green-50 rounded-lg p-6">
          <h3 className="text-lg font-bold text-green-800 mb-4">✅ Pros</h3>
          <ul className="space-y-2">
            {pros.map((pro: string, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-red-50 rounded-lg p-6">
          <h3 className="text-lg font-bold text-red-800 mb-4">❌ Cons</h3>
          <ul className="space-y-2">
            {cons.map((con: string, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-red-600">✗</span>
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
