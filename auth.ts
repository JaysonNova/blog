import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { z } from 'zod'
import authConfig from './auth.config'
import { userDAO } from '@/lib/db/dao/user-dao'

const credentialsSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials)

        if (!parsed.success) {
          return null
        }

        const user = await userDAO.findByEmail(parsed.data.email)
        if (!user?.password) {
          return null
        }

        const passwordMatches = await compare(parsed.data.password, user.password)
        if (!passwordMatches) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as 'USER' | 'ADMIN',
          avatar: user.avatar,
        }
      },
    }),
  ],
})
