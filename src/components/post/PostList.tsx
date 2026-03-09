import { EmptyState } from '@/components/common/EmptyState'
import { PostCard } from './PostCard'
import type { PostWithRelations } from '@/types/post'

interface PostListProps {
  posts: PostWithRelations[]
}

export function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return (
      <EmptyState
        title="暂无文章"
        description="还没有匹配当前筛选条件的内容，可以稍后再看，或切换其他分类。"
        actionHref="/"
        actionLabel="返回首页"
      />
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
