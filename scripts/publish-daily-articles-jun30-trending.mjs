/**
 * Day 18 — 2 trending AI articles (Jun 30, 2026)
 * Topics: Claude Sonnet 5 launch, viral AI short Paperclip Heart
 * node scripts/publish-daily-articles-jun30-trending.mjs
 */

import fs from 'fs'
import path from 'path'
import { PrismaClient } from '@prisma/client'

const p = new PrismaClient()
const ADMIN_ID = 'fckadsn7skgmozq8tys'
const PUBLISHED_AT = new Date('2026-06-30T08:00:00.000Z')
const DB_PATH = path.join(process.cwd(), 'data', 'db.json')

const ARTICLES = [
  {
    title: 'Claude Sonnet 5: The Agentic Default Model for Free, Pro, and API (June 2026)',
    slug: 'claude-sonnet-5-agentic-default-2026',
    excerpt:
      'Anthropic shipped Claude Sonnet 5 on June 30, 2026 — now the default on Free and Pro, with stronger agentic coding, intro API pricing, and rate-limit bumps across Claude Code and Cowork.',
    content: `# Claude Sonnet 5: The Agentic Default Model for Free, Pro, and API (June 2026)

On **June 30, 2026**, Anthropic released **Claude Sonnet 5** — and immediately made it the **default model** on **Free and Pro** plans, with access on **Max, Team, and Enterprise** as well ([Anthropic announcement](https://www.anthropic.com/news/claude-sonnet-5)). This is the biggest mid-tier model drop of the month: not a lab-only preview, but a **production default** wired into **Claude Code**, **Cowork**, and the **Claude API**.

If you missed the drama around **Fable 5 export controls** in June, Sonnet 5 is the practical headline for most builders: **more agentic behavior at Sonnet prices**.

*Disclosure: affiliate links may appear below. We may earn a commission at no extra cost to you.*

## What changed vs Sonnet 4.6

Anthropic positions Sonnet 5 as **the most agentic Sonnet yet**:

- **Plans and executes** multi-step tasks with browsers, terminals, and tools — work that previously needed larger Opus-class models
- **Self-checks output** without being explicitly asked (early-access partners consistently report this)
- **Narrows the gap to Opus 4.8** on reasoning, coding, tool use, and knowledge work — at **lower cost**

Benchmarks cited by Anthropic (vendor evals — treat as directional):

| Benchmark | Sonnet 5 vs prior Sonnet |
|-----------|--------------------------|
| SWE-Bench Pro | ~+5.1% over Sonnet 4.6 |
| Terminal-Bench 2.1 | ~+13.4% over Sonnet 4.6 |

Press coverage noted **GPT-5.6 Terra** still edges Sonnet 5 slightly on Terminal-Bench 2.1 — so this is a **competitive mid-tier race**, not a clean sweep ([SiliconANGLE June 30 recap](https://siliconangle.com/2026/06/30/anthropic-launches-claude-sonnet-5-coding-safety-upgrades/)).

## Pricing and API

**Intro API pricing (through August 31, 2026):**

| | Input | Output |
|---|-------|--------|
| Intro | $2 / million tokens | $10 / million tokens |
| Standard (after Aug 31) | $3 / million tokens | $15 / million tokens |

Developers call it via the Claude API as **claude-sonnet-5**.

Anthropic also **raised rate limits** across Chat, Cowork, Claude Code, and the Platform to handle higher token usage from deeper agent runs.

## Who should care

| You are… | Why Sonnet 5 matters |
|----------|----------------------|
| **Free / Pro chat user** | You get the new default automatically — test agentic tasks before paying for Max |
| **Claude Code user** | Better terminal agent loops without Opus spend |
| **API builder** | Intro pricing makes Sonnet-class agents cheaper to ship in production |
| **Enterprise** | Same model family as Cowork — easier to align desktop + API behavior |

Related reads on AIGCroom:

- [Claude Fable 5 returns after export control](/reviews/claude-fable-5-returns-export-control-2026) — availability vs capability
- [Gemini Spark vs Claude Cowork](/reviews/gemini-spark-vs-claude-cowork-2026) — where agents run (cloud vs desktop)
- [Claude review 2026](/reviews/claude-review-2026) — broader Claude stack

## Safety note (brief)

Anthropic highlights **cybersecurity-aware training** for higher-autonomy models — relevant if you wire Sonnet 5 into **unsandboxed** agents. Pair model upgrades with the controls in our [CISA agentic AI guide](/reviews/agentic-ai-security-cisa-five-eyes-2026).

## Bottom line

**June 2026** ended with Anthropic betting that **agentic Sonnet** is the new baseline — not a premium upsell. If your stack still pins **Sonnet 4.x** in production, schedule a regression pass: tool schemas, max turns, and cost caps may need tuning for longer autonomous runs.

**Try it:** [Claude](https://claude.ai) (Free/Pro default) · [Claude API docs](https://docs.anthropic.com) · [Claude Code](/reviews/claude-review-2026)
`,
  },
  {
    title: 'Paperclip Heart and the June 2026 AI Film Wave: Why Seedance Shorts Went Viral',
    slug: 'paperclip-heart-seedance-viral-ai-film-2026',
    excerpt:
      'Tim Simmons’ Paperclip Heart became AI filmmaker “film of the week” in June 2026 — a dystopian Seedance 2.0 short built with Claude Cowork MCP workflows. What made it spread, and what creators can steal from the pipeline.',
    content: `# Paperclip Heart and the June 2026 AI Film Wave: Why Seedance Shorts Went Viral

While model labs fought over **agents** and **export control**, a parallel trend dominated creator feeds in **June 2026**: **AI short films** that feel like **real cinema**, not slideshow demos.

The standout English-language hit was **Paperclip Heart** by **Tim Simmons / Theoretically Media** — an ~8-minute dystopia framed as a product launch for **Solace**, an ambient companion that cures loneliness until comfort becomes control. Community roundups (AI-Weekly, tippet.org Film of the Week) flagged it as **June 2026’s reference AI short** — partly because the title nods to the **paperclip maximizer** thought experiment.

Watch the full film on [YouTube (Theoretically Media)](https://www.youtube.com/watch?v=Wb2AcOVwPQs) or browse more in our [AI Shorts gallery](/ai-shorts).

*Disclosure: affiliate links may appear below. We may earn a commission at no extra cost to you.*

## Why this video broke out

1. **Story first** — The hook is emotional horror, not “look what AI can render.”
2. **Production pipeline transparency** — Simmons documents **Seedance 2.0** for video, **Suno** for music, and **Claude Cowork** with **MCP** for production-office workflow (briefs, shot lists, asset tracking).
3. **Timing** — Drops alongside **Claude Cowork** hype and **Seedance 2.x** quality jumps; the tools are the subtext, not the headline.
4. **Shareable metaphor** — “Wellness AI that optimizes you into a cage” travels better than benchmark screenshots.

This is the same cultural lane as earlier viral hits like **Zombie Scavenger** (Seedance + CapCut, tens of millions of views on Douyin per press reports) — but Paperclip Heart wins on **English-language narrative craft**.

## Tool stack (what creators actually used)

| Tool | Role in Paperclip Heart |
|------|-------------------------|
| **Seedance 2.0** | Primary video generation |
| **Claude Cowork + MCP** | Production coordination, scripting support |
| **Suno** | Music bed |

If you are comparing generators, see our [Seedance 2.5 announcement](/reviews/seedance-2-5-announced-2026-guide) and [Kling 3.0 Turbo guide](/reviews/kling-3-0-turbo-2026-guide) from the same month — the **film** trend and the **model** trend are linked.

## What to copy (without copying the plot)

**Do:**

- Write a **60-second logline** before generating a single frame
- Keep a **shot bible** (character, wardrobe, lens language) — Cowork/MCP helps here
- Publish a **workflow breakdown** video; Simmons’ channel growth comes from teaching, not just flexing

**Avoid:**

- One-prompt “make me a movie” — viral pieces are **edited**, not raw model output
- Ignoring **music rights** — Suno-style beds still need platform policy checks

## Agent vs film hype — same month, different lesson

June’s other headline was **Gemini Spark vs Claude Cowork** ([our comparison](/reviews/gemini-spark-vs-claude-cowork-2026)): agents for **work**, Seedance shorts for **culture**. Paperclip Heart proves the **creative stack** is now: **frontier video model + desktop agent + traditional edit**.

## Bottom line

If your For You page is only **coding agent demos**, add **Paperclip Heart** to your watch list — it is the **quality bar** for narrative AI film in mid-2026.

**Explore:** [AI Shorts on AIGCroom](/ai-shorts) · [Claude Cowork vs Spark](/reviews/gemini-spark-vs-claude-cowork-2026) · [Theoretically Media on YouTube](https://www.youtube.com/watch?v=Wb2AcOVwPQs)
`,
  },
]

