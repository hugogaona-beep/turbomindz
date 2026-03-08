'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Lock, Unlock, MessageSquare, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

// Static room definitions (sourced from Discord channels in production)
const ROOMS = [
  {
    id:          'stoicism',
    slug:        'stoicism',
    name:        'Stoicism',
    description: 'Marcus Aurelius, Epictetus, and the art of the controlled mind.',
    category:    'PHILOSOPHY',
    iconEmoji:   '⚖️',
    memberCount: 247,
    isGated:     true,
  },
  {
    id:          'philosophy-challenge',
    slug:        'philosophy-challenge',
    name:        'Philosophy Challenge',
    description: 'Weekly deep-dives. Post your argument. Win respect.',
    category:    'PHILOSOPHY',
    iconEmoji:   '🏆',
    memberCount: 189,
    isGated:     true,
    isPinned:    true,
  },
  {
    id:          'business-networking',
    slug:        'business-networking',
    name:        'Business Networking',
    description: 'Member deals, services, and serious commerce.',
    category:    'BUSINESS',
    iconEmoji:   '💼',
    memberCount: 312,
    isGated:     true,
  },
  {
    id:          'general',
    slug:        'general',
    name:        'General',
    description: 'Open to all holders. Say hello.',
    category:    'GENERAL',
    iconEmoji:   '💬',
    memberCount: 521,
    isGated:     false,
  },
  {
    id:          'art-and-aesthetics',
    slug:        'art-and-aesthetics',
    name:        'Art & Aesthetics',
    description: 'The visual language of the collection. AI art discussions.',
    category:    'PHILOSOPHY',
    iconEmoji:   '🎨',
    memberCount: 143,
    isGated:     true,
  },
  {
    id:          'member-offers',
    slug:        'member-offers',
    name:        'Member Offers',
    description: 'Exclusive deals from TURBOMINDZ holders only.',
    category:    'BUSINESS',
    iconEmoji:   '🎁',
    memberCount: 98,
    isGated:     true,
  },
]

const CATEGORY_TABS = ['All', 'Philosophy', 'Business', 'General']

export function CommunityRooms() {
  const { data: session } = useSession()
  const isHolder = !!session // simplified — real check via useNFTOwnership

  return (
    <div>
      {/* Category Filter */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
        {CATEGORY_TABS.map(tab => (
          <button
            key={tab}
            className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium bg-void border border-border text-muted hover:text-white hover:border-electric/40 transition-colors first:bg-electric first:text-obsidian first:border-electric"
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Rooms Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ROOMS.map(room => {
          const unlocked = !room.isGated || isHolder

          return (
            <div
              key={room.id}
              className={cn(
                'relative group rounded-xl border transition-all duration-300',
                room.isPinned
                  ? 'border-gold/30 bg-midnight'
                  : unlocked
                    ? 'border-border bg-midnight hover:border-electric/30 hover:-translate-y-0.5'
                    : 'border-border bg-midnight/50'
              )}
            >
              {/* Locked Blur Overlay */}
              {!unlocked && (
                <div className="absolute inset-0 rounded-xl backdrop-blur-[2px] bg-obsidian/60 z-10 flex flex-col items-center justify-center gap-2">
                  <div className="p-3 rounded-full bg-void border border-border">
                    <Lock size={18} className="text-muted" />
                  </div>
                  <p className="text-xs text-muted font-body">NFT required to enter</p>
                  <Link
                    href="/collection/explore"
                    className="mt-1 px-4 py-1.5 rounded-lg bg-electric text-obsidian text-xs font-semibold hover:bg-electric/90 transition-colors"
                  >
                    Get Access
                  </Link>
                </div>
              )}

              {/* Pinned Badge */}
              {room.isPinned && (
                <div className="absolute -top-2.5 left-4 px-3 py-0.5 rounded-full bg-gold text-obsidian text-xs font-bold">
                  Pinned
                </div>
              )}

              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{room.iconEmoji}</span>
                    <div>
                      <h3 className="font-body font-semibold text-white text-sm">{room.name}</h3>
                      <span className="text-xs text-electric/60 uppercase tracking-wide">{room.category}</span>
                    </div>
                  </div>
                  {unlocked ? (
                    <Unlock size={14} className="text-electric mt-0.5" />
                  ) : (
                    <Lock size={14} className="text-muted mt-0.5" />
                  )}
                </div>

                <p className="text-xs text-muted leading-relaxed mb-4">{room.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-muted">
                    <span className="flex items-center gap-1">
                      <Users size={12} />
                      {room.memberCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare size={12} />
                      Live
                    </span>
                  </div>
                  {unlocked && (
                    <Link
                      href={`/community/rooms/${room.slug}`}
                      className="text-xs text-electric hover:text-electric/80 font-medium transition-colors"
                    >
                      Enter →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
