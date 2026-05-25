'use client'

import { useState } from 'react'

const CATEGORY_ICON: Record<string, string> = {
  Writing: '✍️',
  Image: '🎨',
  Code: '💻',
  Video: '🎬',
  Audio: '🎵',
  Data: '📊',
  Marketing: '📣',
  Research: '🔬',
  'Chat Assistant': '💬',
  Coding: '💻',
  'Image Generation': '🎨',
  Productivity: '⚡',
}

function toolInitial(name: string): string {
  const match = name.match(/[A-Za-z0-9]/)
  return match ? match[0].toUpperCase() : '?'
}

interface ToolLogoProps {
  logoUrl?: string | null
  slug?: string
  name: string
  category?: string
  className?: string
  fallbackClassName?: string
  useCategoryEmoji?: boolean
}

/** Prefer stored local path; optional slug fallback for /logos/{slug}.* */
export function resolveToolLogoSrc(logoUrl?: string | null, slug?: string): string | null {
  if (logoUrl?.startsWith('/logos/')) return logoUrl
  if (logoUrl && !/^https?:\/\//i.test(logoUrl)) return logoUrl
  if (slug) return `/logos/${slug}.png`
  return logoUrl || null
}

export default function ToolLogo({
  logoUrl,
  slug,
  name,
  category = '',
  className = 'w-full h-full object-contain p-1.5',
  fallbackClassName = 'text-xl font-bold text-violet-300',
  useCategoryEmoji = false,
}: ToolLogoProps) {
  const [broken, setBroken] = useState(false)
  const [extIndex, setExtIndex] = useState(0)
  const exts = ['png', 'webp', 'jpg', 'svg']

  let src: string | null = null
  if (slug) {
    src = `/logos/${slug}.${exts[extIndex]}`
  } else if (logoUrl?.startsWith('/logos/')) {
    src = logoUrl
  } else if (logoUrl && !/^https?:\/\//i.test(logoUrl)) {
    src = logoUrl
  } else {
    src = logoUrl || null
  }

  const handleError = () => {
    if (slug && extIndex < exts.length - 1) {
      setExtIndex((i) => i + 1)
      return
    }
    setBroken(true)
  }

  if (!src || broken) {
    if (useCategoryEmoji) {
      return <span className={fallbackClassName}>{CATEGORY_ICON[category] || '🤖'}</span>
    }
    return <span className={fallbackClassName}>{toolInitial(name)}</span>
  }

  return (
    <img
      src={src}
      alt={name}
      className={className}
      loading="lazy"
      decoding="async"
      onError={handleError}
    />
  )
}
