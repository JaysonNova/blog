'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'

interface SubmitButtonProps {
  children: React.ReactNode
  pendingLabel?: string
  className?: string
}

export function SubmitButton({
  children,
  pendingLabel = '提交中...',
  className,
}: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className={className} disabled={pending}>
      {pending ? pendingLabel : children}
    </Button>
  )
}
