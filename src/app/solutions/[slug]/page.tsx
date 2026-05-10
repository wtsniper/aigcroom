'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Solution {
  id: string
  title: string
  slug: string
  description: string
  content: string
  industry: string
  icon: string
  isFeatured: boolean
  tools?: string[]
  toolIds?: string | string[]
  createdAt: string
}

interface Tool {
  id: string
  name: string
  slug: string
  description: string
}

export default function SolutionDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [solution, setSolution] = useState<Solution | null>(null)
  const [relatedTools, setRelatedTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSolution()
  }, [slug])

  const fetchSolution = async () => {
    try {
      const res = await fetch(`/api/solutions`)
      if (res.ok) {
        const solutions = await res.json()
        const found = solutions.find((s: Solution) => s.slug === slug)
        if (found) {
          setSolution(found)
          if (found.toolIds) {
            const toolIds = Array.isArray(found.toolIds) ? found.toolIds : JSON.parse(found.toolIds)
            fetchTools(toolIds)
          }
        }
      }
    } catch (error) {
      console.error('Error fetching solution:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTools = async (ids: string[]) => {
    try {
      const res = await fetch(`/api/tools`)
      if (res.ok) {
        const tools = await res.json()
        setRelatedTools(tools.filter((t: Tool) => ids.includes(t.id)))
      }
    } catch (error) {
      console.error('Error fetching tools:', error)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center py-12">Loading...</div>
      </div>
    )
  }

  if (!solution) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Solution Not Found</h1>
          <Link href="/solutions" className="text-blue-600 hover:underline">Back to Solutions</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-4 text-sm text-gray-500">
        <Link href="/" className="hover:text-blue-600">Home</Link> &gt; 
        <Link href="/solutions" className="hover:text-blue-600"> Solutions</Link> &gt; 
        <span> {solution.title}</span>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
        <div className="mb-4">
          <h1 className="text-3xl font-bold">{solution.title}</h1>
          <div className="mt-2 flex gap-2">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">{solution.industry}</span>
            {solution.isFeatured && (
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Featured</span>
            )}
          </div>
        </div>
        <p className="text-gray-600 text-lg">{solution.description}</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ 
          __html: solution.content
            .split('\n')
            .map(line => {
              if (line.startsWith('## ')) return `<h2 class="text-xl font-bold mt-6 mb-3">${line.slice(3)}</h2>`
              if (line.startsWith('# ')) return `<h1 class="text-2xl font-bold mt-6 mb-3">${line.slice(2)}</h1>`
              if (line.startsWith('- ')) return `<li class="ml-4">${line.slice(2)}</li>`
              if (line.match(/^\d+\.\s/)) return `<li class="ml-4">${line}</li>`
              if (line.trim() === '') return '<br/>'
              return `<p>${line}</p>`
            })
            .join('') 
        }} />
      </div>

      {relatedTools.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-bold mb-6">Recommended Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedTools.map((tool) => (
              <Link
                key={tool.id}
                href={`/tools/${tool.slug}`}
                className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🤖</span>
                </div>
                <div>
                  <h3 className="font-semibold">{tool.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-1">{tool.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
