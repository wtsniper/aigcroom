import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json()

    if (!email || !code) {
      return NextResponse.json({ error: 'Email and code are required' }, { status: 400 })
    }

    const verification = await prisma.emailVerification.findFirst({
      where: {
        email,
        code,
        type: 'REGISTER',
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    })

    if (!verification) {
      return NextResponse.json({ error: 'Invalid or expired verification code' }, { status: 400 })
    }

    await prisma.emailVerification.update({
      where: { id: verification.id },
      data: { used: true },
    })

    return NextResponse.json({ message: 'Verification successful' })
  } catch (error) {
    console.error('Verify code error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
