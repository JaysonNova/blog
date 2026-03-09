interface PostListSkeletonProps {
  count?: number
}

export function PostListSkeleton({
  count = 5,
}: PostListSkeletonProps) {
  return (
    <div className="space-y-md">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse border-b border-border py-lg"
        >
          <div className="mb-sm h-8 w-3/5 rounded-full bg-muted" />
          <div className="mb-sm h-5 w-full rounded-full bg-muted" />
          <div className="mb-md h-5 w-4/5 rounded-full bg-muted" />
          <div className="flex gap-md">
            <div className="h-4 w-28 rounded-full bg-muted" />
            <div className="h-4 w-24 rounded-full bg-muted" />
            <div className="h-4 w-16 rounded-full bg-muted" />
          </div>
        </div>
      ))}
    </div>
  )
}
