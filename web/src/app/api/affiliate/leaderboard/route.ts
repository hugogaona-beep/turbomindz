import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const affiliates = await prisma.affiliate.findMany({
    where:   { status: 'APPROVED' },
    orderBy: { totalEarnedUsd: 'desc' },
    take:    20,
    include: {
      user: { select: { username: true, avatar: true, walletAddress: true } },
    },
  })

  const leaderboard = affiliates.map((a, i) => ({
    rank:           i + 1,
    username:       a.user.username || `0x${a.user.walletAddress.slice(2, 6)}...`,
    avatar:         a.user.avatar,
    totalReferrals: a.totalReferrals,
    totalEarnedUsd: a.totalEarnedUsd,
    platform:       a.platform,
  }))

  return NextResponse.json({ leaderboard })
}
