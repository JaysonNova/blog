import { AdminShell } from '@/components/admin/AdminShell'
import { StatusBanner } from '@/components/admin/StatusBanner'
import { SubmitButton } from '@/components/admin/SubmitButton'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { requireOwnerAdminUser } from '@/lib/auth/guard'
import { updateAdminPasswordAction } from './actions'

interface SecurityPageProps {
  searchParams: Promise<{
    error?: string
    status?: string
  }>
}

const panelClassName =
  'rounded-2xl border border-border bg-background px-6 py-6 shadow-sm'

export default async function SecurityPage({ searchParams }: SecurityPageProps) {
  const ownerUser = await requireOwnerAdminUser({ callbackUrl: '/admin/security' })
  const resolvedSearchParams = await searchParams

  return (
    <AdminShell>
      <div className="space-y-6">
        {resolvedSearchParams.error ? (
          <StatusBanner tone="error">{resolvedSearchParams.error}</StatusBanner>
        ) : null}
        {resolvedSearchParams.status === 'password-updated' ? (
          <StatusBanner tone="success">管理员密码已更新，下次登录请使用新密码。</StatusBanner>
        ) : null}

        <section className={panelClassName}>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">安全设置</h2>
            <p className="text-sm text-muted-foreground">
              只有 owner admin 可以访问此页。当前登录账号为 {ownerUser.email}。
            </p>
          </div>

          <div className="mt-4">
            <StatusBanner tone="info">
              此操作会直接更新数据库中的管理员密码，不会修改服务器环境变量文件。
            </StatusBanner>
          </div>

          <form action={updateAdminPasswordAction} className="mt-6 grid gap-5 max-w-xl">
            <div className="grid gap-2">
              <Label htmlFor="currentPassword">当前密码</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                autoComplete="current-password"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="newPassword">新密码</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                minLength={12}
                required
              />
              <p className="text-xs text-muted-foreground">建议使用 12 位以上的强密码。</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">确认新密码</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                minLength={12}
                required
              />
            </div>

            <div className="pt-2">
              <SubmitButton pendingLabel="更新中...">更新管理员密码</SubmitButton>
            </div>
          </form>
        </section>
      </div>
    </AdminShell>
  )
}
