import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { verifyNFTOwnership } from '@/lib/alchemy'
import { chatRatelimit } from '@/lib/ratelimit'
import { z } from 'zod'

const postSchema = z.object({
  content:     z.string().min(1).max(2000),
  mediaUrls:   z.array(z.string().url()).optional().default([]),
  parentPostId: z.string().optional(),
})

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  const { roomId } = await params
  const limit = parseInt(new URL(req.url).searchParams.get('limit') || '50')

  const posts = await prisma.discussionPost.findMany({
    where:   { roomId, isDeleted: false, parentPostId: null },
    take:    Math.min(limit, 100),
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { username: true, avatar: true, walletAddress: true, isVerified: true } },
      replies: {
        where:   { isDeleted: false },
        take:    10,
        orderBy: { createdAt: 'asc' },
        include: { author: { select: { username: true, avatar: true, walletAddress: true } } },
      },
    },
  })

  return NextResponse.json({ posts })
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  const { roomId } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user?.walletAddress) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const wallet = session.user.walletAddress

  // Rate limit
  const { success } = await chatRatelimit.limit(wallet)
  if (!success) {
    return NextResponse.json(
      { error: 'Rate limit: 1 message per 2 seconds' },
      { status: 429 }
    )
  }

  // Verify NFT ownership for gated rooms
  const room = await prisma.discussionRoom.findUnique({ where: { id: roomId } })
  if (!room) return NextResponse.json({ error: 'Room not found' }, { status: 404 })

  if (room.isGated) {
    const owns = await verifyNFTOwnership(wallet)
    if (!owns) {
      return NextResponse.json({ error: 'NFT ownership required' }, { status: 403 })
    }
  }

  const body   = await req.json()
  const parsed = postSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const post = await prisma.discussionPost.create({
    data: {
      roomId,
      authorWallet: wallet,
      content:      parsed.data.content,
      mediaUrls:    parsed.data.mediaUrls,
      parentPostId: parsed.data.parentPostId,
    },
    include: {
      author: { select: { username: true, avatar: true, walletAddress: true, isVerified: true } },
    },
  })

  return NextResponse.json({ post }, { status: 201 })
}
