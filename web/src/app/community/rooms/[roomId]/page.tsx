import type { Metadata } from 'next'
import { DiscordChatEmbed } from '@/components/community/DiscordChatEmbed'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'

interface Props { params: Promise<{ roomId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { roomId } = await params
  const room = await prisma.discussionRoom.findUnique({ where: { slug: roomId } })
  return { title: `${room?.name || 'Room'} — TURBOMINDZ Community` }
}

export default async function RoomPage({ params }: Props) {
  const { roomId } = await params
  const room = await prisma.discussionRoom.findUnique({ where: { slug: roomId } })
  if (!room) notFound()

  return (
    <div className="pt-16 h-screen flex flex-col">
      <DiscordChatEmbed room={room} />
    </div>
  )
}
