import type { Metadata } from 'next'
import { FadeIn } from '@/components/common/FadeIn'
import { Container } from '@/components/layout/Container'
import { PhotoGallery } from '@/components/media/PhotoGallery'
import { Pagination } from '@/components/common/Pagination'
import { photoDAO } from '@/lib/db/dao/photo-dao'
import { absoluteUrl } from '@/lib/site-config'

interface PhotographyPageProps {
  searchParams: Promise<{
    page?: string
  }>
}

export const metadata: Metadata = {
  title: '摄影',
  description: '以瀑布流形式展示摄影作品与拍摄记录。',
  alternates: {
    canonical: '/photography',
  },
  openGraph: {
    title: '摄影',
    description: '以瀑布流形式展示摄影作品与拍摄记录。',
    url: absoluteUrl('/photography'),
  },
}

export default async function PhotographyPage({ searchParams }: PhotographyPageProps) {
  const resolvedSearchParams = await searchParams
  const page = parseInt(resolvedSearchParams.page || '1', 10)

  const { items: photos, totalPages } = await photoDAO.findMany({
    published: true,
    page,
    limit: 12,
  })

  return (
    <div className="py-4xl">
      <Container>
        <FadeIn>
          <div className="mb-xl">
            <h1 className="mb-sm text-display font-bold">摄影</h1>
            <p className="text-body text-muted-foreground">
              用镜头记录世界的美好瞬间
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.06}>
          <PhotoGallery photos={photos} />
        </FadeIn>

        {totalPages > 1 ? (
          <FadeIn delay={0.1}>
            <Pagination
              page={page}
              totalPages={totalPages}
              basePath="/photography"
            />
          </FadeIn>
        ) : null}
      </Container>
    </div>
  )
}
