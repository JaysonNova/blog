export interface Comment {
  id: string
  content: string
  authorId: string
  postId: string
  parentId: string | null
  createdAt: Date
  updatedAt: Date
}

export interface CommentWithAuthor extends Comment {
  author: {
    id: string
    name: string | null
    avatar: string | null
  }
  replies?: CommentWithAuthor[]
}

export interface CreateCommentInput {
  content: string
  postId: string
  parentId?: string
}
