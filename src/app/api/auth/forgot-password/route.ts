import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendPasswordResetEmail } from '@/lib/email'

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || !validateEmail(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })

    // Always return the same message — do not reveal whether the email exists
    const okMessage = 'If this email is registered, a reset code has been sent.'

    if (!user || !user.password) {
      return NextResponse.json({ message: okMessage })
    }

    const recentCodes = await prisma.emailVerification.count({
      where: {
        email,
        type: 'RESET_PASSWORD',
        createdAt: { gte: new Date(Date.now() - 60 * 1000) },
      },
    })
    if (recentCodes >= 3) {
      return NextResponse.json({ error: 'Too many requests. Please wait 1 minute.' }, { status: 429 })
    }

    const code = generateCode()
    await prisma.emailVerification.create({
      data: {
        email,
        code,
        type: 'RESET_PASSWORD',
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    })

    const sent = await sendPasswordResetEmail(email, code)

    if (!sent && process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Email service is not configured. Please contact support.' },
        { status: 503 }
      )
    }

    if (!sent) {
      console.log(`[DEV] Password reset code for ${email}: ${code}`)
      return NextResponse.json({ message: okMessage, devCode: code })
    }

    return NextResponse.json({ message: okMessage })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
