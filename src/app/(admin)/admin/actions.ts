'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { photoDAO } from '@/lib/db/dao/photo-dao'
import { postDAO } from '@/lib/db/dao/post-dao'
import { videoDAO } from '@/lib/db/dao/video-dao'
import { requireAdminUser } from '@/lib/auth/guard'
import { getOptionalUploadedUrl, requireUploadedUrl } from '@/lib/server/uploads'
import { createExcerpt } from '@/lib/utils/content'
import { slugify } from '@/lib/utils/slug'

const postSchema = z.object({
  title: z.string().trim().min(2, '标题至少需要 2 个字符。'),
  slug: z.string().trim().optional(),
  excerpt: z.string().trim().optional(),
  content: z.string().trim().min(20, '正文至少需要 20 个字符。'),
  coverImageUrl: z.string().trim().optional(),
  coverImageUploadUrl: z.string().trim().optional(),
  categoryId: z.string().trim().optional(),
})

const photoSchema = z.object({
  title: z.string().trim().min(1, '照片标题不能为空。'),
  description: z.string().trim().optional(),
  imageUrl: z.string().trim().min(1, '图片上传 URL 不能为空。'),
  location: z.string().trim().optional(),
  takenAt: z.string().trim().optional(),
})

const videoSchema = z.object({
  title: z.string().trim().min(1, '视频标题不能为空。'),
  description: z.string().trim().optional(),
  videoUrl: z.string().trim().min(1, '视频上传 URL 不能为空。'),
  thumbnailUrl: z.string().trim().optional(),
  duration: z.string().trim().optional(),
})

function toBoolean(value: FormDataEntryValue | null) {
  return value === 'on'
}

function toDate(value: string | undefined) {
  if (!value) {
    return undefined
  }

  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? undefined : parsed
}

function toPositiveNumber(value: string | undefined) {
  if (!value) {
    return undefined
  }

  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return undefined
  }

  return parsed
}

async function getUniquePostSlug(input: string) {
  const baseSlug = slugify(input) || 'post'
  let candidate = baseSlug
  let suffix = 2

  while (await postDAO.findBySlug(candidate)) {
    candidate = `${baseSlug}-${suffix}`
    suffix += 1
  }

  return candidate
}

function revalidateContentPaths() {
  revalidatePath('/')
  revalidatePath('/articles')
  revalidatePath('/photography')
  revalidatePath('/videos')
  revalidatePath('/admin')
  revalidatePath('/admin/posts')
  revalidatePath('/admin/media')
}

function redirectWithError(path: string, error: unknown) {
  const message = error instanceof Error ? error.message : '提交失败，请重试。'
  redirect(`${path}?error=${encodeURIComponent(message)}`)
}

export async function createPostAction(formData: FormData) {
  try {
    const parsed = postSchema.parse({
      title: formData.get('title'),
      slug: formData.get('slug'),
      excerpt: formData.get('excerpt'),
      content: formData.get('content'),
      coverImageUrl: formData.get('coverImageUrl'),
      coverImageUploadUrl: formData.get('coverImageUploadUrl'),
      categoryId: formData.get('categoryId'),
    })

    const user = await requireAdminUser({ callbackUrl: '/admin/posts/new' })
    const requestedSlug = parsed.slug || parsed.title
    const slug = await getUniquePostSlug(requestedSlug)
    const uploadedCoverImage = getOptionalUploadedUrl(parsed.coverImageUploadUrl, {
      kind: 'image',
      fieldName: '封面图上传',
    })
    const coverImage = uploadedCoverImage ?? (parsed.coverImageUrl || undefined)

    const tagIds = formData
      .getAll('tagIds')
      .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)

    const published = toBoolean(formData.get('published'))

    const post = await postDAO.create({
      title: parsed.title,
      slug,
      content: parsed.content,
      excerpt: parsed.excerpt || createExcerpt(parsed.content),
      coverImage,
      published,
      publishedAt: published ? new Date() : undefined,
      categoryId: parsed.categoryId || undefined,
      tagIds,
      authorId: user.id,
    })

    revalidateContentPaths()
    revalidatePath(`/articles/${post.slug}`)
  } catch (error) {
    redirectWithError('/admin/posts/new', error)
  }

  redirect('/admin/posts?status=created')
}

export async function createPhotoAction(formData: FormData) {
  try {
    const parsed = photoSchema.parse({
      title: formData.get('title'),
      description: formData.get('description'),
      imageUrl: formData.get('imageUrl'),
      location: formData.get('location'),
      takenAt: formData.get('takenAt'),
    })

    const user = await requireAdminUser({ callbackUrl: '/admin/media' })
    const imageUrl = requireUploadedUrl(parsed.imageUrl, {
      kind: 'image',
      fieldName: '图片文件',
    })

    await photoDAO.create({
      title: parsed.title,
      description: parsed.description,
      imageUrl,
      thumbnailUrl: imageUrl,
      location: parsed.location || undefined,
      takenAt: toDate(parsed.takenAt),
      published: toBoolean(formData.get('published')),
      authorId: user.id,
    })

    revalidateContentPaths()
  } catch (error) {
    redirectWithError('/admin/media', error)
  }

  redirect('/admin/media?status=photo-created')
}

export async function createVideoAction(formData: FormData) {
  try {
    const parsed = videoSchema.parse({
      title: formData.get('title'),
      description: formData.get('description'),
      videoUrl: formData.get('videoUrl'),
      thumbnailUrl: formData.get('thumbnailUrl'),
      duration: formData.get('duration'),
    })

    const user = await requireAdminUser({ callbackUrl: '/admin/media' })
    const videoUrl = requireUploadedUrl(parsed.videoUrl, {
      kind: 'video',
      fieldName: '视频文件',
    })
    const thumbnailUrl = getOptionalUploadedUrl(parsed.thumbnailUrl, {
      kind: 'image',
      fieldName: '缩略图',
    })

    await videoDAO.create({
      title: parsed.title,
      description: parsed.description,
      videoUrl,
      thumbnailUrl,
      duration: toPositiveNumber(parsed.duration),
      published: toBoolean(formData.get('published')),
      authorId: user.id,
    })

    revalidateContentPaths()
  } catch (error) {
    redirectWithError('/admin/media', error)
  }

  redirect('/admin/media?status=video-created')
}
