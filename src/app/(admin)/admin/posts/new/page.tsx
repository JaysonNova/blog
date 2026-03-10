import { AdminShell } from '@/components/admin/AdminShell'
import { PostCreateForm } from '@/components/admin/PostCreateForm'
import { StatusBanner } from '@/components/admin/StatusBanner'
import { categoryDAO } from '@/lib/db/dao/category-dao'
import { tagDAO } from '@/lib/db/dao/tag-dao'
import { createPostAction } from '../../actions'

interface NewPostPageProps {
  searchParams: Promise<{
    error?: string
  }>
}

export default async function NewPostPage({ searchParams }: NewPostPageProps) {
  const resolvedSearchParams = await searchParams
  const [categories, tags] = await Promise.all([categoryDAO.findAll(), tagDAO.findAll()])

  return (
    <AdminShell>
      <div className="space-y-6">
        {resolvedSearchParams.error ? (
          <StatusBanner tone="error">{resolvedSearchParams.error}</StatusBanner>
        ) : null}

        <PostCreateForm categories={categories} tags={tags} action={createPostAction} />
      </div>
    </AdminShell>
  )
}
