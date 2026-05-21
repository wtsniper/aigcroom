'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

// ─── Math captcha widget ──────────────────────────────────────────────────────
function CaptchaWidget({
  onVerify,
}: {
  onVerify: (token: string, answer: string) => void
}) {
  const [question, setQuestion] = useState('')
  const [token, setToken]       = useState('')
  const [answer, setAnswer]     = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const fetchCaptcha = async () => {
    setLoading(true)
    setAnswer('')
    setError('')
    try {
      const res = await fetch('/api/auth/captcha')
      const data = await res.json()
      setQuestion(data.question)
      setToken(data.token)
    } catch {
      setError('Failed to load captcha')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCaptcha() }, [])

  const handleChange = (val: string) => {
    setAnswer(val)
    onVerify(token, val)
  }

  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
      <p className="text-xs text-blue-700 font-medium mb-2">Security check — please answer:</p>
      <div className="flex items-center gap-3">
        <span className="text-lg font-bold text-gray-800 bg-white border border-gray-200 rounded-md px-4 py-2 font-mono tracking-widest select-none min-w-[100px] text-center">
          {loading ? '...' : question}
        </span>
        <input
          type="number"
          value={answer}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Answer"
          className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-center text-lg font-bold focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={fetchCaptcha}
          className="text-blue-600 text-xs hover:underline whitespace-nowrap"
        >
          New question
        </button>
      </div>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  )
}

// ─── Login form ───────────────────────────────────────────────────────────────
function LoginForm() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [showPw,   setShowPw]   = useState(false)

  // captcha state
  const [requiresCaptcha, setRequiresCaptcha] = useState(false)
  const [captchaToken,    setCaptchaToken]    = useState('')
  const [captchaAnswer,   setCaptchaAnswer]   = useState('')
  const [attemptsLeft,    setAttemptsLeft]    = useState<number | null>(null)
  const [lockedOut,       setLockedOut]       = useState(false)

  const searchParams = useSearchParams()
  const redirect     = searchParams?.get('redirect') || '/'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const body: Record<string, string> = { email, password }
      if (requiresCaptcha) {
        body.captchaToken  = captchaToken
        body.captchaAnswer = captchaAnswer
      }

      const res  = await fetch('/api/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
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
        if (data.lockedOut)       setLockedOut(true)
        if (data.requiresCaptcha) setRequiresCaptcha(true)
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
            <p className="text-red-600 text-sm">Too many failed attempts. Please wait 15 minutes and try again.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
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

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
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

            {/* Captcha — shown after 3 failed attempts */}
            {requiresCaptcha && (
              <CaptchaWidget
                onVerify={(tok, ans) => {
                  setCaptchaToken(tok)
                  setCaptchaAnswer(ans)
                }}
              />
            )}

            {/* Error */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
                {attemptsLeft !== null && attemptsLeft > 0 && (
                  <span className="block mt-0.5 text-red-500 text-xs">
                    {attemptsLeft} attempt{attemptsLeft !== 1 ? 's' : ''} remaining before lockout
                  </span>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || (requiresCaptcha && !captchaAnswer)}
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
