import Link from 'next/link'

type AiShortsPaginationProps = {
  currentPage: number
  totalPages: number
}

function pageHref(page: number): string {
  return page <= 1 ? '/ai-shorts' : `/ai-shorts?page=${page}`
}

export default function AiShortsPagination({ currentPage, totalPages }: AiShortsPaginationProps) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <nav
      className="flex flex-wrap items-center justify-center gap-2 mt-10 pt-8 border-t border-white/[0.06]"
      aria-label="AI shorts pagination"
    >
      <Link
        href={pageHref(currentPage - 1)}
        aria-disabled={currentPage <= 1}
        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
          currentPage <= 1
            ? 'pointer-events-none opacity-30 border-white/5 text-gray-600'
            : 'border-white/10 text-gray-300 hover:text-white hover:border-white/20'
        }`}
      >
        ← Prev
      </Link>

      {pages.map((page) => (
        <Link
          key={page}
          href={pageHref(page)}
          aria-current={page === currentPage ? 'page' : undefined}
          className={`min-w-[2.5rem] px-3 py-2 rounded-lg text-sm font-medium border text-center transition-colors ${
            page === currentPage
              ? 'bg-violet-500/20 border-violet-500/40 text-white'
              : 'border-white/10 text-gray-400 hover:text-white hover:border-white/20'
          }`}
        >
          {page}
        </Link>
      ))}

      <Link
        href={pageHref(currentPage + 1)}
        aria-disabled={currentPage >= totalPages}
        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
          currentPage >= totalPages
            ? 'pointer-events-none opacity-30 border-white/5 text-gray-600'
            : 'border-white/10 text-gray-300 hover:text-white hover:border-white/20'
        }`}
      >
        Next →
      </Link>
    </nav>
  )
}
