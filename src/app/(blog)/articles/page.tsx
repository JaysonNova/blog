import type { Metadata } from 'next'
import { FadeIn } from '@/components/common/FadeIn'
import { Container } from '@/components/layout/Container'
import { PostList } from '@/components/post/PostList'
import { CategoryFilter } from '@/components/post/CategoryFilter'
import { Pagination } from '@/components/common/Pagination'
import { postDAO } from '@/lib/db/dao/post-dao'
import { categoryDAO } from '@/lib/db/dao/category-dao'
import { absoluteUrl } from '@/lib/site-config'

interface ArticlesPageProps {
  searchParams: Promise<{
    category?: string
    page?: string
  }>
}

export const metadata: Metadata = {
  title: '文章',
  description: '浏览所有已发布文章，支持分类筛选与分页。',
  alternates: {
    canonical: '/articles',
  },
  openGraph: {
    title: '文章',
    description: '浏览所有已发布文章，支持分类筛选与分页。',
    url: absoluteUrl('/articles'),
  },
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const resolvedSearchParams = await searchParams
  const page = parseInt(resolvedSearchParams.page || '1', 10)
  const categoryId = resolvedSearchParams.category

  const [{ items: posts, totalPages }, categories] = await Promise.all([
    postDAO.findMany({
      published: true,
      categoryId,
      page,
      limit: 10,
    }),
    categoryDAO.findAll(),
  ])

  return (
    <div className="py-4xl">
      <Container size="content">
        <FadeIn>
          <div className="mb-xl">
            <h1 className="text-display font-bold">文章</h1>
            <p className="mt-sm text-body text-muted-foreground">
              以分类和分页整理所有公开内容，便于按主题连续阅读。
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.05}>
          <CategoryFilter categories={categories} currentCategoryId={categoryId} />
        </FadeIn>

        <FadeIn delay={0.1}>
          <PostList posts={posts} />
        </FadeIn>

        {totalPages > 1 ? (
          <FadeIn delay={0.14}>
            <Pagination
              page={page}
              totalPages={totalPages}
              basePath="/articles"
              searchParams={{ category: categoryId }}
            />
          </FadeIn>
        ) : null}
      </Container>
    </div>
  )
}
