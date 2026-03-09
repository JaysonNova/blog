import Link from 'next/link'
import { AdminShell } from '@/components/admin/AdminShell'
import { photoDAO } from '@/lib/db/dao/photo-dao'
import { postDAO } from '@/lib/db/dao/post-dao'
import { videoDAO } from '@/lib/db/dao/video-dao'
import { Button } from '@/components/ui/button'

export default async function AdminDashboardPage() {
  const [
    postSummary,
    publishedPostSummary,
    draftPostSummary,
    photoSummary,
    videoSummary,
    latestPosts,
  ] = await Promise.all([
    postDAO.findMany({ limit: 1 }),
    postDAO.findMany({ published: true, limit: 1 }),
    postDAO.findMany({ published: false, limit: 1 }),
    photoDAO.findMany({ limit: 1 }),
    videoDAO.findMany({ limit: 1 }),
    postDAO.findMany({ limit: 5 }),
  ])

  const cards = [
    { label: '文章总数', value: postSummary.total, hint: `${publishedPostSummary.total} 已发布` },
    { label: '草稿数', value: draftPostSummary.total, hint: '可继续编辑后发布' },
    { label: '摄影条目', value: photoSummary.total, hint: '来自媒体上传页' },
    { label: '视频条目', value: videoSummary.total, hint: '支持本地视频文件' },
  ]

  return (
    <AdminShell>
      <div className="grid gap-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-border bg-background px-5 py-5 shadow-sm"
            >
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <p className="mt-3 text-4xl font-semibold tracking-tight">{card.value}</p>
              <p className="mt-2 text-sm text-muted-foreground">{card.hint}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">最近文章</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  先完成文章产出，再逐步补编辑、回收站和权限控制。
                </p>
              </div>
              <Button asChild>
                <Link href="/admin/posts/new">开始写作</Link>
              </Button>
            </div>

            <div className="mt-6 space-y-3">
              {latestPosts.items.length > 0 ? (
                latestPosts.items.map((post) => (
                  <div
                    key={post.id}
                    className="flex flex-col gap-3 rounded-xl border border-border px-4 py-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <p className="font-medium">{post.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {post.published ? '已发布' : '草稿'}
                        {' · '}
                        {post.slug}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button asChild variant="outline">
                        <Link href="/admin/posts">查看列表</Link>
                      </Button>
                      {post.published ? (
                        <Button asChild variant="outline">
                          <Link href={`/articles/${post.slug}`}>查看前台</Link>
                        </Button>
                      ) : null}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-border px-4 py-8 text-sm text-muted-foreground">
                  还没有文章。建议先创建 1 篇文章，验证写作、封面和发布链路。
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-background p-6 shadow-sm">
            <h2 className="text-xl font-semibold">当前缺口</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>文章编辑仍是新建版，后续要补编辑、删除和草稿恢复。</li>
              <li>目前只有管理员角色，后续可扩展 editor / reviewer。</li>
              <li>上传文件直接落到 `public/uploads/`，正式环境需切对象存储。</li>
            </ul>
          </div>
        </section>
      </div>
    </AdminShell>
  )
}
