'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Solution {
  id: string
  title: string
  slug: string
  description: string
  industry: string
  icon: string
  isFeatured: boolean
  createdAt: string
}

export default function AdminSolutions() {
  const [solutions, setSolutions] = useState<Solution[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingSolution, setEditingSolution] = useState<Solution | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    industry: '',
    content: '',
    isFeatured: false,
  })

  useEffect(() => {
    fetchSolutions()
  }, [])

  const fetchSolutions = async () => {
    try {
      const res = await fetch('/api/solutions')
      if (res.ok) {
        const data = await res.json()
        setSolutions(data)
      }
    } catch (error) {
      console.error('Error fetching solutions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    if (name === 'title' && !editingSolution) {
      const slug = value.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setFormData(prev => ({ ...prev, slug }))
    }
  }

  const handleEdit = (solution: Solution) => {
    setEditingSolution(solution)
    setFormData({
      title: solution.title,
      slug: solution.slug,
      description: solution.description,
      industry: solution.industry,
      content: '',
      isFeatured: solution.isFeatured,
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this solution?')) return
    
    try {
      const res = await fetch(`/api/solutions/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchSolutions()
      }
    } catch (error) {
      console.error('Error deleting solution:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingSolution 
        ? `/api/solutions/${editingSolution.id}`
        : '/api/solutions'
      
      const method = editingSolution ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      
      if (res.ok) {
        setShowForm(false)
        setEditingSolution(null)
        setFormData({
          title: '',
          slug: '',
          description: '',
          industry: '',
          content: '',
          isFeatured: false,
        })
        fetchSolutions()
      }
    } catch (error) {
      console.error('Error saving solution:', error)
    }
  }

  const filteredSolutions = solutions.filter(s =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.industry.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Solutions Management</h1>
        <button
          onClick={() => {
            setShowForm(true)
            setEditingSolution(null)
            setFormData({
              title: '',
              slug: '',
              description: '',
              industry: '',
              content: '',
              isFeatured: false,
            })
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + New Solution
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingSolution ? 'Edit Solution' : 'New Solution'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g. E-commerce Solution"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Slug *</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="e-commerce-solution"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="Brief description of the solution"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Industry *</label>
              <input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g. E-commerce, Marketing"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Content (Markdown)</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={8}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono"
                placeholder="Detailed solution content in Markdown..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium">Featured Solution</span>
              </label>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              {editingSolution ? 'Update' : 'Create'} Solution
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false)
                setEditingSolution(null)
              }}
              className="text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search solutions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Industry</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Featured</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Created</th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredSolutions.map((solution) => (
              <tr key={solution.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium">{solution.title}</div>
                  <div className="text-sm text-gray-500">{solution.slug}</div>
                </td>
                <td className="px-6 py-4 text-sm">{solution.industry}</td>
                <td className="px-6 py-4">
                  {solution.isFeatured ? (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Featured</span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(solution.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleEdit(solution)}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(solution.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredSolutions.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No solutions found
          </div>
        )}
      </div>
    </div>
  )
}
