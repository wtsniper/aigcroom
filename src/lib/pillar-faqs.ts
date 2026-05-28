/**
 * Supplemental FAQ copy for SEO pillar pages.
 * Merged with markdown ## FAQ sections on review pages.
 */

export type PillarFaq = { question: string; answer: string }

export const PILLAR_PAGE_KEYS = [
  'ai-shorts',
  'best-ai-books-2026',
  'seedance-vs-runway-vs-kling-2026',
  'amazon-listing-main-image-rejected-2026',
  'best-ai-tools-make-money-online-2026',
] as const

export type PillarPageKey = (typeof PILLAR_PAGE_KEYS)[number]

const PILLAR_FAQS: Record<PillarPageKey, PillarFaq[]> = {
  'ai-shorts': [
    {
      question: 'What are viral AI short films in 2026?',
      answer:
        'Curated narrative videos made primarily with AI video tools such as Seedance, Runway, and Kling — often edited in CapCut or similar. Our hub lists official YouTube and Bilibili embeds plus tools credited by creators.',
    },
    {
      question: 'Where can I watch Zombie Scavenger and Hell Grind?',
      answer:
        'On our AI Shorts page with official embeds: Zombie Scavenger on Bilibili and Hell Grind Episode 1 on YouTube via Higgsfield. We do not self-host video.',
    },
    {
      question: 'Which AI tools were used for Hell Grind?',
      answer:
        'Public credits point to Seedance 2.0 via Higgsfield, Soul Cinema, and Soul Cast. See the Hell Grind entry on aigcroom.shop/ai-shorts and our Seedance vs Runway vs Kling comparison for workflow context.',
    },
    {
      question: 'Can I use these films to learn my own AI video stack?',
      answer:
        'Yes — use creator tool lists as a starting point, then read our workflow guide and comparison articles. Always verify licensing on the platform where you generate video.',
    },
  ],
  'best-ai-books-2026': [
    {
      question: 'Are the AI book links on AIGC Room affiliate links?',
      answer:
        'Yes. As an Amazon Associate we may earn from qualifying purchases. Prices and availability change on Amazon — always check the product page before buying.',
    },
    {
      question: 'Do I need every book on the list?',
      answer:
        'No. Pick one beginner-friendly title and one practice-heavy title for your goal (coding, business, or creativity). The guide explains who each book fits.',
    },
    {
      question: 'Are these books still relevant in 2026?',
      answer:
        'We focus on editions and titles that still ship in print or Kindle. AI moves fast — pair books with our live tool comparisons for up-to-date software picks.',
    },
    {
      question: 'What if an Amazon link shows a different price?',
      answer:
        'Amazon regional stores and promotions change daily. The link may redirect to your local store; verify price and seller before checkout.',
    },
  ],
  'seedance-vs-runway-vs-kling-2026': [
    {
      question: 'Is Seedance the same as Runway?',
      answer:
        'No. Seedance is ByteDance’s video model, usually accessed inside apps like CapCut, Dreamina, or Higgsfield. Runway is a standalone product at runwayml.com.',
    },
    {
      question: 'Which tool made the Hell Grind AI series?',
      answer:
        'Higgsfield credits Seedance 2.0 plus Soul Cinema and Soul Cast. Watch the official embed and tool list on our AI Shorts hub.',
    },
    {
      question: 'Should beginners start with Seedance or Runway?',
      answer:
        'Depends on access in your region. If you already use CapCut or Higgsfield, start with Seedance paths. If you want a Western SaaS with English docs, evaluate Runway or Kling free tiers.',
    },
    {
      question: 'Do you publish benchmark scores for these models?',
      answer:
        'We do not publish lab benchmark scores. Compare tools on your own storyboard using official free tiers and our editorial fit notes.',
    },
  ],
  'amazon-listing-main-image-rejected-2026': [
    {
      question: 'Why was my Amazon main image rejected?',
      answer:
        'Common causes include non-white backgrounds, images under 2000×2000 px, text or badges on the main image, wrong color profile, or props not included in the sale. Check Seller Central for the exact suppression reason.',
    },
    {
      question: 'Does Amazon allow AI-generated main images?',
      answer:
        'Policies vary by category and change over time. Follow Amazon Seller Central image requirements for your marketplace — do not rely on third-party blogs for compliance decisions.',
    },
    {
      question: 'What background color does Amazon require?',
      answer:
        'Most categories require pure white (RGB 255,255,255) for the main image. Always confirm in Seller Central Help for your ASIN type.',
    },
    {
      question: 'Can I fix suppressed listings in bulk?',
      answer:
        'Yes, with consistent export settings (sRGB, 2000×2000+, white background). Batch QA before upload saves re-work; manual edge cleanup still matters for hair and transparent packaging.',
    },
  ],
  'best-ai-tools-make-money-online-2026': [
    {
      question: 'Can you really make money with AI tools in 2026?',
      answer:
        'Yes, but not passively overnight. Common paths include freelancing, affiliate content sites, transcription services, and chatbots for small businesses. Pick one path before buying many subscriptions.',
    },
    {
      question: 'What is the fastest way to earn with AI?',
      answer:
        'Freelancing with AI-assisted delivery (writing, video, transcription) usually pays sooner than SEO affiliate sites, which often take months to rank.',
    },
    {
      question: 'How does AIGC Room make money?',
      answer:
        'Primarily affiliate commissions and Amazon Associates on tool and book recommendations, disclosed on our About and Terms pages.',
    },
    {
      question: 'Do I need Semrush or Hostinger to start?',
      answer:
        'Not on day one. Hostinger helps when you launch a site; Semrush helps when SEO research becomes the bottleneck. See our hosting and Semrush vs Ahrefs guides for fit notes.',
    },
  ],
}

export function getPillarFaqs(key: string): PillarFaq[] {
  if (key in PILLAR_FAQS) {
    return PILLAR_FAQS[key as PillarPageKey]
  }
  return []
}

/** Merge markdown FAQs with pillar defaults; markdown wins on duplicate questions. */
export function mergeFaqs(markdownFaqs: PillarFaq[], pillarKey: string): PillarFaq[] {
  const pillar = getPillarFaqs(pillarKey)
  const seen = new Set(markdownFaqs.map((f) => f.question.toLowerCase()))
  const merged = [...markdownFaqs]
  for (const faq of pillar) {
    if (!seen.has(faq.question.toLowerCase())) {
      merged.push(faq)
      seen.add(faq.question.toLowerCase())
    }
  }
  return merged
}

export function isPillarPage(key: string): key is PillarPageKey {
  return (PILLAR_PAGE_KEYS as readonly string[]).includes(key)
}
