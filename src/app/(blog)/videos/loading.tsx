import { Container } from '@/components/layout/Container'
import { VideoGridSkeleton } from '@/components/media/VideoGridSkeleton'

export default function VideosLoading() {
  return (
    <div className="py-4xl">
      <Container>
        <div className="mb-xl animate-pulse space-y-sm">
          <div className="h-12 w-32 rounded-2xl bg-muted" />
          <div className="h-5 w-72 rounded-full bg-muted" />
        </div>
        <VideoGridSkeleton />
      </Container>
    </div>
  )
}
