import { PostCard } from './PostCard'
import type { PostWithRelations } from '@/types/post'

interface PostListProps {
  posts: PostWithRelations[]
}

export function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="py-4xl text-center">
        <p className="text-body text-muted-foreground">暂无文章</p>
      </div>
    )
  }

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
