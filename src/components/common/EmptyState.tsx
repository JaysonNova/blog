import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface EmptyStateProps {
  title: string
  description: string
  actionHref?: string
  actionLabel?: string
  className?: string
}

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-dashed border-border bg-muted/30 px-lg py-3xl text-center',
        className
      )}
    >
      <div className="mx-auto max-w-md space-y-sm">
        <p className="text-h3 font-semibold text-foreground">{title}</p>
        <p className="text-body text-muted-foreground">{description}</p>
        {actionHref && actionLabel ? (
          <Link
            href={actionHref}
            className="inline-flex items-center gap-xs pt-sm text-sm font-medium text-accent no-underline transition-transform hover:translate-x-1"
          >
            {actionLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : null}
      </div>
    </div>
  )
}
