/**
 * 30-day SEO focus checklist — run: node scripts/focus-seo-check.mjs
 */
import { PrismaClient } from '@prisma/client'

const FOCUS = [
  { slug: 'best-ai-books-2026', keyword: 'best ai books 2026', money: 'Amazon' },
  { slug: 'semrush-vs-ahrefs-seo-tools-2026', keyword: 'semrush vs ahrefs 2026', money: 'Semrush affiliate' },
  { slug: 'best-web-hosting-for-ai-projects-2026', keyword: 'best web hosting for ai projects', money: 'Hostinger' },
  { slug: 'amazon-listing-main-image-rejected-2026', keyword: 'amazon main image rejected', money: 'Jasper/Hostinger' },
  { slug: 'best-ai-tools-make-money-online-2026', keyword: 'best ai tools make money online', money: 'Hub' },
]

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aigcroom.shop').replace(/\/$/, '')
const p = new PrismaClient()

console.log('=== AIGC Room — 30-Day Focus Plan ===\n')
console.log(`Site URL: ${siteUrl}`)
console.log(`Robots sitemap should be: ${siteUrl}/sitemap.xml`)
console.log('(Production was pointing to aigcroom.com — fix deployed; redeploy + set NEXT_PUBLIC_SITE_URL)\n')

console.log('--- 5 Priority Articles ---')
for (const { slug, keyword, money } of FOCUS) {
  const url = `${siteUrl}/reviews/${slug}`
  const review = await p.review.findFirst({ where: { slug, status: 'PUBLISHED' } })
  const status = review ? 'PUBLISHED' : 'MISSING'
  console.log(`\n[${status}] ${slug}`)
  console.log(`  URL: ${url}`)
  console.log(`  Keyword: ${keyword}`)
  console.log(`  Money: ${money}`)
}

const clicks = await p.affiliateLink.aggregate({ _sum: { clicks: true, revenue: true } })
console.log('\n--- Current Affiliate Stats ---')
console.log(`  Total clicks: ${clicks._sum.clicks ?? 0}`)
console.log(`  Revenue logged: $${(clicks._sum.revenue ?? 0).toFixed(2)}`)

console.log('\n--- Google Search Console (do this today) ---')
console.log('1. Add property: https://www.aigcroom.shop')
console.log('2. Submit sitemap: ' + siteUrl + '/sitemap.xml')
console.log('3. URL Inspection → Request indexing for each priority URL above')
console.log('4. In 7 days check: Performance → which of the 5 get impressions')

console.log('\n--- External links (1 per priority article this week) ---')
console.log('- Reddit r/AmazonSeller, r/juststart, r/artificial')
console.log('- V2EX / 知乎 跨境专栏 — Amazon 主图那篇')
console.log('- Indie Hackers — make money + hosting guides')

console.log('\n--- Do NOT write new articles until week 3 ---')
console.log('Focus: indexing + backlinks + refresh these 5 titles/meta if needed.\n')

await p.$disconnect()
