import { Container } from '@/components/layout/Container'

export function PageSkeleton() {
  return (
    <div className="py-4xl">
      <Container size="content">
        <div className="animate-pulse space-y-xl">
          <div className="space-y-sm">
            <div className="h-4 w-24 rounded-full bg-muted" />
            <div className="h-10 w-2/3 rounded-2xl bg-muted" />
            <div className="h-5 w-full rounded-full bg-muted" />
            <div className="h-5 w-5/6 rounded-full bg-muted" />
          </div>

          <div className="space-y-md">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-border/60 p-lg"
              >
                <div className="mb-md h-7 w-1/2 rounded-full bg-muted" />
                <div className="mb-sm h-4 w-full rounded-full bg-muted" />
                <div className="mb-md h-4 w-4/5 rounded-full bg-muted" />
                <div className="h-4 w-1/3 rounded-full bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  )
}
