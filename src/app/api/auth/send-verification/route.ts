import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || !validateEmail(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }

    const recentCodes = await prisma.emailVerification.findMany({
      where: {
        email,
        createdAt: { gte: new Date(Date.now() - 60 * 1000) },
      },
    })
    if (recentCodes.length >= 3) {
      return NextResponse.json({ error: 'Too many requests. Please wait 1 minute.' }, { status: 429 })
    }

    const code = generateCode()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    await prisma.emailVerification.create({
      data: { email, code, type: 'REGISTER', expiresAt },
    })

    console.log(`[DEV] Verification code for ${email}: ${code}`)

    return NextResponse.json({
      message: 'Verification code sent',
      devCode: process.env.NODE_ENV === 'development' ? code : undefined,
    })
  } catch (error) {
    console.error('Send verification error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
