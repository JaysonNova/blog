import { Container } from '@/components/layout/Container'
import { EmptyState } from '@/components/common/EmptyState'

export default function NotFound() {
  return (
    <div className="py-4xl">
      <Container size="content">
        <EmptyState
          title="页面不存在"
          description="你访问的内容可能已被移动、删除，或者链接地址本身有误。"
          actionHref="/"
          actionLabel="返回首页"
        />
      </Container>
    </div>
  )
}
