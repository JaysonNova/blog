import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { FadeIn } from '@/components/common/FadeIn'
import { EmptyState } from '@/components/common/EmptyState'
import { Container } from '@/components/layout/Container'
import { PostCard } from '@/components/post/PostCard'
import { postDAO } from '@/lib/db/dao/post-dao'
import { absoluteUrl } from '@/lib/site-config'
import type { PostWithRelations } from '@/types/post'

const contentCards = [
  {
    title: '文章',
    description: '技术分享与思考',
    href: '/articles',
    emoji: '📝',
  },
  {
    title: '摄影',
    description: '用镜头记录世界',
    href: '/photography',
    emoji: '📸',
  },
  {
    title: '视频',
    description: '动态的故事',
    href: '/videos',
    emoji: '🎬',
  },
]

export const metadata: Metadata = {
  title: '首页',
  description: '浏览最新文章、摄影作品与视频内容。',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: '首页',
    description: '浏览最新文章、摄影作品与视频内容。',
    url: absoluteUrl('/'),
  },
}

export default async function HomePage() {
  const { items: latestPosts }: { items: PostWithRelations[] } = await postDAO.findMany({
    published: true,
    limit: 5,
  })

  return (
    <div className="py-3xl">
      <FadeIn>
        <section className="py-4xl">
          <Container size="content">
            <div className="flex flex-col items-center gap-lg text-center">
              <div className="flex h-[120px] w-[120px] items-center justify-center rounded-full bg-muted">
                <span className="text-4xl font-bold text-muted-foreground">B</span>
              </div>
              <div className="space-y-sm">
                <h1 className="text-display font-bold tracking-tight">
                  欢迎来到我的博客
                </h1>
                <p className="mx-auto max-w-[480px] text-body text-muted-foreground">
                  分享技术、摄影、生活的点滴
                </p>
              </div>
            </div>
          </Container>
        </section>
      </FadeIn>

      <FadeIn delay={0.06}>
        <section className="py-2xl">
          <Container>
            <div className="grid grid-cols-1 gap-lg md:grid-cols-3">
              {contentCards.map((card) => (
                <Link
                  key={card.href}
                  href={card.href}
                  className="group block rounded-lg border border-border p-xl no-underline transition-all duration-300 hover:-translate-y-1 hover:border-foreground hover:shadow-lg"
                >
                  <div className="flex flex-col gap-md">
                    <span className="text-4xl">{card.emoji}</span>
                    <h2 className="text-h2 text-foreground transition-colors group-hover:text-accent">
                      {card.title}
                    </h2>
                    <p className="text-small text-muted-foreground">
                      {card.description}
                    </p>
                    <span className="inline-flex items-center gap-xs text-sm font-medium text-accent">
                      查看更多
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      </FadeIn>

      <FadeIn delay={0.12}>
        <section className="py-2xl">
          <Container size="content">
            <div className="mb-xl flex items-center justify-between">
              <h2 className="text-h1 font-bold">最新文章</h2>
              <Link
                href="/articles"
                className="text-sm font-medium text-accent no-underline hover:underline"
              >
                查看全部
              </Link>
            </div>

            {latestPosts.length > 0 ? (
              <div>
                {latestPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="还没有发布文章"
                description="文章列表会在发布后自动出现在这里。"
                actionHref="/about"
                actionLabel="先了解我"
              />
            )}
          </Container>
        </section>
      </FadeIn>
    </div>
  )
}
