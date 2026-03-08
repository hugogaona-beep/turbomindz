import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const querySchema = z.object({
  page:        z.coerce.number().min(1).default(1),
  limit:       z.coerce.number().min(1).max(100).default(24),
  philosopher: z.string().optional(),
  series:      z.coerce.number().optional(),
  artStyle:    z.string().optional(),
  rarity:      z.string().optional(),
  sort:        z.enum(['tokenId', 'rarity', 'viewCount', 'lastSalePrice']).default('tokenId'),
  order:       z.enum(['asc', 'desc']).default('asc'),
})

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const query = querySchema.safeParse(Object.fromEntries(searchParams))

  if (!query.success) {
    return NextResponse.json({ error: 'Invalid query' }, { status: 400 })
  }

  const { page, limit, philosopher, series, artStyle, rarity, sort, order } = query.data
  const skip = (page - 1) * limit

  const where = {
    ...(philosopher && { philosopherName: { contains: philosopher, mode: 'insensitive' as const } }),
    ...(series      && { series }),
    ...(artStyle    && { artStyle: { contains: artStyle, mode: 'insensitive' as const } }),
    ...(rarity      && { rarity }),
  }

  const [nfts, total] = await Promise.all([
    prisma.nFT.findMany({
      where,
      skip,
      take:    limit,
      orderBy: { [sort]: order },
      include: { traits: true },
    }),
    prisma.nFT.count({ where }),
  ])

  return NextResponse.json({
    nfts,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    },
  })
}
