import { prisma } from '@/lib/prisma'
import { getSiteUrl } from '@/lib/site-url'

export const dynamic = 'force-dynamic'
export const revalidate = 3600

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function GET() {
  const base = getSiteUrl()
  const reviews = await prisma.review.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { publishedAt: 'desc' },
    take: 40,
    select: {
      title: true,
      slug: true,
      excerpt: true,
      publishedAt: true,
      updatedAt: true,
    },
  })

  const items = reviews
    .map((r) => {
      const link = `${base}/reviews/${r.slug}`
      const pub = (r.publishedAt ?? r.updatedAt).toISOString()
      return `
  <item>
    <title>${escapeXml(r.title)}</title>
    <link>${link}</link>
    <guid isPermaLink="true">${link}</guid>
    <description>${escapeXml(r.excerpt)}</description>
    <pubDate>${pub}</pubDate>
  </item>`
    })
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AIGC Room — AI Tool Reviews &amp; Comparisons</title>
    <link>${base}</link>
    <description>Latest hands-on AI tool reviews, comparisons, and creator guides.</description>
    <language>en-us</language>
    <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
