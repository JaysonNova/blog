import type { NextAuthConfig } from 'next-auth'

const authConfig = {
  trustHost: true,
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.avatar = user.avatar
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as 'USER' | 'ADMIN'
        session.user.avatar = (token.avatar as string | null | undefined) ?? null
      }

      return session
    },
  },
  providers: [],
} satisfies NextAuthConfig

export default authConfig
