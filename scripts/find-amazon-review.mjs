import { PrismaClient } from '@prisma/client'

const p = new PrismaClient()
const reviews = await p.review.findMany({
  select: { title: true, slug: true, status: true, createdAt: true, excerpt: true, content: true },
  orderBy: { createdAt: 'desc' },
})

const matches = reviews.filter(
  (r) =>
    /amazon|book|书籍|赚钱|make money|prompt engineering/i.test(r.title) ||
    /amazon|aigcroom-20|amzn\.to/i.test(r.content || '')
)

console.log('=== Amazon/book related reviews ===')
for (const r of matches) {
  console.log(`\n[${r.status}] ${r.title}`)
  console.log(`  slug: ${r.slug}`)
  console.log(`  created: ${r.createdAt.toISOString()}`)
  console.log(`  excerpt: ${r.excerpt?.slice(0, 120)}...`)
}

console.log('\n=== Latest 10 reviews ===')
for (const r of reviews.slice(0, 10)) {
  console.log(`${r.createdAt.toISOString().slice(0, 10)} | ${r.slug} | ${r.title.slice(0, 70)}`)
}

await p.$disconnect()
