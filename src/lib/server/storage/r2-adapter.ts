import 'server-only'

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import type {
  CreatePresignedUploadUrlInput,
  PresignedUploadUrl,
  StorageAdapter,
} from '@/lib/server/storage/types'

function readRequiredEnv(name: string): string {
  const value = process.env[name]?.trim()

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

function normalizeBaseUrl(value: string) {
  return value.endsWith('/') ? value.slice(0, -1) : value
}

function encodeObjectKey(key: string) {
  return key
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')
}

export class R2StorageAdapter implements StorageAdapter {
  private readonly bucket = readRequiredEnv('R2_BUCKET')
  private readonly publicBaseUrl = normalizeBaseUrl(readRequiredEnv('R2_PUBLIC_BASE_URL'))
  private readonly publicBaseUrlObject = new URL(this.publicBaseUrl)
  private readonly s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${readRequiredEnv('R2_ACCOUNT_ID')}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: readRequiredEnv('R2_ACCESS_KEY_ID'),
      secretAccessKey: readRequiredEnv('R2_SECRET_ACCESS_KEY'),
    },
  })

  async createPresignedUploadUrl(
    input: CreatePresignedUploadUrlInput
  ): Promise<PresignedUploadUrl> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: input.key,
      ContentType: input.contentType,
    })

    const uploadUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: input.expiresInSeconds,
    })

    return {
      uploadUrl,
      requiredHeaders: {
        'Content-Type': input.contentType,
      },
    }
  }

  getPublicUrl(key: string) {
    return `${this.publicBaseUrl}/${encodeObjectKey(key)}`
  }

  getObjectKeyFromPublicUrl(url: string) {
    try {
      const objectUrl = new URL(url)
      if (objectUrl.origin !== this.publicBaseUrlObject.origin) {
        return null
      }

      const publicPathPrefix = this.publicBaseUrlObject.pathname.endsWith('/')
        ? this.publicBaseUrlObject.pathname
        : `${this.publicBaseUrlObject.pathname}/`

      if (!objectUrl.pathname.startsWith(publicPathPrefix)) {
        return null
      }

      const encodedKey = objectUrl.pathname.slice(publicPathPrefix.length)
      if (!encodedKey) {
        return null
      }

      return decodeURIComponent(encodedKey)
    } catch {
      return null
    }
  }
}
