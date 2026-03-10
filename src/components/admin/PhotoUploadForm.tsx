'use client'

import { type FormEvent, useRef, useState } from 'react'
import { SubmitButton } from '@/components/admin/SubmitButton'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { getUploadErrorMessage, uploadFileWithPresignedUrl } from '@/lib/client/uploads'

interface PhotoUploadFormProps {
  action: (formData: FormData) => void | Promise<void>
  className?: string
}

export function PhotoUploadForm({ action, className }: PhotoUploadFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const allowNativeSubmitRef = useRef(false)
  const imageFileInputRef = useRef<HTMLInputElement>(null)
  const imageUrlRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (allowNativeSubmitRef.current) {
      allowNativeSubmitRef.current = false
      return
    }

    const imageFile = imageFileInputRef.current?.files?.[0]
    if (!imageFile) {
      return
    }

    event.preventDefault()
    setIsUploading(true)
    setUploadError(null)

    try {
      const uploadResult = await uploadFileWithPresignedUrl(imageFile, 'image')
      if (imageUrlRef.current) {
        imageUrlRef.current.value = uploadResult.publicUrl
      }

      allowNativeSubmitRef.current = true
      formRef.current?.requestSubmit()
    } catch (error) {
      setUploadError(getUploadErrorMessage(error))
    } finally {
      setIsUploading(false)
    }
  }

  function handleImageFileChange() {
    if (imageUrlRef.current) {
      imageUrlRef.current.value = ''
    }

    setUploadError(null)
  }

  return (
    <form ref={formRef} action={action} className={className} onSubmit={handleSubmit}>
      <div>
        <h2 className="text-xl font-semibold">上传照片</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          适合摄影页和文章封面素材沉淀。上传时会直传到 Cloudflare R2。
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
            ref={imageFileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            required
            onChange={handleImageFileChange}
          />
          <input ref={imageUrlRef} type="hidden" name="imageUrl" defaultValue="" />
          {isUploading ? <p className="text-xs text-muted-foreground">图片上传到对象存储中，请稍候...</p> : null}
          {uploadError ? <p className="text-xs text-destructive">{uploadError}</p> : null}
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

        <SubmitButton
          pendingLabel="保存中..."
          loading={isUploading}
          loadingLabel="图片上传中..."
          disabled={isUploading}
        >
          保存照片
        </SubmitButton>
      </div>
    </form>
  )
}
