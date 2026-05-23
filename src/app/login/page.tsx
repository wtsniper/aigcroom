'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import MathCaptcha from '@/components/MathCaptcha'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [captchaToken, setCaptchaToken] = useState('')
  const [captchaAnswer, setCaptchaAnswer] = useState('')
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null)
  const [lockedOut, setLockedOut] = useState(false)

  const searchParams = useSearchParams()
  const redirect = searchParams?.get('redirect') || '/'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, captchaToken, captchaAnswer }),
      })
      const data = await res.json()

      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data.user))
        if (redirect.startsWith('/admin') && data.user.role !== 'ADMIN') {
          setError('You do not have admin privileges')
          return
        }
        window.location.href = redirect
      } else {
        setError(data.error || 'Login failed')
        if (data.lockedOut) setLockedOut(true)
        if (data.attemptsLeft !== undefined) setAttemptsLeft(data.attemptsLeft)
      }
    } catch {
      setError('Login failed, please try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Log in to AIGC Room</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back</p>
        </div>

        {redirect.startsWith('/admin') && (
          <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">
            Admin access required to view the management console
          </div>
        )}

        {lockedOut ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
            <p className="text-red-700 font-semibold mb-1">Account temporarily locked</p>
            <p className="text-red-600 text-sm">
              Too many failed attempts (10). Please wait 30 minutes or reset your password.
            </p>
            <Link href="/forgot-password" className="inline-block mt-4 text-blue-600 hover:underline text-sm font-medium">
              Reset password →
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <Link href="/forgot-password" className="text-xs text-blue-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10 transition-colors"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                >
                  {showPw ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <MathCaptcha onVerify={(tok, ans) => { setCaptchaToken(tok); setCaptchaAnswer(ans) }} />

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
                {attemptsLeft !== null && attemptsLeft > 0 && (
                  <span className="block mt-0.5 text-red-500 text-xs">
                    {attemptsLeft} attempt{attemptsLeft !== 1 ? 's' : ''} remaining before 30-minute lockout
                  </span>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !captchaAnswer}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Logging in…' : 'Log in'}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link
            href={`/register${redirect !== '/' ? '?redirect=' + encodeURIComponent(redirect) : ''}`}
            className="text-blue-600 hover:underline font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
