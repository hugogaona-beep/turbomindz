import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const affiliate = await prisma.affiliate.findUnique({
    where:   { userId: session.user.id },
    include: {
      referrals: {
        orderBy: { createdAt: 'desc' },
        take:    30,
        include: { referredUser: { select: { username: true, walletAddress: true, joinDate: true } } },
      },
      payouts: { orderBy: { createdAt: 'desc' }, take: 10 },
    },
  })

  if (!affiliate) {
    return NextResponse.json({ error: 'Not an affiliate' }, { status: 404 })
  }

  // 30-day chart data
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const dailyData = await prisma.referral.groupBy({
    by:     ['createdAt'],
    where:  { affiliateId: affiliate.id, createdAt: { gte: thirtyDaysAgo } },
    _count: { id: true },
    _sum:   { commissionUsd: true },
  })

  return NextResponse.json({
    affiliate: {
      id:             affiliate.id,
      referralCode:   affiliate.referralCode,
      commissionRate: affiliate.commissionRate,
      totalReferrals: affiliate.totalReferrals,
      totalEarnedUsd: affiliate.totalEarnedUsd,
      pendingUsd:     affiliate.pendingUsd,
      status:         affiliate.status,
    },
    referrals:  affiliate.referrals,
    payouts:    affiliate.payouts,
    dailyData,
    referralUrl: `${process.env.NEXT_PUBLIC_APP_URL}?ref=${affiliate.referralCode}`,
  })
}
