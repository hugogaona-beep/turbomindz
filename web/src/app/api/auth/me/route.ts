import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.walletAddress) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { walletAddress: session.user.walletAddress },
    select: {
      id:            true,
      walletAddress: true,
      username:      true,
      avatar:        true,
      email:         true,
      discordId:     true,
      role:          true,
      referralCode:  true,
      joinDate:      true,
      isVerified:    true,
    },
  })

  return NextResponse.json({ user })
}
