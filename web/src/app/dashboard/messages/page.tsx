'use client'

import useSWR from 'swr'
import { useSession } from 'next-auth/react'
import { truncateAddress } from '@/lib/utils'
import { Bell, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

const fetcher = (url: string) => fetch(url).then(r => r.json())

const NOTIF_ICONS: Record<string, string> = {
  NEW_MESSAGE:   '💬',
  DROP_ALERT:    '⚡',
  LISTING_SOLD:  '💰',
  NEW_FOLLOWER:  '👤',
  SYSTEM:        '🔔',
}

export default function MessagesPage() {
  const { data: session } = useSession()
  const { data, isLoading, mutate } = useSWR(
    session ? `/api/notifications` : null,
    fetcher
  )

  const notifications = data?.notifications || []
  const unread = notifications.filter((n: any) => !n.isRead).length

  const markAllRead = async () => {
    await fetch('/api/notifications/read-all', { method: 'POST' })
    mutate()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-h2 font-light">Messages</h1>
          {unread > 0 && (
            <p className="text-electric text-sm mt-1 font-body">{unread} unread</p>
          )}
        </div>
        {unread > 0 && (
          <button
            onClick={markAllRead}
            className="text-xs text-muted hover:text-white transition-colors font-body"
          >
            Mark all read
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1,2,3,4].map(i => <div key={i} className="h-16 rounded-xl skeleton" />)}
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-border rounded-2xl">
          <div className="inline-flex p-4 rounded-full bg-electric/10 border border-electric/20 mb-4">
            <Bell size={24} className="text-electric" />
          </div>
          <h2 className="font-display text-2xl font-light mb-2">No notifications yet</h2>
          <p className="text-muted text-sm font-body">Activity will appear here.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n: any) => (
            <div
              key={n.id}
              className={cn(
                'flex items-start gap-4 p-4 rounded-xl border transition-colors',
                n.isRead
                  ? 'bg-midnight border-border'
                  : 'bg-midnight border-electric/20 bg-electric/2'
              )}
            >
              <span className="text-xl flex-shrink-0">
                {NOTIF_ICONS[n.type] || '🔔'}
              </span>
              <div className="flex-1 min-w-0">
                <p className={cn('text-sm font-medium', n.isRead ? 'text-white/80' : 'text-white')}>
                  {n.title}
                </p>
                {n.body && <p className="text-xs text-muted mt-0.5 line-clamp-2">{n.body}</p>}
                <p className="text-xs text-muted/50 mt-1">
                  {new Date(n.createdAt).toLocaleDateString()}
                </p>
              </div>
              {!n.isRead && (
                <div className="w-2 h-2 rounded-full bg-electric flex-shrink-0 mt-1.5" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
