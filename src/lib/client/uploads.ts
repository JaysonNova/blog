import type { ApiResponse } from '@/types/api'
import type { DirectUploadTarget, UploadKind } from '@/lib/server/storage/types'

function toErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  return '上传失败，请重试。'
}

async function parseJsonResponse(response: Response) {
  try {
    return (await response.json()) as ApiResponse<DirectUploadTarget>
  } catch {
    return {
      success: false,
      error: 'Invalid JSON response.',
    } satisfies ApiResponse<DirectUploadTarget>
  }
}

export async function uploadFileWithPresignedUrl(file: File, kind: UploadKind) {
  if (!file.type) {
    throw new Error('无法识别文件类型，请重新选择文件。')
  }

  const presignResponse = await fetch('/api/uploads/presign', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      kind,
      fileName: file.name,
      contentType: file.type,
      fileSize: file.size,
    }),
  })

  const presignData = await parseJsonResponse(presignResponse)
  if (!presignResponse.ok || !presignData.success || !presignData.data) {
    throw new Error(presignData.error || '无法获取上传凭证。')
  }

  const uploadHeaders = {
    ...(presignData.data.requiredHeaders || {}),
  }

  if (!uploadHeaders['Content-Type']) {
    uploadHeaders['Content-Type'] = file.type
  }

  const uploadResponse = await fetch(presignData.data.uploadUrl, {
    method: 'PUT',
    headers: uploadHeaders,
    body: file,
  })

  if (!uploadResponse.ok) {
    throw new Error(`上传失败（HTTP ${uploadResponse.status}）。`)
  }

  return {
    key: presignData.data.key,
    publicUrl: presignData.data.publicUrl,
  }
}

export function getUploadErrorMessage(error: unknown) {
  return toErrorMessage(error)
}
