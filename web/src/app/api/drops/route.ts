import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const drops = await prisma.drop.findMany({
    orderBy: { releaseDate: 'asc' },
  })
  return NextResponse.json({ drops })
}
