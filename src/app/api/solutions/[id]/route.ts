import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const solution = await prisma.solution.findUnique({ where: { id } })
    if (!solution) {
      return NextResponse.json({ error: 'Solution not found' }, { status: 404 })
    }
    return NextResponse.json(solution)
  } catch (error) {
    console.error('Error fetching solution:', error)
    return NextResponse.json({ error: 'Failed to fetch solution' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()
    const solution = await prisma.solution.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        industry: data.industry,
        icon: data.icon,
        content: data.content,
        toolIds: Array.isArray(data.toolIds) ? JSON.stringify(data.toolIds) : data.toolIds,
        isFeatured: data.isFeatured,
      },
    })
    return NextResponse.json(solution)
  } catch (error) {
    console.error('Error updating solution:', error)
    return NextResponse.json({ error: 'Failed to update solution' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.solution.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting solution:', error)
    return NextResponse.json({ error: 'Failed to delete solution' }, { status: 500 })
  }
}
