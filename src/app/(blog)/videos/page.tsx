import { Container } from '@/components/layout/Container'
import { VideoGrid } from '@/components/media/VideoGrid'
import { Pagination } from '@/components/common/Pagination'
import { videoDAO } from '@/lib/db/dao/video-dao'

interface VideosPageProps {
  searchParams: {
    page?: string
  }
}

export default async function VideosPage({ searchParams }: VideosPageProps) {
  const page = parseInt(searchParams.page || '1', 10)

  const { items: videos, totalPages } = await videoDAO.findMany({
    published: true,
    page,
    limit: 12,
  })

  return (
    <div className="py-4xl">
      <Container>
        <div className="mb-xl">
          <h1 className="text-display font-bold mb-sm">视频</h1>
          <p className="text-body text-muted-foreground">动态的故事，生动的记录</p>
        </div>

        <VideoGrid videos={videos} />

        <Pagination
          page={page}
          totalPages={totalPages}
          basePath="/videos"
        />
      </Container>
    </div>
  )
}
