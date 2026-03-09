import { AdminShell } from '@/components/admin/AdminShell'
import { StatusBanner } from '@/components/admin/StatusBanner'
import { SubmitButton } from '@/components/admin/SubmitButton'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
          <form action={createPhotoAction} className={panelClassName}>
            <div>
              <h2 className="text-xl font-semibold">上传照片</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                适合摄影页和文章封面素材沉淀。当前版本直接保存到 `public/uploads/images/`。
              </p>
            </div>

            <div className="mt-5 grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="photo-title">标题</Label>
                <Input id="photo-title" name="title" placeholder="例如：春日街景" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="photo-description">描述</Label>
                <Textarea id="photo-description" name="description" rows={4} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="photo-image">图片文件</Label>
                <Input
                  id="photo-image"
                  name="image"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  required
                />
              </div>

              <div className="grid gap-2 md:grid-cols-2 md:gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="photo-location">地点</Label>
                  <Input id="photo-location" name="location" placeholder="例如：上海" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="photo-takenAt">拍摄时间</Label>
                  <Input id="photo-takenAt" name="takenAt" type="date" />
                </div>
              </div>

              <label className="inline-flex items-center gap-2 text-sm font-medium">
                <input type="checkbox" name="published" defaultChecked />
                上传后直接发布到摄影页
              </label>

              <SubmitButton pendingLabel="上传中...">保存照片</SubmitButton>
            </div>
          </form>

          <form action={createVideoAction} className={panelClassName}>
            <div>
              <h2 className="text-xl font-semibold">上传视频</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                适合短片和动态记录。当前版本支持本地视频文件和可选缩略图上传。
              </p>
            </div>

            <div className="mt-5 grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="video-title">标题</Label>
                <Input id="video-title" name="title" placeholder="例如：海边延时摄影" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="video-description">描述</Label>
                <Textarea id="video-description" name="description" rows={4} />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="video-file">视频文件</Label>
                <Input
                  id="video-file"
                  name="video"
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  required
                />
              </div>

              <div className="grid gap-2 md:grid-cols-2 md:gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="video-thumbnail">缩略图</Label>
                  <Input
                    id="video-thumbnail"
                    name="thumbnail"
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="video-duration">时长（秒）</Label>
                  <Input id="video-duration" name="duration" type="number" min="1" />
                </div>
              </div>

              <label className="inline-flex items-center gap-2 text-sm font-medium">
                <input type="checkbox" name="published" defaultChecked />
                上传后直接发布到视频页
              </label>

              <SubmitButton pendingLabel="上传中...">保存视频</SubmitButton>
            </div>
          </form>
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
