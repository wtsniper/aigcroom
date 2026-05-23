import Link from 'next/link'
import { notFound } from 'next/navigation'
import { escapeHtml } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const solution = await prisma.solution.findUnique({ where: { slug } })
  if (!solution) return { title: 'Solution Not Found' }
  return {
    title: `${solution.title} | AIGC Room`,
    description: solution.description,
  }
}

export default async function SolutionDetailPage({ params }: PageProps) {
  const { slug } = await params

  let solution = null
  let relatedTools: { id: string; name: string; slug: string; description: string }[] = []

  try {
    solution = await prisma.solution.findUnique({ where: { slug } })

    if (solution?.toolIds) {
      const toolIds: string[] = Array.isArray(solution.toolIds)
        ? solution.toolIds
        : JSON.parse(solution.toolIds)

      if (toolIds.length > 0) {
        relatedTools = await prisma.tool.findMany({
          where: { id: { in: toolIds } },
          select: { id: true, name: true, slug: true, description: true },
        })
      }
    }
  } catch (error) {
    console.error('Error fetching solution:', error)
    // DB error — show not found rather than blank Loading screen
  }

  if (!solution) {
    notFound()
  }

  const htmlContent = solution.content
    ? solution.content
        .split('\n')
        .map((line) => {
          const safe = escapeHtml(line)
          if (line.startsWith('## '))
            return `<h2 class="text-xl font-bold mt-6 mb-3">${escapeHtml(line.slice(3))}</h2>`
          if (line.startsWith('# '))
            return `<h1 class="text-2xl font-bold mt-6 mb-3">${escapeHtml(line.slice(2))}</h1>`
          if (line.startsWith('- ')) return `<li class="ml-4">${escapeHtml(line.slice(2))}</li>`
          if (line.match(/^\d+\.\s/)) return `<li class="ml-4">${escapeHtml(line)}</li>`
          if (line.trim() === '') return '<br/>'
          return `<p>${safe}</p>`
        })
        .join('')
    : ''

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-gray-500 flex items-center gap-2">
        <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
        <span>&gt;</span>
        <Link href="/solutions" className="hover:text-gray-300 transition-colors">Solutions</Link>
        <span>&gt;</span>
        <span className="text-gray-400 truncate">{solution.title}</span>
      </div>

      {/* Header card */}
      <div className="glass rounded-2xl p-8 mb-6">
        <div className="mb-4">
          <h1 className="text-3xl font-extrabold text-white">{solution.title}</h1>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-xs px-2.5 py-1 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20 font-medium">
              {solution.industry}
            </span>
            {solution.isFeatured && (
              <span className="text-xs px-2.5 py-1 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 font-medium">
                Featured
              </span>
            )}
          </div>
        </div>
        <p className="text-gray-400 text-lg leading-relaxed">{solution.description}</p>
      </div>

      {/* Content */}
      {htmlContent && (
        <div className="glass rounded-2xl p-8 mb-6">
          <div
            className="prose prose-invert max-w-none text-gray-300 [&_h1]:text-white [&_h2]:text-white [&_h2]:border-b [&_h2]:border-white/10 [&_h2]:pb-2 [&_li]:text-gray-300 [&_p]:text-gray-400"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>
      )}

      {/* Related tools */}
      {relatedTools.length > 0 && (
        <div className="glass rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">Recommended Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedTools.map((tool) => (
              <Link
                key={tool.id}
                href={`/tools/${tool.slug}`}
                className="flex items-center gap-4 p-4 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:border-violet-500/30 hover:bg-white/[0.06] transition-all"
              >
                <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-2xl">🤖</span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-white">{tool.name}</h3>
                  <p className="text-sm text-gray-400 line-clamp-1">{tool.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
