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
    <div className="container mx-auto px-4 py-10 max-w-7xl">
      <h1 className="text-3xl font-extrabold text-white mb-3">Industry Solutions</h1>
      <p className="text-gray-400 mb-10">
        Curated AI tool packages for different industries and use cases
      </p>

      {solutions.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No solutions available yet. Check back soon!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {solutions.map((solution) => (
            <div
              key={solution.id}
              className="glass rounded-2xl p-6 hover:border-violet-500/30 transition-all"
            >
              <span className="text-xs px-2.5 py-1 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20 font-medium">
                {solution.industry}
              </span>
              <Link href={`/solutions/${solution.slug}`}>
                <h2 className="text-lg font-semibold text-white mt-3 mb-2 hover:text-violet-400 transition-colors">
                  {solution.title}
                </h2>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed">{solution.description}</p>
              <Link
                href={`/solutions/${solution.slug}`}
                className="mt-4 inline-flex items-center gap-1 text-violet-400 text-sm font-medium hover:text-violet-300 transition-colors"
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
