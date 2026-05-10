import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { db } from '@/lib/db-simple'

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'USER',
      },
    })

    await db.subscription.create({
      data: {
        userId: user.id,
        planType: 'FREE',
        status: 'ACTIVE',
      },
    })

    return NextResponse.json(
      { message: 'User created successfully', user: { id: user.id, name, email } },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
