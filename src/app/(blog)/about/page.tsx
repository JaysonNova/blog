import type { Metadata } from 'next'
import { FadeIn } from '@/components/common/FadeIn'
import { Container } from '@/components/layout/Container'
import { absoluteUrl } from '@/lib/site-config'

export const metadata: Metadata = {
  title: '关于',
  description: '了解博客作者、内容方向与发布主题。',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: '关于',
    description: '了解博客作者、内容方向与发布主题。',
    url: absoluteUrl('/about'),
  },
}

export default function AboutPage() {
  return (
    <div className="py-4xl">
      <Container>
        <FadeIn>
          <div className="max-w-content space-y-lg">
            <div>
              <h1 className="mb-md text-display font-bold">关于</h1>
              <p className="text-body text-muted-foreground">
                这里会逐步补齐个人经历、长期关注主题、拍摄偏好以及内容发布节奏。
              </p>
            </div>
            <div className="grid gap-md sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-muted/30 p-lg">
                <h2 className="mb-sm text-h3 font-semibold">内容方向</h2>
                <p className="text-small text-muted-foreground">
                  目前以技术文章、摄影记录和视频内容为主，后续会继续扩展专题栏目。
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-muted/30 p-lg">
                <h2 className="mb-sm text-h3 font-semibold">阶段状态</h2>
                <p className="text-small text-muted-foreground">
                  当前进入阶段四，重点补性能、错误边界、SEO 与交互细节。
                </p>
              </div>
            </div>
          </div>
        </FadeIn>
      </Container>
    </div>
  )
}
