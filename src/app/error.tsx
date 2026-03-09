'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { AlertTriangle, RefreshCcw } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center py-4xl">
      <Container size="content">
        <div className="rounded-3xl border border-border bg-background px-xl py-3xl text-center shadow-sm">
          <div className="mx-auto mb-lg flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <h1 className="mb-sm text-h1 font-bold">页面出现异常</h1>
          <p className="mb-xl text-body text-muted-foreground">
            请求已到达应用，但渲染过程中失败。可以先重试一次，若仍失败再返回首页。
          </p>
          <div className="flex flex-col items-center justify-center gap-sm sm:flex-row">
            <Button onClick={reset} className="min-w-32">
              <RefreshCcw className="mr-2 h-4 w-4" />
              重新加载
            </Button>
            <Button asChild variant="outline" className="min-w-32">
              <Link href="/">返回首页</Link>
            </Button>
          </div>
        </div>
      </Container>
    </div>
  )
}
