import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { prisma } from '@/lib/prisma'
import { verifyCaptchaToken } from '../captcha/route'

const WINDOW_MS = 15 * 60 * 1000   // 15-minute window
const MAX_FAILS  = 5                // lockout after 5 failures
const CAPTCHA_AFTER = 3            // require captcha after 3 failures

function validateEmail(e: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) }
function validatePassword(p: string) { return p.length >= 6 && p.length <= 128 }

async function countRecentFails(email: string): Promise<number> {
  const since = new Date(Date.now() - WINDOW_MS)
  return prisma.emailVerification.count({
    where: { email, type: 'LOGIN_FAIL', createdAt: { gte: since } },
  })
}

async function recordFail(email: string) {
  await prisma.emailVerification.create({
    data: {
      email,
      code: 'fail',
      type: 'LOGIN_FAIL',
      expiresAt: new Date(Date.now() + WINDOW_MS),
    },
  })
}

async function clearFails(email: string) {
  await prisma.emailVerification.deleteMany({
    where: { email, type: 'LOGIN_FAIL' },
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, captchaToken, captchaAnswer } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }
    if (!validateEmail(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }
    if (!validatePassword(password)) {
      return NextResponse.json({ error: 'Password must be 6-128 characters' }, { status: 400 })
    }

    // ── Rate-limit check ──────────────────────────────────────────────────────
    const fails = await countRecentFails(email)

    if (fails >= MAX_FAILS) {
      return NextResponse.json(
        {
          error: `Too many failed attempts. Please wait 15 minutes before trying again.`,
          lockedOut: true,
          remainingMins: 15,
        },
        { status: 429 }
      )
    }

    // ── Captcha check (required after CAPTCHA_AFTER failures) ────────────────
    if (fails >= CAPTCHA_AFTER) {
      if (!captchaToken || !captchaAnswer) {
        return NextResponse.json(
          { error: 'Please complete the captcha.', requiresCaptcha: true },
          { status: 400 }
        )
      }
      if (!verifyCaptchaToken(captchaToken, captchaAnswer)) {
        return NextResponse.json(
          { error: 'Incorrect captcha answer. Please try again.', requiresCaptcha: true },
          { status: 400 }
        )
      }
    }

    // ── Credential check ──────────────────────────────────────────────────────
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user || !user.password) {
      await recordFail(email)
      const newFails = fails + 1
      return NextResponse.json(
        {
          error: 'Invalid email or password',
          requiresCaptcha: newFails >= CAPTCHA_AFTER,
          attemptsLeft: Math.max(0, MAX_FAILS - newFails),
        },
        { status: 401 }
      )
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      await recordFail(email)
      const newFails = fails + 1
      return NextResponse.json(
        {
          error: 'Invalid email or password',
          requiresCaptcha: newFails >= CAPTCHA_AFTER,
          attemptsLeft: Math.max(0, MAX_FAILS - newFails),
        },
        { status: 401 }
      )
    }

    // ── Success ───────────────────────────────────────────────────────────────
    await clearFails(email)

    return NextResponse.json({
      message: 'Login successful',
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
