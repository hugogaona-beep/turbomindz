import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({
  dropId: z.string(),
  email:  z.string().email(),
  wallet: z.string().optional(),
})

export async function POST(req: NextRequest) {
  const body   = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { dropId, email, wallet } = parsed.data

  const drop = await prisma.drop.findUnique({ where: { id: dropId } })
  if (!drop) return NextResponse.json({ error: 'Drop not found' }, { status: 404 })

  await prisma.dropNotification.upsert({
    where:  { dropId_email: { dropId, email } },
    update: { wallet },
    create: { dropId, email, wallet },
  })

  return NextResponse.json({ message: 'Notification registered' })
}
