'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface StoredUser {
  id: string
  name: string | null
  email: string
  role: string
}

export default function FavoriteButton({ toolId, toolSlug }: { toolId: string; toolSlug: string }) {
  const router = useRouter()
  const [user, setUser] = useState<StoredUser | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const raw = localStorage.getItem('user')
    if (raw) {
      try { setUser(JSON.parse(raw)) } catch { /* ignore */ }
    }
  }, [])

  useEffect(() => {
    if (!user) return
    fetch(`/api/favorites?userId=${encodeURIComponent(user.id)}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((list: { toolId: string }[]) =>
        setIsFavorite(list.some((f) => f.toolId === toolId))
      )
      .catch(() => setIsFavorite(false))
  }, [user, toolId])

  const toggle = async () => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(`/tools/${toolSlug}`)}`)
      return
    }
    setBusy(true)
    try {
      if (isFavorite) {
        const res = await fetch(
          `/api/favorites?userId=${encodeURIComponent(user.id)}&toolId=${encodeURIComponent(toolId)}`,
          { method: 'DELETE' }
        )
        if (res.ok) setIsFavorite(false)
      } else {
        const res = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, toolId }),
        })
        if (res.ok) setIsFavorite(true)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      type="button"
      disabled={busy}
      onClick={toggle}
      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 ${
        isFavorite
          ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/20'
          : 'bg-white/[0.04] text-gray-300 border border-white/10 hover:border-yellow-500/30 hover:text-yellow-400'
      }`}
    >
      {isFavorite ? '★ Saved' : '☆ Save tool'}
    </button>
  )
}
