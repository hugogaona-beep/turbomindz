import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const drop = await prisma.drop.findFirst({
    where:   { status: { in: ['UPCOMING', 'LIVE'] } },
    orderBy: { releaseDate: 'asc' },
  })
  return NextResponse.json({ drop })
}
