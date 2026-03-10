import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '../../../../../auth'
import { createDirectUploadTarget } from '@/lib/server/uploads'

const presignPayloadSchema = z.object({
  kind: z.enum(['image', 'video']),
  fileName: z.string().trim().min(1, 'fileName is required.'),
  contentType: z.string().trim().min(1, 'contentType is required.'),
  fileSize: z.number().int().positive('fileSize must be greater than 0.'),
})

function toErrorMessage(error: unknown) {
  if (error instanceof z.ZodError) {
    return error.issues[0]?.message || 'Invalid upload payload.'
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Failed to create upload target.'
}

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json(
      {
        success: false,
        error: 'Unauthorized.',
      },
      { status: 401 }
    )
  }

  try {
    const parsedPayload = presignPayloadSchema.parse(await request.json())
    const data = await createDirectUploadTarget(parsedPayload)

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error) {
    const message = toErrorMessage(error)
    const status = error instanceof z.ZodError ? 400 : 500

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status }
    )
  }
}
