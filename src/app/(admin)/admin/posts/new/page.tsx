import { AdminShell } from '@/components/admin/AdminShell'
import { StatusBanner } from '@/components/admin/StatusBanner'
import { SubmitButton } from '@/components/admin/SubmitButton'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { categoryDAO } from '@/lib/db/dao/category-dao'
import { tagDAO } from '@/lib/db/dao/tag-dao'
import { createPostAction } from '../../actions'

interface NewPostPageProps {
  searchParams: Promise<{
    error?: string
  }>
}

const fieldClassName =
  'rounded-xl border border-border bg-background/60 px-4 py-4 shadow-sm'

export default async function NewPostPage({ searchParams }: NewPostPageProps) {
  const resolvedSearchParams = await searchParams
  const [categories, tags] = await Promise.all([categoryDAO.findAll(), tagDAO.findAll()])

  return (
    <AdminShell>
      <div className="space-y-6">
        {resolvedSearchParams.error ? (
          <StatusBanner tone="error">{resolvedSearchParams.error}</StatusBanner>
        ) : null}

        <form action={createPostAction} className="grid gap-6 lg:grid-cols-[1.8fr_1fr]">
          <section className="space-y-6">
            <div className={fieldClassName}>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">文章正文</h2>
                <p className="text-sm text-muted-foreground">
                  使用 Markdown 书写正文。当前版本优先保证内容可发布，而不是编辑器花哨度。
                </p>
              </div>

              <div className="mt-5 grid gap-5">
                <div className="grid gap-2">
                  <Label htmlFor="title">标题</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="例如：Next.js 16 升级记录"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    name="slug"
                    placeholder="留空则根据标题自动生成，例如 nextjs-16-upgrade"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="excerpt">摘要</Label>
                  <Textarea
                    id="excerpt"
                    name="excerpt"
                    rows={3}
                    placeholder="可选；留空则自动从正文提取前 140 个字符。"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="content">正文 Markdown</Label>
                  <Textarea
                    id="content"
                    name="content"
                    rows={22}
                    placeholder={`# 开始写作\n\n- 支持标题、列表、代码块\n- 发布后会进入文章列表\n\n\`\`\`ts\nconsole.log('hello blog')\n\`\`\``}
                    required
                  />
                </div>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className={fieldClassName}>
              <h2 className="text-xl font-semibold">发布设置</h2>

              <div className="mt-5 grid gap-5">
                <div className="grid gap-2">
                  <Label htmlFor="categoryId">分类</Label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                    defaultValue=""
                  >
                    <option value="">未分类</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="coverImageUrl">封面图 URL</Label>
                  <Input
                    id="coverImageUrl"
                    name="coverImageUrl"
                    placeholder="可选：已有图片地址"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="coverImageUpload">封面图上传</Label>
                  <Input
                    id="coverImageUpload"
                    name="coverImageUpload"
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                  />
                  <p className="text-xs text-muted-foreground">
                    如果同时填写 URL 和上传文件，优先使用上传文件。
                  </p>
                </div>

                <div className="grid gap-3">
                  <Label>标签</Label>
                  {tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <label
                          key={tag.id}
                          className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-sm"
                        >
                          <input type="checkbox" name="tagIds" value={tag.id} />
                          {tag.name}
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">暂无标签，可直接先发文。</p>
                  )}
                </div>

                <label className="inline-flex items-center gap-2 text-sm font-medium">
                  <input type="checkbox" name="published" />
                  创建后直接发布
                </label>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <SubmitButton pendingLabel="发布中...">保存文章</SubmitButton>
              </div>
            </div>

            <div className={fieldClassName}>
              <h2 className="text-xl font-semibold">写作建议</h2>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li>标题尽量明确，Slug 留空会自动生成唯一地址。</li>
                <li>摘要建议控制在 80-140 字，首页和列表页会直接使用。</li>
                <li>封面图支持上传本地文件，后续应迁移到对象存储。</li>
              </ul>
            </div>
          </aside>
        </form>
      </div>
    </AdminShell>
  )
}
