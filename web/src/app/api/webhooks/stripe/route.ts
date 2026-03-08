import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import prisma from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-12-18.acacia' })

export async function POST(req: NextRequest) {
  const body      = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return NextResponse.json({ error: 'Webhook signature failed' }, { status: 400 })
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const pi = event.data.object as Stripe.PaymentIntent
      const { referralCode, userId } = pi.metadata

      if (referralCode) {
        // Credit affiliate commission (10%)
        const affiliate = await prisma.affiliate.findUnique({
          where: { referralCode }
        })
        if (affiliate && affiliate.status === 'APPROVED') {
          const commission = (pi.amount / 100) * affiliate.commissionRate
          await prisma.affiliate.update({
            where: { id: affiliate.id },
            data: {
              totalReferrals:  { increment: 1 },
              totalEarnedUsd:  { increment: commission },
              pendingUsd:      { increment: commission },
            },
          })
          await prisma.referral.create({
            data: {
              affiliateId:    affiliate.id,
              referredUserId: userId,
              purchaseAmount: pi.amount / 100,
              commissionUsd:  commission,
            },
          })
        }
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
