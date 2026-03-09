import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { auth } from '../../../../auth'
import { loginAction } from './actions'

interface LoginPageProps {
  searchParams: Promise<{
    callbackUrl?: string
    error?: string
  }>
}

function normalizeCallbackUrl(value?: string) {
  if (!value || !value.startsWith('/')) {
    return '/admin'
  }

  return value
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await auth()
  if (session?.user?.role === 'ADMIN') {
    redirect('/admin')
  }

  const resolvedSearchParams = await searchParams
  const callbackUrl = normalizeCallbackUrl(resolvedSearchParams.callbackUrl)

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#f5f5f5,transparent_45%),linear-gradient(180deg,#ffffff,#f8f8f8)] px-4 py-10 dark:bg-[radial-gradient(circle_at_top,#1f1f1f,transparent_35%),linear-gradient(180deg,#0a0a0a,#111111)]">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[28px] border border-border bg-background shadow-[0_30px_80px_rgba(0,0,0,0.08)] lg:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden border-r border-border bg-muted/40 p-10 lg:block">
          <div className="flex h-full flex-col justify-between">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">
                Admin Access
              </p>
              <div className="space-y-3">
                <h1 className="text-4xl font-bold tracking-tight">内容后台登录</h1>
                <p className="max-w-md text-sm leading-6 text-muted-foreground">
                  后台用于文章写作、封面上传、图片和视频入库。当前只开放管理员登录，
                  不提供公开注册。
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-background/90 p-5">
              <p className="text-sm font-medium">开发环境默认账号</p>
              <p className="mt-2 text-sm text-muted-foreground">
                邮箱 `admin@example.com`
                <br />
                密码 `admin123`
              </p>
            </div>
          </div>
        </section>

        <section className="p-6 sm:p-10">
          <div className="mx-auto flex max-w-md flex-col justify-center">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                Sign In
              </p>
              <h2 className="text-3xl font-semibold tracking-tight">管理员登录</h2>
              <p className="text-sm text-muted-foreground">
                登录后将跳转到后台内容管理页。
              </p>
            </div>

            {resolvedSearchParams.error ? (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
                {resolvedSearchParams.error}
              </div>
            ) : null}

            <form action={loginAction} className="mt-8 space-y-5">
              <input type="hidden" name="callbackUrl" value={callbackUrl} />

              <div className="grid gap-2">
                <Label htmlFor="email">邮箱</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@example.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">密码</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="请输入密码"
                  autoComplete="current-password"
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                登录后台
              </Button>
            </form>

            <p className="mt-6 text-sm text-muted-foreground">
              返回前台：
              <Link href="/" className="text-accent no-underline hover:underline">
                继续浏览博客
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
