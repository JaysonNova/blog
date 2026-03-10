'use server'

import { hash, compare } from 'bcryptjs'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { requireOwnerAdminUser } from '@/lib/auth/guard'
import { userDAO } from '@/lib/db/dao/user-dao'

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, '请输入当前密码。'),
    newPassword: z
      .string()
      .min(12, '新密码至少需要 12 个字符。')
      .max(128, '新密码长度不能超过 128 个字符。'),
    confirmPassword: z.string().min(1, '请再次输入新密码。'),
  })
  .superRefine((value, ctx) => {
    if (value.newPassword !== value.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['confirmPassword'],
        message: '两次输入的新密码不一致。',
      })
    }

    if (value.currentPassword === value.newPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['newPassword'],
        message: '新密码不能与当前密码相同。',
      })
    }
  })

function redirectWithError(message: string): never {
  redirect(`/admin/security?error=${encodeURIComponent(message)}`)
}

export async function updateAdminPasswordAction(formData: FormData) {
  const ownerUser = await requireOwnerAdminUser({ callbackUrl: '/admin/security' })

  const parsed = passwordSchema.safeParse({
    currentPassword: formData.get('currentPassword'),
    newPassword: formData.get('newPassword'),
    confirmPassword: formData.get('confirmPassword'),
  })

  if (!parsed.success) {
    redirectWithError(parsed.error.issues[0]?.message || '密码校验失败。')
  }

  const currentUser = await userDAO.findByEmail(ownerUser.email || '')
  if (!currentUser?.password) {
    redirectWithError('未找到当前管理员账号。')
  }

  const currentPasswordMatches = await compare(parsed.data.currentPassword, currentUser.password)
  if (!currentPasswordMatches) {
    redirectWithError('当前密码不正确。')
  }

  const passwordHash = await hash(parsed.data.newPassword, 12)
  await userDAO.update(currentUser.id, {
    password: passwordHash,
  })

  redirect('/admin/security?status=password-updated')
}
