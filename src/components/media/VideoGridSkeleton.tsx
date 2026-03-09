export function VideoGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-lg md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="animate-pulse space-y-md">
          <div className="aspect-video rounded-2xl bg-muted" />
          <div className="space-y-sm">
            <div className="h-6 w-4/5 rounded-full bg-muted" />
            <div className="h-4 w-full rounded-full bg-muted" />
            <div className="h-4 w-2/3 rounded-full bg-muted" />
            <div className="flex gap-md pt-xs">
              <div className="h-4 w-24 rounded-full bg-muted" />
              <div className="h-4 w-16 rounded-full bg-muted" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
