import { pageMetadata, buildBreadcrumbJsonLd, JsonLd } from '@/lib/seo'
import { getPublishedViralShorts } from '@/lib/ai-shorts-db'
import {
  displaySubtitle,
  displayTitle,
  paginateViralShortsList,
} from '@/lib/viral-ai-shorts'
import AiShortsPagination from '@/components/AiShortsPagination'
import ViralShortPlayer from '@/components/ViralShortPlayer'

export const metadata = pageMetadata(
  '/ai-shorts',
  'Viral AI Short Films 2026 | YouTube & Bilibili',
  'Curated viral AI short films — watch on YouTube or Bilibili.'
)

type PageProps = {
  searchParams: Promise<{ page?: string }>
}

export default async function AiShortsPage({ searchParams }: PageProps) {
  const { page: pageParam } = await searchParams
  const requestedPage = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)
  const allShorts = await getPublishedViralShorts()
  const { items, totalPages, currentPage, total } = paginateViralShortsList(
    allShorts,
    requestedPage
  )

  const jsonLd = buildBreadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'AI Shorts', path: '/ai-shorts' },
  ])

  return (
    <>
      <div className="container mx-auto px-4 py-8 md:py-10 max-w-6xl">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8">
          AI Short Films
          <span className="text-gray-500 text-lg font-normal ml-2">({total})</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {items.map((short, index) => {
            const subtitle = displaySubtitle(short)
            return (
              <article key={short.id} id={short.id} className="scroll-mt-24">
                <ViralShortPlayer
                  short={short}
                  autoplay={currentPage === 1 && index === 0}
                  minimal
                />
                <h2 className="text-lg font-semibold text-white mt-3 leading-snug">
                  {displayTitle(short)}
                </h2>
                {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
                <p className="text-sm text-gray-400 mt-1">{short.creator}</p>
              </article>
            )
          })}
        </div>

        <AiShortsPagination currentPage={currentPage} totalPages={totalPages} />
      </div>
      <JsonLd data={jsonLd} />
    </>
  )
}
