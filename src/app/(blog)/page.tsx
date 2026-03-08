import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { PostCard } from '@/components/post/PostCard'
import { postDAO } from '@/lib/db/dao/post-dao'

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

export default async function HomePage() {
  const { items: latestPosts } = await postDAO.findMany({
    published: true,
    limit: 5,
  })

  return (
    <div className="py-3xl">
      {/* Hero Section */}
      <section className="py-4xl">
        <Container size="content">
          <div className="flex flex-col items-center text-center gap-lg">
            <div className="w-[120px] h-[120px] rounded-full bg-muted flex items-center justify-center">
              <span className="text-4xl font-bold text-muted-foreground">B</span>
            </div>
            <div className="space-y-sm">
              <h1 className="text-display font-bold tracking-tight">
                欢迎来到我的博客
              </h1>
              <p className="text-body text-muted-foreground max-w-[480px] mx-auto">
                分享技术、摄影、生活的点滴
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Content Navigation Cards */}
      <section className="py-2xl">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            {contentCards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group block p-xl rounded-lg border border-border no-underline transition-all duration-300 hover:border-foreground hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex flex-col gap-md">
                  <span className="text-4xl">{card.emoji}</span>
                  <h2 className="text-h2 text-foreground group-hover:text-accent transition-colors">
                    {card.title}
                  </h2>
                  <p className="text-small text-muted-foreground">
                    {card.description}
                  </p>
                  <span className="inline-flex items-center gap-xs text-sm font-medium text-accent">
                    查看更多
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Latest Posts */}
      <section className="py-2xl">
        <Container size="content">
          <div className="flex items-center justify-between mb-xl">
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
            <div className="py-4xl text-center border border-dashed border-border rounded-lg">
              <p className="text-body text-muted-foreground">暂无文章，敬请期待...</p>
            </div>
          )}
        </Container>
      </section>
    </div>
  )
}
