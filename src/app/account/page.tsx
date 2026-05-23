'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface ToolBrief {
  id: string
  name: string
  slug: string
}

interface FavoriteRow {
  id: string
  toolId: string
  tool: ToolBrief
}

interface SessionUser {
  id: string
  name: string | null
  email: string
  role: string
}

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<SessionUser | null>(null)
  const [favorites, setFavorites] = useState<FavoriteRow[]>([])
  const [loading, setLoading] = useState(true)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwMessage, setPwMessage] = useState('')
  const [pwError, setPwError] = useState('')
  const [pwLoading, setPwLoading] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then((r) => {
        if (!r.ok) throw new Error('unauthorized')
        return r.json()
      })
      .then((data: { user: SessionUser }) => {
        setUser(data.user)
        return fetch('/api/favorites', { credentials: 'include' })
      })
      .then((r) => (r.ok ? r.json() : []))
      .then((data: FavoriteRow[]) => setFavorites(Array.isArray(data) ? data : []))
      .catch(() => router.replace('/login?redirect=/account'))
      .finally(() => setLoading(false))
  }, [router])

  const removeFavorite = async (toolId: string) => {
    const res = await fetch(`/api/favorites?toolId=${encodeURIComponent(toolId)}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    if (res.ok) {
      setFavorites((prev) => prev.filter((f) => f.toolId !== toolId))
    }
  }

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwError('')
    setPwMessage('')
    if (newPassword !== confirmPassword) {
      setPwError('New passwords do not match')
      return
    }
    setPwLoading(true)
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const data = await res.json()
      if (!res.ok) {
        setPwError(data.error || 'Failed to update password')
        return
      }
      setPwMessage(data.message)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch {
      setPwError('Failed to update password')
    } finally {
      setPwLoading(false)
    }
  }

  if (loading || !user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-gray-600">Loading…</div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-1">My account</h1>
      <p className="text-gray-600 mb-1">{user.email}</p>
      {user.name && <p className="text-sm text-gray-500 mb-8">{user.name}</p>}

      <section className="mb-10 border border-gray-200 rounded-lg p-5 bg-white">
        <h2 className="text-lg font-semibold mb-3">Change password</h2>
        <form onSubmit={changePassword} className="space-y-3 max-w-md">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Current password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">New password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
              minLength={6}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Confirm new password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
              minLength={6}
            />
          </div>
          {pwError && <p className="text-sm text-red-600">{pwError}</p>}
          {pwMessage && <p className="text-sm text-green-700">{pwMessage}</p>}
          <button
            type="submit"
            disabled={pwLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {pwLoading ? 'Updating…' : 'Update password'}
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-3">
          Forgot your password? <Link href="/forgot-password" className="text-blue-600 hover:underline">Reset via email</Link>
        </p>
      </section>

      <h2 className="text-lg font-semibold mb-3">Saved tools</h2>
      {favorites.length === 0 ? (
        <p className="text-gray-500 text-sm">
          No saved tools yet. Open a tool page and click <strong>Save tool</strong>.
        </p>
      ) : (
        <ul className="space-y-3">
          {favorites.map((f) => (
            <li
              key={f.id}
              className="flex items-center justify-between gap-4 border border-gray-200 rounded-lg p-4 bg-white"
            >
              <Link href={`/tools/${f.tool.slug}`} className="font-medium text-blue-600 hover:underline">
                {f.tool.name}
              </Link>
              <button
                type="button"
                className="text-sm text-red-600 shrink-0 hover:underline"
                onClick={() => removeFavorite(f.toolId)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
