'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useNFTOwnership } from '@/hooks/useNFTOwnership'
import { useDiscordRoom } from '@/hooks/useDiscordRoom'
import { truncateAddress } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { Send, Lock, ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface Room {
  id:          string
  slug:        string
  name:        string
  description: string | null
  isGated:     boolean
  iconEmoji:   string | null
  category:    string
}

interface Props { room: Room }

export function DiscordChatEmbed({ room }: Props) {
  const { data: session }          = useSession()
  const { isHolder, isLoading: nftLoading } = useNFTOwnership()
  const { messages, isLoading, sendMessage, cooldown, cooldownMs } = useDiscordRoom(room.id)
  const [input, setInput]          = useState('')
  const [sending, setSending]      = useState(false)
  const bottomRef                  = useRef<HTMLDivElement>(null)
  const [cooldownProgress, setCooldownProgress] = useState(0)

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Cooldown progress bar
  useEffect(() => {
    if (!cooldown) { setCooldownProgress(0); return }
    const start = Date.now()
    const id = setInterval(() => {
      const elapsed = Date.now() - start
      const progress = Math.min(100, (elapsed / cooldownMs) * 100)
      setCooldownProgress(progress)
      if (progress >= 100) clearInterval(id)
    }, 50)
    return () => clearInterval(id)
  }, [cooldown, cooldownMs])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || sending) return
    setSending(true)
    const ok = await sendMessage(input.trim())
    if (ok) setInput('')
    setSending(false)
  }

  const canChat = !room.isGated || isHolder
  const isLocked = room.isGated && !isHolder && !nftLoading

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 sm:px-6 py-3 bg-midnight border-b border-border flex-shrink-0">
        <Link href="/community/rooms" className="p-1.5 rounded-lg text-muted hover:text-white hover:bg-void transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <span className="text-xl">{room.iconEmoji || '💬'}</span>
        <div>
          <h1 className="font-body font-semibold text-white text-sm">{room.name}</h1>
          <p className="text-xs text-muted">{room.description}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {room.isGated && (
            <span className="text-xs text-electric/70 flex items-center gap-1">
              <Lock size={10} /> NFT Gated
            </span>
          )}
        </div>
      </div>

      {/* Locked State */}
      {isLocked && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
          <div className="p-4 rounded-full bg-void border border-border">
            <Lock size={28} className="text-muted" />
          </div>
          <h2 className="font-display text-xl font-light text-white">Members Only</h2>
          <p className="text-muted text-sm max-w-sm font-body">
            Own a TURBOMINDZ NFT to access this discussion room and all gated channels.
          </p>
          <Link
            href="/collection/explore"
            className="px-6 py-3 rounded-xl bg-electric text-obsidian font-semibold text-sm hover:bg-electric/90 transition-colors"
          >
            Get Access
          </Link>
        </div>
      )}

      {/* Messages */}
      {!isLocked && (
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4 min-h-0">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 size={24} className="animate-spin text-electric/50" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-16 text-muted font-body text-sm">
              No messages yet. Start the conversation.
            </div>
          ) : (
            messages.map((msg) => {
              const isOwn = msg.authorWallet === session?.user?.walletAddress
              return (
                <div key={msg.id} className={cn('flex gap-3', isOwn && 'flex-row-reverse')}>
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-electric/10 border border-electric/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-electric text-xs font-mono">
                      {msg.authorWallet.slice(2, 4).toUpperCase()}
                    </span>
                  </div>
                  {/* Bubble */}
                  <div className={cn('max-w-[70%]', isOwn && 'items-end flex flex-col')}>
                    <p className={cn('text-xs text-muted mb-1', isOwn && 'text-right')}>
                      {msg.author?.username || truncateAddress(msg.authorWallet)}
                      {msg.author?.isVerified && <span className="ml-1 text-electric">✓</span>}
                    </p>
                    <div className={cn(
                      'px-4 py-2.5 rounded-2xl text-sm leading-relaxed',
                      isOwn
                        ? 'bg-electric text-obsidian rounded-tr-sm'
                        : 'bg-midnight border border-border text-white rounded-tl-sm'
                    )}>
                      {msg.content}
                    </div>
                    <p className="text-xs text-muted/50 mt-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              )
            })
          )}
          <div ref={bottomRef} />
        </div>
      )}

      {/* Input */}
      {!isLocked && canChat && (
        <div className="flex-shrink-0 border-t border-border bg-midnight px-4 sm:px-6 py-3">
          {/* Cooldown bar */}
          {cooldown && (
            <div className="h-0.5 bg-border rounded-full mb-2 overflow-hidden">
              <div
                className="h-full bg-electric transition-all ease-linear"
                style={{ width: `${cooldownProgress}%` }}
              />
            </div>
          )}
          <form onSubmit={handleSend} className="flex gap-3 items-center">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={session ? `Message #${room.name.toLowerCase()}...` : 'Connect wallet to chat'}
              disabled={!session || cooldown}
              maxLength={2000}
              className="flex-1 px-4 py-2.5 rounded-xl bg-void border border-border text-white placeholder:text-muted text-sm focus:outline-none focus:border-electric/50 transition-colors font-body disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || sending || cooldown || !session}
              className="p-2.5 rounded-xl bg-electric text-obsidian hover:bg-electric/90 disabled:opacity-40 transition-colors"
            >
              {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </form>
          {!session && (
            <p className="text-xs text-muted text-center mt-2 font-body">
              <Link href="/auth/connect-wallet" className="text-electric hover:underline">Connect your wallet</Link> to join the conversation.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
