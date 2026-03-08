import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ tokenId: string }> }
) {
  const { tokenId } = await params
  const id = parseInt(tokenId)

  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid tokenId' }, { status: 400 })
  }

  const nft = await prisma.nFT.findUnique({
    where:   { tokenId: id },
    include: {
      traits:   true,
      payloads: {
        where:   { isActive: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!nft) {
    return NextResponse.json({ error: 'NFT not found' }, { status: 404 })
  }

  // Increment view count
  await prisma.nFT.update({
    where: { tokenId: id },
    data:  { viewCount: { increment: 1 } },
  })

  return NextResponse.json({ nft })
}
