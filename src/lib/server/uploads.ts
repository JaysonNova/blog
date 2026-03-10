import 'server-only'

import path from 'path'
import { getStorageAdapter } from '@/lib/server/storage'
import type { DirectUploadTarget, UploadKind, UploadRule } from '@/lib/server/storage/types'
import { slugify } from '@/lib/utils/slug'

const SIGNED_UPLOAD_TTL_SECONDS = 10 * 60

const uploadConfig: Record<UploadKind, UploadRule> = {
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

function resolveExtension(fileName: string, fallbackExtension: string) {
  const parsedExtension = path.extname(fileName).toLowerCase()
  return parsedExtension || fallbackExtension
}

function buildObjectKey(kind: UploadKind, fileName: string) {
  const config = uploadConfig[kind]
  const baseName = slugify(path.parse(fileName).name) || kind
  const extension = resolveExtension(fileName, config.fallbackExtension)
  const objectName = `${Date.now()}-${baseName}${extension}`

  return path.posix.join('uploads', config.directory, objectName)
}

function assertUploadType(kind: UploadKind, contentType: string) {
  if (!uploadConfig[kind].mimeTypes.includes(contentType)) {
    throw new Error(`Unsupported ${kind} type: ${contentType || 'unknown'}`)
  }
}

function assertUploadSize(kind: UploadKind, fileSize: number) {
  if (fileSize > uploadConfig[kind].maxSize) {
    throw new Error(`${kind} file exceeds the size limit.`)
  }
}

function toOptionalString(value: FormDataEntryValue | null | undefined) {
  if (typeof value !== 'string') {
    return undefined
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

function normalizeUploadedUrl(
  url: string,
  options: {
    kind: UploadKind
    fieldName: string
  }
) {
  const storage = getStorageAdapter()
  const objectKey = storage.getObjectKeyFromPublicUrl(url)

  if (!objectKey) {
    throw new Error(`${options.fieldName} must be a valid uploaded asset URL.`)
  }

  const expectedPrefix = `uploads/${uploadConfig[options.kind].directory}/`
  if (!objectKey.startsWith(expectedPrefix)) {
    throw new Error(`${options.fieldName} does not match the expected upload type.`)
  }

  return storage.getPublicUrl(objectKey)
}

export async function createDirectUploadTarget(input: {
  kind: UploadKind
  fileName: string
  contentType: string
  fileSize: number
}): Promise<DirectUploadTarget> {
  assertUploadType(input.kind, input.contentType)
  assertUploadSize(input.kind, input.fileSize)

  const objectKey = buildObjectKey(input.kind, input.fileName)
  const storage = getStorageAdapter()
  const signedUpload = await storage.createPresignedUploadUrl({
    key: objectKey,
    contentType: input.contentType,
    expiresInSeconds: SIGNED_UPLOAD_TTL_SECONDS,
  })

  return {
    key: objectKey,
    publicUrl: storage.getPublicUrl(objectKey),
    expiresInSeconds: SIGNED_UPLOAD_TTL_SECONDS,
    ...signedUpload,
  }
}

export function requireUploadedUrl(
  value: FormDataEntryValue | null | undefined,
  options: {
    kind: UploadKind
    fieldName: string
  }
) {
  const normalized = toOptionalString(value)
  if (!normalized) {
    throw new Error(`${options.fieldName} is required.`)
  }

  return normalizeUploadedUrl(normalized, options)
}

export function getOptionalUploadedUrl(
  value: FormDataEntryValue | null | undefined,
  options: {
    kind: UploadKind
    fieldName: string
  }
) {
  const normalized = toOptionalString(value)
  if (!normalized) {
    return undefined
  }

  return normalizeUploadedUrl(normalized, options)
}
