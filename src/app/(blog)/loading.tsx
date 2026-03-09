import { HeroSkeleton } from '@/components/common/HeroSkeleton'
import { Container } from '@/components/layout/Container'
import { PostListSkeleton } from '@/components/post/PostListSkeleton'

export default function BlogLoading() {
  return (
    <div className="py-3xl">
      <HeroSkeleton />

      <section className="py-2xl">
        <Container>
          <div className="grid grid-cols-1 gap-lg md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-lg border border-border p-xl"
              >
                <div className="mb-md h-10 w-10 rounded-full bg-muted" />
                <div className="mb-sm h-8 w-24 rounded-full bg-muted" />
                <div className="h-4 w-2/3 rounded-full bg-muted" />
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-2xl">
        <Container size="content">
          <div className="mb-xl flex items-center justify-between">
            <div className="h-10 w-32 animate-pulse rounded-full bg-muted" />
            <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
          </div>
          <PostListSkeleton count={4} />
        </Container>
      </section>
    </div>
  )
}
