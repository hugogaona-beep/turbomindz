import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { SiweMessage } from 'siwe'
import prisma from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'siwe',
      name: 'Ethereum',
      credentials: {
        message:   { label: 'Message',   type: 'text' },
        signature: { label: 'Signature', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.message || !credentials?.signature) return null

        try {
          const siwe = new SiweMessage(JSON.parse(credentials.message))
          const result = await siwe.verify({ signature: credentials.signature })

          if (!result.success) return null

          const address = siwe.address.toLowerCase()

          // Upsert user on first sign-in
          const user = await prisma.user.upsert({
            where:  { walletAddress: address },
            update: { lastSeen: new Date() },
            create: {
              walletAddress: address,
              referralCode:  address.slice(2, 10) + Math.random().toString(36).slice(2, 6),
            },
          })

          return {
            id:            user.id,
            walletAddress: user.walletAddress,
            username:      user.username,
            role:          user.role,
            referralCode:  user.referralCode,
          }
        } catch (e) {
          console.error('SIWE auth error:', e)
          return null
        }
      },
    }),
  ],

  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id            = user.id
        token.walletAddress = (user as any).walletAddress
        token.role          = (user as any).role
        token.referralCode  = (user as any).referralCode
      }
      return token
    },
    async session({ session, token }) {
      session.user.id            = token.id as string
      session.user.walletAddress = token.walletAddress as string
      session.user.role          = token.role as string
      session.user.referralCode  = token.referralCode as string
      return session
    },
  },

  pages: {
    signIn:  '/auth/connect-wallet',
    error:   '/auth/connect-wallet',
    signOut: '/',
  },

  secret: process.env.NEXTAUTH_SECRET,
}
