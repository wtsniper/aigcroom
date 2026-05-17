import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const metadata = {
  title: 'Industry Solutions | AIGC Room',
  description: 'Curated AI tool packages for different industries and use cases',
}

export default async function SolutionsPage() {
  let solutions: {
    id: string
    title: string
    slug: string
    description: string
    industry: string
    icon: string
    isFeatured: boolean
  }[] = []

  try {
    solutions = await prisma.solution.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        industry: true,
        icon: true,
        isFeatured: true,
      },
    })
  } catch (error) {
    console.error('Error fetching solutions:', error)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">Industry Solutions</h1>
      <p className="text-gray-600 mb-8">
        Curated AI tool packages for different industries and use cases
      </p>

      {solutions.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No solutions available yet. Check back soon!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {solutions.map((solution) => (
            <div
              key={solution.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <span className="text-sm text-blue-600 font-medium">{solution.industry}</span>
              <Link href={`/solutions/${solution.slug}`}>
                <h2 className="text-xl font-semibold mt-2 hover:text-blue-600">
                  {solution.title}
                </h2>
              </Link>
              <p className="text-gray-600 mt-2 text-sm">{solution.description}</p>
              <Link
                href={`/solutions/${solution.slug}`}
                className="mt-4 inline-block text-blue-600 text-sm font-medium hover:underline"
              >
                View Solution →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
