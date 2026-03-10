export type UploadKind = 'image' | 'video'

export interface UploadRule {
  directory: string
  mimeTypes: string[]
  maxSize: number
  fallbackExtension: string
}

export interface PresignedUploadUrl {
  uploadUrl: string
  requiredHeaders?: Record<string, string>
}

export interface DirectUploadTarget extends PresignedUploadUrl {
  key: string
  publicUrl: string
  expiresInSeconds: number
}

export interface CreatePresignedUploadUrlInput {
  key: string
  contentType: string
  expiresInSeconds: number
}

export interface StorageAdapter {
  createPresignedUploadUrl(input: CreatePresignedUploadUrlInput): Promise<PresignedUploadUrl>
  getPublicUrl(key: string): string
  getObjectKeyFromPublicUrl(url: string): string | null
}
