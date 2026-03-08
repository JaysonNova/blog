'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

interface Category {
  id: string
  name: string
  slug: string
}

interface CategoryFilterProps {
  categories: Category[]
  currentCategoryId?: string
}

export function CategoryFilter({ categories, currentCategoryId }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-sm mb-xl">
      <Link
        href="/articles"
        className={cn(
          'px-4 py-1.5 text-sm rounded-full border no-underline transition-colors',
          !currentCategoryId
            ? 'bg-foreground text-background border-foreground'
            : 'text-muted-foreground border-border hover:border-foreground hover:text-foreground'
        )}
      >
        全部
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/articles?category=${cat.id}`}
          className={cn(
            'px-4 py-1.5 text-sm rounded-full border no-underline transition-colors',
            currentCategoryId === cat.id
              ? 'bg-foreground text-background border-foreground'
              : 'text-muted-foreground border-border hover:border-foreground hover:text-foreground'
          )}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  )
}
