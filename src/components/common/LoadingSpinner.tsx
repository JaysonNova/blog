import { cn } from '@/lib/utils/cn'

interface LoadingSpinnerProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-10 w-10 border-[3px]',
} as const

export function LoadingSpinner({
  className,
  size = 'md',
}: LoadingSpinnerProps) {
  return (
    <span
      aria-label="加载中"
      className={cn(
        'inline-block animate-spin rounded-full border-current border-t-transparent text-accent',
        sizeClasses[size],
        className
      )}
    />
  )
}
