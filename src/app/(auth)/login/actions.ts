'use server'

import { AuthError } from 'next-auth'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { signIn } from '../../../../auth'
import { absoluteUrl } from '@/lib/site-config'

const loginSchema = z.object({
  email: z.string().trim().email('请输入正确的邮箱地址。'),
  password: z.string().min(1, '请输入密码。'),
  callbackUrl: z.string().trim().optional(),
})

function normalizeCallbackUrl(value: string | undefined) {
  if (!value || !value.startsWith('/')) {
    return '/admin'
  }

  return value
}

function redirectToLoginError(message: string, callbackUrl: string): never {
  redirect(
    `/login?error=${encodeURIComponent(message)}&callbackUrl=${encodeURIComponent(callbackUrl)}`
  )
}

export async function loginAction(formData: FormData) {
  const rawCallbackUrl = formData.get('callbackUrl')
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    callbackUrl: rawCallbackUrl,
  })

  const callbackUrl = normalizeCallbackUrl(
    typeof rawCallbackUrl === 'string' ? rawCallbackUrl : undefined
  )

  if (!parsed.success) {
    redirectToLoginError(parsed.error.issues[0]?.message || '登录信息无效。', callbackUrl)
  }

  const credentials = parsed.success ? parsed.data : null
  if (!credentials) {
    redirectToLoginError('登录信息无效。', callbackUrl)
  }

  try {
    const response = await signIn('credentials', {
      email: credentials.email,
      password: credentials.password,
      redirect: false,
      redirectTo: callbackUrl,
    })

    if (typeof response === 'string') {
      const url = new URL(response, absoluteUrl('/'))
      if (url.searchParams.get('error')) {
        redirectToLoginError('邮箱或密码错误。', callbackUrl)
      }

      redirect(url.pathname + url.search)
    }

    redirect(callbackUrl)
  } catch (error) {
    if (error instanceof AuthError) {
      redirectToLoginError('登录失败，请稍后重试。', callbackUrl)
    }

    throw error
  }
}
