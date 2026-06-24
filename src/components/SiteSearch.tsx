'use client'

import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

type SiteSearchProps = {
  className?: string
  inputClassName?: string
  placeholder?: string
  size?: 'sm' | 'md'
}

export default function SiteSearch({
  className = '',
  inputClassName = '',
  placeholder = 'Search AI tools…',
  size = 'md',
}: SiteSearchProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const q = query.trim()
    if (!q) {
      router.push('/tools')
      return
    }
    router.push(`/tools?q=${encodeURIComponent(q)}`)
  }

  const sizeClasses =
    size === 'sm'
      ? 'py-2 pl-10 pr-3 text-sm'
      : 'py-3.5 pl-12 pr-4 text-base'

  return (
    <form onSubmit={onSubmit} className={`relative ${className}`}>
      <svg
        className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 ${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-xl border border-white/10 bg-white/[0.04] text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/30 transition-all ${sizeClasses} ${inputClassName}`}
        aria-label="Search AI tools"
      />
    </form>
  )
}
