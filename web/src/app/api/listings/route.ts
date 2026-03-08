import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { indexListing } from '@/lib/algolia'
import { z } from 'zod'

const createSchema = z.object({
  nftTokenId:   z.number().optional(),
  listingType:  z.enum(['NFT_SALE','SERVICE','BUSINESS_OFFER','COLLABORATION']),
  title:        z.string().min(3).max(120),
  description:  z.string().min(10).max(2000),
  priceUsd:     z.number().positive().optional(),
  priceEth:     z.number().positive().optional(),
  images:       z.array(z.string().url()).optional().default([]),
  tags:         z.array(z.string()).optional().default([]),
  contactEmail: z.string().email().optional(),
  externalUrl:  z.string().url().optional(),
})

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page  = parseInt(searchParams.get('page') || '1')
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50)
  const type  = searchParams.get('type') as any
  const skip  = (page - 1) * limit

  const where: any = { status: 'ACTIVE' }
  if (type) where.listingType = type

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      skip,
      take:    limit,
      orderBy: { createdAt: 'desc' },
      include: { seller: { select: { username: true, avatar: true, isVerified: true } } },
    }),
    prisma.listing.count({ where }),
  ])

  return NextResponse.json({
    listings,
    pagination: { page, limit, total, hasMore: page * limit < total },
  })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.walletAddress) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body   = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const listing = await prisma.listing.create({
    data: {
      ...parsed.data,
      sellerWallet: session.user.walletAddress,
      expiresAt:    new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
    },
  })

  // Index in Algolia
  await indexListing({
    id:           listing.id,
    title:        listing.title,
    description:  listing.description,
    listingType:  listing.listingType,
    priceUsd:     listing.priceUsd ?? undefined,
    priceEth:     listing.priceEth ?? undefined,
    sellerWallet: listing.sellerWallet,
  }).catch(console.error)

  return NextResponse.json({ listing }, { status: 201 })
}
