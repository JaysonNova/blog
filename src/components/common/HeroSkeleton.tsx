import { Container } from '@/components/layout/Container'

export function HeroSkeleton() {
  return (
    <div className="py-3xl">
      <Container size="content">
        <div className="animate-pulse space-y-2xl py-4xl text-center">
          <div className="mx-auto h-[120px] w-[120px] rounded-full bg-muted" />
          <div className="space-y-sm">
            <div className="mx-auto h-12 w-2/3 rounded-2xl bg-muted" />
            <div className="mx-auto h-5 w-1/2 rounded-full bg-muted" />
          </div>
        </div>
      </Container>
    </div>
  )
}
