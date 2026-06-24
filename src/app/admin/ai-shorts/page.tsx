'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

type AiShortRecord = {
  id: string
  slug: string
  title: string
  originalTitle: string | null
  creator: string
  creatorHandle: string | null
  description: string
  tools: string
  youtubeVideoId: string | null
  youtubeNote: string | null
  bilibiliBvid: string | null
  galleryUrl: string | null
  duration: string | null
  tags: string
  viralNote: string | null
  featured: boolean
  preferredPlatform: string | null
  sortOrder: number
  status: string
  publishedAt: string | null
  createdAt: string
}

const emptyForm = {
  title: '',
  slug: '',
  originalTitle: '',
  creator: '',
  creatorHandle: '',
  description: '',
  youtubeUrl: '',
  youtubeNote: '',
  bilibiliUrl: '',
  galleryUrl: '',
  duration: '',
  tags: '',
  toolsJson: '[]',
  viralNote: '',
  featured: false,
  preferredPlatform: '',
  sortOrder: 0,
  status: 'DRAFT',
}

function parseTags(raw: string): string {
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.join(', ') : ''
  } catch {
    return ''
  }
}

function formatTools(raw: string): string {
  try {
    const parsed = JSON.parse(raw)
    return JSON.stringify(parsed, null, 2)
  } catch {
    return '[]'
  }
}

