import { Container } from '@/components/layout/Container'
import { PostListSkeleton } from '@/components/post/PostListSkeleton'

export default function ArticlesLoading() {
  return (
    <div className="py-4xl">
      <Container size="content">
        <div className="mb-xl animate-pulse space-y-sm">
          <div className="h-12 w-32 rounded-2xl bg-muted" />
          <div className="h-5 w-80 rounded-full bg-muted" />
        </div>

        <div className="mb-xl flex flex-wrap gap-sm">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-9 w-20 animate-pulse rounded-full bg-muted"
            />
          ))}
        </div>

        <PostListSkeleton count={6} />
      </Container>
    </div>
  )
}
