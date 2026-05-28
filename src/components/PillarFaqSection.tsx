import type { PillarFaq } from '@/lib/pillar-faqs'

export default function PillarFaqSection({
  faqs,
  title = 'FAQ',
  dark = false,
}: {
  faqs: PillarFaq[]
  title?: string
  dark?: boolean
}) {
  if (faqs.length === 0) return null

  return (
    <section className={`mt-12 ${dark ? '' : 'mt-8'}`}>
      <h2 className={`text-xl font-bold mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>{title}</h2>
      <div className="space-y-3">
        {faqs.map((faq) => (
          <details
            key={faq.question}
            className={`group rounded-xl border ${
              dark
                ? 'border-white/[0.08] bg-white/[0.03] open:bg-white/[0.05]'
                : 'border-gray-200 bg-white open:bg-gray-50'
            }`}
          >
            <summary
              className={`cursor-pointer px-4 py-3 text-sm font-medium list-none flex justify-between items-center ${
                dark ? 'text-gray-200' : 'text-gray-900'
              }`}
            >
              {faq.question}
              <span className={`text-xs ml-2 shrink-0 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>+</span>
            </summary>
            <p
              className={`px-4 pb-4 text-sm leading-relaxed ${
                dark ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  )
}
