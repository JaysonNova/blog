import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Clock, ArrowLeft, Tag } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { PostContent } from '@/components/post/PostContent'
import { TableOfContents } from '@/components/post/TableOfContents'
import { postDAO } from '@/lib/db/dao/post-dao'
import { markdownToHtml, extractHeadings } from '@/lib/markdown/processor'
import { formatDate } from '@/lib/utils/date'
import { getReadingTime, formatReadingTime } from '@/lib/utils/reading-time'

interface ArticlePageProps {
  params: {
    slug: string
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const post = await postDAO.findBySlug(params.slug)

  if (!post || !post.published) {
    notFound()
  }

  // Increment view count (fire and forget)
  postDAO.incrementViewCount(post.id).catch(() => {})

  const [html, headings] = await Promise.all([
    markdownToHtml(post.content),
    Promise.resolve(extractHeadings(post.content)),
  ])

  const readingMinutes = getReadingTime(post.content)

  return (
    <div className="py-4xl">
      <Container>
        <div className="max-w-container mx-auto">
          {/* Back Link */}
          <Link
            href="/articles"
            className="inline-flex items-center gap-xs text-sm text-muted-foreground hover:text-foreground transition-colors mb-xl no-underline"
          >
            <ArrowLeft className="h-4 w-4" />
            返回文章列表
          </Link>

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_240px] gap-xl">
            {/* Main Content */}
            <div className="max-w-content">
              {/* Article Header */}
              <header className="mb-xl">
                <h1 className="text-display font-bold mb-md tracking-tight">
                  {post.title}
                </h1>

                <div className="flex flex-wrap items-center gap-md text-small text-muted-foreground">
                  <span className="flex items-center gap-xs">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(post.createdAt)}
                  </span>
                  <span className="flex items-center gap-xs">
                    <Clock className="h-3.5 w-3.5" />
                    {formatReadingTime(readingMinutes)}
                  </span>
                  {post.category && (
                    <Link
                      href={`/articles?category=${post.category.id}`}
                      className="px-2 py-0.5 bg-muted rounded-sm text-xs hover:bg-muted/80 transition-colors no-underline"
                    >
                      {post.category.name}
                    </Link>
                  )}
                </div>
              </header>

              {/* Article Content */}
              <PostContent html={html} className="mb-xl" />

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-sm pt-xl border-t border-border">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  {post.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-3 py-1 bg-muted text-sm rounded-full"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Comments Placeholder */}
              <div className="mt-4xl pt-xl border-t border-border">
                <h2 className="text-h2 font-bold mb-lg">评论</h2>
                <div className="py-xl text-center border border-dashed border-border rounded-lg">
                  <p className="text-body text-muted-foreground">
                    评论功能开发中...
                  </p>
                </div>
              </div>
            </div>

            {/* Table of Contents */}
            <TableOfContents headings={headings} />
          </div>
        </div>
      </Container>
    </div>
  )
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const post = await postDAO.findBySlug(params.slug)

  if (!post) {
    return {
      title: '文章未找到',
    }
  }

  return {
    title: post.title,
    description: post.excerpt || post.title,
  }
}
