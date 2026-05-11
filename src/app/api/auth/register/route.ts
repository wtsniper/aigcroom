import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { prisma } from '@/lib/prisma'

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validatePassword(password: string): boolean {
  if (password.length < 6 || password.length > 128) return false
  return /[a-zA-Z]/.test(password) && /\d/.test(password)
}

function validateName(name: string): boolean {
  return name.length >= 2 && name.length <= 50
}

export async function POST(request: Request) {
  try {
    const { name, email, password, verificationCode } = await request.json()

    if (!name || !email || !password || !verificationCode) {
      return NextResponse.json(
        { error: 'Name, email, password and verification code are required' },
        { status: 400 }
      )
    }

    if (!validateName(name)) {
      return NextResponse.json({ error: 'Name must be 2-50 characters' }, { status: 400 })
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

    const verification = await prisma.emailVerification.findFirst({
      where: {
        email,
        code: verificationCode,
        type: 'REGISTER',
        used: true,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    })

    if (!verification) {
      return NextResponse.json(
        { error: 'Please verify your email first' },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerified: new Date(),
        role: 'USER',
      },
    })

    await prisma.subscription.create({
      data: { userId: user.id, planType: 'FREE', status: 'ACTIVE' },
    })

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
