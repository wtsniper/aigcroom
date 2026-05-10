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
  isFeatured: boolean
}

interface Review {
  id: string
  title: string
  slug: string
  excerpt: string
  status: string
  createdAt: string
}

interface Solution {
  id: string
  title: string
  slug: string
  description: string
  industry: string
  isFeatured: boolean
}

export default function Home() {
  const [featuredTools, setFeaturedTools] = useState<Tool[]>([])
  const [recentReviews, setRecentReviews] = useState<Review[]>([])
  const [featuredSolutions, setFeaturedSolutions] = useState<Solution[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [toolsRes, reviewsRes, solutionsRes] = await Promise.all([
        fetch('/api/tools'),
        fetch('/api/reviews'),
        fetch('/api/solutions'),
      ])

      if (toolsRes.ok) {
        const tools = await toolsRes.json()
        setFeaturedTools(tools.slice(0, 4))
      }

      if (reviewsRes.ok) {
        const reviews = await reviewsRes.json()
        setRecentReviews(reviews.filter((r: Review) => r.status === 'PUBLISHED').slice(0, 3))
      }

      if (solutionsRes.ok) {
        const solutions = await solutionsRes.json()
        setFeaturedSolutions(solutions.slice(0, 4))
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-gray-950 to-blue-600/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,80,255,0.15),transparent_50%)]"></div>
        <div className="container mx-auto px-4 max-w-7xl relative z-10 text-center">
          <div className="inline-block px-4 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-400 text-sm font-medium mb-8">
            ✨ Trusted by 50,000+ professionals
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Discover the <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">Best AI Tools</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Expert reviews, detailed comparisons, and real user insights to help you choose the perfect AI tools for your workflow.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/tools" className="bg-gradient-to-r from-violet-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/25">
              Explore Tools
            </Link>
            <Link href="/reviews" className="bg-white/5 text-white px-8 py-4 rounded-xl font-semibold border border-white/10 hover:bg-white/10 transition-colors">
              Read Reviews
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Tools */}
      {featuredTools.length > 0 && (
        <section className="py-20 bg-gray-950">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-white">Featured Tools</h2>
                <p className="text-gray-400 mt-2">Hand-picked AI tools recommended by our experts</p>
              </div>
              <Link href="/tools" className="text-violet-400 hover:text-violet-300 font-medium">View all →</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredTools.map((tool) => (
                <Link href={`/tools/${tool.slug}`} key={tool.id} className="group bg-gray-900 rounded-2xl border border-gray-800 p-6 hover:border-violet-500/50 transition-all hover:shadow-lg hover:shadow-violet-500/10">
                  <div className="w-14 h-14 bg-gray-800 rounded-xl flex items-center justify-center mb-5 overflow-hidden group-hover:scale-105 transition-transform">
                    {tool.logoUrl ? (
                      <img src={tool.logoUrl} alt={tool.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl">🤖</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg text-white mb-2">{tool.name}</h3>
                  <p className="text-gray-400 text-sm mb-5 line-clamp-2">{tool.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                    <span className="text-sm text-yellow-400 font-medium">⭐ {tool.rating.toFixed(1)}</span>
                    <span className="text-xs bg-gray-800 text-gray-300 px-3 py-1.5 rounded-lg">{tool.pricingType}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Reviews */}
      {recentReviews.length > 0 && (
        <section className="py-20 bg-gray-900/50">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-white">Latest Reviews</h2>
                <p className="text-gray-400 mt-2">In-depth analysis and honest opinions</p>
              </div>
              <Link href="/reviews" className="text-violet-400 hover:text-violet-300 font-medium">View all →</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentReviews.map((review) => (
                <Link href={`/reviews/${review.slug}`} key={review.id} className="group bg-gray-900 rounded-2xl border border-gray-800 p-8 hover:border-violet-500/50 transition-all hover:shadow-lg hover:shadow-violet-500/10">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 bg-violet-500/10 rounded-lg flex items-center justify-center">
                      <span className="text-violet-400">📝</span>
                    </div>
                    <span className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="font-semibold text-xl text-white mb-4 line-clamp-2 group-hover:text-violet-400 transition-colors">{review.title}</h3>
                  <p className="text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed">{review.excerpt}</p>
                  <div className="text-violet-400 font-medium text-sm">Read full review →</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Solutions */}
      {featuredSolutions.length > 0 && (
        <section className="py-20 bg-gray-950">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-white">Industry Solutions</h2>
                <p className="text-gray-400 mt-2">AI-powered solutions for every industry</p>
              </div>
              <Link href="/solutions" className="text-violet-400 hover:text-violet-300 font-medium">View all →</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredSolutions.map((solution) => (
                <Link href={`/solutions/${solution.slug}`} key={solution.id} className="group bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-800 p-6 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-5">
                    <span className="text-blue-400 text-xl">💡</span>
                  </div>
                  <span className="text-sm text-blue-400 font-medium">{solution.industry}</span>
                  <h3 className="font-semibold text-lg text-white mb-3 mt-2 group-hover:text-blue-400 transition-colors">{solution.title}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2">{solution.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 to-blue-600 p-12 md:p-16 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-white mb-4">Ready to find your perfect AI tool?</h2>
              <p className="text-xl mb-8 text-white/80">Join thousands of professionals who trust AIGC Room for AI tool recommendations</p>
              <Link href="/tools" className="bg-white text-violet-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 inline-block transition-colors shadow-lg">
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
