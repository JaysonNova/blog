'use client'

import { type FormEvent, useRef, useState } from 'react'
import { SubmitButton } from '@/components/admin/SubmitButton'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { getUploadErrorMessage, uploadFileWithPresignedUrl } from '@/lib/client/uploads'

interface VideoUploadFormProps {
  action: (formData: FormData) => void | Promise<void>
  className?: string
}

export function VideoUploadForm({ action, className }: VideoUploadFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const allowNativeSubmitRef = useRef(false)
  const videoFileInputRef = useRef<HTMLInputElement>(null)
  const thumbnailFileInputRef = useRef<HTMLInputElement>(null)
  const videoUrlRef = useRef<HTMLInputElement>(null)
  const thumbnailUrlRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (allowNativeSubmitRef.current) {
      allowNativeSubmitRef.current = false
      return
    }

    const videoFile = videoFileInputRef.current?.files?.[0]
    if (!videoFile) {
      return
    }

    event.preventDefault()
    setIsUploading(true)
    setUploadError(null)

    try {
      const thumbnailFile = thumbnailFileInputRef.current?.files?.[0]
      const [videoUpload, thumbnailUpload] = await Promise.all([
        uploadFileWithPresignedUrl(videoFile, 'video'),
        thumbnailFile ? uploadFileWithPresignedUrl(thumbnailFile, 'image') : Promise.resolve(null),
      ])

      if (videoUrlRef.current) {
        videoUrlRef.current.value = videoUpload.publicUrl
      }

      if (thumbnailUrlRef.current) {
        thumbnailUrlRef.current.value = thumbnailUpload?.publicUrl || ''
      }

      allowNativeSubmitRef.current = true
      formRef.current?.requestSubmit()
    } catch (error) {
      setUploadError(getUploadErrorMessage(error))
    } finally {
      setIsUploading(false)
    }
  }

  function handleVideoFileChange() {
    if (videoUrlRef.current) {
      videoUrlRef.current.value = ''
    }

    setUploadError(null)
  }

  function handleThumbnailFileChange() {
    if (thumbnailUrlRef.current) {
      thumbnailUrlRef.current.value = ''
    }

    setUploadError(null)
  }

  return (
    <form ref={formRef} action={action} className={className} onSubmit={handleSubmit}>
      <div>
        <h2 className="text-xl font-semibold">上传视频</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          适合短片和动态记录。视频与缩略图会先直传到 Cloudflare R2。
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
            ref={videoFileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            required
            onChange={handleVideoFileChange}
          />
          <input ref={videoUrlRef} type="hidden" name="videoUrl" defaultValue="" />
        </div>

        <div className="grid gap-2 md:grid-cols-2 md:gap-4">
          <div className="grid gap-2">
            <Label htmlFor="video-thumbnail">缩略图</Label>
            <Input
              id="video-thumbnail"
              ref={thumbnailFileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={handleThumbnailFileChange}
            />
            <input ref={thumbnailUrlRef} type="hidden" name="thumbnailUrl" defaultValue="" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="video-duration">时长（秒）</Label>
            <Input id="video-duration" name="duration" type="number" min="1" />
          </div>
        </div>

        {isUploading ? (
          <p className="text-xs text-muted-foreground">媒体上传到对象存储中，视频较大时可能需要等待。</p>
        ) : null}
        {uploadError ? <p className="text-xs text-destructive">{uploadError}</p> : null}

        <label className="inline-flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" name="published" defaultChecked />
          上传后直接发布到视频页
        </label>

        <SubmitButton
          pendingLabel="保存中..."
          loading={isUploading}
          loadingLabel="视频上传中..."
          disabled={isUploading}
        >
          保存视频
        </SubmitButton>
      </div>
    </form>
  )
}
