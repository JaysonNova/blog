import Link from 'next/link'
import { AdminShell } from '@/components/admin/AdminShell'
import { StatusBanner } from '@/components/admin/StatusBanner'
import { Button } from '@/components/ui/button'
import { postDAO } from '@/lib/db/dao/post-dao'
import { formatDate } from '@/lib/utils/date'

interface PostsAdminPageProps {
  searchParams: Promise<{
    status?: string
  }>
}

const statusCopy: Record<string, string> = {
  created: '文章已创建，前台列表和详情页已触发重新验证。',
}

export default async function PostsAdminPage({
  searchParams,
}: PostsAdminPageProps) {
  const resolvedSearchParams = await searchParams
  const posts = await postDAO.findMany({ limit: 50 })

  return (
    <AdminShell>
      <div className="space-y-6">
        {resolvedSearchParams.status && statusCopy[resolvedSearchParams.status] ? (
          <StatusBanner tone="success">
            {statusCopy[resolvedSearchParams.status]}
          </StatusBanner>
        ) : null}

        <section className="rounded-2xl border border-border bg-background p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold">文章管理</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                当前先支持新建与发布。编辑、删除和筛选可以在下一轮迭代补齐。
              </p>
            </div>
            <Button asChild>
              <Link href="/admin/posts/new">新建文章</Link>
            </Button>
          </div>

          <div className="mt-6 overflow-hidden rounded-xl border border-border">
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 bg-muted/60 px-4 py-3 text-sm font-medium text-muted-foreground">
              <div>标题</div>
              <div>状态</div>
              <div>分类</div>
              <div>创建时间</div>
            </div>

            {posts.items.length > 0 ? (
              posts.items.map((post) => (
                <div
                  key={post.id}
                  className="grid grid-cols-1 gap-3 border-t border-border px-4 py-4 text-sm md:grid-cols-[2fr_1fr_1fr_1fr]"
                >
                  <div>
                    <p className="font-medium text-foreground">{post.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{post.slug}</p>
                  </div>
                  <div className="text-muted-foreground">
                    {post.published ? '已发布' : '草稿'}
                  </div>
                  <div className="text-muted-foreground">
                    {post.category?.name || '未分类'}
                  </div>
                  <div className="text-muted-foreground">{formatDate(post.createdAt)}</div>
                </div>
              ))
            ) : (
              <div className="border-t border-border px-4 py-10 text-sm text-muted-foreground">
                还没有任何文章，先创建第一篇内容。
              </div>
            )}
          </div>
        </section>
      </div>
    </AdminShell>
  )
}
