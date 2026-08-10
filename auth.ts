import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { compare } from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import type { Role } from '@prisma/client'

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

const providers = [
  ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? [Google({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET })]
    : []),
  Credentials({
    name: 'credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      const parsed = credentialsSchema.safeParse(credentials)
      if (!parsed.success) return null

      const user = await prisma.user.findUnique({ where: { email: parsed.data.email } })
      if (!user) return null

      const isValid = await compare(parsed.data.password, user.password)
      if (!isValid) return null

      return { id: user.id, name: user.name, email: user.email, role: user.role }
    },
  }),
]

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? ''
        session.user.role = (token.role as Role) ?? 'STUDENT'
      }
      return session
    },
  },
  trustHost: true,
})