export default function AdminAiShortsPage() {
  const [shorts, setShorts] = useState<AiShortRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [editing, setEditing] = useState<AiShortRecord | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState(emptyForm)
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchShorts()
  }, [])

  const fetchShorts = async () => {
    try {
      const res = await fetch('/api/ai-shorts', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setShorts(data)
      }
    } catch (error) {
      console.error('Error fetching AI shorts:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData(emptyForm)
    setEditing(null)
    setSubmitError('')
  }

  const openCreate = () => {
    resetForm()
    setShowForm(true)
  }

  const openEdit = async (short: AiShortRecord) => {
    setEditing(short)
    setFormData({
      title: short.title,
      slug: short.slug,
      originalTitle: short.originalTitle ?? '',
      creator: short.creator,
      creatorHandle: short.creatorHandle ?? '',
      description: short.description,
      youtubeUrl: short.youtubeVideoId ?? '',
      youtubeNote: short.youtubeNote ?? '',
      bilibiliUrl: short.bilibiliBvid ?? '',
      galleryUrl: short.galleryUrl ?? '',
      duration: short.duration ?? '',
      tags: parseTags(short.tags),
      toolsJson: formatTools(short.tools),
      viralNote: short.viralNote ?? '',
      featured: short.featured,
      preferredPlatform: short.preferredPlatform ?? '',
      sortOrder: short.sortOrder,
      status: short.status,
    })
    setSubmitError('')
    setShowForm(true)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData((prev) => {
      const next = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }
      if (name === 'title' && !editing) {
        const slug = value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
        next.slug = slug
      }
      return next
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除这条视频？')) return
    try {
      const res = await fetch(`/api/ai-shorts/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (res.ok) fetchShorts()
    } catch (error) {
      console.error('Error deleting AI short:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError('')

    let tools: unknown[] = []
    try {
      tools = JSON.parse(formData.toolsJson)
      if (!Array.isArray(tools)) throw new Error('Tools must be a JSON array')
    } catch {
      setSubmitError('Tools 字段必须是合法的 JSON 数组')
      setSubmitting(false)
      return
    }

    const payload = {
      title: formData.title,
      slug: formData.slug,
      originalTitle: formData.originalTitle || null,
      creator: formData.creator,
      creatorHandle: formData.creatorHandle || null,
      description: formData.description,
      youtubeUrl: formData.youtubeUrl,
      youtubeNote: formData.youtubeNote || null,
      bilibiliUrl: formData.bilibiliUrl,
      galleryUrl: formData.galleryUrl || null,
      duration: formData.duration || null,
      tags: formData.tags,
      tools,
      viralNote: formData.viralNote || null,
      featured: formData.featured,
      preferredPlatform: formData.preferredPlatform || null,
      sortOrder: Number(formData.sortOrder),
      status: formData.status,
    }

    try {
      const url = editing ? `/api/ai-shorts/${editing.id}` : '/api/ai-shorts'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok) {
        setSubmitError(json.error ?? '保存失败')
        return
      }
      setShowForm(false)
      resetForm()
      fetchShorts()
    } catch (error) {
      console.error('Error saving AI short:', error)
      setSubmitError('网络错误，请重试')
    } finally {
      setSubmitting(false)
    }
  }

  const filtered = shorts.filter(
    (s) =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.creator.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <p className="text-gray-500">Loading AI shorts...</p>
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI 短片管理</h1>
          <p className="text-gray-500 text-sm mt-1">
            粘贴 YouTube 链接或 BV 号即可上架，前台通过嵌入播放（不自托管视频文件）。
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + 添加视频
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editing ? '编辑视频' : '添加视频'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">标题 *</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                <input
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="paperclip-heart"
                />
                <p className="text-xs text-gray-400 mt-1">用于 /ai-shorts#slug 锚点</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">创作者 *</label>
                <input
                  name="creator"
                  value={formData.creator}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">创作者账号</label>
                <input
                  name="creatorHandle"
                  value={formData.creatorHandle}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="@channel"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  YouTube 链接或 ID *
                </label>
                <input
                  name="youtubeUrl"
                  value={formData.youtubeUrl}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="https://youtube.com/watch?v=... 或 11 位 ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bilibili 链接或 BV 号
                </label>
                <input
                  name="bilibiliUrl"
                  value={formData.bilibiliUrl}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="BV1FFRQB2Eqw"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">时长</label>
                <input
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="8:19"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">排序</label>
                <input
                  name="sortOrder"
                  type="number"
                  value={formData.sortOrder}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="DRAFT">草稿</option>
                  <option value="PUBLISHED">已发布</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">首选平台</label>
                <select
                  name="preferredPlatform"
                  value={formData.preferredPlatform}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">自动</option>
                  <option value="youtube">YouTube</option>
                  <option value="bilibili">Bilibili</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">外链 Gallery</label>
                <input
                  name="galleryUrl"
                  value={formData.galleryUrl}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">原标题</label>
                <input
                  name="originalTitle"
                  value={formData.originalTitle}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">简介 *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">标签（逗号分隔）</label>
              <input
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Seedance, Viral 2026"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                使用工具（JSON 数组）
              </label>
              <textarea
                name="toolsJson"
                value={formData.toolsJson}
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 font-mono text-sm"
                placeholder='[{"name":"Seedance 2.0","slug":"seedance","role":"Video"}]'
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">传播备注</label>
              <textarea
                name="viralNote"
                value={formData.viralNote}
                onChange={handleChange}
                rows={2}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">YouTube 备注</label>
              <input
                name="youtubeNote"
                value={formData.youtubeNote}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
              />
              首页 Featured（可多选，排序靠前优先展示）
            </label>

            {submitError && <p className="text-sm text-red-600">{submitError}</p>}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? '保存中...' : editing ? '更新' : '发布'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  resetForm()
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                取消
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mb-4">
        <input
          type="text"
          placeholder="搜索标题、slug、创作者..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md border border-gray-300 rounded-lg px-3 py-2"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">标题</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">平台</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">状态</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">排序</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((short) => (
              <tr key={short.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{short.title}</div>
                  <div className="text-xs text-gray-400">{short.slug}</div>
                  <div className="text-xs text-gray-500">{short.creator}</div>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {short.youtubeVideoId && <span className="mr-2">YouTube</span>}
                  {short.bilibiliBvid && <span>Bilibili</span>}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      short.status === 'PUBLISHED'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {short.status === 'PUBLISHED' ? '已发布' : '草稿'}
                  </span>
                  {short.featured && (
                    <span className="ml-1 px-2 py-0.5 rounded text-xs bg-pink-100 text-pink-700">
                      HOT
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-600">{short.sortOrder}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  {short.status === 'PUBLISHED' && (
                    <Link
                      href={`/ai-shorts#${short.slug}`}
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      预览
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => openEdit(short)}
                    className="text-blue-600 hover:underline"
                  >
                    编辑
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(short.id)}
                    className="text-red-600 hover:underline"
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center text-gray-400 py-8">暂无视频，点击「添加视频」开始</p>
        )}
      </div>
    </div>
  )
}
