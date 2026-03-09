export function PhotoGallerySkeleton() {
  return (
    <div className="grid grid-cols-1 gap-lg md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 9 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse overflow-hidden rounded-2xl border border-border bg-muted/20"
        >
          <div
            className={
              index % 3 === 0
                ? 'h-80 bg-muted'
                : index % 3 === 1
                  ? 'h-64 bg-muted'
                  : 'h-96 bg-muted'
            }
          />
          <div className="space-y-sm p-md">
            <div className="h-5 w-1/2 rounded-full bg-muted" />
            <div className="h-4 w-5/6 rounded-full bg-muted" />
            <div className="h-4 w-2/3 rounded-full bg-muted" />
          </div>
        </div>
      ))}
    </div>
  )
}
