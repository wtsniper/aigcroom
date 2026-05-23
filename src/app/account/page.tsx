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
