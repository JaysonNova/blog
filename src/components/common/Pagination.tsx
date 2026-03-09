import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  page: number
  totalPages: number
  basePath: string
  searchParams?: Record<string, string | undefined>
}

export function Pagination({ page, totalPages, basePath, searchParams = {} }: PaginationProps) {
  if (totalPages <= 1) return null

  const buildUrl = (pageNum: number) => {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(searchParams)) {
      if (value) params.set(key, value)
    }
    if (pageNum > 1) params.set('page', String(pageNum))
    const qs = params.toString()
    return qs ? `${basePath}?${qs}` : basePath
  }

  return (
    <nav className="flex items-center justify-center gap-md py-xl" aria-label="分页导航">
      {page > 1 ? (
        <Link
          href={buildUrl(page - 1)}
          className="inline-flex items-center gap-xs px-4 py-2 text-sm font-medium text-foreground border border-border rounded-md no-underline hover:bg-muted transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          上一页
        </Link>
      ) : (
        <span className="inline-flex items-center gap-xs px-4 py-2 text-sm font-medium text-muted-foreground border border-border rounded-md opacity-50 cursor-not-allowed">
          <ChevronLeft className="h-4 w-4" />
          上一页
        </span>
      )}

      <span className="text-sm text-muted-foreground">
        {page} / {totalPages}
      </span>

      {page < totalPages ? (
        <Link
          href={buildUrl(page + 1)}
          className="inline-flex items-center gap-xs px-4 py-2 text-sm font-medium text-foreground border border-border rounded-md no-underline hover:bg-muted transition-colors"
        >
          下一页
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className="inline-flex items-center gap-xs px-4 py-2 text-sm font-medium text-muted-foreground border border-border rounded-md opacity-50 cursor-not-allowed">
          下一页
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  )
}
