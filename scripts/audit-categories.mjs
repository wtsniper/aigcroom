import { PrismaClient } from '@prisma/client'

const TOOL_CATEGORIES = [
  { slug: 'ai-writing', name: 'AI Writing', match: ['AI Writing', 'AI Writing Tools', 'Writing'] },
  { slug: 'ai-image', name: 'AI Image', match: ['AI Image', 'AI Image Generation', 'Image Generation', 'Design'] },
  { slug: 'ai-video', name: 'AI Video', match: ['AI Video', 'AI Video Tools', 'Video Generation', 'Video'] },
  { slug: 'ai-coding', name: 'AI Coding', match: ['Coding', 'AI Coding'] },
  { slug: 'ai-chat', name: 'AI Chat & Assistants', match: ['Chat Assistant', 'AI Chatbots', 'Search & Research', 'AI Search & Research'] },
  { slug: 'ai-audio', name: 'AI Audio & Voice', match: ['AI Audio', 'AI Audio & Voice', 'Audio'] },
  { slug: 'ai-productivity', name: 'AI Productivity', match: ['AI Productivity', 'Productivity', 'Business'] },
  { slug: 'ai-marketing', name: 'AI Marketing', match: ['Marketing'] },
]

const byDb = {}
for (const c of TOOL_CATEGORIES) {
  for (const m of c.match) byDb[m] = c
}

const p = new PrismaClient()
const tools = await p.tool.findMany({
  select: { name: true, slug: true, category: true },
  orderBy: [{ category: 'asc' }, { name: 'asc' }],
})

const byCanonical = Object.fromEntries(TOOL_CATEGORIES.map((c) => [c.slug, []]))
const unmappedDbValues = new Set()

for (const t of tools) {
  const c = byDb[t.category]
  if (!c) unmappedDbValues.add(t.category)
  else byCanonical[c.slug].push(t)
}

console.log('=== DB category values → canonical mapping ===')
const dbCats = [...new Set(tools.map((t) => t.category))].sort()
for (const db of dbCats) {
  const c = byDb[db]
  const count = tools.filter((t) => t.category === db).length
  console.log(`${String(count).padStart(2)}  ${db.padEnd(28)} → ${c ? c.name : '*** UNMAPPED ***'}`)
}

const bad = tools.filter((t) => !byDb[t.category])
console.log('\n=== Unmapped tools ===')
if (bad.length === 0) console.log('None')
else bad.forEach((t) => console.log(`  - ${t.name} (${t.category})`))

console.log('\n=== Tools per canonical category ===')
for (const c of TOOL_CATEGORIES) {
  const list = byCanonical[c.slug]
  console.log(`\n[${c.name}] (${list.length} tools)`)
  list.forEach((t) => console.log(`  - ${t.name} (db: ${t.category})`))
}

console.log(`\nTotal: ${tools.length} tools | Mapped: ${tools.length - bad.length} | Unmapped: ${bad.length}`)

await p.$disconnect()
