'use client'

import { useFormStatus } from 'react-dom'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { Button } from '@/components/ui/button'

interface SubmitButtonProps {
  children: React.ReactNode
  pendingLabel?: string
  loading?: boolean
  loadingLabel?: string
  className?: string
  disabled?: boolean
}

export function SubmitButton({
  children,
  pendingLabel = '提交中...',
  loading = false,
  loadingLabel,
  className,
  disabled = false,
}: SubmitButtonProps) {
  const { pending } = useFormStatus()
  const isBusy = pending || loading
  const label = pending ? pendingLabel : loading ? (loadingLabel ?? pendingLabel) : children

  return (
    <Button type="submit" className={className} disabled={isBusy || disabled}>
      {isBusy ? (
        <>
          <LoadingSpinner size="sm" className="mr-2" />
          <span>{label}</span>
        </>
      ) : (
        children
      )}
    </Button>
  )
}
