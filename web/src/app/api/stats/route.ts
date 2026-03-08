import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCollectionStats } from '@/lib/opensea'

export async function GET() {
  const [dbStats, osStats] = await Promise.allSettled([
    prisma.platformStats.findFirst({ where: { id: 1 } }),
    getCollectionStats(),
  ])

  const db = dbStats.status === 'fulfilled' ? dbStats.value : null
  const os = osStats.status === 'fulfilled' ? osStats.value : null

  return NextResponse.json({
    totalMembers:    db?.totalMembers    || 0,
    totalNFTs:       db?.totalNFTs       || 3000,
    totalListings:   db?.totalListings   || 0,
    totalVolume:     os?.totalVolume     || db?.totalVolume   || 0,
    floorPrice:      os?.floorPrice      || db?.floorPrice    || 0,
    totalDiscussions: db?.totalDiscussions || 0,
  }, { headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=120' } })
}
