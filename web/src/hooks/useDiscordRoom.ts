'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

export interface ChatMessage {
  id:           string
  content:      string
  authorWallet: string
  createdAt:    string
  author: {
    username:    string | null
    avatar:      string | null
    walletAddress: string
    isVerified:  boolean
  }
}

const COOLDOWN_MS = 2000

export function useDiscordRoom(roomId: string) {
  const { data: session }     = useSession()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [cooldown, setCooldown]   = useState(false)
  const cooldownRef = useRef<NodeJS.Timeout | null>(null)

  // Load initial messages
  useEffect(() => {
    if (!roomId) return
    setIsLoading(true)

    fetch(`/api/rooms/${roomId}/messages?limit=50`)
      .then(r => r.json())
      .then(d => {
        setMessages((d.posts || []).reverse())
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [roomId])

  // Supabase Realtime subscription
  useEffect(() => {
    if (!roomId) return

    const channel = supabase
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes',
        {
          event:  'INSERT',
          schema: 'public',
          table:  'discussion_posts',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const newPost = payload.new as any
          setMessages(prev => [...prev, newPost])
        }
      )
      .subscribe()

    // 5s polling fallback
    const pollInterval = setInterval(() => {
      fetch(`/api/rooms/${roomId}/messages?limit=10`)
        .then(r => r.json())
        .then(d => {
          const recent = (d.posts || []).reverse()
          setMessages(prev => {
            const existingIds = new Set(prev.map(m => m.id))
            const newOnes = recent.filter((m: ChatMessage) => !existingIds.has(m.id))
            return newOnes.length > 0 ? [...prev, ...newOnes] : prev
          })
        })
    }, 5000)

    return () => {
      supabase.removeChannel(channel)
      clearInterval(pollInterval)
    }
  }, [roomId])

  const sendMessage = useCallback(async (content: string) => {
    if (!session?.user?.walletAddress) {
      toast.error('Connect your wallet to chat.')
      return false
    }
    if (cooldown) {
      toast.error('Wait a moment before sending another message.')
      return false
    }

    try {
      const res = await fetch(`/api/rooms/${roomId}/messages`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ content }),
      })

      if (res.status === 403) {
        toast.error('NFT ownership required to chat.')
        return false
      }
      if (res.status === 429) {
        toast.error('Too fast — 1 message per 2 seconds.')
        return false
      }
      if (!res.ok) return false

      // Start cooldown
      setCooldown(true)
      cooldownRef.current = setTimeout(() => setCooldown(false), COOLDOWN_MS)
      return true
    } catch {
      return false
    }
  }, [roomId, session, cooldown])

  return { messages, isLoading, sendMessage, cooldown, cooldownMs: COOLDOWN_MS }
}
