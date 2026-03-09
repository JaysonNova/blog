import 'server-only'

import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import { slugify } from '@/lib/utils/slug'

type UploadKind = 'image' | 'video'

const uploadConfig: Record<
  UploadKind,
  { directory: string; mimeTypes: string[]; maxSize: number; fallbackExtension: string }
> = {
  image: {
    directory: 'images',
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    maxSize: 10 * 1024 * 1024,
    fallbackExtension: '.jpg',
  },
  video: {
    directory: 'videos',
    mimeTypes: ['video/mp4', 'video/webm', 'video/quicktime'],
    maxSize: 250 * 1024 * 1024,
    fallbackExtension: '.mp4',
  },
}

function assertFile(file: FormDataEntryValue | null, fieldName: string): File {
  if (!(file instanceof File) || file.size === 0) {
    throw new Error(`${fieldName} is required.`)
  }

  return file
}

function resolveExtension(file: File, fallbackExtension: string) {
  const parsedExtension = path.extname(file.name).toLowerCase()
  return parsedExtension || fallbackExtension
}

export function getOptionalFile(file: FormDataEntryValue | null) {
  if (file instanceof File && file.size > 0) {
    return file
  }

  return null
}

export async function saveUploadedFile(
  fileEntry: FormDataEntryValue | null,
  options: {
    kind: UploadKind
    fieldName: string
  }
) {
  const file = assertFile(fileEntry, options.fieldName)
  const config = uploadConfig[options.kind]

  if (!config.mimeTypes.includes(file.type)) {
    throw new Error(`Unsupported ${options.kind} type: ${file.type || 'unknown'}`)
  }

  if (file.size > config.maxSize) {
    throw new Error(`${options.fieldName} exceeds the size limit.`)
  }

  const baseName = slugify(path.parse(file.name).name) || options.kind
  const extension = resolveExtension(file, config.fallbackExtension)
  const fileName = `${Date.now()}-${baseName}${extension}`
  const relativePath = path.join('uploads', config.directory, fileName)
  const absolutePath = path.join(process.cwd(), 'public', relativePath)

  await mkdir(path.dirname(absolutePath), { recursive: true })
  await writeFile(absolutePath, Buffer.from(await file.arrayBuffer()))

  return {
    url: `/${relativePath.split(path.sep).join('/')}`,
    fileName,
  }
}
