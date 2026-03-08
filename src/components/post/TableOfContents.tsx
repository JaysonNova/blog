'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils/cn'

interface Heading {
  level: number
  text: string
  id: string
}

interface TableOfContentsProps {
  headings: Heading[]
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: '-80px 0px -80% 0px' }
    )

    for (const heading of headings) {
      const el = document.getElementById(heading.id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <nav className="hidden xl:block" aria-label="目录">
      <div className="sticky top-[100px]">
        <h4 className="text-sm font-semibold text-foreground mb-md">目录</h4>
        <ul className="space-y-sm">
          {headings.map((heading) => (
            <li
              key={heading.id}
              style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
            >
              <a
                href={`#${heading.id}`}
                className={cn(
                  'block text-sm no-underline transition-colors',
                  activeId === heading.id
                    ? 'text-accent font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
