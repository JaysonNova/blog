import { cn } from '@/lib/utils/cn'

interface StatusBannerProps {
  tone?: 'success' | 'error' | 'info'
  children: React.ReactNode
}

export function StatusBanner({
  tone = 'info',
  children,
}: StatusBannerProps) {
  return (
    <div
      className={cn(
        'rounded-lg border px-4 py-3 text-sm',
        tone === 'success' && 'border-emerald-200 bg-emerald-50 text-emerald-900',
        tone === 'error' && 'border-red-200 bg-red-50 text-red-900',
        tone === 'info' && 'border-border bg-muted/60 text-foreground'
      )}
    >
      {children}
    </div>
  )
}
