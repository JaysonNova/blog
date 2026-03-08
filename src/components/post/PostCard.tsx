import Link from 'next/link'
import { Calendar, Clock } from 'lucide-react'
import { formatDate } from '@/lib/utils/date'
import { getReadingTime, formatReadingTime } from '@/lib/utils/reading-time'
import { cn } from '@/lib/utils/cn'
import type { PostWithRelations } from '@/types/post'

interface PostCardProps {
  post: PostWithRelations
  className?: string
}

export function PostCard({ post, className }: PostCardProps) {
  const readingMinutes = getReadingTime(post.content)

  return (
    <article className={cn('group', className)}>
      <Link
        href={`/articles/${post.slug}`}
        className="block py-lg border-b border-border hover:border-foreground transition-colors no-underline"
      >
        <div className="space-y-sm">
          {/* Title */}
          <h3 className="text-h3 font-semibold text-foreground group-hover:text-accent transition-colors">
            {post.title}
          </h3>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-body text-muted-foreground line-clamp-2">
              {post.excerpt}
            </p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-md text-small text-muted-foreground">
            <span className="flex items-center gap-xs">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(post.createdAt)}
            </span>
            <span className="flex items-center gap-xs">
              <Clock className="h-3.5 w-3.5" />
              {formatReadingTime(readingMinutes)}
            </span>
            {post.category && (
              <span className="px-2 py-0.5 bg-muted rounded-sm text-xs">
                {post.category.name}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  )
}
