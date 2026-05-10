import { NextResponse } from 'next/server'
import { db } from '@/lib/db-simple'

export async function GET() {
  try {
    const solutions = await db.solution.findMany({
      orderBy: { createdAt: 'desc' },
    })
    
    return NextResponse.json(solutions)
  } catch (error) {
    console.error('Error fetching solutions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch solutions' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    const solution = await db.solution.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        industry: data.industry,
        content: data.content || '',
        toolIds: Array.isArray(data.toolIds) ? JSON.stringify(data.toolIds) : data.toolIds,
        isFeatured: data.isFeatured || false,
      },
    })
    
    return NextResponse.json(solution, { status: 201 })
  } catch (error) {
    console.error('Error creating solution:', error)
    return NextResponse.json(
      { error: 'Failed to create solution' },
      { status: 500 }
    )
  }
}
