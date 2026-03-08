import { cn } from '@/lib/utils/cn'

interface ContainerProps {
  children: React.ReactNode
  className?: string
  size?: 'default' | 'content'
}

export function Container({ children, className, size = 'default' }: ContainerProps) {
  return (
    <div
      className={cn(
        'container mx-auto px-md',
        size === 'default' && 'max-w-container',
        size === 'content' && 'max-w-content',
        className
      )}
    >
      {children}
    </div>
  )
}
