/**
 * Day 8 — workflow article + pillar SEO (May 28, 2026)
 * node scripts/publish-daily-articles-may28.mjs
 */

import { PrismaClient } from '@prisma/client'

const p = new PrismaClient()
const ADMIN_ID = 'fckadsn7skgmozq8tys'
const PUBLISHED_AT = new Date('2026-05-28T08:00:00.000Z')

const ARTICLES = [
  {
    title: 'How Zombie Scavenger & Hell Grind Were Made: AI Workflow (2026)',
    slug: 'zombie-scavenger-hell-grind-ai-workflow-2026',
    excerpt:
      'Public credits and workflow notes for two viral 2026 AI shorts — Seedance, CapCut, Higgsfield Soul Cinema, and how indie vs studio pipelines differ. Watch both films on our AI Shorts hub.',
    content: `# How Zombie Scavenger & Hell Grind Were Made: AI Workflow (2026)

Two of the most discussed **AI short films of 2026** sit at opposite ends of the budget spectrum:

- **[Zombie Scavenger](/ai-shorts#zombie-scavenger)** (丧尸清道夫) — a ~3:34 indie short from Yunnan wedding photographer **Mx-Shell**, built with Seedance inside CapCut’s ecosystem  
- **[Hell Grind](/ai-shorts#hell-grind)** — Higgsfield’s ~22-minute Episode 1, expanded from a viral series with **Seedance 2.0**, Soul Cinema, and Soul Cast  

This guide explains the **publicly credited workflows** so you can map your own stack — not copy their films.

> **How we wrote this:** Based on creator credits, press reporting cited on [AI Shorts](/ai-shorts), and official Higgsfield pages — not a behind-the-scenes interview with either team. **Verify tool access and pricing in your region before buying.**

> **Disclosure:** This article contains affiliate links. We may earn a commission at no extra cost to you.

---

## Side-by-Side: Indie vs Studio Pipeline

| | Zombie Scavenger | Hell Grind (Ep. 1) |
|--|------------------|---------------------|
| **Creator** | Mx-Shell (Liu Ziyu) | Higgsfield AI / Aitore Zholdaskali |
| **Length** | ~3:34 | ~22:32 (Ep. 1) |
| **Primary video** | Seedance 2.0 (Xiao Yunque / CapCut path) | Seedance 2.0 (Dreamina / Higgsfield) |
| **Still / concept** | Midjourney, Flux | Soul Cinema, Soul Cast |
| **Edit** | CapCut Pro | Studio pipeline (CapCut-class tools likely; confirm on Higgsfield) |
| **Watch** | [Bilibili embed](/ai-shorts#zombie-scavenger) | [YouTube embed](/ai-shorts#hell-grind) |

Full comparison of video models: [Seedance vs Runway vs Kling](/reviews/seedance-vs-runway-vs-kling-2026)

---

## Workflow A: Zombie Scavenger (Indie / Solo)

Public credits on the film and in press coverage describe a **solo-friendly** stack:

### 1. World & character stills

- **Midjourney** — concept stills and mood  
- **Flux** — select frames (per end-credit tool list on our [AI Shorts entry](/ai-shorts#zombie-scavenger))  

Tip: lock **one character reference sheet** before generating motion — saves regeneration credits.

More: [Midjourney tool page](/tools/midjourney) · [Leonardo vs Midjourney vs Flux](/reviews/leonardo-ai-vs-midjourney-vs-flux-2026)

### 2. Motion generation (Seedance)

- **Seedance 2.0** via the **Xiao Yunque / CapCut** path (Chinese app ecosystem)  
- Shots are generated **short**, then **selected** — the 3:34 runtime is edited pacing, not one continuous render  

If you are outside China, you may need a different Seedance host (Dreamina, Higgsfield, etc.) — see [Best AI Video Tools for Short Films](/reviews/best-ai-video-tools-for-shorts-2026).

### 3. Edit, grade, subtitles

- **CapCut Pro** — cut, color, subtitles (explicitly credited)  

Compare editors: [Descript vs CapCut vs Clipchamp](/reviews/descript-vs-capcut-vs-clipchamp-2026)

### 4. Sound

Press coverage highlights cinematography; **final sound design** (music, SFX, mix) is still human work in most viral AI shorts. Budget time for licensed music.

### What indie creators can copy

1. **Short runtime** (under 4 minutes) for first project  
2. **One strong visual hook** (robot cowboy + wasteland)  
3. **Tool transparency** in credits — builds trust on YouTube/Bilibili  
4. **Heavy edit pass** — viral pacing is editing, not raw generation  

---

## Workflow B: Hell Grind (Studio / Higgsfield)

Hell Grind represents a **studio-scale** Seedance pipeline:

### 1. Series bible & consistency

- **Soul Cinema** — character and world consistency (per Higgsfield credits)  
- **Soul Cast** — cast / character pipeline  

Official series page: [higgsfield.ai/original-series/hell-grind](https://higgsfield.ai/original-series/hell-grind/episode-1)

### 2. Seedance 2.0 at episode length

- Episode 1 runs **~22 minutes** — this is many shots stitched with continuity passes, not one prompt  
- Press reports (~May 2026) cited **~$500K total budget** and a **15-person team** for the broader Hell Grind project — treat that as **studio math**, not a solo hobby budget  

### 3. Distribution & press

- Screened at a **Cannes side event** (May 2026) — city screening, not official festival competition selection (as reported by SCMP, TechNode — summarized on [AI Shorts](/ai-shorts#hell-grind))  
- YouTube Episode 1 on **Higgsfield AI** channel — [watch via our embed](/ai-shorts#hell-grind)  

### What solo creators should *not* assume

- You do **not** need a $500K budget to learn from Hell Grind — study **shot choice** and **tool credits**, not team size  
- **Soul Cinema** solves problems you may not have on shot #3 of your first short — start simpler on [Zombie Scavenger’s scale](/ai-shorts#zombie-scavenger)  

---

## Shared Lessons (Both Films)

| Lesson | Why it matters |
|--------|----------------|
| **Seedance is the 2026 default for viral cinematic AI** | Both credits point to Seedance 2.0 — compare hosts in [Seedance vs Runway vs Kling](/reviews/seedance-vs-runway-vs-kling-2026) |
| **Edit is half the film** | CapCut on indie; professional cut on studio — neither is raw AI output |
| **Disclose AI where platforms require it** | YouTube, Bilibili, and sponsors increasingly expect transparency |
| **Western alternative stack** | [Runway](/tools/runway-ml) + [Kling](/tools/kling-ai) if Seedance apps are unavailable — [Runway vs Pika vs Kling](/reviews/runway-vs-pika-vs-kling-2026) |

---

## Starter Checklist (Your First 3-Minute Short)

1. Write **6–8 beats** (one sentence each)  
2. Generate **keyframes** in Midjourney or Flux  
3. Animate **5–10 clips** in Seedance (or Runway/Kling)  
4. Assemble in **CapCut** — music, SFX, subtitles  
5. Publish with **tool credits** in description  
6. Link readers to [AI Shorts](/ai-shorts) for inspiration  

---

## Monetize the Skill (Optional)

- **YouTube / Bilibili** — ads + sponsorships ([YouTube creator stack](/reviews/best-ai-tools-for-youtube-creators-2026))  
- **Freelance AI video** for brands  
- **Affiliate content site** about tools ([make money hub](/reviews/best-ai-tools-make-money-online-2026))  

---

## FAQ

### What is Seedance 2.0?
A ByteDance video generation model used in multiple apps — not a single website. See [Seedance vs Runway vs Kling](/reviews/seedance-vs-runway-vs-kling-2026).

### Can I remake Zombie Scavenger exactly?
No — respect copyright on the film itself. Use the **workflow** (tools + structure) for your own story.

### Is Hell Grind fully AI-generated?
Higgsfield credits AI generation tools plus a human team for direction, edit, and production — it is a **hybrid** pipeline.

### Where do I watch both films?
[AI Shorts hub](/ai-shorts) — official embeds only.

### Runway instead of Seedance?
Valid path — especially in the US/EU. [Runway ML Review](/reviews/runway-ml-review-2026) · [tool page](/tools/runway-ml)

---

## Related Reading

- [Viral AI Short Films 2026](/ai-shorts)
- [Best AI Video Tools for Short Films](/reviews/best-ai-video-tools-for-shorts-2026)
- [Seedance vs Runway vs Kling](/reviews/seedance-vs-runway-vs-kling-2026)
- [Best AI Tools for YouTube Creators](/reviews/best-ai-tools-for-youtube-creators-2026)

---

*Last updated: May 2026. Tool names from public credits — access and pricing vary by region.*`,
  },
]

let created = 0
let updated = 0

for (const article of ARTICLES) {
  const exists = await p.review.findUnique({ where: { slug: article.slug } })
  const words = article.content.split(/\s+/).filter(Boolean).length

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
}

console.log(`\nDone: ${created} created, ${updated} updated`)
for (const a of ARTICLES) {
  console.log(`  https://www.aigcroom.shop/reviews/${a.slug}`)
}

await p.$disconnect()
