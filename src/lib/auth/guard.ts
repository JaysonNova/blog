import { redirect } from 'next/navigation'
import { auth } from '../../../auth'

interface RequireAdminOptions {
  callbackUrl?: string
}

function getOwnerAdminEmail() {
  const configuredEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  if (configuredEmail) {
    return configuredEmail
  }

  if (process.env.NODE_ENV !== 'production') {
    return 'admin@example.com'
  }

  return null
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

export function isOwnerAdminUser(user: { email?: string | null }) {
  const ownerEmail = getOwnerAdminEmail()
  if (!ownerEmail || !user.email) {
    return false
  }

  return user.email.toLowerCase() === ownerEmail
}

export async function requireOwnerAdminUser(options: RequireAdminOptions = {}) {
  const callbackUrl = options.callbackUrl || '/admin/security'
  const user = await requireAdminUser({ callbackUrl })

  if (!isOwnerAdminUser(user)) {
    redirect('/admin')
  }

  return user
}
