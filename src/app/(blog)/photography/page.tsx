import { Container } from '@/components/layout/Container'
import { PhotoGallery } from '@/components/media/PhotoGallery'
import { Pagination } from '@/components/common/Pagination'
import { photoDAO } from '@/lib/db/dao/photo-dao'

interface PhotographyPageProps {
  searchParams: {
    page?: string
  }
}

export default async function PhotographyPage({ searchParams }: PhotographyPageProps) {
  const page = parseInt(searchParams.page || '1', 10)

  const { items: photos, totalPages } = await photoDAO.findMany({
    published: true,
    page,
    limit: 12,
  })

  return (
    <div className="py-4xl">
      <Container>
        <div className="mb-xl">
          <h1 className="text-display font-bold mb-sm">摄影</h1>
          <p className="text-body text-muted-foreground">用镜头记录世界的美好瞬间</p>
        </div>

        <PhotoGallery photos={photos} />

        <Pagination
          page={page}
          totalPages={totalPages}
          basePath="/photography"
        />
      </Container>
    </div>
  )
}
