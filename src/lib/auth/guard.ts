import { redirect } from 'next/navigation'
import { auth } from '../../../auth'

interface RequireAdminOptions {
  callbackUrl?: string
}

export async function getCurrentUser() {
  const session = await auth()
  return session?.user ?? null
}

export async function requireAdminUser(options: RequireAdminOptions = {}) {
  const callbackUrl = options.callbackUrl || '/admin'
  const session = await auth()

  if (!session?.user) {
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`)
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/')
  }

  return session.user
}
