'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { Bell } from 'lucide-react'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function DropNotifyForm() {
  const { data } = useSWR('/api/drops/upcoming', fetcher)
  const [email, setEmail]     = useState('')
  const [status, setStatus]   = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!data?.drop?.id) return
    setStatus('loading')
    const res = await fetch('/api/drops/notify', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ dropId: data.drop.id, email }),
    })
    setStatus(res.ok ? 'done' : 'error')
  }

  if (status === 'done') {
    return (
      <div className="text-center py-6">
        <Bell size={24} className="text-electric mx-auto mb-3" />
        <p className="font-body text-white font-medium">You're on the list.</p>
        <p className="text-muted text-sm mt-1">We'll notify you when this drop goes live.</p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="p-6 rounded-2xl bg-midnight border border-border">
      <h3 className="font-body font-semibold text-white mb-1">Get notified</h3>
      <p className="text-muted text-sm mb-4 font-body">Be first when the drop goes live.</p>
      <div className="flex gap-2">
        <input
          type="email"
          required
          placeholder="your@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl bg-void border border-border text-white placeholder:text-muted text-sm focus:outline-none focus:border-electric/50 font-body"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-5 py-2.5 rounded-xl bg-electric text-obsidian font-semibold text-sm hover:bg-electric/90 disabled:opacity-60 transition-colors"
        >
          {status === 'loading' ? '...' : 'Notify Me'}
        </button>
      </div>
    </form>
  )
}
