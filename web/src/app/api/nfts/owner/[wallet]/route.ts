import { NextRequest, NextResponse } from 'next/server'
import { getNFTsForOwner } from '@/lib/alchemy'
import prisma from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ wallet: string }> }
) {
  const { wallet } = await params

  try {
    // Get token IDs from Alchemy (source of truth for ownership)
    const ownedNFTs = await getNFTsForOwner(wallet)
    const tokenIds  = ownedNFTs.map(n => n.tokenId)

    // Enrich with our DB data
    const dbNFTs = await prisma.nFT.findMany({
      where:   { tokenId: { in: tokenIds } },
      include: { traits: true, payloads: { where: { isActive: true } } },
    })

    return NextResponse.json({ nfts: dbNFTs, count: dbNFTs.length })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch NFTs' }, { status: 500 })
  }
}
