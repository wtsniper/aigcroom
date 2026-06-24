/**
 * Weekly growth checklist — run: node scripts/growth-weekly-plan.mjs
 */
import { PrismaClient } from '@prisma/client'

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aigcroom.shop').replace(/\/$/, '')
const p = new PrismaClient()

const PRIORITY = [
  'best-ai-books-2026',
  'semrush-vs-ahrefs-seo-tools-2026',
  'best-web-hosting-for-ai-projects-2026',
  'best-ai-tools-make-money-online-2026',
  'runway-vs-pika-vs-kling-2026',
  'seedance-2-5-announced-2026-guide',
]

async function main() {
  console.log('=== AIGC Room — Weekly Growth Plan ===\n')
  console.log(`Site: ${siteUrl}`)
  console.log(`RSS: ${siteUrl}/feed.xml`)
  console.log(`Sitemap: ${siteUrl}/sitemap.xml\n`)

  const [published, tools, clicks, shorts] = await Promise.all([
    p.review.count({ where: { status: 'PUBLISHED' } }),
    p.tool.count(),
    p.affiliateLink.aggregate({ _sum: { clicks: true } }),
    p.aiShort.count({ where: { status: 'PUBLISHED' } }),
  ])

  console.log('--- Inventory ---')
  console.log(`  Reviews: ${published} | Tools: ${tools} | AI shorts: ${shorts}`)
  console.log(`  Affiliate clicks (all time): ${clicks._sum.clicks ?? 0}\n`)

  console.log('--- This week (do all 5) ---')
  console.log('1. GSC Performance — top queries with impressions but 0 clicks → fix titles')
  console.log('2. Request indexing for 3 priority URLs (GSC URL Inspection)')
  console.log('3. Post ONE external asset: Reddit r/aivideo or X — link /ai-shorts')
  console.log('4. Answer 2 community questions with real help + one internal link')
  console.log('5. Refresh 1 old article title/meta — do not mass-publish new posts\n')

  console.log('--- Priority URLs for indexing ---')
  for (const slug of PRIORITY) {
    const ok = await p.review.findFirst({ where: { slug, status: 'PUBLISHED' } })
    console.log(`  ${ok ? '✓' : '✗'} ${siteUrl}/reviews/${slug}`)
  }

  console.log('\n--- Niche angle ---')
  console.log('  Lead with AI VIDEO + viral shorts — not generic "best AI tools"')
}

main()
  .finally(() => p.$disconnect())
