import { Container } from '@/components/layout/Container'
import { PostList } from '@/components/post/PostList'
import { CategoryFilter } from '@/components/post/CategoryFilter'
import { Pagination } from '@/components/common/Pagination'
import { postDAO } from '@/lib/db/dao/post-dao'
import { categoryDAO } from '@/lib/db/dao/category-dao'

interface ArticlesPageProps {
  searchParams: {
    category?: string
    page?: string
  }
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const page = parseInt(searchParams.page || '1', 10)
  const categoryId = searchParams.category

  const [{ items: posts, total, totalPages }, categories] = await Promise.all([
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
        <h1 className="text-display font-bold mb-xl">文章</h1>

        <CategoryFilter categories={categories} currentCategoryId={categoryId} />

        <PostList posts={posts} />

        <Pagination
          page={page}
          totalPages={totalPages}
          basePath="/articles"
          searchParams={{ category: categoryId }}
        />
      </Container>
    </div>
  )
}
