'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function FavoriteButton({ toolId, toolSlug }: { toolId: string; toolSlug: string }) {
  const router = useRouter()
  const [loggedIn, setLoggedIn] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then((r) => {
        setLoggedIn(r.ok)
        if (!r.ok) return []
        return fetch('/api/favorites', { credentials: 'include' }).then((res) => (res.ok ? res.json() : []))
      })
      .then((list: { toolId: string }[]) => {
        if (Array.isArray(list)) setIsFavorite(list.some((f) => f.toolId === toolId))
      })
      .catch(() => setLoggedIn(false))
  }, [toolId])

  const toggle = async () => {
    if (!loggedIn) {
      router.push(`/login?redirect=${encodeURIComponent(`/tools/${toolSlug}`)}`)
      return
    }
    setBusy(true)
    try {
      if (isFavorite) {
        const res = await fetch(`/api/favorites?toolId=${encodeURIComponent(toolId)}`, {
          method: 'DELETE',
          credentials: 'include',
        })
        if (res.ok) setIsFavorite(false)
      } else {
        const res = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ toolId }),
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
