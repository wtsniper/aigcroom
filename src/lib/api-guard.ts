import { NextResponse } from 'next/server'
import { requireAdmin, requireAuth } from '@/lib/auth'

type RouteHandler<TContext = unknown> = (
  request: Request,
  context: TContext
) => Promise<NextResponse>

export function withAdmin<TContext = unknown>(
  handler: RouteHandler<TContext>
): RouteHandler<TContext> {
  return async (request, context) => {
    const auth = await requireAdmin(request)
    if (auth instanceof NextResponse) return auth
    return handler(request, context)
  }
}

export function withAuth<TContext = unknown>(
  handler: RouteHandler<TContext>
): RouteHandler<TContext> {
  return async (request, context) => {
    const auth = await requireAuth(request)
    if (auth instanceof NextResponse) return auth
    return handler(request, context)
  }
}
