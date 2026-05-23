'use client'

import { useState } from 'react'
import Link from 'next/link'
import MathCaptcha from '@/components/MathCaptcha'

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<'email' | 'reset'>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [captchaToken, setCaptchaToken] = useState('')
  const [captchaAnswer, setCaptchaAnswer] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [devCode, setDevCode] = useState('')

  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setDevCode('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to send code')
        return
      }
      setMessage(data.message)
      if (data.devCode) setDevCode(data.devCode)
      setStep('reset')
    } catch {
      setError('Failed to send code')
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, password, captchaToken, captchaAnswer }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Reset failed')
        return
      }
      setMessage(data.message)
      setTimeout(() => { window.location.href = '/login' }, 1500)
    } catch {
      setError('Reset failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Reset password</h1>
          <p className="text-sm text-gray-500 mt-1">
            {step === 'email' ? 'We will email you a 6-digit code' : 'Enter the code and choose a new password'}
          </p>
        </div>

        {step === 'email' ? (
          <form onSubmit={sendCode} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
                required
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
            >
              {loading ? 'Sending…' : 'Send reset code'}
            </button>
          </form>
        ) : (
          <form onSubmit={resetPassword} className="space-y-4">
            <p className="text-sm text-gray-600">Code sent to <strong>{email}</strong></p>
            {devCode && (
              <p className="text-xs bg-yellow-50 border border-yellow-200 text-yellow-800 rounded p-2">
                Dev mode code: <strong>{devCode}</strong>
              </p>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">6-digit code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg tracking-widest text-center font-mono text-lg"
                placeholder="000000"
                required
                maxLength={6}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                required
                minLength={6}
              />
            </div>
            <MathCaptcha onVerify={(tok, ans) => { setCaptchaToken(tok); setCaptchaAnswer(ans) }} />
            {error && <p className="text-sm text-red-600">{error}</p>}
            {message && <p className="text-sm text-green-700">{message}</p>}
            <button
              type="submit"
              disabled={loading || !captchaAnswer || code.length !== 6}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
            >
              {loading ? 'Updating…' : 'Reset password'}
            </button>
            <button
              type="button"
              onClick={() => setStep('email')}
              className="w-full text-sm text-gray-500 hover:text-gray-700"
            >
              ← Use a different email
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-gray-600">
          <Link href="/login" className="text-blue-600 hover:underline font-medium">Back to login</Link>
        </p>
      </div>
    </div>
  )
}
