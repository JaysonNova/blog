import NextAuth from 'next-auth'
import { NextResponse } from 'next/server'
import authConfig from './auth.config'

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { nextUrl, auth: session } = req
  const isAdminRoute = nextUrl.pathname.startsWith('/admin')
  const isLoginRoute = nextUrl.pathname.startsWith('/login')
  const isLoggedIn = Boolean(session?.user)
  const isAdmin = session?.user?.role === 'ADMIN'

  if (isAdminRoute && !isLoggedIn) {
    const callbackUrl = `${nextUrl.pathname}${nextUrl.search}`
    const loginUrl = new URL('/login', nextUrl)
    loginUrl.searchParams.set('callbackUrl', callbackUrl)
    return NextResponse.redirect(loginUrl)
  }

  if (isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL('/', nextUrl))
  }

  if (isLoginRoute && isAdmin) {
    return NextResponse.redirect(new URL('/admin', nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/admin/:path*', '/login'],
}
