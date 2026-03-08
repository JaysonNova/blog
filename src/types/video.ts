export interface Video {
  id: string
  title: string
  description: string | null
  videoUrl: string
  thumbnailUrl: string | null
  duration: number | null
  published: boolean
  viewCount: number
  likeCount: number
  authorId: string
  createdAt: Date
  updatedAt: Date
}

export interface VideoWithAuthor extends Video {
  author: {
    id: string
    name: string | null
    avatar: string | null
  }
}

export interface CreateVideoInput {
  title: string
  description?: string
  videoUrl: string
  thumbnailUrl?: string
  duration?: number
  published?: boolean
}

export type UpdateVideoInput = Partial<CreateVideoInput>