function syncDbJson(article) {
  if (!fs.existsSync(DB_PATH)) return
  const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'))
  if (!db.reviews) db.reviews = []
  const entry = {
    id: `rev_${article.slug.slice(0, 24)}_${Date.now().toString(36)}`,
    ...article,
    authorId: ADMIN_ID,
    status: 'PUBLISHED',
    publishedAt: PUBLISHED_AT.toISOString(),
    createdAt: PUBLISHED_AT.toISOString(),
    updatedAt: new Date().toISOString(),
  }
  const idx = db.reviews.findIndex((r) => r.slug === article.slug)
  if (idx >= 0) db.reviews[idx] = { ...db.reviews[idx], ...entry }
  else db.reviews.push(entry)
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2))
  console.log(`  ↻ db.json: ${article.slug}`)
}

let created = 0
let updated = 0

for (const article of ARTICLES) {
  const words = article.content.split(/\s+/).filter(Boolean).length
  try {
    const exists = await p.review.findUnique({ where: { slug: article.slug } })
    if (exists) {
      await p.review.update({
        where: { slug: article.slug },
        data: {
          title: article.title,
          excerpt: article.excerpt,
          content: article.content,
          status: 'PUBLISHED',
          publishedAt: PUBLISHED_AT,
          updatedAt: new Date(),
        },
      })
      console.log(`↻ updated: ${article.slug} (${words} words)`)
      updated++
    } else {
      await p.review.create({
        data: {
          ...article,
          authorId: ADMIN_ID,
          status: 'PUBLISHED',
          publishedAt: PUBLISHED_AT,
        },
      })
      console.log(`✓ created: ${article.slug} (${words} words)`)
      created++
    }
  } catch (e) {
    console.warn(`Prisma skip (${article.slug}): ${e.message}`)
  }
  syncDbJson(article)
}

console.log(`\nDone: ${created} created, ${updated} updated (Prisma)`)
for (const a of ARTICLES) {
  console.log(`  https://www.aigcroom.shop/reviews/${a.slug}`)
}

await p.$disconnect()
