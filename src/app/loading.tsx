import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { PageSkeleton } from '@/components/common/PageSkeleton'

export default function Loading() {
  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[60] h-1 overflow-hidden bg-transparent">
        <div className="h-full w-1/3 animate-[loading-bar_1.2s_ease-in-out_infinite] rounded-full bg-accent" />
      </div>
      <div className="sr-only">
        <LoadingSpinner />
      </div>
      <PageSkeleton />
    </>
  )
}
