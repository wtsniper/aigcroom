import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { prisma } from '@/lib/prisma'
import { verifyCaptchaToken } from '../captcha/route'

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validatePassword(password: string): boolean {
  if (password.length < 6 || password.length > 128) return false
  return /[a-zA-Z]/.test(password) && /\d/.test(password)
}

export async function POST(request: Request) {
  try {
    const { email, code, password, captchaToken, captchaAnswer } = await request.json()

    if (!email || !code || !password) {
      return NextResponse.json({ error: 'Email, code and new password are required' }, { status: 400 })
    }
    if (!validateEmail(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }
    if (!validatePassword(password)) {
      return NextResponse.json(
        { error: 'Password must be 6-128 characters and contain both letters and numbers' },
        { status: 400 }
      )
    }
    if (!captchaToken || !captchaAnswer || !verifyCaptchaToken(captchaToken, captchaAnswer)) {
      return NextResponse.json({ error: 'Incorrect captcha answer. Please try again.' }, { status: 400 })
    }

    const verification = await prisma.emailVerification.findFirst({
      where: {
        email,
        code,
        type: 'RESET_PASSWORD',
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    })

    if (!verification) {
      return NextResponse.json({ error: 'Invalid or expired reset code' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ error: 'Invalid or expired reset code' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      }),
      prisma.emailVerification.update({
        where: { id: verification.id },
        data: { used: true },
      }),
      prisma.emailVerification.deleteMany({
        where: { email, type: 'LOGIN_FAIL' },
      }),
    ])

    return NextResponse.json({ message: 'Password reset successful. You can log in now.' })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
