import type { Metadata } from 'next'
import { FadeIn } from '@/components/common/FadeIn'
import { Container } from '@/components/layout/Container'
import { VideoGrid } from '@/components/media/VideoGrid'
import { Pagination } from '@/components/common/Pagination'
import { videoDAO } from '@/lib/db/dao/video-dao'
import { absoluteUrl } from '@/lib/site-config'

interface VideosPageProps {
  searchParams: Promise<{
    page?: string
  }>
}

export const metadata: Metadata = {
  title: '视频',
  description: '集中展示公开视频内容与动态记录。',
  alternates: {
    canonical: '/videos',
  },
  openGraph: {
    title: '视频',
    description: '集中展示公开视频内容与动态记录。',
    url: absoluteUrl('/videos'),
  },
}

export default async function VideosPage({ searchParams }: VideosPageProps) {
  const resolvedSearchParams = await searchParams
  const page = parseInt(resolvedSearchParams.page || '1', 10)

  const { items: videos, totalPages } = await videoDAO.findMany({
    published: true,
    page,
    limit: 12,
  })

  return (
    <div className="py-4xl">
      <Container>
        <FadeIn>
          <div className="mb-xl">
            <h1 className="mb-sm text-display font-bold">视频</h1>
            <p className="text-body text-muted-foreground">
              动态的故事，生动的记录
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.06}>
          <VideoGrid videos={videos} />
        </FadeIn>

        {totalPages > 1 ? (
          <FadeIn delay={0.1}>
            <Pagination
              page={page}
              totalPages={totalPages}
              basePath="/videos"
            />
          </FadeIn>
        ) : null}
      </Container>
    </div>
  )
}
