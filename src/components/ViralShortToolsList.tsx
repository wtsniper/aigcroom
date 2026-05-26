import Link from 'next/link'
import type { ViralShortTool } from '@/lib/viral-ai-shorts'
import { resolveShortToolHref } from '@/lib/ai-shorts-monetization'

export default function ViralShortToolsList({ tools }: { tools: ViralShortTool[] }) {
  return (
    <ul className="space-y-2">
      {tools.map((tool) => {
        const link = resolveShortToolHref(tool)
        return (
          <li key={tool.name} className="flex items-start gap-2 text-sm">
            {link ? (
              link.external ? (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="text-violet-400 hover:text-violet-300 font-medium shrink-0"
                >
                  {link.label} ↗
                </a>
              ) : (
                <Link
                  href={link.href}
                  className="text-violet-400 hover:text-violet-300 font-medium shrink-0"
                >
                  {link.label}
                </Link>
              )
            ) : (
              <span className="text-white font-medium shrink-0">{tool.name}</span>
            )}
            {tool.role && <span className="text-gray-500">— {tool.role}</span>}
          </li>
        )
      })}
    </ul>
  )
}
