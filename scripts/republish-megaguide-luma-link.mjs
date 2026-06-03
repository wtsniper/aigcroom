import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { PrismaClient } from '@prisma/client'

const p = new PrismaClient()
const content = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), 'content/ai-video-generators-compared-2026.md'),
  'utf8'
)
await p.review.update({
  where: { slug: 'ai-video-generators-compared-2026-complete-guide' },
  data: { content, updatedAt: new Date() },
})
console.log('↻ megaguide updated with Luma link')
await p.$disconnect()
