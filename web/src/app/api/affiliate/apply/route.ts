import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const applySchema = z.object({
  platform:        z.string().min(2).max(50),
  audienceSize:    z.number().positive(),
  applicationNote: z.string().min(20).max(1000),
  payoutWallet:    z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  payoutEmail:     z.string().email().optional(),
})

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body   = await req.json()
  const parsed = applySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const existing = await prisma.affiliate.findUnique({
    where: { userId: session.user.id }
  })
  if (existing) {
    return NextResponse.json({ error: 'Already applied' }, { status: 409 })
  }

  const affiliate = await prisma.affiliate.create({
    data: {
      userId:          session.user.id,
      referralCode:    session.user.referralCode,
      payoutWallet:    parsed.data.payoutWallet,
      payoutEmail:     parsed.data.payoutEmail,
      platform:        parsed.data.platform,
      audienceSize:    parsed.data.audienceSize,
      applicationNote: parsed.data.applicationNote,
      status:          'PENDING',
    },
  })

  return NextResponse.json({ affiliate, message: 'Application submitted' }, { status: 201 })
}
