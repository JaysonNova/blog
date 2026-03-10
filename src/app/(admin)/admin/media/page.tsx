import { AdminShell } from '@/components/admin/AdminShell'
import { PhotoUploadForm } from '@/components/admin/PhotoUploadForm'
import { StatusBanner } from '@/components/admin/StatusBanner'
import { VideoUploadForm } from '@/components/admin/VideoUploadForm'
import { photoDAO } from '@/lib/db/dao/photo-dao'
import { videoDAO } from '@/lib/db/dao/video-dao'
import { formatDate } from '@/lib/utils/date'
import { createPhotoAction, createVideoAction } from '../actions'

interface MediaAdminPageProps {
  searchParams: Promise<{
    error?: string
    status?: string
  }>
}

const statusCopy: Record<string, string> = {
  'photo-created': '照片已上传并入库，摄影页会在重新验证后展示。',
  'video-created': '视频已上传并入库，视频页会在重新验证后展示。',
}

const panelClassName =
  'rounded-2xl border border-border bg-background px-6 py-6 shadow-sm'

export default async function MediaAdminPage({
  searchParams,
}: MediaAdminPageProps) {
  const resolvedSearchParams = await searchParams
  const [photos, videos] = await Promise.all([
    photoDAO.findMany({ limit: 6 }),
    videoDAO.findMany({ limit: 6 }),
  ])

  return (
    <AdminShell>
      <div className="space-y-6">
        {resolvedSearchParams.error ? (
          <StatusBanner tone="error">{resolvedSearchParams.error}</StatusBanner>
        ) : null}
        {resolvedSearchParams.status && statusCopy[resolvedSearchParams.status] ? (
          <StatusBanner tone="success">
            {statusCopy[resolvedSearchParams.status]}
          </StatusBanner>
        ) : null}

        <section className="grid gap-6 xl:grid-cols-2">
          <PhotoUploadForm action={createPhotoAction} className={panelClassName} />
          <VideoUploadForm action={createVideoAction} className={panelClassName} />
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <div className={panelClassName}>
            <h2 className="text-xl font-semibold">最近照片</h2>
            <div className="mt-5 space-y-3">
              {photos.items.length > 0 ? (
                photos.items.map((photo) => (
                  <div
                    key={photo.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border px-4 py-3"
                  >
                    <div>
                      <p className="font-medium">{photo.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {photo.published ? '已发布' : '未发布'}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(photo.createdAt)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">还没有照片素材。</p>
              )}
            </div>
          </div>

          <div className={panelClassName}>
            <h2 className="text-xl font-semibold">最近视频</h2>
            <div className="mt-5 space-y-3">
              {videos.items.length > 0 ? (
                videos.items.map((video) => (
                  <div
                    key={video.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border px-4 py-3"
                  >
                    <div>
                      <p className="font-medium">{video.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {video.published ? '已发布' : '未发布'}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(video.createdAt)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">还没有视频素材。</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </AdminShell>
  )
}
