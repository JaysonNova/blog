import { cn } from '@/lib/utils/cn'

interface PostContentProps {
  html: string
  className?: string
}

export function PostContent({ html, className }: PostContentProps) {
  return (
    <article
      className={cn(
        'prose prose-lg dark:prose-invert max-w-none',
        'prose-headings:font-bold prose-headings:tracking-tight',
        'prose-h1:text-h1 prose-h2:text-h2 prose-h3:text-h3',
        'prose-p:text-body prose-p:leading-relaxed',
        'prose-a:text-accent prose-a:no-underline hover:prose-a:underline',
        'prose-code:text-sm prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded',
        'prose-pre:bg-muted prose-pre:border prose-pre:border-border',
        'prose-img:rounded-lg prose-img:shadow-lg',
        'prose-blockquote:border-l-4 prose-blockquote:border-accent prose-blockquote:pl-4 prose-blockquote:italic',
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
