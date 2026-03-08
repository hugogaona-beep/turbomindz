'use client'

import useSWR from 'swr'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { formatUsd } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { Plus, ExternalLink, Pencil, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

const fetcher = (url: string) => fetch(url).then(r => r.json())

const STATUS_STYLE: Record<string, string> = {
  ACTIVE:    'bg-green-400/10 text-green-400 border-green-400/30',
  SOLD:      'bg-electric/10 text-electric border-electric/30',
  EXPIRED:   'bg-muted/10 text-muted border-border',
  CANCELLED: 'bg-error/10 text-error border-error/30',
}

export default function MyListingsPage() {
  const { data: session } = useSession()
  const { data, isLoading, mutate } = useSWR(
    session ? `/api/listings?sellerWallet=${session.user.walletAddress}&limit=50` : null,
    fetcher
  )

  const listings = data?.listings || []

  const deleteListing = async (id: string) => {
    if (!confirm('Delete this listing?')) return
    const res = await fetch(`/api/listings/${id}`, { method: 'DELETE' })
    if (res.ok) { toast.success('Listing deleted'); mutate() }
    else toast.error('Failed to delete')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-h2 font-light">My Listings</h1>
          <p className="text-muted text-sm mt-1 font-body">{listings.length} active listing{listings.length !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/marketplace/create"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-electric text-obsidian font-semibold text-sm hover:bg-electric/90 transition-colors"
        >
          <Plus size={16} /> New Listing
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-20 rounded-xl skeleton" />)}
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-border rounded-2xl">
          <h2 className="font-display text-2xl font-light mb-2">No listings yet</h2>
          <p className="text-muted text-sm mb-6 font-body">Post a service, NFT, or business offer to the marketplace.</p>
          <Link href="/marketplace/create"
            className="px-6 py-3 rounded-xl bg-electric text-obsidian font-semibold text-sm hover:bg-electric/90 transition-colors"
          >Create Your First Listing</Link>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="border-b border-border bg-void/50">
                <th className="px-4 py-3 text-left text-xs text-muted uppercase tracking-wide">Title</th>
                <th className="px-4 py-3 text-left text-xs text-muted uppercase tracking-wide hidden md:table-cell">Type</th>
                <th className="px-4 py-3 text-left text-xs text-muted uppercase tracking-wide hidden sm:table-cell">Price</th>
                <th className="px-4 py-3 text-left text-xs text-muted uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-right text-xs text-muted uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {listings.map((l: any) => (
                <tr key={l.id} className="bg-midnight hover:bg-void/30 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-white line-clamp-1">{l.title}</p>
                    <p className="text-xs text-muted">{new Date(l.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs text-muted">{l.listingType.replace('_', ' ')}</span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="font-mono text-electric text-xs">
                      {l.priceEth ? `${l.priceEth} ETH` : l.priceUsd ? formatUsd(l.priceUsd) : '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('px-2 py-0.5 rounded-full text-xs border', STATUS_STYLE[l.status] || STATUS_STYLE.ACTIVE)}>
                      {l.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/marketplace/${l.id}`} className="p-1.5 text-muted hover:text-white transition-colors">
                        <ExternalLink size={14} />
                      </Link>
                      <button onClick={() => deleteListing(l.id)} className="p-1.5 text-muted hover:text-error transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
