'use client'

import { useState } from 'react'
import Link from 'next/link'

type ToolStackCtaProps = {
  source?: string
  variant?: 'dark' | 'light'
}

export default function ToolStackCta({ source = 'homepage', variant = 'dark' }: ToolStackCtaProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const isDark = variant === 'dark'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    setMessage('')
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source }),
      })
      const data = await res.json()
      if (!res.ok) {
        setStatus('error')
        setMessage(data.error || 'Something went wrong')
        return
      }
      setStatus('success')
      setMessage('You\'re on the list — we\'ll send tool stacks and viral short breakdowns.')
      setEmail('')
    } catch {
      setStatus('error')
      setMessage('Network error — try again or email contact@aigcroom.shop')
    }
  }

  return (
    <div
      className={`rounded-2xl border p-6 md:p-8 ${
        isDark
          ? 'border-violet-500/30 bg-gradient-to-br from-violet-950/40 via-gray-950/90 to-pink-950/30'
          : 'border-violet-200 bg-violet-50/80 shadow-sm'
      }`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>
          <span
            className={`text-xs font-semibold uppercase tracking-widest ${
              isDark ? 'text-violet-400' : 'text-violet-600'
            }`}
          >
            Free tool stack
          </span>
          <h2 className={`text-xl md:text-2xl font-bold mt-1 mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Get the AI tools behind viral shorts
          </h2>
          <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Weekly email: one viral AI film breakdown + links to comparisons we use (Seedance, Runway,
            CapCut, and more). No spam — unsubscribe anytime.
          </p>
          <Link
            href="/reviews/zombie-scavenger-hell-grind-ai-workflow-2026"
            className={`inline-block mt-3 text-sm font-medium ${
              isDark ? 'text-pink-400 hover:text-pink-300' : 'text-violet-700 hover:text-violet-900'
            }`}
          >
            Read: Zombie Scavenger &amp; Hell Grind workflow →
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <label htmlFor={`tool-stack-email-${source}`} className="sr-only">
            Email address
          </label>
          <input
            id={`tool-stack-email-${source}`}
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading' || status === 'success'}
            className={`w-full px-4 py-3 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-violet-500/50 ${
              isDark
                ? 'bg-white/[0.06] border-white/10 text-white placeholder:text-gray-500'
                : 'bg-white border-gray-200 text-gray-900'
            }`}
          />
          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="w-full py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-violet-600 to-pink-600 text-white hover:from-violet-500 hover:to-pink-500 disabled:opacity-60 transition-all"
          >
            {status === 'loading' ? 'Subscribing…' : status === 'success' ? 'Subscribed ✓' : 'Get the tool stack'}
          </button>
          {message && (
            <p
              className={`text-xs ${status === 'error' ? 'text-red-400' : isDark ? 'text-green-400' : 'text-green-700'}`}
            >
              {message}
            </p>
          )}
          <p className={`text-[11px] ${isDark ? 'text-gray-600' : 'text-gray-500'}`}>
            By subscribing you agree to our{' '}
            <Link href="/privacy" className="underline hover:text-violet-400">
              Privacy Policy
            </Link>
            . We use your email only for this list.
          </p>
        </form>
      </div>
    </div>
  )
}
