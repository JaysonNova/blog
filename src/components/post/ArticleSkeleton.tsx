import { Container } from '@/components/layout/Container'

export function ArticleSkeleton() {
  return (
    <div className="py-4xl">
      <Container>
        <div className="mx-auto max-w-container animate-pulse">
          <div className="mb-xl h-4 w-28 rounded-full bg-muted" />

          <div className="grid grid-cols-1 gap-xl xl:grid-cols-[1fr_240px]">
            <div className="max-w-content space-y-xl">
              <div className="space-y-md">
                <div className="h-12 w-4/5 rounded-2xl bg-muted" />
                <div className="flex gap-md">
                  <div className="h-4 w-28 rounded-full bg-muted" />
                  <div className="h-4 w-20 rounded-full bg-muted" />
                  <div className="h-4 w-16 rounded-full bg-muted" />
                </div>
              </div>

              <div className="space-y-md">
                <div className="h-6 w-full rounded-full bg-muted" />
                <div className="h-6 w-11/12 rounded-full bg-muted" />
                <div className="h-6 w-4/5 rounded-full bg-muted" />
                <div className="h-56 w-full rounded-3xl bg-muted" />
                <div className="h-6 w-full rounded-full bg-muted" />
                <div className="h-6 w-10/12 rounded-full bg-muted" />
                <div className="h-6 w-3/4 rounded-full bg-muted" />
              </div>

              <div className="flex gap-sm pt-xl">
                <div className="h-8 w-16 rounded-full bg-muted" />
                <div className="h-8 w-20 rounded-full bg-muted" />
                <div className="h-8 w-14 rounded-full bg-muted" />
              </div>
            </div>

            <div className="hidden xl:block">
              <div className="sticky top-[100px] space-y-sm">
                <div className="h-5 w-12 rounded-full bg-muted" />
                <div className="h-4 w-full rounded-full bg-muted" />
                <div className="h-4 w-5/6 rounded-full bg-muted" />
                <div className="h-4 w-2/3 rounded-full bg-muted" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
