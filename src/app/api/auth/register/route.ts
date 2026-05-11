import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { db } from '@/lib/db-simple'

// 输入验证函数
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function validatePassword(password: string): boolean {
  // 至少6位，包含字母和数字
  if (password.length < 6 || password.length > 128) return false
  const hasLetter = /[a-zA-Z]/.test(password)
  const hasNumber = /\d/.test(password)
  return hasLetter && hasNumber
}

function validateName(name: string): boolean {
  return name.length >= 2 && name.length <= 50
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    // 验证输入
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email and password are required' },
        { status: 400 }
      )
    }

    if (!validateName(name)) {
      return NextResponse.json(
        { error: 'Name must be 2-50 characters' },
        { status: 400 }
      )
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    if (!validatePassword(password)) {
      return NextResponse.json(
        { error: 'Password must be 6-128 characters and contain both letters and numbers' },
        { status: 400 }
      )
    }

    // 检查用户是否已存在
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      )
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 12)

    // 创建用户
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'USER',
      },
    })

    // 创建免费订阅
    await db.subscription.create({
      data: {
        userId: user.id,
        planType: 'FREE',
        status: 'ACTIVE',
      },
    })

    // 不返回密码
    return NextResponse.json(
      {
        message: 'User created successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
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
