'use client'

import { useState, useEffect } from 'react'

export default function MathCaptcha({
  onVerify,
}: {
  onVerify: (token: string, answer: string) => void
}) {
  const [question, setQuestion] = useState('')
  const [token, setToken] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchCaptcha = async () => {
    setLoading(true)
    setAnswer('')
    setError('')
    try {
      const res = await fetch('/api/auth/captcha')
      const data = await res.json()
      setQuestion(data.question)
      setToken(data.token)
      onVerify(data.token, '')
    } catch {
      setError('Failed to load captcha')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCaptcha()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
      <p className="text-xs text-blue-700 font-medium mb-2">Security check — please answer:</p>
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-lg font-bold text-gray-800 bg-white border border-gray-200 rounded-md px-4 py-2 font-mono tracking-widest select-none min-w-[100px] text-center">
          {loading ? '...' : question}
        </span>
        <input
          type="number"
          value={answer}
          onChange={(e) => {
            setAnswer(e.target.value)
            onVerify(token, e.target.value)
          }}
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
