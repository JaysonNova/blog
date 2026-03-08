export interface Photo {
  id: string
  title: string
  description: string | null
  imageUrl: string
  thumbnailUrl: string | null
  width: number | null
  height: number | null
  location: string | null
  takenAt: Date | null
  published: boolean
  viewCount: number
  likeCount: number
  authorId: string
  createdAt: Date
  updatedAt: Date
}

export interface PhotoWithAuthor extends Photo {
  author: {
    id: string
    name: string | null
    avatar: string | null
  }
}

export interface CreatePhotoInput {
  title: string
  description?: string
  imageUrl: string
  thumbnailUrl?: string
  width?: number
  height?: number
  location?: string
  takenAt?: Date
  published?: boolean
}

export type UpdatePhotoInput = Partial<CreatePhotoInput>
