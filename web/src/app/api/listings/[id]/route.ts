import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { deleteListingIndex } from '@/lib/algolia'
import { z } from 'zod'

const updateSchema = z.object({
  title:       z.string().min(3).max(120).optional(),
  description: z.string().min(10).max(2000).optional(),
  priceUsd:    z.number().positive().optional().nullable(),
  priceEth:    z.number().positive().optional().nullable(),
  status:      z.enum(['ACTIVE','SOLD','EXPIRED','CANCELLED']).optional(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session?.user?.walletAddress) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const listing = await prisma.listing.findUnique({ where: { id } })
  if (!listing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (listing.sellerWallet !== session.user.walletAddress)
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body   = await req.json()
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const updated = await prisma.listing.update({ where: { id }, data: parsed.data })
  return NextResponse.json({ listing: updated })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session?.user?.walletAddress) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const listing = await prisma.listing.findUnique({ where: { id } })
  if (!listing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (listing.sellerWallet !== session.user.walletAddress)
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  await prisma.listing.update({ where: { id }, data: { status: 'CANCELLED' } })
  await deleteListingIndex(id).catch(() => {})

  return NextResponse.json({ success: true })
}
