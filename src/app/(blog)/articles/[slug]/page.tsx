import type { Metadata } from 'next'
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
import { absoluteUrl, siteConfig } from '@/lib/site-config'
import type { PostWithRelations } from '@/types/post'

interface ArticlePageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const post: PostWithRelations | null = await postDAO.findBySlug(slug)

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
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || post.title,
    datePublished: (post.publishedAt || post.createdAt).toISOString(),
    dateModified: post.updatedAt.toISOString(),
    mainEntityOfPage: absoluteUrl(`/articles/${post.slug}`),
    articleSection: post.category?.name,
    keywords: post.tags.map((tag) => tag.name),
    author: {
      '@type': 'Person',
      name: post.author.name || siteConfig.author.name,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
    },
    ...(post.coverImage
      ? {
          image: [absoluteUrl(post.coverImage)],
        }
      : {}),
  }

  return (
    <div className="py-4xl">
      <Container>
        <div>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
          />
          <div className="max-w-content">
            <Link
              href="/articles"
              className="mb-xl inline-flex items-center gap-xs text-sm text-muted-foreground transition-colors no-underline hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              返回文章列表
            </Link>
          </div>

          <div className="grid grid-cols-1 items-start gap-xl xl:grid-cols-[minmax(0,720px)_240px] xl:justify-between">
            {/* Main Content */}
            <div>
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

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const post: PostWithRelations | null = await postDAO.findBySlug(slug)

  if (!post) {
    return {
      title: '文章未找到',
      description: '请求的文章不存在或已下线。',
    }
  }

  const title = post.title
  const description = post.excerpt || post.title
  const canonicalUrl = absoluteUrl(`/articles/${post.slug}`)
  const image = post.coverImage ? absoluteUrl(post.coverImage) : undefined

  return {
    title,
    description,
    alternates: {
      canonical: `/articles/${post.slug}`,
    },
    authors: [{ name: post.author.name || siteConfig.author.name }],
    keywords: post.tags.map((tag) => tag.name),
    openGraph: {
      type: 'article',
      url: canonicalUrl,
      title,
      description,
      publishedTime: (post.publishedAt || post.createdAt).toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [post.author.name || siteConfig.author.name],
      tags: post.tags.map((tag) => tag.name),
      ...(image ? { images: [{ url: image, alt: title }] } : {}),
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  }
}
