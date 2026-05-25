import { PrismaClient } from '@prisma/client'
import { writeFileSync } from 'fs'

const p = new PrismaClient()
const slugs = [
  'best-vpn-for-ai-developers-2026',
  'best-web-hosting-for-ai-projects-2026',
  'semrush-vs-ahrefs-seo-tools-2026',
]
const reviews = await p.review.findMany({ where: { slug: { in: slugs } } })
for (const r of reviews) {
  writeFileSync(`scripts/tmp-${r.slug}.md`, r.content || '')
  console.log(r.slug, (r.content || '').split(/\s+/).filter(Boolean).length, 'words')
}
await p.$disconnect()
