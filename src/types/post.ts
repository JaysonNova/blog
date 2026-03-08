export interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  coverImage: string | null
  published: boolean
  viewCount: number
  likeCount: number
  authorId: string
  categoryId: string | null
  createdAt: Date
  updatedAt: Date
  publishedAt: Date | null
}

export interface PostWithRelations extends Post {
  author: {
    id: string
    name: string | null
    avatar: string | null
  }
  category: {
    id: string
    name: string
    slug: string
  } | null
  tags: Array<{
    id: string
    name: string
    slug: string
  }>
  _count?: {
    comments: number
  }
}

export interface CreatePostInput {
  title: string
  content: string
  excerpt?: string
  coverImage?: string
  published?: boolean
  categoryId?: string
  tagIds?: string[]
}

export interface UpdatePostInput extends Partial<CreatePostInput> {
  slug?: string
}
