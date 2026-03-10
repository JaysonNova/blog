import Link from 'next/link'
import { isOwnerAdminUser, requireAdminUser } from '@/lib/auth/guard'
import { logoutAction } from '@/lib/auth/actions'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui/button'

export async function AdminShell({ children }: { children: React.ReactNode }) {
  const user = await requireAdminUser()
  const navItems = [
    { href: '/admin', label: '概览' },
    { href: '/admin/posts', label: '文章' },
    { href: '/admin/posts/new', label: '写文章' },
    { href: '/admin/media', label: '媒体上传' },
    ...(isOwnerAdminUser(user) ? [{ href: '/admin/security', label: '安全' }] : []),
  ]

  return (
    <div className="min-h-screen bg-muted/30 py-10">
      <Container>
        <div className="space-y-6">
          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-background px-6 py-6 shadow-sm md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Content Studio
              </p>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">简约博客内容后台</h1>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                  当前版本已接入管理员登录鉴权，可进行 Markdown 写作、封面上传、
                  图片和视频入库。Owner admin 可在安全页修改数据库中的登录密码。
                </p>
              </div>
            </div>
            <div className="flex flex-col items-start gap-3 md:items-end">
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground">{user.name || user.email}</p>
                <p>{user.email}</p>
              </div>
              <div className="flex gap-2">
                <Button asChild variant="outline">
                  <Link href="/">返回站点</Link>
                </Button>
                <form action={logoutAction}>
                  <Button type="submit" variant="outline">
                    退出登录
                  </Button>
                </form>
              </div>
            </div>
          </div>

          <nav className="flex flex-wrap gap-3">
            {navItems.map((item) => (
              <Button key={item.href} asChild variant="outline">
                <Link href={item.href}>{item.label}</Link>
              </Button>
            ))}
          </nav>

          {children}
        </div>
      </Container>
    </div>
  )
}
