import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { db } from '@/lib/db-simple'

// 输入验证函数
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function validatePassword(password: string): boolean {
  return password.length >= 6 && password.length <= 128
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // 验证输入
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
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
        { error: 'Password must be 6-128 characters' },
        { status: 400 }
      )
    }

    // 查找用户
    const user = await db.user.findUnique({
      where: { email },
    })

    if (!user || !user.password) {
      // 使用相同的错误消息防止用户枚举攻击
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // 验证密码
    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // 不返回敏感信息
    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
