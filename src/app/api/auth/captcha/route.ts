import { NextResponse } from 'next/server'
import crypto from 'crypto'

const SECRET = process.env.NEXTAUTH_SECRET || 'captcha-secret-fallback'
const CAPTCHA_TTL_MS = 5 * 60 * 1000 // 5 minutes

function sign(payload: string): string {
  return crypto.createHmac('sha256', SECRET).update(payload).digest('hex')
}

export function verifyCaptchaToken(token: string, answer: string): boolean {
  if (!token || !answer) return false
  const parts = token.split('.')
  if (parts.length !== 3) return false
  const [encodedAnswer, expiry, sig] = parts
  const expectedSig = sign(`${encodedAnswer}.${expiry}`)
  if (sig !== expectedSig) return false
  if (Date.now() > parseInt(expiry, 10)) return false
  const decodedAnswer = Buffer.from(encodedAnswer, 'base64').toString()
  const a = Buffer.from(decodedAnswer.toLowerCase().trim())
  const b = Buffer.from(answer.toLowerCase().trim())
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(a, b)
}

export async function GET() {
  const ops = ['+', '+', '+', '-', '×'] as const
  const op = ops[Math.floor(Math.random() * ops.length)]
  let a = Math.floor(Math.random() * 15) + 2
  let b = Math.floor(Math.random() * 12) + 1

  if (op === '-') {
    // ensure result ≥ 1
    if (a <= b) [a, b] = [b, a]
  }

  const answerNum = op === '+' ? a + b : op === '-' ? a - b : a * b
  const answer = String(answerNum)

  const encodedAnswer = Buffer.from(answer).toString('base64')
  const expiry = String(Date.now() + CAPTCHA_TTL_MS)
  const sig = sign(`${encodedAnswer}.${expiry}`)
  const token = `${encodedAnswer}.${expiry}.${sig}`

  const opSymbol = op === '×' ? '×' : op
  return NextResponse.json({
    question: `${a} ${opSymbol} ${b} = ?`,
    token,
  })
}
