import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const SESSION_COOKIE = 'aigcroom_session'
const SESSION_TTL_SEC = 7 * 24 * 60 * 60

export interface SessionUser {
  id: string
  email: string
  name: string | null
  role: string
}

function getSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET || process.env.SESSION_SECRET
  if (!secret || secret === 'your-super-secret-key-here-change-in-production') {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('NEXTAUTH_SECRET must be set in production')
    }
    return 'dev-only-session-secret-change-me'
  }
  return secret
}

export function signSessionToken(user: SessionUser): string {
  return jwt.sign(
    { sub: user.id, email: user.email, name: user.name, role: user.role },
    getSecret(),
    { expiresIn: SESSION_TTL_SEC }
  )
}

export function verifySessionToken(token: string): SessionUser | null {
  try {
    const payload = jwt.verify(token, getSecret()) as jwt.JwtPayload
    if (!payload.sub || typeof payload.email !== 'string') return null
    return {
      id: payload.sub,
      email: payload.email,
      name: (payload.name as string | null) ?? null,
      role: (payload.role as string) || 'USER',
    }
  } catch {
    return null
  }
}

export function parseCookieToken(cookieHeader: string | null): SessionUser | null {
  if (!cookieHeader) return null
  const match = cookieHeader.match(new RegExp(`(?:^|; )${SESSION_COOKIE}=([^;]*)`))
  if (!match) return null
  return verifySessionToken(decodeURIComponent(match[1]))
}

export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (!token) return null
  return verifySessionToken(token)
}

export function getSessionFromRequest(request: Request): SessionUser | null {
  return parseCookieToken(request.headers.get('cookie'))
}

export function setSessionCookie(response: NextResponse, token: string): void {
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_SEC,
  })
}

export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set(SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
}

export function isAdminSession(session: SessionUser | null): boolean {
  return session?.role === 'ADMIN'
}

export async function requireAuth(request: Request): Promise<SessionUser | NextResponse> {
  const session = getSessionFromRequest(request)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return session
}

export async function requireAdmin(request: Request): Promise<SessionUser | NextResponse> {
  const apiKey = request.headers.get('x-admin-key')
  if (apiKey && process.env.ADMIN_API_KEY && apiKey === process.env.ADMIN_API_KEY) {
    return { id: 'system', email: 'system@aigcroom.shop', name: 'System', role: 'ADMIN' }
  }

  const session = getSessionFromRequest(request)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  return session
}

export function isSafeRedirectUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' || parsed.protocol === 'http:'
  } catch {
    return false
  }
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
