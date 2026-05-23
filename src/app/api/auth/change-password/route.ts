import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

function validatePassword(password: string): boolean {
  if (password.length < 6 || password.length > 128) return false
  return /[a-zA-Z]/.test(password) && /\d/.test(password)
}

export async function POST(request: Request) {
  const session = await requireAuth(request)
  if (session instanceof NextResponse) return session

  try {
    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Current and new password are required' }, { status: 400 })
    }
    if (!validatePassword(newPassword)) {
      return NextResponse.json(
        { error: 'New password must be 6-128 characters and contain both letters and numbers' },
        { status: 400 }
      )
    }
    if (currentPassword === newPassword) {
      return NextResponse.json({ error: 'New password must be different from current password' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { id: session.id } })
    if (!user?.password) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    }

    const valid = await bcrypt.compare(currentPassword, user.password)
    if (!valid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12)
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    })

    return NextResponse.json({ message: 'Password updated successfully' })
  } catch (error) {
    console.error('Change password error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
